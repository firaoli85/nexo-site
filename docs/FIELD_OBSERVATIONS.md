# FIELD OBSERVATIONS

Defects seen on **real machines in the wild**, outside the harness. The cube runs on a dev-class machine;
this file exists because that is not the population we serve.

Each entry: date, machine class, the exact build observed, symptoms as reported, and — where one was
established — **the named mechanism, verified against source rather than transcribed**.

**LEDGER (2026-08-20): FO-1 CLOSED · FO-2 CLOSED · FO-3 CLOSED — all three are field-closed.** Any
future line-or-van field report starts at the FO-3 probe and the D26 provenance protocol, **never at
re-diagnosis**: the mechanisms are named, fixed and guarded, so a new report is a provenance question
first (which build, which machine, which settings) and a diagnosis question only if the probe comes
back dirty.

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

> **FO-1 / C4 CLOSED 2026-08-20 — the outstanding verified-commit re-test is satisfied by the FO-3
> field evidence.** That re-test asked one question: does the line/van glue hold on the reporting
> machine at a build whose provenance is known? Both FO-3 probe runs answer it directly — the Yoga at
> dpr 1.25 returns `errY -0 / errX 12` (the designed lane, not drift) with `ctm [1,1]`, and the owner
> laptop at dpr 2 returns `gapPx 0` with `build NEW`. **Same subsystem, same glue, provenance
> established on both machines**, which is exactly what the pending clause required. See FO-3's
> closure section for the verbatim output.
>
> Fix history, for the record: **FIXED on v2 (Task #19)** — reproduced before fixing, both modes
> measured to zero, I20 guards it. **The live V1 defect on `main` remains until v2 deploys**; the
> recorded ruling was the v2/W5 path, not a `main` hotfix. **The 2026-08-18 owner screenshots remain
> unusable as evidence** (dev server, commit unknown) and no verdict was ever recorded from them —
> the closure above rests on instrumented output at a known build, not on those images.
> The bluish colour cast reported alongside is C3-class and separate; it is addressed by the D23
> hardening (Task #18) and still awaits an on-device reading.

---

## FO-2 — Scrolled-nav bottom edge does not exist on standard hardware (F1)

| | |
|---|---|
| **Date** | 2026-08-18 |
| **Machine class** | Standard laptop (the OPERATIVE device that set the D23 perception floors) |
| **Build observed** | **v2, post-Task-#18.** The D23 hardening is confirmed PRESENT: the owner's screenshots show the card and grid hairlines that only exist after #18. **Exact commit UNKNOWN — a dev server, not a verified prod build.** |
| **Evidence** | Owner screenshots + direct field check |
| **Register** | Homepage, desktop, scrolled state, motion allowed |

### Field check results — two passes, one failure

- **PASS — cards and grid hairlines EXIST.** D23 holds on the machine that set its floors. The token
  hardening did what it was measured to do.
- **PASS — the `/platform` sticky sub-nav rule reads CRISP.** Recorded explicitly as a pass, and it matters:
  it is the same `--border-strong` promotion F3 shipped, on the same machine, in the same session.
  **No demotion of that rule is warranted or implied by this report.**
- **FAIL — the scrolled-nav bottom edge DOES NOT EXIST.** Not faint, not marginal: absent. This is despite
  F1 shipping at `--on-ink-border-strong`, which is the owner's **own E2-05 floor** and measures 3.47:1
  against `--ink-surface`.

### Why this is a different class from C3

**The colour floors cannot catch this and were never able to.** D23 measured *what colour a line must be to
be perceptible*. It assumed a line would be painted at all. This report says the line is not there — which
is a **pixel-geometry** failure, not a contrast failure. A correct colour rendered into zero physical pixels
is invisible at every contrast ratio. **The two passes above are the control**: hairlines elsewhere on the
same screen in the same session prove the palette is fine and isolate the fault to this specific edge.

### Suspects (to be settled by instruments, not by argument)

- **(a) Fractional `devicePixelRatio`.** Windows display scaling at 125% / 150% is the default on a
  laptop of this class. A 1px CSS border at DSF 1.25 is 1.25 physical pixels; depending on the snapping
  rule applied to the border box it can round to zero rows of full-opacity paint, or smear to a
  sub-threshold alpha that reads as nothing.
- **(b) The scrolled state never arms.** `scrolled` is React state driven by a scroll listener; if it does
  not flip, the element keeps `border-transparent` and there is simply no edge to see.
- **(c) Paint order / stacking against the glass layer.** `.nav-glass` paints a translucent background with
  a `backdrop-filter`; a border painted underneath or composited into that layer could be swallowed.

### DIAGNOSED AND FIXED (Task #20, 2026-08-18)

**ALL THREE PRIME SUSPECTS WERE ACQUITTED BY DIRECT MEASUREMENT.** The edge was rendered at four
device scale factors on three engines, and a vertical strip of the seam was pixel-sampled from the
PNG (zero-dep decode via `node:zlib`, so the physical rows are read, not inferred):

| Engine | DSF 1 | DSF 1.25 | DSF 1.5 | DSF 2 |
|---|---|---|---|---|
| chromium | painted, token exact | painted, token exact | painted, token exact | painted, token exact |
| webkit | painted, token exact | painted (border computes 0.8px) | painted (0.667px) | painted, token exact |
| firefox | painted, token exact | painted, token exact | painted, token exact | painted, token exact |

In all 12 cells the scrolled state was **armed** (`border-bottom: 1px solid rgb(91,130,117)`) and the
painted row matched the token at **distance 0**. So: **(a) fractional-DPR erasure — NOT GUILTY.
(b) the scrolled state not arming — NOT GUILTY. (c) the glass layer swallowing the border — NOT
GUILTY.** The edge existed the whole time, everywhere.

### THE ACTUAL MECHANISM — contrast POLARITY, not pixel geometry

**A line is seen when it is a LOCAL EXTREMUM** — different from the nearest different value on BOTH
sides. A line whose luminance sits *monotonically* between its neighbours is folded by the visual
system into the boundary ramp and read as antialiasing, no matter how correct its contrast ratio is.

**The owner supplied the control for free.** They reported the `/platform` sub-nav rule as CRISP in
the same session, on the same machine. Measured: `rgb(150,159,174)` between white above and tint
below — a **LOCAL MIN**, strength **2.36**. It is an extremum, so it reads.

The scrolled nav over **light** content measured, at every DSF: nav `rgb(35,45,42)` →
edge `rgb(91,130,117)` → page `rgb(245,247,249)`. Luminance **0.025 → 0.195 → 0.928**: strictly
increasing. **MONOTONIC, strength 0.00.** The edge is a mid-step inside a 13:1 dark-to-light
transition and carries no signal. Over **ink** content the same edge is a **LOCAL MAX (≈4.0)** and
reads perfectly — **which is exactly the case the F1 bench fragment tested: it was titled "Nav over
ink".** The field failure lives in the register F1 never benched.

### Candidate comparison — four DSFs × both registers (strength; 0 = no line)

| Candidate | light DSF1 | 1.25 | 1.5 | 2 | ink DSF1 | 1.25 | 1.5 | 2 |
|---|---|---|---|---|---|---|---|---|
| A 1px border, token (shipped before) | **0** | **0** | **0** | **0** | 4.27 | 3.03 | 2.16 | 3.98 |
| B 2px border, token | **0** | **0** | **0** | **0** | 4.27 | 2.13 | 3.97 | 3.98 |
| C border + 1px underline @0.55 | **0** | 1.29 | 1.17 | **0** | 4.27 | 3.15 | 2.16 | 4.19 |
| D border + soft shadow @0.20 | **0** | **0** | **0** | **0** | 4.27 | 3.07 | 2.16 | 4.07 |
| **E border + 1px underline @0.75 — CHOSEN** | **1.99** | **1.92** | **2.31** | **1.99** | 4.27 | 3.19 | 2.16 | 4.26 |

**Thickening the border does not work, and that is a measured result, not an opinion:** candidate B
scores **0 at all four DSFs** on the light side. Thickness cannot create an extremum that polarity
denies. The soft shadow (D) is too weak to register at all. Only **E** produces a painted extremum in
**both** registers at **every** DSF, and its light-side strength (1.92–2.31) is comparable to the
`/platform` rule the owner already calls crisp (2.36).

**Shipped:** `--nav-seam: rgb(11 21 18 / 0.75)` with `.nav-seam { box-shadow: 0 1px 0 var(--nav-seam) }`,
armed by the same `scrolled` condition as the border so the **page-top no-border state is untouched**.
The border token is **unchanged** — D23 was not softened, and nothing about the E2-05 floor was
revisited. It is a hard 0-blur rule, not a glow; the flat aesthetic holds.

**Contrast re-verified against the composited nav background:** border vs nav-over-light **3.31:1**,
vs nav-over-tint **3.32:1**, vs nav-over-ink **4.27:1**; seam vs the page below **7.97:1**. Nav text is
untouched and unchanged — on-ink **12.35:1**, on-ink-muted **7.38:1**, accent-on-ink **7.69:1**.

### TWO INSTRUMENT FAULTS FOUND WHILE DIAGNOSING — recorded because they nearly produced false findings

1. **A smooth-scroll artifact almost got reported as a site defect.** `html { scroll-behavior: smooth }`
   means `window.scrollTo` animates; screenshots taken before it settled captured frames where the
   sticky bar had not been repositioned, and the seam appeared to be MISSING at three of four scroll
   positions. Every scroll in these probes must be `behavior:"instant"`. With that fixed the edge is
   present at cssY 64 at every position.
2. **The extremum detector was wrong twice and had to be fixed before it could convict anything.**
   First it compared the global minimum against the two plateaus — but at a dark-bar/light-page seam
   the global minimum IS the bar, so a real 1px dip scored MONOTONIC. Then it compared against
   immediate neighbours — which fails whenever the edge is thicker than one physical row, because at
   DSF 2 a 1px border is two identical rows and neither is a *strict* extremum, so a plainly visible
   edge scored MONOTONIC. The working version collapses equal runs first, then scans runs. Both
   lessons are written into `scripts/qa/i21-nav-seam.mjs` so the next reader does not repeat them.

### I21 — live

**"The nav edge exists."** Asserts a painted local extremum at the seam across **DSF 1 / 1.25 / 1.5 / 2
× w1440 / w390 × light and ink registers = 16 samples**, floor **1.5** (measured worst on the fixed
build is 1.92; the failure mode scores exactly 0). It deliberately asserts **no colour, token, or
border width** — all of those were perfectly correct while the edge was invisible, which is precisely
how FO-2 happened. Runs once per sweep like I19 and is folded into the same exit code; the tradeoff
is stated in the file (re-running the 234-cell cube at four DSFs would cost 936 cells to answer a
question about one element, and DSF cannot be varied inside an existing cube cell).
**Self-tested in 3 legs:** healthy passes 16/16, sabotage (`border-bottom-color:transparent;
box-shadow:none`) fails naming `MONOTONIC, strength 0.00`, restored passes again.

### Status

> **CLOSED IN FIELD ON BOTH MACHINES 2026-08-18** — work machine: distinct edge; Yoga: subtle edge,
> which is as designed (the seam is a hairline, not a slab). FO-2 needs nothing further.
>
> **F1 edge: FIXED on v2 (Task #20). The cause was contrast polarity, not pixel geometry — recorded
> so nobody re-opens the DPR theory.** The D23 floors were NOT softened and the `/platform` rule was
> NOT demoted; both were confirmed working by measurement. **Owner field re-test owed** at a verified
> commit, and it is the closing proof — this is verified by instrument and by eye on a dev-class
> machine, not yet on the laptop that reported the failure.

---

## FO-3 — The van ignores the terminus curve on Yoga-class hardware

| | |
|---|---|
| **Date** | 2026-08-18 |
| **Machine class** | Lenovo Yoga 7 class · Windows — the same machine that reported FO-1 |
| **Build observed** | **Circumstantially ≥ Task #20 (`9d2e2e3`).** See the fingerprint below. |
| **Register** | Homepage, desktop, motion allowed, at the terminus curve |

### Provenance — established by FINGERPRINT, not by assertion

FO-1's re-test was blocked because the build's commit was unknown, and screenshots of an unknown build
can neither confirm nor refute a fix. This report is different: **the owner saw the scrolled-nav seam
over light content.** That seam does not exist before Task #20 — it is `--nav-seam`, added in
`9d2e2e3`, and before that commit the edge measured MONOTONIC / strength 0.00 over light content on
every engine and every DSF. **A feature that only exists after a commit, observed on the machine,
dates the build to at or after that commit.** This is circumstantial rather than a hash, and it is
recorded as circumstantial — but it is evidence, and it is why FO-1's fixes can be treated as PRESENT
in this observation where they could not be in the last one.

### Symptom as reported

- FO-1's fixes are **verified working on a dev-class machine**.
- On the Yoga, the van **tracks the straight leg correctly** and then **IGNORES THE TERMINUS CURVE** —
  it continues straight down while the drawn line turns toward the footer motif.

### Why this is a NEW mode, not a return of FO-1

Both Task #19 modes measure **0.00px** on dev hardware after the fix, and the identity-CTM
construction makes the mode-1 shear unrepresentable. A defect that appears **only at the curve** and
**only on that machine** is a third mechanism. The signature is precise and useful: **an error that is
invisible on the straight leg and grows through the curve is an error proportional to the path's
x-coordinate**, because x is constant in the gutter and only grows as the path bends toward `motifX`.

### Suspects (to be settled by instruments, not by argument)

- **PRIME — page zoom ≠ 100%, or zoom × fractional-DPR interaction.** Browser zoom scales the rendered
  SVG through its CTM but has a history of not applying identically to `offset-path: path()` pixel
  coordinates. The resulting error would be proportional to x — exactly the observed signature — and
  Windows laptops of this class commonly sit at a non-default zoom without the user knowing.
- **SECOND — the `offset-path` value rejected or stale on that machine.** The assignment is wrapped in
  a `try/catch` that silently swallows a parse failure, and `@supports (offset-path: path("M0 0"))`
  tests a *trivial* path, so a long generated `d` could be rejected while the gate still passes.
- **SECOND — engine-specific `offset-distance` behaviour** through the curve segment.

### INVESTIGATED — NOT REPRODUCED, NOT CONVICTED (Task #21, 2026-08-19)

**FO-3 did not reproduce in any lane tried.** 51 samples: **4 emulation lanes × 3 engines × 3 scroll
positions**, every one within 1px of agreement.

| Lane | What it emulates | 1.10 | 1.25 | 1.50 |
|---|---|---|---|---|
| `deviceScaleFactor` | DPR / display scaling | — | ≤0.07px | ≤0.07px |
| `Emulation.setPageScaleFactor` | compositor pinch-zoom | ≤0.05px | ≤0.05px | ≤0.07px |
| `Emulation.setDeviceMetricsOverride` | closest to real browser zoom | ≤0.09px | ≤0.18px | n/a (viewport drops below `lg`, overlay tears down — correct behaviour) |
| CSS `zoom` on `<html>` | what Chromium browser zoom resembles | ≤0.12px | ≤0.03px | ≤0.06px |

WebKit and Firefox were also swept at DSF 1 / 1.25 / 1.5: worst **0.224px** (webkit), **0.007px**
(firefox), and in every case the error was **constant**, not growing through the curve.

**THE ∝x PREDICTION FAILED, AND THAT IS THE INFORMATIVE PART.** The reported signature — invisible on
the straight leg, appearing at the curve — implies an error proportional to the path's x-coordinate.
Every sample records `dxFromGutter` alongside the error, so the prediction was directly testable. At
`dxFromGutter = 0` (straight leg) and at `dxFromGutter = 172` (deep in the curve) the error is the
same and it is ~zero. **The prime suspect is not convicted.** `offset-path` was never rejected either —
the computed value was read at every sample and was always a valid path.

### The architectural fix was attempted, MEASURED, and REJECTED

`offset-path: url(#route-path)` — pointing the van at the *rendered path element* instead of a copied
string — was the obvious way to remove the remaining duplication by construction. It priced well:
supported and accepted in **all three engines**, switching a positioned van from `path()` to `url()`
moved it **0.00px**, and it costs nothing per frame (versus per-frame `getPointAtLength`, measured at
**19µs** chromium / **44µs** webkit / **102µs** firefox on a dev box — real work added to every frame,
on the machine class that already struggles, to fix a defect that was never reproduced).

**It shipped into the cube and I20 failed it.** `url()` has a **stale-reference invalidation bug in
Chromium and WebKit**: when the referenced path element's `d` changes, the van keeps using the OLD
geometry. Measured after a document reflow — geometry correctly updated (path length 6039 → 4839,
host height 6027 → 4827) and yet:

| Engine | delta after reflow, +0ms | +50ms | +400ms | +1500ms |
|---|---|---|---|---|
| chromium | 0 | **978px** | **978px** | **978px** |
| webkit | 0 | 0 | **977.9px** | **977.9px** |
| firefox | 0 | 0 | 0 | 0 |

**Persistent, not transient.** That is a worse version of the very class it was meant to remove, and it
is precisely the "van on a different path from the line" symptom FO-3 describes. **Reverted.** The
shipped `path()` assignment is correct *because* it is re-assigned on every geometry change, which
forces the invalidation `url()` skips — so `url()` would have to be re-assigned too, buying nothing
and carrying an engine bug. **Do not re-attempt `url()` without re-testing this specific case.**

### What DID ship

**The I20 zoom leg.** I20 previously only ever looked at zoom 1, so the entire zoom class was
unmeasured either way. The leg asserts van/line agreement **mid-curve** under CSS `zoom` 1.25/1.5 and
device-metrics 1.25 — chromium-only, because zoom is not emulable in the webkit/firefox lanes, and it
**says so in its own output** so a green I20 is never mistaken for "zoom verified everywhere".
Measured worst mid-curve delta **0.156px** against a 1px tolerance. Negative-tested: handing the van
its own shifted copy of the geometry fails the leg naming the zoom context and the offset.

### THE NEXT INSTRUMENT IS A FIELD CONSOLE PROBE — this is the actionable next step

The dev-class machine cannot see this defect, so the next measurement has to come from the machine
that can. On the Yoga, at the terminus curve where the van is visibly wrong, paste into DevTools:

```js
(() => {
  const r = document.querySelector('.route-overlay'), p = document.querySelector('.route-path'), v = document.querySelector('.route-van');
  if (!r || !p || !v) return 'no route nodes (below lg, or reduced-motion)';
  const prog = parseFloat(getComputedStyle(r).getPropertyValue('--route-progress'));
  const m = p.getScreenCTM(), L = p.getTotalLength(), q = p.getPointAtLength(prog * L), q0 = p.getPointAtLength(0);
  const hx = m.a*q.x + m.c*q.y + m.e, hy = m.b*q.x + m.d*q.y + m.f, b = v.getBoundingClientRect();
  return {
    progress: +prog.toFixed(4),
    dxFromGutter: +(q.x - q0.x).toFixed(1),          // >20 means we are IN the curve
    errorPx: +Math.hypot(b.left + b.width/2 - hx, b.top + b.height/2 - hy).toFixed(1),
    errX: +(b.left + b.width/2 - hx).toFixed(1), errY: +(b.top + b.height/2 - hy).toFixed(1),
    ctm: [+m.a.toFixed(3), +m.d.toFixed(3)],         // both should be 1
    dpr: window.devicePixelRatio, zoom: (window.outerWidth / window.innerWidth).toFixed(3),
    offsetPath: getComputedStyle(v).offsetPath.slice(0, 60),
  };
})()
```

`errorPx` is the whole question. If it is ~0 while the van *looks* wrong, the defect is in what is
being painted rather than where the element is positioned, and the hunt moves to compositing. If it is
large, `errX`/`errY` and `dxFromGutter` say which axis and how far into the curve, `ctm` says whether a
scale crept in, and `zoom`/`dpr` capture the machine state that no emulation lane reproduced.

### CONVICTED BY FIELD PROBE (owner, 2026-08-19)

The console probe from Task #21 was run on the Yoga at the curve. Build fingerprint: `preserveAspect=null`,
which only holds from Task #19 onward. **Browser zoom 100%, Windows display scaling 125% (dpr 1.25):**

```json
{ "progress": 0, "errX": 0.0, "errY": 2945.6, "vvScale": 1, "svgW": "1521px", "winW": 1536 }
```

**Read it carefully, because it names the mechanism.** `progress: 0` — the shared `--route-progress`
variable read **zero**. The LINE rendered that honestly: undrawn, which matches the owner's screenshot
showing no line at all. The VAN, reading the *same variable through a different renderer*, sat
**2945.6px along the route** holding a value the variable no longer had. `errX: 0.0` says the two
agree perfectly on the horizontal axis; the entire disagreement is `errY`, i.e. *distance along the
route*. This is not a paint problem and not a geometry problem — **it is a state problem: one variable,
two renderers, and only one of them still listening.**

**The owner's zoom ladder correlates exactly with the EFFECTIVE fractional scale:**

| Browser zoom | × display scaling | Effective scale | Result |
|---|---|---|---|
| 100% | 1.25 | **1.25** | large gap |
| 90% | 1.25 | **1.125** | small gap |
| 80% | 1.25 | **1.00** | perfect |

The defect scales with how *fractional* the effective device scale is, and vanishes exactly when it
lands on a whole number. That is a rasterisation-boundary signature.

**CONVICTION: dual-renderer state desync.** The van's `offset-distance: calc(var(--route-progress) * 100%)`
stops re-resolving on real fractional-DPR hardware while the SVG line keeps listening. Position-level,
not paint-level. Chromium. **NOT reproducible in lab emulation** — Task #21's 51-sample matrix across
four emulation lanes and three engines measured everything within 1px.

**The precise Chromium-internal invalidation path remains UNPROVEN, and deliberately so.** We could
not reproduce it, so we cannot instrument it, so we cannot claim to have found it. What we can do is
remove the thing it needs to exist. **The fix is architectural: there is no second renderer to desync.**

### FIXED (Task #22, 2026-08-19) — one raster surface

The van is no longer an HTML `<span>` beside the svg. It is a `<g>` **inside** the same svg, in the
same user space, positioned per frame by an SVG transform written from the same number in the same
frame as the line's dash. `offset-path`, `offset-distance`, `offset-rotate`, `offset-anchor`, the
imperative `offsetPath` assignment and the `@supports (offset-path: ...)` display gate are **all gone**.

**Positioning is a precomputed LUT.** At each geometry change the rendered path is sampled at
**N = 256** points into two `Float32Array`s; per frame `update()` interpolates two entries and writes
one `transform` attribute. **Zero per-frame geometry reads, zero per-frame layout reads** — the scroll
handler is still one passive listener, one rAF, one CSS var write, plus this one attribute write.

| Engine | LUT build (per geometry change) | Per frame | Worst van↔line error |
|---|---|---|---|
| chromium | 15.3ms | **4.9µs** | 0.095px |
| webkit | 12ms | **3.7µs** | 0.096px |
| firefox | 30ms | **13.8µs** | 0.106px |

A 60fps frame is 16 667µs, so the per-frame cost is **0.02–0.08%** of budget. N was chosen by
measurement, not taste: the straight leg interpolates exactly, so error exists only in the terminus
curve where the chord error is ~`s²/(8R)` = 19²/(8·460) ≈ **0.10px** — 10× under I20's 1px tolerance,
and measured at 0.095–0.106px. N = 512 halved the error to ~0.03px (invisible) while costing **144ms**
on firefox per rebuild — a visible main-thread stall on a reflow mid-scroll, bought with accuracy
nobody can perceive.

**MOTION PARITY — verified, not hoped.** Three nested groups each own exactly one transform so none of
them fight: `.route-van` takes the per-frame translate (a presentation *attribute*, so no CSS rule may
set `transform` on it), `.route-van-lane` the ±12px lane offset (450ms, interruptible), `.route-van-nose`
the ±90° facing (200ms). Measured identically in **all three engines**: rotation displaces the van's
centre by **0.00px**, the leg flip moves it by exactly **−24.00px**, and the nose matrices are exactly
±90°. Eye pass at zoom 1: worst delta **0.09px** over 30 slow steps and **0.01px** on hard jumps with
no settle — *better* than the Task #19 baseline of 0.227px/0.08px. Handoff holds at **36px** through
the curve, the U-turn, the manual reflow trigger and its removal. I15 gap at the terminus: **21px**,
unchanged.

**WHAT SUPPORT WAS GAINED.** The `@supports (offset-path: path(...))` gate used to *hide the van
entirely* on any engine without `offset-path`. SVG transforms need no gate, so the van now renders
wherever the svg does. The deliberate absences are untouched and re-verified in all three engines:
reduced-motion (progress pinned to 1, van absent, line fully drawn, spine not armed), sub-`lg`
teardown (zero van and path nodes, overlay `display:none`), the narrow→wide resize-lockout rule, and
static-complete SSR.

**One measurement subtlety worth recording**, because it looked like a 12px regression and was not:
`getBoundingClientRect()` on a `<g>` **includes its children's transforms**, so it folds in the
deliberate ±12px lane offset. The old HTML parent's border box excluded the child transform for free.
I20 now measures `van.getScreenCTM()` — the group's *own* origin, which is the point that rides the
path.

### UNIFIED-SCALE EVIDENCE — a second machine, failing on the OTHER side of 1.0 (2026-08-19)

The owner tested the **work machine** (standard display scaling, good monitor) and it behaves as the
**mirror image** of the Yoga:

| Machine | Display scaling | Browser zoom | **Effective scale** | Result |
|---|---|---|---|---|
| Yoga | 125% (dpr 1.25) | 100% | **1.25** | broken — large gap |
| Yoga | 125% | 90% | **1.125** | broken — small gap |
| Yoga | 125% | 80% | **1.00** | **perfect** |
| Work machine | 100% (dpr 1) | 100% | **1.00** | **perfect** |
| Work machine | 100% | 80% | **0.80** | broken — van absent / off the line |

**THE UNIFIED LAW: the pre-#22 dual-renderer architecture fails whenever the EFFECTIVE SCALE ≠ 1.0, in
either direction.** Not "at high DPI", not "at fractional DPR" — *away from unity*, above it or below
it. Each machine on its own reads as a machine-specific quirk; **two machines failing on opposite sides
of 1.0, and both perfect exactly at 1.0, is the class-level conviction.** The Yoga's own zoom ladder was
already suggestive (the defect shrank as the effective scale approached 1.00); the work machine supplies
the other half of the curve and turns a correlation into a law. It also retires the last plausible
"it's just that laptop" reading: the work machine is the good monitor with standard scaling, and it
breaks too — it simply needs zoom to *leave* 1.0 rather than to reach it.

This is why the Task #22 fix is architectural rather than a scale-compensation patch. A patch would
have to know the effective scale and correct for it in both directions; **a single surface has no scale
to reconcile, because there is only one mapping.**

**CLOSING-PROOF PROTOCOL — extended to two machines, both on a build ≥ Task #22 (`432958c`):**

1. **Yoga at browser zoom 100%** (effective scale 1.25 — its known-broken point).
2. **Work machine at browser zoom 80%** (effective scale 0.80 — its known-broken point).

Each machine must be tested at **the setting that used to fail it**, which is a different setting on
each. Testing both at 100% would pass on the work machine for the wrong reason — 100% was never its
failing case. Run the console probe recorded above at the terminus curve on both: **`errY` should read
~0**, and the zoom ladder should be **flat** rather than scaling with distance from 1.0.

### PROBE RETRACTION, REOPENING, AND ROOT CAUSE (2026-08-20)

#### BOTH chat-authored probes are RETRACTED. Neither ever measured what it claimed.

**Probe 1 (the Task #21 probe, cited as the Task #22 "conviction"):** it read
`--route-progress` from `document.documentElement`. **The code sets that variable on the
`.route-overlay` element**, never on the root. So the read returned an empty string and
`parseFloat("")` gave `0` **on every machine, every time, regardless of the site's actual state.**
Its `errY` therefore measured only *the van's distance along the path* and was an **artifact, not an
error**. Reproduced here deliberately: across 36 samples in three engines, `var(documentElement)` was
**empty in every single one**.

- **Yoga `errY: 2945.6` — RECLASSIFIED AS ARTIFACT.**
- **Owner laptop `errY: 2071` — RECLASSIFIED AS ARTIFACT.**
- **Neither JSON may ever be cited as evidence again.**

**Probe 2 (the "corrected" probe published in Task #21):** it threw
`getPointAtLength: non-finite` on the owner's machine. **Root cause now known and it is the same
family of blind assumption:** Blink serialises `stroke-dashoffset` as **`calc(0.729646px)`**, and
`parseFloat("calc(0.729646px)")` is **`NaN`**, which then poisoned `getPointAtLength`. The same trap
appeared in this task's own first hunt script, where every Chromium row printed `lineP: null`.

**Both probes were written blind against assumed selectors and assumed property serialisation, and
both failed. The owner's visual reports have been the only valid field instrument throughout.**

#### What this does and does not change about Task #22

**The Task #22 "conviction" narrative is RETRACTED as evidence.** There was no dual-renderer state
desync demonstrated, because the number that appeared to demonstrate it was an artifact.

**Task #22's architecture stands on its independent merits**, which never depended on that narrative:
one raster surface instead of two renderers, the `@supports` gate removed so the van renders wherever
the svg does, a measured per-frame cost of 4.9–13.8µs, and invariant coverage. It is a better design
for reasons that were measured separately.

#### THE ROOT CAUSE, FOUND — and the dpr lead was a red herring

The reopened signature was: **on a proven NEW build, the LINE renders fully drawn while the VAN sits
mid-route.** It reproduced immediately, in **Firefox**, and the mechanism is a one-line CSS defect
that had been shipping since the route was built:

```css
/* WRONG — what shipped until Task #25 */
.route-path { stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--route-progress, 1)); }
```

**As a CSS property, `stroke-dashoffset` takes a `<length-percentage>`. A bare number is not a
length.** (`stroke-dasharray` is the lenient one: it genuinely accepts `<number>`, which is why only
the offset broke.) Engines diverge on the invalid value:

| Engine | Serialised `stroke-dashoffset` | Result |
|---|---|---|
| Blink | `calc(0.729646px)` | coerced; line correct, but the string breaks `parseFloat` |
| WebKit | `0.72968px` | coerced; line correct |
| **Gecko** | **`0px`** | **declaration dropped, offset falls back to 0** |

**With `stroke-dasharray: 1`, a dashoffset of 0 draws the ENTIRE path.** So Gecko paints a fully-drawn
line while the van — positioned by a JS transform that never consults CSS inheritance — sits correctly
at mid-route. **That is precisely the reported signature.**

**Measured at dpr 1, 1.5 and 2 in Gecko with identical results, so device pixel ratio is irrelevant.
The variable is engine strictness, and Gecko is the one behaving correctly.**

**THE FIX** (Task #25): multiply by a unit so the value is a real length.

```css
.route-path { stroke-dasharray: 1px; stroke-dashoffset: calc((1 - var(--route-progress, 1)) * 1px); }
```

**Verified after the fix, all three engines at dpr 2, w1542:** dashoffset now serialises as
`0.618027px` / `0.618117px` / **`0.619808px`** (Gecko fixed), `lineP` equals the variable, head Y
equals van Y, **gap 0px**, verdict *OK: line and van agree* at every sampled position.

**I20 now asserts it.** The invariant previously compared the van against the path *geometry* and
never asked what the line was actually *drawing*, which is exactly where the defect lived. It now
parses the computed dashoffset (stripping `calc()` first) and fails if the line disagrees with the
variable by more than 0.02. Since Firefox is already a cube engine, **this assertion would have caught
the defect on the day it shipped.** A dpr-2 lane was added to the I20 zoom leg as well.

#### THE FIELD PROBE — executed before publication, per D26

**This probe was run by the harness against the running local build in Chromium, WebKit and Firefox
before being written here, and its output is recorded in the Task #25 report.** It reads the variable
from `.route-overlay` (not `documentElement`), strips `calc()` before parsing (Blink's serialisation),
and never calls `getPointAtLength` with an unvalidated number. Paste into DevTools on the homepage,
scrolled to any mid-page position:

```js
(() => {
  const root = document.querySelector('.route-overlay');
  const path = document.querySelector('.route-path');
  const van  = document.querySelector('.route-van');
  if (!root || !path) return 'no route overlay here (below lg, interior route, or not the homepage)';
  const num = s => { if (s == null) return NaN;
    return parseFloat(String(s).trim().replace(/^calc\((.*)\)$/, '$1')); };
  const varRaw = getComputedStyle(root).getPropertyValue('--route-progress').trim();
  const varP   = num(varRaw);
  const dofRaw = getComputedStyle(path).strokeDashoffset;
  const daRaw  = getComputedStyle(path).strokeDasharray;
  const dof    = num(dofRaw);
  const lineP  = isFinite(dof) ? 1 - dof : NaN;
  const L      = path.getTotalLength();
  const headY  = isFinite(lineP) ? path.getPointAtLength(Math.max(0, Math.min(1, lineP)) * L).y : null;
  const vanT   = van ? van.getAttribute('transform') : null;
  const m      = vanT ? /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/.exec(vanT) : null;
  const vanY   = m ? parseFloat(m[2]) : null;
  return {
    build: van && van.tagName.toLowerCase() === 'g' ? 'NEW (van inside the svg)' : 'OLD (van outside the svg)',
    varRaw: varRaw || '(EMPTY — the variable is not reaching the overlay)',
    varP: isFinite(varP) ? +varP.toFixed(4) : null,
    dashoffsetRaw: dofRaw, dasharrayRaw: daRaw,
    lineP: isFinite(lineP) ? +lineP.toFixed(4) : null,
    headY: headY == null ? null : Math.round(headY),
    vanY:  vanY  == null ? null : Math.round(vanY),
    gapPx: (headY == null || vanY == null) ? null : Math.round(vanY - headY),
    VERDICT: !isFinite(lineP) ? 'CANNOT READ dashoffset — report the raw string above'
      : (isFinite(varP) && lineP > 0.98 && varP < 0.9) ? 'DEFECT: LINE-FULL while the variable says mid-route'
      : (headY != null && vanY != null && Math.abs(vanY - headY) > 40) ? 'DEFECT: line and van disagree'
      : 'OK: line and van agree',
    dpr: window.devicePixelRatio, winW: window.innerWidth,
    zoom: +(window.outerWidth / window.innerWidth).toFixed(3),
  };
})()
```

**`gapPx` is the whole question.** It is the direct line-versus-van measurement with no assumptions:
0 means they agree. **The element that carries the animated dash is `path.route-path` with
`pathLength="1"`, inside the route `svg`** — confirmed from the live DOM, which matters because the
page contains a *second* dashed element (a `line` inside `g.terminus-line`, `dasharray: 5px, 4.5px`)
that an assumption-based probe could easily have grabbed instead.

### CLOSED IN FIELD ON BOTH MACHINES (owner, 2026-08-20)

**The probe above was executed on both real machines and both came back clean.** This is the evidence
the whole FO-3 thread was waiting for: not a screenshot of an unknown build, but instrumented output
from the machines that filed the reports, at settings that used to break.

**MACHINE 1 — the Yoga (the machine that filed FO-1 and FO-3), Chrome, dpr 1.25, zoom 1.000.**
Output verbatim:

```
errY -0   errX 12   ctm [1,1]   offsetPath "none"
```

**Reading, term by term, because each one closes a specific suspect:**

- **`errX 12` is the designed outbound lane, not drift.** `.route-van-lane` offsets the van by
  ±12px to sit it in its travel lane; 12 is the value the CSS asks for. A drift defect would produce
  an arbitrary, position-dependent number, not exactly the lane constant.
- **`errY -0`** — zero vertical error. FO-1's corrected record already established that divergence
  in this system is purely horizontal (measured dy ≤ 0.09px), and the field now agrees.
- **`ctm [1,1]`** — no residual scale on the raster surface. This is the measurement that would have
  exposed a unified-scale mismatch, which is the class of fault §"UNIFIED-SCALE EVIDENCE" recorded.
- **`offsetPath "none"`** — **confirmation that the Task #22 architecture is the one actually
  running on that machine.** The van is positioned from the 256-point LUT *inside* the SVG; the
  `offset-path` approach that Task #21 measured and rejected (stale `url()` reference, 978px
  persistent error in Chromium and WebKit) is not present. **The rejected design is proven absent in
  the field, not merely absent from the source.**

**MACHINE 2 — the owner laptop, dpr 2, winW 1840, zoom 1.** Output verbatim:

```
varP 0.6523 = lineP 0.6523   headY 3156 = vanY 3156   gapPx 0
VERDICT "OK: line and van agree"   build NEW
```

**Reading:**

- **`varP === lineP` is the Task #25 px-units fix confirmed in the field.** The whole root cause was
  a bare number in `stroke-dashoffset`, which is an invalid `<length-percentage>`: Gecko dropped the
  declaration and drew the entire path while Blink and WebKit silently coerced it. `lineP` tracking
  `varP` to four decimal places means **the line is listening to the variable** on a real machine.
- **`gapPx 0`** — the direct line-versus-van measurement, carrying no assumptions at all. `headY`
  and `vanY` are identical at 3156. This is the number the probe was built around.
- **`build NEW`** — build provenance established, which is precisely what the 2026-08-18 screenshots
  lacked and why no verdict was recorded from them.
- **dpr 2 was the setting the reopened investigation suspected most**, and it is clean.

**Between them the two machines cover both sides of 1.0** — dpr 1.25 on the Yoga and dpr 2 on the
laptop — which is the split the unified-scale evidence section flagged as the risky axis.

### Status

> **FO-3 CLOSED 2026-08-20 — architecture (#22) + units (#25) verified in the field on both machines;
> guarded by I20 (line-claim + zoom + dpr legs) across all three cube engines.**
>
> Root cause, for the record: an invalid CSS length in `stroke-dashoffset` that Gecko correctly
> rejected and the other two engines silently coerced (Task #25). **The dpr-2 lead was a red herring;
> engine strictness was the variable.** **Both prior chat-authored probes are retracted and must never
> be cited** — the retraction stands even though the outcome is good, because they were written blind
> against assumed selectors and properties and both returned confident, wrong numbers.
