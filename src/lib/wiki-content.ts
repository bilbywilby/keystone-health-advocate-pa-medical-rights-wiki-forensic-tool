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
### Advocacy Template Logic
When filing an appeal for [[SERVICE_NAME]] denied on [[DENIAL_DATE]], ensure you request the NPI and specialty of the reviewing doctor.
    `
  },
  {
    id: "wa5",
    slug: "clinical-appeal-framework",
    title: "Clinical Appeal Framework (Act 146)",
    category: WikiCategory.PROCEDURAL,
    lastUpdated: "2026-05-10",
    excerpt: "A step-by-step framework for overturning medical necessity denials using PA-specific peer review laws.",
    content: `
# Clinical Appeal Framework
Use this framework to dispute denials labeled "Not Medically Necessary."
## Step 1: Demand the Specialty Match
Under **PA §991.2116**, demand to know if the reviewer has the same credentials as your treating physician, [[ORDERING_PHYSICIAN]].
## Step 2: Scientific Evidence Citation
Insurers must cite the specific clinical guideline used. If they cite an internal policy, demand the peer-reviewed literature that supports that policy.
## Step 3: The 15-Day Clock
For internal appeals in PA, insurers generally have **15 days** for pre-service denials. If they miss this window, they may be in violation of prompt-review standards.
    `
  },
  {
    id: "wa6",
    slug: "no-surprises-dispute",
    title: "No Surprises Act: ER Dispute SOP",
    category: WikiCategory.REGULATORY,
    lastUpdated: "2026-05-12",
    excerpt: "Detailed walkthrough for disputing out-of-network emergency bills in Pennsylvania.",
    content: `
# No Surprises Act: Balance Billing Dispute
If you received an OON bill for an ER visit at [[FACILITY_NAME]], follow this SOP.
## The Federal Protection
The Federal No Surprises Act (NSA) protects you from "balance billing" for emergency services.
- You should only pay your **In-Network** cost-sharing amount.
- Any amount above [[IN_NETWORK_COPAY]] is likely illegal.
## PA Specific Integration
PA Act 6 further strengthens these protections by requiring providers to accept the "Qualified Payment Amount" (QPA) as payment in full from the insurer for emergency stabilization.
    `
  },
  {
    id: "wa7",
    slug: "pharmacy-tier-exception",
    title: "Act 77: Tier Exception Requests",
    category: WikiCategory.FINANCIAL,
    lastUpdated: "2026-05-15",
    excerpt: "How to move a medication from a high-cost tier to a lower copay tier using PA transparency laws.",
    content: `
# Pharmacy Tier Exception SOP
If [[DRUG_NAME]] is placed on a "Specialty Tier" (Tier 4/5) with a high coinsurance, you can request a Tier Exception.
## Criteria for Success
1. **Clinical Superiority**: Your doctor must document why lower-tier drugs are ineffective.
2. **Act 77 Rebate Audit**: Under PA Act 77, if the PBM is receiving a significant rebate for the drug, that rebate must be considered in the "Lesser Of" pricing calculation.
## The Request
Formally request that the drug be covered at the **Tier 3 (Preferred Brand)** copay level.
    `
  }
];