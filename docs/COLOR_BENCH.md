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

---

## 8. TUNED ROUND — three temperatures on the ruled direction (Task #26, 2026-08-20)

**D25 is ruled: D2 SYNTHESIS.** Jade stays the identity and owns every interactive, primary and status
surface. Warmth enters as **atmosphere only** and is **semantically silent**. What this round settles is
**how warm**, and it is the owner's pick.

**Instrument:** `docs/color-direction-bench/tuned.html`, one self-contained `file://` page.
Three temperatures, four identical fragments each, tokenised so only the glow layer changes. The
GROUP-BY comparison mode from Task #24 is reused. **Status: OPEN pending the owner's T-pick.**

### The exact radial layers

**T1 · ROSE SOLO** — the quietest reading. One sun off the right edge plus a faint low-left companion
so the field has direction rather than a single blob.

```
light: radial-gradient(72% 86% at 104% 50%, rgba(245,143,156,.26) 0, rgba(247,170,180,.15) 28%, rgba(252,214,219,.05) 56%, rgba(255,236,238,0) 74%)
       radial-gradient(38% 72% at 4% 102%, rgba(247,146,154,.13) 0, rgba(252,214,219,.04) 44%, rgba(255,240,242,0) 72%)
ink:   radial-gradient(66% 80% at 104% 40%, rgba(245,143,156,.20) 0, rgba(245,143,156,.10) 30%, rgba(245,143,156,.03) 58%, rgba(245,143,156,0) 78%)
       radial-gradient(48% 62% at -6% 98%, rgba(247,146,154,.13) 0, rgba(247,146,154,.04) 42%, rgba(247,146,154,0) 72%)
```

**T2 · ROSE + VIOLET** — the two-sun geometry in our hues. Violet is held **below** the rose in alpha on
purpose: `--svc-wheel` already owns violet semantically, so a violet strong enough to read as *a colour*
would start competing with a service level.

```
light: radial-gradient(70% 84% at 104% 46%, rgba(245,143,156,.25) 0, rgba(247,170,180,.14) 28%, rgba(252,214,219,.04) 56%, rgba(255,236,238,0) 74%)
       radial-gradient(58% 74% at 2% 104%, rgba(141,111,211,.17) 0, rgba(171,148,224,.09) 30%, rgba(214,203,242,.03) 58%, rgba(232,226,248,0) 76%)
       radial-gradient(30% 64% at 66% 88%, rgba(245,143,156,.07) 0, rgba(255,240,242,0) 70%)
ink:   radial-gradient(64% 78% at 104% 38%, rgba(245,143,156,.19) 0, rgba(245,143,156,.09) 30%, rgba(245,143,156,.03) 58%, rgba(245,143,156,0) 78%)
       radial-gradient(54% 66% at -6% 96%, rgba(141,111,211,.16) 0, rgba(141,111,211,.06) 38%, rgba(141,111,211,0) 72%)
```

**T3 · ROSE + APRICOT** — the Task #24 pairing re-anchored to the owner's rose. Apricot sun right, rose
sun low-left: GitLab's arrangement in our family, and the warmest of the three.

```
light: radial-gradient(70% 84% at 104% 50%, rgba(244,168,116,.25) 0, rgba(246,186,146,.15) 28%, rgba(250,214,190,.05) 56%, rgba(255,235,222,0) 74%)
       radial-gradient(62% 78% at 2% 104%, rgba(245,143,156,.23) 0, rgba(247,170,180,.13) 30%, rgba(252,214,219,.04) 58%, rgba(255,236,238,0) 76%)
       radial-gradient(28% 62% at 68% 84%, rgba(252,224,205,.10) 0, rgba(255,240,228,0) 70%)
ink:   radial-gradient(64% 78% at 104% 40%, rgba(244,168,116,.18) 0, rgba(244,168,116,.08) 30%, rgba(244,168,116,.02) 58%, rgba(244,168,116,0) 78%)
       radial-gradient(52% 64% at -6% 98%, rgba(245,143,156,.17) 0, rgba(245,143,156,.06) 40%, rgba(245,143,156,0) 72%)
```

Every temperature also carries the **jade grid that ships today**, unchanged, so nothing is lost.

### Measurement method

**Painted pixels, not composited alphas.** D25 makes this law and Task #24 is why: that bench scored a
theoretical sun core and unfairly failed a direction whose text sits in the falloff. Here the harness
renders the page, **hides the text while keeping its layout**, screenshots each fragment, and takes the
**darkest** painted pixel on light registers and the **lightest** on ink — the true worst case in each
text's own column. Those values are written back into the page.

