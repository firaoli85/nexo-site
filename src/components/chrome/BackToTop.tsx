"use client";

import { ArrowUp } from "lucide-react";

// Small client leaf for the terminus footer's "Back to top" utility — a REAL <button> (keyboard
// operable, focus-visible ring). Smooth scroll is gated by prefers-reduced-motion → instant, matched
// at click time (not just the CSS `scroll-behavior`, since window.scrollTo overrides it).
export function BackToTop({ className }: { className?: string }) {
  const onClick = () => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      Back to top
      <ArrowUp
        aria-hidden="true"
        className="h-3.5 w-3.5 motion-safe:transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
      />
    </button>
  );
}
