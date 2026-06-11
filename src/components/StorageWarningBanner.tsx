"use client";

import { useEffect, useState } from "react";
import { storageWarningEvent } from "@/lib/browserStorage";

export function StorageWarningBanner() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleWarning = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      setMessage(
        customEvent.detail?.message ||
          "FabQuote could not access local browser storage.",
      );
    };

    window.addEventListener(storageWarningEvent, handleWarning);

    return () => window.removeEventListener(storageWarningEvent, handleWarning);
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      className="border-b border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-700"
      role="status"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>{message}</p>
        <button
          type="button"
          onClick={() => setMessage("")}
          className="self-start rounded-md border border-amber-500/30 bg-white px-3 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-50 sm:self-auto"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
