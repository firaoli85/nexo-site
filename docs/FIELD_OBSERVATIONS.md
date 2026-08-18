# FIELD OBSERVATIONS

Defects seen on **real machines in the wild**, outside the harness. The cube runs on a dev-class machine;
this file exists because that is not the population we serve.

Each entry: date, machine class, the exact build observed, symptoms as reported, and — where one was
established — **the named mechanism, verified against source rather than transcribed**.

---

## FO-1 — Route line and livery van desynchronised (C4)

| | |
|---|---|
| **Date** | 2026-08-18 |
| **Machine class** | Lenovo Yoga 7 class · Windows · basic dedicated graphics · third-party machine (not the owner's dev box) |
| **Build observed** | **LIVE PRODUCTION — `main` @ `f0de3c9` (V1)** |
| **Evidence** | Three owner screenshots |
| **Register** | Homepage, desktop (`lg+`), motion allowed |

### Symptoms as reported

- At the **same scroll position**, the drawn route line and the livery van sit at **visibly different
  places** — the line drawn to one region while the van floats **far below** it.
- In one frame **the van renders with no line near it at all**.
- Separately, a **bluish colour cast** on that panel. **C3-class and panel-level: a screenshot cannot
  capture it**, because the screenshot records the values sent to the panel, not what the panel does with
  them. **The colour-bench readings on that machine are the instrument and remain pending.**

### THE NAMED MECHANISM — verified against source

**Verified in `src/components/home/RouteOverlay.tsx` and the route layer in `src/app/globals.css` on
2026-08-18.** `git diff f0de3c9..HEAD` on `RouteOverlay.tsx` is **empty** — the live V1 code and current v2
code are byte-identical for this component, so the diagnosis applies to both without translation.

**(a) One path string, two renderers, two coordinate systems — CONFIRMED.**
`geo.d` is consumed twice. The line renders as `<path d={geo.d} pathLength={1}>` inside
`<svg viewBox="0 0 geo.w geo.h">`. The van rides the *same string* via
`van.style.offsetPath = \`path("${geo.d}")\`` (RouteOverlay.tsx:232), and CSS `offset-path: path()` consumes
**raw user units as CSS pixels with no viewBox to scale it**.

**(b) `measure()` runs on mount and `window.resize` ONLY — CONFIRMED.**
Called once inline, then from `onResize` bound to `window.addEventListener("resize", …)`. The component's own
header comment says *"it measures the geometry in PIXELS (mount + resize only)"*. **Grep-confirmed: there is
no `ResizeObserver` and no `MutationObserver` anywhere in the file.** Nothing re-measures on content reflow.

**(c) Stale progress mapping — CONFIRMED.**
`docStart` and `docSpan` are captured inside `measure()` (lines 138–139) from `getBoundingClientRect()` plus
scroll, and the scroll handler reads them from the **cached** geometry:
`p = clamp((window.scrollY - g.docStart) / g.docSpan)`. A post-mount document-height change with no `resize`
event leaves that mapping pointing at a page that no longer exists.

**(d) Fast machines mask it — PLAUSIBLE, LABELLED AS INFERENCE.** If mount layout ≈ final layout, there is no
window in which the two systems disagree. This is consistent with the cube never catching it and with the
defect presenting as machine-dependent, but **it is reasoning from the mechanism, not an observation**, and it
is recorded as such.

### WHERE THE SOURCE CORRECTED THE CHAT-SIDE DIAGNOSIS

The chat-side read said the SVG "scales with its box" while the van "never rescales". True, but incomplete —
and the missing detail is the one that actually produces the symptom.

**The SVG carries `preserveAspectRatio="none"`, and the host's two axes are governed differently:**

- **Height is FROZEN**: the host is `style={{ top: geo.top, height: geo.h }}` — a stale inline pixel value.
- **Width is LIVE**: the host is `className="… w-full"` — 100% of its offsetParent, right now.

So the two axes scale **independently**, and only one of them is pinned. Two distinct failures follow, and
they are not the same failure:

1. **THE DESYNC ITSELF is an arc-length divergence driven by the LIVE width.** When the host's rendered width
   stops matching `geo.w` — most cheaply when a **scrollbar appears or disappears** as document height
   changes — `preserveAspectRatio="none"` stretches the path **non-uniformly** (X by `rendered/geo.w`, Y by
   1). **A non-uniform stretch changes arc-length parameterisation**: the point at fraction *t* of the
   stretched path is *not* the image of the point at fraction *t* of the raw path. The line's head is
   `stroke-dashoffset` on the **stretched, `pathLength=1`-normalised** path; the van is
   `offset-distance: progress × 100%` on the **raw** path. They are two different points, and on a long
   mostly-vertical route with gutter curves **the difference expresses vertically** — which is precisely the
   reported "van floating far below the line".
2. **THE STALE BAND is a separate consequence of the FROZEN height.** Because `height: geo.h` never updates,
   a document that reflows taller leaves the line drawn inside a stale absolute band while `docStart`/
   `docSpan` map the wrong scroll range onto it. This is what can put the van past the drawn head entirely —
   the frame with **"a van and no line nearby"**.

**Both are real. They are separable, and the fix must address both** — which is why the W5 spec offers a
single-coordinate-system option rather than only a re-measure.

**Not established:** which of the two dominates on the Yoga-class machine. That needs measurement on the
machine, not reasoning from source.

### Status

> **C4: OBSERVED on live V1 (FO-1). Mechanism NAMED. Fix scheduled W5. Owner ruling on a `main` hotfix:
> [pending — record the owner's answer when relayed; default = v2/W5 path].**