**One trap worth recording:** the first sampling pass returned `#4d8ec7` (blue) and `#b27e5c` (orange),
which exist in no atmosphere here. It was reading **subpixel-antialiasing colour fringes on glyph
edges**. Hiding the text is what makes the sample honest.

| Temperature | light | ink | status | band |
|---|---|---|---|---|
| T1 | `#eaeaeb` | `#232220` | `#eaebeb` | `#eaeaeb` |
| T2 | `#e0e4ee` | `#1b202a` | `#e1e5ef` | `#e0e4ee` |
| T3 | `#ebe1e3` | `#2a2524` | `#ebe2e4` | `#ebe1e3` |

### THE FLAGSHIP FINDING — the ink register cannot keep the D23 B06 floor under any glow

The ink hero existed because that register had **never been tested for warmth**; the first bench only
ever put glow on light. It earned its place immediately.

**Pure ink sits at luminance 0.00651. The B06 floor of 1.25 against `--ink-surface` permits at most
0.00649.** So **any** usable glow lifts the ink past the floor. This is arithmetic, not a tuning error.
Measured against the shipped `--ink-surface #192b24`: **T1 1.07 · T2 1.10 · T3 1.02**, versus 1.25.

**The bench FAILS that line rather than excusing it**, because D25 says atmosphere may never push a
delta below its floor. The resolution is to **compensate the pair**, and the compensated values are
printed passing directly beneath the failure:

- `--ink-surface` **#192b24 → #273a32** (holds **1.32 / 1.34 / 1.25**)
- `--on-ink-border-strong` **#5b8275 → #688f82** (the lifted surface would otherwise drop the card edge
  to **2.82**, under its 3:1 tier; #688f82 restores **3.36**)
- compensated card text holds comfortably: on-ink **10.52**, muted **6.29**, mint **6.55**

**The light register shows the exact inverse**, which is the other half of the finding: the glow makes
the page slightly darker, so a white card separates **better** than it does today — D23 A06 measured
**1.28** against the shipped floor of 1.07. **Light has luminance headroom to spare; ink has almost
none.** A bench that only tested light would have shipped this straight into the flagship register.

### Status row verdict per temperature

Alarms are untouched by construction: warmth is background-only and never enters their colour space.
Measured, the pills still separate from the painted field in every temperature (refused **1.16**,
deadline **1.22** at T3, the tightest case) and every pill's own text clears AA on its own fill
(**5.22 / 4.84 / 4.72**). **T3 carries the most risk to watch by eye**, because apricot sits nearest the
amber alarm's hue neighbourhood, and that is stated in its own notes strip rather than buried here.

### impeccable — findings and responses

Run against the bench before handoff; **assessment independence: degraded** (sub-agents not used,
session policy restricts the Agent tool, so A and B ran sequentially per the documented fallback).

| # | Severity | Finding | Response |
|---|---|---|---|
| 1 | **P1** | The card explaining the ink-floor failure sat **after** all three temperatures, so the owner met three FAIL lines with no explanation for two screens. Same class as Task #24's protocol placement. | **FIXED** — moved above the temperature sections (index 2590 vs 4420). |
| 2 | **P2** | `.card-doc` at 82ch and `.notes` at 80ch exceeded the 65–75ch measure cap. | **FIXED** — card capped at 74ch; `.notes` capped by padding rather than width, because capping the width of a full-bleed strip left the background short and a white gap beside it (caught in the eye pass). |
| 3 | **P2** | Detector: em-dash overuse. | **PARTLY FIXED, partly a false positive, and the split is measured.** Of the 16 the detector counts, **6 are true em-dashes** and **10 are `--` in CSS custom-property names** (`--ink-surface`, `--on-ink-border-strong`) written as prose references. Several true ones were rewritten; the token names stay because renaming them to satisfy a cadence heuristic would make the document wrong. |
| 4 | **advisory** | Detector: numbered section markers, "Sequence: 02, 07, 08, 09". | **FALSE POSITIVE, verified.** The fragment labels are **roman numerals** (i, ii, iii, iv). The 02/07/08/09 are **gradient alpha stops** (`rgba(…,.07)`) inside the style block. "Fixing" it would mean changing the glow values themselves. |

### PROTOCOL

