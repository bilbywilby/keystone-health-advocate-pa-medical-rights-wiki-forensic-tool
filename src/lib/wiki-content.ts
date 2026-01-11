import { WikiArticle, WikiCategory } from "@shared/types";
export const MOCK_WIKI_ARTICLES: WikiArticle[] = [
  {
    id: "wa1",
    slug: "act-146-prior-auth",
    title: "Act 146: Prior Authorization Reform",
    category: WikiCategory.REGULATORY,
    lastUpdated: "2024-03-15",
    excerpt: "Pennsylvania's landmark law standardizing how insurers handle medical approvals.",
    content: `
# Act 146 of 2022: Prior Authorization Reform
Pennsylvania's **Act 146** was designed to streamline the prior authorization process and provide transparency for patients and providers.
## Key Provisions
1. **Electronic Portals**: Insurers must provide an electronic portal for submission.
2. **Timely Decisions**: Decisions for urgent care must be made within 48 hours.
3. **Peer-to-Peer Reviews**: Denials must be reviewed by a physician in the same or similar specialty.
## How to use this for Appeals
If your insurer denied a claim without a peer-to-peer review by a matching specialist, you can cite Section 2112 of the Insurance Company Law (as amended by Act 146).
### Copy Snippet
> "Under PA Act 146, I request documentation that this denial was reviewed by a physician in the same or similar specialty as the requesting provider."
    `
  },
  {
    id: "wa2",
    slug: "no-surprises-act-pa",
    title: "No Surprises Act (PA Supplement)",
    category: WikiCategory.FINANCIAL,
    lastUpdated: "2024-02-10",
    excerpt: "Protection against out-of-network emergency bills in the Keystone state.",
    content: `
# No Surprises Act in Pennsylvania
The Federal No Surprises Act protects you from "balance billing" for emergency services and certain services provided by out-of-network providers at in-network facilities.
## Your Rights
- You cannot be billed more than the in-network cost-sharing amount.
- Providers cannot ask you to waive these rights for emergency services.
## PA Specifics
Pennsylvania Insurance Department (PID) oversees compliance for state-regulated plans. If you receive a surprise bill, contact the PID Consumer Services Bureau.
    `
  }
];