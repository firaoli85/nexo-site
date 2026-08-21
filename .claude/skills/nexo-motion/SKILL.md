# Nexo Access — motion law

> **SYNC RULE.** This skill lives in TWO places: the **repo copy** at
> `nexo-site/.claude/skills/nexo-motion/SKILL.md` (CANONICAL — versioned with the code) and the
> **user mirror** at `~/.claude/skills/nexo-motion/SKILL.md`. Any edit to one MUST be applied to the
> other in the same change so they never drift. Same law as `nexo-brand`.

**Read `nexo-brand` first.** That skill owns the palette, the tonal map, the type system, the copy
gate and the §5 motion ceilings. This skill owns **how motion is built** — the architecture, the
existing vocabulary, and the candidate set awaiting the bench. Where they overlap, `nexo-brand` wins
on values (durations, easings, what may animate) and this skill wins on structure.

---

## 1. DOCTRINE

### 1.1 Motion-safe architecture is LAW, and it is structural
**The base is the static, final composition. Motion is strictly additive.**

Motion may be declared in exactly two places:

1. **`@media (prefers-reduced-motion: no-preference)`** — the motion scope at the end of
   `globals.css`, and Tailwind's **`motion-safe:`** variant, which compiles to the same query.
2. **A `[data-*-live]` armed-attribute selector**, where the arming code early-returns on
   `matchMedia("(prefers-reduced-motion: reduce)").matches`, so the selector cannot match for a
   reduced-motion user at all.

Nothing else counts. In particular: **Radix's `data-state`, and the components' own `data-active`,
`data-level`, `data-leg` and `data-direction`, are NOT motion gates** — they are set regardless of
the motion preference. A transition scoped only to those is unguarded. This is the single easiest
mistake to make here, and Task #28 made it in its own first inventory pass before measuring.

**Why this shape rather than a `reduce` override block.** Before Task #28 motion was declared in the
base and patched off by a `prefers-reduced-motion: reduce` block of `!important` overrides. It
worked, but the accessible rendering was a **subtraction** from the animated one: the static state
was whatever survived the overrides, and a newly added transition with no matching override would
ship silently. Inverting it makes the accessible state the thing you author, and the guard makes it
impossible to regress.

Enforced by **`scripts/qa/static-motion-check.mjs`**, wired into `qa:static` — so both the
`qa:sweep` prelude and the CI check job fail on an unguarded motion declaration, naming file and
line. **Auditors run the guard; they do not grep.**

### 1.2 Static-complete
**Every element must render its FINAL, correct state with the motion scope removed entirely.**

The test is one question, asked per rule: *what does this look like if the motion block never
applies?* If the answer is "invisible", "half-way", or "collapsed", the rule is wrong — not the
media query. Reveal animations enhance an already-visible default; they never gate visibility.

This is not only about `prefers-reduced-motion`. It is also the answer for an engine without the
media feature, a stylesheet truncated in transit, and a headless renderer that never fires a
transition. All of them get the finished page.

Corollary: **nothing in a motion scope may change resting appearance.** Only animation/transition
timing belongs there. A colour or layout property inside the motion block would be invisible to
reduced-motion users, which is precisely the failure the architecture exists to prevent.

### 1.3 Decline, don't degrade (D20)
Stripe's rule is standing law. For any GPU/canvas-class work: if the environment cannot run the
effect **well**, do not run a cheaper version of it — **decline it and show the static composition**.
A degraded effect reads as brokenness; its absence reads as design.

### 1.4 The performance bar (D20) is a ceiling, not a target
**≤600KB transfer · ≤150KB JS · ≤1200ms DCL · ≤60 requests** on the default profile. P5 measurement
may tighten these, never loosen them. Motion that cannot be delivered inside the bar is not a
motion problem, it is a scope problem.

Practical budget rules that follow from it:
- **Animate `transform`, `opacity` and `filter` only** (plus `stroke-dashoffset` for the route draw).
  Never a layout property — width/height/top/left animate the layout engine every frame.
