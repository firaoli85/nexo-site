---
name: nexo-brand
description: The design law for the Nexo Access site (Next.js NEMT healthcare marketing, DC/MD/VA). Resolve this FIRST on any Nexo Access design/build work — it encodes the tonal map, type system, color tokens + registers, glass doctrine, motion vocabulary, the morph spec, the COPY HONESTY GATE (verbatim), the visual-verification loop, and token discipline with the ACTUAL values. Combine with the general design skills (huashu-design + frontend-design lead) but let THIS win on any Nexo-specific value or rule.
---

# Nexo Access — brand & build law

> **SYNC RULE.** This skill lives in TWO places: the **repo copy** at
> `nexo-site/.claude/skills/nexo-brand/SKILL.md` (CANONICAL — versioned with the code) and this
> **user mirror** at `~/.claude/skills/nexo-brand/SKILL.md`. Any edit to one MUST be applied to the
> other in the same change so they never drift.

Premium, calm, credible marketing site for a technology-first non-emergency medical transportation
(NEMT) company serving DC / Maryland / Virginia. (Nexo Access self-describes ONLY as a "technology-
first NEMT company" — the operating model is deliberately undecided; see the COPY GATE §7.2.) Stack:
Next.js 14 App Router, React 18, Tailwind 3.4,
`@radix-ui/react-navigation-menu`, `lucide-react`. Every color flows from CSS vars in
`src/app/globals.css`, mapped to Tailwind in `tailwind.config.ts`. **No hardcoded hex anywhere
outside globals.css.** No new project dependencies without approval. No git commands.

## 0. SKILL DISCOVERY (standing process — Stage 6.5)
Before designing/building, ENUMERATE every skill installed in the workspace (user `~/.claude/skills`,
project `.claude/skills`, and plugin skills — `find … -iname SKILL.md`). Resolve **nexo-brand FIRST**
as design law, then combine the standing design set (huashu-design, frontend-design, emil-design-eng,
impeccable, ui-ux-pro-max, design-system, ui-styling, frontend-a11y, review-animations). Then SHORTLIST
any other installed skill plausibly relevant to the stage (animation, React perf/patterns, a11y,
testing, healthcare/PHI, design), READ the shortlisted ones, and apply what genuinely helps. End the
report with a table: skill → considered/used → concrete contribution. (nexo-brand always WINS on any
Nexo-specific value or rule.)

## 0. Non-negotiables (fail the build if violated)
- **WCAG AA is highest severity.** Text ≥ 4.5:1, graphics / UI boundaries (WCAG 1.4.11) ≥ 3:1,
  computed against the *actual composited* background (worst case — e.g. glass over ink), never
  assumed. Verify with a luminance calculator, not by eye.
- **Zero hardcoded hex/rgb in components.** Colors come through tokens/Tailwind utilities only.
- **Zero-CLS.** Reserve space (grid-stack, aspect-ratio, fixed dims). Screenshot-verify.
- **Reduced-motion is respected** — every motion surface has a static end-state; the global
  `@media (prefers-reduced-motion: reduce)` block zeroes durations + delays.
- **The COPY HONESTY GATE (§7) is absolute.** Legal/credibility. Audit EVERY string.
- **The VISUAL VERIFICATION LOOP (§8) is law.** Never report unseen work.
- **GREEN IS A FLOOR (§0.1) governs every report.** Never overclaim.

## 0.1 GREEN IS A FLOOR (Stage 13 — permanent, verbatim; report-trust law, overrides convenience)
The Stage-12 report declared ALL GREEN while the owner found, in minutes, a van overlapping the footer,
white voids below the endcap, a locked-email violation, a 3-option dropdown, and forms that lock after
one submit. The harness answered the wrong question and a real defect was ruled a "false-positive" from
a number, not a screenshot. Therefore, permanently:
1. **Harness green is a floor, never a verdict.**
2. **A user-visible anomaly may NEVER be classified as a false-positive without a screenshot proving the
   USER sees nothing wrong.** (A `scrollHeight` equality, a bbox number, "no van node" — none of these
   overrule the owner's screenshot. Reproduce with the eye or concede you could not.)
3. **Every stage report ends with three sections:** (a) **HARNESS RESULTS**, (b) **HUMAN-EYE PASS** —
   what a person actually saw, with screenshots at real scroll positions (top / each mid-section / footer
   approach / absolute bottom) and real interaction flows, VIEWED and described, (c) **NOT VERIFIED** —
   an explicit list of what this stage did not check. **Overclaiming is the failure mode; under-claim and
   list the gaps.**
When a probe and a screenshot disagree, the screenshot wins and the PROBE is the bug to fix. The QA sweep
(§10) is standing infrastructure that catches regressions — it is NOT proof that a human would see nothing
wrong. Ship the human-eye pass, every stage.

## 1. THE TONAL MAP (color assigned by PURPOSE, ink stays rare)
Three background registers: **white** (openings/beginnings), **tint** (connective rhythm +
buffers), **ink** (rare, authored dark showcases). Ink appears in exactly THREE chapters, well
separated by light: the **hero** (the "one designed world" opening), **Stop 3 / the morph**
(interior showcase), and the **footer** (grounding close).

| Homepage section        | BG    | Why |
|-------------------------|-------|-----|
| Hero (nav+headline+console) | **INK** | Opens as one ink world; the console belongs kin-to-kin. |
| Credential strip        | Tint  | Buffer OUT of the ink (ink → tint, **never ink → white**). |
| Spine intro / Stop 1    | White | Light reset; the journey starts clean. |
| Stop 2                  | Tint  | Rhythm. |
| Stop 3 (morph)          | **INK** | The one interior showcase. |
| Stop 4                  | Tint  | Buffer out of ink. |
| A · Proof band          | Tint  | Continues Stop 4's guardrail theme (hairline seam); a compact stat strip. |
| B · Audience triage     | White | A fresh "who it's for" chapter — a clean field for the 4 cards. |
| C · Provider teaser     | Tint  | Connective rhythm; quieter station grammar, subordinate to the CTA. |
| D · Final CTA           | White | The last light moment before the ink footer. |
| Footer                  | **INK** | Grounding close — the terminus (an INSET ink card on the light page; still the 3rd ink chapter, see §6.2). |

(Tonal map v3, Stage 5 — B/C mapped by rhythm: tint→white→tint→white keeps register alternation
after the spine; ink stays exactly 3 chapters, none added. White→ink into the footer is a
deliberate descent, not the forbidden ink→white.)

Rules: **never ink → white without a tint buffer.** New dark sections must justify a 4th ink
chapter or use tint instead. The ink hero extends UP behind the transparent nav (`-mt-16` +
compensating top padding) so the page-top nav sits over ink, not the body white.

## 2. TYPE SYSTEM
- **Display:** Bricolage Grotesque (`--font-display`, `font-display`) — headings only.
- **Body:** Hanken Grotesk (`--font-body`, `font-sans`) — a warm humanist grotesque on a contrast
  axis with Bricolage. Never Inter/Roboto/Arial/system, never a second grotesque for body.
  - **§2 NOTE — font-display posture (Stage 16.1 owner ruling, 2026-07-16).** The "never
    Inter/Roboto/Arial/system" rule governs the typeface **CHOICE** — the faces stay Bricolage + Hanken.
    Both load via `next/font` with **`display: "optional"`** (NOT `swap`): on an uncached first paint that
    misses the ~100ms window, next/font's **metric-matched fallback** renders for the whole load (no swap
    → zero font-swap CLS); cached / fast loads render the real faces. That metric-matched fallback during
    first paint is a **SANCTIONED performance posture, NOT a "system font" violation**. (`swap` caused a
    real reflow: on /about at 768px, P1 gained a line when Hanken loaded, shifting siblings ~29px → CLS
    0.0213 on chromium; `optional` → verified CLS 0 across 5 cold-cache runs. This is why I5 CLS < 0.02
    is enforced per engine × profile — see §10.1.)
- **Scale:** marketing body **17–18px** (`text-lg`), hero/section **subline one step up**
  (`text-xl`), display headings large (`text-4xl … text-6xl`), measure **65–75ch**
  (`max-w-prose`), line-height 1.5–1.75, display tracking ≥ `-0.04em` (`tracking-tight`).
- **Small-text tier ≥ 14px** (Stage 6 raised it one step): spine proof points, card sublines, demo
  scene captions, dropdown descriptions, footer links are `text-sm`/`text-[15px]`, not `text-[12/13px]`.
  CONSOLE FLOOR (Stage 6.4 — the older-reader pass OVERRULES the former console-sim exemption):
  text INSIDE the product-console simulations (the hero Dispatch console + every spine mock) is NO
  LONGER exempt — every string must pass the arm's-length screenshot test. Minimum **≥13px** (≥14px
  where layout allows), and faint muted VALUES lift one step on their actual surface (e.g. the Stop-4
  scrub-check rows went `text-muted`→`text-default`). Re-measure the fixed-height stages after the
  bump so zero-CLS still holds.
