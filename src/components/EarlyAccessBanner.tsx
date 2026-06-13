"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readString, writeString } from "@/lib/browserStorage";
import { openFeedbackModal } from "@/lib/feedback";

const earlyAccessDismissedKey = "fabquote:early-access-banner-dismissed";

export function EarlyAccessBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(readString(earlyAccessDismissedKey) === "true");
  }, []);

  const dismissBanner = () => {
    writeString(earlyAccessDismissedKey, "true");
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <section className="border-b border-brand-100 bg-brand-50" aria-label="FabQuote Early Access">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-black text-brand-700">
            FabQuote Early Access
          </p>
          <p className="mt-1 max-w-4xl text-sm font-semibold leading-6 text-ink">
            FabQuote is actively evolving with input from real 3D printing
            businesses. If you encounter an issue or have an idea, we&apos;d
            love to hear from you.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openFeedbackModal}
            className="fq-button-primary px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-100"
          >
            Leave Feedback
          </button>
          <Link
            href="/#early-access"
            className="fq-button-secondary px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            Learn More
          </Link>
          <button
            type="button"
            onClick={dismissBanner}
            className="rounded-md border border-transparent px-3 py-2 text-sm font-bold text-muted transition hover:bg-white hover:text-ink focus:outline-none focus:ring-4 focus:ring-brand-100"
            aria-label="Dismiss Early Access banner"
          >
            Dismiss
          </button>
        </div>
      </div>
    </section>
  );
}
