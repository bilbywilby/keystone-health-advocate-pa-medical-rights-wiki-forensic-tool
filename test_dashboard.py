"""Dashboard tests. stdlib unittest, so they run with either:
    python3 -m unittest discover -s tests -v
    python3 -m pytest tests -v
Set TMU_DASH_DIR if dashboard.py does not live one level above tests/."""
import contextlib
import io
import os
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, os.environ.get("TMU_DASH_DIR")
                or str(Path(__file__).resolve().parent.parent))
import dashboard as d  # noqa: E402

TOKEN = "t" * 24


class HelperTests(unittest.TestCase):
    def test_safe_name_rejects_untrusted(self):
        bad = ["", None, "../etc/passwd", "a/b", "..", ".hidden", "a b",
               "x" * 200, "a\\b", "a\x00b", "/abs"]
        for raw in bad:
            with self.subTest(raw=raw):
                self.assertIsNone(d.safe_name(raw))

    def test_safe_name_accepts_plain(self):
        for raw in ("nightly.json", "a", "dag_1-v2.yaml"):
            with self.subTest(raw=raw):
                self.assertEqual(d.safe_name(raw), raw)

    def test_safe_listdir_filters(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t)
            for n in ("good.json", ".hidden", "bad name.json"):
                (root / n).write_text("x")
            (root / "subdir").mkdir()
            self.assertEqual(d.safe_listdir(root), ["good.json"])
            self.assertEqual(d.safe_listdir(root / "missing"), [])

    def test_human_uptime(self):
        self.assertEqual(d.human_uptime(0), "0s")
        self.assertEqual(d.human_uptime(61), "1m 1s")
        self.assertEqual(d.human_uptime(90061), "1d 1h 1m 1s")

    def test_read_log_tail_and_fallback(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t)
            self.assertEqual(d.read_log(root), "")
            (root / "master.log").write_text("\n".join("m%d" % i for i in range(500)))
            (root / "x.json.log").write_text("one\ntwo\nthree\n")
            self.assertEqual(d.read_log(root, "x.json", lines=2), "two\nthree")
            self.assertTrue(d.read_log(root, "nope").endswith("m499"))
            self.assertEqual(d.read_log(root, "../x.json"), d.read_log(root))

    def test_read_log_byte_cap(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t)
            (root / "master.log").write_text("A" * 10000 + "\nlast")
            out = d.read_log(root, max_bytes=100)
            self.assertLessEqual(len(out), 100)
            self.assertTrue(out.endswith("last"))


class AppBase(unittest.TestCase):
    token = TOKEN

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        self.marker = self.root / "marker.txt"
        (self.root / "bin").mkdir()
        self.master = self.root / "bin" / "master"
        self.master.write_text('#!/bin/sh\nprintf "%s\\n" "$*" > "$TM_TEST_MARKER"\n')
        self.master.chmod(0o755)
        os.environ["TM_TEST_MARKER"] = str(self.marker)
        self.app = d.create_app(storage=self.root, token=self.token,
                                master_bin=self.master)
        self.c = self.app.test_client()
        (self.root / "dags" / "nightly.json").write_text("{}")

    def tearDown(self):
        os.environ.pop("TM_TEST_MARKER", None)
        self._tmp.cleanup()

    def auth(self, **extra):
        h = {"X-TM-Token": self.token}
        h.update(extra)
        return h

    def csrf(self):
        return self.c.get("/api/csrf-token", headers=self.auth()).get_json()["csrf"]

    def run_dag(self, dag="nightly.json", **hdrs):
        h = self.auth(**hdrs)
        h.setdefault("X-CSRF-Token", self.csrf())
        return self.c.post("/api/run", query_string={"dag": dag}, headers=h)

    def wait_marker(self, timeout=3.0):
        end = time.time() + timeout
        while time.time() < end:
            if self.marker.exists() and self.marker.read_text():
                return self.marker.read_text().strip()
            time.sleep(0.05)
        return None


class AuthTests(AppBase):
    def test_token_required_on_api(self):
        self.assertEqual(self.c.get("/api/dags").status_code, 401)
        self.assertEqual(self.c.get("/api/dags", headers={"X-TM-Token": "wrong"}).status_code, 401)
        self.assertEqual(self.c.get("/api/dags", headers=self.auth()).status_code, 200)

    def test_token_in_query_param_is_ignored(self):
        self.assertEqual(self.c.get("/api/dags", query_string={"token": TOKEN}).status_code, 401)

    def test_non_ascii_token_header_does_not_crash(self):
        r = self.c.get("/api/dags", headers={"X-TM-Token": "t\u00e9st"})
        self.assertEqual(r.status_code, 401)

    def test_logs_endpoint_requires_token(self):
        (self.root / "logs" / "master.log").write_text("hi")
        self.assertEqual(self.c.get("/logs/master.log").status_code, 401)
        self.assertEqual(self.c.get("/logs/master.log", headers=self.auth()).status_code, 200)

    def test_index_is_public_and_hardened(self):
        r = self.c.get("/")
        self.assertEqual(r.status_code, 200)
        body = r.get_data(as_text=True)
        csp = r.headers["Content-Security-Policy"]
        nonce = csp.split("script-src 'nonce-")[1].split("'")[0]
        self.assertIn('nonce="%s"' % nonce, body)
        self.assertNotIn("__NONCE__", body)
        self.assertNotIn("innerHTML", body)
        self.assertNotIn("onclick=", body)
        self.assertEqual(r.headers["X-Content-Type-Options"], "nosniff")

    def test_auth_disabled_when_no_token_configured(self):
        c = d.create_app(storage=self.root, token="", master_bin=self.master).test_client()
        self.assertEqual(c.get("/api/dags").status_code, 200)