- **PROOF-LINE FINAL STEP (Stage 6.6 — the older-reader pass, ends the small-text tier for body copy):**
  the spine/assist proof lines (Stops 1–4 + the assist scene) are **16px (17px at `lg`), `font-medium`,
  FULL-strength color** (`text-default` on light, pure `text-on-ink` on ink — **no muted proofs**), with
  the icon chips scaled to match (`h-8`, `rounded-lg`, `h-[18px]` icon). One size step up for the
  supporting tier: stop sublines / provider step bodies → `text-lg`; provider step titles → `text-lg`;
  proof-band stat labels + caption → `text-base` (`text-muted`, not `text-subtle`); the CTA supporting
  line → `text-xl`. The rule that decides it: **the arm's-length screenshot test overrides the ratio —
  anything that reads thin escalates in size/weight even when its contrast already passes.**
- **Plain language:** proof lines ≤ ~12 words, buyer voice ("would a case manager say this aloud?");
  split dense lines. "enforced at the database level" may stay (a differentiator).
- **Sequential heading levels** (h1 → h2 → h3); never pick a level for its size.

## 3. COLOR TOKENS + WHEN EACH REGISTER IS USED
All in `globals.css :root`; Tailwind utilities in `tailwind.config.ts`.

**Text ramp — JADE-CAST (carries the ink hue, never neutral/blue gray):**
`--text #0c1512` · `--text-muted #42544c` · `--text-subtle #4b5c53` · `--text-disabled #b6c2ba`.
Use on white/tint surfaces. On ink surfaces use the on-ink ramp instead.

**Surfaces:** `--bg #fafbfc` (page) · `--surface #ffffff` (cards) · `--surface-hover #f3f5f8` ·
`--surface-tint #f4f9f7` + `--surface-tint-border #dbeae3` (bands, eyebrow pills, chips).
(The old light `--surface-glass` was RETIRED in Stage 6.1 — the nav is one dark register now; see
`--nav-glass` under the INK family.)

**Borders (light):** `--border #ebedf1` (decorative card/divider) · `--border-strong #dcdfe4` ·
`--border-control #7e8d86` (**boundary-dependent controls** — clears WCAG 1.4.11 3:1 on white/tint/bg;
used by the light secondary button). A light secondary/outline button MUST use `border-control`, not
`border`/`border-strong`, so its shape is perceivable; text-only ghost buttons are exempt (identified
by their text, not a boundary).

**Accent (deep jade, used sparingly):** `--accent #0b7d56` (text/fills on light; 5.1:1 on white) ·
`--accent-hover #0a6b49` (also the accent word on any deeper light field where jade-on-jade would
fail) · `--accent-text #ffffff` · `--accent-subtle #e8f8f1`.

