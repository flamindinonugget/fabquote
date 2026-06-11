import type { Customer, MaterialType, Quote } from "@/lib/workspace";

export type MetricPoint = {
  label: string;
  value: number;
};

export type RankedCustomer = {
  id: string;
  name: string;
  quotes: number;
  revenue: number;
};

export type QuoteAnalytics = {
  totalQuotes: number;
  totalQuotedRevenue: number;
  averageMarkup: number;
  averageEstimatedProfit: number;
  averagePrintTime: number;
  averageMaterialCost: number;
  revenueByMonth: MetricPoint[];
  quotesByMaterial: MetricPoint[];
  quotesByMachine: MetricPoint[];
  topCustomers: RankedCustomer[];
  topMaterials: MetricPoint[];
  highestQuote: Quote | null;
  lowestQuote: Quote | null;
};

export type HistoricalQuoteInput = {
  material: MaterialType;
  estimatedWeight: number;
  estimatedPrintTime: number;
  finalPrice: number;
  markupPercentage: number;
};

export type HistoricalQuoteIntelligence = {
  similarQuotes: Quote[];
  historicalAveragePrice: number;
  historicalAverageProfit: number;
  historicalAverageMarkup: number;
  priceDifferencePercentage: number;
  markupDifferencePercentage: number;
  recommendations: string[];
};

const similarWeightTolerance = 0.35;
const similarPrintTimeTolerance = 0.35;
const comparisonThreshold = 15;

export function calculateQuoteAnalytics(
  quotes: Quote[],
  customers: Customer[],
): QuoteAnalytics {
  const totalQuotes = quotes.length;
  const totalQuotedRevenue = sum(quotes.map((quote) => quote.finalPrice));
  const customersById = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  );
  const revenueByMonth = Array.from(
    groupValues(quotes, monthLabel, (quote) => quote.finalPrice),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => first.label.localeCompare(second.label));
  const quotesByMaterial = sortPointsDescending(
    Array.from(
      groupValues(quotes, (quote) => quote.material, () => 1),
    ).map(([label, value]) => ({ label, value })),
  );
  const quotesByMachine = sortPointsDescending(
    Array.from(
      groupValues(quotes, machineLabel, () => 1),
    ).map(([label, value]) => ({ label, value })),
  );
  const topMaterials = sortPointsDescending(
    Array.from(
      groupValues(quotes, (quote) => quote.material, (quote) => quote.finalPrice),
    ).map(([label, value]) => ({ label, value })),
  );

  return {
    totalQuotes,
    totalQuotedRevenue,
    averageMarkup: average(quotes.map((quote) => quote.markupPercentage)),
    averageEstimatedProfit: average(quotes.map(calculateQuoteProfit)),
    averagePrintTime: average(quotes.map((quote) => quote.estimatedPrintTime)),
    averageMaterialCost: average(quotes.map((quote) => quote.materialCost)),
    revenueByMonth,
    quotesByMaterial,
    quotesByMachine,
    topCustomers: calculateTopCustomers(quotes, customersById),
    topMaterials,
    highestQuote: quoteByPrice(quotes, "highest"),
    lowestQuote: quoteByPrice(quotes, "lowest"),
  };
}

export function calculateHistoricalQuoteIntelligence(
  quotes: Quote[],
  currentQuote: HistoricalQuoteInput,
): HistoricalQuoteIntelligence {
  const similarQuotes = quotes.filter((quote) =>
    isSimilarQuote(quote, currentQuote),
  );
  const historicalAveragePrice = average(
    similarQuotes.map((quote) => quote.finalPrice),
  );
  const historicalAverageProfit = average(
    similarQuotes.map(calculateQuoteProfit),
  );
  const historicalAverageMarkup = average(
    similarQuotes.map((quote) => quote.markupPercentage),
  );
  const priceDifferencePercentage = percentDifference(
    currentQuote.finalPrice,
    historicalAveragePrice,
  );
  const markupDifferencePercentage = percentDifference(
    currentQuote.markupPercentage,
    historicalAverageMarkup,
  );
  const recommendations = buildHistoricalRecommendations({
    currentQuote,
    historicalAveragePrice,
    historicalAverageMarkup,
    priceDifferencePercentage,
    markupDifferencePercentage,
    similarQuotes,
  });

  return {
    similarQuotes,
    historicalAveragePrice,
    historicalAverageProfit,
    historicalAverageMarkup,
    priceDifferencePercentage,
    markupDifferencePercentage,
    recommendations,
  };
}

