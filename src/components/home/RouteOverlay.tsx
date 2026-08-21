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
// through the left gutter, and ARRIVING at the footer seam aligned to the terminus motif.
// Perf: one passive scroll listener → one rAF → one CSS var (--route-progress); bounds cached,
// zero layout reads per frame.
//
// C4 / FO-1 FIX (Task #19) — the line and the van consume ONE geometry, and that geometry stays
// current. Two independent failures were measured on the unfixed build and both are closed here:
//
//   1. DIVERGENCE (line vs van). The SVG used to be sized by CSS (h-full w-full) with
//      preserveAspectRatio="none", so its CTM scaled X by rendered/geo.w while the van's
//      CSS offset-path consumed the SAME path string as RAW pixels with no CTM at all.
//      FIX: the SVG is sized in PIXELS and the viewBox matches those dimensions exactly, so the CTM
//      is forced to identity and NO stretch is representable.
//
//   2. STALE BAND (the dominant field failure). measure() ran on mount and window.resize ONLY, so
//      any post-mount reflow that does not resize the window left the geometry describing a page
//      that no longer exists.
//      FIX: a ResizeObserver on the document element, the measured region and the host re-measures
//      on reflow, rAF-debounced, with an equality guard so an unchanged geometry never re-renders.
// Desktop only (lg+); reduced-motion / mobile → the CSS default (fully drawn, no van). Decorative
// (aria-hidden). Reuses the spine-* CSS by arming data-spine-live on BOTH the region and this overlay.
//
// ── TASK #34: THE SIGNATURE ─────────────────────────────────────────────────────────────────────
// The route became a BRAID and the van gained physics. Two laws govern the change and both are
// structural rather than stylistic:
//
//   THE CANONICAL-PATH LAW. There is still exactly ONE truth. `geo.d` is the canonical path; the
//   van, the LUT, the dash and the station nodes all consume it and nothing else. The two companion
//   strands are DECORATIVE SIBLINGS — they are never sampled, never measured, never ridden. If a
//   future change makes anything consume a companion, that is a second truth and it is the exact
//   class of defect C4/FO-1 cost two tasks to close.
//
//   SCROLL-OBEDIENCE. The van's speed varies through a precomputed WARP of the scroll→arc-length
//   mapping, and that warp is MONOTONE by construction. The route never moves on its own. D29's
//   split ruling put autonomous drama in the W2 hero script precisely so the page route could stay
//   obedient to the reader's scroll, and a warp is a reparameterisation, not an animation.

const NODE_FRACTIONS = [12.5, 37.5, 62.5, 87.5]; // ~centre of each stop, within the SPINE portion
// Where the terminal station node sits inside the footer's terminus motif (cx=82 of a 104-wide
// viewBox). Kept as a named constant because it is a CONTRACT with Footer.tsx's TerminusMotif:
// if that glyph is redrawn, this moves with it or the route stops arriving at the station.
const TERMINUS_NODE_FRAC = 82 / 104;
const INK_STOP = 2;

// ── THE WEAVE ───────────────────────────────────────────────────────────────────────────────────
// Horizontal budget, MEASURED on the running build rather than derived from the Tailwind config:
//   gutterX     1024:2   1152:2   1280:66   1440:146   1920:386
//   room LEFT   = gutterX
//   room RIGHT to the first text = 30px at EVERY width (it is the container's own padding)
// The van lane already spends 22 of that 30 (lane +12px, plus ~10px of rotated half-width), so there
// is NO rightward budget at any width. The swing therefore extends LEFT ONLY, and the lead's
// rightmost x stays exactly gutterX — which means the van's clearance to text is unchanged-or-better
// than the straight line it replaces, by construction rather than by luck.
// #32's finding binds here: on-ink text sitting directly on a mint strand measures 1.39:1, so a
// strand may never cross a text column without a glass bar over it.
// GEOMETRY V2 (Task #35, the signature rescue). The owner scrolled the shipped signature and
// ruled it a basic scroll-tracker with the complexity missing. The diagnosis was correct and the
// cause was mine: I capped the swing at 36px because I read "precision routing, not
// page-dominating" as a reason to be timid, while 122px of left budget at 1440 and 362px at 1920
// sat unused. The binding budget was never the left one -- it is the 30px to the RIGHT, which the
// swing does not spend because it opens leftward. So the amplitude was starved by a constraint
// that does not apply to it.
const WEAVE_EDGE = 24;      // every strand stays this far off the host's left edge
const WEAVE_SWING_MAX = 140; // was 36. 1440 gets 122 (its whole budget), 1920 gets 140 (capped so
//                              the motif reads the same at every desktop size rather than sprawling)
const WEAVE_LAMBDA = 450;   // was 780. ~4 crossings per viewport instead of ~2.5 — the tangle reads
const WEAVE_SEG = 14;       // px per polyline sample — see the LUT budget note below
const WEAVE_PHASES = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

type Runs = { front: string; behind: string };

function lateral(y: number, lambda: number, swing: number, phase: number) {
  return (swing * (1 - Math.cos((2 * Math.PI * y) / lambda + phase))) / 2;
}

