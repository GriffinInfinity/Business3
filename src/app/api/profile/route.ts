import { NextRequest, NextResponse } from 'next/server';
import { normalizeWealthProfile, profileCompleteness } from '@/lib/wealth-profile';
import { getWealthProfile, saveWealthProfile } from '@/lib/wealth-store';

// Temporary anonymous identity until authentication is enabled. The storage boundary is
// isolated so authenticated user IDs can replace this without changing the API contract.
const MVP_USER_ID = 'mvp-anonymous';

export async function GET() {
  const record = await getWealthProfile(MVP_USER_ID);
  const profile = record?.profile ?? null;
  return NextResponse.json({ profile, completeness: profile ? profileCompleteness(profile) : 0, updatedAt: record?.updatedAt ?? null });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = normalizeWealthProfile(body);
    const record = await saveWealthProfile(MVP_USER_ID, profile);
    return NextResponse.json({ profile: record.profile, completeness: profileCompleteness(record.profile), updatedAt: record.updatedAt });
  } catch {
    return NextResponse.json({ error: 'Invalid profile payload.' }, { status: 400 });
  }
}
