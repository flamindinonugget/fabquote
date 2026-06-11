import Link from "next/link";

type CalculatorCardProps = {
  title: string;
  description: string;
  href: string;
  accent: "brand" | "mint" | "amber" | "coral";
};

const accentStyles = {
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  mint: "bg-mint-50 text-mint-700 border-mint-50",
  amber: "bg-amber-50 text-amber-700 border-amber-50",
  coral: "bg-coral-50 text-coral-700 border-coral-50",
};

export function CalculatorCard({
  title,
  description,
  href,
  accent,
}: CalculatorCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-brand-100"
    >
      <div
        className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border text-lg font-black ${accentStyles[accent]}`}
        aria-hidden="true"
      >
        {title.charAt(0)}
      </div>
      <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <p className="mt-5 text-sm font-bold text-brand-700 group-hover:text-brand-600">
        Open calculator
      </p>
    </Link>
  );
}