class CsrfTests(AppBase):
    def test_post_without_csrf_rejected(self):
        r = self.c.post("/api/run", query_string={"dag": "nightly.json"}, headers=self.auth())
        self.assertEqual(r.status_code, 403)
        self.assertIsNone(self.wait_marker(0.3))

    def test_post_with_forged_csrf_rejected(self):
        good = self.csrf()
        forged = good[:-4] + ("0000" if not good.endswith("0000") else "1111")
        for tok in ("junk", "a.b.c", forged, "\u00e9.1.2"):
            with self.subTest(tok=tok):
                r = self.run_dag(**{"X-CSRF-Token": tok})
                self.assertEqual(r.status_code, 403)

    def test_expired_csrf_rejected(self):
        tok = self.csrf()
        with mock.patch.object(d, "_now", return_value=time.time() + d.CSRF_TTL + 5):
            r = self.run_dag(**{"X-CSRF-Token": tok})
        self.assertEqual(r.status_code, 403)

    def test_csrf_from_other_process_rejected(self):
        other = d.create_app(storage=self.root, token=self.token, master_bin=self.master)
        tok = other.test_client().get("/api/csrf-token", headers=self.auth()).get_json()["csrf"]
        self.assertEqual(self.run_dag(**{"X-CSRF-Token": tok}).status_code, 403)

    def test_valid_run_spawns_master(self):
        r = self.run_dag()
        self.assertEqual(r.status_code, 202)
        self.assertEqual(self.wait_marker(), "run nightly.json")

    def test_cross_origin_rejected_same_origin_ok(self):
        self.assertEqual(self.run_dag(Origin="http://evil.example").status_code, 403)
        self.assertEqual(self.run_dag(Origin="http://localhost").status_code, 202)

    def test_csrf_enforced_even_without_token_auth(self):
        c = d.create_app(storage=self.root, token="", master_bin=self.master).test_client()
        r = c.post("/api/run", query_string={"dag": "nightly.json"})
        self.assertEqual(r.status_code, 403)


class TraversalTests(AppBase):
    def test_run_rejects_bad_names(self):
        for dag in ("../../etc/passwd", "..%2fx", "a/b", ".hidden", "nope.json", ""):
            with self.subTest(dag=dag):
                self.assertEqual(self.run_dag(dag).status_code, 404)
        self.assertIsNone(self.wait_marker(0.3))

    def test_run_rejects_symlink_escape(self):
        (self.root / "outside.json").write_text("{}")
        os.symlink(self.root / "outside.json", self.root / "dags" / "link.json")
        self.assertEqual(self.run_dag("link.json").status_code, 404)

    def test_logs_rejects_bad_dag(self):
        r = self.c.get("/api/logs", query_string={"dag": "../x"}, headers=self.auth())
        self.assertEqual(r.status_code, 400)

    def test_dags_listing_hides_unsafe(self):
        (self.root / "dags" / ".secret").write_text("x")
        (self.root / "dags" / "bad name").write_text("x")
        r = self.c.get("/api/dags", headers=self.auth())
        self.assertEqual(r.get_json()["dags"], ["nightly.json"])


class MainTests(unittest.TestCase):
    def run_main(self, argv, env):
        err = io.StringIO()
        base = {k: v for k, v in os.environ.items() if k != "TM_DASHBOARD_TOKEN"}
        base.update(env)
        with mock.patch.dict(os.environ, base, clear=True), \
                contextlib.redirect_stderr(err), \
                mock.patch.object(d, "create_app") as ca:
            rc = d.main(argv)
        return rc, err.getvalue(), ca

    def test_refuses_public_bind_without_token(self):
        rc, err, ca = self.run_main(["--host", "0.0.0.0"], {})
        self.assertEqual(rc, 2)
        self.assertIn("TM_DASHBOARD_TOKEN", err)
        ca.assert_not_called()

    def test_refuses_short_token(self):
        rc, _, _ = self.run_main(["--host", "127.0.0.1"], {"TM_DASHBOARD_TOKEN": "short"})
        self.assertEqual(rc, 2)

    def test_public_bind_with_token_starts(self):
        rc, _, ca = self.run_main(["--host", "0.0.0.0", "--port", "5000"],
                                  {"TM_DASHBOARD_TOKEN": TOKEN})
        self.assertEqual(rc, 0)
        ca.return_value.run.assert_called_once_with(host="0.0.0.0", port=5000, threaded=True)

    def test_loopback_without_token_starts(self):
        rc, _, _ = self.run_main(["--port", "5001"], {})
        self.assertEqual(rc, 0)

    def test_bad_port(self):
        rc, _, _ = self.run_main(["--port", "70000"], {})
        self.assertEqual(rc, 2)


if __name__ == "__main__":
    unittest.main()
