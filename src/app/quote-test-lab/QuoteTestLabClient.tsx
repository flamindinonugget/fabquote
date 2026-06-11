"use client";

import { useRouter } from "next/navigation";
import { ProfitProtectionReport } from "@/components/ProfitProtectionReport";
import { writeString } from "@/lib/browserStorage";
import { analyzeQuote } from "@/lib/quoteAnalyzer";
import {
  quoteTestLabStorageKey,
  quoteTestScenarios,
  type QuoteTestScenario,
} from "@/lib/quoteTestScenarios";

export function QuoteTestLabClient() {
  const router = useRouter();

  const loadScenario = (scenario: QuoteTestScenario) => {
    const wasStored = writeString(
      quoteTestLabStorageKey,
      JSON.stringify({
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        machineName: scenario.machineName,
        stlInputs: scenario.stlInputs,
      }),
    );

    if (wasStored) {
      router.push("/stl-quote-generator");
    }
  };

  return (
    <div className="grid gap-5">
      {quoteTestScenarios.map((scenario, index) => {
        const analysis = analyzeQuote(scenario.analyzerInput);

        return (
          <article
            key={scenario.id}
            className="rounded-lg border border-line bg-white p-5 shadow-soft"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
                  Scenario {index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
                  {scenario.name}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  {scenario.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadScenario(scenario)}
                className="rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                Load this scenario into STL Quote Generator
              </button>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <section
                className="rounded-lg border border-line bg-paper p-4"
                aria-labelledby={`${scenario.id}-inputs`}
              >
                <h3
                  id={`${scenario.id}-inputs`}
                  className="text-lg font-black tracking-tight text-ink"
                >
                  Quote inputs
                </h3>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <InputRow label="Material" value={scenario.analyzerInput.material} />
                  <InputRow
                    label="Estimated weight"
                    value={`${formatNumber(scenario.analyzerInput.estimatedWeight)} g`}
                  />
                  <InputRow
                    label="Estimated print time"
                    value={`${formatNumber(scenario.analyzerInput.estimatedPrintTime)} hrs`}
                  />
                  <InputRow
                    label="Material cost"
                    value={money(scenario.analyzerInput.materialCost)}
                  />
                  <InputRow
                    label="Electricity cost"
                    value={money(scenario.analyzerInput.electricityCost)}
                  />
                  <InputRow
                    label="Labor cost"
                    value={money(scenario.analyzerInput.laborCost)}
                  />
                  <InputRow
                    label="Shipping cost"
                    value={money(scenario.analyzerInput.shippingCost)}
                  />
                  <InputRow
                    label="Machine profile"
                    value={scenario.machineName || "None"}
                  />
                  <InputRow
                    label="Markup"
                    value={`${formatNumber(scenario.analyzerInput.markup)}%`}
                  />
                  <InputRow
                    label="Failure risk"
                    value={`${formatNumber(scenario.analyzerInput.failureRisk)}%`}
                  />
                  <InputRow
                    label="Final price"
                    value={money(scenario.analyzerInput.finalPrice)}
                  />
                  <InputRow
                    label="Customer"
                    value={scenario.customerId ? "Attached" : "Missing"}
                  />
                </dl>
              </section>

              <ProfitProtectionReport
                analysis={analysis}
                headingId={`${scenario.id}-profit-protection`}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function InputRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-muted">{label}</dt>
      <dd className="mt-1 font-bold text-ink">{value || "-"}</dd>
    </div>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}
