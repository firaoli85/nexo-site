# DESIGN SUGGESTIONS — the register

**This file is the ONLY door for design input from outside a build task** (D24). Owner ideas, Claude's
own proposals, external AI reviews, user feedback — all of it lands here first.

**Nothing is implemented directly from a suggestion list.** Register first; impact-check at adoption
time. A suggestion that sounds obviously right is exactly the kind that collides with a shipped fix,
because the person making it has not read the ledger.

### Schema

| Field | Meaning |
|---|---|
| **ID** | `S-nnn`, stable forever. Cite it in FIXLOG entries and prompts. |
| **Source** | Who/what proposed it, and **what they were looking at** — a review of the live V1 site is not a review of v2. |
| **Date** | When it arrived. |
| **Disposition** | One of the six below. |
| **Impact** | Collisions named, citing D-numbers and invariants. This is the field that does the work. |

### Dispositions

| Disposition | Meaning |
|---|---|
| **ADOPTED** | Accepted and scheduled. Names the workstream. |
| **ALREADY-LAW** | Already decided and/or shipped. Cites the D-number. No work. |
| **TEST-FIRST** | Plausible, but it must be measured or benched before it touches code. Names the bench. |
| **LATER** | Right idea, wrong time. Names what has to be true first. |
| **REJECTED** | Declined, **with the receipt**. Includes the evidence, so it is not relitigated. |
| **OWNER-DIRECTIVE** | The owner has decided. Not a suggestion — a scoped instruction. |

---

## S-001 — Rich card motion

- **Source:** Owner · **Date:** 2026-08-19 · **Disposition:** **OWNER-DIRECTIVE**
- **The ask, verbatim:** *"cards that move, a lot of animation but not noisy, implemented smartly."*
- **Scope:** **W5 part 2.** The `nexo-motion` candidate set must include a **card-motion pattern**; it is
  not currently among the four D20d candidates (`nexo-drift`, `nexo-shape`, `nexo-settle`,
  `nexo-accent-card`), and `nexo-accent-card` is a *static* treatment, so this is genuinely new scope.