**INK family (dark showcases only):** `--ink #0b1512` (section bg) · `--ink-surface #12201b`
(raised surface / glass fallback) · `--on-ink #e9f1ee` (primary text, 16:1) ·
`--on-ink-muted #adbfb8` (secondary — LIFTED a step in Stage 6.1: 9.7:1 on ink / 7.4:1 over an ink
map stroke, so small on-ink reading text has presence, still clearly secondary below on-ink 16:1) ·
`--on-ink-border #35504a` (2.1:1 — faint dividers/tracks) · `--on-ink-border-strong #4a6b60`
(3.15:1 — **card/panel EDGES**) · `--accent-on-ink #46d6a0` (links/status/CTAs on ink, 10:1) ·
`--accent-on-ink-hover #74e2b8` · `--ink-glass rgb(22 42 34 / 0.70)` (COLORED liquid glass for CARDS
on ink; over ink ≈#13241d keeps on-ink 14.1 / on-ink-muted 7.4 / accent-on-ink 8.8 — all AA) ·
`--nav-glass rgb(12 23 19 / 0.90)` (the SINGLE nav-bar glass — deep-jade, high-alpha; over pure
white ≈rgb(36 46 43) → on-ink 12.2 / on-ink-muted 7.3 / accent-on-ink 7.6, over the ink hero
near-seamless; see §4) · `--ink-hover #264035` (nav item hover fill — a visible step lighter than
the SOLID ink-surface dropdown panel, 1.45:1, so the row clearly lightens; on-ink-muted still clears
AA on it at 5.9). On-ink borders are TWO-TIER: strong for card edges, faint for dividers. `--on-ink-border` alone never carries state/focus — those use `accent-on-ink` + a
non-color cue.

**On-ink status/graphics:** `--danger-on-ink #f87171` (Blocked, AA text) ·
`--svc-amb-on-ink #2dd4bf` · `--svc-wheel-on-ink #a78bfa` · `--svc-str-on-ink #e879f9` (service
chips/cards). Morph FIGURE apparatus (brighter): `--svc-wheel-fig #c4b5fd` · `--svc-str-fig #f0abfc`.

**Service level (light surfaces):** `--svc-amb #0f766e` (teal) · `--svc-wheel #6d28d9` (violet) ·
`--svc-str #a21caf` (fuchsia), each with a `-subtle` chip fill. Service level is a DEDICATED
palette outside the status hues; always pair color with an icon + label (never color-alone).

**CTAs on ink:** primary = `accent-on-ink` FILL + `ink` text (the single bright pop); secondary =
ghost with `on-ink-border-strong` edge + `on-ink` text. (`Button` variants: `primaryOnInk`,
`secondaryOnInk`, `ghostOnInk`.)

## 4. GLASS DOCTRINE (single nav register — Stage 6.1)
Glass lives in exactly TWO places, BOTH dark + jade-cast (never light, never neutral black/white):
(1) the **nav bar** — ONE dark glass (`.nav-glass` = translucent `--nav-glass` + `blur(12px)`, solid
`--ink-surface` `@supports` fallback), in EVERY state on every page; (2) **cards on INK stages**
(`.ink-glass` = translucent `--ink-surface`/`--ink-glass` + blur(10px), solid fallback). The nav's
DROPDOWN panels + mobile overlay are NOT glass — they are a **solid dark surface** (`bg-ink-surface`
for dropdown panels so they lift off the ink hero yet pop over white; `bg-ink` for the full-bleed
overlay). **Never** glass on light/white surfaces; never glass-on-glass; never full-bleed glass.
Opacity — not blur — guarantees contrast; blur < 20px. Any change is AA-verified at the worst case
(now including the dark nav glass over PURE WHITE — the `--nav-glass` 0.90 alpha is calibrated for it).

## 5. MOTION VOCABULARY + CEILINGS
Flat aesthetic — **no glow/bloom/gradient**. Animate transform/opacity/filter only (+ dashoffset
for the spine draw). Everything interruptible; reduced-motion = instant.
- **Page content:** calm, ≤ ~300ms, ease-out; entrances rise from `scale(0.95)`/`translateY`,
  never from `scale(0)`; no all-at-once — stagger grouped items. Read-first copy is NOT animated.
- **NAV EXCEPTION (chrome earns a higher ceiling, still ≤ 250ms, decelerate `cubic-bezier(0.22,1,0.36,1)`,
  transform/opacity only, off Radix `data-state`):** a magic line (Radix `Indicator`) slides
  between triggers; caret rotates 180° on open; the panel grows origin-aware from its trigger
  (`scale(0.96→1)` + 8px rise + fade); items cascade (`--i` × 45ms); each item has a fill sweep +
  icon-chip fill (accent, icon inverts) + arrow nudge; "Apply" lifts + arrow-nudges; "Sign in"
  slides an underline; mobile items cascade + chevrons rotate. **Every hover state has a focus
  twin** (`group-focus-visible` / `:focus-visible`). Radix semantics stay untouched.
- The **nav is a SINGLE dark register (Stage 6.1 — consistency over theming):** the on-ink ramp +
  dark `.nav-glass` bar + solid dark panels/overlay, in every state on every page. No `usePathname`,
  no theme branching (deleted). The bar is always the dark glass (near-seamless over the ink hero,
  legible dark glass over white); it only gains a border once scrolled. The `.spine-van` also **faces
  its travel direction** (§6.1).

## 6. THE MORPH (Stop 3 — service-level figure, treatment "M-B heavy")
ONE hand-built SVG, three states (ambulatory / wheelchair / stretcher) via `[data-level]` on the
`.svc-stage` wrapper; the persistent head+torso pivots at the hip, apparatus groups crossfade —
transform + opacity only, never geometry/color attrs (each apparatus statically owns its token).
Treatment: `.svc-figure-heavy` = **2.9px** strokes; **filled** key shapes (wheel hub, stretcher
slab = `on-ink-muted`, feet, head); apparatus in the brighter `fig-wheel`/`fig-str`; **+15% scale**
(centered SVG transform, non-scaling-stroke). **All boldness is spent on the wheelchair** (the wheel
is the dominant filled shape) — the literal test is "can you INSTANTLY see the wheelchair?" judged
by screenshot at real size. Fixed `aspect-[4/3]` stage → zero CLS. Cycling is progress-bar-driven,
pauses off-screen/hover/focus, reduced-motion snaps between distinct static figures.
**PAUSE CONTROL (Stage 6.8, WCAG 2.2.2 Pause/Stop/Hide, Level A):** auto-advancing content that lasts
>5s needs a touch-reachable pause (hover-pause is skipped for touch pointers, so hover alone fails
2.2.2). The morph carries a real `<button>` (ink-glass chip, top-right of the stage, absolute → zero
CLS) mirroring the ProductDemo pause: the **APG media play/pause pattern — a changing accessible name
("Pause/Play service level cycle"), NO `aria-pressed`** (a play/pause whose action flips should not
also carry `aria-pressed` — that anti-pattern reads "Play … pressed"; the morph's level cards keep
`aria-pressed` because they are genuine selection toggles with stable names), the site focus ring,
works touch/mouse/keyboard, ≥24px hit target. **Explicit pause WINS over hover-resume** (it is OR-ed
into `paused`). Reduced-motion → no cycle, the control is not rendered.
- **TIMER VISIBILITY RULE (Stage 6.8):** every auto-cycle (ProductDemo, ServiceMorph, ProofSpotlight)
  folds `document.hidden` (a `visibilitychange` listener) into its `paused` state — an
  IntersectionObserver does NOT report a backgrounded tab as non-intersecting, so an offscreen gate
  alone leaves timers running in a hidden tab. The gate freezes the CSS fill (`animation-play-state`)
  or clears the `setTimeout`; return-to-visible resumes cleanly. Each auto-cycle ALSO IO-gates on
  offscreen (the hero console gained an IO in 6.8). Verify: backgrounded tab = zero running timers,
  clean resume, clean unmount.

## 6.1 ATMOSPHERE SYSTEMS (Stage 6) — raise atmosphere + motion density, NEVER hue loudness
The site should read **tech + transportation + serious, still calm**. Atmosphere and motion carry
that; the palette + tonal map v3 do NOT change (ink stays 3 chapters).

- **The living map — `<AmbientMap tone="light|ink" region="wide|dc|md|va">`** (`components/home/AmbientMap.tsx`,
  **v5 Stage 6.6 — REGIONAL COMPOSITIONS + AUTHORED CLEARANCE**): ONE reusable ambient system. Pure
  inline SVG, `aria-hidden`, absolute, FLAT, STATIC (the van is the motion), zero scroll listeners,
  server-rendered. **TWO LAYERS with a hard clearance contract:**
  - **(1) GRID** (`.ambient-map`, full-bleed, whisper) — a faint orthogonal street grid. This is the
    **ONLY decoration permitted under a text block, and only at whisper** (`strokeWidth 0.75`,
    inner `opacity 0.42` × group `opacity-[0.15]` light / `[0.12]` ink → ~0.06 effective; body text
    over it clears AA).
  - **(2) GUTTER FEATURES** (`.ambient-gutter`) — the region's distinct geography + landmark glyphs,
    physically PINNED to the left/right page gutters (two `w-[88px]` edge SVGs, `meet` so the glyph is
    never cropped) and shown **only at `xl` (≥1280)**, where the centred `max-w-6xl` container leaves a
    ~96px gutter that no text column reaches. Below `xl` the gutter collapses → features hide, grid
    whisper only (clearance-first on small screens). Group `opacity-[0.2]` light / `[0.16]` ink.
    **INSET-CARD EXCEPTION (Stage 6.6 review):** the gutter layer assumes a FULL-BLEED host (gutters
    pin to the VIEWPORT edge, where the clearance is). When the map is nested in an INSET card (the
    terminus footer), pass `gutter={false}` — the card's inset shifts the gutter inward and its
    arterial would graze the card's text column; grid-whisper only there.
- **PROTECTED-ZONE RULE (Stage 6.6, Task A — the clearance is AUTHORED, not just faded).** No landmark
  glyph, arterial, or dashed trip stroke may ever pass behind a text block. You achieve this by
  COMPOSITION — anchoring every feature to the gutters (as above) and/or authoring the section around
  its content columns — **not by lowering opacity until a stroke is "faint enough."** Only the fine
  street grid may sit under text, at whisper. **Landmark density: 2–3 glyphs per gutter (Stage 6.8;
  the cap rose because the owner wants more), always gutter-placed; adjacent sections never share a
  glyph; vary sizes so no two neighbours match scale.** The route/van also lives in the gutter and never
  overlaps a text column. **The bar is "PLACED, not FILLED"** — judge each region by screenshot at 1440
  and 768; if a gutter reads busy, REMOVE its weakest glyph (a glyph that does not read as its subject —
  e.g. the Stage-6.8 blue-crab, ambiguous at gutter scale — was authored then cut). **VOCABULARY HARD
  RULES: gutter-pinned only, zero strokes behind text, NO labels, NO institutions, NO flags/memorials,
  NO non-van transport modes (nothing airborne, no boats/vessels).**
- **REGIONAL COMPOSITIONS (Stage 6.6; vocabulary expanded 6.8) — three DISTINCT regions, NO labels /
  names (copy gate: decorative geography only). Current vocabulary:** **DC** = Capitol dome + arched
  Potomac bridge span (right) · L'Enfant diagonals + cherry-blossom sprig (left) · **MD** = Bay Bridge
  vertical span + screwpile lighthouse + tobacco-barn gable (right) · suburban arterials + Baltimore
  rowhouse gables (left) · **VA** = Pentagon + Blue Ridge ridgeline + Natural Bridge arch (right) ·
  colonial cupola + radial arterials + dogwood sprig (left) · **WIDE** = Potomac curve + Beltway arcs
  (geometric, NO shared landmark glyph) for the hero (footer is grid-only, `gutter={false}`). The
  `right` gutter carries the PRIMARY landmark (always clear of the left route-spine); the `left` a
  quieter secondary/arterial read. All glyphs hand-authored in the stroke grammar, unlabelled.
  Landmarks REVEAL play-once (fade/settle) as
  their section enters — ONE client `MapObserver` (in the layout, single IO) arms `.map-landmark`;
  default (no-JS / reduced-motion) = visible. **SECTION → REGION MAP (page travels DC→MD→VA down the
  scroll; no adjacent region OR glyph repeats):** hero = wide · credential = dc · Stop 1 = md · Stop 2 =
  va · Stop 3 (morph, ink) = dc · Stop 4 = md · proof band = va · provider = dc · CTA = md · footer =
  wide. **Audience-triage stays CLEAN** (no map). `tone="light"` = jade `text-accent`; `tone="ink"` =
  `text-on-ink`.
- **The proof SPOTLIGHT** (`components/home/ProofSpotlight.tsx`, Stage 6.5) — READABILITY FIRST, life
  second. The RESTING markup is fully legible on its own (**readability NEVER depends on motion**):
  proof lines ≥15px, one value step stronger on their surface (`text-default` / `text-on-ink`), icon
  chips a size step up (`h-7`). A thin CLIENT wrapper around the SERVER-rendered proof `<ul>` (icons
  stay in the server children — nothing crosses the RSC boundary) toggles `.is-active` on the
  `[data-proof-item]`s in turn (~3s each) WHILE the list is in view (IO-gated); CSS fills the active
  icon chip with accent + a ≤2px settle (transform/colour only → zero CLS). PAUSES on pointer/focus
  inside; hovering/focusing an item makes IT active. **Reduced-motion = NO cycle** (the client no-ops;
  every item at full resting readability). Applies to Stops 1-4 + the assist proofs; the provider
  teaser stays quiet. Timers/observers/listeners all cleaned up; offscreen the cycle stops.
- **The FULL-PAGE route** (`components/home/RouteOverlay.tsx`, Stage 6.4 — promoted from the section-
  bound SpineRail): ONE continuous scroll-drawn line runs from the spine's start, down through the
  proof band / audience triage / provider teaser / final CTA (in the left gutter, clear of every
  content column), curving gently to ARRIVE at the footer card's top edge aligned to the terminus
  motif — the trip visibly completes. A page-level overlay in the LAYOUT (offset parent spans the page
  + footer); it MEASURES the geometry in pixels (mount + resize only — `[data-spine-region]`,
  `[data-spine-stop]`×4, `[data-route-seam]` = the ink card, `[data-route-end]` = the motif), builds
  one path, and draws it via `pathLength=1` + dashoffset. Perf: one passive scroll listener → one rAF
  → one CSS var (`--route-progress`); zero layout reads per frame. Station nodes at the 4 stops; the
  line flips to `accent-on-ink` across the Stop-3 ink band via a measured gradient. DESKTOP ONLY
  (`lg`); mobile keeps the simplified stacked treatment (no line/van); reduced-motion / no-JS = the
  line fully drawn, nodes lit, no van (the complete static composition).
- **The livery VAN v2** (Task C) rides the route's FULL length via `offset-path` (set imperatively to
  the measured curve) + `offset-distance: calc(var(--route-progress) * 100%)`; `@supports (offset-path)`
  + armed-only gate. **NEXO livery, ~30px, a MODERN TRANSIT-VAN profile** (rounded roofline, sloped
  hood, window band, rocker line, hubbed wheels — never a box): white/`on-ink` FILLED body + INK
  outline + ONE jade `accent` stripe. Self-coloured so it POPS on the green line AND every background
  (body 4.5:1 on the line / 16:1 on ink; ink outline 18:1 on light/tint, 3.6:1 on the line). **NEVER
  red/orange, NEVER an ambulance.** Faces travel (nose rotation from 6.1, still by `data-direction`).
