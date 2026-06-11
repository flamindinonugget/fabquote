import type { Machine } from "@/lib/machines";
import type { QuoteAnalyzerInput } from "@/lib/quoteAnalyzer";
import { defaultStlQuoteInputs, type StlQuoteInputs } from "@/lib/stlQuote";

export type QuoteTestScenario = {
  id: string;
  name: string;
  description: string;
  machineName?: string;
  customerId?: string;
  analyzerInput: QuoteAnalyzerInput;
  stlInputs: StlQuoteInputs;
};

export type QuoteTestLabPayload = {
  scenarioId: string;
  scenarioName: string;
  machineName?: string;
  stlInputs: StlQuoteInputs;
};

export const quoteTestLabStorageKey = "fabquote:quote-test-lab-scenario";

const standardMachine = createScenarioMachine({
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
  notes: "Scenario machine profile.",
});

const fastMachine = createScenarioMachine({
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
  notes: "Scenario machine profile.",
});

export const quoteTestScenarios: QuoteTestScenario[] = [
  createScenario({
    id: "good-quote",
    name: "Good quote",
    description: "Complete quote with machine, labor, shipping, and risk included.",
    machine: standardMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "Good quote calibration cube batch",
      setupLaborCost: 8,
      shippingCost: 6,
      failureRiskPercentage: 10,
      markupPercentage: 100,
      estimatedPrintTimeHours: 5,
      supportsEnabled: false,
      supportPercentageEstimate: 10,
    },
  }),
  createScenario({
    id: "no-labor-cost",
    name: "No labor cost",
    description: "Labor is excluded, which can hide setup and handling time.",
    machine: standardMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "No labor prototype enclosure",
      setupLaborCost: 0,
      shippingCost: 6,
      failureRiskPercentage: 10,
      markupPercentage: 80,
    },
  }),
  createScenario({
    id: "no-shipping-cost",
    name: "No shipping cost",
    description: "Shipping is excluded even though the job may need fulfillment.",
    machine: standardMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "No shipping Etsy replacement part",
      setupLaborCost: 6,
      shippingCost: 0,
      failureRiskPercentage: 10,
      markupPercentage: 80,
    },
  }),
  createScenario({
    id: "low-markup",
    name: "Low markup",
    description: "Markup is below the overhead protection threshold.",
    machine: standardMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "Low markup bracket",
      setupLaborCost: 6,
      shippingCost: 5,
      failureRiskPercentage: 8,
      markupPercentage: 10,
    },
  }),
  createScenario({
    id: "long-print-time",
    name: "Long print time",
    description: "A long-duration print increases machine occupancy and failure risk.",
    machine: standardMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "Long print cosplay prop",
      estimatedPrintTimeHours: 28,
      estimatedWeightGrams: 420,
      modelVolumeCm3: 338.7,
      setupLaborCost: 12,
      shippingCost: 12,
      failureRiskPercentage: 8,
      markupPercentage: 120,
    },
  }),
  createScenario({
    id: "high-support-material",
    name: "High support material",
    description: "Support estimate is high enough to materially affect cost.",
    machine: fastMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "High support figurine",
      supportsEnabled: true,
      supportPercentageEstimate: 45,
      setupLaborCost: 10,
      shippingCost: 7,
      failureRiskPercentage: 12,
      markupPercentage: 110,
    },
  }),
  createScenario({
    id: "no-machine-selected",
    name: "No machine selected",
    description: "The quote uses manual printer values instead of a saved machine profile.",
    customerId: "scenario-customer",
    overrides: {
      projectName: "No machine manual quote",
      setupLaborCost: 7,
      shippingCost: 5,
      failureRiskPercentage: 10,
      markupPercentage: 90,
    },
  }),
  createScenario({
    id: "negative-profit",
    name: "Negative profit",
    description: "The final price is below the calculated total cost.",
    machine: standardMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "Negative profit discounted rush job",
      setupLaborCost: 10,
      shippingCost: 8,
      failureRiskPercentage: 10,
      markupPercentage: -20,
    },
    finalPriceOverride: 12,
  }),
  createScenario({
    id: "high-risk-large-print",
    name: "High-risk large print",
    description: "Large support-heavy print with long duration and risk exposure.",
    machine: fastMachine,
    customerId: "scenario-customer",
    overrides: {
      projectName: "High-risk large architectural model",
      estimatedWeightGrams: 850,
      modelVolumeCm3: 685.5,
      estimatedPrintTimeHours: 34,
      supportsEnabled: true,
      supportPercentageEstimate: 38,
      setupLaborCost: 18,
      shippingCost: 18,
      failureRiskPercentage: 3,
      markupPercentage: 90,
    },
  }),
  createScenario({
    id: "missing-customer",
    name: "Missing customer",
    description: "Quote is not attached to a customer record.",
    machine: standardMachine,
    overrides: {
      projectName: "Missing customer custom jig",
      setupLaborCost: 7,
      shippingCost: 5,
      failureRiskPercentage: 10,
      markupPercentage: 100,
    },
  }),
];

function createScenario({
  id,
  name,
  description,
  machine,
  customerId,
  overrides,
  finalPriceOverride,
}: {
  id: string;
  name: string;
  description: string;
  machine?: Machine;
  customerId?: string;
  overrides: Partial<StlQuoteInputs>;
  finalPriceOverride?: number;
}): QuoteTestScenario {
  const stlInputs: StlQuoteInputs = {
    ...defaultStlQuoteInputs,
    ...machineToStlOverrides(machine),
    ...overrides,
  };
  const materialCost =
    stlInputs.filamentCostPerKg * (stlInputs.estimatedWeightGrams / 1000);
  const electricityCost =
    (stlInputs.printerWattage / 1000) *
    stlInputs.estimatedPrintTimeHours *
    stlInputs.electricityCostPerKwh;
  const baseCost =
    materialCost +
    electricityCost +
    stlInputs.setupLaborCost +
    stlInputs.shippingCost;
  const riskBuffer = baseCost * (stlInputs.failureRiskPercentage / 100);
  const totalCost = baseCost + riskBuffer;
  const finalPrice =
    finalPriceOverride ??
    totalCost * (1 + stlInputs.markupPercentage / 100);

  return {
    id,
    name,
    description,
    machineName: machine?.name,
    customerId,
    stlInputs,
    analyzerInput: {
      material: stlInputs.materialType,
      estimatedWeight: stlInputs.estimatedWeightGrams,
      estimatedPrintTime: stlInputs.estimatedPrintTimeHours,
      materialCost,
      electricityCost,
      laborCost: stlInputs.setupLaborCost,
      shippingCost: stlInputs.shippingCost,
      machineProfile: machine || null,
      markup: stlInputs.markupPercentage,
      failureRisk: stlInputs.failureRiskPercentage,
      finalPrice,
      totalCost,
      supportsEnabled: stlInputs.supportsEnabled,
      supportPercentageEstimate: stlInputs.supportPercentageEstimate,
      customerId,
    },
  };
}

function machineToStlOverrides(machine?: Machine): Partial<StlQuoteInputs> {
  if (!machine) {
    return {};
  }

  return {
    printerWattage: machine.wattage,
    printSpeedMmPerSecond: machine.typicalPrintSpeed,
    layerHeightMm: machine.layerHeightDefault,
    nozzleDiameterMm: machine.nozzleDiameter,
    setupLaborCost: machine.defaultLaborSetupFee,
    markupPercentage: machine.defaultMarkup,
  };
}

function createScenarioMachine(input: Omit<Machine, "id" | "createdAt" | "updatedAt">): Machine {
  return {
    ...input,
    id: `scenario-${input.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}
