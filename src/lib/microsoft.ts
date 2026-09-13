const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

export function microsoftConfig() {
  return {
    clientId: process.env.MICROSOFT_CLIENT_ID ?? '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
    tenantId: process.env.MICROSOFT_TENANT_ID ?? 'common',
    redirectUri: process.env.MICROSOFT_REDIRECT_URI ?? '',
  };
}

export function microsoftConfigured() {
  const c = microsoftConfig();
  return Boolean(c.clientId && c.clientSecret && c.redirectUri);
}

export function microsoftAuthorizeUrl(state: string) {
  const c = microsoftConfig();
  const params = new URLSearchParams({
    client_id: c.clientId,
    response_type: 'code',
    redirect_uri: c.redirectUri,
    response_mode: 'query',
    scope: 'openid profile email offline_access User.Read Mail.Send Calendars.ReadWrite',
    state,
  });
  return `https://login.microsoftonline.com/${c.tenantId}/oauth2/v2.0/authorize?${params}`;
}

export async function exchangeMicrosoftCode(code: string) {
  const c = microsoftConfig();
  const body = new URLSearchParams({
    client_id: c.clientId,
    client_secret: c.clientSecret,
    code,
    redirect_uri: c.redirectUri,
    grant_type: 'authorization_code',
    scope: 'openid profile email offline_access User.Read Mail.Send Calendars.ReadWrite',
  });
  const response = await fetch(`https://login.microsoftonline.com/${c.tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Microsoft token exchange failed: ${response.status}`);
  return response.json() as Promise<{ access_token: string; refresh_token?: string; expires_in: number }>;
}

async function graph<T>(accessToken: string, path: string, init?: RequestInit) {
  const response = await fetch(`${GRAPH_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Microsoft Graph request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export type GraphEvent = { id: string; subject?: string; start?: { dateTime: string; timeZone: string }; end?: { dateTime: string; timeZone: string } };
export type GraphMessage = { id: string; subject?: string; receivedDateTime?: string; from?: { emailAddress?: { name?: string; address?: string } } };

export function getUpcomingEvents(accessToken: string) {
  return graph<{ value: GraphEvent[] }>(accessToken, '/me/events?$top=10&$orderby=start/dateTime');
}

export function getRecentMail(accessToken: string) {
  return graph<{ value: GraphMessage[] }>(accessToken, '/me/messages?$top=10&$orderby=receivedDateTime%20desc');
}
