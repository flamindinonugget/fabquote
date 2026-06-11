import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_0.8fr] lg:px-8">
        <div>
          <p className="text-base font-bold text-ink">FabQuote</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Instant STL quoting for makers, print farms, and small 3D print
            businesses that need professional estimates before a print leaves
            the slicer.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-3 text-sm font-semibold text-muted md:justify-end"
          aria-label="Workspace and calculator links"
        >
          <Link className="hover:text-ink" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-ink" href="/dashboard/analytics">
            Analytics
          </Link>
          <Link className="hover:text-ink" href="/customers">
            Customers
          </Link>
          <Link className="hover:text-ink" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-ink" href="/machines">
            Machines
          </Link>
          <Link className="hover:text-ink" href="/quote-test-lab">
            Quote Lab
          </Link>
          <Link className="hover:text-ink" href="/quotes">
            Quotes
          </Link>
          <Link className="hover:text-ink" href="/stl-quote-generator">
            STL Quote
          </Link>
          <Link className="hover:text-ink" href="/3d-print-cost-calculator">
            Print Cost
          </Link>
          <Link className="hover:text-ink" href="/filament-usage-calculator">
            Filament
          </Link>
          <Link className="hover:text-ink" href="/electricity-cost-calculator">
            Electricity
          </Link>
          <Link className="hover:text-ink" href="/profit-margin-calculator">
            Profit
          </Link>
          <Link className="hover:text-ink" href="/pricing">
            Pricing
          </Link>
          <Link className="hover:text-ink" href="/about">
            About
          </Link>
          <Link className="hover:text-ink" href="/contact">
            Contact
          </Link>
        </nav>
        <nav
          className="flex flex-wrap gap-3 text-sm font-semibold text-muted md:justify-end"
          aria-label="Legal links"
        >
          <Link className="hover:text-ink" href="/privacy-policy">
            Privacy
          </Link>
          <Link className="hover:text-ink" href="/terms-of-service">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
