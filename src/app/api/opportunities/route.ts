import { buildWealthPlan, type WealthProfile } from '@/lib/opportunity-engine';
import { normalizeWealthProfile } from '@/lib/wealth-profile';
import { getWealthProfile } from '@/lib/wealth-store';

const MVP_USER_ID = 'mvp-anonymous';

export async function GET() {
  const record = await getWealthProfile(MVP_USER_ID);
  if (!record) {
    return Response.json({ error: 'Complete your wealth profile first.' }, { status: 404 });
  }

  const plan = buildWealthPlan(record.profile);
  return Response.json({ opportunities: plan.opportunities, generatedAt: new Date().toISOString() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<WealthProfile>;
    const profile = normalizeWealthProfile(body);
    const plan = buildWealthPlan(profile);
    return Response.json({ opportunities: plan.opportunities, generatedAt: new Date().toISOString() });
  } catch {
    return Response.json({ error: 'Invalid wealth profile.' }, { status: 400 });
  }
}
