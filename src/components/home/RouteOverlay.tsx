"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

// The journey motif (scroll-drawn line + traveling van) is HOMEPAGE-ONLY — the homepage is the only
// page with stops. Interior routes render ZERO van/route nodes (Stage 13 ruling). The van's path also
// terminates a handoff gap ABOVE the footer card so it never enters/overlaps the footer at any scroll.
const HOME_PATH = "/";
const FOOTER_HANDOFF = 36; // px the line + van stop short of the footer seam (the terminus handoff) —
//                            the van arrives just above the ink card and hands off to its terminus motif

// THE FULL-PAGE ROUTE (Stage 6.4) — ONE continuous scroll-drawn line that runs from the spine's
// start, down through the proof band / audience triage / provider teaser / final CTA, curving gently
// through the left gutter, and ARRIVING at the footer seam aligned to the terminus motif. The trip
// visibly completes at the footer. Promoted from the section-bound SpineRail to a page-level overlay:
// it measures the geometry in PIXELS (mount + resize only), builds one path, and a livery van rides
// its FULL length. Perf: one passive scroll listener → one rAF → one CSS var (--route-progress);
// bounds cached, zero layout reads per frame. Desktop only (lg+); reduced-motion / mobile → the CSS
// default (fully drawn, no van). Decorative (aria-hidden). Reuses the spine-* CSS by arming
// data-spine-live on BOTH the region (stop reveals + mock micro-animations) and this overlay
// (path draw + nodes); the van + curve are route-specific.

const NODE_FRACTIONS = [12.5, 37.5, 62.5, 87.5]; // ~centre of each stop, within the SPINE portion
const INK_STOP = 2;

type Geo = {
  w: number;
  h: number;
  top: number;
  d: string;
  gutterX: number;
  nodes: { y: number; ink: boolean }[];
  inkY0: number;
  inkY1: number;
  docStart: number;
  docSpan: number;
};