- **U-TURN LEG MACHINE (Stage 6.6, Task D — replaces the old direction-based lane).** The van's lane
  is driven by a LEG state (`data-leg`), not scroll direction, so mid-page reversals keep the lane and
  only the nose rotates. **OUTBOUND** rides the `+12px` right lane (on the inner `.route-van-lane`
  wrapper so `offset-path`/nose are untouched). **TERMINUS** (progress ≥ ~0.985) → commit `leg=return`;
  the lane's `translateX(12px)→translateX(-12px)` transition (~450ms decelerate) IS the visible U-turn
  across the line. **RETURN** rides the `-12px` left lane. Back at progress ≤ ~0.02 → silently reset to
  `outbound`. The spine `gutterX` sits at the container's outer edge `+2` so the outbound van's right
  edge stays clear of where any column's text begins. Reduced-motion = no van, no leg attr.
  (**Region toasts were REMOVED in Stage 6.7** — a name-chip beside the van read as noise. Regions,
  landmarks, lanes, and the U-turn all stay; there is no longer any `data-region` wiring, `.route-toast`
  CSS, or region-crossing detection.)
- **The assist scene** (`components/home/AssistScene.tsx`): a SECOND MOVEMENT inside the Stop-3 ink
  chapter (below the morph, hairline-separated). A member figure flanked by TWO attendant figures
  mid-assist, hand-built in the M-B heavy grammar — must pass the silhouette test "two people helping
  one, with care." Attendants = `on-ink-muted` (distinct but EQUAL dignity), member = `on-ink`,
  reinforced wheelchair = `fig-wheel`. **CONTACT, not a checkmark (Stage 6.4): NO floating symbols over
  the figures.** The assistance is explicit IN the figures — both attendants' hands are in visible
  CONTACT on the chair (armrests / grips), postures engaged; a securement strap (`svc-wheel` tone) on
  the frame; the settle ENDS in that contact (the final contact IS the reassurance). Motion = IO
  play-once SETTLE (attendants ease in from the sides, staggered, hands coming to rest on the chair) —
  **no loop** (a looping struggle reads wrong). Default = complete static composition (SSR / no-JS /
  reduced-motion). Dignity absolute: care never struggle, member central + equal dignity. Copy is the
  §7.1 offering; it is a MODIFIER on the 3 levels, never a 4th.

## NAV V2 (Stage 6, single register 6.1) — visibility rule
The nav hover/active state must be **unmistakable** (the owner could not see the old one): a visibly
lighter row fill (`--ink-hover`, 1.45:1 vs the ink-surface panel) + accent chip fill + arrow; the
title stays FULL on-ink (crisp). Resting dropdown chips are recessed `bg-ink` wells (icon carries
them); the panel is solid `bg-ink-surface`. The **magic line** is `accent-on-ink`, 2.5px, wide
(`62%`). Dropdown titles are `text-[15px]`, descriptions `text-sm`. **Nav triggers are full on-ink
WHITE at `font-medium` (Stage 6.4 older-reader pass)** — the magic line / caret / open panel carry
the state, so the trigger label needs no resting→hover colour shift (`text-on-ink` over the nav-glass
= 12.2:1 over white / 15.9:1 over ink). Motion ceiling unchanged (≤250ms, transform/opacity, focus
twins, reduced-motion instant).

## 6.2 THE TERMINUS FOOTER (Stage 6.3; ENDCAP 6.4) — end of the line, the page ALWAYS ends on ink
The homepage is one trip down a route line; the footer is the TERMINUS. `Footer.tsx` is an **inset
INK ENDCAP** (6.4 — NOT a floating raft): a full-width `bg-bg` section whose child is a **solid `--ink`**
card with **inset SIDE gutters** (light page visible left/right, `sm:px-6 lg:px-8`), generously
**rounded TOP corners** (`rounded-t-[28px]`/`sm:32px`) and a **SQUARE bottom FLUSH to the document
bottom** — no `pb`, no bottom gap: **the final pixels of the page are ink at every width.** At 390 it
goes **full-bleed** (no side gutters, rounded top only) so the gutter-to-bottom corners never read
awkward. The brand row gets generous vertical breathing room (the destination should feel like one).
`<AmbientMap tone="ink">` sits inside, **clipped to the rounded bounds** by `overflow-hidden`. The
full-page route (§6.1) lands on this card's TOP EDGE at the terminus motif (`data-route-seam` /
`data-route-end`). Solid ink only (glass is nav-only);
the on-ink ramp throughout; **exactly ONE `<footer>` (contentinfo) landmark** (the card is a plain
`div`; the link block is a `<nav aria-label="Footer">`). Composition top→bottom, hairline
`on-ink-border-strong` separators between zones: **(a) brand row** — the terminus motif + the one big
display wordmark (**the HERO of the card: `text-5xl` → `sm:text-6xl` → `lg:text-7xl`, on-ink 16:1**,
Stage 6.8 premium step) + a trim of the approved hero subline (`text-lg` on-ink-muted 8.4:1; no new
claims, no service-area verb) + the CTA pair (`primaryOnInk` Apply → /apply, `secondaryOnInk` Talk to
us → /contact); **(b) link columns** — the four nav columns (headers `text-base` on-ink; `text-base`
`on-ink-muted` links → white hover + the ring), 2-col wrap at 390; **(c/d) utility+legal row** —
© {year} {legalName} dba {name} (`text-[15px]`) · the launch-flagged
`SERVICE_AREA_LINE` · a real `<button>` **Back to top** (client leaf; `window.scrollTo` with
`behavior` gated by `prefers-reduced-motion` → instant) · Sign in (`accent-on-ink`).
- **The terminus motif:** a short **dashed `accent-on-ink` route** (the ambient map's trip language,
  dash 5/4.5) ENTERS the card from the left and TERMINATES at a filled **terminal station node**
  (ring + filled dot) capped by a **buffer-stop bar**, by the wordmark. STATIC (no loop; a confident
  "end of the line", never whimsy). Fixed SVG dims → zero CLS. The full-page route (§6.1) arrives at
  the card's top edge here, and this motif completes the last leg to the terminal node.
- **ARRIVAL CHOREOGRAPHY + MICRO-INTERACTIONS (Stage 6.8 — the premium terminus).** A client leaf
  `TerminusReveal` arms a **PLAY-ONCE** settle when the card first enters view (IO, `data-terminus-live`
  → `data-terminus-in`, then disconnect — **never on scroll-up**): the terminus line draws in
  (scaleX, `transform-box: fill-box`), the node scale-settles, the buffer tick lands, then the wordmark
  + mission rise in a 60–90ms stagger and the link columns follow with one group stagger. **Transform/
  opacity ONLY, perceived ≤600ms, decelerate; CLS ZERO** — the hidden initial state is armed
  client-side only (SSR holds every element at its final size/space), and it is armed ONLY when motion
  is allowed, so **SSR / reduced-motion render the COMPLETE static composition** (the global RM block
  would zero it anyway). **Micro-interactions adopt the nav grammar:** footer column links + Sign in get
  the `.footer-link` **underline-slide** (with a focus twin); **Back to top** gets a hover/focus lift +
  arrow-nudge (`group`); the footer Apply CTA reuses `.nav-apply` for parity. Every hover has a focus
  twin.

## 6.3 THE AUDIENCE-PAGE PATTERN (Stage 7) — /solutions/* on the finished system
> **COPY NOTE (Stage 8):** do NOT call the product "certified" in rendered copy — it is an
> unsubstantiated credential on a pre-live product (no accrediting authority named). Same class as bare
> "HIPAA compliant". If a real certification lands, gate the word behind a `launch.ts` flag like
> `COMPLIANCE_LINE`. "the finished/hardened system" is internal shorthand only, never on the page.
The four audience pages (`/solutions/mcos|providers|facilities|members`) INHERIT the homepage law; they
are ONE reusable arrangement of EXISTING pieces (`components/solutions/SolutionPage.tsx`), never a new
design. Server-rendered — no client, no cycle. Composition top→bottom: **eyebrow pill (audience + its
nav icon) → ONE display `h1` → subline → 3–4 PROOF SECTIONS in the stop grammar (kicker + `h2` claim +
optional body + icon proof lines) → ONE closing CTA band.**
- **Exactly ONE product-mock vignette per page**, in the light `MockCard` grammar ("Sample data" hinted,
  obviously fictional) — it makes its section two-column; the other sections are a single readable
  column. DOM order is always TEXT-then-mock (reading order) even when visually flipped (`lg:order`).
- **ONE primary action per page (the B5 rule):** the page BODY has exactly ONE actionable CTA — mcos =
  Talk to us → /contact · providers = Apply as provider → /apply · facilities = Talk to us → /contact ·
  members = Member sign in → `SITE.portalLogin("member")` (SAME-TAB portal handoff — see §7.4; NOT `target="_blank"`).
- **Tonal rhythm:** interior pages stay WHITE/TINT — the terminus footer is the page's ONLY ink (no new
  ink chapters). Hero = tint; proof sections alternate white/tint by parity; the CTA alternates off the
  section count; hairline `border-border` between bands.
- **AmbientMap — ONE region crop per page: mcos = DC · providers = VA · facilities = MD · members =
  WIDE.** The region's LANDMARK GLYPHS appear ONLY on the hero + CTA BOOKENDS (which are not adjacent, so
  the no-adjacent-glyph-repeat rule holds); the middle proof sections carry GRID WHISPER ONLY
  (`<AmbientMap gutter={false}>`) — texture without repeating the region's glyphs down the page.
- **Metadata:** each page exports its own `metadata` — a unique title (`"<Audience> — Nexo Access"`) + ONE
  gate-clean description sentence (full OG / JSON-LD / sitemap is a later stage).
