import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const title = "About";
const description =
  "Learn what FabQuote provides for 3D printing cost planning and quoting workflows.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageLayout>
      <StructuredData
        data={[
          webPageJsonLd({ title, description, path: "/about" }),
          breadcrumbJsonLd([
            { name: "Home", path: "" },
            { name: title, path: "/about" },
          ]),
        ]}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
          About
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          Built for practical 3D printing estimates.
        </h1>
        <div className="mt-6 space-y-5 text-base leading-7 text-muted">
          <p>
            FabQuote helps makers, print farms, and online sellers turn
            STL files and raw print details into usable quote numbers. The
            calculators focus on common questions: how much a print costs, how
            far a spool will go, what electricity adds, and whether a sale still
            leaves a healthy margin.
          </p>
          <p>
            FabQuote is intentionally lightweight for launch. Customers,
            projects, and saved quotes stay in your browser, keeping estimates
            fast and private on the device you use for quoting.
          </p>
          <p>
            Results are estimates, not accounting advice. Real pricing can vary
            with failed prints, machine depreciation, maintenance, taxes,
            packaging, marketplace rules, and local utility rates.
          </p>
        </div>
      </article>
    </PageLayout>
  );
}