export function calculateQuoteProfit(quote: Quote) {
  return (
    quote.finalPrice -
    quote.materialCost -
    quote.electricityCost -
    quote.laborCost -
    quote.shippingCost -
    quote.riskBuffer
  );
}

function buildHistoricalRecommendations({
  currentQuote,
  historicalAveragePrice,
  historicalAverageMarkup,
  priceDifferencePercentage,
  markupDifferencePercentage,
  similarQuotes,
}: {
  currentQuote: HistoricalQuoteInput;
  historicalAveragePrice: number;
  historicalAverageMarkup: number;
  priceDifferencePercentage: number;
  markupDifferencePercentage: number;
  similarQuotes: Quote[];
}) {
  if (!similarQuotes.length) {
    return [
      "Save more quotes with similar material, weight, and print time to unlock historical pricing guidance.",
    ];
  }

  const recommendations = [
    `Similar jobs averaged ${formatCurrencyShort(historicalAveragePrice)}.`,
  ];

  if (Math.abs(priceDifferencePercentage) > comparisonThreshold) {
    const direction = priceDifferencePercentage < 0 ? "below" : "above";
    recommendations.push(
      `Current quote is ${Math.abs(priceDifferencePercentage).toFixed(0)}% ${direction} historical average.`,
    );
  }

  if (
    historicalAverageMarkup > 0 &&
    markupDifferencePercentage < -comparisonThreshold
  ) {
    recommendations.push("Current markup is unusually low.");
  }

  if (
    historicalAverageMarkup > 0 &&
    markupDifferencePercentage > comparisonThreshold
  ) {
    recommendations.push("Current markup is unusually high for similar work.");
  }

  if (currentQuote.finalPrice <= 0) {
    recommendations.push("Current quote price is missing or zero.");
  }

  return recommendations;
}

function isSimilarQuote(quote: Quote, currentQuote: HistoricalQuoteInput) {
  if (quote.material !== currentQuote.material) {
    return false;
  }

  return (
    withinTolerance(
      quote.estimatedWeight,
      currentQuote.estimatedWeight,
      similarWeightTolerance,
    ) &&
    withinTolerance(
      quote.estimatedPrintTime,
      currentQuote.estimatedPrintTime,
      similarPrintTimeTolerance,
    )
  );
}

function withinTolerance(value: number, target: number, tolerance: number) {
  if (target <= 0) {
    return value <= 0;
  }

  return Math.abs(value - target) / target <= tolerance;
}

function percentDifference(value: number, baseline: number) {
  if (baseline <= 0) {
    return 0;
  }

  return ((value - baseline) / baseline) * 100;
}

function calculateTopCustomers(
  quotes: Quote[],
  customersById: Map<string, string>,
) {
  const grouped = new Map<string, RankedCustomer>();

  quotes.forEach((quote) => {
    const id = quote.customerId || "no-customer";
    const current = grouped.get(id) || {
      id,
      name: quote.customerId
        ? customersById.get(quote.customerId) || "Unknown customer"
        : "No customer",
      quotes: 0,
      revenue: 0,
    };

    grouped.set(id, {
      ...current,
      quotes: current.quotes + 1,
      revenue: current.revenue + quote.finalPrice,
    });
  });

  return Array.from(grouped.values())
    .sort((first, second) => second.revenue - first.revenue)
    .slice(0, 5);
}

function groupValues(
  quotes: Quote[],
  getLabel: (quote: Quote) => string,
  getValue: (quote: Quote) => number,
) {
  const grouped = new Map<string, number>();

  quotes.forEach((quote) => {
    const label = getLabel(quote) || "Unknown";
    grouped.set(label, (grouped.get(label) || 0) + getValue(quote));
  });

  return grouped;
}

function monthLabel(quote: Quote) {
  const date = new Date(quote.createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function machineLabel(quote: Quote) {
  return quote.machineName || "No machine";
}

function quoteByPrice(quotes: Quote[], mode: "highest" | "lowest") {
  if (!quotes.length) {
    return null;
  }

  return [...quotes].sort((first, second) =>
    mode === "highest"
      ? second.finalPrice - first.finalPrice
      : first.finalPrice - second.finalPrice,
  )[0];
}

function sortPointsDescending(points: MetricPoint[]) {
  return points.sort((first, second) => second.value - first.value);
}

function average(values: number[]) {
  const finiteValues = values.filter(Number.isFinite);

  if (!finiteValues.length) {
    return 0;
  }

  return sum(finiteValues) / finiteValues.length;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function formatCurrencyShort(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
