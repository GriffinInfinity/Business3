# WealthOS persistence plan

The MVP currently uses an isolated in-memory store so product behavior can be developed before a production database is attached.

## Production boundary

Postgres becomes the durable source of truth for:

- users and identity
- wealth profiles
- tracked actions
- connected Microsoft accounts
- Stripe subscription state

The SQL blueprint in `db/schema.sql` keeps the data model provider-neutral. A database adapter should replace `src/lib/wealth-store.ts` and `src/lib/action-store.ts` without changing the API/UI contracts.

## Security requirements

- Never store Microsoft access or refresh tokens in browser storage.
- Encrypt OAuth tokens at rest with a server-only encryption key.
- Resolve the authenticated user on the server; never accept a client-supplied user id for ownership checks.
- Verify Stripe webhook signatures before changing subscription state.
- Treat Stripe as the billing authority and the application database as the local subscription cache.
- Keep financial planning outputs clearly separated from regulated financial, tax, legal, or investment advice.

## Migration order

1. Add Postgres connection and migration runner.
2. Add Auth.js/Microsoft identity and account persistence.
3. Replace anonymous MVP user resolution with authenticated user resolution.
4. Move profile and action stores to Postgres.
5. Persist Microsoft OAuth credentials encrypted at rest.
6. Add Stripe webhook synchronization and Customer Portal.
7. Enable production deployment only after CI and integration checks are green.