> **Owner picks T1 / T2 / T3 in chat → the pick's values become the implementation spec for the
> warm-atmosphere task (full cube, AA re-verification against painted pixels, D23 floors, alarms
> untouched).**

The implementation task inherits two obligations from this round: the **compensated ink pair** above,
and a re-measurement of the painted pixels on the real pages rather than on bench fragments.
**"None of these, warmer or cooler" is a legitimate answer** — the dial is continuous and a fourth
round costs one task.

---

## 9. T2 IMPLEMENTED — bench versus site (Task #27, 2026-08-20)

> ## ⛔ CLOSED OUT — THIS SECTION DOCUMENTS A REVERSED RULING (Task #33, 2026-08-21)
>
> **Everything below shipped, and everything below has since been removed from the code.** D25 was
> ruled 2026-08-20, implemented here in Task #27, reversed 2026-08-21 by the N3-b reading, and the
> reversal was **EXECUTED in Task #33**: the `--atmo-*` tokens, both gradient stacks, the
> `.atmo-light` / `.atmo-ink` classes and their two applications (the ink hero, the FinalCta band)
> are gone, and so is the scoped compensated ink pair that existed only to pay for the wash.
>
> **The deletion was verify-then-delete, not delete-and-hope.** The Task-18 globals were confirmed
> present and unmodified at `:root` BEFORE anything was cut — `--ink-surface #192b24`,
> `--on-ink-border #405e58`, `--on-ink-border-strong #5b8275` — and the ink register was then
> re-measured on the returned values rather than assumed:
>
> | Spot | Returned value | Floor |
> |---|---|---|
> | **B06** `--ink-surface` vs `--ink` | **1.25:1** | 1.25 — *its floor exactly, with zero headroom* |
> | `--on-ink-border` vs `--ink-surface` | 2.10:1 | 2.0 (E2-05) |
> | `--on-ink-border-strong` vs `--ink-surface` | 3.47:1 | 3.0 (WCAG 1.4.11) |
> | `--on-ink` on `--ink` | 16.17:1 | 4.5 |
> | `--on-ink-muted` on `--ink` | 9.66:1 | 4.5 |
> | `--accent-on-ink` on `--ink` | 10.07:1 | 4.5 |
>
> **THE MOST USEFUL THING THIS SECTION LEAVES BEHIND is that B06 = 1.250 exactly.** That is not a
> comfortable pass, it is a boundary: the maximum extra luminance the ink field can carry before the
> console card stops separating is **0.0000**. It is why the compensated pair had to exist, and in
> Task #33 it is why the newly-adopted **breathing field was withheld from the hero** — the same
> arithmetic, reached from the opposite direction, two rulings apart.
>
> The method this section pioneered — **painted pixels, not composited alphas** — outlived the ruling
> it was built to defend and is now the standard instrument. See the ledger's D25 reversal receipt.

**The owner picked T2 (rose + violet).** It now ships on the homepage **ink hero** and the **final
CTA band**, with the §8 layer values carried across verbatim (only rewritten from `rgba(r,g,b,a)`
into the `rgb(r g b / a)` form `globals.css` already uses). Tokens: `--atmo-rose #f58f9c`,
`--atmo-rose-soft #f7929a`, `--atmo-violet #8d6fd3`, plus `--atmo-light` / `--atmo-ink` holding the
stacks. Delivery is two utility classes applying a **background-image to the section itself** — no
pseudo-element, no z-index, no stacking context, no JS, no images, nothing animated.

### Where the bench was right

- **The ink floor failure is real and is arithmetic.** Compensation was genuinely required; the glow
  could not simply be tuned down without deleting the idea.
- **`--on-ink-border-strong #5b8275 → #688f82` was exactly right.** Measured on the real page, the
  compensated edge holds **3.36:1** against the lifted surface and **4.40:1** against the painted
  field, both clear of the 3:1 boundary tier.
- **Light has headroom and ink does not.** On the real band the glow cost the h2 only 0.47 (17.28 →
  16.81) and the lede 0.31 (7.51 → 7.20), from floors of 3.0 and 4.5. Nothing on light came close.

### Where the bench was incomplete or wrong, measured on the real pages

