import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";

const title = "Pricing";
const description =
  "Compare FabQuote plans for STL quote limits, branded quotes, saved customers, and public quote request forms.";
const path = "/pricing";

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For trying the estimator and quoting occasional jobs.",
    features: ["5 quotes/month", "STL upload estimator", "Printable quotes", "Free SEO calculators"],
    cta: "Start free",
    href: "/stl-quote-generator",
  },
  {
    name: "Starter",
    price: "$9",
    cadence: "month",
    description: "For side hustles and small shops quoting weekly jobs.",
    features: ["50 quotes/month", "Advanced STL estimates", "Printable quotes", "Upgrade prompts removed"],
    cta: "Choose Starter",
    href: "/stl-quote-generator",
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "month",
    description: "For active sellers who want a more polished quote workflow.",
    features: ["Unlimited quotes", "Branded quotes", "Saved customers", "Save quote workflow"],
    cta: "Choose Pro",
    href: "/stl-quote-generator",
    highlighted: true,
  },
  {
    name: "Shop",
    price: "$49",
    cadence: "month",
    description: "For print shops that want customers to request quotes online.",
    features: [
      "Everything in Pro",
      "Public customer quote request form",
      "Shop intake workflow",
      "Priority feature access",
    ],
    cta: "Choose Shop",
    href: "/stl-quote-generator",
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
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Pricing
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Start free. Upgrade when quoting becomes part of your shop workflow.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Start with local quoting tools today. Paid plan checkout is not
            enabled in this preview, so you can explore the workflow without
            entering payment details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-lg border p-5 ${
                tier.highlighted
                  ? "border-brand-600 bg-brand-50 shadow-soft"
                  : "border-line bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-ink">{tier.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {tier.description}
                  </p>
                </div>
                {tier.highlighted ? (
                  <span className="rounded-md bg-brand-600 px-2 py-1 text-xs font-bold text-white">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-4xl font-black tracking-tight text-ink">
                {tier.price}
                <span className="text-sm font-bold text-muted">/{tier.cadence}</span>
              </p>
              <ul className="mt-5 grid gap-3 text-sm font-semibold text-ink">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-brand-700">+</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-6 inline-flex w-full justify-center rounded-md px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-brand-100 ${
                  tier.highlighted
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-line bg-white text-ink hover:bg-paper"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-line bg-paper p-5">
          <h2 className="text-lg font-black text-ink">Preview access</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Plan buttons open the STL Quote Generator so you can test the core
            quoting workflow. Billing can be connected later without changing
            the current calculator experience.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
