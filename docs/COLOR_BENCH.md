# COLOR HARDENING BENCH — P3-W4 / C3

**Task #15, 2026-08-18. Branch `v2`.** Bench: [`docs/color-bench/index.html`](./color-bench/index.html) —
open it directly, no build step. **`docs/` tooling; never shipped, never in the app bundle.**

**The question is narrow.** Identity is settled — the palette is Railway-derived and the owner re-picked
Railway blind (§13a). **Deltas are the question.** C3 on the defect register says *"subtle palette on cheap
monitors"*, and until now there was no instrument to measure it.

---

## 1. STEP-DELTA DESIGN — so a reading converts to a value

Every staircase is **generated as multiples of the live token's own delta**, so **"1.00× = CURRENT" is true by
construction**, not by eyeballing. Each rung prints its resulting hex and its computed contrast ratio.

| Ladder | From → to (the CURRENT delta = 1.00×) | Multipliers | CURRENT |
|---|---|---|---|
| **A** light surface | `#ffffff` → `#fafbfc` (`--bg`) | 0.25 · 0.5 · 0.75 · **1** · 1.5 · 2 · 3 · 4 · 5 · 6.5 · 8 · 10 | **A04**, `#fafbfc`, **1.036:1** |
| **B** ink surface | `#0b1512` (`--ink`) → `#12201b` (`--ink-surface`) | same 12 | **B04**, `#12201b` |
| **C1** nav glass | absolute alpha | 0.50 → 1.00, 10 rungs | **C1-07**, α **0.90** |
| **C2** ink glass | absolute alpha | 0.35 → 1.00, 10 rungs | **C2-06**, α **0.70** |
| **E1** light border | `#ffffff` → `#ebedf1` (`--border`) | same 12 | **E1-04**, `#ebedf1` |
| **E2** ink border | `#12201b` → `#35504a` (`--on-ink-border`) | 0.25 · 0.5 · 0.75 · **1** · 1.3 · 1.6 · 1.9 · 2.2 · 2.5 · 2.8 · 3.0 · 3.2 | **E2-04**, `#35504a` |

**E2 has its own shorter ceiling on purpose.** `--on-ink-border` already sits well up the ramp, so the shared
10× range clamped past white and left the brand family entirely. 3.2× is the last rung that is still a
**jade-cast** border rather than a grey one.

**Specimens are UI fragments, not swatches** — a card on a page, a raised card on ink, a glass panel over a
busy backdrop, a bordered claim tile. Real shapes reveal what swatches hide.

**IDs are globally unique** (`A04`, `C1-07`, `E2-04`, `D-L02`) because a reading has to survive being **read
aloud over a phone**. "Step four" identified six different specimens before this was fixed.

---

## 2. THE DANGER INVENTORY — current values under test

| Risk | Tokens | Current value | Why it is on the list |
|---|---|---|---|
| Near-white surface split | `--bg` vs `--surface` | `#fafbfc` vs `#ffffff` — **1.036:1** | The flagship C3 risk. A card may simply not separate from the page |
| Tint bands | `--surface-tint`, `--surface-hover` | `#f4f9f7`, `#f3f5f8` | Section banding may read as a rendering artifact |
| Light hairlines | `--border`, `--border-strong` | `#ebedf1`, `#dcdfe4` | A vanished border takes the card's shape with it |
| Control edge | `--border-control` | `#7e8d86` | Must clear 1.4.11 3:1 — it does, at 3.36:1 |
| Ink steps | `--ink` / `--ink-surface` / `--ink-hover` | `#0b1512` / `#12201b` / `#264035` | Near-black steps are the first thing a cheap panel crushes |
| On-ink edges (two tiers) | `--on-ink-border` / `--on-ink-border-strong` | `#35504a` (2.12:1) / `#4a6b60` (3.15:1) | The divider tier is deliberately sub-3:1 |
| Glass | `--nav-glass` / `--ink-glass` | `rgb(12 23 19 / 0.90)` / `rgb(22 42 34 / 0.70)` | Low alpha over a busy hero is the worst case |
| Light text ramp | `--text` / `--text-muted` / `--text-subtle` / `--text-disabled` | `#0c1512` / `#42544c` / `#4b5c53` / `#b6c2ba` | **`--text-muted` and `--text-subtle` differ by ~1 step and may be indistinguishable** |
| Ink text ramp | `--on-ink` / `--on-ink-muted` | `#e9f1ee` / `#adbfb8` | — |