| # | Bench said | The site says | Consequence |
|---|---|---|---|
| 1 | Compensate **two** tokens | **Three.** The bench never modelled the DIVIDER tier. D23 E2-05 hardened `--on-ink-border` to 2.10:1; the lifted surface drops the shipped `#405e58` to **1.70:1**, under its own floor. | `--on-ink-border #405e58 → #4a6c66` (restores 2.09:1) was added at implementation. |
| 2 | The ink card is filled with `--ink-surface` | **It is not.** The hero console is `.ink-glass` — a fixed `rgb(22 42 34 / 0.70)` composite. In the whole hero, `--ink-surface` backs only the small avatar circles and the no-`backdrop-filter` fallback. | The B06 arithmetic the bench ran governs a surface the flagship barely uses. The compensation still earns its place through the two border tiers, which the hero uses 17 times. |
| 3 | Compensation restores card separation | **The panel's FILL separation still collapses**, from 1.14 to **1.00**, because `--ink-glass` is a fixed alpha the compensated tokens do not touch. | Recorded as the one measured degradation. It breaches no governing floor — the panel's separation is carried by its EDGE by documented design — but the fill now contributes nothing. |
| 4 | Painted ink sampled `#1b202a` | The real hero's brightest painted field is `#242221`–`#20201e`, and text-backing pixels are `#0b1512` (field) and `#12231d` (card). | Bench fragments are small, so a radial covers proportionally more of them. **Bench painted values do not transfer to full-width sections** and must be re-measured in place — which is why §8 owed this round a real-page pass. |
| 5 | Painted light sampled `#e0e4ee` | The real band's darkest text-backing pixel is `#f5f1f3`. | Same cause, opposite direction: on a 1440-wide band the copy sits in the falloff, not the core. The bench was **pessimistic** here by a wide margin. |

### The result

**57 text runs measured on painted pixels across both registers and all four console scenes: zero
below floor.** Four pairings moved measurably and all keep large margin. **Violet was ruled
weather, not meaning**, by render — including a deliberate worst case with the violet sun dragged
directly under the `--svc-wheel` chip at the owner's own alpha (the chip still reads as a chip) and
a 3x-alpha control proving the test can fail.

### A method note that cost most of the task

**The probe was wrong five times before it was right, and every wrong version invented site defects
that did not exist** — at one point 49 of 52 runs "failed". The failure modes, recorded because
they will recur: sampling an element's box catches its **decorative children** (a status dot, a
button's own fill); switching to the padding box still catches every **rounded border**, which arcs
into the padding rectangle at the corners; reading `getComputedStyle().color` **after** applying the
hide-text style returns transparent-black for every run; and forcing `.demo-scene[data-active]` with
only a 220ms settle collects the **outgoing** scene's runs against the **incoming** scene's raster.
The instrument that is actually correct takes **Range client rects of the text nodes themselves**
in document coordinates against a full-page raster, waits 700ms for scene transitions, and treats
opacity below 0.05 as invisible. **It ends by drawing the sampled rects back onto the live page and
screenshotting them, so alignment is judged by eye before a single number is believed.** Per D26,
no probe result was reported until the probe had been executed and its output shown.

---

## 10. THE NOIR ROUND — D28's palette, rendered (Task #31, 2026-08-21)

**D28 is ruled and this round renders what it means for colour.** The instrument is
`docs/noir-bench/index.html`, one self-contained `file://` page. **Status: OPEN, pending the owner's
N-picks** — and one of those picks, **N3**, decides the fate of D25.

### The values, crafted and measured

| Role | Value | Measurement | Why this one |
|---|---|---|---|
| **Electric mint** (ink register) | **`#2fe89a`** | hue **155°**, S80 V91 · **11.62:1** on `--ink` · 9.30:1 on `--ink-surface` | Measurably more saturated and brighter than the shipped `--accent-on-ink` (hue 158°, S67 V84), so it reads as *voltage* rather than as the same jade. **Cyan begins around 175°; this is 20° clear of it, so S-007 holds by measurement rather than by assertion.** |
| **Alternate temperature** | **`#00ffa3`** | hue **158°**, S100 V100 · **14.01:1** on ink | The same hue as the shipped jade at maximum saturation and value. The A/B is not hue, it is *voltage*. |
| **Light-register mint** | **`#00a36a`** | **3.03:1** on `--bg`, clearing the 3:1 graphic tier | Forced by measurement, not by preference — see the finding below. |
| **Charcoal, tuning A** | `rgb(46 53 61 / 0.28)` → composites to **`#bdc1c4`** | **1.69:1** vs paper | Maximum recession that still clears D23's E1-07 divider tier (**1.66:1**), the floor below which a line reads as a printing artifact. |
| **Charcoal, tuning B** | `rgb(46 53 61 / 0.45)` → **`#9ba0a4`** | **2.46:1** vs paper | More present. The braid reads as a *structure* rather than as a *background*. |
| **Charcoal on ink** | `rgb(143 154 166 / 0.30)` → **`#333d3e`** | **1.66:1** vs `--ink` | **Register-aware means inverted**: on paper the neutral is darker than the field, on ink it must be lighter. Same intent, opposite direction. |

