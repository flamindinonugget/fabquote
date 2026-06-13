import Link from "next/link";

const footerLinkClass =
  "rounded-md px-2 py-1 font-bold text-muted no-underline transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100";

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
          <Link className={footerLinkClass} href="/dashboard">
            Dashboard
          </Link>
          <Link className={footerLinkClass} href="/dashboard/analytics">
            Analytics
          </Link>
          <Link className={footerLinkClass} href="/customers">
            Customers
          </Link>
          <Link className={footerLinkClass} href="/projects">
            Projects
          </Link>
          <Link className={footerLinkClass} href="/machines">
            Machines
          </Link>
          <Link className={footerLinkClass} href="/quote-test-lab">
            Quote Lab
          </Link>
          <Link className={footerLinkClass} href="/feedback-admin">
            Feedback
          </Link>
          <Link className={footerLinkClass} href="/quotes">
            Quotes
          </Link>
          <Link className={footerLinkClass} href="/stl-quote-generator">
            STL Quote
          </Link>
          <Link className={footerLinkClass} href="/3d-print-cost-calculator">
            Print Cost
          </Link>
          <Link className={footerLinkClass} href="/filament-usage-calculator">
            Filament
          </Link>
          <Link className={footerLinkClass} href="/electricity-cost-calculator">
            Electricity
          </Link>
          <Link className={footerLinkClass} href="/profit-margin-calculator">
            Profit
          </Link>
          <Link className={footerLinkClass} href="/pricing">
            Pricing
          </Link>
          <Link className={footerLinkClass} href="/about">
            About
          </Link>
          <Link className={footerLinkClass} href="/contact">
            Contact
          </Link>
        </nav>
        <nav
          className="flex flex-wrap gap-3 text-sm font-semibold text-muted md:justify-end"
          aria-label="Legal links"
        >
          <Link className={footerLinkClass} href="/privacy-policy">
            Privacy
          </Link>
          <Link className={footerLinkClass} href="/terms-of-service">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
