import { WikiArticle, WikiCategory } from "@shared/types";
export const MOCK_WIKI_ARTICLES: WikiArticle[] = [
  {
    id: "wa1",
    slug: "act-146-prior-auth",
    title: "Act 146: 2026 Enforcement Updates",
    category: WikiCategory.REGULATORY,
    lastUpdated: "2026-01-02",
    excerpt: "New specialty match mandates (Section 2116) for all medical denials in PA.",
    content: `
# Act 146: Prior Authorization Enforcement (2026)
As of 2026, the Pennsylvania Insurance Department has tightened enforcement on **Section 2116** regarding peer-to-peer reviews.
## The Specialty Match Mandate
If your insurer denies a claim based on medical necessity, the reviewing physician MUST:
1. Be in the same or similar specialty as the requesting provider.
2. Hold an active license to practice medicine.
### Common Violations
- A General Practitioner denying an Oncology treatment.
- An Internist denying a specialized Surgical procedure.
### How to Dispute
Cite Section 2116 of the Insurance Company Law. Under Act 146, a specialty mismatch makes the denial procedurally invalid.
    `
  },
  {
    id: "wa2",
    slug: "hb-79-financial-assistance",
    title: "HB 79: Mandatory Screening (2026)",
    category: WikiCategory.FINANCIAL,
    lastUpdated: "2026-01-15",
    excerpt: "PA hospitals must screen all patients for assistance before debt pursuit.",
    content: `
# HB 79: Hospital Financial Assistance
PA House Bill 79 (2025) mandates that all hospitals screen patients for financial assistance eligibility if their debt exceeds 5% of household income or if income is below 400% FPL.
## Key Rights
- **Presumptive Eligibility**: Many patients now qualify automatically based on zip code or prior program enrollment.
- **Stay of Collections**: Collection actions must pause if a screening request is made.
- **400% FPL Cap**: Financial assistance is mandatory for households up to $124,800 (Family of 4).
    `
  },
  {
    id: "wa3",
    slug: "sb-371-debt-shield",
    title: "SB 371: Louisa Carman Medical Debt Shield",
    category: WikiCategory.REGULATORY,
    lastUpdated: "2026-02-01",
    excerpt: "The Medical Debt Shield Law (3% Caps & Garnishment Bans).",
    content: `
# SB 371: The Louisa Carman Act
Named after a patient advocate, SB 371 creates a "Shield" layer over all PA medical debt.
## Protections
1. **3% Interest Cap**: No medical bill or collection can accrue interest above 3.0% APR.
2. **Garnishment Ban**: Wage garnishment is prohibited for medical debt if household income is <600% FPL.
3. **Property Liens**: Hospitals are prohibited from placing liens on primary residences for medical debt under $10,000.
    `
  }
];