### THE FINDING: the neon is register-split, and that is structural

**Electric mint measures 1.49:1 on paper.** It does not merely look weak there, it is *unusable* —
below any floor, for text or for graphics. The light register therefore needs its own active line
(`#00a36a`, 3.03:1), and that line is **legible but not neon**, because neon on white is either
invisible or illegible. There is no tuning that escapes this; it is a property of white grounds.

**So "electric" is an INK-register idea.** On light the same signature reads as **precision**; on ink
it reads as **voltage**. That is not a compromise to be fixed later — it is what the noir direction
*is* in a two-register system, and it should be stated in the law when D28's specs are implemented.

### Method

Same as the tuned round: **painted pixels, not composited alphas**, by Task #27's Range-rect probe —
client rects of the text nodes themselves, in document coordinates, against a full-page raster with
the text hidden but its layout kept. **57 runs over the new surfaces, zero below floor.** Braid path
data is **byte-identical to the Grand Bench**, because D28 rules the recolor as **paint-only**: the
weave, the front-arc segmentation, the canonical path and the roller-coaster timing are unchanged, so
I15, I20 and the LUT spec are untouched by construction rather than by promise.

### A law collision, named rather than resolved

`nexo-brand` §5 bans **glow/bloom ON OBJECTS**. D28 asks for **glowing neon accent borders** on the
mobility cards, which is an object glow. Both N4 treatments use a **tight ring** (≤16px, no wide
halo) so the effect reads as voltage rather than haze — **but adopting N4 amends §5 for the
signature/chrome registers, and that is the owner's call, not a workaround to be slipped in.**

### PROTOCOL

> **Open `docs/noir-bench/index.html` from `file://` on BOTH machines, and answer four questions:**
>
> 1. **N1 — the charcoal tuning.** A (α 0.28, maximum recession) or B (α 0.45, more present)? The real
>    question underneath: should the braid read as a **structure** or as a **background**?
> 2. **N2 — the mint temperature.** `#2fe89a` or `#00ffa3`? Precision, or maximum voltage?
> 3. **N3 — THE FORK, and this one rules D25.** *Dusk stays* or *pure noir*? **If pure noir wins, the
>    revert scope is: the `.atmo-ink` application on the hero, AND the compensated ink pair with it**
>    (`--ink-surface #273a32`, `--on-ink-border #4a6c66`, `--on-ink-border-strong #688f82`), because
>    those exist only to pay for the glow's luminance lift and D23's floors were derived against
>    `#192b24`. `.atmo-light` on the final CTA band is a separate question this fork does not decide.
> 4. **N4 — the border treatment.** Hairline-glow or 2px-glow? And the §5 amendment: yes or no?
>
> **These four answers finalize D28's implementation specs.** Nothing ships before them.


---

## 11. R2 — THE ROUND-2 BENCH (Task #32, 2026-08-21)

**D29 and D30 are law; this round tests the three things they left open.** The instrument is
`docs/round2-bench/index.html`, one self-contained `file://` page. **Status: OPEN, pending the owner's
G-picks.** No site code moved in this task — the D25 reversal executes in **#33**.

### The values, computed and then measured

| Spot | Value | Ratio | Floor |
|---|---|---|---|
| G1-a nav text over **0.90** glass over the mint strand | composites to `#102c20` | **13.03:1** | 4.5 |
| G1-a muted text, same case | | 7.78:1 | 4.5 |
| G1-b nav text over **0.75** glass over the mint strand | composites to `#154b34` | **8.76:1** | 4.5 |
| G1-b muted text, same case | | 5.23:1 | 4.5 |
| G1-c nav text on **solid ink-bold** | `#0c1712` | **15.94:1** | 4.5 |
| G1 the 1px mint rule against the bar | | 11.45:1 | 3.0 (I21) |
| **G1 on-ink text DIRECTLY on the mint strand, no bar** | `#2fe89a` | **1.39:1 — SHOWN FAILING ON PURPOSE** | 4.5 |
| G2/G3 headline / lede on the noir field | | 16.17:1 / 9.66:1 | 3.0 / 4.5 |
| G4 card body / mint ring on dark glass | | 7.73:1 / 9.30:1 | 4.5 / 3.0 |

