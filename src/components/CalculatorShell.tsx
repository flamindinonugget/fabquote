type CalculatorShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function CalculatorShell({
  title,
  description,
  children,
}: CalculatorShellProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
          Calculator
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          {description}
        </p>
      </div>
      <div className="mt-8 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6 lg:p-8">
        {children}
      </div>
    </section>
  );
}
