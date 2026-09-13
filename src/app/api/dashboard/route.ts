import { buildWealthPlan } from '@/lib/opportunity-engine';
import { calculateWealthMetrics } from '@/lib/wealth-metrics';
import { getWealthProfile } from '@/lib/wealth-store';

const MVP_USER_ID = 'mvp-anonymous';

export async function GET() {
  const record = await getWealthProfile(MVP_USER_ID);
  if (!record) {
    return Response.json({ profile: null, metrics: null, plan: null, completeness: 0 });
  }

  const metrics = calculateWealthMetrics(record.profile);
  const plan = buildWealthPlan(record.profile);
  return Response.json({ profile: record.profile, metrics, plan, updatedAt: record.updatedAt, completeness: 100 });
}
