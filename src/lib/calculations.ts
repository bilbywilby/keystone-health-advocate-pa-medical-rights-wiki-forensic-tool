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
  // Act 77 requires rebate pass-through for specialty tiers. 
  // Mock rebate: 15% for Tier 4, 5% for Tier 3
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
  return {
    totalHours,
    isCompliant,
    remaining: Math.max(0, 80 - totalHours)
  };
}
export function getHB79DischargeStatus(income: number, debt: number, size: number) {
  const status = calculateFPLStatus(income, size, debt);
  if (status.isEligible) {
    return {
      status: 'Presumptive Eligible',
      cite: 'HB 79 Section 504',
      protection: 'Collection Stay Mandated'
    };
  }
  return {
    status: 'Standard Review',
    cite: 'PA Act 10',
    protection: 'Hardship Review Only'
  };
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