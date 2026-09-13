import { NextRequest, NextResponse } from 'next/server';
import { normalizeWealthProfile, profileCompleteness } from '@/lib/wealth-profile';

// MVP persistence boundary. Replace the in-memory store with PostgreSQL once auth/database
// infrastructure is enabled. This keeps the API contract stable without pretending data is durable.
let currentProfile: ReturnType<typeof normalizeWealthProfile> | null = null;

export async function GET() {
  const profile = currentProfile;
  return NextResponse.json({ profile, completeness: profile ? profileCompleteness(profile) : 0 });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = normalizeWealthProfile(body);
    currentProfile = profile;
    return NextResponse.json({ profile, completeness: profileCompleteness(profile) });
  } catch {
    return NextResponse.json({ error: 'Invalid profile payload.' }, { status: 400 });
  }
}
