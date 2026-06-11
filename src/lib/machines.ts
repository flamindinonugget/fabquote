import { readJson, readString, writeJson, writeString } from "@/lib/browserStorage";

export type Machine = {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  wattage: number;
  typicalPrintSpeed: number;
  acceleration: number;
  layerHeightDefault: number;
  nozzleDiameter: number;
  defaultMarkup: number;
  defaultLaborSetupFee: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type MachineInput = Omit<Machine, "id" | "createdAt" | "updatedAt">;

const machineStorageKey = "fabquote:machines";
const machineInitializedKey = "fabquote:machines-initialized";
export const machineChangeEvent = "fabquote:machines-change";

export const builtInMachinePresets: MachineInput[] = [
  {
    name: "Bambu Lab P1S",
    manufacturer: "Bambu Lab",
    model: "P1S",
    wattage: 350,
    typicalPrintSpeed: 250,
    acceleration: 10000,
    layerHeightDefault: 0.2,
    nozzleDiameter: 0.4,
    defaultMarkup: 100,
    defaultLaborSetupFee: 6,
    notes: "Fast enclosed CoreXY profile for PLA, PETG, ABS, and ASA quoting.",
  },
  {
    name: "Bambu Lab X1 Carbon",
    manufacturer: "Bambu Lab",
    model: "X1 Carbon",
    wattage: 350,
    typicalPrintSpeed: 300,
    acceleration: 12000,
    layerHeightDefault: 0.2,
    nozzleDiameter: 0.4,
    defaultMarkup: 110,
    defaultLaborSetupFee: 7,
    notes: "High-speed enclosed profile for premium quoting workflows.",
  },
  {
    name: "Bambu Lab A1",
    manufacturer: "Bambu Lab",
    model: "A1",
    wattage: 130,
    typicalPrintSpeed: 220,
    acceleration: 10000,
    layerHeightDefault: 0.2,
    nozzleDiameter: 0.4,
    defaultMarkup: 90,
    defaultLaborSetupFee: 5,
    notes: "Open-frame fast bed slinger profile for everyday PLA and PETG jobs.",
  },
  {
    name: "Prusa MK4",
    manufacturer: "Prusa",
    model: "MK4",
    wattage: 120,
    typicalPrintSpeed: 170,
    acceleration: 4000,
    layerHeightDefault: 0.2,
    nozzleDiameter: 0.4,
    defaultMarkup: 100,
    defaultLaborSetupFee: 6,
    notes: "Reliable production profile for dimensional parts and repeat work.",
  },
  {
    name: "Creality K1",
    manufacturer: "Creality",
    model: "K1",
    wattage: 350,
    typicalPrintSpeed: 250,
    acceleration: 12000,
    layerHeightDefault: 0.2,
    nozzleDiameter: 0.4,
    defaultMarkup: 95,
    defaultLaborSetupFee: 5,
    notes: "High-speed enclosed profile for quick quoting on common materials.",
  },
  {
    name: "Ender 3 V3",
    manufacturer: "Creality",
    model: "Ender 3 V3",
    wattage: 120,
    typicalPrintSpeed: 180,
    acceleration: 5000,
    layerHeightDefault: 0.2,
    nozzleDiameter: 0.4,
    defaultMarkup: 85,
    defaultLaborSetupFee: 5,
    notes: "Accessible open-frame profile for general-purpose print jobs.",
  },
];

export const machineRepository = {
  list() {
    if (typeof window === "undefined") {
      return [];
    }

    const machines = readMachines();

    if (machines.length || readString(machineInitializedKey)) {
      return machines;
    }

    const seeded = builtInMachinePresets.map((preset) => createMachine(preset));
    writeMachines(seeded);
    writeString(machineInitializedKey, "true");

    return seeded;
  },
  create(input: MachineInput) {
    const machine = createMachine(input);
    writeMachines([machine, ...machineRepository.list()]);
    emitMachineChange();

    return machine;
  },
  update(id: string, input: MachineInput) {
    let updatedMachine: Machine | null = null;
    const machines = machineRepository.list().map((machine) => {
      if (machine.id !== id) {
        return machine;
      }

      updatedMachine = {
        ...machine,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      return updatedMachine;
    });

    writeMachines(machines);
    emitMachineChange();

    return updatedMachine;
  },
  remove(id: string) {
    writeMachines(machineRepository.list().filter((machine) => machine.id !== id));
    emitMachineChange();
  },
  duplicate(id: string) {
    const machine = machineRepository.list().find((item) => item.id === id);

    if (!machine) {
      return null;
    }

    return machineRepository.create({
      name: `${machine.name} Copy`,
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
  },
};

export function sortMachinesByName(machines: Machine[]) {
  return [...machines].sort((first, second) => first.name.localeCompare(second.name));
}

function createMachine(input: MachineInput): Machine {
  const now = new Date().toISOString();

  return {
    ...input,
    id: createId(),
    createdAt: now,
    updatedAt: now,
  };
}

function readMachines() {
  return readJson<Machine[]>(machineStorageKey, []);
}

function writeMachines(machines: Machine[]) {
  writeJson(machineStorageKey, machines);
}

function emitMachineChange() {
  window.dispatchEvent(new Event(machineChangeEvent));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
