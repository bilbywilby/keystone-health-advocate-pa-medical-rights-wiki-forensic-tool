#!/bin/sh
# Install the dashboard auth/CSRF patch into a repo. Idempotent; backs up first.
# Usage: ./apply.sh [--dry-run] [REPO_DIR]        (default REPO_DIR=.)
#   DASH_DEST=lib/ultra/dashboard.py ./apply.sh   # if dashboard lives elsewhere
set -eu
DRY=0
[ "${1:-}" = "--dry-run" ] && { DRY=1; shift; }
REPO="${1:-.}"
DEST="${DASH_DEST:-dashboard.py}"
HERE=$(cd "$(dirname "$0")" && pwd)
[ -d "$REPO" ] || { echo "error: no such dir: $REPO" >&2; exit 2; }
command -v python3 >/dev/null || { echo "error: python3 missing" >&2; exit 2; }
python3 -c 'import flask' 2>/dev/null || { echo "error: flask missing -> sudo apt install -y python3-flask" >&2; exit 2; }

run() { if [ "$DRY" = 1 ]; then echo "[dry-run] $*"; else "$@"; fi; }
TS=$(date +%Y%m%d%H%M%S)
if [ -f "$REPO/$DEST" ] && ! cmp -s "$HERE/dashboard.py" "$REPO/$DEST"; then
  run cp -p "$REPO/$DEST" "$REPO/$DEST.bak.$TS"
fi
run mkdir -p "$REPO/$(dirname "$DEST")" "$REPO/tests"
run cp "$HERE/dashboard.py" "$REPO/$DEST"
run cp "$HERE/tests/test_dashboard.py" "$REPO/tests/test_dashboard.py"
run chmod 755 "$REPO/$DEST"
echo "ok: installed $DEST + tests/test_dashboard.py (backup suffix .bak.$TS if one was needed)"
echo "next: cd $REPO && python3 -m unittest discover -s tests -v"