**Eleven computed spots, zero below floor** (the 1.39:1 row is a deliberate demonstration, not a
defect, and prints as `SHOWN-FAILING` so it can never be mistaken for a pass).

### THE FINDING: the glass is load-bearing, not decorative

The fragment was built to answer *"is sheerer glass more liquid?"* and answered a different question
on the way. **On-ink text sitting directly on the mint strand measures 1.39:1** — unusable at any
size. Over the bar the same text measures **13.03:1** at 0.90 and **8.76:1** at 0.75, because the
glass composites the strand back down to near-ink. **The bar makes the crossing legal, and nothing
else does.** Where there is no bar, **the strand has to clear the text column outright.** That is a
constraint on the route-scale braid in **#34**, not a tuning preference, and it is now written into
**S-032**.

**This was confirmed the expensive way.** At 390 the bench's own hero lede landed on a charcoal
strand at **2.78:1** — below floor, in the fragment that had just finished explaining the rule. The
1440 measurement showed nothing, because at 1440 the copy column and the braid do not overlap. The
composition was fixed (the braid stops at the bar band on phones and the copy takes full width) and
re-measured green. **Measuring only at the wide width would have shipped the bench with the defect it
documents.**

### Floors, and the value that is deliberately absent

D23's nav-glass read floor is **0.75**; the shipped value is **0.90**. **Floors only rise**, so 0.75
is *legal but is the edge*. **The advisor's 0.60 sheer tint is BELOW the floor and is deliberately not
rendered** — benching an illegal value would invite a ruling the law already forbids. **I21 remains
the floor** for the bar's boundary. **Decline-don't-degrade** is honoured by rendering the
`@supports` fallback (solid ink-bold) **as a peer candidate rather than as a consolation**: every
browser without `backdrop-filter` gets it, so it has to be good on its own terms.

### Density: the distinction that keeps G2/G3 legal

**S-028 rejected `nexo-drift` because it was per-cell opacity cycling and read as moving parts.**
G2 and G3 are **density treatments**, not moving parts: G2 is *one* slow field transform whose stated
bar is **imperceptible-as-motion**, and **G3 does not move at all**. Cost is measured, not estimated
(D20): G2 is **zero bytes, one compositor layer**; G3 is a **2.8 KB** seeded 64×64 alpha-noise tile as
a data URI. `feTurbulence` was not used — paper-grain filters are a named AI tell.

### The spring

**ζ 0.72, ωₙ 9.2 rad/s, 620 ms, 31 stops, peak 103.8%**, sampled from the damped-spring solution into
a CSS `linear()` easing. **Zero JS, zero library** — this is what lets framer-motion stay dead while
still getting spring physics.

### Method

**Painted pixels, not composited alphas**, by Task #27's Range-rect probe, run at **1440 and 390**:
**31 text runs, zero below floor** after the 390 fix. The probe's rects were **drawn back onto the
page and viewed** before any number was believed. Reduced motion: **zero running animations, zero
hidden elements, zero unstroked strands, both G4 cards static-complete**. Fonts primed and all three
families confirmed loaded; zero console errors; zero horizontal overflow at either width; 12 headings
with zero jumps; 14/14 tabbed elements show a focus indicator.

### PROTOCOL

> **Open `docs/round2-bench/index.html` from `file://` on BOTH machines, and answer three questions:**
>
> 1. **G1 — the nav.** **(a)** glass 0.90, **(b)** glass 0.75, or **(c)** solid ink-bold? The real
>    question underneath: *does floor-legal glass deliver the liquid feel, or is ink-bold the truth?*
>    **Note that (c) is what every browser without `backdrop-filter` renders regardless**, so a vote
>    for (a) or (b) is a vote for two states, not one.
> 2. **G2 vs G3 vs control.** Breathing field, static grain, or **flat ink**? *Which field feels dense
>    without feeling busy?* **The flat control is a real candidate** — if neither treatment beats it,
>    flat wins and that is a legitimate answer.
> 3. **G4 — approve the spring?** Yes keeps `linear()` spring physics as the arrival grammar; no keeps
>    the current 300 ms ease.
>
> **These three answers unblock rungs #33, #35 and #36 of ladder v2.** The D25 reversal and the
> framer-motion removal are already ruled and proceed regardless.
