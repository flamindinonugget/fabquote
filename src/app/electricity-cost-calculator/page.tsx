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

const title = "Electricity Cost Calculator";
const description =
  "Calculate electricity cost per 3D print from printer wattage, print time, and local kWh rate.";
const path = "/electricity-cost-calculator";

const ElectricityCostCalculator = dynamic(
  () =>
    import("../calculators/electricity-cost/ElectricityCostCalculator").then(
      (mod) => mod.ElectricityCostCalculator,
    ),
  {
    loading: () => <CalculatorLoading />,
  },
);

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function ElectricityCostPage() {
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
        description="Convert wattage, runtime, and your utility rate into the power cost for a print."
      >
        <ElectricityCostCalculator />
      </CalculatorShell>
    </PageLayout>
  );
}
