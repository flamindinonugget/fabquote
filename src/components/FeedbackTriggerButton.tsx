"use client";

import { openFeedbackModal } from "@/lib/feedback";

type FeedbackTriggerButtonProps = {
  label: string;
};

export function FeedbackTriggerButton({ label }: FeedbackTriggerButtonProps) {
  return (
    <button
      type="button"
      onClick={openFeedbackModal}
      className="inline-flex rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
    >
      {label}
    </button>
  );
}
