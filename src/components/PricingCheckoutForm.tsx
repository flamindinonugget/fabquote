"use client";

import Link from "next/link";
import { useState } from "react";
import type { BillingPlanId } from "@/lib/billing";

type PricingCheckoutFormProps = {
  planId: BillingPlanId;
  cta: string;
  highlighted?: boolean;
};

export function PricingCheckoutForm({
  planId,
  cta,
  highlighted = false,
}: PricingCheckoutFormProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          customerEmail: customerEmail.trim() || undefined,
          acceptedTerms,
        }),
      });
      const body = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !body.url) {
        throw new Error(body.error || "Unable to start checkout.");
      }

      window.location.assign(body.url);
    } catch (checkoutError) {
      setStatus("error");
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout.",
      );
    }
  };

  return (
    <div className="mt-6 grid gap-3">
      <label htmlFor={`${planId}-email`} className="block">
        <span className="sr-only">Email for Stripe Checkout</span>
        <input
          id={`${planId}-email`}
          type="email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          placeholder="Email for checkout"
          className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
      </label>
      <label className="flex items-start gap-3 rounded-md border border-line bg-white p-3 text-xs font-semibold leading-5 text-muted shadow-sm">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line text-mint-500 focus:ring-4 focus:ring-mint-100"
        />
        <span>
          I agree to the{" "}
          <Link
            className="fq-link rounded-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
            href="/terms-of-service"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="fq-link rounded-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={!acceptedTerms || status === "loading"}
        className={`inline-flex w-full justify-center rounded-md px-4 py-3 text-sm font-black shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
          highlighted
            ? "bg-mint-500 text-white hover:bg-mint-600 focus:ring-mint-100"
            : "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-100"
        }`}
      >
        {status === "loading" ? "Opening Stripe..." : cta}
      </button>
      {status === "error" ? (
        <p className="rounded-md border border-coral-50 bg-coral-50 p-3 text-xs font-semibold text-coral-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
