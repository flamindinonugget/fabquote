import {
  scoreQuoteConfidence,
  type ConfidenceScore,
} from "@/lib/confidenceScorer";
import type { Machine } from "@/lib/machines";
import type { MaterialType } from "@/lib/materials";

export type ProfitWarningSeverity = "info" | "warning" | "critical";

export type ProfitWarningCode =
  | "LOW_LABOR"
  | "LOW_MARKUP"
  | "NO_SHIPPING"
  | "LOW_FAILURE_BUFFER"
  | "HIGH_PRINT_TIME"
  | "HIGH_SUPPORT_ESTIMATE"
  | "UNKNOWN_MACHINE"
  | "NO_CUSTOMER"
  | "NEGATIVE_PROFIT";

export type ProfitWarning = {
  code: ProfitWarningCode;
  severity: ProfitWarningSeverity;
  message: string;
  recommendation: string;
};

export type QuoteAnalyzerInput = {
  material: MaterialType | "";
  estimatedWeight: number;
  estimatedPrintTime: number;
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  shippingCost: number;
  machineProfile: Machine | null;
  markup: number;
  failureRisk: number;
  finalPrice: number;
  totalCost: number;
  supportsEnabled: boolean;
  supportPercentageEstimate: number;
  customerId?: string;
};

export type QuoteAnalysis = {
  warnings: ProfitWarning[];
  confidence: ConfidenceScore;
};

const supportWarningThreshold = 25;

export function analyzeQuote(input: QuoteAnalyzerInput): QuoteAnalysis {
  const warnings: ProfitWarning[] = [];

  if (input.laborCost <= 0) {
    warnings.push({
      code: "LOW_LABOR",
      severity: "warning",
      message: "Labor cost is $0. Most shops include setup time.",
      recommendation:
        "Add a setup fee for slicing, printer prep, removal, cleanup, and communication.",
    });
  }

  if (input.markup < 20) {
    warnings.push({
      code: "LOW_MARKUP",
      severity: "critical",
      message: "Markup below 20% may not cover overhead.",
      recommendation:
        "Raise markup or verify that machine wear, failed prints, rent, and admin time are covered elsewhere.",
    });
  }

  if (input.shippingCost <= 0) {
    warnings.push({
      code: "NO_SHIPPING",
      severity: "info",
      message: "Shipping is currently excluded.",
      recommendation:
        "Add shipping, packaging, or mark the job as local pickup before sending.",
    });
  }

  if (input.failureRisk < 5) {
    warnings.push({
      code: "LOW_FAILURE_BUFFER",
      severity: "warning",
      message: "Failure buffer may be too low for complex prints.",
      recommendation:
        "Use at least 5% for simple jobs and more for long, detailed, or support-heavy prints.",
    });
  }

  if (input.estimatedPrintTime > 20) {
    warnings.push({
      code: "HIGH_PRINT_TIME",
      severity: "warning",
      message: "Consider increasing failure buffer for long-duration prints.",
      recommendation:
        "Long prints tie up a machine and carry more failure risk. Consider a higher risk buffer.",
    });
  }

  if (
    input.supportsEnabled &&
    input.supportPercentageEstimate > supportWarningThreshold
  ) {
    warnings.push({
      code: "HIGH_SUPPORT_ESTIMATE",
      severity: "warning",
      message: "Support material may significantly affect cost.",
      recommendation:
        "Review orientation and supports in your slicer before committing the quote.",
    });
  }

  if (!input.machineProfile) {
    warnings.push({
      code: "UNKNOWN_MACHINE",
      severity: "info",
      message: "Using a saved machine profile will improve estimate accuracy.",
      recommendation:
        "Select a machine profile to apply wattage, speed, layer height, nozzle, labor, and markup defaults.",
    });
  }

  if (!input.customerId) {
    warnings.push({
      code: "NO_CUSTOMER",
      severity: "info",
      message: "Saving under a customer makes repeat quoting easier.",
      recommendation:
        "Create or select a customer when this quote is ready for follow-up.",
    });
  }

  if (input.finalPrice > 0 && input.finalPrice < input.totalCost) {
    warnings.push({
      code: "NEGATIVE_PROFIT",
      severity: "critical",
      message: "Final price is below total cost.",
      recommendation:
        "Increase price, lower costs, or verify the quote is intentionally discounted.",
    });
  }

  return {
    warnings,
    confidence: scoreQuoteConfidence({
      material: input.material,
      estimatedWeight: input.estimatedWeight,
      estimatedPrintTime: input.estimatedPrintTime,
      materialCost: input.materialCost,
      electricityCost: input.electricityCost,
      laborCost: input.laborCost,
      shippingCost: input.shippingCost,
      machineSelected: Boolean(input.machineProfile),
      failureRisk: input.failureRisk,
      finalPrice: input.finalPrice,
    }),
  };
}
