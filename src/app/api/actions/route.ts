import { NextRequest, NextResponse } from 'next/server';
import { normalizeWealthProfile } from '@/lib/wealth-profile';
import { buildWealthPlan, type Opportunity } from '@/lib/opportunity-engine';
import { listActions, updateAction, upsertAction, type ActionStatus } from '@/lib/action-store';

const MVP_USER_ID = 'mvp-anonymous';

export async function GET() {
  return NextResponse.json({ actions: await listActions(MVP_USER_ID) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { opportunity?: Opportunity; profile?: unknown; status?: ActionStatus; note?: string };
    let opportunity = body.opportunity;

    if (!opportunity && body.profile) {
      opportunity = buildWealthPlan(normalizeWealthProfile(body.profile)).opportunities[0];
    }

    if (!opportunity?.id || !opportunity.title) {
      return NextResponse.json({ error: 'A valid opportunity is required.' }, { status: 400 });
    }

    const action = await upsertAction(MVP_USER_ID, opportunity, body.status ?? 'saved', body.note ?? '');
    return NextResponse.json({ action }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid action payload.' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { id?: string; status?: ActionStatus; note?: string };
    if (!body.id) return NextResponse.json({ error: 'Action id is required.' }, { status: 400 });
    if (body.status && !['new', 'saved', 'active', 'completed', 'dismissed'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid action status.' }, { status: 400 });
    }

    const action = await updateAction(MVP_USER_ID, body.id, { status: body.status, note: body.note });
    if (!action) return NextResponse.json({ error: 'Action not found.' }, { status: 404 });
    return NextResponse.json({ action });
  } catch {
    return NextResponse.json({ error: 'Invalid action payload.' }, { status: 400 });
  }
}
