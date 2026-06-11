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

const title = "3D Print Cost Calculator";
const description =
  "Calculate filament cost, electricity cost, base cost, suggested selling price, and profit for a 3D print.";
const path = "/3d-print-cost-calculator";

const PrintCostCalculator = dynamic(
  () =>
    import("../calculators/print-cost/PrintCostCalculator").then(
      (mod) => mod.PrintCostCalculator,
    ),
  {
    loading: () => <CalculatorLoading />,
  },
);

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function PrintCostPage() {
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
        description="Estimate the real cost of a print and apply your target markup before quoting a customer."
      >
        <PrintCostCalculator />
      </CalculatorShell>
    </PageLayout>
  );
}
