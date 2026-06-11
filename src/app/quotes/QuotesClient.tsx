"use client";

import { useEffect, useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { TextField } from "@/components/TextField";
import {
  createQuoteNumber,
  customerRepository,
  formatWorkspaceDate,
  materialTypes,
  projectRepository,
  quoteRepository,
  type Customer,
  type MaterialType,
  type Project,
  type Quote,
  type QuoteInput,
  type QuoteStatus,
} from "@/lib/workspace";

type SortKey = "newest" | "oldest" | "name" | "price";

const quoteStatuses: QuoteStatus[] = ["draft", "sent", "accepted", "declined"];

const emptyQuote = (): QuoteInput => ({
  quoteNumber: createQuoteNumber(),
  customerId: "",
  projectId: "",
  stlFileName: "",
  material: "PLA",
  estimatedWeight: 0,
  estimatedPrintTime: 0,
  materialCost: 0,
  electricityCost: 0,
  laborCost: 0,
  shippingCost: 0,
  riskBuffer: 0,
  markupPercentage: 100,
  finalPrice: 0,
  status: "draft",
  notes: "",
});

export function QuotesClient() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<QuoteInput>(emptyQuote);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [error, setError] = useState("");

  const loadWorkspace = () => {
    setQuotes(quoteRepository.list());
    setCustomers(customerRepository.list());
    setProjects(projectRepository.list());
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const customerNames = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer.name])),
    [customers],
  );
  const projectNames = useMemo(
    () =>
      new Map(projects.map((project) => [project.id, project.projectName])),
    [projects],
  );

  const filteredQuotes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return quotes
      .filter((quote) =>
        [
          quote.quoteNumber,
          quote.stlFileName,
          quote.material,
          quote.status,
          quote.notes,
          customerNames.get(quote.customerId) || "",
          projectNames.get(quote.projectId) || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .sort((first, second) => {
        if (sortKey === "name") {
          return first.quoteNumber.localeCompare(second.quoteNumber);
        }

        if (sortKey === "price") {
          return second.finalPrice - first.finalPrice;
        }

        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();

        return sortKey === "newest" ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [customerNames, projectNames, quotes, search, sortKey]);

  const updateForm = <Field extends keyof QuoteInput>(
    field: Field,
    value: QuoteInput[Field],
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      return {
        ...next,
        finalPrice: calculateFinalPrice(next),
      };
    });
    setError("");
  };

  const saveQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.quoteNumber.trim()) {
      setError("Quote number is required.");
      return;
    }

    quoteRepository.create({
      ...form,
      quoteNumber: form.quoteNumber.trim(),
      stlFileName: form.stlFileName.trim(),
      finalPrice: calculateFinalPrice(form),
    });
    setForm(emptyQuote());
    loadWorkspace();
  };

  const deleteQuote = (quote: Quote) => {
    if (window.confirm(`Delete quote ${quote.quoteNumber}? This cannot be undone.`)) {
      quoteRepository.remove(quote.id);
      loadWorkspace();
    }
  };

  const duplicateQuote = (quote: Quote) => {
    quoteRepository.duplicate(quote.id);
    loadWorkspace();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={saveQuote}
        className="rounded-lg border border-line bg-white p-5 shadow-soft"
      >
        <h2 className="text-xl font-black tracking-tight text-ink">
          Add quote
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField
            id="quote-number"
            label="Quote number"
            value={form.quoteNumber}
            onChange={(value) => updateForm("quoteNumber", value)}
          />
          <SelectById
            id="quote-customer"
            label="Customer"
            value={form.customerId}
            emptyLabel="No customer"
            options={customers.map((customer) => ({
              id: customer.id,
              label: customer.name,
            }))}
            onChange={(value) => updateForm("customerId", value)}
          />
          <SelectById
            id="quote-project"
            label="Project"
            value={form.projectId}
            emptyLabel="No project"
            options={projects.map((project) => ({
              id: project.id,
              label: project.projectName,
            }))}
            onChange={(value) => updateForm("projectId", value)}
          />
          <TextField
            id="quote-stl-file"
            label="STL file name"
            value={form.stlFileName}
            onChange={(value) => updateForm("stlFileName", value)}
          />
          <MaterialSelect
            value={form.material}
            onChange={(value) => updateForm("material", value)}
          />
          <StatusSelect
            value={form.status}
            onChange={(value) => updateForm("status", value)}
          />
          <InputField
            id="estimated-weight"
            label="Estimated weight"
            value={form.estimatedWeight}
            suffix="g"
            onChange={(value) => updateForm("estimatedWeight", value)}
          />
          <InputField
            id="estimated-print-time"
            label="Estimated print time"
            value={form.estimatedPrintTime}
            suffix="hrs"
            onChange={(value) => updateForm("estimatedPrintTime", value)}
          />
          <InputField
            id="material-cost"
            label="Material cost"
            value={form.materialCost}
            prefix="$"
            onChange={(value) => updateForm("materialCost", value)}
          />
          <InputField
            id="electricity-cost"
            label="Electricity cost"
            value={form.electricityCost}
            prefix="$"
            onChange={(value) => updateForm("electricityCost", value)}
          />
          <InputField
            id="labor-cost"
            label="Labor cost"
            value={form.laborCost}
            prefix="$"
            onChange={(value) => updateForm("laborCost", value)}
          />
          <InputField
            id="shipping-cost"
            label="Shipping cost"
            value={form.shippingCost}
            prefix="$"
            onChange={(value) => updateForm("shippingCost", value)}
          />
          <InputField
            id="risk-buffer"
            label="Risk buffer"
            value={form.riskBuffer}
            prefix="$"
            onChange={(value) => updateForm("riskBuffer", value)}
          />
          <InputField
            id="markup-percentage"
            label="Markup percentage"
            value={form.markupPercentage}
            suffix="%"
            onChange={(value) => updateForm("markupPercentage", value)}
          />
          <label htmlFor="quote-notes" className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Notes
            </span>
            <textarea
              id="quote-notes"
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              rows={3}
              className="w-full rounded-md border-line bg-white px-3 py-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
            />
          </label>
          <div className="rounded-lg border border-line bg-brand-50 p-4 sm:col-span-2">
            <p className="text-sm font-bold text-brand-700">Final price</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-brand-700">
              {money(form.finalPrice)}
            </p>
          </div>
        </div>
        {error ? (
          <p className="mt-4 rounded-md border border-coral-50 bg-coral-50 p-3 text-sm font-semibold text-coral-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          Add quote
        </button>
      </form>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <ListControls
          search={search}
          sortKey={sortKey}
          onSearchChange={setSearch}
          onSortChange={setSortKey}
        />
        <div className="mt-5 grid gap-3">
          {filteredQuotes.length ? (
            filteredQuotes.map((quote) => (
              <article
                key={quote.id}
                className="rounded-lg border border-line bg-paper p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-ink">
                        {quote.quoteNumber}
                      </h3>
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-bold uppercase text-brand-700">
                        {quote.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-muted">
                      {customerNames.get(quote.customerId) || "No customer"} |{" "}
                      {projectNames.get(quote.projectId) || "No project"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {quote.stlFileName || "No STL file"} | {quote.material} |{" "}
                      {quote.estimatedWeight}g | {quote.estimatedPrintTime} hrs
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Machine: {quote.machineName || "No machine"}
                    </p>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <CostRow label="Material" value={quote.materialCost} />
                      <CostRow label="Electricity" value={quote.electricityCost} />
                      <CostRow label="Labor" value={quote.laborCost} />
                      <CostRow label="Shipping" value={quote.shippingCost} />
                      <CostRow label="Risk" value={quote.riskBuffer} />
                      <div>
                        <dt className="font-semibold text-muted">Markup</dt>
                        <dd className="font-bold text-ink">
                          {quote.markupPercentage}%
                        </dd>
                      </div>
                    </dl>
                    {quote.notes ? (
                      <p className="mt-3 text-sm leading-6 text-ink">
                        {quote.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <span className="text-xs font-bold uppercase text-muted">
                      {formatWorkspaceDate(quote.updatedAt)}
                    </span>
                    <span className="text-2xl font-black tracking-tight text-brand-700">
                      {money(quote.finalPrice)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => duplicateQuote(quote)}
                        className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-50"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuote(quote)}
                        className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-coral-700 transition hover:bg-coral-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-line bg-paper p-5 text-sm font-semibold text-muted">
              No quotes yet. Save one from the STL Quote Generator or add one here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function SelectById({
  id,
  label,
  value,
  emptyLabel,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  emptyLabel: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MaterialSelect({
  value,
  onChange,
}: {
  value: MaterialType;
  onChange: (value: MaterialType) => void;
}) {
  return (
    <label htmlFor="quote-material" className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">Material</span>
      <select
        id="quote-material"
        value={value}
        onChange={(event) => onChange(event.target.value as MaterialType)}
        className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
      >
        {materialTypes.map((material) => (
          <option key={material} value={material}>
            {material}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: QuoteStatus;
  onChange: (value: QuoteStatus) => void;
}) {
  return (
    <label htmlFor="quote-status" className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">Status</span>
      <select
        id="quote-status"
        value={value}
        onChange={(event) => onChange(event.target.value as QuoteStatus)}
        className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
      >
        {quoteStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

function ListControls({
  search,
  sortKey,
  onSearchChange,
  onSortChange,
}: {
  search: string;
  sortKey: SortKey;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-black tracking-tight text-ink">
          Saved quotes
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          View, duplicate, and remove locally saved quotes.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="quote-search" className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-muted">
            Search
          </span>
          <input
            id="quote-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
          />
        </label>
        <label htmlFor="quote-sort" className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-muted">
            Sort
          </span>
          <select
            id="quote-sort"
            value={sortKey}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="font-semibold text-muted">{label}</dt>
      <dd className="font-bold text-ink">{money(value)}</dd>
    </div>
  );
}

function calculateFinalPrice(input: QuoteInput) {
  const base =
    safeNumber(input.materialCost) +
    safeNumber(input.electricityCost) +
    safeNumber(input.laborCost) +
    safeNumber(input.shippingCost) +
    safeNumber(input.riskBuffer);

  return Number((base * (1 + safeNumber(input.markupPercentage) / 100)).toFixed(2));
}

function safeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
