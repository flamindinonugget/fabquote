import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { createPageMetadata } from "@/lib/seo";
import {
  isActiveProSubscription,
  subscriptionRepository,
} from "@/lib/subscriptionState";

export const metadata: Metadata = createPageMetadata({
  title: "Subscription Started",
  description: "Your FabQuote subscription checkout completed successfully.",
  path: "/billing/success",
});

export default function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <PageLayout>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint-700">
          Checkout complete
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          Your FabQuote subscription checkout is complete.
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">
          Stripe has redirected you back to FabQuote. Webhook events update the
          local subscription state used to recognize active Pro access.
        </p>
        <SubscriptionSessionNote searchParams={searchParams} />
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/stl-quote-generator"
            className="inline-flex rounded-md bg-mint-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-mint-600 focus:outline-none focus:ring-4 focus:ring-mint-100"
          >
            Continue quoting
          </Link>
          <Link
            href="/pricing"
            className="inline-flex rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            Back to pricing
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

async function SubscriptionSessionNote({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;

  if (!params.session_id) {
    return null;
  }

  const subscription = await subscriptionRepository.findSubscription({
    checkoutSessionId: params.session_id,
  });
  const isActive = subscription ? isActiveProSubscription(subscription) : false;

  return (
    <div className="mt-5 rounded-md border border-line bg-paper p-3 text-sm font-semibold text-muted">
      <p>
        Stripe Checkout Session:{" "}
        <span className="text-ink">{params.session_id}</span>
      </p>
      <p className="mt-2">
        Pro access:{" "}
        <span className={isActive ? "text-mint-700" : "text-brand-700"}>
          {isActive
            ? "active"
            : subscription
              ? `waiting on active status (${subscription.status})`
              : "waiting for webhook confirmation"}
        </span>
      </p>
    </div>
  );
}
