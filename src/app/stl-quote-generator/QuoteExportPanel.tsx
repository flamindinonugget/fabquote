"use client";

import Link from "next/link";
import { useState } from "react";
import { TextField } from "@/components/TextField";
import type { Machine } from "@/lib/machines";
import { createQuoteNumber, quoteRepository } from "@/lib/workspace";
import type { StlQuoteInputs, StlQuoteResults } from "@/lib/stlQuote";

type QuoteExportPanelProps = {
  inputs: StlQuoteInputs;
  results: StlQuoteResults;
  selectedMachine: Machine | null;
};

type QuoteDetails = {
  customerName: string;
  customerEmail: string;
  quoteNumber: string;
  expirationDate: string;
  businessName: string;
  businessEmail: string;
  notes: string;
};

type PrintQuoteInput = {
  details: QuoteDetails;
  inputs: StlQuoteInputs;
  results: StlQuoteResults;
};

const DISCLAIMER =
  "This quote is an estimate. Final pricing may vary based on slicer settings, print failures, post-processing, and customer requirements.";

function createDefaultQuoteDetails(): QuoteDetails {
  return {
    customerName: "",
    customerEmail: "",
    quoteNumber: `Q-${new Date().getFullYear()}-001`,
    expirationDate: "",
    businessName: "",
    businessEmail: "",
    notes: "",
  };
}

export function QuoteExportPanel({
  inputs,
  results,
  selectedMachine,
}: QuoteExportPanelProps) {
  const [quoteDetails, setQuoteDetails] = useState(createDefaultQuoteDetails);
  const [printStatus, setPrintStatus] = useState("Open Printable Quote");
  const [printError, setPrintError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Save Quote");

  const updateQuoteDetail = <Field extends keyof QuoteDetails>(
    field: Field,
    value: QuoteDetails[Field],
  ) => {
    setQuoteDetails((current) => ({ ...current, [field]: value }));
    setPrintStatus("Open Printable Quote");
    setSaveStatus("Save Quote");
    setPrintError("");
  };

  const handleOpenPrintableQuote = () => {
    setPrintStatus("Opening quote...");
    setPrintError("");

    try {
      openPrintableQuote({
        details: quoteDetails,
        inputs,
        results,
      });
      setPrintStatus("Printable quote opened");
      window.setTimeout(() => setPrintStatus("Open Printable Quote"), 2500);
    } catch (error) {
      console.error("Failed to open printable quote", error);
      setPrintStatus("Open failed - try again");
      setPrintError(
        "The printable quote could not open. Allow pop-ups for this site and try again.",
      );
    }
  };

  const handleSaveQuote = () => {
    quoteRepository.create({
      quoteNumber: quoteDetails.quoteNumber.trim() || createQuoteNumber(),
      customerId: "",
      projectId: "",
      stlFileName: inputs.projectName,
      material: inputs.materialType,
      estimatedWeight: results.estimatedFilamentUsedGrams,
      estimatedPrintTime: inputs.estimatedPrintTimeHours,
      materialCost: results.materialCost,
      electricityCost: results.electricityCost,
      laborCost: inputs.setupLaborCost,
      shippingCost: inputs.shippingCost,
      riskBuffer: results.riskBuffer,
      markupPercentage:
        inputs.pricingMode === "markup"
          ? inputs.markupPercentage
          : inputs.targetProfitMarginPercentage,
      finalPrice: results.recommendedDirectSalePrice,
      machineId: selectedMachine?.id,
      machineName: selectedMachine?.name,
      status: "draft",
      notes: quoteDetails.notes,
    });
    setSaveStatus("Quote saved locally");
    window.setTimeout(() => setSaveStatus("Save Quote"), 2500);
  };

  return (
    <section
      className="mt-6 rounded-lg border border-line bg-paper p-4"
      aria-labelledby="quote-details-heading"
    >
      <h2
        id="quote-details-heading"
        className="text-lg font-black tracking-tight text-ink"
      >
        Quote Details
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField
          id="customerName"
          label="Customer name"
          value={quoteDetails.customerName}
          onChange={(value) => updateQuoteDetail("customerName", value)}
        />
        <TextField
          id="customerEmail"
          label="Customer email"
          type="email"
          value={quoteDetails.customerEmail}
          onChange={(value) => updateQuoteDetail("customerEmail", value)}
        />
        <TextField
          id="quoteNumber"
          label="Quote number"
          value={quoteDetails.quoteNumber}
          onChange={(value) => updateQuoteDetail("quoteNumber", value)}
        />
        <label htmlFor="expirationDate" className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            Quote expiration date
          </span>
          <input
            id="expirationDate"
            type="date"
            value={quoteDetails.expirationDate}
            onChange={(event) =>
              updateQuoteDetail("expirationDate", event.target.value)
            }
            className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
          />
        </label>
        <TextField
          id="businessName"
          label="Business name"
          value={quoteDetails.businessName}
          onChange={(value) => updateQuoteDetail("businessName", value)}
        />
        <TextField
          id="businessEmail"
          label="Business email"
          type="email"
          value={quoteDetails.businessEmail}
          onChange={(value) => updateQuoteDetail("businessEmail", value)}
        />
      </div>
      <label htmlFor="quoteNotes" className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold text-ink">Notes</span>
        <textarea
          id="quoteNotes"
          value={quoteDetails.notes}
          onChange={(event) => updateQuoteDetail("notes", event.target.value)}
          rows={4}
          className="w-full rounded-md border-line bg-white px-3 py-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
        />
      </label>
      <div className="mt-5">
        <button
          type="button"
          onClick={handleOpenPrintableQuote}
          className="rounded-md bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
        >
          {printStatus}
        </button>
      </div>
      <div className="mt-5 grid gap-3">
        <div className="rounded-md border border-line bg-white p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black text-ink">Save Quote</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Store this quote in browser localStorage and review it on the
                Quotes page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveQuote}
              className="shrink-0 rounded-md bg-brand-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
            >
              {saveStatus}
            </button>
          </div>
        </div>
        <LockedFeature
          title="Branded Quote"
          plan="Pro"
          description="Add logo, brand colors, and reusable business details to printable quotes."
          control="checkbox"
        />
        <LockedFeature
          title="Public Quote Request Form"
          plan="Shop"
          description="Let customers submit STL files and project notes through a public intake form."
          control="teaser"
        />
      </div>
      {printError ? (
        <p className="mt-3 rounded-md border border-coral-50 bg-coral-50 p-3 text-sm font-semibold text-coral-700">
          {printError}
        </p>
      ) : null}
    </section>
  );
}

