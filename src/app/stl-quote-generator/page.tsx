import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CalculatorLoading } from "@/components/CalculatorLoading";
import { PageLayout } from "@/components/PageLayout";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  webApplicationJsonLd,
} from "@/lib/seo";

const title = "AI STL Quote Generator";
const description =
  "Generate a detailed 3D print quote from STL uploads, material choice, markup, risk, marketplace fees, and shipping.";
const path = "/stl-quote-generator";

const StlQuoteGenerator = dynamic(
  () => import("./StlQuoteGenerator").then((mod) => mod.StlQuoteGenerator),
  {
    loading: () => <CalculatorLoading />,
  },
);

export const metadata: Metadata = createPageMetadata({ title, description, path });

export default function StlQuoteGeneratorPage() {
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
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Flagship tool
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            AI STL Quote Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            Build a quote-ready 3D print price from manual STL estimates today,
            with local STL volume analysis for faster weight estimates.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6 lg:p-8">
          <StlQuoteGenerator />
        </div>

        <section
          className="mt-8 rounded-lg border border-line bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="quote-formula-heading"
        >
          <h2
            id="quote-formula-heading"
            className="text-xl font-black tracking-tight text-ink"
          >
            Formula
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <p>
              Material cost equals filament cost per kilogram multiplied by the
              estimated model weight in kilograms.
            </p>
            <p>
              Electricity cost equals printer kilowatts multiplied by print
              hours and the local kWh rate.
            </p>
            <p>
              Total cost combines material, electricity, setup/labor, shipping,
              and the failure-risk buffer.
            </p>
            <p>
              In default Markup Mode, recommended direct sale price equals total
              cost multiplied by one plus markup percentage. Expected profit is
              the direct sale price minus total cost.
            </p>
            <p>
              Marketplace sale price keeps the same net direct price after
              platform fees by dividing the direct sale price by one minus the
              marketplace fee percentage.
            </p>
            <p>
              Advanced Mode replaces markup with a true profit margin target and
              solves the direct sale price from that margin.
            </p>
          </div>
        </section>
      </section>
    </PageLayout>
  );
}