**`--text-disabled` is labelled WCAG 1.4.3 EXEMPT**, not a failure — disabled controls are outside the
contrast minimum, and flagging it red would have taught the owner to distrust the instrument.

---

## 3. VERIFICATION

**Fonts:** the Task #12 amended standing check (prime with `document.fonts.load()` first) — **3/3 loaded** at
1440 and 390, deltas 138.1 / 34.1 / 162.6. The bench **dogfoods the D21 type tokens**.

**Structure:** 68 ladder specimens (12/12/10/10/12/12) + 8 ramp rows + 3 danger pairs. **6 CURRENT markers,
one per ladder, all verified against the real token values.** Zero horizontal overflow at 390/768/1440/1920.
Zero console errors, zero failed requests.

**Arithmetic — the check that matters most, re-run after the fix: 48 rungs, ZERO mismatches, max printed
ratio 8.690:1** (inside the 21:1 physical ceiling).

## 4. IMPECCABLE — findings and responses

Two independent assessments. **Detector: 1 finding** (`em-dash-overuse`, warning) — non-vacuous control: the
same scan fires 4 findings on the sibling type bench. **Assessment A: 22/40.**

| # | Finding | Sev | Response |
|---|---|---|---|
| 1 | **The instrument mislabelled its own steps.** `ratio()` was fed the *unclamped* mix while the hex was clamped, so E2-09…12 printed **impossible ratios up to 71.39:1** and two rungs were duplicate white | **BLOCKER** | **FIXED.** Clamp + round **once, at the source**, so every downstream consumer reads the same integer triple. Re-verified: 48 rungs, 0 mismatches, max 8.690:1. **A measuring instrument that mislabels its own steps is worse than no instrument** |
| 2 | **The bench canvas was `--bg #fafbfc` — the exact value of A04 (CURRENT).** The flagship specimen had no ground to separate from; the reading measured the frame | **P0** | **FIXED.** Canvas is now an **off-palette grey `#c9ced3`** that appears on no ladder |
| 3 | **F1's CURRENT was an invented nav state** (0.6-alpha edge); `Navbar.tsx` ships `border-transparent` at page top and a full-opacity border when scrolled | **P0** | **FIXED.** CURRENT now renders the real scrolled state, and the note says plainly that the page-top state has **no border at all** — the harder case |
| 4 | **`.cur-ring` donated the very edge the specimen is being tested for**, biasing A04 most | **P1** | **FIXED.** Outline removed; CURRENT is marked in the number row only |
| 5 | **Readings were not uniquely addressable** — "01" occurred six times; `0.50×` meant a multiple in A/B/E but an absolute alpha in C | **P1** | **FIXED.** Global prefixes (`A04`, `C1-07`, `D-L02`) and C now prints `α 0.50` |
| 6 | **`--text-disabled` was red-flagged "✗ under 4.5"** though WCAG 1.4.3 exempts it | **P1** | **FIXED.** Labelled EXEMPT; zero false red flags remain |
| 7 | **The bench pre-endorsed its own proposals** (PROPOSED in accent green vs grey CURRENT), and F2's note misstated `globals.css` | **P2** | **FIXED.** Both labels neutral; the F2 note now says the current pairing is **deliberate** and PROPOSED is a change to it, not a fix to a mistake |
| 8 | Section C prints alpha but no ratio — the one place text sits over a variable composite is the one place the bench refuses to compute | **P1** | **NOT DONE, recorded.** Correct and worth doing; it needs worst-case compositing over the backdrop's lightest and darkest pixels. **Deferred to the implementation task** rather than half-built here |
| 9 | No `prefers-reduced-motion` block; 0.16s colour transitions survive `reduce` | **LOW** | **NOT DONE, recorded.** Colour-only, non-vestibular, on internal tooling |
| 10 | Smallest bench type is 10.5–11px, under the project's ≥13px floor — on the page meant for cheap screens | **LOW** | **NOT DONE, recorded** — and it is the most ironic finding in the set. Worth fixing before the cheap-panel session |

---

## 5. PROTOCOL

> **Owner readings per machine → hardening thresholds → implementation task (with the DISC-20 hex guard)
> after readings. Identity is not in question (Railway receipt); deltas are.**

Per machine: the **first visible step number** in A, B, C1, C2, E1, E2; any **D row that becomes hard to
read**; any **F fragment where CURRENT loses structure**. **Good monitor first as the control, then the old
and cheap machines — those second readings are the data.**

