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
// it measures the geometry in PIXELS, builds one path, and a livery van rides its FULL length.
// Perf: one passive scroll listener → one rAF → one CSS var (--route-progress); bounds cached,
// zero layout reads per frame.
//
// C4 / FO-1 FIX (Task #19) — the line and the van consume ONE geometry, and that geometry stays
// current. Two independent failures were measured on the unfixed build and both are closed here:
//
//   1. DIVERGENCE (line vs van). The SVG used to be sized by CSS (h-full w-full) with
//      preserveAspectRatio="none", so its CTM scaled X by rendered/geo.w while the van's
//      CSS offset-path consumed the SAME path string as RAW pixels with no CTM at all. Any drift
//      between the host's live width and the measured geo.w sheared one against the other.
//      MEASURED: the shear is (1 - ctm.a) * pathX and is PURELY HORIZONTAL — dy stayed within
//      0.09px at every scroll position and every width delta tested. That corrects the
//      arc-length-reparameterisation reasoning recorded in FO-1: the browser parameterises the
//      dash in USER space, so a non-uniform stretch cannot express vertically.
//      FIX: the SVG is now sized in PIXELS (width/height + inline style = geo.w/geo.h) and
//      preserveAspectRatio is gone. The viewBox matches those dimensions exactly, so the CTM is
//      forced to identity and NO stretch is representable. The divergence class is removed rather
//      than narrowed, and it costs nothing per frame — which is why this was chosen over driving
//      the van from getPointAtLength(), which would have added a geometry read to every frame to
//      fix the SMALLER of the two failures.
//
//   2. STALE BAND (the dominant field failure). measure() ran on mount and window.resize ONLY, so
//      any post-mount reflow that does not resize the window — fonts settling under
//      display:"optional", images landing, content toggling — left geo.h, geo.top and the
//      docStart/docSpan progress mapping describing a page that no longer exists.
//      MEASURED: a post-mount document growth left the route terminating 1536px above the footer
//      seam instead of the intended 36px handoff. That is the only measured mechanism with
//      vertical magnitude, and it is machine-speed dependent exactly as FO-1 reports — a fast box
//      settles before the mount measurement is stale, a slow one does not.
//      FIX: a ResizeObserver on the document element, the measured region and the host re-measures
//      on reflow, rAF-debounced, with an equality guard so an unchanged geometry never re-renders
//      (which also stops the observer feeding itself). Desktop only (lg+); reduced-motion / mobile → the CSS
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

function sameGeo(a: Geo, b: Geo) {
  return (
    a.w === b.w && a.h === b.h && a.top === b.top && a.d === b.d &&
    a.gutterX === b.gutterX && a.inkY0 === b.inkY0 && a.inkY1 === b.inkY1 &&
    a.docStart === b.docStart && a.docSpan === b.docSpan &&
    a.nodes.length === b.nodes.length && a.nodes.every((n, i) => n.y === b.nodes[i].y && n.ink === b.nodes[i].ink)
  );
}

// ── THE POSITION LUT (FO-3, Task #22) ───────────────────────────────────────────────────────────
// N = 256. Two costs are traded here and both were measured, not guessed.
//   ACCURACY: the path is ~4840 user units, so spacing is ~19 units. The long straight leg
//   interpolates EXACTLY, so error only exists in the terminus curve, where the chord error is
//   about s^2/(8R) = 19^2/(8*460) ~= 0.10px — 10x under I20's 1px tolerance, and measured in-curve
//   at 0.02-0.03px on all three engines.
//   COST: the build is 256 getPointAtLength calls, paid once per GEOMETRY CHANGE (never per frame),
//   and getPointAtLength is far more expensive on Gecko than on Blink. At N=512 the build measured
//   6.4ms chromium / 25ms webkit / 144ms FIREFOX; halving to 256 halves that while leaving 10x
//   accuracy headroom. 144ms of main-thread work on a reflow mid-scroll is a visible stall, and
//   buying accuracy nobody can see with time everybody can feel is the wrong trade.
const LUT_N = 256;
type Lut = { xs: Float32Array; ys: Float32Array };

/** Interpolate the LUT at progress p and write ONE transform. No geometry reads, no layout reads. */
function applyVan(el: SVGGElement | null, lut: Lut | null, p: number) {
  if (!el || !lut) return;
  const t = Math.min(1, Math.max(0, p)) * (LUT_N - 1);
  const i = t | 0;
  const j = i + 1 < LUT_N ? i + 1 : i;
  const f = t - i;
  const x = lut.xs[i] + (lut.xs[j] - lut.xs[i]) * f;
  const y = lut.ys[i] + (lut.ys[j] - lut.ys[i]) * f;
  el.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
}

