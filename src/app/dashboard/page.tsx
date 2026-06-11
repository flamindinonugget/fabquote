import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { DashboardClient } from "./DashboardClient";

const title = "Dashboard";
const description =
  "Manage recent FabQuote customers, projects, and quotes stored locally in this browser.";
const path = "/dashboard";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function DashboardPage() {
  return (
    <PageLayout>
      <StructuredData data={webPageJsonLd({ title, description, path })} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Your local FabQuote workspace
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
            Review recent quotes, customers, and projects from the workspace
            saved in this browser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <DashboardClient />
      </section>
    </PageLayout>
  );
}
