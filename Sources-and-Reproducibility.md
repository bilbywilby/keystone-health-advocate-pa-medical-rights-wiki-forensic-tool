# Sources and Reproducibility

## References
Centers for Medicare & Medicaid Services. (2024, September 10). *Pennsylvania geographic rating areas*. https://www.cms.gov/cciio/programs-and-initiatives/health-insurance-market-reforms/pa-gra

Hospital and Healthsystem Association of Pennsylvania. (2026, February 10). *1 in 5 Pennie enrollees dropped coverage during 2026*. https://www.haponline.org/News/HAP-News-Articles/Latest-News/1-in-5-pennie-enrollees-dropped-coverage-during-2026

Pennsylvania Health Insurance Exchange Authority. (2026a). *Terminations by county (Open Enrollment 2026), through 2.1.2026* [Data file]. https://pennie.com/wp-content/uploads/2026/02/Open-Enrollment-Comparison-2021-2026-43-Terminations-by-County-OE-2026-2.pdf

Pennsylvania Health Insurance Exchange Authority. (2026b). *Key issue: Cost of coverage* [Web page]. https://pennie.com/?p=16201

Pennie Advisory Council. (2026, April). *Meeting deck*. https://agency.pennie.com/wp-content/uploads/2026/04/April-2026-Pennie-Advisory-Council-Meeting-Final-Deck.pdf

Pennsylvania Health Law Project. (2026, August 28). *Pennie open enrollment: What's changing for 2027 coverage*. https://www.phlp.org/en/news/pennie-open-enrollment-what-s-changing-for-2027-coverage

Pennsylvania Insurance Department. (2026a). *Affordable Care Act health rate filings: 2027 plan year*. https://www.pa.gov/agencies/insurance/posted-filings-reports-company-orders/posted-product-and-rate-filings/aca-health-rate-filings

Pennsylvania Insurance Department. (2026b). *Coverage areas for 2027 individual market plans*. https://www.pa.gov/agencies/insurance/posted-filings-reports-company-orders/posted-product-and-rate-filings/aca-health-rate-filings/coverage-areas-individual-market

Pennsylvania Insurance Department. (2026c). *Coverage areas for 2027 small group market plans*. https://www.pa.gov/agencies/insurance/posted-filings-reports-company-orders/posted-product-and-rate-filings/aca-health-rate-filings/coverage-areas-small-group-market

Pennsylvania Insurance Department. (2026d). *Archived 2026 ACA health rate filings*. https://www.pa.gov/agencies/insurance/posted-filings-reports-company-orders/posted-product-and-rate-filings/aca-health-rate-filings/archived-health-insurance-rate-filings/2026-health-rate-filings

Pennsylvania Insurance Department. (2026e, September 18). *Pennsylvania Insurance Department releases Affordable Care Act 2027 health insurance rates* [Press release]. https://www.pa.gov/agencies/insurance/newsroom/pennsylvania-releases-aca-2027-health-insurance-rates

Pennsylvania Insurance Department. (2026f). *Shapiro Administration receives proposed 2027 health insurance rates* [Press release]. https://www.pa.gov/agencies/insurance/newsroom/shapiro-admin-receives-proposed-2027-health-insurance-rates

WPVI-TV. (2026, February 9). *One in five Pennie customers drop health care coverage after ACA tax credits expire*. https://6abc.com/post/pennie-customers-drop-health-care-coverage-aca-tax-credits-expire/18573782/

Access dates: October 9 to 10, 2026.

## Reproducing the one-pagers
The repository holds the validated dataset (`data/pa_ra_validated_dataset.json`), the build scripts in `src/`, nine PDFs, nine Markdown audits and a SHA-256 manifest. From the repo root:

```
pip install reportlab pypdf
python3 src/build_one_pagers.py --check
python3 src/build_one_pagers.py
python3 src/build_audits.py
python3 -m unittest discover -s tests
python3 src/numbers_gate.py wiki/*.md audits/*.md
```
The check fails loudly if the weights stop reproducing PID's averages or any area list disagrees with PID's stated rating areas.

## Version history
- v1.0, Oct. 10, 2026: first public wiki; supersedes the Sept. 8 area reports (requests only).
- v1.1, Oct. 10, 2026: one-pagers rebuilt with PID's stated reasons; nine full Markdown audits added; numbers gate and provenance log fixed.
