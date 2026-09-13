import { getStripe, STRIPE_PRICES } from '@/lib/stripe';

const allowedPlans = new Set(['plus', 'pro', 'wealth'] as const);
type Plan = 'plus' | 'pro' | 'wealth';

export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan?: string };
    if (!plan || !allowedPlans.has(plan as Plan)) return Response.json({ error: 'Invalid plan.' }, { status: 400 });
    const price = STRIPE_PRICES[plan as Plan];
    if (!price) return Response.json({ error: 'This plan is not configured for billing yet.' }, { status: 503 });

    const stripe = getStripe();
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plan?billing=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error', error);
    return Response.json({ error: 'Unable to start checkout.' }, { status: 500 });
  }
}
