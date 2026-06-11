export function CalculatorLoading() {
  return (
    <div
      className="grid gap-8 lg:grid-cols-[1fr_0.9fr]"
      role="status"
      aria-label="Loading calculator"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-32 rounded bg-line" />
            <div className="h-12 rounded-md bg-paper" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-line bg-white p-4">
            <div className="h-4 w-28 rounded bg-line" />
            <div className="mt-3 h-8 w-24 rounded bg-paper" />
          </div>
        ))}
      </div>
    </div>
  );
}
