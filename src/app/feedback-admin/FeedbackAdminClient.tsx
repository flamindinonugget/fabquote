"use client";

import { useEffect, useMemo, useState } from "react";
import {
  feedbackChangeEvent,
  feedbackRepository,
  formatFeedbackDate,
  type FeedbackSubmission,
} from "@/lib/feedback";
import { formatNumber } from "@/lib/format";

type SortKey = "newest" | "rating";

export function FeedbackAdminClient() {
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const loadSubmissions = () => setSubmissions(feedbackRepository.list());

  useEffect(() => {
    loadSubmissions();
    window.addEventListener(feedbackChangeEvent, loadSubmissions);

    return () => window.removeEventListener(feedbackChangeEvent, loadSubmissions);
  }, []);

  const filteredSubmissions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return submissions
      .filter((submission) =>
        [
          submission.rating,
          submission.tryingToAccomplish,
          submission.frustration,
          submission.paidFeature,
          submission.email,
          submission.interestedInTesting ? "tester testing" : "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .sort((first, second) => {
        if (sortKey === "rating") {
          return second.rating - first.rating;
        }

        return (
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
        );
      });
  }, [search, sortKey, submissions]);

  const averageRating = submissions.length
    ? submissions.reduce((total, submission) => total + submission.rating, 0) /
      submissions.length
    : 0;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(submissions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fabquote-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total submissions"
          value={String(submissions.length)}
        />
        <MetricCard
          label="Average rating"
          value={submissions.length ? `${formatNumber(averageRating, 1)}/5` : "-"}
        />
        <MetricCard
          label="Interested testers"
          value={String(
            submissions.filter((submission) => submission.interestedInTesting)
              .length,
          )}
        />
      </div>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-ink">
              Feedback entries
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Review workflow pain points, confusion, and payment-worthy
              improvements from Early Access users.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <label htmlFor="feedback-search" className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-muted">
                Search
              </span>
              <input
                id="feedback-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
              />
            </label>
            <label htmlFor="feedback-sort" className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-muted">
                Sort
              </span>
              <select
                id="feedback-sort"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="h-11 w-full rounded-md border-line bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none focus:border-brand-500 focus:ring-brand-500"
              >
                <option value="newest">Newest</option>
                <option value="rating">Rating</option>
              </select>
            </label>
            <button
              type="button"
              onClick={exportJson}
              className="self-end rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {filteredSubmissions.length ? (
            filteredSubmissions.map((submission) => (
              <FeedbackEntry key={submission.id} submission={submission} />
            ))
          ) : (
            <p className="rounded-lg border border-line bg-paper p-5 text-sm font-semibold text-muted">
              No feedback entries found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-ink">{value}</p>
    </article>
  );
}

function FeedbackEntry({ submission }: { submission: FeedbackSubmission }) {
  return (
    <article className="rounded-lg border border-line bg-paper p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-black text-ink">
            {"⭐".repeat(submission.rating)} {submission.rating}/5
          </p>
          <p className="mt-1 text-sm font-semibold text-muted">
            {submission.email || "No email"} |{" "}
            {submission.interestedInTesting
              ? "Interested in testing"
              : "Not marked for testing"}
          </p>
        </div>
        <p className="text-xs font-bold uppercase text-muted">
          {formatFeedbackDate(submission.createdAt)}
        </p>
      </div>
      <div className="mt-4 grid gap-3 text-sm leading-6">
        <FeedbackText
          label="Trying to accomplish"
          value={submission.tryingToAccomplish}
        />
        <FeedbackText label="Frustration" value={submission.frustration} />
        <FeedbackText
          label="Worth paying for"
          value={submission.paidFeature}
        />
      </div>
    </article>
  );
}

function FeedbackText({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold text-ink">{label}</p>
      <p className="mt-1 text-muted">{value}</p>
    </div>
  );
}
