export type WealthProfile = {
  annualIncome: number;
  liquidSavings: number;
  monthlyExpenses: number;
  targetIncome: number;
  availableHoursPerWeek: number;
  primaryGoal: 'income' | 'savings' | 'business' | 'stability';
  riskTolerance: 'low' | 'medium' | 'high';
};

export const defaultWealthProfile: WealthProfile = {
  annualIncome: 0,
  liquidSavings: 0,
  monthlyExpenses: 0,
  targetIncome: 0,
  availableHoursPerWeek: 10,
  primaryGoal: 'income',
  riskTolerance: 'medium',
};

export function normalizeWealthProfile(input: Partial<WealthProfile>): WealthProfile {
  const number = (value: unknown, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  };

  const goals = new Set<WealthProfile['primaryGoal']>(['income', 'savings', 'business', 'stability']);
  const risks = new Set<WealthProfile['riskTolerance']>(['low', 'medium', 'high']);

  return {
    annualIncome: number(input.annualIncome),
    liquidSavings: number(input.liquidSavings),
    monthlyExpenses: number(input.monthlyExpenses),
    targetIncome: number(input.targetIncome),
    availableHoursPerWeek: Math.min(168, number(input.availableHoursPerWeek, 10)),
    primaryGoal: goals.has(input.primaryGoal as WealthProfile['primaryGoal']) ? input.primaryGoal as WealthProfile['primaryGoal'] : 'income',
    riskTolerance: risks.has(input.riskTolerance as WealthProfile['riskTolerance']) ? input.riskTolerance as WealthProfile['riskTolerance'] : 'medium',
  };
}

export function profileCompleteness(profile: WealthProfile): number {
  const fields = [profile.annualIncome, profile.liquidSavings, profile.monthlyExpenses, profile.targetIncome, profile.availableHoursPerWeek];
  return Math.round((fields.filter((value) => value > 0).length / fields.length) * 100);
}