- **Impact / constraints — all three are binding, none is optional:**
  - **D20 performance bar** is a ceiling, not a target. "A lot of animation" is bounded by it.
  - **Motion-safe architecture** (W5's own deliverable): every candidate ships its **static end-state
    first**, so the card is complete and correct before any motion is added.
  - **Reduced-motion is static-complete** (nexo-brand §0/§5). Under `prefers-reduced-motion: reduce`
    the cards must be finished compositions, not frozen mid-animation.
  - **nexo-brand §5 ceilings:** transform and opacity only; page content ≤ ~300ms ease-out; entrances
    rise from `scale(0.95)`/`translateY`, never from `scale(0)`; grouped items stagger rather than
    firing at once; **read-first copy is not animated**.
  - **"Not noisy" is the hard part and it is a design problem, not a volume knob.** The honest reading
    of the directive is *density of craft*, not density of movement — many surfaces that each move a
    little, driven by intent (arrival, state change, hover), never ambient jitter competing with the
    text. If a loop can be tracked by eye it is too fast (D20d governing rule).
  - **CLS stays zero** (nexo-brand §0). Card motion must not reserve or release layout space.

---

## S-002 … S-010 — External AI design audit

> **CRITICAL CONTEXT, AND IT CHANGES MOST OF THE DISPOSITIONS: this audit reviewed the LIVE site,
> which is `main` @ `f0de3c9` — V1.** It is not a review of `v2`. Several items it raises were decided
> or shipped on v2 weeks of work ago (D21 type system, D23 perception floors, the F1 nav seam), and at
> least one is a *collision* with a shipped field fix. The observations are still useful; the
> prescriptions must be read against the ledger, not applied.
>
> **Source:** External AI design review · **Date:** 2026-08-19 · reviewing **V1 (`main`)**

### S-002 — Monospace for all system data
- **Disposition:** **ALREADY-LAW (D21)**
- **Impact:** D21's Modular Type Law already establishes IBM Plex Mono as the accent layer for
  stat lines, eyebrows and codes, implemented in Task #14 and guarded by
  `scripts/qa/static-type-check.mjs`. **Applying it to the full breadth of system data is deliberate
  P4 scope**, not an oversight — the mono layer was introduced where it earns its keep first. No work
  now; the breadth question belongs to the P4 component pass.

### S-003 — Tight heading line-height (~1.1–1.2)
- **Disposition:** **ALREADY-LAW (D21), verify at P4**
- **Impact:** The type system owns line-height and tracking; hero and section headings already run
  tight with bench-measured tracking (hero −0.030em, heading −0.022em). **The per-page verification is
  a legitimate P4 task** — "the system says so" is not the same as "every page renders it". No change
  to the token block from this suggestion.

### S-004 — Standardise status pills
- **Disposition:** **TEST-FIRST** → P4 component pass
- **Impact:** Touches **nexo-brand §3 colour roles** and the service-level palette, which is a
  *dedicated* palette outside the status hues and must stay that way. Standardisation must not collapse
  service-level chips into status chips — they mean different things. Also constrained by the
  colour-alone rule: every pill pairs colour with an icon + label. **Bench before code.**

### S-005 — Remove drop shadows; crisp 1px borders only
- **Disposition:** **REJECTED as a blanket rule** · card-variant portion **TEST-FIRST**
- **COLLISION — this is the one that matters:** the **F1 nav seam shipped in Task #20 is a
  `box-shadow: 0 1px 0` hairline**, and it exists because the scrolled-nav edge was **invisible on the
  owner's own laptop** — a field failure (FO-2). It is guarded by **I21**, which asserts a painted
  local extremum at four device scale factors. Applying "no shadows" as a rule would re-open a closed
  field defect and fail the invariant. **The suggestion is right that the shadow is not decoration —
  it is load-bearing, which is precisely why it stays.**
- **What survives:** card shadows are a separate, genuine taste question (P3/P4). Registered as
  **TEST-FIRST for ONE card variant** — borders-only, benched against the current treatment, judged on
  the D23-hardened palette where `--border` is now `#c3c9d5` rather than the near-invisible `#ebedf1`
  the audit would have seen on V1.

### S-006 — Thicker / more vibrant route line vs the grid hairlines
- **Disposition:** **TEST-FIRST** → W5
- **Impact:** A **D23 hierarchy** question: the ambient grid and the route line are deliberately
  different tiers, and the grid was hardened in Task #18. Raising the route line changes the relationship
  between them, so it is benched, not nudged. **I21 is unaffected** (nav seam, not the route). Note the
  audit saw V1's *pre-hardening* grid, so the gap it perceived is already partly closed.

### S-007 — 1px bright accent line at light→ink transitions
- **Disposition:** **TEST-FIRST** · **the cyan is rejected outright**
- **Impact:** Touches the **nexo-brand §1 tonal law**, which governs how registers meet — including the
  standing rule that ink→white never happens without a tint buffer. **Cyan is off-palette and is not a
  candidate**; if this is tested it is tested as a **mint** variant drawn from `--accent-on-ink`.
  Any specimen goes to the colour bench.

### S-008 — Grid lines hurt small-text readability on weak displays
- **Disposition:** **VALID CONCERN** — folded into the D23 floors watch
- **Impact:** This is the one item whose *instinct* matches how this project already works: it is a
  perception claim about weak hardware, which is exactly what D23's floors govern. Folded into the
  **floors-only-rise** watch. **Any proposed specimen goes to `docs/color-bench/index.html` and is read
  on the operative device — never straight to code.** Note the tension to resolve honestly: D23 *raised*
  ambient contrast because things were invisible; this asks to lower it because things are noisy. Both
  readings come from real devices, so the bench arbitrates, not argument.

### S-009 — Duotone / halftone treatment for founder & team photography
- **Disposition:** **LATER**
- **Impact:** **D19 permanently bans stock people-photography** and defers real photography until real
  operations exist, at which point it is added as truth. There is no photograph to treat yet. Also
  gated by **§7.2 no-company-theater** (no team pages, no founder name/photo — `SITE.FOUNDER_REF`
  only). The treatment idea is recorded for the day real operational photography exists.

### S-010 — Soft gradient fade behind critical text blocks
- **Disposition:** **TEST-FIRST** → colour bench
- **Impact:** Collides with **nexo-brand's flat aesthetic** ("no glow/bloom/gradient"), so it needs an
  explicit ruling rather than a quiet addition. The legitimate underlying problem — text over the
  AmbientMap — is already solved by the **text-sovereignty** rule (effective stroke opacity low enough
  that body text over a stroke still clears AA, verified 6.4:1+). If a fade is tested it is tested as a
  **mask**, not a gradient fill, and it must not change any measured contrast pairing.

---

## S-011 — External FO-3 theory: `preserveAspectRatio="none"` + `translate(-50%,-50%)`

- **Source:** External AI analysis of FO-3 · **Date:** 2026-08-19 · **Disposition:** **EVALUATED-REJECTED**
- **The prescription:** restore `preserveAspectRatio="none"` on the route SVG and centre the van with
  `translate(-50%, -50%)`, on the theory that a viewBox/CSS-pixel mismatch caused the desync.
- **THE RECEIPT — five independent pieces of evidence, each sufficient on its own:**
  1. **V1 shipped WITH `preserveAspectRatio="none"`, and the FO-1/FO-3 family existed then.** The
     prescription is to restore the exact condition present when the defect was first reported.
  2. **Task #19 removed it deliberately** and pixel-sized the SVG so the CTM is the identity matrix —
     a stretch is not representable. **I20 asserts that identity by name** and fails with an
     instruction if anyone reinstates `preserveAspectRatio` or `h-full`/`w-full`.
  3. **Task #21 measured the stretch mechanism** the theory depends on: it is a **purely horizontal**
     shear bounded near **32px** even at a 200px width error, against the **~2900px vertical**
     divergence actually observed. Off by two orders of magnitude, and on the wrong axis.
  4. **The field probe printed `errX: 0.0`** — the two renderers agreed *perfectly* horizontally, which
     is the opposite of what a horizontal stretch produces. (The `−12` cited elsewhere in that analysis
     is the **designed ±12px lane offset**, recorded in the Task #19 architecture.)
  5. **The cited `vvScale: 1.236` appears in no probe output** we have. The probe returned
     `vvScale: 1`.
- **The instinct is honoured, and exceeded.** The theory's real insight — *there should be one mapping,
  not two* — is correct, and **Task #22 implemented a stronger form of it**: the van is now a `<g>`
  inside the same SVG, in the same user space, positioned from the same number in the same frame.
  There is no second renderer left to disagree, so there is no mapping to reconcile.
- **Purpose of this entry:** so that a future session reading a plausible external theory does not
  relitigate a question that has five measurements against it. **Do not re-open without new field
  evidence from a build ≥ Task #22.**
