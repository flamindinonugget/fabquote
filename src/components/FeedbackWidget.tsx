"use client";

import { useEffect, useMemo, useState } from "react";
import {
  feedbackOpenEvent,
  feedbackRepository,
  type FeedbackRating,
} from "@/lib/feedback";

type FeedbackForm = {
  rating: FeedbackRating | 0;
  tryingToAccomplish: string;
  frustration: string;
  paidFeature: string;
  email: string;
  interestedInTesting: boolean;
};

const emptyForm: FeedbackForm = {
  rating: 0,
  tryingToAccomplish: "",
  frustration: "",
  paidFeature: "",
  email: "",
  interestedInTesting: false,
};

const ratings: FeedbackRating[] = [1, 2, 3, 4, 5];

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FeedbackForm>(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const openModal = () => setIsOpen(true);
    window.addEventListener(feedbackOpenEvent, openModal);

    return () => window.removeEventListener(feedbackOpenEvent, openModal);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const canSubmit = useMemo(
    () =>
      form.rating > 0 &&
      form.tryingToAccomplish.trim().length > 0 &&
      form.frustration.trim().length > 0 &&
      form.paidFeature.trim().length > 0,
    [form],
  );

  const updateForm = <Field extends keyof FeedbackForm>(
    field: Field,
    value: FeedbackForm[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setError("");
    setIsSubmitted(false);
  };

  const submitFeedback = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please add a rating and answer the workflow questions.");
      return;
    }

    const saved = feedbackRepository.create({
      rating: form.rating as FeedbackRating,
      tryingToAccomplish: form.tryingToAccomplish.trim(),
      frustration: form.frustration.trim(),
      paidFeature: form.paidFeature.trim(),
      email: form.email.trim(),
      interestedInTesting: form.interestedInTesting,
    });

    if (!saved) {
      setError("Feedback could not be saved in this browser. Please try again.");
      return;
    }

    setForm(emptyForm);
    setIsSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-ink px-4 py-3 text-sm font-black text-white shadow-soft transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
        aria-haspopup="dialog"
      >
        Feedback
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/50 px-4 py-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-line bg-white p-5 shadow-soft sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-heading"
          >
            {isSubmitted ? (
              <ThankYouState onClose={closeModal} />
            ) : (
              <form onSubmit={submitFeedback}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
                      Early Access Feedback
                    </p>
                    <h2
                      id="feedback-modal-heading"
                      className="mt-2 text-2xl font-black tracking-tight text-ink"
                    >
                      Help improve FabQuote
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Tell us what you were trying to do, where the workflow
                      slowed down, and what would save the most time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-muted transition hover:bg-paper hover:text-ink focus:outline-none focus:ring-4 focus:ring-brand-100"
                    aria-label="Close feedback modal"
                  >
                    Close
                  </button>
                </div>

                <fieldset className="mt-5">
                  <legend className="text-sm font-semibold text-ink">
                    Overall experience
                  </legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-5">
                    {ratings.map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => updateForm("rating", rating)}
                        className={`rounded-md border px-2 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-brand-100 ${
                          form.rating === rating
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-line bg-paper text-ink hover:bg-brand-50"
                        }`}
                        aria-pressed={form.rating === rating}
                      >
                        Rating {rating}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5 grid gap-4">
                  <FeedbackTextarea
                    id="trying-to-accomplish"
                    label="What were you trying to accomplish?"
                    value={form.tryingToAccomplish}
                    onChange={(value) =>
                      updateForm("tryingToAccomplish", value)
                    }
                  />
                  <FeedbackTextarea
                    id="frustration"
                    label="What frustrated you?"
                    value={form.frustration}
                    onChange={(value) => updateForm("frustration", value)}
                  />
                  <FeedbackTextarea
                    id="paid-feature"
                    label="What feature would make FabQuote worth paying for?"
                    value={form.paidFeature}
                    onChange={(value) => updateForm("paidFeature", value)}
                  />
                  <label htmlFor="feedback-email" className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">
                      Optional email address
                    </span>
                    <input
                      id="feedback-email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateForm("email", event.target.value)
                      }
                      className="h-12 w-full rounded-md border-line bg-white px-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
                    />
                  </label>
                  <label className="flex items-start gap-3 rounded-md border border-line bg-paper p-3 text-sm font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={form.interestedInTesting}
                      onChange={(event) =>
                        updateForm("interestedInTesting", event.target.checked)
                      }
                      className="mt-0.5 h-5 w-5 rounded border-line text-brand-600 focus:ring-brand-500"
                    />
                    I&apos;d be interested in testing new features.
                  </label>
                </div>

                {error ? (
                  <p className="mt-4 rounded-md border border-coral-50 bg-coral-50 p-3 text-sm font-semibold text-coral-700">
                    {error}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
                  >
                    Submit Feedback
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-paper focus:outline-none focus:ring-4 focus:ring-brand-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

function FeedbackTextarea({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-md border-line bg-white px-3 py-3 text-base font-medium text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-brand-500"
      />
    </label>
  );
}

function ThankYouState({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
        Feedback received
      </p>
      <h2
        id="feedback-modal-heading"
        className="mt-3 text-3xl font-black tracking-tight text-ink"
      >
        Thank you for helping improve FabQuote.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted">
        Your feedback directly influences future development.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
      >
        Close
      </button>
    </div>
  );
}
