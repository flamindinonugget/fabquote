"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/stl-quote-generator", label: "STL Quote Generator" },
  { href: "/customers", label: "Customers" },
  { href: "/projects", label: "Projects" },
  { href: "/machines", label: "Machines" },
  { href: "/quote-test-lab", label: "Quote Lab" },
  { href: "/quotes", label: "Quotes" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-100"
          aria-label="FabQuote home"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/assets/fabquote-logo-horizontal.png"
            alt="FabQuote"
            width={430}
            height={100}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink shadow-sm transition hover:bg-paper focus:outline-none focus:ring-4 focus:ring-brand-100 xl:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="flex w-5 flex-col gap-1">
            <span className="h-0.5 rounded bg-current" />
            <span className="h-0.5 rounded bg-current" />
            <span className="h-0.5 rounded bg-current" />
          </span>
        </button>

        <div className="hidden min-w-0 items-center gap-3 xl:flex">
          <nav
            className="flex min-w-0 items-center gap-1 rounded-lg border border-line bg-paper p-1 shadow-sm"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold no-underline transition focus:outline-none focus:ring-4 focus:ring-brand-100 ${
                    isActive
                      ? "bg-white text-brand-700 shadow-sm"
                      : "text-muted hover:bg-white hover:text-ink"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/pricing"
            className="fq-button-primary whitespace-nowrap px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-100"
          >
            Start Pro
          </Link>
        </div>
      </div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-line bg-white px-4 py-3 shadow-soft xl:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto grid max-w-6xl gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-md px-3 py-3 text-sm font-bold no-underline transition focus:outline-none focus:ring-4 focus:ring-brand-100 ${
                    isActive
                      ? "bg-brand-50 text-brand-700 shadow-sm"
                      : "text-muted hover:bg-paper hover:text-ink"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
