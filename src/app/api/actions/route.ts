import { buildWealthPlan } from '@/lib/opportunity-engine';
import { normalizeWealthProfile } from '@/lib/wealth-profile';
import { getWealthProfile } from '@/lib/wealth-store';
import { listActions, updateActionStatus, upsertAction, type ActionStatus } from '@/lib/action-store';

const MVP_USER_ID = 'mvp-anonymous';
const statuses = new Set<ActionStatus>(['new', 'saved', 'active', 'completed', 'dismissed']);

export async function GET() {
  return Response.json({ actions: await listActions(MVP_USER_ID) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const status = (body.status ?? 'saved') as ActionStatus;
    if (!statuses.has(status) || typeof body.opportunityId !== 'string') {
      return Response.json({ error: 'Invalid action payload.' }, { status: 400 });
    }

    const record = await getWealthProfile(MVP_USER_ID);
    if (!record) return Response.json({ error: 'Complete your wealth profile first.' }, { status: 404 });

    const opportunity = buildWealthPlan(normalizeWealthProfile(record.profile)).opportunities.find((item) => item.id === body.opportunityId);
    if (!opportunity) return Response.json({ error: 'Opportunity not found.' }, { status: 404 });

    const action = await upsertAction({
      userId: MVP_USER_ID,
      opportunityId: opportunity.id,
      title: opportunity.title,
      category: opportunity.category,
      nextStep: opportunity.nextStep,
      score: opportunity.score,
      status,
      notes: typeof body.notes === 'string' ? body.notes.slice(0, 1000) : '',
    });
    return Response.json({ action });
  } catch {
    return Response.json({ error: 'Unable to save action.' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.opportunityId !== 'string' || !statuses.has(body.status as ActionStatus)) {
      return Response.json({ error: 'Invalid action update.' }, { status: 400 });
    }
    const action = await updateActionStatus(MVP_USER_ID, body.opportunityId, body.status as ActionStatus, typeof body.notes === 'string' ? body.notes.slice(0, 1000) : undefined);
    if (!action) return Response.json({ error: 'Action not found.' }, { status: 404 });
    return Response.json({ action });
  } catch {
    return Response.json({ error: 'Unable to update action.' }, { status: 400 });
  }
}
