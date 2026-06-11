"use client";

import { useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { ResultBox } from "@/components/ResultBox";
import {
  calculateElectricityCost,
  type ElectricityCostInputs,
} from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";

const defaultInputs: ElectricityCostInputs = {
  printerWattage: 120,
  printTimeHours: 4.5,
  electricityCostPerKwh: 0.16,
};

export function ElectricityCostCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const results = useMemo(() => calculateElectricityCost(inputs), [inputs]);

  const updateInput = (field: keyof ElectricityCostInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="printerWattage"
          label="Printer wattage"
          value={inputs.printerWattage}
          step={1}
          suffix="W"
          onChange={(value) => updateInput("printerWattage", value)}
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
          prefix="$"
          onChange={(value) => updateInput("electricityCostPerKwh", value)}
        />
      </div>

      <div>
        <ResultBox
          label="Electricity cost per print"
          value={formatCurrency(results.electricityCost)}
          emphasis
        />
      </div>
    </div>
  );
}