---

## 6. RESOLUTION — readings taken, palette hardened (2026-08-18, D23)

**Readings** (two devices: a high-end display as the control, a standard laptop as the OPERATIVE floor —
the floor is always the worse machine):

| Ladder | What it measured | Floor read | Multiplier |
|---|---|---|---|
| A | light surface vs a white card | **A06** | 2.0× |
| B | raised ink card vs the ink field | **B06** | 2.0× |
| C1 | nav glass alpha | **≈0.75** | — |
| C2 | ink-card glass alpha | **≈0.60** | — |
| E1 | light hairline on white | **E1-07** | 3.0× |
| E2 | on-ink border on the ink card | **E2-05** | 1.3× |
| D | text ramps | **D-L04 exempt** (`--text-disabled`, WCAG 1.4.3) | — |
| F | composed fragments | **F1 + F3 CURRENT collapse on both devices** | PROPOSED adopted |

**Applied** — every value is this bench's own `mix(from, to, k)` at the read rung, converted rather than
re-invented:

| Token | OLD | NEW | Rung |
|---|---|---|---|
| `--bg` | `#fafbfc` | `#f5f7f9` | A06 |
| `--surface-hover` | `#f3f5f8` | `#e7ebf1` | A06 |
| `--surface-tint` | `#f4f9f7` | `#e9f3ef` | A06 |
| `--surface-alt` | `#f5f7fa` | `#ebeff5` | A06 (extension) |
| `--input-bg` | `#f7f9fb` | `#eff3f7` | A06 (extension) |
| `--border` | `#ebedf1` | `#c3c9d5` | E1-07 |
| `--border-strong` | `#dcdfe4` | `#969fae` | E1-07 |
| `--surface-tint-border` | `#dbeae3` | `#93c0ab` | E1-07 |
| `--ink-surface` | `#12201b` | `#192b24` | B06 |
| `--on-ink-border` | `#35504a` | `#405e58` | E2-05 |
| `--on-ink-border-strong` | `#4a6b60` | `#5b8275` | E2-05 |
| `--ink-hover` | `#264035` | `#2e4d40` | **re-derived, not a rung** |

### The three judgment calls, stated plainly

**1. `--ink-hover` is the one token a reading did NOT set, and forcing one on it created a real AA failure.**
The B ladder measured `--ink-surface`, a raised *card*. `--ink-hover` is a nav-row hover *fill with text on
it*. Carrying B06's 2.0× across gave `#416b58`, which dropped `--on-ink-muted` from 5.85:1 to **3.15:1** —
below AA, caused entirely by extrapolating a reading past what it measured. It is derived instead from its
own two constraints (muted text ≥ 4.5:1; visibly lighter than `--ink-surface`), landing at 1.30×: text
**4.85:1** with margin, and separation **rises** to 1.59:1 from 1.50:1. The hover reads *more* than before
while its text got *safer*. **Where a perception floor and AA conflict, AA wins.**

**2. Glass was held, and F1 was adopted only in half.** F1's PROPOSED pane raised the nav alpha 0.90 → 0.96
*and* promoted its edge. But the C1 reading put the alpha floor at **0.75 — below the shipped 0.90**, so the
alpha already cleared its own floor and floors-only-rise gives no mandate to move it. The fragment's collapse
was the **edge**, and the edge is what moved (divider tier → card tier, on a token that is itself hardened, so
it gains twice: 2.85:1 → **3.47:1** against the surface it actually sits on, finally clearing the 3:1 floor
the "strong" tier is *named* for and had never met there). The page-top no-border state is unchanged by design.

**3. F3's band half was deliberately not applied as a blanket swap.** The rule half shipped everywhere: all
**15** section and sticky-chrome boundaries moved to `--border-strong`, while the **34** card edges stayed on
`--border` (a card edge is a different tier from a section boundary). The band half — "swap `--bg` for
`--surface-tint`" — was *not* applied globally, because the site already alternates `--bg` against
`--surface-tint`; turning every `--bg` section into tint would leave **every** section tinted and destroy the
white register the tonal map (nexo-brand §1) is built on. The band half is satisfied by hardening instead:
both bands are A06-lifted, so the alternation reads without collapsing a register.

### Watch item

