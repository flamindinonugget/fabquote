"use client";

import { useEffect, useMemo, useState } from "react";
import { HistoricalQuoteIntelligence } from "@/components/HistoricalQuoteIntelligence";
import { InputField } from "@/components/InputField";
import { ProfitProtectionReport } from "@/components/ProfitProtectionReport";
import { ResultBox } from "@/components/ResultBox";
import { SelectField } from "@/components/SelectField";
import { StlUpload } from "@/components/StlUpload";
import { TextField } from "@/components/TextField";
import { readString, removeStoredItem } from "@/lib/browserStorage";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { machineRepository, type Machine } from "@/lib/machines";
import { analyzeQuote } from "@/lib/quoteAnalyzer";
import {
  quoteTestLabStorageKey,
  type QuoteTestLabPayload,
} from "@/lib/quoteTestScenarios";
import {
  calculateStlQuote,
  defaultStlQuoteInputs,
  materialTypes,
  type StlQuoteInputs,
} from "@/lib/stlQuote";
import { QuoteExportPanel } from "./QuoteExportPanel";

export function StlQuoteGenerator() {
  const [inputs, setInputs] = useState(defaultStlQuoteInputs);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy quote");
  const [hasUploadedStl, setHasUploadedStl] = useState(false);
  const results = useMemo(() => calculateStlQuote(inputs), [inputs]);
  const selectedMachine = useMemo(
    () => machines.find((machine) => machine.id === selectedMachineId) || null,
    [machines, selectedMachineId],
  );
  const profitProtectionAnalysis = useMemo(
    () =>
      analyzeQuote({
        material: inputs.materialType,
        estimatedWeight: results.estimatedFilamentUsedGrams,
        estimatedPrintTime: inputs.estimatedPrintTimeHours,
        materialCost: results.materialCost,
        electricityCost: results.electricityCost,
        laborCost: inputs.setupLaborCost,
        shippingCost: inputs.shippingCost,
        machineProfile: selectedMachine,
        markup:
          inputs.pricingMode === "markup"
            ? inputs.markupPercentage
            : inputs.targetProfitMarginPercentage,
        failureRisk: inputs.failureRiskPercentage,
        finalPrice: results.recommendedDirectSalePrice,
        totalCost: results.totalCost,
        supportsEnabled: inputs.supportsEnabled,
        supportPercentageEstimate: inputs.supportPercentageEstimate,
      }),
    [inputs, results, selectedMachine],
  );

  useEffect(() => {
    const loadedMachines = machineRepository.list();
    setMachines(loadedMachines);

    const savedScenario = readString(quoteTestLabStorageKey);

    if (!savedScenario) {
      return;
    }

    try {
      const payload = JSON.parse(savedScenario) as QuoteTestLabPayload;
      setInputs(payload.stlInputs);
      setHasUploadedStl(false);
      setCopyStatus("Loaded test scenario");

      const matchingMachine = payload.machineName
        ? loadedMachines.find((machine) => machine.name === payload.machineName)
        : null;

      setSelectedMachineId(matchingMachine?.id || "");
    } catch (error) {
      console.error("Failed to load quote test scenario", error);
    } finally {
      removeStoredItem(quoteTestLabStorageKey);
    }
  }, []);

  const updateInput = <Field extends keyof StlQuoteInputs>(
    field: Field,
    value: StlQuoteInputs[Field],
  ) => {
    setInputs((current) => ({ ...current, [field]: value }));
    setCopyStatus("Copy quote");
  };

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(results.quoteSummary);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy unavailable");
    }
  };

  const resetQuote = () => {
    setInputs(defaultStlQuoteInputs);
    setSelectedMachineId("");
    setHasUploadedStl(false);
    setCopyStatus("Copy quote");
  };

  const applyMachine = (machineId: string) => {
    setSelectedMachineId(machineId);

    const machine = machines.find((item) => item.id === machineId);

    if (!machine) {
      return;
    }

    setInputs((current) => ({
      ...current,
      printerWattage: machine.wattage,
      printSpeedMmPerSecond: machine.typicalPrintSpeed,
      layerHeightMm: machine.layerHeightDefault,
      nozzleDiameterMm: machine.nozzleDiameter,
      setupLaborCost: machine.defaultLaborSetupFee,
      markupPercentage: machine.defaultMarkup,
    }));
    setCopyStatus("Copy quote");
  };

  const selectedDensity =
    inputs.materialType === "PLA"
      ? inputs.plaDensity
      : inputs.materialType === "PETG"
        ? inputs.petgDensity
        : inputs.materialType === "ABS"
          ? inputs.absDensity
          : inputs.materialType === "TPU"
            ? inputs.tpuDensity
            : inputs.resinDensity;

  return (
    <div className="grid gap-8">
      <StlUpload
        materialType={inputs.materialType}
        onAnalysisComplete={(analysis) => {
          setInputs((current) => ({
            ...current,
            projectName:
              current.projectName === defaultStlQuoteInputs.projectName ||
              current.projectName.trim() === ""
                ? analysis.fileName.replace(/\.stl$/i, "")
                : current.projectName,
            estimatedWeightGrams: Number(
              analysis.estimatedWeightGrams.toFixed(1),
            ),
            modelVolumeCm3: Number((analysis.volumeMm3 / 1000).toFixed(3)),
            modelSurfaceAreaMm2: Number(analysis.surfaceAreaMm2.toFixed(2)),
          }));
          setHasUploadedStl(true);
          setCopyStatus("Copy quote");
        }}
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="mb-5 rounded-lg border border-line bg-paper p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-ink">
                {inputs.pricingMode === "markup"
                  ? "Markup Mode"
                  : "Advanced Margin Mode"}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Markup Mode prices from cost plus markup. Advanced Mode solves
                for a true target profit margin.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={inputs.pricingMode === "margin"}
              onClick={() =>
                updateInput(
                  "pricingMode",
                  inputs.pricingMode === "markup" ? "margin" : "markup",
                )
              }
              className="rounded-md border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100"
            >
              Advanced Mode
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="machine-profile" className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-ink">
              Machine profile
            </span>
            <select
              id="machine-profile"
              value={selectedMachineId}
              onChange={(event) => applyMachine(event.target.value)}
              className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
            >
              <option value="">No machine selected</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs font-semibold text-muted">
              Selecting a machine autofills wattage, speed, layer height, nozzle,
              labor fee, and markup. You can still edit each value below.
            </span>
          </label>
          <TextField
            id="projectName"
            label="File name or project name"
            value={inputs.projectName}
            onChange={(value) => updateInput("projectName", value)}
          />
          <SelectField
            id="materialType"
            label="Material type"
            value={inputs.materialType}
            options={materialTypes}
            onChange={(value) => {
              const nextDensity =
                value === "PLA"
                  ? inputs.plaDensity
                  : value === "PETG"
                    ? inputs.petgDensity
                    : value === "ABS"
                      ? inputs.absDensity
                      : value === "TPU"
                        ? inputs.tpuDensity
                        : inputs.resinDensity;
              setInputs((current) => ({
                ...current,
                materialType: value,
                modelVolumeCm3: hasUploadedStl
                  ? current.modelVolumeCm3
                  : current.estimatedWeightGrams / nextDensity,
              }));
              setCopyStatus("Copy quote");
            }}
          />
          <InputField
            id="filamentCostPerKg"
            label="Filament cost per kg"
            value={inputs.filamentCostPerKg}
            prefix="$"
            onChange={(value) => updateInput("filamentCostPerKg", value)}
          />
          <InputField
            id="estimatedWeightGrams"
            label="Estimated model weight"
            value={inputs.estimatedWeightGrams}
            step={1}
            suffix="g"
            onChange={(value) => {
              setInputs((current) => ({
                ...current,
                estimatedWeightGrams: value,
                modelVolumeCm3: hasUploadedStl
                  ? current.modelVolumeCm3
                  : selectedDensity > 0
                    ? value / selectedDensity
                    : current.modelVolumeCm3,
                modelSurfaceAreaMm2: hasUploadedStl
                  ? current.modelSurfaceAreaMm2
                  : 0,
              }));
              setCopyStatus("Copy quote");
            }}
          />
          <InputField
            id="estimatedPrintTimeHours"
            label="Estimated print time"
            value={inputs.estimatedPrintTimeHours}
            suffix="hrs"
            onChange={(value) => updateInput("estimatedPrintTimeHours", value)}
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
            id="electricityCostPerKwh"
            label="Electricity cost per kWh"
            value={inputs.electricityCostPerKwh}
            prefix="$"
            onChange={(value) => updateInput("electricityCostPerKwh", value)}
          />
          <InputField
            id="setupLaborCost"
            label="Setup/labor cost"
            value={inputs.setupLaborCost}
            prefix="$"
            onChange={(value) => updateInput("setupLaborCost", value)}
          />
          <InputField
            id="failureRiskPercentage"
            label="Failure risk percentage"
            value={inputs.failureRiskPercentage}
            suffix="%"
            onChange={(value) => updateInput("failureRiskPercentage", value)}
          />
          <InputField
            id={
              inputs.pricingMode === "markup"
                ? "markupPercentage"
                : "targetProfitMarginPercentage"
            }
            label={
              inputs.pricingMode === "markup"
                ? "Markup percentage"
                : "Target profit margin"
            }
            value={
              inputs.pricingMode === "markup"
                ? inputs.markupPercentage
                : inputs.targetProfitMarginPercentage
            }
            suffix="%"
            onChange={(value) =>
              updateInput(
                inputs.pricingMode === "markup"
                  ? "markupPercentage"
                  : "targetProfitMarginPercentage",
                value,
              )
            }
          />
          <InputField
            id="marketplaceFeePercentage"
            label="Marketplace fee percentage (optional)"
            value={inputs.marketplaceFeePercentage}
            suffix="%"
            onChange={(value) => updateInput("marketplaceFeePercentage", value)}
          />
          <InputField
            id="shippingCost"
            label="Shipping cost"
            value={inputs.shippingCost}
            prefix="$"
            onChange={(value) => updateInput("shippingCost", value)}
          />
        </div>

        <QuoteExportPanel
          inputs={inputs}
          results={results}
          selectedMachine={selectedMachine}
        />

        <section
          className="mt-6 rounded-lg border border-line bg-paper p-4"
          aria-labelledby="print-settings-heading"
        >
          <h2
            id="print-settings-heading"
            className="text-lg font-black tracking-tight text-ink"
          >
            Print Settings
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField
              id="infillPercentage"
              label="Infill percentage"
              value={inputs.infillPercentage}
              suffix="%"
              onChange={(value) => updateInput("infillPercentage", value)}
            />
            <InputField
              id="layerHeightMm"
              label="Layer height"
              value={inputs.layerHeightMm}
              suffix="mm"
              onChange={(value) => updateInput("layerHeightMm", value)}
            />
            <InputField
              id="numberOfWalls"
              label="Number of walls"
              value={inputs.numberOfWalls}
              step={1}
              onChange={(value) => updateInput("numberOfWalls", value)}
            />
            <InputField
              id="topLayers"
              label="Top layers"
              value={inputs.topLayers}
              step={1}
              onChange={(value) => updateInput("topLayers", value)}
            />
            <InputField
              id="bottomLayers"
              label="Bottom layers"
              value={inputs.bottomLayers}
              step={1}
              onChange={(value) => updateInput("bottomLayers", value)}
            />
            <InputField
              id="supportPercentageEstimate"
              label="Support percentage estimate"
              value={inputs.supportPercentageEstimate}
              suffix="%"
              onChange={(value) =>
                updateInput("supportPercentageEstimate", value)
              }
            />
            <InputField
              id="printSpeedMmPerSecond"
              label="Print speed"
              value={inputs.printSpeedMmPerSecond}
              suffix="mm/s"
              onChange={(value) => updateInput("printSpeedMmPerSecond", value)}
            />
            <InputField
              id="nozzleDiameterMm"
              label="Nozzle diameter"
              value={inputs.nozzleDiameterMm}
              suffix="mm"
              onChange={(value) => updateInput("nozzleDiameterMm", value)}
            />
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-md border border-line bg-white p-3 text-sm font-bold text-ink">
            <input
              type="checkbox"
              checked={inputs.supportsEnabled}
              onChange={(event) =>
                updateInput("supportsEnabled", event.target.checked)
              }
              className="h-5 w-5 rounded border-line text-brand-600 focus:ring-brand-500"
            />
            Supports enabled
          </label>
        </section>

        <section
          className="mt-6 rounded-lg border border-line bg-paper p-4"
          aria-labelledby="material-settings-heading"
        >
          <h2
            id="material-settings-heading"
            className="text-lg font-black tracking-tight text-ink"
          >
            Material Settings
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField
              id="plaDensity"
              label="PLA density"
              value={inputs.plaDensity}
              suffix="g/cm3"
              onChange={(value) => updateInput("plaDensity", value)}
            />
            <InputField
              id="petgDensity"
              label="PETG density"
              value={inputs.petgDensity}
              suffix="g/cm3"
              onChange={(value) => updateInput("petgDensity", value)}
            />
            <InputField
              id="absDensity"
              label="ABS density"
              value={inputs.absDensity}
              suffix="g/cm3"
              onChange={(value) => updateInput("absDensity", value)}
            />
            <InputField
              id="tpuDensity"
              label="TPU density"
              value={inputs.tpuDensity}
              suffix="g/cm3"
              onChange={(value) => updateInput("tpuDensity", value)}
            />
            <InputField
              id="resinDensity"
              label="Resin density"
              value={inputs.resinDensity}
              suffix="g/cm3"
              onChange={(value) => updateInput("resinDensity", value)}
            />
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyQuote}
            className="rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            {copyStatus}
          </button>
          <button
            type="button"
            onClick={resetQuote}
            className="rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-paper focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <ProfitProtectionReport analysis={profitProtectionAnalysis} />
        <HistoricalQuoteIntelligence inputs={inputs} results={results} />

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultBox
            label="Estimated model volume"
            value={`${formatNumber(results.modelVolumeCm3, 2)} cm3`}
          />
          <ResultBox
            label="Estimated filament used"
            value={`${formatNumber(results.estimatedFilamentUsedGrams, 1)} g`}
          />
          <ResultBox
            label="Estimated filament length"
            value={`${formatNumber(results.estimatedFilamentLengthMeters, 2)} m`}
          />
          <ResultBox
            label="Estimated support material"
            value={`${formatNumber(results.estimatedSupportMaterialGrams, 1)} g`}
          />
          <ResultBox
            label="Estimated total material cost"
            value={formatCurrency(results.estimatedTotalMaterialCost)}
          />
          <ResultBox
            label="Material cost"
            value={formatCurrency(results.materialCost)}
          />
          <ResultBox
            label="Electricity cost"
            value={formatCurrency(results.electricityCost)}
          />
          <ResultBox
            label="Risk buffer"
            value={formatCurrency(results.riskBuffer)}
          />
          <ResultBox
            label="Marketplace fee impact"
            value={formatCurrency(results.marketplaceFeeImpact)}
          />
          <ResultBox
            label="Total cost"
            value={formatCurrency(results.totalCost)}
          />
          <ResultBox
            label="Recommended direct sale price"
            value={formatCurrency(results.recommendedDirectSalePrice)}
            emphasis
          />
          <ResultBox
            label="Recommended marketplace sale price"
            value={formatCurrency(results.recommendedMarketplaceSalePrice)}
            emphasis
          />
          <ResultBox
            label="Expected profit"
            value={formatCurrency(results.expectedProfit)}
          />
          <ResultBox
            label="Profit margin"
            value={formatPercent(results.profitMargin)}
          />
        </div>

        <p className="rounded-md bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-700">
          Slicer software is the source of truth. This is an engineering
          estimate based on mesh volume, density, infill, shell approximation,
          and support assumptions.
        </p>

        <section
          className="rounded-lg border border-line bg-paper p-4"
          aria-labelledby="quote-summary-heading"
        >
          <h2
            id="quote-summary-heading"
            className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700"
          >
            Suggested quote summary
          </h2>
          <pre className="mt-3 whitespace-pre-wrap rounded-md border border-line bg-white p-4 text-sm leading-6 text-ink">
            {results.quoteSummary}
          </pre>
        </section>
      </div>
      </div>
    </div>
  );
}
