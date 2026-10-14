#!/usr/bin/env python3
"""
Termux Master Ultra - dashboard (hardened: token auth, CSRF, safe names).

Environment:
  MASTER_STORAGE       storage root            (default ~/.termux_master)
  MASTER_BIN           master CLI to invoke    (default $MASTER_STORAGE/bin/master)
  MASTER_DASH_HOST     bind address            (default 127.0.0.1)
  MASTER_DASH_PORT     bind port               (default 8080)
  TM_DASHBOARD_TOKEN   if set (>=16 chars), every request except GET / must send
                       header "X-TM-Token: <token>". Header only - never a query
                       param, those end up in access logs.

Rules:
  * Non-loopback --host without TM_DASHBOARD_TOKEN: refuses to start (exit 2).
  * Every state-changing request needs a signed, expiring X-CSRF-Token
    (GET /api/csrf-token) and, if the browser sends Origin, it must match Host.
  * DAG / log names are untrusted: strict allowlist + resolve() containment.

Exit codes: 0 ok, 1 runtime failure, 2 bad configuration.
"""
import argparse
import hashlib
import hmac
import logging
import os
import re
import secrets
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import urlsplit

from flask import Flask, Response, jsonify, request, send_from_directory

__version__ = "0.2.0"

log = logging.getLogger("tmu.dashboard")

NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
LOOPBACK = ("127.0.0.1", "::1", "localhost")
MIN_TOKEN_LEN = 16
CSRF_TTL = 3600  # seconds
SAFE_METHODS = ("GET", "HEAD", "OPTIONS")


def _now():
    return time.time()


# --------------------------------------------------------------------------
# helpers (pure, unit-tested)
# --------------------------------------------------------------------------
def safe_name(raw):
    """Return raw if it is a plain, safe file name, else None."""
    if not raw or not isinstance(raw, str):
        return None
    if raw != os.path.basename(raw) or ".." in raw:
        return None
    return raw if NAME_RE.match(raw) else None


def resolve_in_dir(base, raw):
    """Resolve an untrusted name to an existing regular file directly inside
    base. Symlinks that escape base are rejected. Returns Path or None."""
    name = safe_name(raw)
    if name is None:
        return None
    root = Path(base).resolve()
    cand = (root / name).resolve()
    if cand.parent != root or not cand.is_file():
        return None
    return cand


def safe_listdir(path):
    try:
        return sorted(
            p.name for p in Path(path).iterdir()
            if p.is_file() and safe_name(p.name) is not None
        )
    except OSError:
        return []


def read_log(logs_dir, dag_name=None, lines=200, max_bytes=256 * 1024):
    """Tail of <dag>.log (falls back to master.log). Reads only the last
    max_bytes so a huge log cannot exhaust memory."""
    path = None
    if dag_name:
        path = resolve_in_dir(logs_dir, dag_name + ".log")
    if path is None:
        path = resolve_in_dir(logs_dir, "master.log")
    if path is None:
        return ""
    try:
        with path.open("rb") as f:
            f.seek(0, os.SEEK_END)
            size = f.tell()
            f.seek(max(0, size - max_bytes))
            data = f.read().decode("utf-8", errors="replace")
    except OSError as exc:
        log.warning("read_log failed: %s", exc)
        return "Error reading log"
    return "\n".join(data.splitlines()[-lines:])


def human_uptime(seconds):
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    d, h = divmod(h, 24)
    parts = []
    if d:
        parts.append("%dd" % d)
    if h:
        parts.append("%dh" % h)
    if m:
        parts.append("%dm" % m)
    parts.append("%ds" % s)
    return " ".join(parts)


