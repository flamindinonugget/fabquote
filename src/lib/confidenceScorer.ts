import type { MaterialType } from "@/lib/materials";

export type ConfidenceScorerInput = {
  material: MaterialType | "";
  estimatedWeight: number;
  estimatedPrintTime: number;
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  shippingCost: number;
  machineSelected: boolean;
  failureRisk: number;
  finalPrice: number;
};

export type ConfidenceScore = {
  score: number;
  suggestions: string[];
};

export function scoreQuoteConfidence(
  input: ConfidenceScorerInput,
): ConfidenceScore {
  const suggestions: string[] = [];
  let score = 95;

  if (!input.machineSelected) {
    score -= 20;
    suggestions.push("Select a saved machine profile for printer-specific defaults.");
  }

  if (!input.material) {
    score -= 10;
    suggestions.push("Select a material before finalizing the quote.");
  }

  if (input.estimatedWeight <= 0) {
    score -= 10;
    suggestions.push("Enter or estimate model weight.");
  }

  if (input.estimatedPrintTime <= 0) {
    score -= 10;
    suggestions.push("Enter estimated print time from your slicer.");
  }

  if (input.materialCost <= 0) {
    score -= 5;
    suggestions.push("Check material cost so filament or resin is included.");
  }

  if (input.electricityCost <= 0) {
    score -= 5;
    suggestions.push("Include printer wattage and electricity rate.");
  }

  if (input.laborCost <= 0) {
    score -= 15;
    suggestions.push("Add setup, removal, packing, or customer communication time.");
  }

  if (input.shippingCost <= 0) {
    score -= 10;
    suggestions.push("Add shipping or confirm the job is local pickup.");
  }

  if (input.failureRisk <= 0) {
    score -= 5;
    suggestions.push("Add a failure buffer for failed prints and rework.");
  }

  if (input.finalPrice <= 0) {
    score -= 20;
    suggestions.push("Set a final price before sending the quote.");
  }

  return {
    score: clampScore(score),
    suggestions,
  };
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
