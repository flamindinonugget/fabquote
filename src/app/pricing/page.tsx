import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { PricingCheckoutForm } from "@/components/PricingCheckoutForm";
import { StructuredData } from "@/components/StructuredData";
import { type BillingPlanId, trialDays } from "@/lib/billing";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";

const title = "Pricing";
const description =
  "Compare FabQuote plans for STL quote limits, branded quotes, saved customers, and public quote request forms.";
const path = "/pricing";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  note?: string;
  badge?: string;
  highlighted?: boolean;
  action:
    | { type: "link"; cta: string; href: string }
    | { type: "checkout"; cta: string; planId: BillingPlanId }
    | { type: "contact"; cta: string; href: string };
};

const tiers: Tier[] = [
  {
    name: "Free Trial",
    price: "$0",
    cadence: `${trialDays} days`,
    description: "For testing the FabQuote workflow before a subscription begins.",
    features: [
      "Try the quoting workflow",
      "STL upload estimator",
      "Printable quotes",
      "Free calculators",
    ],
    note: "No card required.",
    action: {
      type: "link",
      cta: "Start quoting",
      href: "/stl-quote-generator",
    },
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "month",
    description: "For active sellers who want a polished quote workflow.",
    features: [
      "14-day trial included",
      "Unlimited quotes",
      "Branded quotes",
      "Saved customers",
      "Save quote workflow",
    ],
    note: "Secure subscription checkout powered by Stripe.",
    badge: "Popular",
    highlighted: true,
    action: {
      type: "checkout",
      cta: "Start Pro trial",
      planId: "pro",
    },
  },
  {
    name: "Shop",
    price: "$49",
    cadence: "month",
    description: "For print shops that want customers to request quotes online.",
    features: [
      "14-day trial included",
      "Everything in Pro",
      "Public quote request form",
      "Shop intake workflow",
      "Priority feature access",
    ],
    note: "Built for higher-volume intake.",
    action: {
      type: "contact",
      cta: "Contact sales",
      href: "/contact",
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "contact sales",
    description: "For larger operations with custom workflow and support needs.",
    features: [
      "Volume quoting discussions",
      "Custom onboarding",
      "Workflow planning",
      "No self-serve checkout",
    ],
    note: "Custom workflow planning.",
    action: {
      type: "contact",
      cta: "Contact sales",
      href: "/contact",
    },
  },
];

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function PricingPage() {
  return (
    <PageLayout>
      <StructuredData data={webPageJsonLd({ title, description, path })} />
      <section className="border-b border-brand-700 bg-brand-600 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.42fr] lg:items-end lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-mint-500">
              FabQuote Pricing
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Professional quote workflows for small 3D print businesses.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-brand-100 sm:text-lg">
              Start with free local quoting tools, then upgrade to Pro through
              secure Stripe subscription Checkout when you are ready to test
              billing.
            </p>
          </div>
          <div className="rounded-lg border border-brand-500 bg-white p-5 text-ink shadow-soft">
            <p className="text-sm font-black text-brand-700">Pro trial</p>
            <p className="mt-2 text-4xl font-black tracking-tight">$19</p>
            <p className="mt-1 text-sm font-bold text-muted">
              per month after {trialDays} days
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Secure Stripe checkout is ready for Pro subscription testing and
              webhook-based access tracking.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-700">
              Plans
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink">
              Choose the workflow stage that fits today.
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-muted">
            All plans keep the same FabQuote estimating experience. Paid plans
            are designed for more polished customer-facing quote operations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`flex min-h-full flex-col rounded-lg border p-5 transition ${
                tier.highlighted
                  ? "border-brand-600 bg-white shadow-soft ring-4 ring-brand-50"
                  : "border-line bg-white shadow-sm hover:border-brand-100 hover:shadow-soft"
              }`}
            >
              <div className="flex min-h-32 items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-ink">{tier.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {tier.description}
                  </p>
                </div>
                {tier.badge ? (
                  <span className="rounded-md bg-mint-500 px-2.5 py-1 text-xs font-black text-white shadow-sm">
                    {tier.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-4xl font-black tracking-tight text-brand-700">
                {tier.price}
                <span className="text-sm font-bold text-muted"> / {tier.cadence}</span>
              </p>
              <ul className="mt-5 grid gap-3 text-sm font-bold text-ink">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-50 text-xs font-black text-mint-700">
                      +
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {tier.note ? (
                <p className="mt-5 rounded-md border border-line bg-paper p-3 text-xs font-bold leading-5 text-muted">
                  {tier.note}
                </p>
              ) : null}
              <div className="mt-auto">
                <TierAction tier={tier} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-brand-100 bg-brand-50 p-5">
          <h2 className="text-lg font-black text-brand-700">Billing status</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            Stripe Checkout remains enabled for the Pro plan, and subscription
            status can be verified from webhook state during local testing.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

function TierAction({ tier }: { tier: Tier }) {
  if (tier.action.type === "checkout") {
    return (
      <PricingCheckoutForm
        planId={tier.action.planId}
        cta={tier.action.cta}
        highlighted={tier.highlighted}
      />
    );
  }

  return (
    <Link
      href={tier.action.href}
      className={`mt-6 inline-flex w-full justify-center rounded-md px-4 py-3 text-sm font-black shadow-sm transition focus:outline-none focus:ring-4 ${
        tier.action.type === "contact"
          ? "border border-line bg-white text-ink hover:bg-brand-50 focus:ring-brand-100"
          : "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-100"
      }`}
    >
      {tier.action.cta}
    </Link>
  );
}
