# Changelog

## 1.1.1 (2026-10-10)
- `refresh_check.py`: retries only transient failures (no retry on 404/403), honors Retry-After, adds jitter, no sleep after the last attempt; page-hash change note; `--dump` and `--json`; tests against a local fake server.
- CI: a fetch failure in the weekly drift job is a warning; real drift still fails.
- `install_wiki.sh`: prints the actual wiki branch in the publish command.

## 1.1.1 (2026-10-10)
- Offline county lookup page (`site/index.html`), tested against the dataset for all 67 counties.
- `refresh_check.py` drift detector and weekly GitHub workflow; `doctor.py`, Termux setup script.
- Reproducible PDFs (fixed timestamps); `build_audits.py` regenerates the audits index; pinned requirements.
- Data update playbook; `install_wiki.sh` clones the wiki repository when missing.

## 1.1.0 (2026-10-10)
- Resilience: deterministic PDFs, weekly drift check against PID (`refresh_check.py`), CI that blocks stale outputs and wrong numbers, stdlib-only builds for everything except the PDFs, wiki installer that pulls before copying and never pushes.
- Application: offline county lookup page (`site/index.html`), data update playbook, Termux setup script.
- Complete repository: nine one-page PDFs, nine full audits, eleven wiki pages, validated dataset, tests.
- One-pagers now print PID's stated reasons for above-request approvals (PID press release, Sept. 18, 2026).
- Added `numbers_gate.py`: checks carrier percentages against the validated PID table and blocks unverified phrases.
- Rewrote `provenance.py`: full SHA-256, per-entry timestamps, `verify` command, VERIFIED requires notes.
- Replaced `HANDOVER.json` (old file was not valid JSON). Added corrections register.

## 1.0.0 (2026-10-10)
- First wiki and one-pager release; supersedes the Sept. 8 area reports, which carried requests only.
