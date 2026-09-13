import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { microsoftAuthorizeUrl, microsoftConfigured } from '@/lib/microsoft';

export async function GET() {
  if (!microsoftConfigured()) {
    return NextResponse.json({ error: 'Microsoft integration is not configured.' }, { status: 503 });
  }
  const state = crypto.randomBytes(24).toString('hex');
  const response = NextResponse.redirect(microsoftAuthorizeUrl(state));
  response.cookies.set('wealthos_ms_state', state, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/' });
  return response;
}
