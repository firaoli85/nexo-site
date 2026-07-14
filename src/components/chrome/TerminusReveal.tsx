"use client";

import { useEffect } from "react";

// THE PREMIUM TERMINUS — arrival choreography (Stage 6.8). A client leaf that arms a PLAY-ONCE
// settle on the footer card when it first enters view: the terminus route segment draws in, the
// terminal node scale-settles, the buffer-stop tick lands, then the wordmark + mission rise and the
// link columns follow — all transform/opacity, ≤600ms, decelerate. It arms `data-terminus-live` (the
// hidden initial state) ONLY when motion is allowed, so SSR / reduced-motion render the COMPLETE
// static composition (zero CLS — every element already occupies its final space). Never on scroll-up:
// the IO disconnects after the first intersection.
export function TerminusReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = document.querySelector<HTMLElement>("[data-route-seam]");
    if (!card) return;
    // If the footer is ALREADY in view at mount (short pages, tall viewports, an in-page anchor jump,
    // scroll restored to the bottom), do NOT arm the hidden state — the SSR static composition already
    // painted, so hiding-then-revealing it would flash. Only choreograph a footer that scrolls IN.
    const r = card.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    card.setAttribute("data-terminus-live", ""); // arm the hidden initial state (transform/opacity only)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.setAttribute("data-terminus-in", "");
          io.disconnect(); // play-once — never re-arms on scroll-up
        }
      },
      { threshold: 0.2 }
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  return null;
}
