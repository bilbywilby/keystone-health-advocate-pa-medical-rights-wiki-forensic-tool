# Methodology and Verification

This is a **descriptive cross-sectional synthesis**: counts, percentage changes, ranges and weighted averages. It does not pool studies or estimate heterogeneity.

## Evidence tiers
| Tier | Meaning | Publishable as fact? |
| :--- | :--- | :---: |
| VERIFIED | Read on a primary page (PID, Pennie, CMS) with an access date, or corroborated by two independent sources | Yes |
| DERIVED | Computed here from VERIFIED inputs; method stated | Yes, labeled |
| UNVERIFIED | Plausible but not traced to a primary source | No; bracket or omit |
| NOT FOUND | Searched for, not located as of the date given | Say "not found as of [date]" |

## Inputs
- 2027 requested and approved rates, 2026 market shares, Pennie availability, county footprints: PID's ACA rate-filing pages (PID, 2026a, 2026b, 2026c).
- 2026 approved rates and 2025 shares: PID's archived 2026 filings (PID, 2026d).
- Statewide averages and carrier reasons for above-request approvals: PID press release (PID, 2026e).
- County to rating area: CMS crosswalk (CMS, 2024), cross-checked against the rating areas PID itself names for 12 carrier filings (PID, 2026f).
- County terminations: Pennie's published top-20 list through Feb. 1, 2026 (Pennie, 2026a).

## Derived measures
- **Carrier-mix approved increase** for an area = sum(statewide prior-year market share x approved %) / sum(share), over filers serving at least one county in the area. Area-level enrollment is not published, so statewide share is a proxy weight.
- **Weight check:** the same weights reproduce PID's statewide averages: individual 2027 15.95% vs 15.97% published; small group 2027 10.28% vs 10.28%; individual 2027 requested 17.14% vs 17.14%; individual 2026 21.50% vs 21.5%.
- **Two-year compounded** = (1 + 2026 approved) x (1 + 2027 approved) - 1. Gross premium before tax credits.
- **Thin county:** two or fewer filers that sell on Pennie.

## Validation run on every build
County map is a clean 67-county, 9-area partition; every footprint county exists; area filer lists derived from county footprints match the September 8 area reports (9 of 9) and PID's stated rating areas (12 of 12 carrier filings).

## Exclusions and standing rules
- Two earlier "cross-sectional analysis" documents are quarantined: their rating-area tables do not match the CMS crosswalk.
- Text pasted from other AI tools is never accepted as ground truth; it is checked against primary pages or dropped.
- A verification script that only checks citations does not verify numbers. `src/numbers_gate.py` checks carrier percentages in any text against the validated PID dataset; it fails the legacy briefing rows listed in [Corrections and Open Items](Corrections-and-Open-Items).

## Limits
Average rate changes are across a filer's plans, before tax credits. Pennie terminations are the published top 20 only. Area averages are proxies (see above).
