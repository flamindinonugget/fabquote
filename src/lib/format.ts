export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNumber(value));
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(safeNumber(value));
}

export function formatPercent(value: number) {
  return `${formatNumber(value, 1)}%`;
}

export function safeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}
