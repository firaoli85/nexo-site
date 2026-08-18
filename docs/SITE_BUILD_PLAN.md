# SITE BUILD PLAN — FROZEN

**P2 freeze, Task #9, 2026-08-17. Branch `v2`.** Ground truth v1.3 (D18, D19, D20) is the law above this
document; where they disagree, the ground truth wins.

> ## FREEZE LAW
>
> **This list only shrinks. New scope goes to the ROADMAP section, never here. Every item cites its research
> source.**

**THE INFORMATION MODEL RULING.** IA and presentation guidance modeled on SafeRide Health's fundamentals
(owner ruling 2026-08-17): information easy to digest, how-to artifacts downloadable, flows explained plainly;
their design is not copied (T1).

**GATES.**

| Gate | Status | Effect |
|---|---|---|
| **P1-B1** — owner pass on the provider research questions | **OPEN** | **Blocks every `/providers/*` page (B19–B24).** 58 open questions plus the §5b OWNER-REPORTED items OR-1/OR-2/OR-3 |
| **P1-C1** — owner Search Console reading | **CLOSED 2026-08-17** | Cited historically, not deleted. Both inspected URLs are indexed with agreeing canonicals; the "homepage indexing issue" is closed as resolved-or-misread. The www→apex 301 stays in **W8** as durability work, never rescue. See `SEO_PLAN.md` §2.7 |
| **D17** — publish boundary | **STANDING** | Requirements, never advice. Every resource page carries an informational-only disclaimer and its verification date. Nothing UNRESOLVED or merely REPORTED/OWNER-REPORTED is publishable |
| **D15** — positioning vocabulary | **STANDING** | Applies to all 24 pages. Medical transportation management organization; we manage, providers drive; never negate |
| **D18** — broad legibility | **STANDING** | Payer surfaces read nationally; provider resource pages stay state-specific |

**Source keys:** `DR` = `docs/DESIGN_RESEARCH.md` · `PR` = `docs/PROVIDER_REQUIREMENTS_RESEARCH.md` ·
`SEO` = `docs/SEO_PLAN.md` · `GT` = `SITE_GROUND_TRUTH.md`.

---

## SECTION 0 — JUDGMENT CALLS MADE AT FREEZE

The research corpus contradicted itself in six places and was silent in twelve. A frozen plan cannot defer
those, so each was decided here, with its reason. **These are my calls, not owner rulings**, and each is
reversible by an owner ruling that supersedes it.

