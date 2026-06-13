import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorCard } from "@/components/CalculatorCard";
import { FeedbackTriggerButton } from "@/components/FeedbackTriggerButton";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  calculatorItemListJsonLd,
  createPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { calculatorPages } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Instant Quoting Software",
  description:
    "Upload STL files, estimate material and print costs, save customers, and generate professional quotes in minutes.",
});

export default function HomePage() {
  return (
    <PageLayout>
      <StructuredData
        data={[websiteJsonLd(), organizationJsonLd(), calculatorItemListJsonLd()]}
      />
      <section className="border-b border-line bg-white" aria-labelledby="home-heading">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="self-center">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-700">
              Quote faster. <span className="text-mint-600">Build more.</span>
            </p>
            <h1
              id="home-heading"
              className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-ink sm:text-6xl"
            >
              Instant quoting software for small 3D print businesses
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Upload STL files, estimate material and print costs, save
              customers, and generate professional quotes in minutes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/stl-quote-generator"
                className="fq-button-primary px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-100"
              >
                Start quoting
              </Link>
              <Link
                href="/pricing"
                className="fq-button-secondary px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                View pricing
              </Link>
              <Link
                href="/3d-print-cost-calculator"
                className="fq-button-secondary px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                Free calculators
              </Link>
            </div>
          </div>

          <aside
            className="fq-surface self-center p-5"
            aria-label="Sample print quote"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="text-sm font-black text-ink">Sample print quote</p>
                <p className="text-xs font-semibold text-muted">PLA bracket, 4h 30m</p>
              </div>
              <span className="rounded-md bg-mint-50 px-2.5 py-1 text-xs font-black text-mint-700">
                Profitable
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="font-semibold text-muted">Filament</dt>
                <dd className="font-black text-ink">$1.63</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-semibold text-muted">Electricity</dt>
                <dd className="font-black text-ink">$0.09</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-semibold text-muted">Setup</dt>
                <dd className="font-black text-ink">$4.00</dd>
              </div>
              <div className="mt-2 rounded-md bg-brand-50 p-4">
                <dt className="text-sm font-black text-brand-700">
                  Suggested price
                </dt>
                <dd className="mt-1 text-3xl font-black tracking-tight text-brand-700">
                  $11.44
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        aria-labelledby="calculator-list-heading"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="calculator-list-heading"
              className="text-2xl font-black tracking-tight text-ink"
            >
              Choose a calculator
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              The quoting app is the flagship workflow. The calculators remain
              free SEO tools for quick production math.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calculatorPages.map((calculator) => (
            <CalculatorCard key={calculator.href} {...calculator} />
          ))}
        </div>
      </section>

      <section
        id="early-access"
        className="border-t border-line bg-white"
        aria-labelledby="early-access-heading"
      >
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.45fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
              Early Access
            </p>
            <h2
              id="early-access-heading"
              className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-ink sm:text-4xl"
            >
              Help Build the Future of 3D Print Quoting
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              FabQuote is currently available in Early Access while we continue
              improving quoting accuracy, workflow automation, and business
              intelligence features.
            </p>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-ink">
              Every piece of feedback directly shapes future updates.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-5 shadow-sm">
            <p className="text-sm font-black text-ink">
              Share what happened in your workflow.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              The most useful feedback explains what you were trying to quote,
              where the flow slowed down, and what would save the most time.
            </p>
            <div className="mt-4">
              <FeedbackTriggerButton label="Share Feedback" />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
