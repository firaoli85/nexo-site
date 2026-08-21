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
- **STATUS 2026-08-21 (D28):** **ANSWERED IN STRUCTURE, PENDING N4.** D28 adopted B2's card structure and ruled the
  interaction: **glowing neon accent borders, never heavy fills**, with geometric utilitarian icons. That is the concrete
  form S-001 asked for. **It is answered if N4 sings** — the Noir Bench renders two border treatments (hairline-glow and
  2px-glow) and the owner picks. **Note the live law collision recorded there:** `nexo-brand` §5 bans glow/bloom ON
  OBJECTS, and a neon accent border is an object glow, so adopting N4 amends §5 for the signature/chrome registers.
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

---

## S-012 — GitLab as colour + starting-design reference

- **Source:** **Owner taste event** — `about.gitlab.com` named directly · **Date:** 2026-08-19
- **Disposition:** **TEST-FIRST** → rendered as three directions in `docs/color-direction-bench/index.html` (Task #24)

**The owner's reasons, cleaned from voice with the meaning preserved:**

- Loves the **pink/red/fire gradient** and the way the combination works together.
- Loves the **simplicity** — the menu and the hero specifically.
- Loves the **dark cards**.
- **Inspiration, not copy** — stated explicitly: *"whenever you like something, be creative, give
  credit, and improve it."*
- **The thesis, which is the substantive part:** the **warm + technical middle ground** fits a company
  that is *neither fully medical nor fully technology*. Medical-blue would claim clinical care we do
  not provide; pure developer-tool aesthetics would disown the care side. Warm-plus-technical is a
  positioning argument expressed as colour, and it deserves to be tested rather than admired or
  dismissed.

**THREE-LAYER SPLIT — recorded so the layers can be adopted independently.** "GitLab" is not one
decision, and collapsing it into one would force an all-or-nothing ruling on things that have very
different costs:

| Layer | What it is | Independent cost |
|---|---|---|
| **Atmosphere** | The warm gradient field behind the hero | Highest reward, lowest structural risk — it is a background layer, not an identity change |
| **Composition** | Hero simplicity, nav structure, spacing | Largely orthogonal to colour; can be adopted with the jade palette untouched |
| **Card treatment** | The dark-card system | Already partly ours (the ink register, nexo-brand §1); the question is breadth and treatment, not invention |

**Impact — named per D24, and one collision is not resolvable by taste:**

- **nexo-brand §1 tonal law is under review by owner ruling**, which is legitimate — §1 is a decision,
  not a physical constraint, and the owner may revise it. It is not being *violated*; it is being
  *questioned*, and the bench is the instrument.
- **D23 floors are PORTABLE and bind every direction.** The separation laws (A06/B06/E1-07/E2-05) were
  measured as *perception* thresholds, not as jade-specific values. Any direction must honour the
  equivalent deltas, and **floors-only-rise** applies whatever the hue.
- **STATUS-COLOUR SEMANTICS IS THE REAL COLLISION.** Red means *refused*, amber means *deadline*. A
  warm brand field puts the brand in the same emotional register as the alarms. **This cannot be
  settled by argument, so the bench renders a real status row inside every direction** — including the
  warm pivot, unflinched — so the cost is *seen* rather than asserted.
- **D21 type is untouched.** The bench dogfoods the shipped type tokens.
- **The Railway receipt (§13) is refined, not discarded.** A new ruling would be a reversal with a
  receipt, per the founding law.
- **W2 hero concepts: synergy.** An atmosphere layer feeds that work rather than competing with it.

**Nothing is adopted by this entry.** The bench produces a ruling (**D25**) — adopt, synthesize, or
hold. Until then the hardened jade palette remains law.

---

## S-013 — Containerize the dev environment

- **Source:** Owner · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE / LATER**
- **The ask:** run development in a container so the build environment is identical on every machine.
- **Why it came up:** the owner syncs the working folder across three machines with Syncthing,
  including `.next`, `node_modules` and `.git`. That is a live mechanism for stale and mixed builds and
  is the most likely contaminant of two earlier field rounds (see D26 and `docs/FIELD_OBSERVATIONS.md`).
- **Registered for POST-LAUNCH evaluation, and the immediate problem is already solved without it.**
  D26 ships a committed `.stignore` excluding `.next`, `node_modules`, `.git` and `out`, which Syncthing
  reads from the folder root, so every machine is protected automatically after a `git pull`. That
  closes the contamination path today at zero cost.
- **Impact when it is evaluated:** containerization is a real improvement for reproducibility, and it is
  also a change to how every future task builds, tests and runs the cube. It touches the QA harness
  (`scripts/qa/run.mjs` spawns a local server), the `NEXT_DIST_DIR` build-check seam, and the deploy
  lane (Coolify, per D14). **Not a drop-in.** It belongs after launch, when the build surface is stable
  and a week of friction costs nothing.

---

## S-014 — Owner palette harvest

- **Source:** **Owner**, five hexes supplied directly · **Date:** 2026-08-20
- **Credit, per the owner's own take-credit-improve rule:** the atmosphere *technique* these colours
  are poured into is GitLab's, read from their CSS and dissected in `docs/DESIGN_RESEARCH.md §14a`.
  The hues are the owner's; the construction is credited.

| Hex | Role proposed | Disposition |
|---|---|---|
| **#f58f9c** | rose, atmosphere anchor | **ADOPTED as the atmosphere anchor (D25)** |
| **#f7929a** | rose companion, same family | **ADOPTED** alongside it, used as the low-left companion sun |
| **#8d6fd3** | violet | **TEST-FIRST**, benched as an atmosphere ingredient only (T2) |
| **#332750** | deep violet-ink | **LATER / TEST-FIRST** — ink-accent candidate, unadopted |
| **#522a22** | deep warm-brown ink | **LATER / TEST-FIRST** — ink-accent candidate, unadopted |

**The owner's stated law, recorded verbatim in D25 because it is the constraint that makes the whole
direction safe:** *warm/pink cannot be an emergency-adjacent signal; incorporate it in backgrounds.*
That single sentence is why D2 was rulable at all — it converts warmth from an identity question into
a **background-register** question, which leaves the alarms and the jade accent untouched.

**Impact notes:**

- **The rose pair is adopted as ATMOSPHERE, not as a token with meaning.** It never colours an
  interactive surface, a status, or a piece of text. That is D25's whole shape.
- **Violet carries a real collision risk and is deliberately held back.** `--svc-wheel #6d28d9` already
  owns violet *semantically* in the service-level palette (wheelchair), and `nexo-brand §3` keeps that
  family deliberately outside the status hues. In T2 the violet sun is held **below** the rose in alpha
  precisely so it reads as light rather than as a colour. If the owner picks T2, the implementation
  task must verify that a service-level chip still reads as a *chip* over a violet-tinged field.
- **The two deep tones are unadopted and were not benched.** They are ink-accent candidates, and the
  ink register turned out to be the delicate one (see the tuned bench's flagship finding: any glow on
  ink costs the card its fill separation). Introducing a *third* dark value into that register is a
  separate question and should not ride along with a temperature pick.
- **Nothing here is a site token.** These are candidates until the warm-atmosphere implementation task
  ships them with a full cube and AA re-verification.

---

## S-015 — Bold, unmistakable nav (D27a)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → TEST-FIRST via the Grand Bench (B1)**
- **The ask:** the nav becomes **bold and unmistakable** — sleek but with **heavy presence**, liquid-glass
  weight, its **boundary perceivable at a glance**, and **colour no longer restricted to black/ink**.
- **Impact:**
  - **Supersedes the FO-2 hairline question rather than reopening it.** The seam measures painted and I21
    is green at a 1.5 floor; it simply reads invisible to the owner. That is the *subtle approach* failing
    the owner's bar, not a defect. **I21 remains the floor** — a bold nav must still pass it, and may not
    be used as an excuse to drop it.
  - **Collides with the single-dark-register rule** (`nexo-brand` NAV V2 / §6.1), which deliberately
    deleted theme-flipping. "Colour no longer restricted to ink" reopens that as an owner call; the bench
    must show a non-ink direction against the **worst case the register was built for: dark glass over a
    pure-white section**.
  - **D23 floors bind**, and `--nav-glass` alpha 0.90 was calibrated for that worst case. Any lighter or
    more transparent surface re-derives the on-nav text ratios from scratch.
  - **I17 (magic-line tracking) and I21 must stay green** through whatever ships.

---

## S-016 — Boxed-destination nav panels (D27b)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → TEST-FIRST via the Grand Bench (B1)**
- **The ask:** each destination becomes a **designed box with its own shape/representation** — **never a
  text list**. Railway is the named reference.
- **Impact:**
  - **Dissected live in `DESIGN_RESEARCH` §15**, so the pattern is now measured rather than admired.
  - **Folds `nexo-shape` in** (`nexo-motion` §3.2): Railway's panel **animates its height between
    triggers** — measured 266px → 302px over ~120ms. Our candidate was speculative; it now has a
    reference implementation.
  - **Collides with the W1 "REJECT: 33-links-per-panel density" ruling only in appearance** — boxes are
    *fewer, larger* destinations, which is the opposite of density. No collision in substance.
  - **Iconography must come from our own line-art language**, not borrowed marks. Railway paints its
    featured cell with a CSS `background-image` asset; **D20 prefers zero new assets**, so ours should be
    inline SVG.

---

## S-017 — Hero: console demotes, signature animation leads (D27c)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → sequenced AFTER the Grand Bench (W2)**
- **The ask:** the dispatch console **moves down-page**; a **big signature animation leads** the hero.
  Activates D19/W2 with priority.
- **Impact:**
  - **Deliberately sequenced last.** The signature piece must speak the braid (D27f) and ambient (D27e)
    language, and those are what the bench establishes. Building the hero first would freeze a vocabulary
    that has not been chosen — the same mistake as picking a colour before the ink register was tested.
  - **W2's constraints box binds unchanged**: perf bar, static-complete, decline-don't-degrade, and a
    named art-directed static resting state. **Never put the gamble in a hero.**
  - **Demoting the console is a real information-architecture change**, not a move: the console currently
    carries the LCP content and four proof scenes. Where it lands, and what leads instead, is a
    content decision as much as a visual one.

---

## S-018 — Mobility cards: the switching service-level card set (D27d)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → TEST-FIRST via the Grand Bench (B2)**
- **The ask:** the three service levels rendered as **beautiful switching cards** in the GitLab dark-card
  register. **This is S-001's concrete form** — the card-motion directive finally has a subject.
- **Impact:**
  - **THE LEVEL COUNT IS LAW AND DOES NOT MOVE.** `nexo-brand` §7.1: **three** service levels
    (ambulatory / wheelchair / stretcher), and **bariatric & two-person assist is a MODIFIER, never a
    fourth level.** A four-card set would be a copy-gate violation, not a design choice.
  - **Never claim platform enforcement** of assist/bariatric; it is an operational offering.
    **Dignity language is mandatory** — needs-based, never size-as-spectacle.
  - **Status/alarm semantics are untouched**: jade owns interaction and status; the D25 warm palette is
    atmosphere-only and **may not enter a card's status affordance**.
  - **S-001's hard part carries over verbatim:** *"not noisy" is a design problem, not a volume knob* —
    density of craft, not density of movement.
  - **Zero CLS**: a switching card set must not resize its container between states.

---

## S-019 — Ambient meaning: the background must state its purpose (D27e)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → TEST-FIRST via the Grand Bench (B4)**
- **The ask:** background lines must read as an **intentional system model** — aggressive, legible,
  semantic — **never unexplained decoration**.
- **Impact:**
  - **This is a redesign of `AmbientMap`, not a tuning of it.** The current map is deliberately abstract:
    a dot grid, three winding routes, node pins, two glyphs. It was built to be *atmosphere*, and the
    ruling is that atmosphere without meaning is not enough.
  - **Railway's answer is the strongest reference we have** (§15c): their section background **is the
    product's own canvas** — dotted field, real service nodes, connectors, live status. Legible because
    it depicts the actual system.
  - **Text sovereignty is not negotiable** (`nexo-brand` §6.1): a more legible background is a *louder*
    background, and body text over it must still clear AA on **painted pixels**. **I22 does not exist
    yet** (registered W9 debt), so this needs a manual painted-pixel pass per Task #27's method.
  - **S-008 small-text legibility binds** any labels the model introduces.
  - **A map that names real places re-enters the NO-REAL-INSTITUTION-NAMES gate** (§7).

---

## S-020 — The braided route (D27f)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → TEST-FIRST via the Grand Bench (B3)**
- **The ask:** evolve the single route line toward a **braided multi-strand motif**, weaving rose/violet
  (D25) with the jade lead.
- **Impact:**
  - **The route is the most invariant-protected object on the site.** **I20** asserts the van rides the
    line (line-claim + zoom + dpr legs, all three engines); **I15** asserts zero decorative overlap with
    text and the footer. A braid changes the geometry both invariants measure.
  - **The LUT architecture is the constraint that decides feasibility** (`nexo-motion` §2.2): the van is
    positioned from a 256-point lookup table sampled off **one** path. A braid means either **one lead
    strand stays canonical** (the van rides it, the others are decorative) or the LUT must be re-derived
    — the first is far cheaper and is the recommended framing for the bench.
  - **D25 binds the colour**: rose and violet are **atmosphere, semantically silent**. A strand that
    *carries meaning* would give warmth a job, which D25 forbids. Strands must be visual, not semantic.
  - **Perf**: N strands is N× the path length drawn per frame; `stroke-dashoffset` on several long paths
    is not free.

---

## S-021 — Every page gets per-page atmosphere (D27g)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → LATER (P4 per-page work)**
- **The ask:** **no page ships as bare paper.** Per-page atmosphere/background attention in P4.
- **Impact:**
  - **Already half-scheduled**: Task #27 shipped the D25/T2 atmosphere on exactly two surfaces and marked
    **wider rollout as P4 per-page work** in both the CSS and the components. This directive raises that
    from "rollout" to "every page owes a designed background."
  - **Each page owes its own painted-pixel pass** before wearing the treatment — that is written into the
    `.atmo-*` comments already.
  - **Depends on B4** (ambient meaning): rolling the *current* ambient system to every page would
    multiply exactly the decoration D27e rejects. **Order matters — meaning first, rollout second.**

---

## S-022 — The intentionality doctrine (D27h)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE → ALREADY-LAW in spirit, now explicit**
- **The ask:** every visual element must be able to **state its purpose**. *"Just a nice line"* is
  **banned**.
- **Impact:**
  - **This is a review standard, not a build task** — which makes it the most far-reaching directive in
    D27. It applies to every future bench candidate and every audit.
  - **It is the general form of the rule the codebase already follows in comments**: nearly every rule in
    `globals.css` says why it exists. D27h makes that obligation visual as well as textual.
  - **Practical test at bench time:** for each element in a candidate, one sentence of purpose. If the
    sentence is "it looks nice", the element is decoration and must earn its place or be cut.

---

## S-023 — "Liquid" as the nav's surface quality

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **OWNER-DIRECTIVE (qualitative) → TEST-FIRST via B1**
- **The ask:** the nav should have **liquid-glass weight** — a surface with body, not a flat film.
- **Impact:**
  - **We already ship colored liquid glass** (`--nav-glass`, jade-cast, alpha 0.90, `backdrop-filter:
    blur(12px)`) — so this is a request for **more of a quality we have**, not a new material.
  - **Opacity, not blur, guarantees contrast** (`nexo-brand` §4). "More liquid" must not become "more
    transparent": blur stays < 20px and the alpha floor is a contrast decision.
  - **Railway is NOT the reference for this one** — measured, their bar has **no backdrop-filter at all**
    (§15a). Whatever "liquid" means here, it is ours to define.

---

## S-024 — Per-section animation on /platform (dispatch, claims, billing scenes)

- **Source:** **Owner**, the Boldness Ruling (D27) · **Date:** 2026-08-20 · **Disposition:** **LATER — P4 per-page work, after the Grand Bench**
- **The ask:** the platform page's sections each get their own animated scene — dispatch, claims,
  billing.
- **Impact:**
  - **Right idea, wrong time.** It is three signature pieces, and the site does not yet have an agreed
    motion vocabulary to build them in — that is what the bench and W2 settle.
  - **The perf bar is the binding constraint**, not the design: three scene-scale animations on one route
    must still land inside ≤150KB JS and ≤1200ms DCL, on the default profile.
  - **`/platform` already reuses `ProductDemo` in its hero** (Stage 8) — a decision that must be
    revisited alongside D27c, since the console is being demoted on the homepage.

---

## S-025 — Console glass-fill verdict: CLOSED

- **Source:** **Owner**, reviewing the Task #27 measurement · **Date:** 2026-08-20 ·
  **Disposition:** **ALREADY-LAW — the edge-carries-separation doctrine stands**
- **The finding it closes:** Task #27 measured the hero console panel's **fill** separation from the
  painted field falling **1.14 → 1.00** under the rose sun, because `--ink-glass` is a fixed alpha the
  scoped compensation does not touch.
- **The ruling:** **the owner reviewed it and the doctrine stands.** The panel's separation is carried by
  its **EDGE** by design (4.40:1 vs the painted field, 3.13:1 vs the interior — both clear of the 3:1
  WCAG 1.4.11 tier), and the hero's kin-to-kin relationship between console and field is deliberate.
  **No compensation to `--ink-glass`.**
- **Impact:** the pending-owner item opened in Task #28 is **closed by this entry**. Do not re-raise the
  1.00 figure as a defect; it is a measured consequence of an intentional doctrine, on the record.

---

## S-026 — Remove the `framer-motion` package

- **Source:** **Claude**, Task #28 conversion finding · **Date:** 2026-08-20 ·
  **Disposition:** **ADOPTED — scheduled to ride with the first Grand-Bench implementation task**
- **The finding:** `framer-motion` is a **dead dependency**. Task #28 deleted its only two consumers
  (`Reveal.tsx`, `PageTransition.tsx`) — both unimported, one claiming in its own comment to be used by
  a `(public)/template.tsx` that does not exist.
- **Why it was not removed then:** nothing imports it, so it is tree-shaken and costs users **zero**;
  and a dependency decision is the owner's, not a side effect of a motion refactor.
- **Why it rides with the first implementation task rather than alone:** removing a package is a
  `package.json` + lockfile change that wants a build and a cube to prove nothing regressed. Attaching
  it to a task that is already paying that cost is free; a standalone task for it is not.
- **Impact:** none at runtime. Install size and dependency-surface only. **If any bench candidate turns
  out to want a real animation library, this entry is the place to reopen the question** — but note the
  standing rule: **no new project dependencies without approval**, and the motion architecture is
  currently CSS-first by design.

---

## S-027 — Braid motion: the van rides the weave

- **Source:** **Owner**, amending D27f · **Date:** 2026-08-21 ·
  **Disposition:** **OWNER-DIRECTIVE → amends B3's spec in this task (#30)**
- **The ask, in the owner's own terms, meaning preserved:**
  - The braid is **scaled to be SEEN** — not a hairline motif, a structure with presence.
  - The strands are **genuinely interwoven** — *"a tangle of snakes, you don't know which is
    which"*. Not three parallel lines with a decorative crossing; a real weave.
  - **The van rides the weave serpentine / roller-coaster style** — arcing through the twists,
    passing **OVER** some strands and **BEHIND** others. **Occlusion is the point.**
  - A **van livery colour-change candidate**, so the van pops against a busier field.
  - Framing that decides the whole candidate: **the braid is "a platform for the van to move
    around"** — the braid exists to be ridden, not merely to be looked at.
- **Impact:**
  - **This amends B3 rather than replacing it.** The #29 spec recommended that **one strand stays
    canonical** so the van's LUT samples a single path. That call **survives** — see the
    reconciliation in `GRAND_BENCH_PLAN` B3: **the canonical path IS the weaving path.** The van
    still rides one path; that path simply became serpentine.
  - **Occlusion is a paint-order problem, not a geometry problem.** Strands are segmented, and the
    segments that should cross in FRONT of the van are painted after the van group. No z-index, no
    second surface, no compositing trick — Task #22's single-raster-surface law is preserved.
  - **I20 keeps its meaning exactly.** The invariant says *the van rides the line*. It still does.
    The line got interesting.
  - **I15 (decorative overlap) is the real risk**, not I20: a braid scaled *to be seen* occupies
    more horizontal space than a hairline, and I15 asserts zero overlap with text and the footer.
    B3 must state the width budget.
  - **D25 binds the colour and is not negotiable by enthusiasm:** rose and violet are **atmosphere,
    semantically silent**. A strand may not come to *mean* anything — no "the rose strand is
    claims". Strands are visual.
  - **The livery candidate collides with status semantics and must be checked, not assumed.** The
    van currently reads white-bodied with an ink outline. Any new livery must not land in the
    refused-red or timely-amber space, and must never be mistaken for an ambulance (§6.1).
  - **Per-frame cost rises with strand count**, and a braid drawn at visible weight is more path
    length than the current single line. B3 prints the reasoning.

---

## S-028 — `nexo-drift`: REJECTED

- **Source:** **Owner**, Grand Bench reading (D28) · **Date:** 2026-08-21 · **Disposition:** **REJECTED, with the receipt**
- **The evidence, which is why this is not relitigable:** B5 rendered drift **beside a static control of the same field**,
  deliberately, because an ambient animation is seen *continuously* and that is past the far end of the frequency scale
  where the guidance is to reduce or remove. **The static field read better.** B4-d2's dispatch-network model then made
  drift redundant outright: a background that means something does not need to move to earn attention.
- **Impact:** `nexo-motion` §3.1 keeps the spec on record as **rejected**, not pending. **`nexo-settle` is ADOPTED** as the
  arrival grammar and replaces four hand-rolled implementations. **Flag any resurrection of drift as a violation** unless
  the owner reopens it explicitly.

---

## S-029 — The tech-noir brand thesis (D28)

- **Source:** **Owner**, verbatim, at the Grand Bench reading · **Date:** 2026-08-21 · **Disposition:** **OWNER-DIRECTIVE → law as D28**
- **The thesis:** *"Nexo Access is fundamentally a medical transportation company, but our backbone is pure technology…
  trust through a clean, highly professional interface… aesthetic like a modern, high-end developer tool or cloud platform
  (Railway-class)… minimalist, modern, with a very subtle Blade Runner/cyberpunk edge… practical medical transport made
  effortless through advanced routing tech."*
- **Why it is the most useful thing the owner has said about the visual system:** it resolves the tension that D27 opened.
  "Too quiet" did not mean "louder"; it meant **the technology was not visible**. Noir is not a style pick here, it is the
  argument that the routing engine is the product.
- **Cross-refs:** **S-015/S-016** (nav) → B1(i) adopted · **S-018/S-001** (cards) → structure adopted, neon borders ruled ·
  **S-019** (ambient) → Direction 2 adopted · **S-020/S-027** (braid) → route scale, mint active line, livery B ·
  **S-028** (drift) → rejected · **S-021** (per-page atmosphere) → still LATER, and now downstream of the D25 fork.
- **THE GUARDRAIL IS THE LOAD-BEARING WORD.** *Subtle.* Noir owns the **signature and chrome** registers. **D18
  deep-reading surfaces stay clean** — a provider reading credentialing requirements is not reading a cyberpunk page.
  **Neon never carries or neighbours alarm semantics**; red and amber are untouched.
- **S-007 REAFFIRMED:** **cyan stays rejected.** The electric mint crafted for D28 sits at **hue 155°**; cyan begins around
  **175°**. The neon is a *jade*, and that is measurable rather than a matter of opinion.


---

## S-030 — The N-rulings: what the Noir Bench actually settled

- **Source:** **Owner**, reading `docs/noir-bench/index.html` · **Date:** 2026-08-21 · **Disposition:** **RULED — these
  are the implementation specs D28 was missing**

| # | Ruling | Value | What it decides |
|---|---|---|---|
| **N1-A** | Charcoal at **maximum recession** | `rgb(46 53 61 / 0.28)` → composites to `#bdc1c4`, **1.69:1** | Inactive strands are **background**, not structure. The floor underneath is D23's E1-07 divider tier (1.66:1), so this is the quietest legal value rather than an arbitrary one. |
| **N2-A** | **Electric mint `#2fe89a`** | hue 155°, S80 V91, **11.62:1** on ink | Precision over maximum voltage. `#00ffa3` was rejected as gaming-adjacent. |
| **N3-b** | **Pure noir** | the warm dusk removed | **This ruling reverses D25.** See the reversal receipt in the ledger. |
| **N4-A** | **Hairline ring** | 1px, no halo | The "expensive instrument" reading. Carries the **§5 amendment**: rings yes, blooms no, signature and chrome registers only. |
| **N5-b** | Ink-bold nav **over pure noir** | — | The nav and the field are the same darkness family; separation comes from the boundary, not from a temperature difference. |

- **The one thing the bench got wrong and the owner caught anyway:** N3 was built as the fork precisely because prose could
  not settle it, and the ruling came back in one sentence — ***"the warm dusk is officially dead; mint is the only light in
  the dark."*** That is the argument for rendering forks rather than describing them.

---

## S-031 — OWNER DYNAMIC-ROUTING DIRECTIVE — **DISPOSITION: SPLIT**

- **Source:** **Owner** · **Date:** 2026-08-21 · **Disposition:** **SPLIT — one half is adopted into the braid spec, the
  other half is moved to the hero signature. The split is the ruling of record.**
- **The intents, verbatim in substance:** (1) a **searching secondary line** — a strand that reads as looking for a route
  rather than following one; (2) **variable speed and physics** — the route should not travel at a constant rate, it should
  accelerate and hesitate the way a real vehicle does; (3) a **recalculation-reversal event** — the drama of a route being
  re-computed mid-journey.
- **THE SPLIT.**
  - **Speed and physics → the route-scale braid**, implemented as **path-time reparameterization**: the LUT already samples
    the canonical path, so varying the *sampling rate* along it produces acceleration and hesitation with **no new geometry,
    no second path and no extra work per frame**. It stays **scroll-obedient** (the reader's scroll is still the clock) and
    therefore stays **I20-compatible**.
  - **Searching line and recalculation drama → the W2 hero signature**, where the motion is **autonomous** (it owns its own
    clock) and **theater-only** per D30.
- **THE LAW THIS ESTABLISHES:** **the page route never self-moves under the reader's scroll.** A scroll-driven line that
  also animates on its own steals the reader's control of the page and breaks the one promise the scroll-draw makes — that
  the reader is driving. Autonomous motion is legitimate; it just does not belong on the scroll route. **Flag any
  autonomous motion on the scroll route as a violation of this entry.**
- **Why not simply build all three into the braid:** because "searching" and "recalculating" are *narrative* events with
  their own timing, and hanging them off scroll position means the story only happens if the reader scrolls at the right
  speed. The hero can tell that story properly; the route cannot.

---

## S-032 — Liquid glass at the floors — **TEST-FIRST, rendered in the Round-2 Bench (G1)**

- **Source:** **Advisor round** · **Date:** 2026-08-21 · **Disposition:** **TEST-FIRST — rendered, awaiting the owner's
  G1 pick**
- **The proposal:** a sheerer, more liquid nav glass than the shipped 0.90.
- **What is rendered:** **0.90 (shipped)**, **0.75 (D23's read floor)**, and **solid ink-bold** as a peer rather than as a
  consolation. **The advisor's 0.60 sheer tint is BELOW the floor and is deliberately not rendered** — benching an illegal
  value would invite a ruling the law already forbids, and floors only rise.
- **THE FINDING THE FRAGMENT PRODUCED, which was not the question asked:** **the glass is load-bearing for legibility, not
  decorative.** On-ink text sitting directly on the mint strand measures **1.39:1**. The same text over the bar measures
  **13.03:1** at 0.90 and **8.76:1** at 0.75, because the glass composites the strand back down to near-ink. **The bar is
  what makes the crossing legal, and nothing else is.** Where there is no bar, **the strand must clear the text column
  outright** — a hard constraint on the route-scale braid in #34, not a preference. This was confirmed the expensive way:
  at 390 the bench's own hero lede landed on a charcoal strand at **2.78:1** and had to be recomposed.

---

## S-033 — Density without motion: breathing field vs static grain — **TEST-FIRST (G2 / G3)**

- **Source:** **Advisor round** · **Date:** 2026-08-21 · **Disposition:** **TEST-FIRST — rendered against a flat control**
- **The distinction that keeps this legal, and it is a real one rather than a rename:** **S-028 rejected `nexo-drift`
  because it was per-cell opacity cycling and read as moving parts.** These are **density treatments**. **G2** is *one* slow
  field transform whose stated bar is **imperceptible-as-motion** — if you can see it move, it has failed. **G3 does not
  move at all.** A rejected candidate is not being resurrected under a new name; the mechanism is different and so is
  the test.
- **Cost, measured rather than estimated (D20):** G2 is three layered radial gradients on one pseudo-element — **zero
  bytes, one compositor layer**. G3 is a seeded **64×64 alpha-noise PNG tiled at 128px, 2.8 KB as a data URI** — zero
  requests, zero JS.
- **`feTurbulence` was NOT used.** Paper-grain filters are on the design skill's explicit ban list as an AI tell, so a
  tiled raster is the honest technique here.
- **The question printed on the bench:** *which field feels dense without feeling busy?* **The flat control is a real
  candidate** — if neither treatment beats it, flat wins and that is a legitimate answer.

---

## S-034 — Spring settle instead of ease — **ADOPTED pending the demo (G4)**

- **Source:** **Advisor round**, ratified by **D29** · **Date:** 2026-08-21 · **Disposition:** **ADOPTED pending the
  owner's G4 approval**
- **What was crafted:** a damped-spring solution sampled into a **CSS `linear()` easing** — **ζ 0.72, ωₙ 9.2 rad/s,
  620 ms, 31 stops, peak 103.8%**. A **3.8% overshoot** is a soft landing rather than a bounce; the design skill's "no
  bounce, no elastic" rule is about elastic settling, and this reads as weight arriving.
- **Zero JS, zero library.** This is the mechanism that lets **framer-motion stay dead** while still getting spring
  physics; its removal still rides **#33** and is unaffected by this entry.
- **Reduced motion:** both cards are **static-complete**. The hidden state is applied only inside the no-preference scope,
  so a reduced-motion reader never sees a hidden element and the replay control simply has nothing to replay.

---

## S-035 — Illustration noir pass — **SCHEDULED**

- **Source:** **D29** · **Date:** 2026-08-21 · **Disposition:** **SCHEDULED — not a bench question**
- D29 retires rose and violet **including the illustration accent**. The line art (morph figures, assist scene, map
  glyphs, van) therefore needs a pass to bring it onto the monochrome-plus-mint palette. **This is not a candidate for
  the owner to rule on** — it follows from the palette law — but it is real work and it is listed so it does not get lost
  between the bench tasks.

---

## S-036 — "Airy vs empty" — **ANSWERED-BY: the density candidates**

- **Source:** **Advisor round** · **Date:** 2026-08-21 · **Disposition:** **ANSWERED-BY S-033**
- The advisor asked whether the noir field reads as *airy* or merely as *empty*. That is not a separate question with its
  own answer; **it is exactly what G2, G3 and the flat control test.** Recording it here so the question is closed by the
  bench rather than re-asked in the next round.


---

## S-037 — N4-A REVERSED: the neon card borders are dead

- **Source:** **Owner**, ruling on the Round-2 reading · **Date:** 2026-08-21 · **Disposition:** **REVERSED — recorded as
  law in D31**
- **What was adopted and is now withdrawn:** **N4-A**, the 1px neon hairline ring as the mobility cards' active state,
  ruled on the Noir Bench (**S-030**) and carried into D29's §5 amendment.
- **The owner's rationale, kept because it is the useful part:** neon edges on *every* card turn the page into a
  **"laser tag arena."** That is the opposite of the "expensive instrument" reading N4-A was adopted for. **One ring is an
  instrument; six rings are a game** — the treatment did not fail on contrast or on craft, it failed on **repetition**,
  which is a thing a single bench fragment structurally cannot show.
- **What replaces it:** the cards' active state is **spring physics plus a subtle charcoal elevation** — motion and depth
  rather than colour. The spring is already adopted (**S-034 / G4**), so the replacement costs nothing new.
- **The §5 amendment is NOT repealed — it is DORMANT.** No sanctioned surface uses a neon ring today. If a future surface
  earns exactly one, the amendment already governs how (rings, never halos). **Nothing may cite it as licence in the
  meantime**, and a second surface reaching for it should be read as this same failure recurring.
- **Cross-refs:** **S-030** (the N-rulings table — N4-A's row is superseded by this entry) · **D29** §5 · **D31**.

---

## S-038 — Static grain: **PROVEN-UNADOPTED** (shelved, not rejected)

- **Source:** **Advisor round**, rendered as G3 · **Date:** 2026-08-21 · **Disposition:** **PROVEN-UNADOPTED — a working
  tool with no current application**
- **This is a third disposition and the distinction is deliberate.** **S-028 (`nexo-drift`) was REJECTED** — bench evidence
  said it read worse. **G3 was not rejected.** It works, it was measured (**2.8 KB** seeded 64×64 alpha-noise tile as a
  data URI, zero requests, zero JS, survives 390 legibly), and the owner simply adopted **G2 breathing** for theater
  fields instead. There is nothing wrong with it; there is nowhere it is needed.
- **Why record it at all:** so that a future task which *does* need a static surface texture finds a costed, contrast-
  checked implementation instead of re-deriving one — and so nobody mistakes "unused" for "failed" and re-benches it.
- **The guardrail that comes with it:** grain is a **theater-register** tool. It must never land on a D18 deep-reading
  surface, and `feTurbulence` remains banned as the mechanism (a named AI tell); the tile is a raster on purpose.


---

## S-039 — Global spring interaction grammar — **ADOPTED, NEXT TASK (#36)**

- **Source:** **Advisor round**, registered during the Task #35 signature rescue · **Date:** 2026-08-21 ·
  **Disposition:** **ADOPTED-NEXT-TASK**
- Every hover, dropdown and focus transition moves onto the **`--spring-settle` family**, so the whole
  interface shares one arrival grammar instead of the site having spring physics in exactly two places.
- **The prerequisite is already paid.** The token shipped broken in #33 (percentage outputs; `linear()`
  takes a `<number>`) and was fixed in #34 — so this is now a grammar that can actually be applied
  rather than one that silently resolves to `0s ease`. **Any surface adopting it must verify the
  COMPUTED style, not the source**; that is exactly how the #33 defect stayed invisible for a task.
- **The ceiling still binds:** nexo-brand §5 caps chrome motion at ~250ms, so chrome consumes the spring
  *curve* at a chrome *duration*. The 620ms duration is for arrivals, not for a dropdown.

---

## S-040 — Premium form fields on /apply — **ADOPTED, NEXT TASK (#36)**

- **Source:** **Advisor round** · **Date:** 2026-08-21 · **Disposition:** **ADOPTED-NEXT-TASK**
- Field focus gains a **white focus glow driven by the spring**, giving /apply the same instrument
  quality the chrome now has.
- **Two laws bind it before it starts.** **WHITE, not mint** — mint restraint (D31) allows exactly two
  mint surfaces on the noir register, the active route and the primary CTA, and a focused input is
  neither. And a focus indicator is an **a11y contract before it is an aesthetic one**: whatever the glow
  does, the focus state must remain unambiguous at the same or better contrast than today.

---

## S-041 — Sample-card spring lifts on dispatch / platform — **ADOPTED, NEXT TASK (#36)**

- **Source:** **Advisor round** · **Date:** 2026-08-21 · **Disposition:** **ADOPTED-NEXT-TASK**
- The dispatch and platform sample cards gain spring-driven lifts, matching the boxed nav cells.
- **Watch the copy gate, not just the motion:** those cards carry sample data, and any lift that draws
  the eye to them raises the stakes on §7's "sample data must be obviously fictional" rule. Motion is
  not a reason to revisit the copy, but a reviewer looking at them again is.


---

## S-042 — The owner concept round (three images, two prompts) — **REGISTERED**

- **Source:** **Owner**, AI-image concept studies · **Date:** 2026-08-21 · **Disposition:** **REGISTERED — DNA
  extracted, one element rejected for chrome, two questions benched**

### ⚠ THE PROMPT TEXT IS NOT YET IN THIS FILE

**The two prompts were not supplied with the task, so there is nothing here to quote.** They are recorded as
required-verbatim and the slot is left explicitly empty rather than filled with a paraphrase, because a
paraphrase in a verbatim slot is worse than a gap — it looks like a record. **Paste them here and this entry is
complete.**

> **PROMPT 1 —** *(awaiting the owner's text)*
>
> **PROMPT 2 —** *(awaiting the owner's text)*

What IS on record from the task brief, and is used throughout the bench: the **balance bar** verbatim
(*"not supposed to be obvious as much and not supposed to be hidden — find the balance"*), the **Asclepius
insight**, and the per-image DNA below.

### Disposition per element

| Element | Source | Disposition |
|---|---|---|
| **Ribbon-cable strands** (4–5 fine parallel fibers per strand) | image 1 | **BENCHED — S1/S2.** Implemented as fibers offset along the path NORMAL, so they stay parallel through every bend rather than fanning out on the curves. |
| **Wide graceful crossings** | image 1 | **ALREADY SHIPPED (#35)** at swing 122/140 and wavelength 433. The bench renders the shipped values, not larger ones. |
| **Masks + under-glow + small luminous vehicle** | image 1 | **ALREADY SHIPPED (#35).** Live on every bench fragment. |
| **Photoreal 3D mesh / road surfaces** | images 2–3 | **REJECTED FOR CHROME (D34).** D19/D20 payload and paint cost; medium collision with a wholly line-art site; and it cannot be register-split. **Survives only as a line-art micro-dash sheen.** |
| **The Asclepius reading** | owner insight | **ADOPTED AS THE SIGNATURE'S STATED MEANING (D27h)** — and bounded by the new **medical-symbol law**: abstract only, no literal snake, staff, caduceus or cross. |
| **Geometry: all-weave vs staff-and-coil** | derived | **OPEN — bench S1 vs S2.** |
| **Livery: mint / white / silver** | prompt wording | **OPEN — bench S3.** May overturn D33; owner-invited. |

- **S-007 binds regardless of how a prompt is worded:** any glow is **white or mint (155°)**. **Cyan stays rejected.**
- **D29's interpretive line, stated because multi-fiber rendering invites the confusion:** the lead is drawn as
  **4 fibers** but is **ONE semantic mint object**. Fiber count does not multiply "active routes", and mint
  restraint still permits exactly two mint surfaces on the noir register.

---

## S-043 — The #35 ending question — **QUEUED FOR THE OWNER'S FULL-SCROLL READ**

- **Source:** **Task #35's own honest report** · **Date:** 2026-08-21 · **Disposition:** **QUEUED — not benched**
- #35 fixed the dangling stop (the route now docks at the terminus **station node** rather than 30px short of
  it), but the ending remains a **handoff**: the van stops 21px above the ink card and the footer's dashed motif
  picks up *inside* it. The alternative is the **route entering the card** as one unbroken line.
- **Deliberately NOT on the serpent bench.** A fragment cannot answer it — the question is how the page *ends*
  after a full scroll, and it only exists at the bottom of a real page. **The owner rules it during the
  post-upgrade full-scroll read.**
- **FOOTER_HANDOFF is currently law**, so "route enters the card" is a law change, not a tweak.