export function RouteOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lutRef = useRef<Lut | null>(null);
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
      // Only re-render when the geometry ACTUALLY changed. The ResizeObserver below can fire for
      // reasons that do not move the route, and an unconditional setGeo would re-render (and
      // re-assign offset-path) on every one of them — and, because a render can itself change
      // layout, would risk the observer retriggering itself indefinitely.
      setGeo((prev) => (prev && sameGeo(prev, g) ? prev : g));
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
      // THE VAN IS POSITIONED FROM THE SAME NUMBER, IN THE SAME FRAME, INSIDE THE SAME SVG.
      // It no longer re-reads --route-progress through a second renderer, which is the state the
      // field probe caught holding stale (progress 0 while the van sat 2945.6px along the route).
      applyVan(vanRef.current, lutRef.current, p);
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

    // CONTENT REFLOW (FO-1 mode 2). window.resize covers the viewport changing; it does NOT cover
    // the document reflowing underneath a viewport that never moved, which is the failure actually
    // observed in the field. Debounced through rAF so a burst of mutations costs one measure, and
    // measure() itself does no work per frame — it only runs on reflow.
    let roRaf = 0;
    const scheduleRemeasure = () => {
      if (roRaf) return;
      roRaf = requestAnimationFrame(() => {
        roRaf = 0;
        measure();
        if (reduce) root.style.setProperty("--route-progress", "1");
        else update();
      });
    };
    const ro = new ResizeObserver(scheduleRemeasure);
    // documentElement catches page-height changes (the stale docStart/docSpan mapping); the region
    // catches the measured band changing shape; the host catches the width drift that used to shear
    // the line against the van. offsetParent is re-read because it is null below lg.
    ro.observe(document.documentElement);
    ro.observe(region);
    const hostEl = root.offsetParent as HTMLElement | null;
    if (hostEl && hostEl !== document.documentElement) ro.observe(hostEl);

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
      if (roRaf) cancelAnimationFrame(roRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      io.disconnect();
      region.removeAttribute("data-spine-live");
      root.removeAttribute("data-spine-live");
      root.removeAttribute("data-direction");
      root.removeAttribute("data-leg");
    };
  }, [pathname]);

  // BUILD THE POSITION LUT from the RENDERED path, once per geometry change.
  //
  // This runs after render (so pathRef points at the live element) and never per frame. Sampling
  // here rather than inside measure() is deliberate: measure() runs before React has committed the
  // new `d`, so it would be sampling the previous geometry. Because the equality guard keeps `geo`
  // referentially stable when nothing moved, this effect is skipped entirely on reflows that do not
  // change the route.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geo) { lutRef.current = null; return; }
    const total = path.getTotalLength();
    if (!total || !isFinite(total)) { lutRef.current = null; return; }
    const xs = new Float32Array(LUT_N);
    const ys = new Float32Array(LUT_N);
    for (let i = 0; i < LUT_N; i++) {
      const pt = path.getPointAtLength((i / (LUT_N - 1)) * total);
      xs[i] = pt.x;
      ys[i] = pt.y;
    }
    lutRef.current = { xs, ys };
    // Place the van immediately at the CURRENT progress rather than waiting for the next scroll —
    // otherwise a reflow would leave it at its previous point until the reader moves.
    const root = rootRef.current;
    const p = root ? parseFloat(getComputedStyle(root).getPropertyValue("--route-progress")) : 0;
    applyVan(vanRef.current, lutRef.current, isFinite(p) ? p : 0);
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
          {/* SIZED IN PIXELS, NOT IN PERCENTAGES. The width/height attributes AND the inline style
              both pin the SVG to exactly the measured geometry, and the viewBox carries the same
              two numbers, so the CTM is the identity matrix and a stretch is not representable.
              preserveAspectRatio is deliberately ABSENT: there is no aspect ratio left to preserve
              or override, and its old "none" value was what allowed X and Y to scale independently.
              The van consumes this same path as raw CSS pixels via offset-path, so with an identity
              CTM the two renderers are reading one coordinate system. h-full/w-full must NOT come
              back — CSS beats presentation attributes and would reintroduce the shear. */}
          <svg
            className="absolute left-0 top-0 overflow-visible"
            width={geo.w}
            height={geo.h}
            style={{ width: geo.w, height: geo.h }}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
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
              ref={pathRef}
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
            {/* THE LIVERY VAN (Task C, moved INSIDE the svg in Task #22) — a Nexo-liveried NEMT van:
                white/on-ink FILLED body, ink outline, one jade accent stripe, ink wheels.
                Self-coloured so it POPS on the green line and on every background it crosses
                (light / tint / ink). NEVER an ambulance.

                ONE RASTER SURFACE. The van used to be an HTML <span> beside the svg, positioned by
                CSS offset-path/offset-distance off the shared --route-progress variable. That made
                the line and the van TWO renderers reading one variable, and on real fractional-DPR
                hardware the field probe caught the van's side holding a stale value while the line
                honestly rendered progress 0. There is no second renderer now: the van is a <g> in
                the same svg, in the same user space, written from the same number in the same frame.

                THREE NESTED GROUPS, each owning exactly one transform, so none of them fight:
                  .route-van       translate to the path point  — set per frame from the LUT (JS)
                  .route-van-lane  the +/-12px lane offset by LEG (CSS, 450ms, interruptible)
                  .route-van-nose  the +/-90deg nose rotation by DIRECTION (CSS, 200ms)
                The art group then centres the 32x20 glyph on the origin and scales it to the 30x19
                it rendered at before, so the point on the path is the same point it always was. */}
            <g ref={vanRef} className="route-van" aria-hidden="true">
              <g className="route-van-lane">
                <g className="route-van-nose">
                  <g className="route-van-art" transform="translate(-15 -9.5) scale(0.9375 0.95)">
                    {/* Keeps the group's box exactly the 32x20 the old rendered svg occupied, so the
                        van's measured centre is the point on the path rather than the ink's own
                        bbox centre — which is what I15/I20 measure and what the rotation turns about. */}
                    <rect x="0" y="0" width="32" height="20" fill="none" stroke="none" />
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
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </>
      ) : null}
    </div>
  );
}
