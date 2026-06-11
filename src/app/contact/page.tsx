import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const title = "Contact";
const description =
  "Contact FabQuote with calculator feedback, support questions, and partnership notes.";
const path = "/contact";

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function ContactPage() {
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
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Send feedback or calculator requests.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            FabQuote is built around practical maker workflows. Share
            bugs, formula questions, calculator ideas, or notes about how you
            price 3D prints in the real world.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-ink">Email</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Best for support questions, correction requests, and private
              feedback.
            </p>
            <a
              className="mt-5 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
              href={`mailto:${siteConfig.email}`}
            >
              {siteConfig.email}
            </a>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-ink">Requests</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              New calculators are prioritized when they solve repeat pricing
              work for print farms, Etsy sellers, and hobbyists.
            </p>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight text-ink">Legal</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Review the privacy and terms pages for how this lightweight site
              handles calculator usage.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-brand-700">
              <Link className="hover:text-brand-600" href="/privacy-policy">
                Privacy
              </Link>
              <Link className="hover:text-brand-600" href="/terms-of-service">
                Terms
              </Link>
            </div>
          </section>
        </div>
      </article>
    </PageLayout>
  );
}
