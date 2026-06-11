type InputFieldProps = {
  id: string;
  label: string;
  value: number;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
};

export function InputField({
  id,
  label,
  value,
  min = 0,
  step = 0.01,
  prefix,
  suffix,
  onChange,
}: InputFieldProps) {
  const descriptionId = suffix || prefix ? `${id}-description` : undefined;

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <span className="relative block">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-describedby={descriptionId}
          className={`h-12 w-full rounded-md border-line bg-white text-base font-medium text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-brand-500 focus:ring-brand-500 ${
            prefix ? "pl-8 pr-3" : "px-3"
          } ${suffix ? "pr-16" : ""}`}
        />
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-muted">
            {prefix}
          </span>
        ) : null}
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-muted">
            {suffix}
          </span>
        ) : null}
      </span>
      {descriptionId ? (
        <span id={descriptionId} className="sr-only">
          {prefix ? `Value is entered in ${prefix === "$" ? "US dollars" : prefix}.` : ""}
          {suffix ? ` Value is entered in ${suffix}.` : ""}
        </span>
      ) : null}
    </label>
  );
}
