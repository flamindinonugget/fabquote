import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const title = "Privacy Policy";
const description =
  "Read the FabQuote privacy policy for this 3D printing quoting website.";
const path = "/privacy-policy";
const updated = "June 10, 2026";

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function PrivacyPage() {
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
          Privacy
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm font-semibold text-muted">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-base leading-7 text-muted">
          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Information you enter
            </h2>
            <p className="mt-3">
              Calculator values are processed in your browser for immediate
              estimates. FabQuote does not require an account or a
              database to use the current calculators or STL quote estimator.
              Customer, project, and quote records are stored in localStorage
              on your device for now.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Contact email
            </h2>
            <p className="mt-3">
              If you contact us by email, we may use your message and reply
              address to respond to your request and improve the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Analytics and hosting
            </h2>
            <p className="mt-3">
              The site may be hosted on infrastructure such as Vercel, which can
              process standard technical data like IP address, browser type,
              requested pages, and timestamps for security, performance, and
              reliability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              No professional advice
            </h2>
            <p className="mt-3">
              Calculator output is an estimate. You are responsible for your
              own pricing, taxes, customer commitments, and business records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Updates
            </h2>
            <p className="mt-3">
              This policy may change as the website adds features. The updated
              date above will reflect material revisions.
            </p>
          </section>
        </div>
      </article>
    </PageLayout>
  );
}