function buildWeave(gutterX: number, h: number, motifX: number) {
  // A DEADBAND, not a plain clamp. Between roughly VW 1196 and 1220 a bare clamp yields a 2–7px
  // swing, and a 2px lateral over a 722px wavelength is a 1:100 wobble that reads as a rendering
  // fault rather than as a braid. Below the deadband the route is simply straight, which is the
  // same decline-don't-degrade commitment the swing === 0 branch already makes.
  const swingRaw = gutterX - WEAVE_EDGE;
  const swing = swingRaw < 12 ? 0 : Math.min(WEAVE_SWING_MAX, swingRaw);
  const curveLen = Math.min(h * 0.34, 460);
  const curveStart = Math.max(1, h - curveLen);
  const cp = curveLen * 0.55;
  const terminus =
    `C${gutterX} ${(curveStart + cp).toFixed(1)} ${motifX.toFixed(1)} ${(h - cp).toFixed(1)} ${motifX.toFixed(1)} ${h.toFixed(1)}`;

  // An INTEGER number of full periods over the straight leg, so the serpentine begins and ends at
  // x = gutterX. The terminus cubic is then byte-identical to the one that shipped, and the join is
  // C0 without a kink.
  const periods = Math.max(1, Math.round(curveStart / WEAVE_LAMBDA));
  const lambda = curveStart / periods;
  const n = Math.max(2, Math.ceil(curveStart / WEAVE_SEG));

  // Narrow desktop (roughly 1024–1151, where the container touches the viewport edge and gutterX is
  // 2): there is no left room, so the route degenerates to EXACTLY the straight line that shipped.
  // That is decline-don't-degrade — a complete composition, not a broken weave.
  if (swing === 0) {
    return {
      d: `M${gutterX} 0 L${gutterX} ${curveStart.toFixed(1)} ` + terminus,
      comps: [{ front: "", behind: "" }, { front: "", behind: "" }] as Runs[],
      swing, lambda, curveStart,
    };
  }

  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const y = (curveStart * i) / n;
    pts.push([gutterX - lateral(y, lambda, swing, WEAVE_PHASES[0]), y]);
  }
  const d =
    `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}` +
    pts.slice(1).map((q) => ` L${q[0].toFixed(2)} ${q[1].toFixed(2)}`).join("") +
    " " + terminus;

  // A companion is IN FRONT while sin(theta) > 0 — half of each period, flipping at the crossings.
  // Splitting it into runs and drawing the front runs AFTER the van group is what makes the weave a
  // real over/under rather than a drawing of one.
  const runsFor = (phase: number): Runs => {
    const front: [number, number][][] = [];
    const behind: [number, number][][] = [];
    let cur: [number, number][] | null = null;
    let curFront: boolean | null = null;
    for (let i = 0; i <= n; i++) {
      const y = (curveStart * i) / n;
      const th = (2 * Math.PI * y) / lambda + phase;
      const isFront = Math.sin(th) > 0;
      const x = gutterX - lateral(y, lambda, swing, phase);
      if (curFront === null || isFront !== curFront) {
        // close the previous run AT this same point so the runs join with no visible gap
        if (cur) { cur.push([x, y]); (curFront ? front : behind).push(cur); }
        cur = [[x, y]];
        curFront = isFront;
      } else if (cur) {
        cur.push([x, y]);
      }
    }
    if (cur) (curFront ? front : behind).push(cur);
    const toD = (runs: [number, number][][]) =>
      runs
        .map((r) => `M${r[0][0].toFixed(2)} ${r[0][1].toFixed(2)}` + r.slice(1).map((q) => ` L${q[0].toFixed(2)} ${q[1].toFixed(2)}`).join(""))
        .join(" ");
    return { front: toD(front), behind: toD(behind) };
  };

  return { d, comps: [runsFor(WEAVE_PHASES[1]), runsFor(WEAVE_PHASES[2])] as Runs[], swing, lambda, curveStart };
}

type Geo = {
  w: number;
  h: number;
  top: number;
  d: string;
  comps: Runs[];
  swing: number;
  lambda: number;
  curveStart: number;
  gutterX: number;
  nodes: { x: number; y: number; ink: boolean }[];
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
    a.swing === b.swing && a.lambda === b.lambda &&
    a.comps.length === b.comps.length &&
    a.comps.every((c, i) => c.front === b.comps[i].front && c.behind === b.comps[i].behind) &&
    a.nodes.length === b.nodes.length && a.nodes.every((n, i) => n.y === b.nodes[i].y && n.x === b.nodes[i].x && n.ink === b.nodes[i].ink)
  );
}

