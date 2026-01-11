import { WikiArticle, WikiCategory } from "@shared/types";
export const MOCK_WIKI_ARTICLES: WikiArticle[] = [
  {
    id: "wa1",
    slug: "act-146-prior-auth",
    title: "Act 146: Specialty Review Mandates",
    category: WikiCategory.REGULATORY,
    lastUpdated: "2026-02-15",
    excerpt: "Section 2116 requires that medical denials be issued by peer physicians in the same specialty.",
    content: `
# Act 146: Clinical Review Transparency
Pennsylvania Act 146 establishes strict standards for how insurers deny medical care.
## Section 2116: The Specialty Match
The most powerful tool for patients is the **Specialty Match Mandate**. Under §991.2116, any denial of medical necessity MUST be reviewed and signed by a physician who:
1. Is in the same or similar specialty as the physician who ordered the service.
2. Holds an active, unrestricted license.
### Why This Matters
If an Orthopedic Surgeon orders an MRI for a complex spinal issue, a General Practitioner at the insurance company cannot legally deny it. They must have an Orthopedic specialist review the file.
### How to use the Tool
Use our [Appeal Generator](/appeal-generator?type=PRIOR_AUTH) to cite §991.2116 if your denial letter shows a mismatch in reviewer specialty.
    `
  },
  {
    id: "wa2",
    slug: "hb-79-financial-assistance",
    title: "HB 79 & SB 752: Debt Protection",
    category: WikiCategory.FINANCIAL,
    lastUpdated: "2026-02-10",
    excerpt: "Mandatory assistance screening for households under 400% FPL at all PA hospitals.",
    content: `
# HB 79: Mandatory Screening
Pennsylvania House Bill 79 (2025) and SB 752 (2026) fundamentally changed medical debt collection.
## Key Provisions
1. **Mandatory Screening**: Hospitals cannot send a bill to collections without first screening the patient for financial assistance eligibility if their income is below 400% FPL ($124,800 for a family of 4).
2. **The 5% Rule**: If a medical bill exceeds 5% of a household's annual income, the hospital must offer a low-interest payment plan or financial aid.
3. **Stay of Collections**: During the screening process, all collection activities must stop.
### Non-Profit Enforcement
SB 752 specifically targets non-profit facilities (like UPMC and AHN). If they violate these screening mandates, their ability to place liens on property is revoked for that debt.
Use the [Financial Defense Tool](/tools) to check your eligibility.
    `
  },
  {
    id: "wa3",
    slug: "act-6-lyme-coverage",
    title: "Act 6: Chronic Lyme Disease Mandate",
    category: WikiCategory.CLINICAL,
    lastUpdated: "2026-01-20",
    excerpt: "Mandatory coverage for long-term antibiotic therapy for Lyme disease in PA.",
    content: `
# Act 6: Lyme Disease Coverage
Pennsylvania has one of the highest rates of Lyme disease in the country. Act 6 mandates comprehensive coverage for its treatment.
## Legal Requirements
Health policies in PA must provide coverage for:
- Diagnostic testing.
- Long-term antibiotic therapy (IV or oral) for chronic Lyme disease when ordered by a licensed physician.
## Disputes
Insurers often deny long-term antibiotics as "experimental." Act 6 overrides this by stating that if a physician determines it is medically necessary, the insurer MUST cover it.
Cite **PA Act 6 of 2020** in your [Appeal Letter](/appeal-generator?type=LYME_COVERAGE).
    `
  },
  {
    id: "wa4",
    slug: "hb-1754-biomarker-testing",
    title: "HB 1754: Biomarker Access Law",
    category: WikiCategory.CLINICAL,
    lastUpdated: "2026-03-01",
    excerpt: "Insurers must cover biomarker testing for cancer and chronic illness treatments.",
    content: `
# HB 1754: Precision Medicine Access
Effective 2025, Pennsylvania House Bill 1754 requires insurers to cover biomarker testing when it is supported by medical and scientific evidence.
## What is covered?
- Genetic testing for cancer treatment selection.
- Biomarker tests for inflammatory and rare diseases.
- Tests required for FDA-approved "companion diagnostics."
## Denials
If your biomarker test was denied as "not medically necessary," the insurer may be violating HB 1754. Use the [Appeal Generator](/appeal-generator?type=BIOMARKER_TESTING) to dispute.
    `
  }
];