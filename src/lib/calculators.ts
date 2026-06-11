import { safeNumber } from "@/lib/format";

export type PrintCostInputs = {
  filamentCostPerKg: number;
  printWeightGrams: number;
  printTimeHours: number;
  electricityCostPerKwh: number;
  printerWattage: number;
  laborSetupCost: number;
  markupPercentage: number;
};

export function calculatePrintCost(inputs: PrintCostInputs) {
  const filamentCost =
    safeNumber(inputs.filamentCostPerKg) * (safeNumber(inputs.printWeightGrams) / 1000);
  const electricityCost =
    (safeNumber(inputs.printerWattage) / 1000) *
    safeNumber(inputs.printTimeHours) *
    safeNumber(inputs.electricityCostPerKwh);
  const baseCost = filamentCost + electricityCost + safeNumber(inputs.laborSetupCost);
  const suggestedSellingPrice =
    baseCost * (1 + safeNumber(inputs.markupPercentage) / 100);
  const estimatedProfit = suggestedSellingPrice - baseCost;

  return {
    filamentCost,
    electricityCost,
    baseCost,
    suggestedSellingPrice,
    estimatedProfit,
  };
}

export type FilamentUsageInputs = {
  spoolWeightGrams: number;
  printWeightGrams: number;
  spoolCost: number;
};

export function calculateFilamentUsage(inputs: FilamentUsageInputs) {
  const printWeight = safeNumber(inputs.printWeightGrams);
  const printsPerSpool = printWeight > 0 ? safeNumber(inputs.spoolWeightGrams) / printWeight : 0;
  const filamentCostPerPrint =
    safeNumber(inputs.spoolWeightGrams) > 0
      ? safeNumber(inputs.spoolCost) * (printWeight / safeNumber(inputs.spoolWeightGrams))
      : 0;

  return {
    printsPerSpool,
    filamentCostPerPrint,
  };
}

export type ElectricityCostInputs = {
  printerWattage: number;
  printTimeHours: number;
  electricityCostPerKwh: number;
};

export function calculateElectricityCost(inputs: ElectricityCostInputs) {
  const electricityCost =
    (safeNumber(inputs.printerWattage) / 1000) *
    safeNumber(inputs.printTimeHours) *
    safeNumber(inputs.electricityCostPerKwh);

  return {
    electricityCost,
  };
}

export type ProfitMarginInputs = {
  sellingPrice: number;
  materialCost: number;
  electricityCost: number;
  platformFeePercentage: number;
  shippingCost: number;
};

export function calculateProfitMargin(inputs: ProfitMarginInputs) {
  const platformFee =
    safeNumber(inputs.sellingPrice) * (safeNumber(inputs.platformFeePercentage) / 100);
  const totalCosts =
    safeNumber(inputs.materialCost) +
    safeNumber(inputs.electricityCost) +
    safeNumber(inputs.shippingCost) +
    platformFee;
  const netProfit = safeNumber(inputs.sellingPrice) - totalCosts;
  const profitMargin =
    safeNumber(inputs.sellingPrice) > 0
      ? (netProfit / safeNumber(inputs.sellingPrice)) * 100
      : 0;

  return {
    netProfit,
    profitMargin,
  };
}
