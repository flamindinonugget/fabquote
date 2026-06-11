import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CalculatorLoading } from "@/components/CalculatorLoading";
import { CalculatorShell } from "@/components/CalculatorShell";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";

const title = "Filament Usage Calculator";
const description =
  "Estimate how many 3D prints fit on a filament spool and the filament cost per print.";
const path = "/filament-usage-calculator";

const FilamentUsageCalculator = dynamic(
  () =>
    import("../calculators/filament-usage/FilamentUsageCalculator").then(
      (mod) => mod.FilamentUsageCalculator,
    ),
  {
    loading: () => <CalculatorLoading />,
  },
);

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function FilamentUsagePage() {
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
      <CalculatorShell
        title={title}
        description="Plan spool yield and cost per print from spool weight, print weight, and spool price."
      >
        <FilamentUsageCalculator />
      </CalculatorShell>
    </PageLayout>
  );
}
