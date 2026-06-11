"use client";

import { useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { ResultBox } from "@/components/ResultBox";
import {
  calculateFilamentUsage,
  type FilamentUsageInputs,
} from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";

const defaultInputs: FilamentUsageInputs = {
  spoolWeightGrams: 1000,
  printWeightGrams: 68,
  spoolCost: 24,
};

export function FilamentUsageCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const results = useMemo(() => calculateFilamentUsage(inputs), [inputs]);

  const updateInput = (field: keyof FilamentUsageInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="spoolWeightGrams"
          label="Spool weight"
          value={inputs.spoolWeightGrams}
          step={1}
          suffix="g"
          onChange={(value) => updateInput("spoolWeightGrams", value)}
        />
        <InputField
          id="printWeightGrams"
          label="Print weight"
          value={inputs.printWeightGrams}
          step={1}
          suffix="g"
          onChange={(value) => updateInput("printWeightGrams", value)}
        />
        <InputField
          id="spoolCost"
          label="Spool cost"
          value={inputs.spoolCost}
          prefix="$"
          onChange={(value) => updateInput("spoolCost", value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <ResultBox
          label="Number of prints per spool"
          value={formatNumber(results.printsPerSpool, 1)}
          emphasis
        />
        <ResultBox
          label="Filament cost per print"
          value={formatCurrency(results.filamentCostPerPrint)}
        />
      </div>
    </div>
  );
}