// ── THE POSITION LUT (FO-3, Task #22) ───────────────────────────────────────────────────────────
// N = 256. Two costs are traded here and both were measured, not guessed.
//   ACCURACY: the path is ~5175 user units, so spacing is ~20 units. Error only exists where the
//   path bends, where the chord error is about s^2/(8R) — an order under I20's 1px tolerance.
//   COST: the build is 256 getPointAtLength calls, paid once per GEOMETRY CHANGE (never per frame),
//   and getPointAtLength is far more expensive on Gecko than on Blink.
//   RE-MEASURED IN TASK #34, because the path stopped being two segments and became a ~310-segment
//   polyline plus the terminus cubic, which made the previous receipt describe code that no longer
//   exists. 256 calls, median of 5, cache-warm:
//        straight (pre-weave)   chromium  6.3ms | webkit 12ms | firefox 23ms
//        weave SEG=8  (542 seg) chromium 13.3ms | webkit 23ms | firefox 45ms
//        weave SEG=14 (310 seg) chromium 10.8ms | webkit 16ms | firefox 41ms
//        weave SEG=20 (217 seg) chromium  9.5ms | webkit 14ms | firefox 42ms
//   Two things that measurement settled. SEG=14 is chosen: it recovers most of the Blink/WebKit
//   cost at a 0.033px chord error, 30x under I20's 1px tolerance. And FIREFOX IS FLAT in segment
//   count — its cost is per-call overhead, not segment walking — so density alone cannot fix the
//   window-drag case, which is what the trailing debounce on the rebuild is for.
const LUT_N = 256;
type Lut = { xs: Float32Array; ys: Float32Array };

// ── THE WARP (Task #34) — path-time reparameterization, scroll-obedient ─────────────────────────
// p (scroll fraction) → s (arc-length fraction). The van runs fast on the straights and eases
// through the interchanges. Built once per geometry change from the LUT's own geometry; at runtime
// it costs ONE array lerp, which is why the per-frame budget is unchanged.
//
// THE DIAL WAS RULED BY MEASUREMENT, and the number that governs it is not the one you would guess.
// It is not the speed RATIO, it is the positional DRIFT: the van's document-Y differs from the
// linear-scroll position by drift = max|warp(p) - p| * pathLength, and once that approaches a
// viewport height the van simply leaves the screen. A van that exits the viewport is not momentum,
// it is a defect that looks like one.
// Uncapped, the terminus curve (lateral 0.937) dominates the entire warp and produces one long
// contiguous slow zone: K=3.5 measured a 3.96:1 ratio but 860px of drift, most of a viewport.
// CAPPING the lateral term makes the terminus saturate at the same weight as the serpentine's own
// peaks, so the slow zone stops being one block and the serpentine's alternating fast/slow largely
// cancels — which decouples ratio from drift.
// CHOSEN: cap 0.15, K 14. MEASURED ON THE SHIPPED PATH (not on the scratch model the dial was
// tuned against): felt ratio 2.12:1, max deviation 1.07% of the route = 52px, peaking at p=0.91.
// The dial script's own figure was 191px; it modelled a synthetic path and did not reproduce, so
// the number recorded here is the one the running build produces.
const WARP_N = 129;
// RE-DERIVED FOR GEOMETRY V2. The cap has to sit inside the range the path actually produces or
// it stops discriminating: with swing 122 and lambda 433 the serpentine's own lateral reaches
// ~0.66, so the old 0.15 cap would saturate EVERY sample, make the weight uniform, and silently
// turn the warp into the identity — a physics system that does nothing while claiming to.
const WARP_LAT_CAP = 0.55;
const WARP_K = 5;

/** Monotone by construction: a normalized cumulative sum of strictly positive weights, inverted. */
function buildWarp(xs: Float32Array, ys: Float32Array, swing: number): Float32Array | null {
  // GATE ON THE WEAVE, NOT ON THE PATH. An earlier version gated on "does the path bend anywhere",
  // which is ALWAYS true because the terminus cubic bends hard — so the straight narrow-desktop
  // route got a warp, and got the worst one: with no serpentine to alternate against, the terminus
  // is a single contiguous slow zone and the drift is an order larger than on the braided widths.
  // A route with no weave is ridden linearly. That is the whole rule.
  if (swing <= 0) return null;
  const w = new Float64Array(LUT_N);
  let anyLateral = false;
  for (let i = 0; i < LUT_N; i++) {
    const a = i === 0 ? 0 : i - 1;
    const b = i === LUT_N - 1 ? LUT_N - 1 : i + 1;
    const dx = Math.abs(xs[b] - xs[a]);
    const dy = Math.abs(ys[b] - ys[a]);
    const ds = Math.hypot(dx, dy) || 1e-6;
    const latRaw = dx / ds; // 0 on a pure vertical, 1 on a pure horizontal
    if (latRaw > 0.02) anyLateral = true;
    w[i] = 1 / (1 + WARP_K * Math.min(latRaw, WARP_LAT_CAP));
  }
  if (!anyLateral) return null;

  const cum = new Float64Array(LUT_N);
  let acc = 0;
  for (let i = 1; i < LUT_N; i++) {
    acc += 0.5 * (1 / w[i - 1] + 1 / w[i]);
    cum[i] = acc;
  }
  for (let i = 0; i < LUT_N; i++) cum[i] /= acc;

  const sOfP = new Float32Array(WARP_N);
  let j = 0;
  for (let k = 0; k < WARP_N; k++) {
    const p = k / (WARP_N - 1);
    while (j < LUT_N - 2 && cum[j + 1] < p) j++;
    const c0 = cum[j], c1 = cum[j + 1];
    const t = c1 > c0 ? (p - c0) / (c1 - c0) : 0;
    sOfP[k] = (j + t) / (LUT_N - 1);
  }
  sOfP[0] = 0;
  sOfP[WARP_N - 1] = 1;
  return sOfP;
}

