import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { MachinesClient } from "./MachinesClient";

const title = "Machines";
const description =
  "Manage FabQuote machine profiles with printer presets, wattage, speed, layer height, nozzle size, markup, and labor defaults.";
const path = "/machines";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
});

export default function MachinesPage() {
  return (
    <PageLayout>
      <StructuredData data={webPageJsonLd({ title, description, path })} />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Machines
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Save printer presets for faster quoting.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Store machine profiles in localStorage and apply wattage, speed,
            layer height, nozzle size, labor fee, and markup defaults to STL
            quotes.
          </p>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-muted">
            Built-in presets include Bambu Lab P1S, Bambu Lab X1 Carbon, Bambu
            Lab A1, Prusa MK4, Creality K1, and Ender 3 V3.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <MachinesClient />
      </section>
    </PageLayout>
  );
}
