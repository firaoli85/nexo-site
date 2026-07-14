"use client";

import { useEffect } from "react";

// LANDMARK REVEAL (Stage 6.5) — ONE client component (rendered once in the layout) that observes
// every server-rendered `[data-ambient-map]` with a SINGLE IntersectionObserver and reveals its
// landmark layer play-once as the section enters. Keeping the map itself server-rendered (no 8
// hydrated instances) while still getting the reveal — react-performance: one observer, no per-frame
// work, unobserve after firing. DEFAULT (no-JS / reduced-motion) = landmarks visible (the arm only
// happens when motion is allowed). Decorative; renders nothing.
export function MapObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const maps = Array.from(document.querySelectorAll<SVGElement>("[data-ambient-map]"));
    if (!maps.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-map-in", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.2 }
    );
    // Only arm (hide → reveal) maps that are BELOW the fold. A map already in the initial viewport
    // (the hero) was painted visible by SSR — hiding it for a frame would flash; leave it as-is.
    maps.forEach((m) => {
      const r = m.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return; // already visible → no reveal, no flash
      m.setAttribute("data-map-live", "");
      io.observe(m);
    });
    return () => {
      io.disconnect();
      maps.forEach((m) => {
        m.removeAttribute("data-map-live");
        m.removeAttribute("data-map-in");
      });
    };
  }, []);

  return null;
}