- **The copy gate is PER-AUDIENCE (§7):** providers NEVER payment-speed or trip-volume (the 6.7 blocker
  class); members NEVER live tracking (scheduled times only); facilities BOOK rides (no will-call
  activation-flow claim); mcos timely-filing WARNS (never enforces); assist is an add-on, never a 4th
  level. Product-mock status uses the semantic tokens (warn = `text-warning`/`bg-warning-subtle` 4.8:1,
  pass = `accent`, held = neutral `muted`) — never invent a colour.

## 6.4 THE DEEP-PAGE / SECTION SUB-NAV PATTERN (Stage 8) — /platform
`/platform` is the deep page — the hero-CTA landing AND the target of the nav's four Platform anchors
(`#dispatch #claims-billing #compliance #oversight`). It extends §6.3:
- **HERO reuses `<ProductDemo/>`** as the opening proof — the self-contained ink CARD floats on a TINT
  hero (a product mock, NOT a new ink chapter). REUSE, never fork: the IO-offscreen pause, hidden-tab
  freeze, and reduced-motion static Scene 1 all come for free (verify, don't re-implement).
- **SECTION SUB-NAV (`components/platform/PlatformSubnav.tsx`, client):** a QUIET sticky bar under the
  main nav (`sticky top-16 z-30`, hairline `border-border` on `bg-surface`, `text-sm`, never competing
  with the primary nav). ONE IntersectionObserver marks the section nearest the top ACTIVE
  (`aria-current="true"`); real `<a href="#id">` (keyboard-operable, focus rings, no-JS-navigable) with
  smooth scroll gated by reduced-motion. At 390 the chips scroll horizontally — `overflow-x-auto` +
  `whitespace-nowrap` + `shrink-0`, no wrap, no page overflow.
- **ANCHOR LANDINGS — size for BOTH sticky bars:** every section carries `scroll-mt-[124px]` (nav 64 +
  sub-nav ~48 + breathing) so a heading lands fully below both bars from the nav-dropdown deep-link AND
  the sub-nav. **GOTCHA:** the browser's native hash jump (+ Next's hydration scroll) fires BEFORE fonts
  + the ProductDemo settle, so it lands early and content grows underneath it — one re-scroll is not
  enough (it gets overridden). PlatformSubnav RE-APPLIES `scrollIntoView(block:"start")` on a short
  interval (~1s, capped at 10 ticks) after mount, STOPPING on the first user wheel/touch/keydown so it
  never fights a real scroll. Verify the FULL matrix: 4 dropdown × 4 sub-nav × 390/768/1440 = every
  heading fully visible below both bars.
- **DUAL CTA is correct here** (mixed readers) — the B5 one-CTA rule is for the audience pages only.
- **AmbientMap:** wide composite at hero + CTA bookends, grid whisper (`gutter={false}`) in the four
  middle sections (glyphs only on the non-adjacent bookends).

