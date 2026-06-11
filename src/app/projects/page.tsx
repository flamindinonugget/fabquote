import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { ProjectsClient } from "./ProjectsClient";

const title = "Projects";
const description =
  "Manage FabQuote print projects locally with customer links, STL file names, materials, and notes.";
const path = "/projects";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function ProjectsPage() {
  return (
    <PageLayout>
      <StructuredData data={webPageJsonLd({ title, description, path })} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Projects
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Track printable jobs before and after quoting.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Store project records in this browser for now. Supabase can later
            replace the storage service behind this page.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <ProjectsClient />
      </section>
    </PageLayout>
  );
}