function LockedFeature({
  title,
  plan,
  description,
  control,
}: {
  title: string;
  plan: "Pro" | "Shop";
  description: string;
  control: "button" | "checkbox" | "teaser";
}) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-ink">{title}</p>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
              Locked behind {plan}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {control === "checkbox" ? (
            <label className="flex cursor-not-allowed items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-xs font-bold text-muted">
              <input type="checkbox" disabled className="h-4 w-4" />
              Branded
            </label>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md border border-line bg-paper px-3 py-2 text-xs font-bold text-muted"
            >
              {control === "button" ? title : "Shop feature"}
            </button>
          )}
          <Link
            href="/pricing"
            className="rounded-md bg-brand-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </div>
  );
}

function openPrintableQuote({ details, inputs, results }: PrintQuoteInput) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("The browser blocked the printable quote window.");
  }

  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(
    buildPrintableQuoteHtml({
      details,
      inputs,
      results,
    }),
  );
  printWindow.document.close();
}

function buildPrintableQuoteHtml({
  details,
  inputs,
  results,
}: PrintQuoteInput) {
  const title = `Quote ${details.quoteNumber || formatDate(new Date())}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color: #172033;
      background: #f7f9fc;
      font-family: Arial, Helvetica, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #f7f9fc;
      color: #172033;
      font-size: 14px;
      line-height: 1.5;
    }

    .page {
      width: min(100%, 860px);
      margin: 0 auto;
      padding: 40px 28px;
    }

    .quote {
      background: #ffffff;
      border: 1px solid #dbe3ee;
      border-radius: 8px;
      padding: 34px;
    }

    .top-bar {
      height: 4px;
      background: #1877f2;
      border-radius: 999px;
      margin-bottom: 28px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #dbe3ee;
      padding-bottom: 24px;
    }

    h1,
    h2 {
      margin: 0;
      color: #172033;
    }

    h1 {
      font-size: 30px;
      line-height: 1.1;
    }

    h2 {
      border-bottom: 1px solid #dbe3ee;
      font-size: 15px;
      letter-spacing: 0.03em;
      margin-top: 28px;
      padding-bottom: 8px;
      text-transform: uppercase;
    }

    .muted {
      color: #5b6577;
    }

    .quote-label {
      color: #1877f2;
      font-size: 18px;
      font-weight: 700;
      text-align: right;
      text-transform: uppercase;
    }

    .grid {
      display: grid;
      gap: 12px 24px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 16px;
    }

    .row {
      break-inside: avoid;
    }

    .label {
      color: #5b6577;
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .value {
      display: block;
      font-size: 14px;
      font-weight: 700;
      margin-top: 2px;
      overflow-wrap: anywhere;
    }

    .price {
      color: #1877f2;
      font-size: 18px;
    }

    .notes,
    .disclaimer {
      border: 1px solid #dbe3ee;
      border-radius: 8px;
      margin-top: 16px;
      padding: 14px;
      white-space: pre-wrap;
    }

    .disclaimer {
      background: #fff7e6;
      border-color: #f4d38d;
      color: #6f4b00;
      font-weight: 700;
    }

    .screen-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    .screen-actions button {
      background: #172033;
      border: 0;
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      font-weight: 700;
      padding: 10px 14px;
    }

    @media (max-width: 700px) {
      .page {
        padding: 20px 12px;
      }

      .quote {
        padding: 22px;
      }

      .header,
      .grid {
        grid-template-columns: 1fr;
      }

      .header {
        display: grid;
      }

      .quote-label {
        text-align: left;
      }
    }

    @media print {
      @page {
        margin: 0.55in;
      }

      body,
      .page {
        background: #ffffff;
        padding: 0;
      }

      .quote {
        border: 0;
        border-radius: 0;
        padding: 0;
      }

      .screen-actions {
        display: none;
      }

      h2,
      .row,
      .notes,
      .disclaimer {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="screen-actions">
      <button type="button" onclick="window.print()">Print / Save PDF</button>
    </div>
    <article class="quote" aria-label="Printable quote">
      <div class="top-bar"></div>
      <header class="header">
        <div>
          <h1>${escapeHtml(details.businessName || "FabQuote Quote")}</h1>
          <p class="muted">${escapeHtml(details.businessEmail || "")}</p>
        </div>
        <div>
          <div class="quote-label">Quote</div>
          <p class="muted">${escapeHtml(details.quoteNumber || "-")}</p>
        </div>
      </header>
      ${section("Quote Details", [
        row("Quote number", details.quoteNumber),
        row("Date created", formatDate(new Date())),
        row("Expiration date", details.expirationDate || "-"),
        row("Customer name", details.customerName),
        row("Customer email", details.customerEmail),
        row("Project / STL file", inputs.projectName),
        row("Material selected", inputs.materialType),
      ])}
      ${section("Print Settings Summary", [
        row("Infill", `${inputs.infillPercentage}%`),
        row("Layer height", `${inputs.layerHeightMm} mm`),
        row("Walls", `${inputs.numberOfWalls}`),
        row("Top / bottom layers", `${inputs.topLayers} / ${inputs.bottomLayers}`),
        row("Supports", inputs.supportsEnabled ? "Enabled" : "Disabled"),
        row("Support estimate", `${inputs.supportPercentageEstimate}%`),
        row("Print speed", `${inputs.printSpeedMmPerSecond} mm/s`),
        row("Nozzle diameter", `${inputs.nozzleDiameterMm} mm`),
      ])}
      ${section("Estimate", [
        row("Model volume", `${number(results.modelVolumeCm3)} cm3`),
        row(
          "Estimated filament used",
          `${number(results.estimatedFilamentUsedGrams)} g`,
        ),
        row("Estimated filament length", `${number(results.estimatedFilamentLengthMeters)} m`),
        row(
          "Estimated support material",
          `${number(results.estimatedSupportMaterialGrams)} g`,
        ),
        row("Estimated print time", `${number(inputs.estimatedPrintTimeHours)} hours`),
        row("Material cost", money(results.materialCost)),
        row("Electricity cost", money(results.electricityCost)),
        row("Labor/setup cost", money(inputs.setupLaborCost)),
        row("Risk buffer", money(results.riskBuffer)),
        row("Shipping cost", money(inputs.shippingCost)),
        inputs.marketplaceFeePercentage > 0
          ? row("Marketplace fee impact", money(results.marketplaceFeeImpact))
          : "",
        row(
          "Recommended direct sale price",
          money(results.recommendedDirectSalePrice),
          "price",
        ),
        row(
          "Recommended marketplace sale price",
          money(results.recommendedMarketplaceSalePrice),
          "price",
        ),
        row("Expected profit", money(results.expectedProfit)),
      ])}
      ${
        details.notes.trim()
          ? `<h2>Notes</h2><div class="notes">${escapeHtml(details.notes)}</div>`
          : ""
      }
      <h2>Disclaimer</h2>
      <div class="disclaimer">${escapeHtml(DISCLAIMER)}</div>
    </article>
  </main>
  <script>
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, 300);
    });
  </script>
</body>
</html>`;
}

function section(title: string, rows: string[]) {
  return `<section><h2>${escapeHtml(title)}</h2><div class="grid">${rows.join("")}</div></section>`;
}

function row(label: string, value: string | number, className = "") {
  const classes = ["value", className].filter(Boolean).join(" ");

  return `<div class="row"><span class="label">${escapeHtml(label)}</span><span class="${classes}">${escapeHtml(String(value || "-"))}</span></div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function number(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}
