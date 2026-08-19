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

### FIXED (Task #19, 2026-08-18)

**Architecture chosen — one line:** the route SVG is now sized in **pixels** (width/height + inline style
= `geo.w`/`geo.h`, `preserveAspectRatio` removed, viewBox carrying the same two numbers) so its CTM is
forced to identity and the van's raw-pixel `offset-path` reads the same coordinate system, while a
**rAF-debounced `ResizeObserver`** on the document element, the measured region and the host keeps that
geometry current on any reflow that never resizes the window.

**Both failure modes were reproduced on the unfixed build before anything was changed** (deterministically,
with no window resize), and re-measured after:

| Mode | Trigger | Metric | BEFORE | AFTER |
|---|---|---|---|---|
| 1 — divergence | host width −15px (scrollbar-scale) | van→drawn-curve distance | **1.52px** | **0.00px** |
| 1 — divergence | host width −60px | van→drawn-curve distance | **6.08px** | **0.00px** |
| 1 — divergence | host width −200px | van→drawn-curve distance | **31.67px** | **0.00px** |
| 1 — divergence | any of the above | SVG CTM `a` | 0.9896 / 0.9583 / **0.8611** | **1.0000** |
| 2 — stale band | +1500px document growth, post-mount | route end → footer seam (should be 36) | **1536px** | **36px** |
| 1+2 combined | both at once | van→curve / handoff | 1.52px / 1536px | **0.00px / 36px** |

Agreement on the fixed build, measured across chromium/webkit/firefox × 1024/1440/1920 × 5 scroll
positions (45 samples): **max 0.11px, p95 0.048px, median 0.003px**. Under scroll: worst **0.227px** across
30 slow steps and **0.08px** across hard jumps sampled with no settle time.

### WHERE THE MEASUREMENTS CORRECTED THIS RECORD

The mechanism section above reasons that the non-uniform stretch changes **arc-length parameterisation**, so
that the divergence "expresses vertically — which is precisely the reported *van floating far below the
line*". **Measurement does not support that.** Across every scroll position and every width delta tested,
the vertical component of the divergence stayed within **0.09px** while the horizontal component carried
**100%** of it, tracking `(1 − ctm.a) × pathX` exactly. The browser parameterises the dash in **user space**
and the CTM is applied afterwards, so a horizontal-only stretch cannot express vertically. Mode 1 is a pure
**horizontal shear**, and because this route's path never exceeds x ≈ 228, its magnitude is bounded at
roughly **32px even for a 200px width error** — far too small to be the reported symptom.

**Therefore mode 2, not mode 1, is the dominant field failure**, and the earlier note that "not established:
which of the two dominates" is now partly answered: mode 2 is the only measured mechanism with vertical
magnitude (1536px in reproduction), and it is machine-speed dependent exactly as reported — a fast machine
settles its layout before the mount measurement goes stale; a Yoga-class machine, with `display:"optional"`
fonts and slower paint, does not. **Still not established on the machine itself:** the precise trigger there
(fonts, images, or late content) — that needs the machine, not reasoning from source. Both modes are fixed
regardless, which is why the fix addressed the class and not the trigger.

### I20 — live

**"The van rides the line"** ships in the same task (D12). Tolerance **1.0px**, calibrated: ~9× above the
worst observed cross-engine noise (0.11px) and below the smallest reproduced defect (1.52px). Three scroll
positions including one deep in the terminus curve where any shear is largest; asserts the SVG CTM is
identity **by name**, so reinstating `h-full`/`w-full` or `preserveAspectRatio` on that element fails with an
instruction rather than a number. Carries the **perturbation leg** — a post-mount document growth with no
window resize, the FO-1 trigger encoded forever. Deliberate absences (interior routes, sub-`lg`,
reduced-motion, no `offset-path`) are **skips that assert the absence**, never failures.
**Negative-tested in 7 legs**, including one that stubs out `ResizeObserver` to recreate mode 2 exactly.

### Status

> **C4: FIXED on v2 (Task #19). Reproduced before fixing, both modes measured to zero, I20 guards it.**
> **The live V1 defect on `main` remains until v2 deploys** — the recorded default ruling was the v2/W5
> path, not a `main` hotfix. **Field re-check on the Yoga-class machine is owed at the v2 deploy**: this fix
> is verified by reproduction and by a green cube on a dev-class box, not yet on the machine that showed it.
> The bluish colour cast reported alongside is C3-class and separate; it is addressed by the D23 hardening
> (Task #18) and also awaits an on-device reading.
