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
1. **Mandatory Screening**: Hospitals cannot send a bill to collections without first screening the patient for financial assistance eligibility if their income is below 400% FPL.
2. **The 5% Rule**: If a medical bill exceeds 5% of a household's annual income, the hospital must offer a low-interest payment plan or financial aid.
    `
  },
  {
    id: "wa3",
    slug: "act-139-naloxone",
    title: "Act 139: Naloxone Access Law",
    category: WikiCategory.CLINICAL,
    lastUpdated: "2026-04-01",
    excerpt: "PA Standing Order allows anyone to get Naloxone at a pharmacy without a personal prescription.",
    content: `
# Act 139: Overdose Prevention Access
Pennsylvania Act 139 (David's Law) provides legal protections for those seeking help during an overdose and ensures wide access to Naloxone.
## The Standing Order
In PA, the Physician General has issued a **Statewide Standing Order**. This acts as a prescription for every resident.
- You can walk into any PA pharmacy and request Naloxone.
- Most insurance plans, including Medicaid, provide it at **$0 copay**.
- Pharmacists cannot refuse access if they have the supply in stock.
    `
  },
  {
    id: "wa4",
    slug: "hb-1754-biomarker-update",
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
    `
  }
];