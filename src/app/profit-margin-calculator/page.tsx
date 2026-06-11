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

const title = "Profit Margin Calculator";
const description =
  "Calculate net profit and profit margin for a 3D print sale after material, electricity, fees, and shipping.";
const path = "/profit-margin-calculator";

const ProfitMarginCalculator = dynamic(
  () =>
    import("../calculators/profit-margin/ProfitMarginCalculator").then(
      (mod) => mod.ProfitMarginCalculator,
    ),
  {
    loading: () => <CalculatorLoading />,
  },
);

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function ProfitMarginPage() {
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
        description="See what is left after material, electricity, marketplace fees, and shipping."
      >
        <ProfitMarginCalculator />
      </CalculatorShell>
    </PageLayout>
  );
}