- **One rAF, one variable.** The route system writes a single custom property per frame and lets CSS
  do the rest; per-frame JS that touches many elements is a design failure, not an optimisation
  target.
- **Nothing animates off-screen.** Every auto-playing surface is gated on an IntersectionObserver
  **and** `document.hidden`, and pauses rather than drifting.
- **If a loop can be tracked by eye it is too fast** (D20d governing rule).

### 1.5 Zero CLS
Motion must not reserve or release layout space. Grid-stack, `aspect-ratio`, or fixed dimensions —
screenshot-verified. A card that grows on hover must grow in `transform`, not in box size.

### 1.6 Ceilings (from `nexo-brand` §5, restated because they bind every candidate)
- Page content: calm, **≤ ~300ms**, ease-out. Entrances rise from `scale(0.95)`/`translateY`,
  **never** from `scale(0)`. Grouped items stagger; they never fire at once.
- **Read-first copy is not animated.**
- Nav chrome earns a higher ceiling but still **≤250ms**, decelerating
  `cubic-bezier(0.22, 1, 0.36, 1)`, transform/opacity only.
- Every hover state has a **focus twin** (`group-focus-visible` / `:focus-visible`).
- Flat aesthetic: no glow or bloom **on objects**. (D25 admits a warm gradient FIELD as background
  atmosphere — see `nexo-brand` §6.9 — but an object still never glows.)

---

## 2. THE EXISTING VOCABULARY — reference implementations

These already ship. Read them before authoring anything new; most new motion should be an
application of one of these rather than a fifth mechanism.

### 2.1 The route draw — scroll-scrubbed line
- **What it does:** one page-length SVG path draws 1:1 with scroll, from the hero spine to the
  footer seam.
- **How:** `.route-path { stroke-dasharray: 1px; stroke-dashoffset: calc((1 - var(--route-progress, 1)) * 1px); }`
  with `pathLength="1"`. A single rAF writes `--route-progress`; CSS does everything else.
- **Guard pattern:** the default is the **complete drawn line** (`var(--route-progress, 1)` falls back
  to 1 = fully drawn). The client arms `data-spine-live` only when motion is allowed. Static-complete
  by construction: no JS, no motion, still a finished route.
