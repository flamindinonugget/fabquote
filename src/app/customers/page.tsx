import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { CustomersClient } from "./CustomersClient";

const title = "Customers";
const description =
  "Manage FabQuote customers locally with search, sorting, notes, and delete confirmation.";
const path = "/customers";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function CustomersPage() {
  return (
    <PageLayout>
      <StructuredData data={webPageJsonLd({ title, description, path })} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Customers
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Keep customer details ready for quotes.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Save customer details locally so repeat quoting stays organized and
            fast.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CustomersClient />
      </section>
    </PageLayout>
  );
}
