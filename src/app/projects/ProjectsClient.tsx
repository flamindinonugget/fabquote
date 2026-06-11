"use client";

import { useEffect, useMemo, useState } from "react";
import { TextField } from "@/components/TextField";
import {
  customerRepository,
  formatWorkspaceDate,
  materialTypes,
  projectRepository,
  type Customer,
  type MaterialType,
  type Project,
  type ProjectInput,
} from "@/lib/workspace";

type SortKey = "newest" | "oldest" | "name";

const emptyProject: ProjectInput = {
  customerId: "",
  projectName: "",
  stlFileName: "",
  material: "PLA",
  notes: "",
};

export function ProjectsClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectInput>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [error, setError] = useState("");

  const loadWorkspace = () => {
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

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects
      .filter((project) =>
        [
          project.projectName,
          project.stlFileName,
          project.material,
          project.notes,
          customerNames.get(project.customerId) || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .sort((first, second) => {
        if (sortKey === "name") {
          return first.projectName.localeCompare(second.projectName);
        }

        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();

        return sortKey === "newest" ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [customerNames, projects, search, sortKey]);

  const updateForm = <Field extends keyof ProjectInput>(
    field: Field,
    value: ProjectInput[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const saveProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    const input = {
      ...form,
      projectName: form.projectName.trim(),
      stlFileName: form.stlFileName.trim(),
    };

    if (editingId) {
      projectRepository.update(editingId, input);
    } else {
      projectRepository.create(input);
    }

    resetForm();
    loadWorkspace();
  };

  const editProject = (project: Project) => {
    setEditingId(project.id);
    setForm({
      customerId: project.customerId,
      projectName: project.projectName,
      stlFileName: project.stlFileName,
      material: project.material,
      notes: project.notes,
    });
    setError("");
  };

  const deleteProject = (project: Project) => {
    if (
      window.confirm(`Delete ${project.projectName}? This cannot be undone.`)
    ) {
      projectRepository.remove(project.id);
      if (editingId === project.id) {
        resetForm();
      }
      loadWorkspace();
    }
  };

  const resetForm = () => {
    setForm(emptyProject);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form
        onSubmit={saveProject}
        className="rounded-lg border border-line bg-white p-5 shadow-soft"
      >
        <h2 className="text-xl font-black tracking-tight text-ink">
          {editingId ? "Edit project" : "Add project"}
        </h2>
        <div className="mt-5 grid gap-4">
          <SelectById
            id="project-customer"
            label="Customer"
            value={form.customerId}
            emptyLabel="No customer selected"
            options={customers.map((customer) => ({
              id: customer.id,
              label: customer.name,
            }))}
            onChange={(value) => updateForm("customerId", value)}
          />
          <TextField
            id="project-name"
            label="Project name"
            value={form.projectName}
            onChange={(value) => updateForm("projectName", value)}
          />
          <TextField
            id="stl-file-name"
            label="STL file name"
            value={form.stlFileName}
            onChange={(value) => updateForm("stlFileName", value)}
          />
          <label htmlFor="project-material" className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Material
            </span>
            <select
              id="project-material"
              value={form.material}
              onChange={(event) =>
                updateForm("material", event.target.value as MaterialType)
              }
              className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
            >
              {materialTypes.map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="project-notes" className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Notes
            </span>
            <textarea
              id="project-notes"
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
            {editingId ? "Save changes" : "Add project"}
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
          {filteredProjects.length ? (
            filteredProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-lg border border-line bg-paper p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-ink">
                      {project.projectName}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-muted">
                      {project.stlFileName || "No STL file"} | {project.material}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Customer: {customerNames.get(project.customerId) || "None"}
                    </p>
                    {project.notes ? (
                      <p className="mt-3 text-sm leading-6 text-ink">
                        {project.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <span className="text-xs font-bold uppercase text-muted">
                      {formatWorkspaceDate(project.updatedAt)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => editProject(project)}
                        className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project)}
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
              No projects yet. Add a project to connect STL work to customers.
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
          Projects
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Link STL work to customers and materials.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="project-search" className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-muted">
            Search
          </span>
          <input
            id="project-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
          />
        </label>
        <label htmlFor="project-sort" className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-muted">
            Sort
          </span>
          <select
            id="project-sort"
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
