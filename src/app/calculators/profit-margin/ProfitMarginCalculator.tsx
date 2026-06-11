"use client";

import { useMemo, useState } from "react";
import { InputField } from "@/components/InputField";
import { ResultBox } from "@/components/ResultBox";
import {
  calculateProfitMargin,
  type ProfitMarginInputs,
} from "@/lib/calculators";
import { formatCurrency, formatPercent } from "@/lib/format";

const defaultInputs: ProfitMarginInputs = {
  sellingPrice: 18,
  materialCost: 1.62,
  electricityCost: 0.14,
  platformFeePercentage: 6.5,
  shippingCost: 4.5,
};

export function ProfitMarginCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const results = useMemo(() => calculateProfitMargin(inputs), [inputs]);

  const updateInput = (field: keyof ProfitMarginInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="sellingPrice"
          label="Selling price"
          value={inputs.sellingPrice}
          prefix="$"
          onChange={(value) => updateInput("sellingPrice", value)}
        />
        <InputField
          id="materialCost"
          label="Material cost"
          value={inputs.materialCost}
          prefix="$"
          onChange={(value) => updateInput("materialCost", value)}
        />
        <InputField
          id="electricityCost"
          label="Electricity cost"
          value={inputs.electricityCost}
          prefix="$"
          onChange={(value) => updateInput("electricityCost", value)}
        />
        <InputField
          id="platformFeePercentage"
          label="Platform fee percentage"
          value={inputs.platformFeePercentage}
          suffix="%"
          onChange={(value) => updateInput("platformFeePercentage", value)}
        />
        <InputField
          id="shippingCost"
          label="Shipping cost"
          value={inputs.shippingCost}
          prefix="$"
          onChange={(value) => updateInput("shippingCost", value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <ResultBox
          label="Net profit"
          value={formatCurrency(results.netProfit)}
          emphasis
        />
        <ResultBox
          label="Profit margin percentage"
          value={formatPercent(results.profitMargin)}
        />
      </div>
    </div>
  );
}
