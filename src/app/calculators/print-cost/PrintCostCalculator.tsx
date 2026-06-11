"use client";

import { useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { ResultBox } from "@/components/ResultBox";
import { calculatePrintCost, type PrintCostInputs } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";

const defaultInputs: PrintCostInputs = {
  filamentCostPerKg: 24,
  printWeightGrams: 68,
  printTimeHours: 4.5,
  electricityCostPerKwh: 0.16,
  printerWattage: 120,
  laborSetupCost: 4,
  markupPercentage: 100,
};

export function PrintCostCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const results = useMemo(() => calculatePrintCost(inputs), [inputs]);

  const updateInput = (field: keyof PrintCostInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="filamentCostPerKg"
          label="Filament cost per kg"
          value={inputs.filamentCostPerKg}
          prefix="$"
          onChange={(value) => updateInput("filamentCostPerKg", value)}
        />
        <InputField
          id="printWeightGrams"
          label="Print weight"
          value={inputs.printWeightGrams}
          suffix="g"
          onChange={(value) => updateInput("printWeightGrams", value)}
        />
        <InputField
          id="printTimeHours"
          label="Print time"
          value={inputs.printTimeHours}
          suffix="hrs"
          onChange={(value) => updateInput("printTimeHours", value)}
        />
        <InputField
          id="electricityCostPerKwh"
          label="Electricity cost per kWh"
          value={inputs.electricityCostPerKwh}
          onChange={(value) => updateInput("electricityCostPerKwh", value)}
        />
        <InputField
          id="printerWattage"
          label="Printer wattage"
          value={inputs.printerWattage}
          step={1}
          suffix="W"
          onChange={(value) => updateInput("printerWattage", value)}
        />
        <InputField
          id="laborSetupCost"
          label="Labor/setup cost"
          value={inputs.laborSetupCost}
          onChange={(value) => updateInput("laborSetupCost", value)}
        />
        <InputField
          id="markupPercentage"
          label="Markup percentage"
          value={inputs.markupPercentage}
          suffix="%"
          onChange={(value) => updateInput("markupPercentage", value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <ResultBox label="Filament cost" value={formatCurrency(results.filamentCost)} />
        <ResultBox label="Electricity cost" value={formatCurrency(results.electricityCost)} />
        <ResultBox label="Base cost" value={formatCurrency(results.baseCost)} />
        <ResultBox
          label="Suggested selling price"
          value={formatCurrency(results.suggestedSellingPrice)}
          emphasis
        />
        <ResultBox label="Estimated profit" value={formatCurrency(results.estimatedProfit)} />
      </div>
    </div>
  );
}
