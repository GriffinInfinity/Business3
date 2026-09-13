export type WealthProfile = {
  annualIncome: number;
  liquidSavings: number;
  monthlyExpenses: number;
  targetIncome: number;
  availableHoursPerWeek: number;
  primaryGoal: 'income' | 'savings' | 'business' | 'stability';
  riskTolerance: 'low' | 'medium' | 'high';
};

export type Opportunity = {
  id: string;
  title: string;
  score: number;
  category: string;
  rationale: string;
  nextStep: string;
};

export type WealthPlan = {
  savingsRate: number;
  runwayMonths: number;
  incomeGap: number;
  opportunities: Opportunity[];
};

export function buildWealthPlan(profile: WealthProfile): WealthPlan {
  const monthlyIncome = profile.annualIncome / 12;
  const monthlySurplus = Math.max(monthlyIncome - profile.monthlyExpenses, 0);
  const savingsRate = monthlyIncome > 0 ? monthlySurplus / monthlyIncome : 0;
  const runwayMonths = profile.monthlyExpenses > 0 ? profile.liquidSavings / profile.monthlyExpenses : 0;
  const incomeGap = Math.max(profile.targetIncome - profile.annualIncome, 0);

  const incomeScore = Math.min(99, Math.round(65 + Math.min(incomeGap / 1000, 25) + profile.availableHoursPerWeek / 8));
  const savingsScore = Math.min(99, Math.round(60 + Math.min((1 - savingsRate) * 20, 20) + Math.min(runwayMonths, 12)));
  const acquisitionScore = Math.min(99, Math.round(45 + Math.min(profile.liquidSavings / 5000, 30) + (profile.riskTolerance === 'high' ? 15 : profile.riskTolerance === 'medium' ? 8 : 2)));

  const opportunities: Opportunity[] = [
    {
      id: 'earning-power',
      title: 'Increase earning power',
      score: incomeScore,
      category: 'Earn',
      rationale: incomeGap > 0 ? `You have an estimated $${Math.round(incomeGap).toLocaleString()} annual income gap to your target.` : 'Your current income is at or above your target; focus on durable upside and optionality.',
      nextStep: 'Identify the highest-value role, contract, skill, or business lever available in the next 30 days.',
    },
    {
      id: 'financial-leakage',
      title: 'Reduce financial leakage',
      score: savingsScore,
      category: 'Manage',
      rationale: `Your current modeled savings rate is ${Math.round(savingsRate * 100)}% with roughly ${runwayMonths.toFixed(1)} months of expense runway.`,
      nextStep: 'Review recurring expenses and redirect the highest-confidence savings into your next wealth objective.',
    },
    {
      id: 'acquisition-watchlist',
      title: 'Business acquisition watchlist',
      score: acquisitionScore,
      category: 'Multiply',
      rationale: `Your liquid capital and risk preference create a ${profile.riskTolerance}-risk acquisition profile.`,
      nextStep: 'Track small businesses with recurring revenue, clean financials, and a capital requirement that fits your range.',
    },
  ].sort((a, b) => b.score - a.score);

  return { savingsRate, runwayMonths, incomeGap, opportunities };
}
