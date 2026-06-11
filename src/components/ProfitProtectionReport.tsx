import type {
  ProfitWarning,
  ProfitWarningSeverity,
  QuoteAnalysis,
} from "@/lib/quoteAnalyzer";

type ProfitProtectionReportProps = {
  analysis: QuoteAnalysis;
  headingId?: string;
};

const severityStyles: Record<
  ProfitWarningSeverity,
  { label: string; wrapper: string; badge: string }
> = {
  info: {
    label: "Info",
    wrapper: "border-brand-100 bg-brand-50",
    badge: "bg-white text-brand-700",
  },
  warning: {
    label: "Warning",
    wrapper: "border-amber-100 bg-amber-50",
    badge: "bg-white text-amber-700",
  },
  critical: {
    label: "Critical",
    wrapper: "border-coral-50 bg-coral-50",
    badge: "bg-white text-coral-700",
  },
};

export function ProfitProtectionReport({
  analysis,
  headingId = "profit-protection-heading",
}: ProfitProtectionReportProps) {
  const confidenceTone =
    analysis.confidence.score >= 80
      ? "text-mint-700"
      : analysis.confidence.score >= 60
        ? "text-amber-700"
        : "text-coral-700";

  return (
    <section
      className="rounded-lg border border-line bg-white p-4 shadow-soft"
      aria-labelledby={headingId}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id={headingId}
            className="text-lg font-black tracking-tight text-ink"
          >
            Profit Protection Report
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Deterministic checks for common quote risks before you send pricing.
          </p>
        </div>
        <div className="rounded-md border border-line bg-paper px-3 py-2 text-right">
          <p className="text-xs font-bold uppercase text-muted">
            Quote Confidence
          </p>
          <p className={`text-2xl font-black ${confidenceTone}`}>
            {analysis.confidence.score}/100
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {analysis.warnings.length ? (
          analysis.warnings.map((warning) => (
            <WarningItem key={warning.code} warning={warning} />
          ))
        ) : (
          <p className="rounded-md border border-mint-50 bg-mint-50 p-3 text-sm font-semibold text-mint-700">
            No profit protection warnings found for the current quote.
          </p>
        )}
      </div>

      {analysis.confidence.suggestions.length ? (
        <div className="mt-4 rounded-md border border-line bg-paper p-3">
          <p className="text-sm font-black text-ink">
            Improve confidence
          </p>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-muted">
            {analysis.confidence.suggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-mint-50 bg-mint-50 p-3 text-sm font-semibold text-mint-700">
          Confidence inputs look complete. Verify final values against your slicer.
        </p>
      )}
    </section>
  );
}

function WarningItem({ warning }: { warning: ProfitWarning }) {
  const styles = severityStyles[warning.severity];

  return (
    <article className={`rounded-md border p-3 ${styles.wrapper}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded px-2 py-1 text-xs font-bold ${styles.badge}`}>
          {styles.label}
        </span>
        <p className="text-sm font-black text-ink">{warning.code}</p>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink">
        {warning.message}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted">
        <span className="font-bold text-ink">Suggested fix: </span>
        {warning.recommendation}
      </p>
    </article>
  );
}
