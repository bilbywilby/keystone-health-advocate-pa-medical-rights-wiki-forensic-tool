# Pennsylvania Health Insurance Audit, Plan Year 2027

Verified-first public audit of Pennsylvania's ACA individual and small-group markets: PID-approved 2027 rates, carrier footprints, nine rating-area audits, a county lookup page for consumers, and a wiki. Version 1.1, October 10, 2026. Data as of 2026-10-10.

**This repository is public.** Everything here is meant to be read by consumers and reporters, so nothing is published as fact unless it traces to a primary page (PID, Pennie, CMS). Known errors in earlier drafts are listed in [`docs/CORRECTIONS.md`](docs/CORRECTIONS.md).

## What is in it
| Path | What |
| :--- | :--- |
| `site/index.html` | Single-file, offline county lookup (no external scripts or fonts); publishable with GitHub Pages |
| `one_pagers/` | Nine one-page PDFs, one per rating area (reproducible: same inputs give the same bytes) |
| `audits/` | Nine full rating-area audits with county-level tables |
| `wiki/` | Twelve wiki pages; publish with `scripts/install_wiki.sh` (never pushes) |
| `data/pa_ra_validated_dataset.json` | Every input figure, with source keys |
| `data/derived_area_metrics.json` | Every derived number on the pages |
| `src/` | Builders, `numbers_gate.py`, `refresh_check.py` (drift detector), `provenance.py` |
| `tests/` | Standard-library tests |
| `docs/` | Corrections register, publishing checklist, data update playbook |
| `scripts/` | Environment doctor, Termux setup, release check, wiki install, stray-file cleanup, JSON fixer |
| `.github/workflows/verify.yml` | Tests, gate and reproducibility check on every push; weekly drift check |
| `HANDOVER.json`, `MANIFEST.sha256` | State of the project and file hashes |

## Headline facts (VERIFIED: PID press release, Sept. 18, 2026)
Individual market average approved increase +15.97%; small group +10.28%; $94.7 million in requested increases denied. An average is not what each household pays.

## Quick start
```
bash scripts/termux_setup.sh             # Termux only, once
python3 scripts/doctor.py                # is this machine ready?
python3 src/build_one_pagers.py          # validates, then rebuilds the nine PDFs
python3 src/build_audits.py              # nine audits
python3 src/build_lookup.py              # site/index.html
bash scripts/release_check.sh            # tests + gates + manifest; never commits or pushes
```
`requirements.txt` pins the versions the PDFs were built with. If a pin will not install on your machine, `pip install reportlab pypdf` works but the PDF bytes may differ.

## Real-world safeguards
- **Numbers gate:** `src/numbers_gate.py` checks every carrier figure in a document against the validated PID table and blocks phrases we could not verify. Run it on anything before it is published.
- **Drift detector:** `src/refresh_check.py` compares PID's live pages with the dataset (exit 1 drift, exit 2 could not read). Run it once with a saved copy of the page before trusting a clean result.
- **Weight check:** every build confirms the weights reproduce PID's statewide averages and that area filer lists match PID's stated rating areas.
- **Human publishing:** no script commits or pushes. See `docs/PUBLISHING_CHECKLIST.md`.

## Wiki
`bash scripts/install_wiki.sh` clones `https://github.com/bilbywilby/animated-umbrella.wiki.git` if needed, copies the pages, shows the diff and prints the push command. It does not push.

## Method in one paragraph
Descriptive cross-sectional synthesis: counts, percentage changes, ranges and weighted averages. Area figures use statewide market shares as weights because area enrollment is not published. See `wiki/Methodology-and-Verification.md`.

## Not legal, medical or financial advice.
