import { safeNumber } from "@/lib/format";
import {
  defaultMaterialDensitySettings,
  getMaterialDensity,
  materialTypes,
  type MaterialType,
} from "@/lib/materials";

export { materialTypes, type MaterialType };

export type PricingMode = "markup" | "margin";

export type StlQuoteInputs = {
  projectName: string;
  materialType: MaterialType;
  pricingMode: PricingMode;
  filamentCostPerKg: number;
  modelVolumeCm3: number;
  modelSurfaceAreaMm2: number;
  estimatedWeightGrams: number;
  estimatedPrintTimeHours: number;
  printerWattage: number;
  electricityCostPerKwh: number;
  setupLaborCost: number;
  failureRiskPercentage: number;
  markupPercentage: number;
  targetProfitMarginPercentage: number;
  marketplaceFeePercentage: number;
  shippingCost: number;
  infillPercentage: number;
  layerHeightMm: number;
  numberOfWalls: number;
  topLayers: number;
  bottomLayers: number;
  supportsEnabled: boolean;
  supportPercentageEstimate: number;
  printSpeedMmPerSecond: number;
  nozzleDiameterMm: number;
  plaDensity: number;
  petgDensity: number;
  absDensity: number;
  tpuDensity: number;
  resinDensity: number;
};

export type StlQuoteResults = {
  materialCost: number;
  modelVolumeCm3: number;
  estimatedFilamentUsedGrams: number;
  estimatedFilamentLengthMeters: number;
  estimatedSupportMaterialGrams: number;
  estimatedTotalMaterialCost: number;
  electricityCost: number;
  riskBuffer: number;
  totalCost: number;
  recommendedDirectSalePrice: number;
  recommendedMarketplaceSalePrice: number;
  expectedProfit: number;
  profitMargin: number;
  marketplaceFeeImpact: number;
  quoteSummary: string;
};

export const defaultStlQuoteInputs: StlQuoteInputs = {
  projectName: "Custom STL print",
  materialType: "PLA",
  pricingMode: "markup",
  filamentCostPerKg: 24,
  modelVolumeCm3: 96.8,
  modelSurfaceAreaMm2: 0,
  estimatedWeightGrams: 120,
  estimatedPrintTimeHours: 6,
  printerWattage: 120,
  electricityCostPerKwh: 0.16,
  setupLaborCost: 6,
  failureRiskPercentage: 10,
  markupPercentage: 100,
  targetProfitMarginPercentage: 35,
  marketplaceFeePercentage: 6.5,
  shippingCost: 5,
  infillPercentage: 15,
  layerHeightMm: 0.2,
  numberOfWalls: 3,
  topLayers: 5,
  bottomLayers: 5,
  supportsEnabled: false,
  supportPercentageEstimate: 15,
  printSpeedMmPerSecond: 60,
  nozzleDiameterMm: 0.4,
  ...defaultMaterialDensitySettings,
};

export function calculateStlQuote(inputs: StlQuoteInputs): StlQuoteResults {
  const materialDensity = getMaterialDensity(inputs.materialType, inputs);
  const fallbackVolumeCm3 =
    materialDensity > 0
      ? safeNumber(inputs.estimatedWeightGrams) / materialDensity
      : 0;
  const modelVolumeCm3 =
    safeNumber(inputs.modelVolumeCm3) > 0
      ? safeNumber(inputs.modelVolumeCm3)
      : fallbackVolumeCm3;
  const materialEstimate = estimateMaterialUsage({
    modelVolumeCm3,
    modelSurfaceAreaMm2: safeNumber(inputs.modelSurfaceAreaMm2),
    densityGramsPerCm3: materialDensity,
    infillPercentage: safeNumber(inputs.infillPercentage),
    layerHeightMm: safeNumber(inputs.layerHeightMm),
    numberOfWalls: safeNumber(inputs.numberOfWalls),
    topLayers: safeNumber(inputs.topLayers),
    bottomLayers: safeNumber(inputs.bottomLayers),
    supportsEnabled: inputs.supportsEnabled,
    supportPercentageEstimate: safeNumber(inputs.supportPercentageEstimate),
    nozzleDiameterMm: safeNumber(inputs.nozzleDiameterMm),
  });
  const materialCost =
    safeNumber(inputs.filamentCostPerKg) *
    (materialEstimate.estimatedFilamentUsedGrams / 1000);
  const electricityCost =
    (safeNumber(inputs.printerWattage) / 1000) *
    safeNumber(inputs.estimatedPrintTimeHours) *
    safeNumber(inputs.electricityCostPerKwh);
  const productionCost =
    materialCost +
    electricityCost +
    safeNumber(inputs.setupLaborCost) +
    safeNumber(inputs.shippingCost);
  const riskBuffer =
    productionCost * (safeNumber(inputs.failureRiskPercentage) / 100);
  const totalCost = productionCost + riskBuffer;
  const targetMargin = safeNumber(inputs.targetProfitMarginPercentage) / 100;
  const marketplaceFeeRate = safeNumber(inputs.marketplaceFeePercentage) / 100;
  const recommendedDirectSalePrice =
    inputs.pricingMode === "margin" && targetMargin < 1
      ? totalCost / (1 - targetMargin)
      : totalCost * (1 + safeNumber(inputs.markupPercentage) / 100);
  const recommendedMarketplaceSalePrice =
    marketplaceFeeRate < 1
      ? recommendedDirectSalePrice / (1 - marketplaceFeeRate)
      : recommendedDirectSalePrice;
  const marketplaceFeeImpact =
    recommendedMarketplaceSalePrice - recommendedDirectSalePrice;
  const expectedProfit = recommendedDirectSalePrice - totalCost;
  const profitMargin =
    recommendedDirectSalePrice > 0
      ? (expectedProfit / recommendedDirectSalePrice) * 100
      : 0;
  const quoteSummary = buildQuoteSummary(inputs, {
    materialCost,
    modelVolumeCm3,
    estimatedFilamentUsedGrams: materialEstimate.estimatedFilamentUsedGrams,
    estimatedFilamentLengthMeters: materialEstimate.estimatedFilamentLengthMeters,
    estimatedSupportMaterialGrams: materialEstimate.estimatedSupportMaterialGrams,
    estimatedTotalMaterialCost: materialCost,
    electricityCost,
    riskBuffer,
    totalCost,
    recommendedDirectSalePrice,
    recommendedMarketplaceSalePrice,
    expectedProfit,
    profitMargin,
    marketplaceFeeImpact,
  });

  return {
    materialCost,
    modelVolumeCm3,
    estimatedFilamentUsedGrams: materialEstimate.estimatedFilamentUsedGrams,
    estimatedFilamentLengthMeters: materialEstimate.estimatedFilamentLengthMeters,
    estimatedSupportMaterialGrams: materialEstimate.estimatedSupportMaterialGrams,
    estimatedTotalMaterialCost: materialCost,
    electricityCost,
    riskBuffer,
    totalCost,
    recommendedDirectSalePrice,
    recommendedMarketplaceSalePrice,
    expectedProfit,
    profitMargin,
    marketplaceFeeImpact,
    quoteSummary,
  };
}

