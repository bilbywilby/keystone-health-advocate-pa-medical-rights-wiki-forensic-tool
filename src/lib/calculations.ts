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
export function calculateConsensusFMV(submissions: number[], threshold: number = 5) {
  if (submissions.length < threshold) return null;
  // Trim outliers (top/bottom 10% for robust consensus)
  const sorted = [...submissions].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * 0.1);
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  const sum = trimmed.reduce((a, b) => a + b, 0);
  const median = trimmed[Math.floor(trimmed.length / 2)];
  return {
    trimmedMean: sum / trimmed.length,
    median,
    confidence: submissions.length >= 10 ? 'High' : 'Medium'
  };
}
export function calculateSB371Audit(principal: number, currentRate: number, months: number) {
  const legalRate = 0.03;
  const interestCharged = principal * (currentRate / 100) * (months / 12);
  const legalInterest = principal * legalRate * (months / 12);
  const overcharge = Math.max(0, interestCharged - legalInterest);
  return {
    overcharge,
    isViolation: currentRate > 3.1,
    annualOvercharge: overcharge / (months / 12 || 1)
  };
}
export function checkSB752Eligibility(isNonProfit: boolean, debtAmount: number) {
  // SB 752 blocks aggressive collections for non-profits if financial assistance applies
  return {
    isProtected: isNonProfit && debtAmount > 0,
    violationType: isNonProfit ? 'SB 752 Non-Profit Debt Block' : 'None'
  };
}
/**
 * Calculates 2026 premium impact and affordability threshold (8.5%).
 */
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