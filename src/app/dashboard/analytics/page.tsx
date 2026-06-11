import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";
import { AnalyticsClient } from "./AnalyticsClient";

const title = "Dashboard Analytics";
const description =
  "Analyze FabQuote saved quotes with local revenue, markup, profit, material, machine, and customer intelligence.";
const path = "/dashboard/analytics";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function DashboardAnalyticsPage() {
  return (
    <PageLayout>
      <StructuredData
        data={[
          webApplicationJsonLd({ title, description, path }),
          breadcrumbJsonLd([
            { name: "Home", path: "" },
            { name: "Dashboard", path: "/dashboard" },
            { name: title, path },
          ]),
        ]}
      />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Business Intelligence
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            See what your quote history says about the business.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            FabQuote analyzes saved local quotes to surface revenue, markup,
            profit, material, machine, and customer patterns while keeping data
            on this device.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <AnalyticsClient />
      </section>
    </PageLayout>
  );
}
