import { readJson, writeJson } from "@/lib/browserStorage";

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackSubmission = {
  id: string;
  rating: FeedbackRating;
  tryingToAccomplish: string;
  frustration: string;
  paidFeature: string;
  email: string;
  interestedInTesting: boolean;
  createdAt: string;
};

export type FeedbackInput = Omit<FeedbackSubmission, "id" | "createdAt">;

export const feedbackOpenEvent = "fabquote:feedback-open";
export const feedbackChangeEvent = "fabquote:feedback-change";

const feedbackStorageKey = "fabquote:feedback-submissions";

export const feedbackRepository = {
  list() {
    return readJson<FeedbackSubmission[]>(feedbackStorageKey, []);
  },
  create(input: FeedbackInput) {
    const submission: FeedbackSubmission = {
      ...input,
      id: createId(),
      createdAt: new Date().toISOString(),
    };
    const wasSaved = writeJson(feedbackStorageKey, [
      submission,
      ...feedbackRepository.list(),
    ]);

    if (wasSaved) {
      emitFeedbackChange();
      return submission;
    }

    return null;
  },
};

export function openFeedbackModal() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(feedbackOpenEvent));
}

export function formatFeedbackDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function emitFeedbackChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(feedbackChangeEvent));
  }
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