`--accent` on `--surface-tint` is **4.54:1** — the tightest margin in the palette, 0.04 above AA. Darkening
`--surface-tint` any further fails accent text on it. Recompute that pairing before touching the value.

### Status of this bench

**Re-mirrored to the hardened palette** (`docs/color-bench/index.html`): every CURRENT marker and ladder
anchor is now the post-hardening token, each mirrored token carries its pre-hardening value as **PREVIOUS**,
and a banner states that pre-2026-08-18 readings were taken against the PREVIOUS column. A re-read on the same
laptop should now find the first visible step **at or below 1.00×**; if it does not, the floor rises again.
Finding 8 from §4 (section C prints alpha but no ratio) **remains open** — glass was held this task, so the
worst-case composite ratio it asked for was not needed to decide anything, and it is still worth building.

---

## 7. DIRECTION ROUND — three colour futures (Task #24, 2026-08-19)

**Instrument:** `docs/color-direction-bench/index.html`, one self-contained `file://`-ready page.
**Trigger:** owner taste event S-012, GitLab named as a colour and starting-design reference.
**Status: OPEN. No direction is chosen here.** The bench produces an owner ruling, **D25**.

### Bench design

Three directions, each rendered as **the same four fragments from identical markup** so only the tokens
differ: (i) hero at real scale with the approved lede, (ii) a **status row** carrying the real pills
(refused / timely-filing / credentials-current), (iii) a dark-card trio with Nexo content, (iv) an ink
terminus. D21 type tokens are dogfooded. Every fragment prints its own contrast ratios with floors and
pass/fail, computed live. A **GROUP BY** control re-groups the twelve fragments by fragment index so the
same fragment from all three directions can be read adjacent instead of from memory.

**The status row is the point of the whole instrument.** Warm brands collide with alarm semantics, and
that collision cannot be settled by argument, so it is rendered inside every direction, D3 included and
unflinched.

### The warm family, and why it is this one

The D2 warm family was chosen by **colour geometry, not mood**. Jade sits at hue **159°**, so its
complement is ~339° (rose) and its split-complement neighbour is ~35° (apricot). Complementary warmth
*harmonises* with jade rather than muddying it, which is why the family is sand/coral/rose and why a
yellow-green or teal warm was never a candidate.

| Direction | Tokens |
|---|---|
| **D1 CURRENT** | The hardened jade system exactly as shipped. Atmosphere is the faint jade grid that ships today. Control. |
| **D2 SYNTHESIS** | Identity tokens **byte-identical to D1**. The only change is a warm atmosphere LAYER: apricot `rgba(244,168,116,.28)` anchored at `104% 52%`, rose `rgba(238,138,150,.24)` at `4% 104%`, plus a faint haze, all off-canvas with alpha falloff. |
| **D3 WARM PIVOT** | Full re-token. Accent `#9a3412`, ink `#110b09`, ink-surface `#32211c`, on-ink `#f5ece8`, card edge `#957064`, page `#f8f4f1`, and a GitLab-strength fire atmosphere. |

### Tuning rationale, with the numbers that forced each choice

- **D2 alphas are capped at 0.28** and both suns are anchored off-canvas. Higher alphas pushed
  `--accent` below AA over the field.
- **Accent text on the warm field must be `--accent-hover`.** Measured: plain `--accent` lands at
  **4.25** at the worst painted pixel in the lede's own column (fails 4.5); `--accent-hover` holds
  **5.40**. `nexo-brand §3` already designates `--accent-hover` as the deeper-field substitute, so this
  is existing law rather than a new exception, but it is a real constraint on the design.
- **D3's warm ink pair was re-tuned to clear D23.** The prettier, warmer pairs measured **1.17 to 1.23**
  separation and were rejected for falling under the shipped jade value of 1.25. `#110b09 / #32211c`
  measures **1.27**. **Floors-only-rise binds every direction, whatever the hue.**
- **D3's card edge was re-tuned mid-build.** `#7a5a4e` measured **2.48** against the warm ink surface,
  failing the 3:1 card-edge tier that D1's jade clears at 3.47. `#957064` measures **3.49**, matching
  jade's headroom.

### THE NUMBER THAT MAKES THE COLLISION ARGUABLE-FREE

Hue distance between the brand accent and the **danger red** (`#c81e2c`, hue 355°):

