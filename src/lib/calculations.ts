/**
 * 2026 PA-specific Financial Defense Logic
 */
export const PA_FPL_2026 = {
  1: 15060 * 4, // 400% of FPL
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
export function calculatePremiumShock(income: number, year2025: number, year2026: number) {
  const netChange = year2026 - year2025;
  const incomePercent = (year2026 * 12) / income;
  return {
    netChange,
    incomePercent: incomePercent * 100,
    isUnaffordable: incomePercent > 0.085, // 8.5% threshold for hardship
    isHardshipEligible: incomePercent > 0.085 || netChange > 100
  };
}
export function calculateDeductibleROI(cptCode: string, cost: number, remainingDeductible: number) {
  // Common ROI benchmarks for PA early-year spend
  const burnScore = Math.min(100, (cost / remainingDeductible) * 100);
  return {
    burnScore,
    monthsOfCoverageGained: Math.round(burnScore / 8), // Heuristic
    recommendation: burnScore > 50 ? 'High Priority: Front-load' : 'Monitor: Standard Schedule'
  };
}
export function calculateSB371Audit(principal: number, currentRate: number, months: number) {
  const legalRate = 0.03; // SB 371 cap
  const interestCharged = principal * (currentRate / 100) * (months / 12);
  const legalInterest = principal * legalRate * (months / 12);
  const overcharge = Math.max(0, interestCharged - legalInterest);
  return {
    overcharge,
    isViolation: currentRate > 3.1,
    annualOvercharge: overcharge / (months / 12)
  };
}