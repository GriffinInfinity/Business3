import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured.');
  stripeClient = new Stripe(secretKey, { apiVersion: '2026-07-29.dahlia' });
  return stripeClient;
}

export const STRIPE_PRICES = {
  plus: process.env.STRIPE_PRICE_PLUS,
  pro: process.env.STRIPE_PRICE_PRO,
  wealth: process.env.STRIPE_PRICE_WEALTH,
} as const;
