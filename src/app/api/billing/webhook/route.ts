import { getStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return new Response('Webhook configuration missing.', { status: 400 });

  try {
    const payload = await request.text();
    const event = getStripe().webhooks.constructEvent(payload, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed':
      case 'invoice.paid':
        console.log('WealthOS Stripe event', event.type, event.id);
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error', error);
    return new Response('Webhook signature verification failed.', { status: 400 });
  }
}
