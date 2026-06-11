"use client";

import { useEffect, useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { TextField } from "@/components/TextField";
import {
  machineRepository,
  sortMachinesByName,
  type Machine,
  type MachineInput,
} from "@/lib/machines";

const emptyMachine: MachineInput = {
  name: "",
  manufacturer: "",
  model: "",
  wattage: 120,
  typicalPrintSpeed: 180,
  acceleration: 5000,
  layerHeightDefault: 0.2,
  nozzleDiameter: 0.4,
  defaultMarkup: 100,
  defaultLaborSetupFee: 5,
  notes: "",
};

export function MachinesClient() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [form, setForm] = useState<MachineInput>(emptyMachine);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadMachines = () => setMachines(machineRepository.list());

  useEffect(() => {
    loadMachines();
  }, []);

  const filteredMachines = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sortMachinesByName(
      machines.filter((machine) =>
        [
          machine.name,
          machine.manufacturer,
          machine.model,
          machine.notes,
          machine.wattage,
          machine.typicalPrintSpeed,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [machines, search]);

  const updateForm = <Field extends keyof MachineInput>(
    field: Field,
    value: MachineInput[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const saveMachine = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Machine name is required.");
      return;
    }

    const input = {
      ...form,
      name: form.name.trim(),
      manufacturer: form.manufacturer.trim(),
      model: form.model.trim(),
    };

    if (editingId) {
      machineRepository.update(editingId, input);
    } else {
      machineRepository.create(input);
    }

    resetForm();
    loadMachines();
  };

  const editMachine = (machine: Machine) => {
    setEditingId(machine.id);
    setForm({
      name: machine.name,
      manufacturer: machine.manufacturer,
      model: machine.model,
      wattage: machine.wattage,
      typicalPrintSpeed: machine.typicalPrintSpeed,
      acceleration: machine.acceleration,
      layerHeightDefault: machine.layerHeightDefault,
      nozzleDiameter: machine.nozzleDiameter,
      defaultMarkup: machine.defaultMarkup,
      defaultLaborSetupFee: machine.defaultLaborSetupFee,
      notes: machine.notes,
    });
    setError("");
  };

  const duplicateMachine = (machine: Machine) => {
    machineRepository.duplicate(machine.id);
    loadMachines();
  };

  const deleteMachine = (machine: Machine) => {
    if (window.confirm(`Delete ${machine.name}? This cannot be undone.`)) {
      machineRepository.remove(machine.id);
      if (editingId === machine.id) {
        resetForm();
      }
      loadMachines();
    }
  };

  const resetForm = () => {
    setForm(emptyMachine);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <form
        onSubmit={saveMachine}
        className="rounded-lg border border-line bg-white p-5 shadow-soft"
      >
        <h2 className="text-xl font-black tracking-tight text-ink">
          {editingId ? "Edit machine" : "Add machine"}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField
            id="machine-name"
            label="Name"
            value={form.name}
            onChange={(value) => updateForm("name", value)}
          />
          <TextField
            id="machine-manufacturer"
            label="Manufacturer"
            value={form.manufacturer}
            onChange={(value) => updateForm("manufacturer", value)}
          />
          <TextField
            id="machine-model"
            label="Model"
            value={form.model}
            onChange={(value) => updateForm("model", value)}
          />
          <InputField
            id="machine-wattage"
            label="Wattage"
            value={form.wattage}
            step={1}
            suffix="W"
            onChange={(value) => updateForm("wattage", value)}
          />
          <InputField
            id="machine-speed"
            label="Typical print speed"
            value={form.typicalPrintSpeed}
            step={1}
            suffix="mm/s"
            onChange={(value) => updateForm("typicalPrintSpeed", value)}
          />
          <InputField
            id="machine-acceleration"
            label="Acceleration"
            value={form.acceleration}
            step={100}
            suffix="mm/s2"
            onChange={(value) => updateForm("acceleration", value)}
          />
          <InputField
            id="machine-layer-height"
            label="Layer height default"
            value={form.layerHeightDefault}
            suffix="mm"
            onChange={(value) => updateForm("layerHeightDefault", value)}
          />
          <InputField
            id="machine-nozzle"
            label="Nozzle diameter"
            value={form.nozzleDiameter}
            suffix="mm"
            onChange={(value) => updateForm("nozzleDiameter", value)}
          />
          <InputField
            id="machine-markup"
            label="Default markup"
            value={form.defaultMarkup}
            suffix="%"
            onChange={(value) => updateForm("defaultMarkup", value)}
          />
          <InputField
            id="machine-labor"
            label="Default labor/setup fee"
            value={form.defaultLaborSetupFee}
            prefix="$"
            onChange={(value) => updateForm("defaultLaborSetupFee", value)}
          />
          <label htmlFor="machine-notes" className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Notes
            </span>
            <textarea
              id="machine-notes"
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
            {editingId ? "Save changes" : "Add machine"}
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Machine profiles
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Built-in presets are stored locally and can be edited or duplicated.
            </p>
          </div>
          <label htmlFor="machine-search" className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-muted">
              Search
            </span>
            <input
              id="machine-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3">
          {filteredMachines.length ? (
            filteredMachines.map((machine) => (
              <article
                key={machine.id}
                className="rounded-lg border border-line bg-paper p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-ink">
                      {machine.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-muted">
                      {machine.manufacturer || "Unknown manufacturer"} |{" "}
                      {machine.model || "No model"}
                    </p>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <Spec label="Wattage" value={`${machine.wattage} W`} />
                      <Spec
                        label="Speed"
                        value={`${machine.typicalPrintSpeed} mm/s`}
                      />
                      <Spec
                        label="Acceleration"
                        value={`${machine.acceleration} mm/s2`}
                      />
                      <Spec
                        label="Layer height"
                        value={`${machine.layerHeightDefault} mm`}
                      />
                      <Spec
                        label="Nozzle"
                        value={`${machine.nozzleDiameter} mm`}
                      />
                      <Spec label="Markup" value={`${machine.defaultMarkup}%`} />
                      <Spec
                        label="Labor"
                        value={`$${machine.defaultLaborSetupFee.toFixed(2)}`}
                      />
                    </dl>
                    {machine.notes ? (
                      <p className="mt-3 text-sm leading-6 text-ink">
                        {machine.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      onClick={() => editMachine(machine)}
                      className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateMachine(machine)}
                      className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-50"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMachine(machine)}
                      className="rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-coral-700 transition hover:bg-coral-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-line bg-paper p-5 text-sm font-semibold text-muted">
              No machines found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-muted">{label}</dt>
      <dd className="font-bold text-ink">{value}</dd>
    </div>
  );
}
