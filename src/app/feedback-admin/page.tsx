import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";
import { FeedbackAdminClient } from "./FeedbackAdminClient";

const title = "Feedback Admin";
const description =
  "Review locally stored FabQuote Early Access feedback submissions, ratings, workflow pain points, and export JSON.";
const path = "/feedback-admin";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function FeedbackAdminPage() {
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
            Early Access Feedback
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Understand what users are trying to accomplish.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Review local feedback submissions focused on quoting workflows,
            points of confusion, and the improvements that would save users the
            most time.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <FeedbackAdminClient />
      </section>
    </PageLayout>
  );
}