type MaterialUsageInput = {
  modelVolumeCm3: number;
  modelSurfaceAreaMm2: number;
  densityGramsPerCm3: number;
  infillPercentage: number;
  layerHeightMm: number;
  numberOfWalls: number;
  topLayers: number;
  bottomLayers: number;
  supportsEnabled: boolean;
  supportPercentageEstimate: number;
  nozzleDiameterMm: number;
};

function estimateMaterialUsage(input: MaterialUsageInput) {
  const modelVolumeCm3 = Math.max(0, input.modelVolumeCm3);
  const density = Math.max(0, input.densityGramsPerCm3);
  const infillRate = clamp(input.infillPercentage / 100, 0, 1);
  const supportRate = input.supportsEnabled
    ? clamp(input.supportPercentageEstimate / 100, 0, 2)
    : 0;
  const nozzleDiameterMm = Math.max(0.1, input.nozzleDiameterMm);
  const layerHeightMm = Math.max(0.05, input.layerHeightMm);
  const wallThicknessMm = Math.max(0, input.numberOfWalls) * nozzleDiameterMm;
  const equivalentSizeMm = Math.cbrt(modelVolumeCm3 * 1000 || 1);
  const surfaceShellCm3 =
    input.modelSurfaceAreaMm2 > 0
      ? (input.modelSurfaceAreaMm2 * wallThicknessMm) / 1000
      : modelVolumeCm3 * clamp(0.12 + input.numberOfWalls * 0.045, 0.12, 0.55);
  const capThicknessMm =
    (Math.max(0, input.topLayers) + Math.max(0, input.bottomLayers)) *
    layerHeightMm;
  const capVolumeCm3 =
    modelVolumeCm3 * clamp(capThicknessMm / equivalentSizeMm, 0, 0.35);
  const shellVolumeCm3 = Math.min(
    modelVolumeCm3,
    Math.max(surfaceShellCm3, capVolumeCm3),
  );
  const internalVolumeCm3 = Math.max(0, modelVolumeCm3 - shellVolumeCm3);
  const modelMaterialVolumeCm3 = shellVolumeCm3 + internalVolumeCm3 * infillRate;
  const supportMaterialVolumeCm3 = modelVolumeCm3 * supportRate;
  const totalMaterialVolumeCm3 =
    modelMaterialVolumeCm3 + supportMaterialVolumeCm3;
  const estimatedFilamentUsedGrams = totalMaterialVolumeCm3 * density;
  const estimatedSupportMaterialGrams = supportMaterialVolumeCm3 * density;
  const filamentCrossSectionMm2 =
    Math.PI * Math.pow(1.75 / 2, 2);
  const estimatedFilamentLengthMeters =
    totalMaterialVolumeCm3 > 0
      ? (totalMaterialVolumeCm3 * 1000) / filamentCrossSectionMm2 / 1000
      : 0;

  return {
    estimatedFilamentUsedGrams,
    estimatedFilamentLengthMeters,
    estimatedSupportMaterialGrams,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildQuoteSummary(
  inputs: StlQuoteInputs,
  results: Omit<StlQuoteResults, "quoteSummary">,
) {
  return [
    `Quote for ${inputs.projectName || "STL print project"}`,
    `Material: ${inputs.materialType}`,
    `Estimated model volume: ${results.modelVolumeCm3.toFixed(2)} cm3`,
    `Estimated material: ${results.estimatedFilamentUsedGrams.toFixed(1)}g over ${safeNumber(inputs.estimatedPrintTimeHours)} hours`,
    `Estimated filament length: ${results.estimatedFilamentLengthMeters.toFixed(2)}m`,
    `Recommended direct sale price: $${results.recommendedDirectSalePrice.toFixed(2)}`,
    `Recommended marketplace sale price: $${results.recommendedMarketplaceSalePrice.toFixed(2)}`,
    `Expected profit: $${results.expectedProfit.toFixed(2)} (${results.profitMargin.toFixed(1)}% margin)`,
  ].join("\n");
}