# --------------------------------------------------------------------------
# HUD (no innerHTML, no inline handlers; CSP nonce is injected per request)
# --------------------------------------------------------------------------
INDEX_HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Termux Master Ultra</title>
<style nonce="__NONCE__">
:root{color-scheme:dark}
body{font-family:system-ui,Roboto,Arial,sans-serif;margin:0 auto;padding:14px;max-width:900px;background:#0f1720;color:#e6eef3}
h1{font-size:1.25rem;margin:0 0 8px}
.card{background:#0b1220;padding:12px;border-radius:8px;margin:10px 0}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:6px 0;border-bottom:1px solid #1f2937}
.name{word-break:break-all;flex:1 1 180px}
button,input{padding:8px 12px;border-radius:6px;border:1px solid #1f2937;background:#111827;color:#fff;font-size:1rem}
pre{white-space:pre-wrap;overflow:auto;max-height:50vh;margin:0;font-size:.8rem}
.muted{color:#8aa0b4}
</style>
</head>
<body>
<h1>Termux Master Ultra</h1>
<div class="card" id="auth" hidden>
  <label for="tok">Dashboard token</label>
  <input id="tok" type="password" autocomplete="off">
  <button id="unlock" type="button">Unlock</button>
</div>
<div class="card"><strong>System</strong><div id="sys" class="muted">Loading...</div></div>
<div class="card"><strong>DAGs</strong><div id="dags" class="muted">Loading...</div><div id="msg" class="muted" role="status"></div></div>
<div class="card"><strong id="logtitle">Logs</strong><pre id="logs"></pre></div>
<script nonce="__NONCE__">
(function () {
  'use strict';
  const $ = function (id) { return document.getElementById(id); };
  let token = sessionStorage.getItem('tm_token') || '';
  let csrf = '';
  let locked = false;

  function lock() {
    locked = true; token = ''; sessionStorage.removeItem('tm_token');
    $('auth').hidden = false;
  }
  async function api(path, opts) {
    opts = opts || {};
    const h = Object.assign({}, opts.headers);
    if (token) h['X-TM-Token'] = token;
    opts.headers = h;
    const r = await fetch(path, opts);
    if (r.status === 401) { lock(); throw new Error('unauthorized'); }
    return r;
  }
  async function getCsrf(force) {
    if (csrf && !force) return csrf;
    const r = await api('/api/csrf-token');
    csrf = (await r.json()).csrf;
    return csrf;
  }
  async function post(path) {
    let r;
    for (let i = 0; i < 2; i++) {  // one transparent retry on expired CSRF
      r = await api(path, { method: 'POST', headers: { 'X-CSRF-Token': await getCsrf(i > 0) } });
      if (r.status !== 403) break;
    }
    return r;
  }
  const pct = function (v) { return v == null ? 'n/a' : v + '%'; };

  async function loadSys() {
    const j = await (await api('/api/sys')).json();
    $('sys').textContent = 'CPU: ' + pct(j.cpu_percent) + ' | Mem: ' + pct(j.mem_percent) + ' | Uptime: ' + (j.uptime || 'n/a');
  }
  async function loadLogs(name) {
    const url = '/api/logs' + (name ? '?dag=' + encodeURIComponent(name) : '');
    const r = await api(url);
    $('logs').textContent = await r.text();
    $('logtitle').textContent = name ? 'Logs: ' + name : 'Logs';
  }
  async function runDag(name) {
    try {
      const r = await post('/api/run?dag=' + encodeURIComponent(name));
      const j = await r.json();
      $('msg').textContent = j.message || j.error || ('HTTP ' + r.status);
    } catch (e) { $('msg').textContent = 'Request failed'; }
  }
  function button(label, fn) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label; b.addEventListener('click', fn);
    return b;
  }
  async function loadDags() {
    const j = await (await api('/api/dags')).json();
    const box = $('dags');
    box.replaceChildren();
    if (!j.dags.length) {
      const em = document.createElement('em');
      em.textContent = 'No DAG files found in dags/';
      box.appendChild(em);
      return;
    }
    j.dags.forEach(function (name) {
      const row = document.createElement('div'); row.className = 'row';
      const label = document.createElement('span'); label.className = 'name'; label.textContent = name;
      row.append(label, button('Run', function () { runDag(name); }), button('Log', function () { loadLogs(name); }));
      box.appendChild(row);
    });
  }
  function guard(fn) { return async function () { if (locked) return; try { await fn(); } catch (e) {} }; }
  const tickSys = guard(loadSys), tickDags = guard(loadDags), tickLogs = guard(function () { return loadLogs(null); });

  $('unlock').addEventListener('click', function () {
    token = $('tok').value.trim(); $('tok').value = '';
    sessionStorage.setItem('tm_token', token);
    csrf = ''; locked = false; $('auth').hidden = true;
    tickSys(); tickDags(); tickLogs();
  });
  setInterval(tickSys, 2000);
  setInterval(tickDags, 5000);
  tickSys(); tickDags(); tickLogs();
})();
</script>
</body>
</html>
"""


# --------------------------------------------------------------------------
# app factory
# --------------------------------------------------------------------------
def create_app(storage=None, token=None, master_bin=None):
    storage = Path(storage or os.environ.get("MASTER_STORAGE")
                   or (Path.home() / ".termux_master"))
    token = (os.environ.get("TM_DASHBOARD_TOKEN", "") if token is None else token).strip()
    dags_dir = storage / "dags"
    logs_dir = storage / "logs"
    master_bin = Path(master_bin or os.environ.get("MASTER_BIN")
                      or (storage / "bin" / "master"))
    for p in (dags_dir, logs_dir):
        p.mkdir(parents=True, exist_ok=True, mode=0o700)

    csrf_secret = secrets.token_bytes(32)  # per process, never persisted

    def sign(payload):
        return hmac.new(csrf_secret, payload.encode(), hashlib.sha256).hexdigest()

    def mint_csrf():
        payload = "%s.%d" % (secrets.token_hex(8), int(_now()))
        return payload + "." + sign(payload)

    def csrf_ok(tok):
        try:
            nonce, ts, sig = tok.split(".")
            age = _now() - int(ts)
        except ValueError:
            return False
        good = hmac.compare_digest(sig.encode(), sign(nonce + "." + ts).encode())
        return good and 0 <= age <= CSRF_TTL

    app = Flask(__name__, static_folder=None)
    app.config["MAX_CONTENT_LENGTH"] = 64 * 1024

    @app.before_request
    def gate():
        path = request.path
        if not (path.startswith("/api/") or path.startswith("/logs/")):
            return None  # "/" serves static HTML only; everything else 404s
        if token:
            sent = request.headers.get("X-TM-Token", "")
            if not hmac.compare_digest(sent.encode(), token.encode()):
                log.warning("auth failure: %s %s from %s",
                            request.method, path, request.remote_addr)
                return jsonify(error="unauthorized"), 401
        if request.method not in SAFE_METHODS:
            origin = request.headers.get("Origin")
            if origin and urlsplit(origin).netloc != request.host:
                log.warning("origin mismatch: %s", origin)
                return jsonify(error="bad origin"), 403
            if not csrf_ok(request.headers.get("X-CSRF-Token", "")):
                log.warning("csrf failure: %s %s", request.method, path)
                return jsonify(error="csrf token missing or invalid"), 403
        return None

    @app.after_request
    def harden(resp):
        resp.headers.setdefault("X-Content-Type-Options", "nosniff")
        resp.headers.setdefault("X-Frame-Options", "DENY")
        resp.headers.setdefault("Referrer-Policy", "no-referrer")
        resp.headers["Cache-Control"] = "no-store"
        return resp

    @app.route("/")
    def index():
        nonce = secrets.token_urlsafe(16)
        resp = Response(INDEX_HTML.replace("__NONCE__", nonce), mimetype="text/html")
        resp.headers["Content-Security-Policy"] = (
            "default-src 'none'; script-src 'nonce-%s'; style-src 'nonce-%s'; "
            "connect-src 'self'; base-uri 'none'; form-action 'none'; "
            "frame-ancestors 'none'" % (nonce, nonce))
        return resp

    @app.route("/api/csrf-token")
    def api_csrf():
        return jsonify(csrf=mint_csrf())

    @app.route("/api/dags")
    def api_dags():
        return jsonify(dags=safe_listdir(dags_dir))

    @app.route("/api/logs")
    def api_logs():
        raw = request.args.get("dag")
        if raw is not None and safe_name(raw) is None:
            return jsonify(error="invalid dag name"), 400
        return Response(read_log(logs_dir, raw), mimetype="text/plain")

    @app.route("/logs/<path:filename>")
    def serve_log_file(filename):
        path = resolve_in_dir(logs_dir, filename)
        if path is None:
            return jsonify(error="not found"), 404
        return send_from_directory(str(logs_dir), path.name, mimetype="text/plain")

    @app.route("/api/run", methods=["POST"])
    def api_run():
        path = resolve_in_dir(dags_dir, request.args.get("dag"))
        if path is None:
            return jsonify(error="unknown or invalid dag"), 404
        if not (master_bin.is_file() and os.access(str(master_bin), os.X_OK)):
            log.error("master CLI missing or not executable: %s", master_bin)
            return jsonify(error="master CLI unavailable"), 500
        try:
            subprocess.Popen(  # list argv, never shell=True
                [str(master_bin), "run", path.name],
                stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL, start_new_session=True, close_fds=True)
        except OSError as exc:
            log.error("spawn failed: %s", exc)
            return jsonify(error="failed to start run"), 500
        log.info("run triggered: %s", path.name)
        return jsonify(message="Triggered run: " + path.name), 202

    @app.route("/api/sys")
    def api_sys():
        try:
            import psutil
        except ImportError:
            return jsonify(error="psutil not available"), 500

        def probe(fn):  # Android may deny /proc reads; degrade per metric
            try:
                return fn()
            except Exception:
                return None
        boot = probe(psutil.boot_time)
        return jsonify(
            cpu_percent=probe(lambda: psutil.cpu_percent(interval=0.1)),
            mem_percent=probe(lambda: psutil.virtual_memory().percent),
            uptime=human_uptime(_now() - boot) if boot else None)

    return app


def main(argv=None):
    ap = argparse.ArgumentParser(description="Termux Master Ultra dashboard")
    ap.add_argument("--host", default=os.environ.get("MASTER_DASH_HOST", "127.0.0.1"))
    ap.add_argument("--port", type=int, default=os.environ.get("MASTER_DASH_PORT", "8080"))
    ap.add_argument("--version", action="version", version=__version__)
    args = ap.parse_args(argv)
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s")

    token = os.environ.get("TM_DASHBOARD_TOKEN", "").strip()
    if not 1 <= args.port <= 65535:
        print("error: port out of range", file=sys.stderr)
        return 2
    if token and len(token) < MIN_TOKEN_LEN:
        print("error: TM_DASHBOARD_TOKEN must be >= %d chars. Generate one:\n"
              "  python3 -c 'import secrets; print(secrets.token_urlsafe(24))'"
              % MIN_TOKEN_LEN, file=sys.stderr)
        return 2
    if args.host not in LOOPBACK and not token:
        print("error: refusing to bind %s without TM_DASHBOARD_TOKEN" % args.host,
              file=sys.stderr)
        return 2
    if not token:
        log.warning("auth DISABLED (no TM_DASHBOARD_TOKEN); loopback only")
    try:
        app = create_app(token=token)
    except OSError as exc:
        print("error: cannot prepare storage: %s" % exc, file=sys.stderr)
        return 2
    try:
        app.run(host=args.host, port=args.port, threaded=True)
    except OSError as exc:
        print("error: cannot start server: %s" % exc, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
