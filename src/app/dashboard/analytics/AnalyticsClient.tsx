"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  calculateQuoteAnalytics,
  calculateQuoteProfit,
  type MetricPoint,
  type RankedCustomer,
} from "@/lib/businessIntelligence";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import {
  customerRepository,
  quoteRepository,
  workspaceChangeEvent,
  type Customer,
  type Quote,
} from "@/lib/workspace";

export function AnalyticsClient() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const loadAnalyticsData = () => {
    setQuotes(quoteRepository.list());
    setCustomers(customerRepository.list());
  };

  useEffect(() => {
    loadAnalyticsData();
    window.addEventListener(workspaceChangeEvent, loadAnalyticsData);

    return () =>
      window.removeEventListener(workspaceChangeEvent, loadAnalyticsData);
  }, []);

  const analytics = useMemo(
    () => calculateQuoteAnalytics(quotes, customers),
    [customers, quotes],
  );

  if (!analytics.totalQuotes) {
    return (
      <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black tracking-tight text-ink">
          No analytics yet
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Save quotes from the STL Quote Generator or Quotes page to unlock
          revenue, material, customer, and machine intelligence.
        </p>
        <Link
          href="/stl-quote-generator"
          className="mt-5 inline-flex rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          Create first quote
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Analytics summary"
      >
        <MetricCard label="Total quotes" value={String(analytics.totalQuotes)} />
        <MetricCard
          label="Total quoted revenue"
          value={formatCurrency(analytics.totalQuotedRevenue)}
        />
        <MetricCard
          label="Average markup"
          value={formatPercent(analytics.averageMarkup)}
        />
        <MetricCard
          label="Average estimated profit"
          value={formatCurrency(analytics.averageEstimatedProfit)}
        />
        <MetricCard
          label="Average print time"
          value={`${formatNumber(analytics.averagePrintTime, 1)} hrs`}
        />
        <MetricCard
          label="Average material cost"
          value={formatCurrency(analytics.averageMaterialCost)}
        />
        <QuoteExtremes title="Highest quote" quote={analytics.highestQuote} />
        <QuoteExtremes title="Lowest quote" quote={analytics.lowestQuote} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <BarPanel
          title="Revenue by month"
          valueLabel="Revenue"
          points={analytics.revenueByMonth}
          formatter={formatCurrency}
        />
        <BarPanel
          title="Quotes by material"
          valueLabel="Quotes"
          points={analytics.quotesByMaterial}
          formatter={(value) => formatNumber(value, 0)}
        />
        <BarPanel
          title="Quotes by machine"
          valueLabel="Quotes"
          points={analytics.quotesByMachine}
          formatter={(value) => formatNumber(value, 0)}
        />
        <BarPanel
          title="Top materials"
          valueLabel="Revenue"
          points={analytics.topMaterials}
          formatter={formatCurrency}
        />
      </div>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Top customers
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Ranked by quoted revenue from local saved quotes.
            </p>
          </div>
          <Link
            href="/customers"
            className="text-sm font-bold text-brand-700 hover:text-ink"
          >
            Customers
          </Link>
        </div>
        <div className="mt-5 grid gap-3">
          {analytics.topCustomers.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-ink">{value}</p>
    </article>
  );
}

function QuoteExtremes({
  title,
  quote,
}: {
  title: string;
  quote: Quote | null;
}) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <p className="text-sm font-bold text-muted">{title}</p>
      {quote ? (
        <>
          <p className="mt-3 text-2xl font-black tracking-tight text-ink">
            {formatCurrency(quote.finalPrice)}
          </p>
          <p className="mt-1 text-sm font-semibold text-muted">
            {quote.quoteNumber} | {quote.material} |{" "}
            {formatCurrency(calculateQuoteProfit(quote))} profit
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm font-semibold text-muted">No quote data.</p>
      )}
    </article>
  );
}

function BarPanel({
  title,
  valueLabel,
  points,
  formatter,
}: {
  title: string;
  valueLabel: string;
  points: MetricPoint[];
  formatter: (value: number) => string;
}) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black tracking-tight text-ink">{title}</h2>
      <div className="mt-5 grid gap-3">
        {points.length ? (
          points.slice(0, 8).map((point) => (
            <article key={point.label} className="grid gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-bold text-ink">{point.label}</p>
                <p className="font-semibold text-muted">
                  {valueLabel}: {formatter(point.value)}
                </p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-paper">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${Math.max((point.value / maxValue) * 100, 4)}%` }}
                />
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-md border border-line bg-paper p-4 text-sm font-semibold text-muted">
            No data yet.
          </p>
        )}
      </div>
    </section>
  );
}

function CustomerRow({ customer }: { customer: RankedCustomer }) {
  return (
    <article className="rounded-md border border-line bg-paper p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-ink">{customer.name}</p>
          <p className="mt-1 text-sm font-semibold text-muted">
            {customer.quotes} {customer.quotes === 1 ? "quote" : "quotes"}
          </p>
        </div>
        <p className="text-2xl font-black tracking-tight text-brand-700">
          {formatCurrency(customer.revenue)}
        </p>
      </div>
    </article>
  );
}
