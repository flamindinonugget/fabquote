"use client";

import { useRef, useState } from "react";
import { formatNumber } from "@/lib/format";
import { analyzeStlFile, type StlAnalysis } from "@/lib/stlParser";
import type { MaterialType } from "@/lib/materials";

type StlUploadProps = {
  materialType: MaterialType;
  onAnalysisComplete: (analysis: StlAnalysis) => void;
};

export function StlUpload({
  materialType,
  onAnalysisComplete,
}: StlUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [analysis, setAnalysis] = useState<StlAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setError("");
    setIsAnalyzing(true);

    try {
      const nextAnalysis = await analyzeStlFile(file, materialType);
      setAnalysis(nextAnalysis);
      onAnalysisComplete(nextAnalysis);
    } catch (caughtError) {
      setAnalysis(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to analyze this STL file.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section
      className="rounded-lg border border-line bg-paper p-4"
      aria-labelledby="stl-upload-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            STL analysis
          </p>
          <h2
            id="stl-upload-heading"
            className="mt-2 text-xl font-black tracking-tight text-ink"
          >
            Upload STL for local weight estimate
          </h2>
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Browser only
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFile(event.dataTransfer.files[0]);
        }}
        className={`mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition focus:outline-none focus:ring-4 focus:ring-brand-100 ${
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-line bg-white hover:bg-brand-50"
        }`}
      >
        <span className="text-base font-black text-ink">
          Drop a .stl file here
        </span>
        <span className="mt-2 max-w-xl text-sm leading-6 text-muted">
          The file stays on this device. Volume is estimated from mesh geometry
          and converted to weight using the selected material density.
        </span>
        <span className="mt-3 text-sm font-bold text-brand-700">
          Choose STL file
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".stl"
        className="sr-only"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />

      {isAnalyzing ? (
        <p className="mt-4 text-sm font-semibold text-muted" role="status">
          Analyzing STL geometry...
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md border border-coral-50 bg-coral-50 p-3 text-sm font-semibold text-coral-700">
          {error}
        </p>
      ) : null}

      {analysis ? (
        <div className="mt-4 grid gap-3 rounded-lg border border-line bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-muted">File</p>
            <p className="mt-1 font-bold text-ink">{analysis.fileName}</p>
          </div>
          <div>
            <p className="font-semibold text-muted">Size</p>
            <p className="mt-1 font-bold text-ink">
              {formatFileSize(analysis.fileSizeBytes)}
            </p>
          </div>
          <div>
            <p className="font-semibold text-muted">Volume</p>
            <p className="mt-1 font-bold text-ink">
              {formatNumber(analysis.volumeMm3 / 1000, 2)} cm3
            </p>
          </div>
          <div>
            <p className="font-semibold text-muted">Estimated weight</p>
            <p className="mt-1 font-bold text-ink">
              {formatNumber(analysis.estimatedWeightGrams, 1)} g
            </p>
          </div>
        </div>
      ) : null}

      <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-700">
        Print time still depends on slicer settings such as layer height,
        infill, supports, wall count, speed, and machine profile.
      </p>
    </section>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${formatNumber(bytes / 1024, 1)} KB`;
  }

  return `${formatNumber(bytes / (1024 * 1024), 2)} MB`;
}
