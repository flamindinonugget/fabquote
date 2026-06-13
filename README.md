# FabQuote

FabQuote is a fast, SEO-friendly Next.js app for instant STL quoting and practical 3D printing calculators.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- No database
- Vercel-ready

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Stripe Checkout

Create `.env.local` with the Stripe values used by the Pro subscription checkout:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
```

`STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` must both be from
the same Stripe mode, either test or live. `STRIPE_PRO_PRICE_ID` must be a
recurring Price ID for the Pro subscription.

For local development, checkout redirects default to `http://localhost:3000`.
Set `NEXT_PUBLIC_APP_URL` in deployed environments so Stripe redirects back to
the correct site URL.

Webhooks are optional for opening Checkout, but Pro access tracking needs
`STRIPE_WEBHOOK_SECRET` and a Stripe webhook endpoint pointed at
`/api/stripe/webhook`. In local development, webhook state is written to
`logs/stripe-subscriptions.json`. You can override that path with
`SUBSCRIPTION_STATE_FILE`.

For local webhook testing with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the printed `whsec_...` value as `STRIPE_WEBHOOK_SECRET`, then complete a
test Checkout. FabQuote handles `checkout.session.completed`,
`customer.subscription.created`, `customer.subscription.updated`,
`customer.subscription.deleted`, and `invoice.payment_failed`. You can verify
the stored state with:

```bash
curl "http://localhost:3000/api/subscription/status?session_id=cs_test_..."
```

## Production

```bash
npm run build
npm run start
```

The project can be deployed directly to Vercel.

# fabquote
