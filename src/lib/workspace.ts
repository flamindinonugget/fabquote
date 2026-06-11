import { materialTypes, type MaterialType } from "@/lib/materials";
import { readJson, writeJson } from "@/lib/browserStorage";

export { materialTypes, type MaterialType };

export type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  customerId: string;
  projectName: string;
  stlFileName: string;
  material: MaterialType;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export type Quote = {
  id: string;
  quoteNumber: string;
  customerId: string;
  projectId: string;
  stlFileName: string;
  material: MaterialType;
  estimatedWeight: number;
  estimatedPrintTime: number;
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  shippingCost: number;
  riskBuffer: number;
  markupPercentage: number;
  finalPrice: number;
  machineId?: string;
  machineName?: string;
  status: QuoteStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerInput = Omit<Customer, "id" | "createdAt" | "updatedAt">;
export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type QuoteInput = Omit<Quote, "id" | "createdAt" | "updatedAt">;

type StoredEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type EntityInput<Entity extends StoredEntity> = Omit<
  Entity,
  "id" | "createdAt" | "updatedAt"
>;

type EntityRepository<Entity extends StoredEntity> = {
  list: () => Entity[];
  create: (input: EntityInput<Entity>) => Entity;
  update: (id: string, input: EntityInput<Entity>) => Entity | null;
  remove: (id: string) => void;
};

export const workspaceChangeEvent = "fabquote:workspace-change";

const storageKeys = {
  customers: "fabquote:customers",
  projects: "fabquote:projects",
  quotes: "fabquote:quotes",
};

export const customerRepository = createRepository<Customer>(storageKeys.customers);
export const projectRepository = createRepository<Project>(storageKeys.projects);
export const quoteRepository = {
  ...createRepository<Quote>(storageKeys.quotes),
  duplicate(id: string) {
    const quote = quoteRepository.list().find((item) => item.id === id);

    if (!quote) {
      return null;
    }

    return quoteRepository.create({
      quoteNumber: nextDuplicateQuoteNumber(quote.quoteNumber),
      customerId: quote.customerId,
      projectId: quote.projectId,
      stlFileName: quote.stlFileName,
      material: quote.material,
      estimatedWeight: quote.estimatedWeight,
      estimatedPrintTime: quote.estimatedPrintTime,
      materialCost: quote.materialCost,
      electricityCost: quote.electricityCost,
      laborCost: quote.laborCost,
      shippingCost: quote.shippingCost,
      riskBuffer: quote.riskBuffer,
      markupPercentage: quote.markupPercentage,
      finalPrice: quote.finalPrice,
      machineId: quote.machineId,
      machineName: quote.machineName,
      status: "draft",
      notes: quote.notes,
    });
  },
};

export function sortByDateDescending<Entity extends { updatedAt: string }>(
  items: Entity[],
) {
  return [...items].sort(
    (first, second) =>
      new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
  );
}

export function formatWorkspaceDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function createQuoteNumber() {
  return `Q-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
}

function createRepository<Entity extends StoredEntity>(
  key: string,
): EntityRepository<Entity> {
  return {
    list() {
      return readCollection<Entity>(key);
    },
    create(input) {
      const now = new Date().toISOString();
      const entity = {
        ...input,
        id: createId(),
        createdAt: now,
        updatedAt: now,
      } as Entity;
      writeCollection(key, [entity, ...readCollection<Entity>(key)]);
      emitWorkspaceChange();

      return entity;
    },
    update(id, input) {
      let updatedEntity: Entity | null = null;
      const updatedItems = readCollection<Entity>(key).map((item) => {
        if (item.id !== id) {
          return item;
        }

        updatedEntity = {
          ...item,
          ...input,
          updatedAt: new Date().toISOString(),
        } as Entity;

        return updatedEntity;
      });

      writeCollection(key, updatedItems);
      emitWorkspaceChange();

      return updatedEntity;
    },
    remove(id) {
      writeCollection(
        key,
        readCollection<Entity>(key).filter((item) => item.id !== id),
      );
      emitWorkspaceChange();
    },
  };
}

function readCollection<Entity>(key: string): Entity[] {
  if (typeof window === "undefined") {
    return [];
  }

  return readJson<Entity[]>(key, []);
}

function writeCollection<Entity>(key: string, items: Entity[]) {
  if (typeof window === "undefined") {
    return;
  }

  writeJson(key, items);
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emitWorkspaceChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(workspaceChangeEvent));
  }
}

function nextDuplicateQuoteNumber(quoteNumber: string) {
  return `${quoteNumber || createQuoteNumber()}-COPY`;
}
