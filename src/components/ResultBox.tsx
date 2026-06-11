type ResultBoxProps = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export function ResultBox({ label, value, emphasis = false }: ResultBoxProps) {
  return (
    <div
      aria-live="polite"
      role="status"
      className={`rounded-lg border p-4 ${
        emphasis
          ? "border-brand-100 bg-brand-50"
          : "border-line bg-white"
      }`}
    >
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p
        className={`mt-2 text-2xl font-black tracking-tight ${
          emphasis ? "text-brand-700" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