| Direction | Accent | Hue | Distance from danger |
|---|---|---|---|
| D1 / D2 | `#0b7d56` jade | 159° | **164°** |
| D3 ember | `#9a3412` | 15° | **20°** |
| (a rose warm) | `#be123c` | 345° | **10°** |
| (GitLab's own orange) | `#ee5c12` | 20° | 25° |

A warm brand puts the identity **10 to 25 degrees from the alarm colour**. Jade sits **164 degrees**
away, nearly opposite on the wheel. That is the semantic cost of D3, measured rather than asserted.
A second, subtler cost is visible in the rendered D3 status row: because the page is warm, the **green
"credentials current" pill becomes the visual outlier**, which inverts the intended hierarchy — the
quiet good state should not be the loudest thing in the row.

### Verification

- **Font check (primed per the Task #12 amendment):** Bricolage Grotesque LOADED, Hanken Grotesk LOADED,
  IBM Plex Mono LOADED.
- **Screenshots at 1440 and 390 for all three directions, viewed.** D3 stacks correctly at 390; the
  status row wraps to two lines and the cards stack.
- **All twelve fragment ratio sets pass** their floors in both group-by modes. Zero console errors at
  either width.
- **A measurement corrected my own analysis mid-build.** The bench first scored text against the
  theoretical *sun core* and reported D3's lede failing at 4.06. Sampling the **actual painted pixels**
  in the lede's own column (the suns are anchored off-canvas, so the core is never reachable under text)
  returned **7.37**. D3 was being condemned by an assumption. The bench now reports measured values and
  demotes the sun-core figure to an information row.

### impeccable — findings and responses

Run against the bench before handoff. **Assessment independence: degraded** (sub-agents were not used;
session policy restricts the Agent tool, so Assessment A and B ran sequentially per the documented
fallback). Heuristic average **3.1/4**. Snapshot persisted under `.impeccable/critique/`.

| # | Severity | Finding | Response |
|---|---|---|---|
| 1 | **P1** | The bench's entire job is comparison, but it only supported sequential reading. Weighing D1's hero against D3's meant holding the first in memory across ~2 screens of scroll. | **FIXED.** Added the **GROUP BY → FRAGMENT** mode. Verified: 4 rows, 12 direction blocks, correct headers, zero ratio failures, clean restore. |
| 2 | **P1** | The two-machine reading requirement lived only in the protocol card at the foot, after the impression is already formed. | **FIXED**, and partially downgraded on review: the core instruction was already in the opening lede. The two-machine requirement now sits there too. |
| 3 | **P2** | NOTES strips ran the full 1180px container, past the 65–75ch body cap. | **FIXED.** Capped at 78ch. |
| 4 | **P2** | Detector: **em-dash overuse, 26 in body copy** — a real AI cadence tell. | **FIXED** with 20 sentence-level rewrites, done individually because automatic dash-stripping breaks grammar. **Detector now returns `[]`.** |
| 5 | **P3** | The dark-card trio is three identical cards (the identical-card-grid pattern). | **ACCEPTED, not fixed.** The fragment exists to render the site's *actual* card system for comparison; restyling it would break the thing it is for. Recorded so it is not mistaken for a reflex. |

Two further patterns were checked and judged **earned rather than reflexive**: the numbered uppercase
fragment labels (the fragments genuinely are an enumerated comparison set, and the numbers carry
which-fragment-am-I-looking-at information across three directions) and the `repeating-linear-gradient`
grid lines (these render the site's shipped AmbientMap grid, so identity-preservation wins over the
codex-decoration ban).

### PROTOCOL

> **Owner reads on both machines, reacts by direction number; ruling becomes D25 — adopt, synthesize,
> or hold. Until ruled, the hardened jade palette remains law. Any adoption then goes through a full
> token-implementation task with cube and AA re-verification, floors-only-rise honoured.**

Three further notes for that ruling:

1. **The layers split** (S-012): atmosphere, composition, and card treatment can be adopted
   independently. **D2 is precisely "atmosphere only"**, which is why it carries zero identity risk.
2. **The atmosphere technique is free.** It is six CSS declarations, zero bytes, zero JS, no animation
   (`docs/DESIGN_RESEARCH.md` §14a). What makes GitLab's own page slow — 136 script requests, 804 kB of
   JavaScript, FCP 3812ms — has nothing to do with the part the owner liked.
3. **The bench cannot answer one question and should not pretend to:** whether the warm thesis
   (*neither fully medical nor fully technology*) is worth the status-semantics cost. It renders the
   cost. The judgement is the owner's.