- **Budget:** one rAF, one custom property, zero per-element writes.
- **Scar tissue:** `stroke-dashoffset` takes a `<length-percentage>` — **a bare number is invalid CSS**.
  Gecko correctly dropped the declaration and drew the whole path while Blink and WebKit silently
  coerced it (FO-3, fixed Task #25). Units are not optional.

### 2.2 The LUT van — a glyph riding the line
- **What it does:** the livery van travels the drawn route, facing its direction of travel.
- **How:** a `<g>` **inside** the route SVG, positioned per frame from a **256-point `Float32Array`
  lookup table** built once per geometry change and interpolated between samples.
- **Guard pattern:** rides the same `data-spine-live` arming as the line.
- **Budget:** one `setAttribute("transform", …)` per frame. No layout, no reflow.
- **Scar tissue:** `offset-path: url(#id)` was implemented, **measured, and rejected** — it has a
  stale-reference invalidation bug in Chromium and WebKit (978px persistent error). The LUT exists
  because the platform primitive was measured and found wanting, not out of preference.

### 2.3 Stop reveals — IO-gated, play-once
- **What it does:** spine stops rise and fade in as they enter view, once, never re-armed on
  scroll-up.
- **How:** `[data-spine-live] .spine-reveal { opacity: 0; transform: translateY(14px); }` plus an
  `.is-revealed` class from an IntersectionObserver.
- **Guard pattern:** **the canonical armed-attribute example.** With `data-spine-live` absent — which
  is what a reduced-motion user gets — the hidden initial state is never applied at all, so content
  is visible by default. The hiding lives *inside* the armed scope; this is the detail that makes it
  static-complete rather than merely reduced.
- **Budget:** one IO, no scroll listener.

### 2.4 The U-turn lane machine
- **What it does:** the van rides the right lane outbound and the left lane on the return leg,
  crossing lanes at the terminus.
- **How:** `.route-van-lane { transform: translateX(12px) }` with `[data-leg="return"]` flipping it to
  `-12px`, over 450ms. Nose rotation is a separate ±90° transition at 200ms on `.route-van-nose`.
- **Guard pattern:** the **transforms are base state** (the van sits in its lane statically); only the
  `transition` lives in the motion scope. This is the shape to copy whenever a resting offset and its
  animation must be separated.
- **Budget:** two transitions on two nested groups; interruptible by construction.

### 2.5 Nav chrome — the higher-ceiling register
- **What it does:** a magic line slides between triggers, panels grow origin-aware from their
  trigger, items cascade, carets rotate.
- **How:** Radix `data-state` drives it; `.nav-indicator` transitions `transform` only (the visible
  bar is a fixed-width centred child, so Radix can snap width while only transform animates).
  `.nav-cascade` staggers on `--i × 45ms`.
- **Guard pattern:** **these are NOT self-guarding.** `data-state` is set regardless of motion
  preference, so every one of these declarations lives in the `no-preference` scope.
- **Budget:** ≤250ms, transform/opacity, off Radix state — no JS animation loop anywhere in the nav.
- **Scar tissue:** each `NavigationMenu.Item` must be **static**, not `relative` — a positioned Item
  becomes the trigger's `offsetParent`, `offsetLeft` collapses to 0, and Radix's indicator freezes at
  x=0 while still tracking width (Stage 16 Defect B). Guarded by I17.

### 2.6 Play-once arrival settles
`TerminusReveal`, `AssistScene`, `ProofBand`, `MapObserver` all share one shape: an IO fires once,
an armed attribute flips, elements settle into place with staggered `transition-delay`. Each arms
only after an early return on `prefers-reduced-motion`. **This repetition is exactly what candidate
`nexo-settle` (§3.3) exists to formalise.**

---

## 3. THE FOUR CANDIDATES — specs awaiting the bench

**These are SPECIFICATIONS, not shipped patterns. None may be applied to the site before the owner
rules on the bench (§4).** Applying one early is a violation, not initiative.

### 3.1 `nexo-drift`
- **Purpose:** give the AmbientMap dot grid a slow life so the field reads as atmosphere rather than
  wallpaper, without competing with text.
- **Sketch:** per-cell offset opacity/transform cycle across the grid, scheduled per cell in Linear's
  `grid-dot-{r}-{c}` manner, **amplitude far below Linear's**. Pure CSS, per-cell
  `animation-delay`; no JS scheduler.
- **Duration:** 2400–3200ms per cycle.
- **Applies to:** AmbientMap, all tones.
- **Degradation:** static grid, **current appearance exactly** — the map already looks finished.
- **Budget note:** the risk is element count, not duration. Hundreds of independently animating cells
  is a compositor-layer problem; the spec must cap animated cells and prove the cap on the bench, or
  decline (§1.3) rather than thin the effect.

### 3.2 `nexo-shape`
- **Purpose:** when the nav panel moves trigger-to-trigger, interpolate its SIZE instead of swapping
  it, so the chrome reads as one object that reshapes.
- **Sketch:** `clip-path` + `height` interpolation at 200ms with contents at 250ms, off the existing
  Radix `data-state`.
- **Duration:** 200ms shape / 250ms contents — inside the ≤250ms nav ceiling.
- **Applies to:** desktop nav panel.
- **Degradation:** instant swap, no interpolation — today's behaviour.
- **Budget note:** `height` is a layout property and animating it is normally banned (§1.4). This
  candidate is the **explicit exception under test**, and the bench must measure it: if it costs
  layout on every frame it must be re-authored on `clip-path`/`transform` alone or dropped.
  **Recommended first** — highest value per unit of risk (`DESIGN_RESEARCH` §D20d).

### 3.3 `nexo-settle`
- **Purpose:** formalise the play-once arrival grammar already re-authored four times (§2.6) into one
  named primitive.
- **Sketch:** a single armed-attribute + IO + staggered-delay pattern, parameterised by stagger step
  and distance; components opt in rather than re-implementing.
- **Duration:** ≤300ms per element.
- **Applies to:** any IO-gated arrival.
- **Degradation:** final frame, immediately.
- **Budget note:** the cheapest of the four — it removes code rather than adding it. The work is
  API design, not performance.

### 3.4 `nexo-accent-card` — **carries S-001, the owner directive**
- **Purpose (original):** a local dark card on a light section (from Stripe `/enterprise`) so interior
  pages can raise emphasis **without spending a fourth ink chapter** against the tonal map.
- **Purpose (extended by S-001):** this candidate is also the home for **card motion**.

  > **S-001, the owner's ask, verbatim:** *"cards that move, a lot of animation but not noisy,
  > implemented smartly."*

- **Sketch:** static accent card first — the full treatment with no motion at all — then motion added
  as a separate additive layer: intent-driven surface response (arrival, state change, hover), each
  surface moving a little, staggered.
- **Duration:** ≤300ms, ease-out, per §1.6.
- **Degradation:** the static accent card, which is the original candidate and complete on its own.
- **Binding constraint set (all four, none optional):**
  - **D20 performance bar** is a ceiling. "A lot of animation" is bounded by it.
  - **Motion-safe architecture** (§1.1): the static end-state ships first.
  - **Static-complete** (§1.2): under reduced motion the cards are finished compositions, never
    frozen mid-animation.
  - **`nexo-brand` §5 ceilings** (§1.6): transform/opacity only; never from `scale(0)`; grouped items
    stagger; **read-first copy is not animated**; zero CLS.
- **The hard part, named:** *"not noisy" is a design problem, not a volume knob.* The honest reading
  of the directive is **density of craft, not density of movement** — many surfaces that each move a
  little, driven by intent, never ambient jitter competing with the text. If a loop can be tracked by
  eye it is too fast.
- **Note:** the original candidate was **static, no motion**. S-001 is genuinely new scope layered on
  top of it, and the bench must show the static card and the moving card as separate readings.

---

## 4. THE BENCH PROTOCOL

**Candidates are RENDERED for owner reaction before any site application.** No candidate becomes a
site pattern by argument, by taste, or by an implementer's confidence.

The protocol follows the colour benches (Tasks #24/#26), which are the precedent that worked:

1. **One self-contained page**, opened from `file://`, no build step.
2. **Identical fragments across candidates**, with only the candidate layer varying — so the
   comparison is of the mechanism, not of the content.
3. **Each candidate shown in BOTH states**: motion-on and reduced-motion, side by side. The static
   reading is not an afterthought; for `nexo-accent-card` it is half the deliverable.
4. **Budget measured and printed on the page** — element counts, layer counts, frame cost — not
   asserted in prose. A candidate that cannot show its numbers has not been benched.
5. **The flagship surface is included.** The colour bench's ink hero earned its place by failing
   immediately on a register nobody had tested; a motion bench must likewise include the surface
   most at risk, not only the flattering one.
6. **The owner picks.** *"None of these"* is a legitimate answer, and so is *"quieter"*.
7. **The pick becomes the implementation spec for a separate full-cube task**, which re-verifies the
   guard, the static-complete state, and the performance bar on the real pages.

**Nothing ships from a bench.**

---

## 5. VERIFY CHECKLIST (any motion change)

- `npm run qa:static` green — the motion guard is in it, and it names file and line on failure.
- `npx tsc --noEmit` TRUE 0; `npm run build:check` green.
- **Full cube green.** The reduced-motion profile is the structural check that the static state is
  complete on every route in every engine.
- **Human-eye A/B in BOTH states** at 1440 and 390, screenshots viewed — motion-on and reduced-motion,
  before and after. Describe any pixel that moved and justify or fix it.
- The static state equals the reduced-motion rendering. If they differ, the base is not complete.
- Reduced-motion shows **finished compositions**, never frozen mid-animation frames.
