import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";
import { QuoteTestLabClient } from "./QuoteTestLabClient";

const title = "Quote Test Lab";
const description =
  "Validate the FabQuote Profit Protection Engine with built-in realistic 3D print quote scenarios.";
const path = "/quote-test-lab";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function QuoteTestLabPage() {
  return (
    <PageLayout>
      <StructuredData
        data={[
          webApplicationJsonLd({ title, description, path }),
          breadcrumbJsonLd([
            { name: "Home", path: "" },
            { name: title, path },
          ]),
        ]}
      />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Quote Testing
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Validate quote risk before customers see the price.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Run realistic local scenarios through the Profit Protection Engine,
            review warnings and confidence scores, then load any scenario into
            the STL Quote Generator for hands-on testing.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <QuoteTestLabClient />
      </section>
    </PageLayout>
  );
}
