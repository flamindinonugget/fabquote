import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const title = "Terms of Service";
const description =
  "Read the terms that apply when using FabQuote calculators and website content.";
const path = "/terms-of-service";
const updated = "June 10, 2026";

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function TermsPage() {
  return (
    <PageLayout>
      <StructuredData
        data={[
          webPageJsonLd({ title, description, path }),
          breadcrumbJsonLd([
            { name: "Home", path: "" },
            { name: title, path },
          ]),
        ]}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
          Terms
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm font-semibold text-muted">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-base leading-7 text-muted">
          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Use of the website
            </h2>
            <p className="mt-3">
              FabQuote provides free calculators, STL quote estimates,
              and informational content for 3D printing estimates. You may use the site for
              personal or commercial planning, subject to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Estimates only
            </h2>
            <p className="mt-3">
              Results depend on the values you enter and may not include failed
              prints, maintenance, depreciation, taxes, packaging, local fees,
              or marketplace policy changes. Verify important pricing decisions
              independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Availability
            </h2>
            <p className="mt-3">
              The website is provided as available. Features may change, break,
              or be removed as the product evolves.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Intellectual property
            </h2>
            <p className="mt-3">
              The FabQuote name, interface, calculator copy, and site
              content belong to the site owner unless otherwise noted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Limitation of liability
            </h2>
            <p className="mt-3">
              To the fullest extent allowed by law, FabQuote is not
              responsible for losses that result from use of the calculators,
              estimates, or website content.
            </p>
          </section>
        </div>
      </article>
    </PageLayout>
  );
}
