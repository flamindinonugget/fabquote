"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateHistoricalQuoteIntelligence,
  type HistoricalQuoteIntelligence as HistoricalQuoteIntelligenceResult,
} from "@/lib/businessIntelligence";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { StlQuoteInputs, StlQuoteResults } from "@/lib/stlQuote";
import { quoteRepository, workspaceChangeEvent, type Quote } from "@/lib/workspace";

type HistoricalQuoteIntelligenceProps = {
  inputs: StlQuoteInputs;
  results: StlQuoteResults;
};

export function HistoricalQuoteIntelligence({
  inputs,
  results,
}: HistoricalQuoteIntelligenceProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const loadQuotes = () => setQuotes(quoteRepository.list());

  useEffect(() => {
    loadQuotes();
    window.addEventListener(workspaceChangeEvent, loadQuotes);

    return () => window.removeEventListener(workspaceChangeEvent, loadQuotes);
  }, []);

  const intelligence = useMemo(
    () =>
      calculateHistoricalQuoteIntelligence(quotes, {
        material: inputs.materialType,
        estimatedWeight: results.estimatedFilamentUsedGrams,
        estimatedPrintTime: inputs.estimatedPrintTimeHours,
        finalPrice: results.recommendedDirectSalePrice,
        markupPercentage:
          inputs.pricingMode === "markup"
            ? inputs.markupPercentage
            : inputs.targetProfitMarginPercentage,
      }),
    [inputs, quotes, results],
  );

  return (
    <section
      className="rounded-lg border border-line bg-white p-4 shadow-soft"
      aria-labelledby="historical-intelligence-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="historical-intelligence-heading"
            className="text-lg font-black tracking-tight text-ink"
          >
            Historical Quote Intelligence
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Compares this quote against local saved quotes with similar material,
            weight, and print time.
          </p>
        </div>
        <span className="rounded-md bg-paper px-3 py-2 text-sm font-black text-ink">
          {intelligence.similarQuotes.length} similar
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <HistoryMetric
          label="Historical Average Price"
          value={formatCurrency(intelligence.historicalAveragePrice)}
        />
        <HistoryMetric
          label="Historical Average Profit"
          value={formatCurrency(intelligence.historicalAverageProfit)}
        />
        <HistoryMetric
          label="Historical Average Markup"
          value={formatPercent(intelligence.historicalAverageMarkup)}
        />
      </div>

      <HistoricalRecommendations intelligence={intelligence} />
    </section>
  );
}

function HistoricalRecommendations({
  intelligence,
}: {
  intelligence: HistoricalQuoteIntelligenceResult;
}) {
  return (
    <div className="mt-4 rounded-md border border-line bg-paper p-3">
      <p className="text-sm font-black text-ink">Recommendations</p>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-muted">
        {intelligence.recommendations.map((recommendation) => (
          <li key={recommendation}>{recommendation}</li>
        ))}
      </ul>
      {intelligence.similarQuotes.length ? (
        <p className="mt-3 text-xs font-bold uppercase text-muted">
          Price variance: {formatNumber(intelligence.priceDifferencePercentage, 1)}%
          {" | "}Markup variance:{" "}
          {formatNumber(intelligence.markupDifferencePercentage, 1)}%
        </p>
      ) : null}
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-md border border-line bg-paper p-3">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-2 text-xl font-black tracking-tight text-ink">{value}</p>
    </article>
  );
}
