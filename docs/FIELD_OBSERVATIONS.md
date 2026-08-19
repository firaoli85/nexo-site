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
> **FIELD RE-CHECK OF THE C4 FIX IS PENDING AT A VERIFIED COMMIT >= b58925f.** Owner screenshots dated
> 2026-08-18 show mode-2-signature divergence, but the build provenance is UNESTABLISHED (dev server,
> commit unknown), and screenshots of an unknown build cannot confirm or refute a fix. **No verdict is
> recorded either way** — not "still broken", not "fixed". The re-test must be run on a build whose
> commit is known to contain the fix.
> The bluish colour cast reported alongside is C3-class and separate; it is addressed by the D23 hardening
> (Task #18) and also awaits an on-device reading.

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

> **F1 edge: FIXED on v2 (Task #20). The cause was contrast polarity, not pixel geometry — recorded
> so nobody re-opens the DPR theory.** The D23 floors were NOT softened and the `/platform` rule was
> NOT demoted; both were confirmed working by measurement. **Owner field re-test owed** at a verified
> commit, and it is the closing proof — this is verified by instrument and by eye on a dev-class
> machine, not yet on the laptop that reported the failure.
