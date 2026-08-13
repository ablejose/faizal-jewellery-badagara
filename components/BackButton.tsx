"use client";

import { useRouter } from "next/navigation";

/**
 * Back button for collection pages. Uses browser history when available so it
 * returns the user to wherever they came from (usually the homepage), and falls
 * back to the homepage collections section on a direct/first visit.
 */
export function BackButton() {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/#collections");
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className="btn-secondary inline-flex items-center gap-2"
    >
      <span aria-hidden="true">&larr;</span> Back
    </button>
  );
}
