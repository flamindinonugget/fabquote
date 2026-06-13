import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Checkout Canceled",
  description: "FabQuote subscription checkout was canceled.",
  path: "/billing/cancel",
});

export default function BillingCancelPage() {
  return (
    <PageLayout>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
          Checkout canceled
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          No subscription changes were made.
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">
          You can return to pricing when you are ready, or keep using the free
          local quoting tools.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="inline-flex rounded-md bg-mint-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-mint-600 focus:outline-none focus:ring-4 focus:ring-mint-100"
          >
            Return to pricing
          </Link>
          <Link
            href="/stl-quote-generator"
            className="inline-flex rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            Continue free
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

