import { buildWealthPlan, type WealthProfile } from '@/lib/opportunity-engine';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<WealthProfile>;
    const required: (keyof WealthProfile)[] = ['annualIncome', 'liquidSavings', 'monthlyExpenses', 'targetIncome', 'availableHoursPerWeek', 'primaryGoal', 'riskTolerance'];

    for (const key of required) {
      if (body[key] === undefined || body[key] === null) {
        return Response.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }

    const profile: WealthProfile = {
      annualIncome: Number(body.annualIncome),
      liquidSavings: Number(body.liquidSavings),
      monthlyExpenses: Number(body.monthlyExpenses),
      targetIncome: Number(body.targetIncome),
      availableHoursPerWeek: Number(body.availableHoursPerWeek),
      primaryGoal: body.primaryGoal as WealthProfile['primaryGoal'],
      riskTolerance: body.riskTolerance as WealthProfile['riskTolerance'],
    };

    if (Object.values(profile).some((value) => typeof value === 'number' && !Number.isFinite(value))) {
      return Response.json({ error: 'Numeric fields must be finite numbers.' }, { status: 400 });
    }

    return Response.json({ profile, plan: buildWealthPlan(profile) });
  } catch {
    return Response.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
}
