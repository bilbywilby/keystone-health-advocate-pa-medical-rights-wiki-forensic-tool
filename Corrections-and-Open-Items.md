# Corrections and Open Items

Checked October 10, 2026 against PID's rate page and press release (PID, 2026a, 2026e). Until these are fixed, do not publish the briefing HTML, the Executive Briefing or the Rate Analysis Matrix as "verified."

| Where | What it says | What the primary source says |
| :--- | :--- | :--- |
| Briefing slide, carrier table | Health Partners Plans shown 11.20% to 13.50% | PID: 15.90% requested, 18.35% approved (+2.45 pts) |
| Briefing slide, carrier table | Ambetter shown 22.00% to 18.50% | PID: 40.90% requested, 35.13% approved (-5.77 pts) |
| Briefing slide, carrier table | Highmark Benefits Group shown 12.50% to 10.10% | PID: 21.40% requested, 19.66% approved (-1.74 pts) |
| Briefing slide, carrier table | Oscar requested shown 8.00% | PID: 15.39% requested, 1.38% approved |
| Briefing slide, two-year view | Keystone East 30.0%; Ambetter 35.3% | Computed from PID: Keystone East +41.5%; Ambetter +86.3% |
| Briefing, release date | Sept. 19, 2026 | PID release is dated Sept. 18, 2026 |
| Briefing, reinsurance slide | $600M reinsurance funding deficit | No source. The only ~$600M figure in project files is the annual federal enhanced-credit value lost (August status report). PID lists a 1332-waiver reinsurance page (Act 42); not read. UNVERIFIED |
| Briefing and Executive Briefing | Ambetter removed Bronze for 2027; 17.4% extra hike | No source found. The verified bronze fact is statewide: about 33,000 more bronze selections for 2026. UNVERIFIED |
| Briefing and Executive Briefing | 417,158 paid enrollees; 84.0% retention; ~203,000 gross terminations | No source seen; selections vs effectuated is not like-for-like. UNVERIFIED |
| Briefing and Executive Briefing | All three above-request approvals due to sicker pools, CMS transfers | PID says risk adjustment only for Health Partners Plans; Keystone East and QCC cited worsening medical and drug trends. Transfer dollar figures not verified |
| Briefing | Lehigh Valley (RA6) spikes due to hospital pricing | No source; RA6 filers range +1.38% to +33.39% |
| Briefing, vertical integration | Integrated systems show pricing stability | No source; UPMC Health Options was +20.18% and UPMC Health Plan +24.78% for 2026 |
| Rate Analysis Matrix | Area 8 'up to 14 active options' | PID lists 8 filers (7 on Pennie) in Area 8 |
| Rate Analysis Matrix | Areas 2 and 9 labeled 'rural structural failure' | Areas 2 and 9 have 4 to 5 on-Pennie filers in every county. Thin counties are in Areas 1 and 4 |
| Rate Analysis Matrix | UPMC row mixes UPMC Health Plan 2026 (+24.78%) with Network 2027 and share | UPMC Health Network 2026 was +20.18% |
| carrier_rates.csv | share26 column (Ambetter 18.5, Keystone Central 8.2, HPP 7.8) | PID 2026 shares: 6.47, 0.16, 9.00 |
| verify_cms.sh | Checks Lehigh and Northampton under Rating Area 7 | They are Rating Area 6 (CMS; PID names areas 6, 7, 9 for Keystone Central) |
| HANDOVER.json, Twi | HANDOVER.json is not valid JSON; Twi is a stray 20 KB copy | Strip the markdown fence, validate, remove Twi |
| data/pa_ra_dataset.json | Two different files shared this name (17,846 bytes in the old repo; 25,839 in the release) | Only data/pa_ra_validated_dataset.json is validated here |
| August status report | 2026 table: Highmark Benefits Group 21.0%; 'Jefferson Health Plans PPO' 20.5%; 177,000 'net' loss | PID 2026: 18.37% for HBG; the 20.5% row is a 2027 request; 497,000 to 431,270 is 65,730 net. It also excluded the 33,000 bronze figure, which Pennie did publish |
| v1.0 one-pager PDFs | Said PID's reasons for above-request approvals were UNVERIFIED | PID stated them; fixed in v1.1 (PDFs rebuilt) |

## Open items
1. Rebuild the briefing from the PID table in [Statewide Rate Actions](PY2027-Statewide-Rate-Actions), not from the earlier drafts.
2. Source or drop every UNVERIFIED row above.
3. Confirm whether Ambetter changed its Bronze offering for 2027 (plan-level exhibits in its SERFF filing).
4. Read PID's decision summaries for Health Partners Plans, Keystone East and QCC.
5. Re-verify Act 146 and Article XXI text on palegis.us before relying on them.
6. Confirm where Highmark Coverage Advantage enrollees moved for 2027.
