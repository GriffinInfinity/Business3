import { NextRequest, NextResponse } from 'next/server';
import { exchangeMicrosoftCode, microsoftConfigured } from '@/lib/microsoft';

export async function GET(request: NextRequest) {
  if (!microsoftConfigured()) return NextResponse.json({ error: 'Microsoft integration is not configured.' }, { status: 503 });
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const expected = request.cookies.get('wealthos_ms_state')?.value;
  if (!code || !state || !expected || state !== expected) {
    return NextResponse.json({ error: 'Invalid Microsoft OAuth state or authorization code.' }, { status: 400 });
  }
  const tokens = await exchangeMicrosoftCode(code);
  // Token persistence belongs behind the application's authenticated user/session layer.
  // Never expose access or refresh tokens to the browser.
  const response = NextResponse.redirect(new URL('/settings/integrations?microsoft=connected', request.url));
  response.cookies.delete('wealthos_ms_state');
  response.cookies.set('wealthos_ms_connected', '1', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 300, path: '/' });
  void tokens;
  return response;
}
