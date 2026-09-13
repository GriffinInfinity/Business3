export async function GET() {
  return Response.json({ ok: true, service: 'wealthos', version: '0.1.0' });
}
