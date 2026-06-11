type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  onChange: (value: string) => void;
};

export function TextField({
  id,
  label,
  value,
  type = "text",
  onChange,
}: TextFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-brand-500 focus:ring-brand-500"
      />
    </label>
  );
}
