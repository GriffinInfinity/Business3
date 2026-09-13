import { getStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { customerId } = (await request.json()) as { customerId?: string };
    if (!customerId) return Response.json({ error: 'customerId is required.' }, { status: 400 });
    const stripe = getStripe();
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${origin}/account` });
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error', error);
    return Response.json({ error: 'Unable to open billing portal.' }, { status: 500 });
  }
}
