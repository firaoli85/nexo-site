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
