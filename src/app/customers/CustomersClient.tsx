"use client";

import { useEffect, useMemo, useState } from "react";
import { TextField } from "@/components/TextField";
import {
  customerRepository,
  formatWorkspaceDate,
  type Customer,
  type CustomerInput,
} from "@/lib/workspace";

type SortKey = "newest" | "oldest" | "name";

const emptyCustomer: CustomerInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  notes: "",
};

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CustomerInput>(emptyCustomer);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [error, setError] = useState("");

  const loadCustomers = () => setCustomers(customerRepository.list());

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return customers
      .filter((customer) =>
        [customer.name, customer.company, customer.email, customer.phone, customer.notes]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .sort((first, second) => {
        if (sortKey === "name") {
          return first.name.localeCompare(second.name);
        }

        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();

        return sortKey === "newest" ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [customers, search, sortKey]);

  const updateForm = <Field extends keyof CustomerInput>(
    field: Field,
    value: CustomerInput[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const saveCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    const input = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (editingId) {
      customerRepository.update(editingId, input);
    } else {
      customerRepository.create(input);
    }

    resetForm();
    loadCustomers();
  };

  const editCustomer = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      notes: customer.notes,
    });
    setError("");
  };

  const deleteCustomer = (customer: Customer) => {
    if (window.confirm(`Delete ${customer.name}? This cannot be undone.`)) {
      customerRepository.remove(customer.id);
      if (editingId === customer.id) {
        resetForm();
      }
      loadCustomers();
    }
  };

  const resetForm = () => {
    setForm(emptyCustomer);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={saveCustomer}
        className="rounded-lg border border-line bg-white p-5 shadow-soft"
      >
        <h2 className="text-xl font-black tracking-tight text-ink">
          {editingId ? "Edit customer" : "Add customer"}
        </h2>
        <div className="mt-5 grid gap-4">
          <TextField
            id="customer-name"
            label="Name"
            value={form.name}
            onChange={(value) => updateForm("name", value)}
          />
          <TextField
            id="customer-company"
            label="Company"
            value={form.company}
            onChange={(value) => updateForm("company", value)}
          />
          <TextField
            id="customer-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => updateForm("email", value)}
          />
          <TextField
            id="customer-phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(value) => updateForm("phone", value)}
          />
          <label htmlFor="customer-notes" className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Notes
            </span>
            <textarea
              id="customer-notes"
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              rows={4}
              className="w-full rounded-md border-line bg-white px-3 py-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
            />
          </label>
        </div>
        {error ? (
          <p className="mt-4 rounded-md border border-coral-50 bg-coral-50 p-3 text-sm font-semibold text-coral-700">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            {editingId ? "Save changes" : "Add customer"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-paper"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <ListControls
          search={search}
          sortKey={sortKey}
          onSearchChange={setSearch}
          onSortChange={setSortKey}
        />
        <div className="mt-5 grid gap-3">
          {filteredCustomers.length ? (
            filteredCustomers.map((customer) => (
              <article
                key={customer.id}
                className="rounded-lg border border-line bg-paper p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-ink">
                      {customer.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-muted">
                      {customer.company || "No company"} |{" "}
                      {customer.email || "No email"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {customer.phone || "No phone"}
                    </p>
                    {customer.notes ? (
                      <p className="mt-3 text-sm leading-6 text-ink">
                        {customer.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <span className="text-xs font-bold uppercase text-muted">
                      {formatWorkspaceDate(customer.updatedAt)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => editCustomer(customer)}
                        className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomer(customer)}
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
              No customers yet. Add a customer to keep contact details ready for quotes.
            </p>
          )}
        </div>
      </section>
    </div>
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
          Customers
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Stored locally in this browser for now.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="customer-search" className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-muted">
            Search
          </span>
          <input
            id="customer-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
          />
        </label>
        <label htmlFor="customer-sort" className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-muted">
            Sort
          </span>
          <select
            id="customer-sort"
            value={sortKey}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
    </div>
  );
}
