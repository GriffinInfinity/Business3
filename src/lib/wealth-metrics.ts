import type { WealthProfile } from '@/lib/opportunity-engine';

export type WealthMetrics = {
  monthlyIncome: number;
  monthlySurplus: number;
  savingsRate: number;
  runwayMonths: number;
  incomeGap: number;
  trajectoryScore: number;
};

export function calculateWealthMetrics(profile: WealthProfile): WealthMetrics {
  const monthlyIncome = profile.annualIncome / 12;
  const monthlySurplus = Math.max(monthlyIncome - profile.monthlyExpenses, 0);
  const savingsRate = monthlyIncome > 0 ? monthlySurplus / monthlyIncome : 0;
  const runwayMonths = profile.monthlyExpenses > 0 ? profile.liquidSavings / profile.monthlyExpenses : 0;
  const incomeGap = Math.max(profile.targetIncome - profile.annualIncome, 0);

  const runwayScore = Math.min(runwayMonths / 6, 1) * 35;
  const savingsScore = Math.min(savingsRate / 0.2, 1) * 30;
  const incomeScore = profile.targetIncome > 0
    ? Math.min(profile.annualIncome / profile.targetIncome, 1) * 25
    : 25;
  const optionalityScore = Math.min(profile.availableHoursPerWeek / 20, 1) * 10;

  return {
    monthlyIncome,
    monthlySurplus,
    savingsRate,
    runwayMonths,
    incomeGap,
    trajectoryScore: Math.round(runwayScore + savingsScore + incomeScore + optionalityScore),
  };
}
