import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorCard } from "@/components/CalculatorCard";
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
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
              FabQuote
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
                className="inline-flex rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                Start quoting
              </Link>
              <Link
                href="/pricing"
                className="inline-flex rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-paper focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                View pricing
              </Link>
              <Link
                href="/3d-print-cost-calculator"
                className="inline-flex rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-paper focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                Free calculators
              </Link>
            </div>
          </div>

          <aside
            className="rounded-lg border border-line bg-paper p-4 shadow-soft"
            aria-label="Sample print quote"
          >
            <div className="rounded-lg border border-line bg-white p-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <p className="text-sm font-bold text-ink">Sample print quote</p>
                  <p className="text-xs font-medium text-muted">PLA bracket, 4h 30m</p>
                </div>
                <span className="rounded-md bg-mint-50 px-2.5 py-1 text-xs font-bold text-mint-700">
                  Profitable
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Filament</dt>
                  <dd className="font-bold text-ink">$1.63</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Electricity</dt>
                  <dd className="font-bold text-ink">$0.09</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Setup</dt>
                  <dd className="font-bold text-ink">$4.00</dd>
                </div>
                <div className="mt-2 rounded-lg bg-brand-50 p-4">
                  <dt className="text-sm font-bold text-brand-700">Suggested price</dt>
                  <dd className="mt-1 text-3xl font-black tracking-tight text-brand-700">
                    $11.44
                  </dd>
                </div>
              </dl>
            </div>
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
    </PageLayout>
  );
}