| # | Conflict | Call | Reason |
|---|---|---|---|
| J1 | **Owner-question count: 58 (`SEO`) vs 70 (`PR` §7 summary)** | **58** | Row count is decisive: DC 24 + MD 16 + VA 18 = 58. `PR`'s own summary table is wrong. The P1-B1 gate must name a number that matches the document it points at |
| J2 | **Maryland 16+ passenger PSC tier has TWO different figure sets, both labelled VERIFIED** (`PR` §2e L311 without property damage; §4c L688 with $100,000 property damage, different sources) | **The MD 16+ insurance row is UNPUBLISHABLE** until resolved against COMAR 20.95.01.18.B | `PR` itself calls a wrong insurance minimum "actively harmful" — a provider relying on it could be uninsured carrying a Medicaid member. Two VERIFIED cells that disagree means neither is verified |
| J3 | **"$100,000 GL / 25-50-25" attributed to Maryland by `PR` §2e (with DO NOT PUBLISH) and to Virginia by `SEO` §3.3, which builds strongest-opening #1 on it** | **The insurance-contradiction page is scoped, but its jurisdiction attribution is a MUST-RESOLVE before a word is written** | A page whose entire premise is correcting a jurisdictional error cannot itself get the jurisdiction wrong. Most likely the same vendor boilerplate circulates for both states — plausible, unproven by either document |
| J4 | **Matrix headline says "10 fully and 6 partially"; the cells count 8 Y + 4 P + 2 gated + 29 n = 43** | **Cite 8 full / 4 partial / 2 built-but-gated / 29 absent** | The cells are the data; the headline is a summary that drifted |
| J5 | **`**gated**` is undefined by the matrix legend** (rows #26, #34 — built and hidden behind `PORTAL_LIVE`) | **Gated is a DEPLOY state, not a content gap.** It becomes **W7**, a flag flip, not build work | Normalising it to "partial" would put build effort in the plan where a flag flip belongs |
| J6 | **Matrix #38 (per-jurisdiction pages) is filed under "facility / company-general" but routes to three provider pages** | **The state pages are PROVIDER-ONLY** | `SEO`'s query classes for B22–B24 assume provider intent throughout. Mixing a facility audience into a licensing page serves neither |

**Twelve places the corpus is silent** are recorded per-page below as `GROUNDING: THIN` or `ABSENT`. **A
frozen plan that promises content the research cannot support is the failure mode**, so those pages are
scoped to what can honestly be built, not to what would be nice.

---

## SECTION 1 — PAGES (B1–B24)

**13 existing · 11 new · 24 total.** Every page inherits D15 vocabulary and the §7 copy honesty gate.

### B1 — `/` (home) — EXISTING

- **Audience:** all four, in priority order (MCO/payer first).
- **Purpose:** make an evaluator conclude within one visit that this is a serious transportation management
  company that answers for its network.
- **REQUIRED CONTENT:**
  - [ ] **Hero = W2's landing site.** The current hero is on record as hard to grasp (owner + user feedback,
        D19). The signature animated centerpiece lands here and nowhere else.
  - [ ] **D18 national legibility:** the page must read as a national-grade management organization whose
        current operating footprint is the DMV. **Never local-only.** The evaluator searching from New York
        or California must not scroll past us.
  - [ ] **"How it works in three steps"** — SafeRide-informed plain-flow explanation, built as **animation,
        not video** (D19).
  - [ ] Positioning rewrite: `HERO_LEDE`, `HOME_DESCRIPTION`, `OG_IMAGE.alt` (`SEO` §3.2). **`HERO_LEDE` is
        a COPY GATE event** — one string is both the JSON-LD `description` and visible hero copy, and must
        keep its `SERVICE_AREA_PROSE` interpolation.
  - [ ] Outcome statistics restricted to the permitted, provable set (matrix #6).
- **DELIVERABLES:** W2 hero piece · three-step flow animation · rewritten metadata trio.
- **GATES:** D15 · D19 · D20 perf bar · copy gate on every number.
- **SOURCES:** `DR` §6a #6, §6e item 1, §8.1, §13b T3; `SEO` §3.2.
- **GROUNDING: THIN on section-level content.** The corpus supplies a metadata rewrite and a craft teardown,
  **not a section plan**. The "permitted, provable set" of statistics is never enumerated anywhere. **W2 and
  P4 must author the section structure; do not expect to find it in research.**

### B2 — `/platform` — EXISTING

- **Audience:** MCO/payer primary; provider secondary.
- **Purpose:** prove the machine underneath — dispatch, claims, compliance, oversight.
- **REQUIRED CONTENT:**
  - [ ] Program integrity / FWA controls, proven from the platform: scrub, adjudication, frozen fields
        (matrix #5).
  - [ ] Reporting and oversight description at the existing `#oversight` anchor (matrix #12 — **V1 already
        carries this**).
  - [ ] Named engagement models — "name the shapes of the deal" (matrix #14). **Scope as a shape to build,
        not content to match:** SafeRide's self-managed page was never fetched (J-note: `DR` §5 caveats).
  - [ ] Keep the existing scrollspy sub-nav and the ProductDemo reuse (Stage-8 pattern).
- **DELIVERABLES:** engagement-model section · retained anchors.
- **GATES:** D15 · copy gate (no EDI/GPS/tracking claims).
- **SOURCES:** `DR` §6a #5, #12, #14.
- **GROUNDING: no SEO query classes assigned** (`SEO` §3.3 table covers six provider pages only). **See the
  D18 gap in §1 closing note.**

### B3 — `/solutions/mcos` — EXISTING

- **Audience:** MCO/payer.
- **Purpose:** the payer evaluation surface.
- **REQUIRED CONTENT:**
  - [ ] Segmented payer sub-audiences (Medicaid / MA / health system) — **one page, light** (matrix #2). Split
        only when we have distinct proof per segment.
  - [ ] RFP / procurement enablement (matrix #8) — **shape only.** Roundtrip's RFP question bank is called
        "the single best payer asset found" but was **gated and never read**.
  - [ ] Explicit pilot path (matrix #11).
  - [ ] **D18 national legibility** — this is the primary payer surface.
  - [ ] Fix the measured defect: **exactly 1 in-body internal link today** (`SEO` §1.5).
- **DELIVERABLES:** pilot-path section · procurement-enablement block · internal links into `/platform` and
  `/security`.
- **GATES:** D15 · D18 · permitted-statistics constraint.
- **SOURCES:** `DR` §6a #2, #8, #11, #14, #6; `SEO` §1.5.
- **GROUNDING: THIN.** Four matrix carries land here at once and **the corpus supplies a usable specimen for
  none of them.**

### B4 — `/solutions/providers` — EXISTING

- **Audience:** transport providers.
- **Purpose:** recruitment hub, and **the hub of the internal-linking spine**.
- **REQUIRED CONTENT:**
  - [ ] Provider landing / join hub (matrix #16 — carried).
  - [ ] **Hub links down to every `/providers/*` page in body copy** (`SEO` §3.3 spine).
  - [ ] Supply-side segmentation entry framing — company vs individual driver (matrix #17). **At least two
        populations routed differently.**
- **DELIVERABLES:** spine hub links with descriptive anchor text (never "learn more").
- **GATES:** D15 · per-audience copy gate (no speed/volume claims to providers).
- **SOURCES:** `DR` §6a #16, #17, §6b; `SEO` §3.3.

### B5 — `/solutions/facilities` — EXISTING

- **Audience:** facilities and case managers.
- **Purpose:** booking and confirming rides for people in their care.
- **REQUIRED CONTENT:** [ ] retain the Stage-7 SolutionPage pattern · [ ] book-not-activate framing.
- **GATES:** D15 · facilities copy gate.
- **SOURCES:** `DR` §6a facility block; Stage-7 pattern.
- **GROUNDING: THIN — competitor grounding presumes downloadable artifacts that cannot exist in this build**
  (`PR` §6 defers all PDFs).

### B6 — `/solutions/members` — EXISTING

- **Audience:** members. Smallest surface; B2B site, no consumer sign-up.
- **REQUIRED CONTENT:** [ ] reassurance and what to expect · [ ] external member CTA with `rel` and sr-only
  new-tab affordance (Stage-7).
- **GATES:** D15 · member copy gate (**no tracking language**) · PHI law.
- **SOURCES:** `DR` §6a member block.

### B7 — `/about` — EXISTING

- **Audience:** all, trust surface.
- **REQUIRED CONTENT:** [ ] text-led story · [ ] principles · [ ] facts card · [ ] `FOUNDER_REF` only.
- **GATES:** §7.2 trust-page gate — **no team, no board, no office, no founding year, no logos, no scale
  claims, no name, no prior employer.**
- **SOURCES:** `SEO` §3.4 MUST-NOT list; Stage-9 pattern.
- **GROUNDING: ABSENT for positive substance.** The corpus supplies **only prohibitions**. The existing
  Stage-9 page stands; P6 COPY_DECK writes any change.

### B8 — `/contact` — EXISTING

- **REQUIRED CONTENT:** [ ] explicit, exhaustive routing table (E-E-A-T **S8**) · [ ] pilot path made explicit
  (matrix #11) · [ ] members → portal, **never email** (PHI law).
- **GATES:** **no SLA language** ("within X hours" stays banned) · no address.
- **SOURCES:** `DR` §6a #11; `SEO` §3.4 S8.

### B9 — `/apply` — EXISTING

- **REQUIRED CONTENT:** [ ] supply-side segmentation routing (matrix #17) · [ ] existing honeypot / timing /
  throttle defenses retained.
- **GATES:** PHI law · anti-reflection law on the ack email.
- **SOURCES:** `DR` §6a #17, §6b.

### B10–B13 — `/privacy`, `/terms`, `/hipaa`, `/accessibility` — EXISTING

- **Purpose:** the legal and policy set (matrix #41 — carried).
- **REQUIRED CONTENT:** [ ] unchanged in substance · [ ] `HIPAA_EFFECTIVE_DATE` stays flag-governed ·
  [ ] privacy stays **TLS-in-transit only** (no encryption-at-rest claim).
- **GATES:** attorney review remains the owner's, not ours. **D17 bans legal guidance** — these state our
  policies, they do not advise.
- **SOURCES:** `DR` §6a #41; `SEO` §3.4 S7.
- **GROUNDING: presence-check only.** No competitor legal page was read for content. **Do not expand these
  from research; there is none.**

### B14 — `/security` — NEW

- **Audience:** MCO/payer. Called **"the largest payer gap"**.
- **Purpose:** compliance and security posture.
- **REQUIRED CONTENT — built ONLY from what is verifiable in the repo today:**
  - [ ] TLS in transit
  - [ ] AWS SES with a **send-only least-privilege IAM identity**
  - [ ] **No PHI collected through any marketing form**, and the forms are engineered to reject it
  - [ ] Honeypot, submission-timing, and global-throttle defenses
  - [ ] Built on the existing `LegalPage` component; cross-linked from footer, `/privacy`, `/hipaa`
- **GATES:** **`LAUNCH.HIPAA_INFRA_VERIFIED` is false** — flag-gated until infrastructure is verified.
  **"Certified" is banned. "HIPAA compliant" is banned** (only "Built for HIPAA compliance").
  **No SOC / HITRUST / pen-test claims — those require audits we have not run.**
- **DELIVERABLES:** one route, four honest facts, zero attestations.
- **SOURCES:** `DR` §6a #3, #4, #15, §6e item 14; `SEO` §3.4 S7.
- **GROUNDING: heaviest expectation-to-material gap on the site.** Everything the four competitors do here
  requires audits we do not have. **Scope is deliberately small. Do not let it grow to match theirs.**

### B15 — `/faq` — NEW

- **Audience:** cross-audience.
- **REQUIRED CONTENT:** [ ] questions sourced from **real inbound** (contact form, apply form, owner's calls)
  — **not invented** · [ ] `FAQPage` schema **only if the page visibly renders the Q&As**.
- **GATES:** D17 · copy gate on every answer.
- **SOURCES:** `DR` §6e item 21.
- **GROUNDING: ABSENT — the cleanest gap in the corpus.** No matrix number, no query classes, no competitor
  cross-audience FAQ analyzed, no question list anywhere. **Every question on this page would be invented
  today.** **RULING: B15 does not ship until there is real inbound to source it from.** It stays in the
  frozen 24 as a reserved route, built last.

### B16 — `/notices` — NEW

- **Purpose:** non-discrimination and language assistance (matrix #42 — a Medicaid expectation).
- **REQUIRED CONTENT:** [ ] the required notice text, **sourced from the governing authority, not written by
  us**.
- **GATES:** **D17 bans legal guidance, and this page IS a legal instrument.** **Owner + counsel supply the
  text; we lay it out.**
- **SOURCES:** `DR` §6a #42, §6e item 22.
- **GROUNDING: ABSENT for content.** Existence is grounded (four competitors publish these); content is not —
  **grep-verified zero occurrences of "1557", "threshold language", or "tagline" across all three research
  documents.** **RULING: B16 is a layout deliverable awaiting supplied text. We do not author it.**

### B17 — `/members/how-it-works` — NEW

- **Audience:** members.
- **REQUIRED CONTENT:** [ ] booking mechanics · [ ] eligibility · [ ] complaint path.
- **GATES:** **`LAUNCH.LIVE_OPERATIONS` is false.** Every mechanic the research observed is a *competitor's*
  program number and **none can be restated as ours.** Members → portal, never email.
- **SOURCES:** `DR` §6a #29, #31, §6e item 23.
- **GROUNDING: THIN.** Describes a program not yet running. **Blocked in substance until operations exist;
  `/contact` is the only real destination today.**

### B18 — Sign-in surface — NEW (chrome change, not a page)

- **Purpose:** un-gate the existing `PORTAL_LIVE` surface (D3).
- **REQUIRED CONTENT:** [ ] three customer doors (Member / Provider / Care portal) · [ ] **admin excluded from
  every public surface** (§7.4) · [ ] any attempt: "no account found, contact support" · [ ] **no sign-up
  path** (B2B).
- **DELIVERABLES:** **W7** — a flag flip plus the `launch.ts` stale-comment cleanup.
- **GATES:** D3 · §7.4 · wire to real auth when `app.nexoaccess.com` deploys.
- **SOURCES:** `DR` §6c, §6e item 24; Stage-15 notes.
- **NOTE (J5):** this is **built and hidden**, not unbuilt. It is a deploy state. **Do not scope it as build
  work.**

### B19 — `/providers/requirements` — NEW · **THE HEAVIEST PAGE**

- **Audience:** transport providers. **"Our biggest content gap."**
- **REQUIRED CONTENT:**
  - [ ] The **14-dimension × 3-state comparison table** (`PR` §5 — "the skeleton of the future page")
  - [ ] The **four-layer model**: form entity → licence → Medicaid enrolment → broker/MCO credentialing
  - [ ] **The four-layer model is NOT uniform, and the page must say so:** VA has **no DMAS enrolment layer**
        for wheelchair/ambulatory/stretcher; MD probably has **no Medicaid enrolment layer** and **no broker
        layer**; WMATC covers only **2 MD and 2 VA counties**. `PR`'s own PUBLISHABLE row omits this caveat —
        **the page must add it**
  - [ ] Vehicle-class definitions
  - [ ] **Informational-only disclaimer AND verification date** (D17)
  - [ ] The hub-down half of the internal-linking spine
- **HARD LIMITS (four, simultaneous):** figures stay **OUT** of the summary · **PERMANENT ban on any single
  insurance-minimum headline number** ("publishing one figure would be actively harmful") · **every cell
  re-verified at publication** · **no business-formation content at all** (D17).
- **GATES:** **P1-B1** · D17 · J1 (58 questions) · J2 · J3.
- **SOURCES:** `PR` §5, §6, §5b; `SEO` §3.3.

### B20 — `/providers/credentialing` — NEW · **MOST OVER-SCOPED ROUTE IN THE 24**

- **Audience:** transport providers.
- **REQUIRED CONTENT:** [ ] our numbered credentialing sequence · [ ] document checklist.
- **GATES:** **P1-B1** · D17 · **`LAUNCH.LIVE_OPERATIONS` false**.
- **SOURCES:** `DR` §6a #20, §6e item 16; `SEO` §3.3.
- **GROUNDING: SEVERE, AND IT HID BEHIND A "CARRY (priority)" LABEL.** The 281KB primary-source provider
  document assigns this route **ZERO publish-map rows**. Its entire evidentiary basis is Verida's 4-step
  sequence and MTM's named stages — i.e. **competitors' processes**. What it needs is a description of **our
  own credentialing process, which we do not yet run**, and the copy gate will not permit inventing it.
  **`SEO` assigns it the query class "how long does credentialing take" — a duration claim we cannot make.**
  **RULING: B20 ships only after operations exist. Until then it is a reserved route.** Its query-class
  assignment is **struck** from the SEO targets.

### B21 — `/providers/dc` — NEW

- **REQUIRED CONTENT:** [ ] DC chapter: program structure, ordered path, vehicle, driver, insurance, ongoing
  compliance · [ ] WMATC operating authority · [ ] DFHV vehicle-for-hire licensing · [ ] **D17 disclaimer +
  verification date**.
- **GATES:** **P1-B1** (24 of the 58 questions are DC's) · **the DC $1.5M figure stays BLOCKED** · two of the
  three OWNER-REPORTED items are DC's and **both BLOCKED**.
- **SOURCES:** `PR` §1, §4a, §5b, §6; `SEO` §3.3.
- **GROUNDING: heaviest withhold-to-say ratio of the three states** — the only chapter with NOT ESTABLISHED
  entries. Vehicle age, mileage, lift rating, securement, signage, inspection frequency, background-check
  registries, drug testing and driver physicals are **all NOT ESTABLISHED**. The broker contract term is
  UNRESOLVED and may be in procurement. **This page must be written largely in the negative — and saying "the
  authority does not publish this; here is who to call" is a legitimate, publishable answer.**
- **NOTE:** the $1.5M evidentiary record is reconciled at `PR` §4a as a **coverage difference**, not a factual
  conflict. **Any quotation of §4c's UNRESOLVED must travel with §4a's reconciliation.**

### B22 — `/providers/maryland` — NEW

- **REQUIRED CONTENT:** [ ] PSC authority and tiers · [ ] graduated bond-in-lieu · [ ] filing mechanics
  (6-month minimum term, 10-day cancellation notice, annual continuing proof) · [ ] the **24-grantee county
  model as structure** · [ ] the **WMATC overlay** · [ ] **ePREP → MPRIME transition with a dated "as of"** ·
  [ ] D17 disclaimer + verification date.
- **GATES:** **P1-B1** · **J2: the 16+ passenger tier is UNPUBLISHABLE until resolved** · **the §17-103 trap
  must be stated, not silently inherited** (the ambulance auto minimum is far lower than the PSC for-hire
  minimums; "anyone relying on this as the operative ceiling is misreading it").
- **SOURCES:** `PR` §2, §4c, §6; `SEO` §3.3.
- **GROUNDING: strong on state law, black hole at county level.** **Not one county bid document could be
  opened.** The page can name the structure and **zero county terms**. It carries the **fastest-decaying claim
  on the site** (MPRIME go-live Oct 2026).

### B23 — `/providers/virginia` — NEW

- **REQUIRED CONTENT:** [ ] the four DMV tiers ($350k / $1.5M / $5M / taxi $125k) · [ ] the **$25,000
  three-year surety bond** · [ ] form OA 151 · [ ] licence-class / CDL answer · [ ] D17 disclaimer +
  verification date.
- **GATES:** **P1-B1** · **Virginia NEVER uses "combined single limit" and our copy must not either** · **a
  local taxi ordinance can raise the floor above the state number, so no single statewide figure is ever
  complete** · **J3 must be resolved before the insurance-contradiction content is written**.
- **SOURCES:** `PR` §3, §4b, §4c, §6; `SEO` §3.3.
- **GROUNDING: lowest thinness of any route for figures** — "the strongest verified figure set in the whole
  document," each with statute, URL and access date.

### B24 — `/providers/faq` — NEW

- **REQUIRED CONTENT:** [ ] the provider questions we **can** honestly answer · [ ] **matrix #27, the provider
  complaint / appeal path** — parked here because the corpus assigns it to no route at all · [ ] `FAQPage`
  schema only if the Q&As visibly render.
- **GATES:** **P1-B1** · **two of the six inherited questions are permanently unanswerable**: rates
  ("universally withheld"; no fee schedules anywhere) and insurance figures (permanently blocked as a headline
  number). A third — no-show and door-cancel handling — is **a program term we do not have**.
- **SOURCES:** `DR` §6a #24, #27, #28, §6b, §6e item 20; `SEO` §3.3.
- **GROUNDING: MODERATE-TO-SEVERE by arithmetic.** The six questions are **MTM's Texas provider FAQ**, and we
  can honestly answer roughly half. **Do not inherit a competitor's question list wholesale.**

### Closing note on Section 1 — two gaps recorded, not papered over

1. **The payer half of D18 has no SEO plan behind it.** D18 requires payer-facing surfaces to read nationally,
   but `SEO` §3.3 assigns query classes to **six provider pages and none to any payer surface**. **W8 owes a
   payer-side query-class pass.**
2. **Anchor-text strings, per-page link counts, in-page placement, and any rule for linking from home or
   `/platform` into the provider center are ABSENT.** `SEO` §3.3 gives five spine bullets and stops. **W8
   owes the rest.**
3. **The five "strongest openings" are assigned to no routes**, and opening #5 (a sourced cost floor) matches
   no planned page at all. **It goes to ROADMAP, not into B19, because adding it would be scope growth.**

---

## SECTION 2 — WORKSTREAMS (W1–W10)

### W1 — Chrome evolution

Nav and terminus footer, on the keep-and-evolve verdicts from `DR` §11a.

- **KEEP:** one `<nav>` landmark · sticky header (a deliberate divergence from Stripe) · real
  `<button aria-expanded>` triggers · the ink terminus footer (**logged divergence** — Stripe ends light with
  85 links; ours must land, not continue).
- **ADOPT:** the **panel shape morph** — `clip-path` + `height`/`max-height` interpolation on
  trigger-to-trigger movement, 200ms shape / 250ms contents, inside our 250ms ceiling. **Highest-value nav
  upgrade available.**
- **REJECT:** 33-links-per-panel density.
- **EXPLORE:** **T4 borderless full-bleed.** Note the live collision: T4 vs the Railway convergence (a
  *bordered*, if subtly bordered, system) vs **C3** (subtle borders may vanish on cheap monitors).
  **Unresolved by design — W1 and W4 resolve it together.**
- **OPEN QUESTION:** a footer jurisdiction control (Stripe surfaces region there; our DC/MD/VA service area is
  the same class of fact).

### W2 — THE HERO SIGNATURE PIECE (D19)

**Concept proposed by Claude in P3 as rendered comparisons; owner reacts before build.**

> **THE CONSTRAINTS BOX — the signature piece must live inside all of these:**
>
> - **Perf bar (D20a):** ≤600KB transfer, ≤150KB JS, ≤1200ms DCL, ≤60 requests on the default profile.
>   *P5 measurement may tighten, never loosen.*
> - **Reduced-motion static-complete:** every motion surface has a static end-state; the global
>   `prefers-reduced-motion` block zeroes durations and delays. **It must be capable of stopping dead, not
>   merely slowing down.**
> - **Decline-don't-degrade (D20b):** any canvas/GPU work gates the request behind
>   `failIfMajorPerformanceCaveat: true`; **never render slowly.** Ship a **named art-directed static asset**
>   as the resting state. **Never put the gamble in a hero.**
> - **motion-safe architecture (D20c):** motion is switched **ON** by capability classes, never patched off.
> - **D19 imagery law:** animation and custom illustration in our own visual language. **Stock
>   people-photography permanently banned.**
> - **T5:** the van and the monuments stay. Animation raises the ceiling; it does not replace identity.
> - **Zero CLS** and **WCAG AA** remain non-negotiable.

### W3 — Type-specimen bench (T2) — **P3 OPENS HERE**

Incumbent pair (Bricolage Grotesque + Hanken Grotesk) versus challengers, **decided on rendered screens at
real sizes and weights**, never on names in a list. Scope: **heavier display weights** and a possible
**technical/mono accent layer**.

**The unresolved tension is the point of the bench:** `DR` §8.5/§11b found light display weight (300)
correlating across Stripe and ElevenLabs as "the single strongest premium signal in this sample"; the owner's
own words are **"not bold enough."** **The corpus flags this and does not resolve it. Neither does this plan.**

### W4 — Color hardening (C3)

Does the jade survive a cheap monitor? **Direction evidence: the Railway convergence** — the owner picked
Railway on feel alone, and `globals.css` already credits Railway in five places (palette, borders, shadows,
motion, press feedback). **He returned to his own token file's ancestor without knowing it.** Likely shape:
**keep the subtlety, raise the floor** — every boundary that carries meaning clears WCAG 1.4.11 at 3:1 on a
bad screen. **P5 measures; W4 must not resolve C3 by guessing.**

### W5 — Motion system

The four candidates (D20d), approved for P3 exploration and **encoding into a `nexo-motion` skill**:

| Candidate | Mechanism | Band | Where | Reduced motion |
|---|---|---|---|---|
| `nexo-drift` | per-cell offset cycle across the AmbientMap dot grid | 2400–3200ms | AmbientMap, all tones | Static grid, current appearance exactly |
| `nexo-shape` | nav panel size interpolation (`clip-path` + `height`) | 200 / 250ms | Desktop nav panel | Instant swap |
| `nexo-settle` | existing play-once settle grammar, formalised as a primitive | ≤300ms | Any IO-gated arrival | Final frame, immediately |
| `nexo-accent-card` | local dark card on a light section | static | Interior proof blocks | n/a |

**Governing rules:** `will-change` for imminent transitions only · ambient motion is slow (if a loop can be
tracked by eye it is too fast) · transform and opacity only · **every candidate ships its static end-state
first**. **`nexo-shape` is recommended first** (highest value per unit of risk).

### W6 — Illustration / animation imagery system (D19)

Primary imagery = animation + custom illustration in our own visual language. **Stock people-photography
permanently banned** (fake patients read as fake trust). **Real photography deferred until real operations
exist, then added as truth.** SafeRide-style flow explanations are built as **animation, not video**.

### W7 — Sign-in un-gate (D3)

Flip `PORTAL_LIVE`; clean up the stale "operating model UNDECIDED" comment in `src/lib/launch.ts` (already
scheduled). **A flag flip, not build work (J5)** — the surface is built and hidden.

### W8 — Metadata / JSON-LD / redirect implementation

Implements the `SEO_PLAN` specs.

- [ ] **D15 rewrite** — `HERO_LEDE` (COPY GATE event), `HOME_DESCRIPTION`, 12 interior descriptions,
      `OG_IMAGE.alt`. Close the homepage `pageMeta` asymmetry.
- [ ] **www→apex 301** — `next.config.mjs` `redirects()` with **`statusCode: 301`** (not `permanent: true`,
      which emits 308). Document the host-literal duplication. **Durability work, not rescue (P1-C1 closed).**
- [ ] **Schema assignments** — `WebSite`; `BreadcrumbList` on the provider center; `FAQPage` **only where the
      Q&As visibly render**; `contactPoint`. **Decide `MedicalBusiness` vs `Organization`** (recommendation:
      `Organization`). Build the per-page schema seam, which does not exist today.
- [ ] **Owed by this plan:** the payer-side query-class pass (D18) and the rest of the internal-linking spec
      (anchor text, counts, placement).
- [ ] **Structured-data honesty gate:** every schema property must be visible and true on the page.

### W9 — QA extension (P5)

Throttled old-device profile · visual diffing · **perf budget as a gate** (D20a) · **I19 host-redirect
invariant** (raw request with explicit `Host:` header; the sweep addresses `localhost:3300` by port and cannot
otherwise exercise a host rule) · C1–C4 measurement.

### W10 — COPY_DECK (P6, last)

"Copy is written last and is the cheapest layer; the machine underneath is the work." Every string passes the
§7 honesty gate and D15 vocabulary. **B15 and B16 depend on this workstream plus outside input.**

---

## SECTION 3 — ROADMAP (deferred — this section only grows)

| Item | Reason deferred |
|---|---|
| Case studies / named clients | No clients to cite. Revisit post-contract |
| Published pricing or tiers | Contract-negotiated; nobody in the category publishes real prices |
| ROI calculators | Requires real cost data we do not have; would breach the honesty gate |
| Careers | One person |
| News / insights | Unsustainable solo pre-launch |
| Mileage reimbursement | Not a program we run |
| Per-plan member guides | Not a program we run |
| Adjacent service lines | D2 keeps NEMT-first; adding a market is adding a module, later |
| **Real photography program** | **Post-operations.** Then added as truth (D19) |
| **Member / provider explainer video program** | **Post-launch, and only if animation proves insufficient** (D19 prefers animation) |
| State contract / award list | We have none |
| Public third-party trust center (SOC/HITRUST/Drata-style) | **Needs real audits first** |
| Downloadable per-state PDF guides | Deferred until the state pages ship **and** figures are re-verified |
| A sourced cost-floor page (SEO opening #5) | Matches no planned page; adding it now would be scope growth |
| Segmented payer sub-audience pages | Split only when we have distinct proof per segment |

---

## SECTION 4 — OWNER RECEIPTS

**Evidence tier: OWNER-STATED.** Recorded 2026-08-17. Not measurements, not research findings.

### 4a. The provider-information vacuum — testimony

**The owner had to cold-call providers to learn the trade.** There was no published path: the information a
new operator needs was not available to him, and he assembled it by telephone, from people already doing it.

**Why this is on record:** it is first-hand evidence for the §3.3 competitive finding, arrived at
independently. The research showed the vacuum from the outside — the ranking pages omit the actual licensing
gates, one fabricates an agency that does not exist, another ranks on a 2012 form revision. **The owner hit
the same vacuum from the inside, as a customer of it.**

**Candidate authentic opening for the provider center**, subject to **COPY_DECK (W10) and the honesty gate**:
the page exists because the person who built it could not find this information either. **Not approved copy —
a candidate.** It must never become a claim about our operating history, and it stays inside `FOUNDER_REF`
(no name, no prior employer, no years as a number).

### 4b. The SafeRide model ruling — rationale

**Incumbents do not improve without competition; fundamentals win.** The owner's reasoning for modeling IA and
presentation on SafeRide Health's fundamentals: information easy to digest, how-to artifacts downloadable,
flows explained plainly.

**This is a ruling about fundamentals, not about visual design.** T1 (combination over cloning) is binding:
**their design is not copied.** The research corroborates the choice — SafeRide's `/what-to-expect-nemt-provider`
was assessed as "the best single page in the category" — and simultaneously bounds it: SafeRide has **zero
state-specific provider content**, so the model tells us *how to present*, never *what to say* about DC, MD
or VA.

---

## FREEZE RECORD

**24 pages · 10 workstreams · 15 roadmap items · 6 judgment calls (J1–J6) · 12 grounding gaps recorded.**

**This list only shrinks.** Any future addition to Section 1 or Section 2 is a **freeze violation** and
belongs in Section 3.