// ── THE SPRING-FOLLOW VAN (Task #35) ────────────────────────────────────────────────────────────
// WELDED TO THE ROAD, NOT TO THE WHEEL. The line's dashoffset stays 1:1 with warped scroll — the
// line is the CLAIM, and it must never lag what the reader has actually scrolled past. The VAN is
// a vehicle: it chases the line's head through a damped-spring integrator, so it accelerates out of
// a flick and decelerates into a stop instead of being nailed to the scrollbar.
//
// THE THING THAT MAKES IT LEGAL: the van's position is still EXACTLY LUT(s_van) every frame. It
// rides its own PARAMETER, never its own PATH. The wheels never leave the line, which is why I20
// can still assert path-adherence — it just asserts it at s_van rather than at the line's s.
//
// zeta 0.9 is near-critical: overshoot is exp(-pi*z/sqrt(1-z^2)) = 0.15%, which on a 5000px route
// is ~7px — under the stroke width, so the van cannot visibly run past the head it is chasing.
// omega 12 gives a 4/(z*w) settle of ~370ms: a vehicle arriving, not an elastic band.
const SPRING_ZETA = 0.9;
const SPRING_OMEGA = 12;
const SPRING_EPS = 1e-4;   // sleep threshold, in route-parameter units (~0.5px of a 5500px path)
// SUB-STEPPING, because the naive clamp was measurably wrong. Clamping dt to a single 1/30 step
// protects against a backgrounded tab teleporting the van, but it also means that when a frame
// runs long — 116ms stalls were measured during a scripted scroll — the integrator advances only
// 33ms of physics for 116ms of real time, and the spring runs in slow motion exactly when the page
// is busiest. Measured consequence: a settle predicted at ~520ms took 1120ms. Sub-stepping keeps
// the physics real-time-accurate AND bounded: at most SPRING_MAX_SIM of simulated time per frame,
// taken in fixed 1/60 steps, so a long stall costs at most a few iterations of trivial arithmetic.
const SPRING_STEP = 1 / 60;
const SPRING_MAX_SIM = 0.1; // seconds of physics any single frame may advance
// THE VAN MAY TRAIL, BUT IT MAY NOT VANISH. An End-key press or a scrollbar drag moves the head by
// half the route instantly, and an unclamped spring answered that with a van ~2700px off-screen
// that later swooped in — which reads as a bug recovering, not as a vehicle. 0.12 of the route is
// roughly two thirds of a viewport: far enough to be visibly chasing, close enough to stay a van.
const SPRING_MAX_LAG = 0.12;

function warpAt(sOfP: Float32Array | null, p: number) {
  if (!sOfP) return p;
  const t = Math.min(1, Math.max(0, p)) * (WARP_N - 1);
  const i = t | 0;
  const j = i + 1 < WARP_N ? i + 1 : i;
  return sOfP[i] + (sOfP[j] - sOfP[i]) * (t - i);
}

/** Interpolate the LUT at arc-length fraction s and write ONE transform per consumer.
 *  The reflection is handed the SAME point, so it can never drift from the van it belongs to. */
