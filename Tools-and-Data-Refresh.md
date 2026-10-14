# Tools and Data Refresh

Everything here runs from the repository with the Python standard library, except the PDF build (which needs `reportlab` and `pypdf`).

## County lookup page
`site/index.html` is a single offline file: pick a county, see its rating area, every PID-listed individual-market filer with 2026 approved and 2027 requested and approved rates, which filers sell on Pennie, small-group filers, Pennie's published termination rate if the county is on its top-20 list, and help numbers. It has no external scripts, fonts or network calls, is built from the validated dataset, and prints cleanly. Rebuild with `python3 src/build_lookup.py`. To host it, serve the `site/` folder (for example with GitHub Pages).

## Numbers gate
`src/numbers_gate.py FILE ...` compares every carrier percentage in a document against the validated PID table and blocks phrases we could not verify. A citation scanner cannot catch a wrong number; this can. Run it on anything before it is published. It runs in CI and in `scripts/release_check.sh`.

## Drift check
`src/refresh_check.py` compares the dataset with PID's live rate page and press release. Exit 0: no drift. Exit 1: differences listed. Exit 2: could not fetch or read the page (not a verdict; CI turns it into a warning). Fetching retries only transient failures (timeouts, connection errors, HTTP 408/425/429/5xx) with backoff and jitter, honors Retry-After, and stops at once on permanent errors such as 404. It also keeps a hash of the page text, so you are told when the page changed even if every number still matches. Use `--dump layout.txt` to see exactly what the parser extracted. Retry and comparison logic are tested against a local fake server. It has not yet been run against the live page: run it once with a saved copy (`--file`) and read the report before trusting a clean result. It flags missing filers but cannot detect brand-new ones. Update steps: `docs/DATA_UPDATE_PLAYBOOK.md` in the repository.

## Provenance log
`src/provenance.py record` stores a full SHA-256 and a UTC timestamp for each artifact; `verify` re-hashes every logged file and reports changes. A VERIFIED entry must say what primary page was read.

## Reproducibility
PDFs are built deterministically, so rebuilding gives byte-identical files on the same library versions. `MANIFEST.sha256` lists hashes of every deliverable. CI rebuilds the text outputs and fails if the committed audits or lookup page are stale.

## Known limits
- The Termux setup script and the weekly drift job have not been run on a device or against the live page by the author.
- Area-level figures are proxies (statewide shares as weights).
- Pennie terminations are the published top 20 only.