export function RouteOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<HTMLSpanElement>(null);
  const geoRef = useRef<Geo | null>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== HOME_PATH) {
      // homepage-only: no listeners/geometry on interior routes. Clear any stale geometry so a
      // back/forward return to the homepage doesn't paint one frame off the previous measurement.
      geoRef.current = null;
      setGeo(null);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const region = document.querySelector<HTMLElement>("[data-spine-region]");
    const endEl = document.querySelector<HTMLElement>("[data-route-end]");
    // The route lands on the footer CARD's top edge (not the <footer> element, whose top includes
    // the outer light-gap padding). data-route-seam marks the ink card.
    const seamEl =
      document.querySelector<HTMLElement>("[data-route-seam]") ||
      document.querySelector<HTMLElement>("footer");
    // NOTE: `host` (the offset parent) is resolved INSIDE measure(), not here — below `lg` the overlay
    // root is display:none so `offsetParent` is null; gating the whole effect on it would skip the
    // resize listener and a narrow→wide resize would never initialize (resize-lockout). We only need
    // the stable page elements to be present to wire up listeners.
    if (!root || !region || !endEl || !seamEl) return;
    const stops = Array.from(region.querySelectorAll<HTMLElement>("[data-spine-stop]"));
    const containerEl = region.querySelector<HTMLElement>(".mx-auto");

    // Arm the region (stop reveals + mock micro-animations) only when motion is allowed.
    if (!reduce) region.setAttribute("data-spine-live", "");

    // U-turn LEG state machine (Task D). The lane is by LEG, not scroll direction, so a mid-page
    // reversal keeps the lane and only the nose rotates.
    let leg: "outbound" | "return" = "outbound";

    const measure = () => {
      // `offsetParent` is null while the overlay is display:none (below lg) — re-read it every measure
      // so a resize UP into lg re-initializes (and a resize down tears the geometry back to null).
      const host = root.offsetParent as HTMLElement | null;
      if (window.innerWidth < 1024 || !host) {
        geoRef.current = null;
        setGeo(null);
        return;
      }
      const sy = window.scrollY;
      const sx = window.scrollX;
      const hostRect = host.getBoundingClientRect();
      const hostTop = hostRect.top + sy;
      const hostLeft = hostRect.left + sx;
      const regionRect = region.getBoundingClientRect();
      const regionTopDoc = regionRect.top + sy;
      const top = regionTopDoc - hostTop;
      const seamDoc = seamEl.getBoundingClientRect().top + sy;
      // Stop the drawn line + van a handoff gap ABOVE the footer seam — the van must never paint into
      // or overlap the footer card (Stage 13). The footer's own terminus motif is the destination.
      const h = Math.max(1, seamDoc - regionTopDoc - FOOTER_HANDOFF);
      const w = root.offsetWidth;
      const endRect = endEl.getBoundingClientRect();
      const motifX = endRect.left + endRect.width / 2 + sx - hostLeft;

      // gutter X — sit just inside the content Container's OUTER edge, so the spine + its ±12px van
      // lane both stay left of where any column's text begins (content starts at outer edge + the
      // px-6/8 padding, ~32px). +2 keeps the outbound van's right edge clear of that text start.
      let gutterX = 40;
      if (containerEl) {
        gutterX = containerEl.getBoundingClientRect().left + sx - hostLeft + 2;
      }

      const nodes = NODE_FRACTIONS.map((f, i) => ({
        y: (regionRect.height * f) / 100,
        ink: i === INK_STOP,
      }));

      // Ink band (Stop 3) as fractions of h → gradient flip.
      let inkY0 = 0.4;
      let inkY1 = 0.55;
      const inkStop = stops[INK_STOP];
      if (inkStop) {
        const r = inkStop.getBoundingClientRect();
        inkY0 = Math.max(0, Math.min(1, (r.top + sy - regionTopDoc) / h));
        inkY1 = Math.max(0, Math.min(1, (r.bottom + sy - regionTopDoc) / h));
      }

      // Path: straight in the gutter through the stops + lower sections, then a gentle curve to the
      // motif over the last stretch (never crosses content — the gutter is left of every column).
      const curveLen = Math.min(h * 0.34, 460);
      const curveStart = h - curveLen;
      const cp = curveLen * 0.55;
      const d =
        `M${gutterX} 0 L${gutterX} ${curveStart.toFixed(1)} ` +
        `C${gutterX} ${(curveStart + cp).toFixed(1)} ${motifX.toFixed(1)} ${(h - cp).toFixed(1)} ${motifX.toFixed(1)} ${h.toFixed(1)}`;

      const vh = window.innerHeight;
      const docStart = regionTopDoc - vh * 0.72;
      const docSpan = Math.max(1, seamDoc - vh * 0.5 - docStart);

      const g: Geo = { w, h, top, d, gutterX, nodes, inkY0, inkY1, docStart, docSpan };
      geoRef.current = g;
      setGeo(g);
    };

    let ticking = false;
    let rafId = 0;
    let lastDirP = 0;
    const update = () => {
      ticking = false;
      const g = geoRef.current;
      if (!g) return;
      const p = Math.min(1, Math.max(0, (window.scrollY - g.docStart) / g.docSpan));
      root.style.setProperty("--route-progress", String(p));
      const dp = p - lastDirP;
      if (Math.abs(dp) > 0.003) {
        // nose follows scroll direction on BOTH legs (mid-page reversals only rotate the nose)
        root.setAttribute("data-direction", dp > 0 ? "down" : "up");
        lastDirP = p;
      }

      // U-TURN LEG MACHINE: OUTBOUND rides the right lane; at the terminus it U-turns (the lane
      // crosses to the left over ~450ms) → RETURN; back at the top it silently resets. The lane is by
      // LEG (not scroll direction) so mid-page reversals keep the lane.
      if (leg === "outbound" && p >= 0.985) {
        leg = "return";
        root.setAttribute("data-leg", "return");
      } else if (leg === "return" && p <= 0.02) {
        leg = "outbound";
        root.setAttribute("data-leg", "outbound");
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    measure();
    if (reduce) {
      // Complete static composition: fully drawn line, nodes lit by default (no data-spine-live),
      // no van (no data-direction → the @supports gate keeps it hidden).
      root.style.setProperty("--route-progress", "1");
    } else {
      // Arm the overlay: nodes start unlit and light via the IO; the van shows + faces travel.
      root.setAttribute("data-spine-live", "");
      root.setAttribute("data-direction", "down");
      root.setAttribute("data-leg", "outbound");
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    const onResize = () => {
      measure();
      if (reduce) root.style.setProperty("--route-progress", "1");
      else update();
    };
    window.addEventListener("resize", onResize);

    // Stop content reveal + node lighting (play-once) — unchanged behaviour.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-revealed");
          const idx = stops.indexOf(e.target as HTMLElement);
          root.querySelector(`[data-spine-node="${idx}"]`)?.classList.add("is-lit");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    if (!reduce) stops.forEach((s) => io.observe(s));

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      region.removeAttribute("data-spine-live");
      root.removeAttribute("data-spine-live");
      root.removeAttribute("data-direction");
      root.removeAttribute("data-leg");
    };
  }, [pathname]);

  // The van follows the measured path — offset-path can only be set imperatively (dynamic d).
  useEffect(() => {
    const van = vanRef.current;
    if (van && geo) {
      try {
        van.style.offsetPath = `path("${geo.d}")`;
      } catch {
        /* offset-path unsupported → @supports keeps the van hidden; the line still draws */
      }
    }
  }, [geo]);

  // Homepage-only: interior routes render nothing (zero van/route nodes in the DOM).
  if (pathname !== HOME_PATH) return null;

  return (
    <div
      ref={rootRef}
      // data-spine-live (nodes: unlit→IO-lit) + data-direction (van + facing) are set imperatively
      // in the effect ONLY when motion is allowed; under reduced-motion nodes are lit by default and
      // the van stays hidden. The path draw is not gated — it scrubs off --route-progress always.
      aria-hidden="true"
      className="route-overlay pointer-events-none absolute left-0 z-[5] hidden w-full lg:block"
      style={geo ? { top: geo.top, height: geo.h } : { top: 0, height: 0 }}
    >
      {geo ? (
        <>
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            preserveAspectRatio="none"
            fill="none"
            focusable="false"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="routeGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                <stop className="spine-grad-accent" offset="0" />
                <stop className="spine-grad-accent" offset={geo.inkY0} />
                <stop className="spine-grad-ink" offset={geo.inkY0} />
                <stop className="spine-grad-ink" offset={geo.inkY1} />
                <stop className="spine-grad-accent" offset={geo.inkY1} />
                <stop className="spine-grad-accent" offset="1" />
              </linearGradient>
            </defs>
            <path
              d={geo.d}
              className="route-path"
              stroke="url(#routeGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
            {geo.nodes.map((n, i) => (
              <circle
                key={i}
                data-spine-node={i}
                className={cn("spine-node", n.ink ? "spine-node-ink" : "fill-accent")}
                cx={geo.gutterX}
                cy={n.y}
                r={n.ink ? 6 : 5}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* THE LIVERY VAN (Task C) — a Nexo-liveried NEMT van: white/on-ink FILLED body, ink
              outline, one jade accent stripe, ink wheels. Self-coloured so it POPS on the green line
              and on every background it crosses (light / tint / ink). NEVER an ambulance. Rides the
              full path via offset-path; faces travel (rotation from 6.1). */}
          {/* Van v2 (Stage 6.5) — a MODERN transit-van profile (rounded roofline, sloped hood, window
              band, rocker line, hubbed wheels), not a box. The `.route-van-lane` inner wrapper carries
              the TWO-WAY LANE offset (±X perpendicular to the vertical route, by travel direction) so
              the offset-path machinery on `.route-van` stays untouched; the svg carries the nose
              rotation. Livery: white/on-ink body, ink outline, one jade stripe. NEVER an ambulance. */}
          <span ref={vanRef} className="route-van" aria-hidden="true">
            <span className="route-van-lane">
              <svg viewBox="0 0 32 20" className="block h-[19px] w-[30px]" fill="none" aria-hidden="true">
                {/* body — boxy rear, rounded roof, sloped hood to a rounded nose */}
                <path
                  d="M2.6 15.6 L2.6 8 Q2.6 5.5 5.1 5.5 L20 5.5 Q23 5.5 24.6 7.7 L27.7 11.4 Q29.1 12 29.1 13.7 L29.1 15.6 Z"
                  className="fill-on-ink stroke-ink"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                {/* window band — two side windows + an angled windshield */}
                <rect x="5.1" y="7.4" width="6.1" height="3.1" rx="0.6" className="stroke-ink" strokeWidth="0.85" />
                <rect x="12.5" y="7.4" width="6.1" height="3.1" rx="0.6" className="stroke-ink" strokeWidth="0.85" />
                <path d="M21 7.5 L23.7 7.7 L25.8 10.5 L21 10.5 Z" className="stroke-ink" strokeWidth="0.85" strokeLinejoin="round" />
                {/* jade livery stripe */}
                <line x1="3.4" y1="12.9" x2="27.6" y2="12.9" className="stroke-accent" strokeWidth="1.8" strokeLinecap="round" />
                {/* subtle rocker line */}
                <line x1="4.2" y1="14.5" x2="27.6" y2="14.5" className="stroke-ink" strokeWidth="0.7" strokeLinecap="round" opacity="0.45" />
                {/* wheels with hubs */}
                <circle cx="8.4" cy="15.9" r="2.8" className="fill-ink" />
                <circle cx="8.4" cy="15.9" r="1.1" className="fill-on-ink" />
                <circle cx="22.7" cy="15.9" r="2.8" className="fill-ink" />
                <circle cx="22.7" cy="15.9" r="1.1" className="fill-on-ink" />
              </svg>
            </span>
          </span>
        </>
      ) : null}
    </div>
  );
}