function applyVan(el: SVGGElement | null, refl: SVGGElement | null, lut: Lut | null, s: number) {
  if (!lut || (!el && !refl)) return;
  const t = Math.min(1, Math.max(0, s)) * (LUT_N - 1);
  const i = t | 0;
  const j = i + 1 < LUT_N ? i + 1 : i;
  const f = t - i;
  const x = lut.xs[i] + (lut.xs[j] - lut.xs[i]) * f;
  const y = lut.ys[i] + (lut.ys[j] - lut.ys[i]) * f;
  const tr = `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
  if (el) el.setAttribute("transform", tr);
  if (refl) refl.setAttribute("transform", tr);
}

export function RouteOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<SVGGElement>(null);
  const reflRef = useRef<SVGGElement>(null);
  // The spring's state lives in refs, never in React state: it is written every animation frame
  // and a re-render per frame would be the opposite of the point.
  const targetRef = useRef(0);   // s_target — where the line's head is
  const sVanRef = useRef(0);     // s_van — where the vehicle actually is
  const vVanRef = useRef(0);     // its velocity, in route-parameter units per second
  const pathRef = useRef<SVGPathElement>(null);
  const lutRef = useRef<Lut | null>(null);
  const warpRef = useRef<Float32Array | null>(null);
  const geoRef = useRef<Geo | null>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== HOME_PATH) {
      geoRef.current = null;
      setGeo(null);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const region = document.querySelector<HTMLElement>("[data-spine-region]");
    const endEl = document.querySelector<HTMLElement>("[data-route-end]");
    const seamEl =
      document.querySelector<HTMLElement>("[data-route-seam]") ||
      document.querySelector<HTMLElement>("footer");
    if (!root || !region || !endEl || !seamEl) return;
    const stops = Array.from(region.querySelectorAll<HTMLElement>("[data-spine-stop]"));
    const containerEl = region.querySelector<HTMLElement>(".mx-auto");

    if (!reduce) region.setAttribute("data-spine-live", "");

    let leg: "outbound" | "return" = "outbound";

    const measure = () => {
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
      const h = Math.max(1, seamDoc - regionTopDoc - FOOTER_HANDOFF);
      const w = root.offsetWidth;
      const endRect = endEl.getBoundingClientRect();
      // AIM AT THE STATION NODE, NOT AT THE MOTIF'S BOUNDING BOX. The terminus motif is a 104-wide
      // svg whose terminal node sits at cx=82 — 78.8% across, not 50% — so centring the route on
      // the box landed the van ~30px to the LEFT of the station it is supposed to be arriving at.
      // Measured on the shipped build: the van sat above the middle of the dashed approach line
      // rather than above the node. An arrival that misses its own station is the dangling stop.
      const motifX = endRect.left + endRect.width * TERMINUS_NODE_FRAC + sx - hostLeft;

      // gutter X — just inside the content Container's OUTER edge, so the route + its ±12px van lane
      // both stay left of where any column's text begins.
      let gutterX = 40;
      if (containerEl) {
        gutterX = containerEl.getBoundingClientRect().left + sx - hostLeft + 2;
      }

      const weave = buildWeave(gutterX, h, motifX);

      // Station nodes ride the LEAD, not the old straight line — a node floating off the strand it
      // marks would read as a rendering fault. They are computed from the same lateral() the
      // canonical path uses, so they cannot drift from it.
      const nodes = NODE_FRACTIONS.map((f, i) => {
        const y = (regionRect.height * f) / 100;
        const onSerp = y <= weave.curveStart;
        return {
          x: onSerp ? gutterX - lateral(y, weave.lambda, weave.swing, WEAVE_PHASES[0]) : gutterX,
          y,
          ink: i === INK_STOP,
        };
      });

      let inkY0 = 0.4;
      let inkY1 = 0.55;
      const inkStop = stops[INK_STOP];
      if (inkStop) {
        const r = inkStop.getBoundingClientRect();
        inkY0 = Math.max(0, Math.min(1, (r.top + sy - regionTopDoc) / h));
        inkY1 = Math.max(0, Math.min(1, (r.bottom + sy - regionTopDoc) / h));
      }

      const vh = window.innerHeight;
      const docStart = regionTopDoc - vh * 0.72;
      const docSpan = Math.max(1, seamDoc - vh * 0.5 - docStart);

      const g: Geo = {
        w, h, top, d: weave.d, comps: weave.comps, swing: weave.swing, lambda: weave.lambda,
        curveStart: weave.curveStart, gutterX, nodes, inkY0, inkY1, docStart, docSpan,
      };
      geoRef.current = g;
      // Publish the scroll mapping ONCE PER GEOMETRY CHANGE (never per frame) so the warp is
      // auditable from outside the component: an invariant can recompute the raw scroll fraction p
      // and assert that s = warp(p) is monotone in scroll. Scroll-obedience is a LAW (D29's split
      // ruling), and a law nothing can check is a preference.
      root.dataset.routeSpan = g.docStart.toFixed(2) + "," + g.docSpan.toFixed(2);
      setGeo((prev) => (prev && sameGeo(prev, g) ? prev : g));
    };

    // ── THE SPRING INTEGRATOR ──────────────────────────────────────────────────────────────────
    // IMPERATIVE MOTION, AND IT IS THE ONLY SANCTIONED PIECE ON THE ROUTE. It is legal under the
    // motion-safe doctrine for two reasons that both have to hold: it is started ONLY inside the
    // `!reduce` branch below (a reduced-motion reader never has a van at all, so there is nothing
    // to spring), and it is SCROLL-TARGET-DRIVEN — it has no clock of its own, it only ever chases
    // a number the reader's scroll set. D29's split ruling is what that protects: autonomy belongs
    // to the W2 hero script, and a route that moves on its own is a violation of it.
    // It SELF-SLEEPS: once the van is within SPRING_EPS of the head and effectively still, the
    // loop cancels itself and costs exactly nothing until the next scroll.
    let springRaf = 0;
    let springLast = 0;
    const writeVan = (sv: number) => {
      applyVan(vanRef.current, reflRef.current, lutRef.current, sv);
      root.style.setProperty("--route-van", sv.toFixed(5));
    };
    const springStep = (now: number) => {
      springRaf = 0;
      let dt = (now - springLast) / 1000;
      springLast = now;
      if (!(dt > 0)) dt = SPRING_STEP;
      if (dt > SPRING_MAX_SIM) dt = SPRING_MAX_SIM;
      const target = targetRef.current;
      // A hard leash BEFORE integrating, so the spring solves a bounded problem rather than being
      // asked to recover from an off-screen position.
      if (target - sVanRef.current > SPRING_MAX_LAG) sVanRef.current = target - SPRING_MAX_LAG;
      else if (sVanRef.current - target > SPRING_MAX_LAG) sVanRef.current = target + SPRING_MAX_LAG;
      // semi-implicit Euler in fixed sub-steps: velocity first, then position. omega*h = 0.2 at
      // 1/60, comfortably inside the stable region.
      const steps = Math.max(1, Math.ceil(dt / SPRING_STEP));
      const h = dt / steps;
      for (let k = 0; k < steps; k++) {
        const acc = -2 * SPRING_ZETA * SPRING_OMEGA * vVanRef.current - SPRING_OMEGA * SPRING_OMEGA * (sVanRef.current - target);
        vVanRef.current += acc * h;
        sVanRef.current += vVanRef.current * h;
      }
      if (sVanRef.current < 0) { sVanRef.current = 0; vVanRef.current = 0; }
      if (sVanRef.current > 1) { sVanRef.current = 1; vVanRef.current = 0; }
      // THE NOSE FOLLOWS THE VEHICLE, not the scrollbar: it is the van's own velocity that says
      // which way it is travelling, and after a flick-and-stop those two disagree for ~370ms.
      if (Math.abs(vVanRef.current) > 0.004) {
        root.setAttribute("data-direction", vVanRef.current > 0 ? "down" : "up");
      }
      writeVan(sVanRef.current);
      if (Math.abs(sVanRef.current - target) < SPRING_EPS && Math.abs(vVanRef.current) < SPRING_EPS) {
        sVanRef.current = target;
        vVanRef.current = 0;
        writeVan(target);
        return; // asleep — no rAF is pending and none will be until the reader scrolls
      }
      springRaf = requestAnimationFrame(springStep);
    };
    const wakeSpring = () => {
      if (springRaf) return;
      springLast = performance.now();
      springRaf = requestAnimationFrame(springStep);
    };

    let ticking = false;
    let rafId = 0;
    let lastDirP = 0;
    const update = () => {
      ticking = false;
      const g = geoRef.current;
      if (!g) return;
      const p = Math.min(1, Math.max(0, (window.scrollY - g.docStart) / g.docSpan));
      // THE WARP IS UPSTREAM OF EVERYTHING. --route-progress carries the ARC-LENGTH parameter s, not
      // the raw scroll fraction, so the dash, the van and I20 all keep reading one number that means
      // one thing. This is why I20's assertion needed no change: it still says "the van sits where
      // the line's head is", and the head is now placed by s.
      // isFinite is not paranoia here: a non-finite value in --route-progress makes
      // stroke-dashoffset compute to 0px, and with dasharray 1px that paints the WHOLE path —
      // which is precisely the FO-3 field signature (a fully-drawn line beside a correct van).
      const sw = warpAt(warpRef.current, p);
      const s = isFinite(sw) ? Math.min(1, Math.max(0, sw)) : p;
      // THE LINE IS THE CLAIM and it stays 1:1 with warped scroll. The van does NOT.
      root.style.setProperty("--route-progress", String(s));
      targetRef.current = s;
      wakeSpring();
      const dp = p - lastDirP;
      if (Math.abs(dp) > 0.003) {
        root.setAttribute("data-direction", dp > 0 ? "down" : "up");
        lastDirP = p;
      }

      // U-TURN LEG MACHINE: OUTBOUND rides the right lane; at the terminus it U-turns → RETURN; back
      // at the top it silently resets. The lane is by LEG (not scroll direction) so mid-page
      // reversals keep the lane. Thresholds are on the RAW scroll fraction on purpose: the leg is a
      // fact about where the reader is, not about where the warp has placed the van.
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
      // Complete static composition: fully drawn lead, ALL strands painted with correct over/under,
      // nodes lit by default, no van.
      root.style.setProperty("--route-progress", "1");
      // No van, no reflection, no spring: the parameter is simply pinned to the end of the road so
      // anything reading it sees a completed trip rather than an uninitialised one.
      targetRef.current = 1;
      sVanRef.current = 1;
      root.style.setProperty("--route-van", "1");
    } else {
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
    ro.observe(document.documentElement);
    ro.observe(region);
    const hostEl = root.offsetParent as HTMLElement | null;
    if (hostEl && hostEl !== document.documentElement) ro.observe(hostEl);

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
      if (springRaf) cancelAnimationFrame(springRaf);
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

  // BUILD THE POSITION LUT + THE WARP from the RENDERED path, once per geometry change.
  // Both are built here rather than in measure(), because measure() runs before React has committed
  // the new `d` and would sample the previous geometry. The equality guard keeps `geo` referentially
  // stable when nothing moved, so this is skipped entirely on reflows that do not change the route.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geo) { lutRef.current = null; warpRef.current = null; return; }

    const build = () => {
      const total = path.getTotalLength();
      if (!total || !isFinite(total)) { lutRef.current = null; warpRef.current = null; return; }
      const xs = new Float32Array(LUT_N);
      const ys = new Float32Array(LUT_N);
      for (let i = 0; i < LUT_N; i++) {
        const pt = path.getPointAtLength((i / (LUT_N - 1)) * total);
        xs[i] = pt.x;
        ys[i] = pt.y;
      }
      lutRef.current = { xs, ys };
      // The warp reuses the 256 samples already paid for — no extra geometry reads.
      warpRef.current = buildWarp(xs, ys, geo.swing);

      // CLOSE THE STALE-WARP WINDOW. measure() and update() run SYNCHRONOUSLY on resize/reflow,
      // before React has committed the new path — so update() writes warp_OLD(p_NEW) into the var.
      // If this effect merely re-seated the van at whatever the var already held, the line and the
      // van would agree perfectly on a stale number and I20 would be green by construction, which
      // is the same shape as the FO-1 stale-band defect. Recompute p from the live scroll and the
      // current geometry, push it through the NEW warp, and rewrite the var.
      const root = rootRef.current;
      const g = geoRef.current;
      if (root && g) {
        const p = Math.min(1, Math.max(0, (window.scrollY - g.docStart) / g.docSpan));
        const sw = warpAt(warpRef.current, p);
        const s = isFinite(sw) ? Math.min(1, Math.max(0, sw)) : p;
        root.style.setProperty("--route-progress", String(s));
        // The van keeps its OWN parameter across a reflow — snapping it to the head would undo the
        // spring's whole argument — but it must be re-placed against the NEW table, or it would
        // still be sitting on a point from the old geometry.
        const sv = Math.min(1, Math.max(0, sVanRef.current));
        applyVan(vanRef.current, reflRef.current, lutRef.current, sv);
        root.style.setProperty("--route-van", sv.toFixed(5));
      }
    };

    // FIRST BUILD IS IMMEDIATE; SUBSEQUENT REBUILDS ARE TRAILING-DEBOUNCED. The rebuild costs
    // 11ms on Blink, 16ms on WebKit and 41ms on Gecko (re-measured — see the LUT budget note),
    // and the ResizeObserver fires once per rAF while a window is being dragged, which would put
    // that on the main thread every frame. Debouncing costs nothing on mount and nothing during
    // scroll, because neither changes the geometry.
    if (!lutRef.current) { build(); return; }
    const t = window.setTimeout(build, 90);
    return () => window.clearTimeout(t);
  }, [geo]);

  if (pathname !== HOME_PATH) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="route-overlay pointer-events-none absolute left-0 z-[5] hidden w-full lg:block"
      style={geo ? { top: geo.top, height: geo.h } : { top: 0, height: 0 }}
    >
      {geo ? (
        <>
          {/* SIZED IN PIXELS, NOT IN PERCENTAGES — the viewBox carries the same two numbers, so the
              CTM is the identity matrix and a stretch is not representable. preserveAspectRatio is
              deliberately ABSENT. h-full/w-full must NOT come back: CSS beats presentation
              attributes and would reintroduce the shear I20 exists to catch. */}
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
              {/* THE SEAM. Two stops at the SAME offset = a hard switch at the band edge. The
                  alternative (a short blend across the boundary) was built and shot side by side;
                  the hard switch shipped. See the D32 receipt for the reasoning. */}
              <linearGradient id="routeGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                <stop className="spine-grad-accent" offset="0" />
                <stop className="spine-grad-accent" offset={geo.inkY0} />
                <stop className="spine-grad-ink" offset={geo.inkY0} />
                <stop className="spine-grad-ink" offset={geo.inkY1} />
                <stop className="spine-grad-accent" offset={geo.inkY1} />
                <stop className="spine-grad-accent" offset="1" />
              </linearGradient>
              {/* The companions are register-aware in the opposite direction: on paper the neutral is
                  DARKER than the field, on ink it must be LIGHTER. Same intent, opposite sign. */}
              <linearGradient id="routeStrandGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                <stop className="spine-strand-light" offset="0" />
                <stop className="spine-strand-light" offset={geo.inkY0} />
                <stop className="spine-strand-ink" offset={geo.inkY0} />
                <stop className="spine-strand-ink" offset={geo.inkY1} />
                <stop className="spine-strand-light" offset={geo.inkY1} />
                <stop className="spine-strand-light" offset="1" />
              </linearGradient>

              {/* MASK-FADE INFINITY. The companions are the EXISTING NETWORK, and a network does
                  not start at the top of a marketing page or stop above a footer — so they fade in
                  out of the dark and fade back into it. The ACTIVE LEAD IS DELIBERATELY NOT MASKED:
                  it is this trip, it has a beginning and it arrives. That contrast is the whole
                  narrative — an infinite system, one completed journey — and it is why the mask is
                  scoped to the companion group rather than applied to the svg. */}
              {/* THE FADE IS ANCHORED TO curveStart, NOT TO h, AND THAT IS THE WHOLE POINT.
                  The companions only exist over the SERPENTINE portion — they stop at curveStart,
                  which is up to 460px above the path's end. A fade positioned as a fraction of h
                  therefore sat BELOW where the strands already were, did nothing at all, and left
                  them terminating on a hard cut. Measured on the first build of this task. */}
              <linearGradient id="routeFadeGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                <stop className="route-mask-off" offset="0" />
                <stop className="route-mask-on" offset={Math.min(0.2, 200 / Math.max(1, geo.h))} />
                <stop className="route-mask-on" offset={Math.max(0.3, (geo.curveStart - 240) / Math.max(1, geo.h))} />
                <stop className="route-mask-off" offset={Math.min(1, geo.curveStart / Math.max(1, geo.h))} />
                <stop className="route-mask-off" offset="1" />
              </linearGradient>
              <mask id="routeFadeMask" maskUnits="userSpaceOnUse" x="0" y="0" width={geo.w} height={geo.h}>
                <rect x="0" y="0" width={geo.w} height={geo.h} fill="url(#routeFadeGrad)" />
              </mask>

              {/* THE REFLECTION's blur. A filter region has to be given room or the blur is clipped
                  into a hard edge, which reads as a rectangle rather than as a glow. */}
              <filter id="routeVanGlow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
            </defs>

            {/* COMPANION STRANDS — BEHIND runs. Decorative siblings: never sampled, never ridden.
                They are STATIC (always fully drawn) on purpose — they are the existing network, not
                this trip. D29's accent law is what makes that the right reading: the lead is mint
                because it is live, and the companions are charcoal because they are not. */}
            <g mask="url(#routeFadeMask)">
              {geo.comps.map((c, i) =>
                c.behind ? (
                  <path key={`b${i}`} d={c.behind} className="route-strand" stroke="url(#routeStrandGrad)"
                        strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                ) : null
              )}
            </g>

            {/* THE REFLECTION — a blurred, mint, low-opacity twin sitting just under the van, drawn
                BEFORE the lead so the line passes over it: the van reads as gliding ON the surface
                rather than as dragging a shadow behind it. It is a GLOW TWIN, not a mirror — a
                mirrored copy under a 90-degree-rotated glyph reads as a duplicate van, not as a
                reflection. It consumes s_van from the same applyVan call as the van itself, so the
                two can never drift apart. White or mint only: cyan stays rejected (S-007/D29). */}
            <g ref={reflRef} className="route-reflection" aria-hidden="true">
              <g className="route-van-lane">
                <g className="route-van-nose">
                  <g transform="translate(0 11) scale(1 0.72)">
                    <use href="#route-van-art" />
                  </g>
                </g>
              </g>
            </g>

            {/* THE CANONICAL PATH — the single truth. The van, the LUT, the dash and the nodes all
                consume this and nothing else. */}
            <path
              ref={pathRef}
              d={geo.d}
              data-route-canonical=""
              className="route-path"
              stroke="url(#routeGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
            {geo.nodes.map((n, i) => (
              <circle
                key={i}
                data-spine-node={i}
                className={cn("spine-node", n.ink ? "spine-node-ink" : "fill-accent")}
                cx={n.x}
                cy={n.y}
                r={n.ink ? 6 : 5}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* THE LIVERY VAN — livery B (D28), ink body with an electric-mint wireframe outline.
                ONE RASTER SURFACE: the van is a <g> in the same svg, in the same user space, written
                from the same number in the same frame as the line. There is no second renderer.

                REGISTER RULING (D32): the outline is CONSTANT electric mint and does NOT switch
                register with the band. A 30px object that changes colour mid-travel reads as a
                glitch, not as design — and the two registers carry the silhouette differently
                anyway: over paper it is the ink body against a light field, over ink it is the mint
                outline against a dark one. One object, one identity, the whole way down.

                THREE NESTED GROUPS, each owning exactly one transform:
                  .route-van       translate to the path point  — per frame from the LUT (JS)
                  .route-van-lane  the ±12px lane offset by LEG (CSS, 450ms, interruptible)
                  .route-van-nose  the ±90° nose rotation by DIRECTION (CSS, 200ms) */}
            <g ref={vanRef} className="route-van" aria-hidden="true">
              <g className="route-van-lane">
                <g className="route-van-nose">
                  <g id="route-van-art" className="route-van-art" transform="translate(-15 -9.5) scale(0.9375 0.95)">
                    {/* Keeps the group's box exactly the 32x20 the old rendered svg occupied, so the
                        van's measured centre is the point on the path — which is what I15/I20
                        measure and what the rotation turns about. */}
                    <rect x="0" y="0" width="32" height="20" fill="none" stroke="none" />
                    <path
                      d="M2.6 15.6 L2.6 8 Q2.6 5.5 5.1 5.5 L20 5.5 Q23 5.5 24.6 7.7 L27.7 11.4 Q29.1 12 29.1 13.7 L29.1 15.6 Z"
                      className="van-body van-edge"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <rect x="5.1" y="7.4" width="6.1" height="3.1" rx="0.6" className="van-edge" strokeWidth="0.9" />
                    <rect x="12.5" y="7.4" width="6.1" height="3.1" rx="0.6" className="van-edge" strokeWidth="0.9" />
                    <path d="M21 7.5 L23.7 7.7 L25.8 10.5 L21 10.5 Z" className="van-edge" strokeWidth="0.9" strokeLinejoin="round" />
                    <line x1="3.4" y1="12.9" x2="27.6" y2="12.9" className="van-edge" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
                    <circle cx="8.4" cy="15.9" r="2.8" className="van-body van-edge" strokeWidth="1.1" />
                    <circle cx="22.7" cy="15.9" r="2.8" className="van-body van-edge" strokeWidth="1.1" />
                  </g>
                </g>
              </g>
            </g>

            {/* COMPANION STRANDS — FRONT runs, drawn AFTER the van group. This is the over/under:
                the van and the lead pass BEHIND these segments and in front of the behind-runs, so
                the three strands genuinely interleave rather than merely overlapping. No z-index, no
                second surface — paint order is the whole mechanism. */}
            <g mask="url(#routeFadeMask)">
              {geo.comps.map((c, i) =>
                c.front ? (
                  <path key={`f${i}`} d={c.front} className="route-strand" stroke="url(#routeStrandGrad)"
                        strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                ) : null
              )}
            </g>
          </svg>
        </>
      ) : null}
    </div>
  );
}
