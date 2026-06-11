"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  customerRepository,
  formatWorkspaceDate,
  projectRepository,
  quoteRepository,
  sortByDateDescending,
  workspaceChangeEvent,
  type Customer,
  type Project,
  type Quote,
} from "@/lib/workspace";

export function DashboardClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const loadWorkspace = () => {
    setCustomers(customerRepository.list());
    setProjects(projectRepository.list());
    setQuotes(quoteRepository.list());
  };

  useEffect(() => {
    loadWorkspace();

    window.addEventListener(workspaceChangeEvent, loadWorkspace);

    return () =>
      window.removeEventListener(workspaceChangeEvent, loadWorkspace);
  }, []);

  const recentCustomers = useMemo(
    () => sortByDateDescending(customers).slice(0, 5),
    [customers],
  );
  const recentProjects = useMemo(
    () => sortByDateDescending(projects).slice(0, 5),
    [projects],
  );
  const recentQuotes = useMemo(
    () => sortByDateDescending(quotes).slice(0, 5),
    [quotes],
  );
  const totalQuoteValue = quotes.reduce(
    (total, quote) => total + quote.finalPrice,
    0,
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total saved quotes" value={String(quotes.length)} />
        <MetricCard label="Total customers" value={String(customers.length)} />
        <MetricCard label="Total projects" value={String(projects.length)} />
        <MetricCard label="Quoted value" value={money(totalQuoteValue)} />
      </div>

      <div className="rounded-lg border border-line bg-paper p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-ink">Quick create</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Add local records now. Authentication and shared storage come later.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <QuickLink href="/dashboard/analytics" label="View analytics" />
            <QuickLink href="/customers" label="New customer" />
            <QuickLink href="/projects" label="New project" />
            <QuickLink href="/stl-quote-generator" label="Create quote" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentPanel
          title="Recent quotes"
          href="/quotes"
          empty="No quotes saved yet."
          items={recentQuotes.map((quote) => ({
            id: quote.id,
            title: quote.quoteNumber,
            detail: `${money(quote.finalPrice)} final price`,
            date: quote.updatedAt,
          }))}
        />
        <RecentPanel
          title="Recent customers"
          href="/customers"
          empty="No customers saved yet."
          items={recentCustomers.map((customer) => ({
            id: customer.id,
            title: customer.name,
            detail: customer.company || customer.email || "Customer record",
            date: customer.updatedAt,
          }))}
        />
        <RecentPanel
          title="Recent projects"
          href="/projects"
          empty="No projects saved yet."
          items={recentProjects.map((project) => ({
            id: project.id,
            title: project.projectName,
            detail: `${project.stlFileName || "No STL file"} | ${project.material}`,
            date: project.updatedAt,
          }))}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-ink">{value}</p>
    </article>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
    >
      {label}
    </Link>
  );
}

function RecentPanel({
  title,
  href,
  empty,
  items,
}: {
  title: string;
  href: string;
  empty: string;
  items: Array<{ id: string; title: string; detail: string; date: string }>;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black tracking-tight text-ink">{title}</h2>
        <Link href={href} className="text-sm font-bold text-brand-700 hover:text-ink">
          View all
        </Link>
      </div>
      <div className="mt-5 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="rounded-md border border-line bg-paper p-3">
              <p className="font-bold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
              <p className="mt-2 text-xs font-bold uppercase text-muted">
                {formatWorkspaceDate(item.date)}
              </p>
            </article>
          ))
        ) : (
          <p className="rounded-md border border-line bg-paper p-4 text-sm font-semibold text-muted">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
