import { createLead, listLeads, updateLead, type LeadStage, type OutreachLead } from '@/lib/outreach-store';

const MVP_USER_ID = 'mvp-anonymous';

export async function GET() { return Response.json({ leads: await listLeads(MVP_USER_ID) }); }

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OutreachLead>;
    if (!body.name || !body.email || !body.segment) return Response.json({ error: 'Name, email, and segment are required.' }, { status: 400 });
    if (body.consentStatus === 'opted_out') return Response.json({ error: 'Opted-out contacts cannot be added to an active outreach pipeline.' }, { status: 400 });
    const lead = await createLead(MVP_USER_ID, {
      name: body.name.trim(), organization: body.organization?.trim() ?? '', email: body.email.trim(),
      segment: body.segment, stage: body.stage ?? 'lead', source: body.source?.trim() ?? 'manual',
      consentStatus: body.consentStatus ?? 'unknown', notes: body.notes?.trim() ?? '',
      lastContactedAt: body.lastContactedAt ?? null, nextActionAt: body.nextActionAt ?? null,
    });
    return Response.json({ lead }, { status: 201 });
  } catch { return Response.json({ error: 'Invalid outreach lead.' }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; stage?: LeadStage; notes?: string; consentStatus?: OutreachLead['consentStatus']; lastContactedAt?: string | null; nextActionAt?: string | null };
    if (!body.id) return Response.json({ error: 'Lead id is required.' }, { status: 400 });
    const lead = await updateLead(MVP_USER_ID, body.id, body);
    if (!lead) return Response.json({ error: 'Lead not found.' }, { status: 404 });
    return Response.json({ lead });
  } catch { return Response.json({ error: 'Invalid outreach update.' }, { status: 400 }); }
}
