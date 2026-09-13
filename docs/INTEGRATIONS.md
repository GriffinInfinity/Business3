# WealthOS Integrations

## Stripe
WealthOS uses Stripe Billing for recurring SaaS subscriptions. The selected architecture is Stripe-hosted Checkout for web subscriptions and Stripe Customer Portal for customer self-service. Stripe webhooks will be the source of truth for subscription lifecycle state.

The connected Stripe account is Kelvar LLC. Live products/prices have not been created by the app yet.

Environment variables planned for deployment:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_PRICE_PLUS`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_WEALTH`

Never commit Stripe keys or webhook secrets to GitHub.

## Outlook Email
Outlook will provide lifecycle communication workflows such as onboarding messages, plan summaries, opportunity alerts, billing notices, and customer support communication. Email sending will be implemented through the connected Microsoft account/API rather than hard-coded credentials.

## Outlook Calendar
Outlook Calendar will provide planning-session and scheduling workflows. WealthOS will use calendar availability/event data only where the user has authorized that workflow.

## Vercel
Vercel is the deployment target for the Next.js web application. Production environment variables must be configured in Vercel rather than committed to the repository.