## 6.5 THE TRUST PAGES (Stage 9) — /about + /contact
Text-led, NO product vignette — the interior grammar (eyebrow → h1 → prose/blocks → CTA), white/tint
only (the footer is the only ink). Copy gate additions in §7.2.
- **/about** — eyebrow → ONE h1 → STORY (2-3 short paragraphs, the operator's story, `FOUNDER_REF` only)
  → "What we hold ourselves to" (3 principle blocks: icon chip + title + line; the member block uses
  §7.1 dignity language) → a QUIET tint company-facts card (`FC Nexo LLC dba Nexo Access` · technology-
  first NEMT company · `SERVICE_AREA_LINE` · `SITE.email`) → dual CTA (Talk to us → /contact, Apply as
  provider → /apply). AmbientMap WIDE bookends, grid whisper middles.
- **/contact** — eyebrow → ONE h1 → subline (payers/facilities) → PRIMARY ACTION card: a real
  `mailto:${SITE.email}` button AND the address printed as SELECTABLE text beside it (NEVER mailto-only)
  + ONE soft line ("you'll hear back from the person who built the platform", NO SLA) → two quiet
  ROUTING cards (providers → /apply; MEMBERS → `SITE.portalLogin("member")`, SAME-TAB portal handoff (§7.4)
  — never route members to email) → `SERVICE_AREA_LINE`. The contact FORM now
  lives in the primary action card (§6.6); the `mailto:` path stays below as a quiet "Prefer email?" line
  (link + selectable address). AmbientMap DC bookends.

## 6.6 THE LEAD FORMS + EMAIL SEAM (Stage 10S) — static site, AWS SES, zero database
**ARCHITECTURE (law).** The site is **STATIC forever — zero database, zero Supabase, zero Resend, zero
PHI scope.** Lead forms email their submissions through **AWS SES v2 (region us-east-2)** and store
NOTHING. Pages stay static (○); Next **server actions** run on-demand (NOT `output: export`). Server
secrets ONLY (`AWS_SES_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) — NEVER `NEXT_PUBLIC_`;
`.env*.local` is gitignored, `.env.example` carries the NAMES only. The ONE sanctioned runtime
dependency is **`@aws-sdk/client-sesv2`** (hand-rolled SigV4 rejected). FUTURE (record, don't build):
when the platform deploys, the apply form MAY additionally POST to a platform-owned public lead endpoint.
- **THE SEAM — `src/lib/mail.ts` (server-only).** The ONLY module that talks to SES; swap vendors here.
  Server-only via a runtime `if (typeof window !== "undefined") throw` guard (NOT the `server-only`
  package — that breaks the one-dependency budget; the sole importer is the `"use server"` action, which
  Next never ships to the client). `readConfig()` reads env **at call time** → a missing var returns a
  typed friendly `unavailable`, never a crash / never a fake success. Lazy module-scoped `SESv2Client`.
  `sendLeadEmails()` = TWO legs: **(a) NOTIFICATION = system of record** (awaited; From `no-reply@`, To
  `providers@`[provider]/`info@`[contact], ReplyTo = submitter; its success IS the form's success),
  **(b) AUTO-ACK = best-effort** (From `info@`, To submitter; failure caught + logged, NEVER fails the
  form — absorbs SES-sandbox rejects of unverified submitters). Addresses derive from `SITE.domain`.
  **Plain-text bodies ONLY** (zero HTML-injection surface).
- **INJECTION HARDENING — `src/lib/leadSanitize.ts` (pure, unit-tested).** `clean(v)` strips CR/LF + all
  C0/C1 controls + DEL by CODE-POINT iteration (collapse runs → one space, trim) — implemented WITHOUT
  any literal control char / unicode-range regex in source (the Write tool mangles literal control bytes;
  build control-char TEST inputs with `String.fromCharCode`, run tests as `.mts`). EVERY value reaching a
  subject/body passes `clean()`; `buildSubject` caps the subject at 160 from the sanitized name only.
- **PROTECTIONS — the single `"use server"` action (`src/app/actions/leads.ts`).** Guard ORDER: honeypot
  (filled → silent `{ok:true}`, no send) → **min-elapsed-time (FAIL CLOSED:** `Number("")` is 0/finite,
  so check the raw string is present AND the value is a positive epoch AND elapsed ≥ 3s) → rate limit →
  validate (required / email shape / length caps / service-level + role whitelist) → send. `kind` is
  client-supplied → whitelisted. Typed `LeadState = {ok:true} | {ok:false, fieldErrors?, formError?}`;
  both `unavailable` + `send_failed` map to ONE generic banner (no SES detail leaks to the client — it
  goes to the server console only).
- **RATE LIMITING (in-memory, per-instance — honest caveat in code).** Per-IP window limit PLUS a
  **GLOBAL per-instance cap** as a spoof-PROOF backstop (the leftmost `x-forwarded-for` token is
  client-spoofable; prefer `x-real-ip`, pin the trusted-proxy boundary at deploy). Bound the IP map
  (evict elapsed keys / hard cap). The **auto-ack carries NO submitter text** (fixed "Hello," greeting;
  the name appears only in the internal notification) so no attacker content is reflected out through the
  domain, plus a **per-recipient ack cooldown** blunts using the ack as a reflection/bombing relay.
- **FORMS — `src/components/leads/`.** a11y primitives (`<label htmlFor>`+id, `aria-invalid` +
  `aria-describedby`, required `*` + sr-only, input EDGES use `border-control` for WCAG 1.4.11 ≥3:1, error
  text `text-danger`, checkbox group = `<fieldset><legend>`, off-screen honeypot `aria-hidden` +
  `tabIndex={-1}`). `useLeadForm` uses a MANUAL `pending` `useState` (not `useFormStatus`; robust on React
  18); moves focus to the first errored field / the success `role="status"` panel / the `role="alert"`
  banner. **The form OWNS its card heading** so the success panel cleanly replaces the whole thing (never a
  stale "fill this out" header above a confirmation); success/alert focus rings use `ring-offset-surface`.
  **/apply is HIGHEST-RISK copy — audit twice: NEVER payment speed, trip volume, or earnings.** PHI
  microcopy is mandatory on every lead form (§7.2).

## 6.7 THE LEGAL / POLICY PAGES (Stage 10S) — /privacy, /terms, /hipaa, /accessibility
`src/components/legal/LegalPage.tsx` — a calm prose layout in the certified type: eyebrow → ONE h1 →
optional lead → optional banner → NUMBERED `<h2>` sections, body **`text-lg`** (match the site's reading
columns), grid-whisper AmbientMap `gutter={false}` ONLY (no region glyphs, no vignettes), sequential
headings. **Port RULES:** substance ported UNCHANGED; entity/email/domain normalized to SITE constants
(`SITE.email` / `SITE.domain`); **NO invented "last updated" / effective dates** (a HIPAA NPP effective
date is owner-set via an `effectiveNote` prop; the statutory "respond within 30 days" is a legal timeframe,
kept — distinct from the marketing no-SLA rule). Keep the required HIPAA banner + the real HHS-OCR external
link (new-tab affordance). **/accessibility is NOT a verbatim port — it is an HONEST statement grounded in
the audits actually run** (contrast-by-luminance, keyboard, visible focus, reduced-motion, semantic
structure); it drops any phone / SLA / member-portal-dispatch claim. **GEOGRAPHY-IN-LEGAL:** keep the
seed's narrower REGULATORY language (e.g. "DC and Maryland" for Medicaid enrollment) rather than inventing
a wider claim — marketing may say the aspirational DC/MD/VA, but a legal doc must not assert an unverified
regulatory footprint (gate). Any security claim in a legal page follows the launch-flag doctrine (§7.2):
the privacy page says "**built for HIPAA compliance**", never an unverified "encrypted at rest" present fact.

## 6.8 THE SEO LAYER (Stage 11) — metadata, schema, sitemap, OG
- **`src/lib/seo.ts` — the SEO SINGLE SOURCE.** `ROUTE_META` (title + description + path per route) +
  `pageMeta()` (builds `alternates.canonical` + OpenGraph + Twitter). The root layout sets
  `metadataBase = new URL(SITE.domain)`, so every relative `path` resolves to an absolute APEX URL.
  Each page: `export const metadata = pageMeta(ROUTE_META.x)` (home inherits the root defaults).
- **Canonical = apex, no `www`, no trailing slash** on interior routes; the home canonical is the bare apex.
- **Titles.** Interior pattern **"{Page} | Nexo Access — NEMT for the DMV"**; homepage = brand + spelled-out
  primary query + region, **≤ 65 chars** ("Nexo Access | Non-Emergency Medical Transportation — DC, MD & VA"
  = 64). Set via `title.absolute` so a template never doubles the suffix.
- **Descriptions** ~150–160 chars, unique per route, gate-clean + query-lexicon-safe (§7.3).
- **ONE branded OG image** (`/public/og.png`, 1200×630, < 300 kB): ink field + terminus-node motif +
  Bricolage wordmark + the approved region line; wired site-wide with alt via `OG_IMAGE`; Twitter
  `summary_large_image`. `/public/logo.png` (512×512) for schema. Authored via a scratchpad HTML →
  Playwright screenshot (NOT a build dependency).
- **JSON-LD — `src/lib/schema.ts` SINGLE SOURCE**, one `<script type="application/ld+json">` in the root
  layout. `@type MedicalBusiness`; absolute URLs; email `info@`, telephone E.164, `areaServed` = DC
  (AdministrativeArea) + MD/VA (State). **NO `address`** (none public — omit the property), **NO
  aggregateRating / review / openingHours** (nothing invented — gate). Serialize with `schemaJson()`,
  which escapes `< > &` + U+2028/9 (prevents a `</script>` breakout while staying valid JSON).
- **`sitemap.ts` + `robots.ts`** (Next conventions): the sitemap lists all public routes as absolute apex
  URLs derived from `ROUTE_META` (no fabricated `lastModified`); robots allows all, sets apex `host`, and
  references the sitemap. **Zero `noindex` anywhere.**
- **Semantic floor:** exactly one h1/route, clean heading order, `<html lang>`, every decorative SVG hidden
  from AT (its own OR an ancestor `aria-hidden`), no unlabeled images. **GATE: Lighthouse SEO ≥ 90 AND
  Performance ≥ 90 on desktop AND mobile**, verified against the prod build.
- Redirect + post-deploy SEO decisions live in `DEPLOY-NOTES.md` (apex canonical; www + fcnexo.com 301→apex;
  Rich Results + Search Console + sitemap submission post-deploy; per-city pages as a future content layer).

## 7. THE COPY HONESTY GATE (verbatim — audit EVERY string, incl. aria-label, sr-only, alt, SVG title/desc)
**NEVER claim, imply, or depict:** GPS / live tracking / live map / ETA / "track your ride";
EDI / 837 / 835 / ERA / clearinghouse / electronic payer submission; a driver app or drivers using
the system / on-device capture; automated eligibility (EVS); bare **"HIPAA compliant" / "we are HIPAA
compliant"**, and **"100% HIPAA compliant" is PERMANENTLY BANNED in every variant** (no percentage /
"fully" / "100%" HIPAA claim, ever). Pre-verification the ONLY permitted phrasing is **"Built for
HIPAA compliance"**; the concrete infrastructure claim ("HIPAA-compliant infrastructure — hosted on
AWS under a signed BAA, encrypted in transit and at rest") renders ONLY behind the
`HIPAA_INFRA_VERIFIED` launch flag (§7.2). Also NEVER: analytics / BI dashboards; ANY volume or
performance statistic.
**LINKED ROUND-TRIP / MULTI-LEG CLAIMS ARE BANNED (Stage 14, strategy-chat §10.4).** The platform's
round-trip / multi-leg data model is a KNOWN OPEN structural bug, so copy must NEVER claim linked
round-trip booking — no "**booked as one linked trip**", no "**linked, time-validated legs**", no
"**as one trip**", no "**multi-stop**" booked-as-one framing, no van/vignette caption implying joined
legs. Offering **"round trips"** / **"recurring rides"** as a scheduled service is fine; the softened,
true-today framing is "**outbound and return trips scheduled around the appointment (including will-call
returns)**" — separate trips, never joined. GATED: the owner lifts this ONLY when the platform's
multi-leg redesign actually ships. (Assist copy §10.5 stays offering-level — never a platform
attendant-tracking/matching feature claim.)
**§10.6 — THE STATS BAND NUMBERS ARE CLAIMS, RE-COUNTED AT EVERY SHIP.** The permitted numbers below
(4 scrub / 7 adjudication / 13 frozen) are asserted CAPABILITY COUNTS, not decoration — this repo cannot
see the platform codebase, so **re-count them against the live platform at every deploy** (a DEPLOY-NOTES
launch-day step). If a count changed, the copy changed.
**PERMITTED numbers ONLY:** 4 scrub checks · 7 adjudication checks · 13 frozen fields · 2 appeal
levels · **3 service levels** · RLS on every table · DC/MD/VA. **Sample data must be OBVIOUSLY
fictional** (e.g. "J. Sample", "R. Doe", "Riverside Dialysis Center", "Silver Spring, MD",
"NX-1042", "CLM-3390"). When unsure, cut the claim.
**NO REAL INSTITUTION NAMES (Stage 6.5):** never a real hospital / health-system / payer / MCO name
anywhere — in copy OR in the map. A real name implies an affiliation Nexo has not established, and (per
`healthcare-phi-compliance`) is a credibility/compliance risk. The **ambient map is glyphs only — NO
text labels of any kind** (landmark glyphs are geographic silhouettes, never labelled).
**GEOGRAPHY NAMES ARE PERMITTED, INSTITUTIONS ARE NOT (Stage 6.6):** service-area place names — DC ·
Maryland · Virginia (and "Washington, DC") — are fine; a jurisdiction is not an affiliation. Never a
neighbourhood-as-endorsement, a landmark name, or any institution. Map landmark glyphs stay UNLABELLED
even though they depict a real monument / bridge / building / rowhouse / cupola / ridgeline (the
silhouette is decorative geography; a label would read as a claim).
**"PATTERN REPORTS" IS APPROVED COPY (Stage 6.8 owner ruling).** The nav Platform → "Oversight &
reporting" description ("Exception review, pattern reports, and CSV/Excel exports.") is CLEARED — it is
NOT the banned analytics/BI territory. Evidence: capability recon `admin/claims/actions.ts:1054–1154`
(pattern reports ship LIVE). Do NOT re-flag it in future audits. (Reporting/exports are operational;
the banned category is analytics/BI DASHBOARDS.)
**TYPOGRAPHIC APOSTROPHES ONLY (Stage 6.8).** Every user-visible string uses the curly apostrophe
`’` (U+2019) — never a straight `'` or `&apos;`. Grep BOTH glyph forms in source (code comments are
exempt); zero straight apostrophes may remain in rendered copy.
**SWEEP NOTE (Stage 6.7→6.8):** grep the NEVER list against SOURCE, not the rendered DOM — Radix
unmounts closed dropdown content, so nav-dropdown descriptions (`nav.ts`) never appear in a DOM string
dump. Audit `nav.ts` + footer data + all mounted-on-open content at the source level.

### 7.1 APPROVED OFFERINGS (Stage 5.1)
- **Bariatric & two-person assist** — an operational service offering by the owner (heavy-assist).
  Approved copy pattern: *"two or more trained attendants when a member's needs require it."*
- **Framing rules (enforced):**
  - It is always a **MODIFIER that layers ON the 3 service levels — NEVER a 4th service level.**
    "**3 service levels**" remains the ONLY level count anywhere on the site, and the morph stays
    exactly 3 states.
  - **Never claim platform enforcement** of assist/bariatric (credentialing, matching, etc.) until
    that feature actually ships — describe it as an operational offering, not a platform guarantee.
  - **Never guarantee a specific crew count beyond "two or more."**
  - **Dignity language is mandatory:** needs-based ("when a member's needs require it"), never
    size-as-spectacle, never clinical-gawking.

### 7.2 POSITIONING + LAUNCH FLAGS (Stage 6.2) — the operating model is UNDECIDED
FC Nexo's operating model (fleet **provider** / **broker** / **SaaS** / **hybrid**) is deliberately
undecided; copy must NOT commit to one.
- **Nexo self-description lexicon.** BANNED as a description of Nexo Access itself: **"provider",
  "broker", "operations platform"**, and any phrasing that commits to an operating model. The ONLY
  approved self-description is **"technology-first NEMT company"**. (Referring to the SOFTWARE as
  "the platform" / a product section named "Platform" / "the platform's code" is fine — that is the
  product a tech company builds, not an operating-model claim.)
- **Third-party "provider" is CORRECT and stays.** When "provider" names EXTERNAL fleet/transport
  companies it is proper NEMT vocabulary and MUST remain: "Apply as provider", "Transport
  providers", the partner funnel, `/solutions/providers`, the provider teaser, "A provider only
  receives service levels it is approved for". Audit intent, not the word: Nexo-as-provider = banned,
  fleet-company-as-provider = required.
- **Launch flags (`src/lib/launch.ts`).** Staged copy swaps; a flag flips ONLY on an EXPLICIT owner
  instruction, NEVER proactively:
  - `LIVE_OPERATIONS` (first real trips running) → the service-area copy. The ACTIVE verb
    **"serving" / "serves" a region is itself a gated operations claim** — until real trips run the
    site says "built for", never "serving". Two exports: `SERVICE_AREA_LINE` (chip/tagline: `false` =
    **"Built for DC · MD · VA"**, `true` = "Serving DC · MD · VA") + `SERVICE_AREA_PROSE` (running
    sentences: `false` = **"built for the DMV"**, `true` = "serving the DMV"). Consumed by the
    credential-strip chip, the footer legal row, AND the hero subline — ALL service-area language
    flips together. (The neutral region eyebrow "…· DC, MD & VA" has no verb and is exempt.)
  - `HIPAA_INFRA_VERIFIED` (platform verified in production on the BAA-covered AWS server, TLS +
    encryption-at-rest confirmed) → `COMPLIANCE_LINE`: `false` = **"Built for HIPAA compliance"**,
    `true` = the concrete infrastructure line. Consumed by the credential strip (+ any HIPAA phrase).
  - Both ship `false` → the site renders the honest current copy everywhere. Components import the
    strings from `launch.ts`; never hardcode the staged/current phrasing in a component.

### 7.2 TRUST-PAGE GATE ADDITIONS (Stage 9 — /about + /contact, but apply site-wide)
- **NO invented company theater:** no team grid, no advisory board, no office photos, no timeline, no
  FOUNDING YEAR (none supplied), no partner / client / press LOGOS, no headcount or scale implication.
- **The founder is referenced ONLY via `SITE.FOUNDER_REF`** (currently `"our founder"`, a one-string
  flip the owner may later set to a name). Keep it lowercase — copy never starts a sentence with it.
  Founder facts are limited to **years of hands-on NEMT operating experience in the DMV** + **built the
  platform**. NEVER a name, NEVER a prior or affiliated company.
- **NO street ADDRESS anywhere** (none is public). **PHONE is public by DELIBERATE PLACEMENT (Stage 11):**
  `SITE.phone` (`display` + `e164`) renders ONLY on the /contact primary-action card ("Call or email us" —
  a `tel:` link + the number as selectable text, mirroring the email row) and in the JSON-LD `telephone`.
  Do not scatter it elsewhere.
- **NO response-time promise / SLA** — "within 24 hours" (or any hours / business-days pledge) is
  BANNED. Soft framing only ("you'll hear back from the person who built the platform").
- **MEMBERS are never routed to email for rides** — always to the member portal (`SITE.portalLogin("member")`, same-tab; §7.4).
- **"certified" is banned in rendered copy** (Stage 8 — unsubstantiated credential on a pre-live
  product; gate it behind a `launch.ts` flag if a real certification ever lands).
- **PHI MICROCOPY on every lead form (Stage 10S):** "Please don't include any member or health
  information in this form." + a link to `/privacy`. The site collects NO PHI; the microcopy keeps it that
  way. The **auto-ack email is PUBLIC copy** — the no-SLA rule applies to it, and it carries ZERO
  submitter-supplied text (no attacker content reflected out through the domain).

### 7.3 THE SEO QUERY LEXICON (Stage 11) — metadata + schema are PUBLIC copy, audit them
Metadata (titles, descriptions, OG strings) and JSON-LD are gate-governed copy, not a keyword dumping
ground. Target-query terms **"NEMT provider" / "NEMT broker"** may appear ONLY as SEARCHER language or a
THIRD-PARTY reference (e.g. "for transport providers", "join the transport-provider network", "NEMT for
MCOs") — **NEVER as a description of Nexo Access itself** (the §7.2 lexicon stands: Nexo = "technology-first
NEMT company"; calling the SOFTWARE "the platform for non-emergency medical transportation (NEMT)" is fine).
Service-AREA keywords (DC / Maryland / Virginia / the DMV / "Washington, DC") are unrestricted. Service
CLAIMS stay launch-flag governed — **no "serving" in any title/description/OG string** until
`LIVE_OPERATIONS` ("Built for…" / neutral geography only). Visible-copy keyword weaving is MINIMAL and
surgical (one spelled-out "non-emergency medical transportation (NEMT)" where a human would write it),
each edit gate-audited. No keyword stuffing; no duplicate descriptions.

### 7.4 THE SIGN-IN / PORTAL DOCTRINE (Stage 15)
"Sign in" is a THIRD nav menu in the established grammar (Radix trigger + caret + magic-line
participation + solid-ink panel + item cascade), **not a bare link**. It lists exactly the THREE
customer-facing portal doors — **Member**, **Provider**, **Care portal** (for case managers &
facilities). Mobile: a fourth accordion group in the same grammar; the pinned CTA row keeps ONLY
"Apply as provider" so "Sign in" appears exactly once (no duplicate affordance).
- **ADMIN IS EXCLUDED FROM EVERY PUBLIC SURFACE — permanently.** The marketing site never links to,
  names, labels, or hints at an admin / staff / ops portal (nav, footer, sitemap, JSON-LD, visible
  copy, alt/aria/sr-only). Security posture: the admin door is not advertised. Only the three customer
  doors + the platform's own `/login` picker appear publicly.
- **ONE SOURCE for portal URLs — `SITE.portalLogin(portal)`** → `${appUrl}/login?portal=<member|provider|care>`.
  Never hardcode `/login?portal=…` anywhere. `?portal=` is a HINT the platform honors LATER
  (platform-repo task, flagged in DEPLOY-NOTES); TODAY an unknown/absent param lands gracefully on
  `SITE.loginUrl` (the picker), which is also the plain footer "Sign in" fallback.
- **Portal navigation is a SAME-TAB product handoff, not an external reference.** All OUR portal links
  open same-tab — **no `target="_blank"`, no `rel="noopener"`, no "(opens in a new tab)" cue.** (This
  is the amendment that flipped the members-page CTA + the /contact routing card + the footer to
  same-tab.) It applies ONLY to our portal doors; genuine THIRD-PARTY links — e.g. the HHS OCR
  complaint page on `/hipaa` — KEEP `target="_blank"` + the new-tab cue.
- **Portal-door subtitles are gate-clean (§7):** they describe portal CONTENTS ("See your upcoming and
  past rides.", "Claims, credentials & scheduling.") — **NEVER "track" / "tracking" / live status /
  ETA / map.** Member-facing language stays launch-flag governed.
- Harness: **I7 asserts the Sign-in trigger is present AND opens** — a regression back to a plain link
  drops it from the `aria-expanded` trigger set, which I7 now catches.

### 7.5 THE LOGIN SEAM CONTRACT (Stage 15.1) — the cross-repo handoff is LAW
The marketing site and the platform share ONE login seam. This contract is binding on BOTH repos.
- **THE THREE PUBLIC PORTALS — letter-identical (source of truth = `src/lib/nav.ts` `SIGNIN_ITEMS`).** The
  label AND the one-line description below must match byte-for-byte on the marketing Sign-in panel and on
  the platform's rendered portal panels:
  - **Member** — "See your upcoming and past rides."
  - **Provider** — "Claims, credentials & scheduling."
  - **Care portal** — "For case managers & facilities — schedule rides for the people in your care."
- **URL CONTRACT.** `SITE.portalLogin(portal)` → `${appUrl}/login?portal=member|provider|care` (single
  source — `src/lib/site.ts`; never hardcode the query). The platform reads `?portal=` and **renders that
  portal's sign-in panel directly**; an **absent or invalid** value falls back to the platform's own
  **picker** (`SITE.loginUrl` = `${appUrl}/login`, which is also the footer "Sign in").
- **ADMIN IS UNLISTED — on EVERY public surface, marketing AND the platform picker.** The admin door is
  never rendered, named, or linked anywhere a visitor can see it (nav, footer, sitemap, JSON-LD, the
  picker itself). It is reachable ONLY by going straight to it — `?portal=admin` or an `/admin*` path
  (which the platform may infer via `?next`). It is NOT one of the three public portals.
- **SAME-TAB always.** Portal navigation is a product handoff, not an external reference — no
  `target="_blank"` / `rel="noopener"` / "(opens in a new tab)" cue (see §7.4; genuine third-party links
  such as the HHS-OCR complaint page are exempt).
- **`?portal=` is PRESENTATION-ONLY.** It selects which panel the platform shows — nothing more.
  **Authorization stays role-based**; the door a user entered NEVER scopes, grants, or narrows
  credentials. A member who lands on `?portal=provider` is still a member; the param is never an authz
  signal.
- **BOTH-REPOS RULE.** Any change to a portal **name or description** must land in the marketing repo
  (`src/lib/nav.ts` + this §7.5) **and** the platform repo **in the same working session, letter-identical**
  — the strings are a shared contract, not independently-owned copy (cf. the NAP consistency rule).

## 8. THE VISUAL VERIFICATION LOOP (mandatory, every visual change)
Implement → run the production server → Playwright screenshots at **390 / 768 / 1280** (scratchpad
tooling, NOT a project dep) → **VIEW the images yourself** → write a critique against this law →
refine → re-shoot. Minimum one full refine cycle; do not report until your own critique passes.
Freeze the auto-playing console for fair comparison via `prefers-reduced-motion`. Build gotcha:
a dev server / `next start` and a build must **never share `.next`** (building under a running
server corrupts it → 500s/404s). Use **`npm run build:check`** for verification — it builds into a
SEPARATE `.next-check` dir (via `NEXT_DIST_DIR`, wired in `next.config.mjs` + `scripts/build-check.mjs`)
so it is safe to run while a server is up. Poll `curl` for HTTP 200 (a 404 page still fires
`domcontentloaded`).

## 9. VERIFY CHECKLIST (each stage)
tsc TRUE 0 · lint 0 warnings · build 0 · all routes static · copy grep clean · contrast table for
every new/changed pairing on its real surface · CLS + reduced-motion unchanged on demo/morph/spine ·
First Load JS reported (flag > 1 kB moves) · zero hardcoded hex outside globals.css. Then an
adversarial review (contrast highest-severity) with a verify pass; fix confirmed findings. **Any stage
that adds a server action / secret / user-input → outbound surface runs a DEDICATED SECURITY pass**
(key exposure, header/subject injection, rate-limit/throttle bypass, error-message info leak, reflected
outbound abuse). For a real external-send E2E on the owner's infrastructure, CONFIRM FIRST — it is
outward-facing (see the Stage-10S ask-before-send precedent).

## 10. THE QA SWEEP + REGRESSION RULE (Stage 12) — standing invariant harness
A permanent Playwright harness (`scripts/qa/`, run via **`npm run qa:sweep`**; `playwright` is a QA-only
**devDependency** — runtime deps stay zero) asserts the site's structural invariants against the PROD
build for EVERY route × 390/768/1440/1920 (+ a 404 check), and exits non-zero on any failure. It is
**law-protected: never deleted, never weakened — invariants are only ADDED.** Invariants I1–I14:
endcap/no-void (I1), no h-overflow (I2), one h1 + clean headings (I3), zero console errors/failed
requests (I4), CLS≈0 (I5), skip-link + focus rings (I6), nav dropdowns/mobile overlay (I7), footer
arrival settles to opacity 1 (I8), **/platform anchors land + light the correct chip for BOTH cold
deep-link AND client-nav — #dispatch never lights Oversight** (I9), reduced-motion static (I10), no-JS
SSR parity (I11), map gutter-glyph clearance (I12), forms render + honeypot hidden, never sends (I13),
metadata title/apex-canonical/og (I14).
- **THE REGRESSION RULE:** any change touching **shared chrome** — Navbar, Footer, root layout,
  AmbientMap, globals.css/tokens, the `site`/`launch`/`nav`/`seo`/`schema` libs, or the
  `SolutionPage`/`LegalPage`/`PlatformSubnav` patterns — MUST run `npm run qa:sweep` to full green before
  its stage may report. Shared chrome propagates; a green sweep proves no sibling route regressed.
- **HARNESS-vs-REAL discipline (Stage-12 lesson):** a probe failure is guilty until proven — but VERIFY
  it's a real defect, not a probe artifact, before "fixing" the site. Real bugs found the site with a
  screenshot/DOM diff; false positives were probe bugs (an SVG bbox extending past a clipped footer read
  as a "void"; a fast programmatic scroll skipping an IntersectionObserver; measuring decorative
  low-opacity nodes as "not arrived"; `scroll-behavior:smooth` making a synchronous `elementFromPoint`
  read the pre-scroll position). Fix the probe when it's wrong; fix the source when it's right.
- **THE #dispatch/scrollspy LESSON (S2, real bug fixed):** a scrollspy that picks "topmost section
  intersecting a band" lights the PREVIOUS section (its tail clips the band's top edge) and is sensitive
  to IntersectionObserver callback batching — so a client-nav settle fired a callback where only the
  prior section LEFT (empty set → active stuck one behind), while a cold scroll happened to fire the
  right final callback. The robust fix is a rAF-throttled scroll/resize handler that sets active = the
  LAST section whose top ≤ a trigger line matching the sections' `scroll-mt` — deterministic by POSITION,
  so cold + client-nav that settle at the same scroll always resolve to the same chip.

### 10.1 THE ENGINE CUBE + THE BROWSER/DEVICE-GAP LAW (Stage 16 — the engine gap, closed permanently)
The Stage-12 harness certified ONE engine (headless chromium) at desktop-ish widths, so two live defects
rode a whole deploy green: a **WHITE VOID** below the ink footer on the owner's iPhone (Safari overscroll +
URL-bar collapse reveal the ROOT background) and a **FROZEN MAGIC LINE** (the nav indicator stuck under the
first trigger). Neither is exotic — the harness simply never ran the engine or the device where they live.
Therefore, permanently:
- **THE SWEEP IS A CUBE: every route × invariant × ENGINE × PROFILE.** Engines = **chromium + webkit +
  firefox** (WebKit IS the Safari engine — the closest automatable proxy for iOS; Firefox is the
  tiebreaker). Profiles = the desktop widths (390 / 768 / 1440 / 1920) **plus** real device descriptors —
  at minimum a Playwright **iPhone** descriptor (touch, DPR 3, mobile UA) and one **Android** descriptor.
  `qa:sweep` runs the full cube by default; `QA_ENGINES` / `QA_PROFILES` / `QA_ROUTES` narrow it for
  iteration ONLY. **The harness never certifies a single engine again.** (Firefox contexts reject
  `isMobile`; the sweep strips it for Firefox so a device profile still runs there, minus that one flag.)
- **A BROWSER/DEVICE GAP MAY NEVER RIDE "NOT VERIFIED" ACROSS A DEPLOY.** It is either closed in-stage
  (fixed + proven green in every engine × profile) or **explicitly owner-accepted in writing**. "We didn't
  test Safari / iPhone" is NOT a NOT-VERIFIED line you may ship — it is a blocker.
- **EVERY ESCAPED DEFECT BECOMES A NAMED INVARIANT IN ITS FIX STAGE.** The white void → **I18** (the
  document root is ink-safe; nothing paints or scrolls white below the footer; scrollHeight sanity, per
  engine × profile). The frozen line → **I17** (for each desktop nav trigger, hover + open it and assert
  the visible indicator's x-center matches the trigger's, ±4px, per engine). Invariants are only ADDED.
- **THE DEPLOY GATE = full-cube green + the owner's 5-minute REAL-DEVICE checklist.** Playwright's WebKit
  is the Safari ENGINE but not the full iOS browser (no live URL-bar dynamics, no rubber-band physics), so
  the LAST rung is always human: the owner runs the checklist below on an ACTUAL iPhone before a deploy is
  blessed. A green cube is necessary, never sufficient.
- **ROOT CAUSES (record so they never recur):** (1) white void = `html`/`:root` had NO background (only
  `body` did, at near-white `--bg`); the ROOT paints the overscroll region, so `html { background:
  var(--ink) }` is mandatory, and `100vh` / `min-h-screen` on the body migrates to `svh` / `dvh` (WebKit's
  dynamic toolbar inflates `vh`). (2) frozen line = each `NavigationMenu.Item` was `position: relative`,
  making it the trigger's `offsetParent`, so Radix read every trigger's `offsetLeft` as 0 and never moved
  the indicator; the Item must stay STATIC (the shared Root becomes the offsetParent, matching the
  Indicator) and the dropdown panel gets its OWN `relative` wrapper — a sibling of the trigger, never an
  ancestor.

**THE REAL-DEVICE CHECKLIST (owner, ~5 min on an actual iPhone, EVERY deploy — WebKit automation cannot replace it):**
1. Hard-refresh the homepage; scroll to the ABSOLUTE bottom — the page ends on the ink footer endcap, NO
   white, and bouncing / overscrolling past the bottom shows INK, never a white flash.
2. Open every nav menu (Platform / Solutions / Company, + Sign in when `PORTAL_LIVE`) — the magic line
   FOLLOWS the open menu each time, smoothly.
3. Watch the van journey down the homepage + the U-turn at the footer.
4. Watch the footer arrival choreography settle.
5. Focus one form field (tab or tap) — the focus ring shows.
6. Repeat the bottom-scroll (no white) on `/platform` and one `/solutions/*` page.
