/**
 * 2026 PA-specific Financial Defense Logic
 */
export const PA_FPL_2026 = {
  1: 15060 * 4,
  2: 20440 * 4,
  3: 25820 * 4,
  4: 31200 * 4,
  5: 36580 * 4,
  6: 41960 * 4
};
export function calculateFPLStatus(income: number, householdSize: number, debtAmount: number) {
  const limit = (PA_FPL_2026[householdSize as keyof typeof PA_FPL_2026] || PA_FPL_2026[6]);
  const isBelow400FPL = income <= limit;
  const isHighDebtBurden = debtAmount > (income * 0.05);
  return {
    isEligible: isBelow400FPL || isHighDebtBurden,
    limit,
    reason: isBelow400FPL ? 'Income below 400% FPL' : isHighDebtBurden ? 'Medical debt exceeds 5% of income' : null
  };
}
export function calculatePBMSavings(copay: number, cashPrice: number, drugTier: number = 3) {
  const rebateFactor = drugTier >= 4 ? 0.15 : drugTier === 3 ? 0.05 : 0;
  const estimatedRebate = cashPrice * rebateFactor;
  const netCashPrice = cashPrice - estimatedRebate;
  const potentialSavings = copay - netCashPrice;
  return {
    isOvercharged: copay > cashPrice || potentialSavings > 0,
    estimatedRebate,
    potentialSavings: Math.max(0, potentialSavings),
    netCashPrice
  };
}
export function checkMedicaidCompliance(logs: { hours: number; isExempt: boolean }[]) {
  const totalHours = logs.reduce((acc, curr) => acc + (curr.isExempt ? 80 : curr.hours), 0);
  const isCompliant = totalHours >= 80;
  return { totalHours, isCompliant, remaining: Math.max(0, 80 - totalHours) };
}
export function calculatePremiumShock(income: number, p25: number, p26: number) {
  const annualPremium = p26 * 12;
  const incomePercent = income > 0 ? (annualPremium / income) * 100 : 0;
  const increase = p26 - p25;
  return {
    incomePercent,
    isUnaffordable: incomePercent > 8.5,
    increase,
    monthlyIncomeLimit: (income * 0.085) / 12
  };
}
const JARGON_DICTIONARY: Record<string, { plain: string; violation?: string }> = {
  "not medically necessary": { plain: "The insurance company doesn't think the treatment is required for your health, even if your doctor disagreed.", violation: "Act 146" },
  "out of network": { plain: "The doctor or hospital does not have a contract with your insurance. You might be charged more.", violation: "No Surprises Act" },
  "experimental": { plain: "The insurer claims the treatment is too new or not proven yet, often to avoid paying for expensive tests." },
  "denied as bundled": { plain: "They want to pay for one combined service instead of separate parts. This often underpays your doctor." },
  "pre-authorization required": { plain: "You needed permission before getting the care. In emergencies, PA law forbids requiring this.", violation: "Act 146 §2111" },
  "balance bill": { plain: "The provider is asking you to pay the difference between their total charge and what insurance paid. Often illegal for ER visits.", violation: "Act 6 §2113" },
  "specialty review": { plain: "The person at the insurance company who denied you must have the same medical specialty as your doctor.", violation: "Act 146 §2116" },
  "claim denied - pbm": { plain: "The pharmacy benefit manager is blocking coverage, possibly violating Act 77 rebate rules.", violation: "Act 77" }
};
export function decodeJargon(text: string) {
  const lowerText = text.toLowerCase();
  const results: { term: string; explanation: string; violation?: string }[] = [];
  Object.entries(JARGON_DICTIONARY).forEach(([term, info]) => {
    if (lowerText.includes(term)) {
      results.push({ term, explanation: info.plain, violation: info.violation });
    }
  });
  return results;
}
export function getWizardRecommendation(answers: Record<string, boolean>): string {
  if (answers.isEmergency && answers.isOutOfNetwork) return 'BALANCE_BILLING';
  if (answers.isSpecialtyMismatch) return 'PRIOR_AUTH';
  if (answers.isHighInterest) return 'INTEREST_RATE';
  if (answers.isHospitalDebt && answers.isLowIncome) return 'FINANCIAL_ASSISTANCE';
  if (answers.isPharmacyOvercharge) return 'PBM_OVERCHARGE';
  return 'UNFAIR_PRICING';
}
export function getHB79DischargeStatus(income: number, debt: number, size: number) {
  const status = calculateFPLStatus(income, size, debt);
  if (status.isEligible) {
    return { status: 'Presumptive Eligible', cite: 'HB 79 Section 504', protection: 'Collection Stay Mandated' };
  }
  return { status: 'Standard Review', cite: 'PA Act 10', protection: 'Hardship Review Only' };
}