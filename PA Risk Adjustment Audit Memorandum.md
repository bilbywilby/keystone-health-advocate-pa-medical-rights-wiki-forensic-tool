# Pennsylvania Health Insurance Audit: Plan Year 2027 Risk Adjustment Transfer & Regulatory Reconciliation Memorandum

**Date:** October 13, 2026  
**Subject:** Empirical Reconciliation of CMS Benefit Year 2025 Risk Adjustment Transfers with Pennsylvania Insurance Department (PID) Plan Year 2027 Rate Approvals  
**Classification:** Actuarial & Regulatory Audit Framework  

---

## 1. Executive Summary

This memorandum synthesizes empirical data extracted from the official **CMS Summary Report on Risk Adjustment Transfers for the 2025 Benefit Year** with the Pennsylvania Insurance Department's (PID) Plan Year 2027 rate review decisions. By cross-referencing carrier-reported risk transfer payments against PID's stated justifications for above-request rate approvals, this audit reconciles public regulatory narratives with federal market-sharing mechanics. 

Key empirical findings indicate that major net risk recipients—specifically **Keystone Health Plan East (KHPE)** and **QCC Insurance Company**—align directly with PID's "worsening morbidity" rationales. Conversely, certain carrier claims and omissions (such as Health Partners Plans and Ambetter/Pennsylvania Health & Wellness) reveal significant divergences between experience-period risk pools and projected rate-filing assumptions.

---

## 2. Empirical CMS Risk Adjustment Transfer Data (PA Individual Market)

Under the Affordable Care Act's permanent risk adjustment program codified in 42 U.S.C. § 18063, transfers are executed to neutralize the financial disincentives of enrolling higher-risk populations. In the dataset extracted from CMS (Benefit Year 2025), negative values denoted in parentheses represent **net recipients** (issuers with higher-than-average risk scores who receive transfer payments), while positive values represent **net payers**.

| HIOS ID | Carrier / Issuer Legal Entity | Market Segment | Net Transfer Amount (USD) | Actuarial Risk Standing |
| :--- | :--- | :--- | :--- | :--- |
| **33871** | Keystone Health Plan East (KHPE) | Individual | $(\$41,437,759.64)$ | Large Net Recipient (Sicker risk pool) |
| **16322** | UPMC Health Options | Individual | $(\$5,907,897.10)$ | Moderate Net Recipient |
| **31609** | QCC Insurance Company | Individual | $(\$3,737,261.86)$ | Net Recipient |
| **53789** | Keystone Health Plan Central | Individual | $(\$1,497,202.91)$ | Minor Net Recipient |
| **75729** | Geisinger Quality Options | Individual | $\$6,986,094.63$ | Net Payer |
| **45127** | Capital Advantage Assurance | Individual | $\$12,376,243.89$ | Net Payer |
| **79962** | Highmark Benefits Group | Individual | $\$24,672,740.97$ | Large Net Payer |

---

## 3. Carrier-by-Carrier Reconciliation & Regulatory Verification

### 3.1 Keystone Health Plan East (KHPE)
* **PID Approval Rationale:** Requested $14.7\%$ $\rightarrow$ Approved $16.0\%$ due to worsening medical and drug trends.
* **CMS Transfer Evidence:** KHPE is confirmed as the state's **largest net risk adjustment recipient**, drawing $(\$41.4 \times 10^6)$ from the risk pool.
* **Audit Verdict:** **VERIFIED ($\checkmark$)**. Federal transfer data fully substantiates the presence of an adverse, high-morbidity risk pool. The intra-family divergence between KHPE (HMO drawing $\$41.4\text{M}$) and sister PPO entity QCC (drawing $\$3.7\text{M}$) reflects distinct network utilization patterns within the Independence Blue Cross footprint.

### 3.2 QCC Insurance Company
* **PID Approval Rationale:** Requested $19.9\%$ $\rightarrow$ Approved $21.3\%$ due to worsening morbidity and drug cost escalation.
* **CMS Transfer Evidence:** Confirmed net recipient status at $(\$3.74 \times 10^6)$. Holding approximately $5.49\%$ market share, the transfer amount is highly material to its single risk pool balance.
* **Audit Verdict:** **VERIFIED ($\checkmark$)**. Risk adjustment flows corroborate the actuarial justification for above-request approval.

### 3.3 Health Partners Plans (HPP / Jefferson Health Plans)
* **PID Approval Rationale:** Requested $15.9\%$ $\rightarrow$ Raised by PID to $18.3\%$ to cover "less healthy membership confirmed through the federal risk adjustment program."
* **CMS Transfer Evidence:** HPP (HIOS ID $93909$) does not appear in the Pennsylvania individual market risk adjustment transfer table within the primary CMS individual market extract, operating primarily in small group segments or below individual reporting thresholds.
* **Audit Verdict:** **UNVERIFIED ($?$)**. Public CMS data cannot corroborate HPP's individual market morbidity claim. PID's adjustment likely relies on internal statutory filings or small-group risk pools not captured in the public individual market transfer report.

### 3.4 Oscar Health Plan of PA (The Small-Baseline Anomaly)
* **PID Approval Rationale:** Requested $15.39\%$ $\rightarrow$ Approved $1.38\%$ (a $14$-point regulatory cut).
* **Filing Context:** Experience-period baseline of only $1,347$ members, which significantly outperformed enrollment projections and generated excess premium reserves.
* **Audit Verdict:** **EXPLAINABLE ($\checkmark$)**. The rate suppression is a mechanical consequence of small-sample actuarial variance rather than structural market arbitrage.

### 3.5 Ambetter Health / Pennsylvania Health & Wellness
* **Filing Claim:** Cited a $19.2\%$ premium impact from worsening single risk pool morbidity relative to the broader Pennsylvania market alongside third-party fraud remediation costs.
* **CMS Transfer Evidence:** Centene's legal entity was charged a substantial net obligation in adjacent reporting metrics, classifying it among the state's healthiest risk-adjusted populations during the experience period.
* **Audit Verdict:** **INVERTED ($!$)**. Experience-period data contradicts the *relative* morbidity claim. Ambetter's filing arguments rely entirely on forward-looking projections of post-subsidy-cliff deterioration rather than historical transfer experience.

---

## 4. Methodological Recommendations for Future Audits

1. **Mandatory Disaggregation of Risk Transfers:** Future rate review filings must explicitly segregate experience-period risk transfer dollars from projected trend escalations when justifying above-request approvals.
2. **Standardization of Enrollment Metrics:** All downstream models must enforce strict metric-labeling (distinguishing plan selections, gross terminations, and paid point-in-time enrollment) to prevent distortion of attrition rates.
3. **Integration of Intra-Family PPO/HMO Cross-Subsidies:** Analytical models should evaluate sister entities (such as KHPE and QCC) as unified corporate structures to capture internal risk-transfer netting.
