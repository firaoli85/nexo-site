# TYPE SPECIMEN BENCH — P3-W3

**Task #10, 2026-08-17. Branch `v2`.** Bench: [`docs/type-bench/index.html`](./type-bench/index.html) —
open it directly, no build step, no install.

**This bench is `docs/` tooling. It is never shipped site code and never enters the app bundle.**

**W3 exists because the corpus flagged a tension and refused to resolve it.** `DESIGN_RESEARCH` §8.5/§11b
found light display weight (300) correlating across Stripe and ElevenLabs — "the single strongest premium
signal in this sample." The owner's own words in §13b T2 are **"not bold enough."** Those point in opposite
directions, and no amount of argument settles it. **This is decided on rendered screens, by eye, by the
owner.** Nothing below is a recommendation.

---

## 1. CANDIDATES

Selection bar, applied to every challenger: **free license permitting self-hosted commercial web use** ·
**heavy display weights available (700+)** · **strong screen-rendering reputation** · **variable preferred**.
Target register: the technical confidence of the owner's Greptile reference (T2), while staying humane enough
for healthcare trust.

### Display faces

| # | Display face | Weights shown | Body pairing | Mono accent | License | Variable? | Rationale (one line) | Risk (one line) |
|---|---|---|---|---|---|---|---|---|
| **01** | **Bricolage Grotesque** | 600 / 700 | Hanken Grotesk | JetBrains Mono | OFL | Yes (200–800, opsz+wdth) | **Incumbent, exactly as it ships today** — the baseline every other block is judged against. | None; it is the control group's control. |
| **02** | **Bricolage Grotesque — HEAVY** | **700 / 800** | Hanken Grotesk | IBM Plex Mono | OFL | Yes | **THE CONTROL THAT MATTERS: same family, pushed to its heaviest cut, to test whether *weight* — not *family* — was the wound.** | If this answers T2, six challengers become unnecessary and the cheapest fix wins. |
| **03** | **Archivo** | 600 / 800 | Hanken Grotesk | Space Mono | OFL | Yes (100–900, wdth 62–125) | Technical grotesque built for high-performance screen text; tightest, most newspaper-like of the set, with a genuine 900 and a width axis in reserve. | Its tightness can read as institutional-dry; the least warm of the grotesques. |
| **04** | **Space Grotesk** | 500 / **700 (its heaviest)** | Hanken Grotesk | JetBrains Mono | OFL | Yes (300–700) | **The closest face in the set to the Greptile register** — derived from Space Mono, it carries real engineering character in the `a`, `y` and `t`. | **Caps at 700.** If the owner's answer to "not bold enough" is 800+, this face structurally cannot provide it. |
| **05** | **Satoshi** | 700 / **900** | **Public Sans** | IBM Plex Mono | Fontshare (free commercial, self-host permitted) | Yes (300–900) | Confident geometric-grotesque hybrid with a true black; the most evenly-coloured of the set at large sizes. | Not on Google Fonts — self-hosting is a separate download and a different license file to keep on record. |
| **06** | **Sora** | 600 / 800 | **Instrument Sans** | Space Mono | OFL | Yes (100–800) | Confident geometric with wide, open counters — the most spacious and the most obviously "technology brand" of the set. | Its width costs horizontal room; long headlines wrap sooner at 390. |
| **07** | **Fraunces** | 600 / **900** | Hanken Grotesk | JetBrains Mono | OFL | Yes (100–900, opsz 9–144, SOFT, WONK) | **WILDCARD — a variable serif.** Directly answers T1: the whole category has converged on grotesques, so a serif is the one move no competitor has made, and it carries institutional/clinical trust that a grotesque cannot. | The largest departure from the current identity, and the one most likely to fight the van and the monuments (T5). |

### Body candidates (paired against Hanken Grotesk, the incumbent)

| Face | Shown in | License | Variable? | Rationale | Risk |
|---|---|---|---|---|---|
| **Public Sans** | Block 05 | OFL | Yes (100–900) | Built for the US Web Design System — civic legibility is its entire design brief, which is the closest existing mandate to a healthcare-trust body face. | Deliberately neutral; contributes little personality of its own. |
| **Instrument Sans** | Block 06 | OFL | Yes (400–700, wdth) | Modern and slightly technical at text sizes, with a width axis; holds a 17px measure cleanly. | Narrower weight range than Hanken; less headroom for a small-text tier. |

**Hanken Grotesk (incumbent body) appears in blocks 01, 02, 03, 04 and 07** so it is seen against five
different display faces before any swap is considered.

### Mono / technical accent candidates

Rotated across blocks so each is seen more than once, and labelled under every specimen.

| Face | Shown in | License | Variable? | Rationale | Risk |
|---|---|---|---|---|---|
| **JetBrains Mono** | Blocks 01, 04, 07 | OFL | Yes (100–800) | The developer-tool register itself — the most direct carrier of the Greptile "they know what they're doing" signal. | Reads as an IDE; can feel more product than brand. |
| **IBM Plex Mono** | Blocks 02, 05 | OFL | No (static cuts) | Institutional and humane at once; the warmest technical mono of the three. | Not variable, so each weight is a separate file. |
| **Space Mono** | Blocks 03, 06 | OFL | No (static cuts) | The most characterful; pairs natively with Space Grotesk (04) if that display face wins. | Its quirk is load-bearing — charming in a label, wearing in a paragraph. |

**Nothing here uses Inter, Roboto, Arial or a system stack** — banned by `nexo-brand` §2.

---

## 2. WHAT EACH BLOCK SHOWS

Identical structure and **identical real copy** in every block, pulled verbatim from the live site and the
D15 register. Only the typeface changes.

| Row | Content | Source |
|---|---|---|
| **i** | `Every trip, accounted for.` at two weights, plus `Medical transportation management for the DMV.` | live `Hero.tsx` headline; D15 §1 register, trimmed |
| **ii** | `Checked before it's billed.` / `We manage, providers drive.` | live section heading; GT §3 pillar 1 |
| **iii** | Two real paragraphs at 17px / 1.65 / 68ch | live `ProductDemo.tsx` step four; GT §1 canonical sentence |
| **iv** | Eyebrow, small label, and `TRIP NX-1042 · WHEELCHAIR · 9:30 AM` | live neutral eyebrow; approved fictional sample data (§7) |
| **v** | **Dark-on-ink strip** | our pages end on ink; a face must survive both registers |
| **A/B** | All seven display faces, heaviest cut, same string, stacked | direct scanning |

---

## 3. VERIFICATION — GREEN IS A FLOOR

**The failure mode this guards against:** if a CDN font silently fails, every block falls back to the same
system font, the page still renders beautifully, and **the bench lies** — the owner would compare seven
identical faces and think they were comparing seven different ones.

### Method (three independent checks, because one is not enough)

1. **`document.fonts.check()`** — the browser's own answer. **Weakest of the three:** it can return `true`
   for a family the browser merely knows about.
2. **WIDTH-DELTA AGAINST THE EXACT FALLBACK — the load-bearing check.** The same 56-character probe is
   measured at 72px in `'<family>', <its real fallback>` and in the bare fallback alone. A real webfont has
   different metrics from the fallback it would drop to, so **equal widths prove the family never loaded**.
   Each family is tested against *its own* fallback chain (`system-ui` for the sans faces, `Georgia, serif`
   for Fraunces, `ui-monospace` for the monos) rather than one generic sentinel — testing against a generic
   sentinel would only prove "not monospace", which a system-font fallback would also pass.
3. **`document.fonts` registry enumeration** — reading the actual loaded `FontFace` entries and their status.

**Method note, recorded because it caught me:** `getComputedStyle().fontFamily` returns the *declared* stack,
not the *used* font. It is worthless for this check and must never be cited as evidence a face loaded. An
earlier pass reported `resolved=Archivo` from computed style, which proved nothing at all.

### Result — 2026-08-17, headless Chromium, `file://`, desktop 1440 and mobile 390

**12 / 12 families render distinct from their own fallback. 7 / 7 blocks render their own display face.**

| Family | Weight | Face width | Its fallback | Delta | Distinct | `fonts.check` |
|---|---|---|---|---|---|---|
| Bricolage Grotesque | 700 | 1957.7 | 2083.6 | **125.9** | yes | true |
| Hanken Grotesk | 400 | 1990.2 | 1943.7 | **46.5** | yes | true |
| Archivo | 800 | 2211.8 | 2175.2 | **36.6** | yes | true |
| Space Grotesk | 700 | 2088.4 | 2083.6 | **4.9** | yes | true |
| Satoshi | 900 | 2161.4 | 2175.2 | **13.8** | yes | true |
| Sora | 800 | 2282.4 | 2175.2 | **107.3** | yes | true |
| Fraunces | 900 | 2186.8 | 2332.8 | **146.0** | yes | true |
| Public Sans | 400 | 2075.1 | 1943.7 | **131.4** | yes | true |
| Instrument Sans | 400 | 2029.1 | 1943.7 | **85.4** | yes | true |
| JetBrains Mono | 500 | 2419.2 | 2216.8 | **202.4** | yes | true |
| IBM Plex Mono | 400 | 2419.2 | 2216.8 | **202.4** | yes | true |
| Space Mono | 400 | 2467.6 | 2216.8 | **250.8** | yes | true |

**Per-block:** all seven blocks produced **seven distinct display-face widths** for the same string — no two
blocks collided, which is the direct proof that no block silently fell back to a shared system font.

**The two narrowest margins, stated rather than buried.** **Space Grotesk (4.9px)** and **Satoshi (13.8px)**
have delta values small enough that width alone would be weak evidence. Both are confirmed by the other two
checks — `fonts.check` true, and `Space Grotesk|300 700|loaded` and Satoshi present in the `document.fonts`
registry — and both are **visibly, unmistakably distinct in the A/B screenshot**. Three independent
confirmations each. Recorded so nobody re-derives the doubt later.

**Network:** zero failed requests, zero console errors, at both viewports.

**Screenshots viewed, not merely captured:** full-page and per-block at 1440 and 390, written to
`scripts/qa/artifacts/research/type-bench/` (**gitignored — no images committed**). I viewed the A/B stack
and representative blocks at both sizes and confirmed by eye that all seven faces are visibly different, that
every block renders all five rows including the ink strip, and that the 390 layout wraps cleanly.

> **STANDING CHECK FOR ANY FUTURE SPECIMEN BENCH.** Verify every family against **its own fallback chain**,
> not a generic sentinel, and confirm that **no two blocks share a rendered width**. Never cite
> `getComputedStyle().fontFamily` as evidence a font loaded.

---

## 4. DECISION PROTOCOL

> **Owner reacts by candidate number in chat, on at least two different machines/monitors (C3 protocol);
> ruling becomes D21 in a follow-up task; production loading strategy (C1) decided at implementation, not
> here.**

**Why two machines.** C3 on the consistency register is *"subtle palette on cheap monitors"*, and type weight
is subject to the same hazard: a face that reads confident on a calibrated display can read thin and grey on
a cheap panel. **A single-screen verdict is not a verdict.** This is the same reason W4 exists.

**Questions worth answering by number, not in the abstract:**

1. Does **02** — the incumbent at 800 — answer "not bold enough"? **If yes, the cheapest possible change
   wins and challengers 03–07 are moot.**
2. If not, which challenger's **heavy cut** carries the technical confidence without losing healthcare warmth?
3. Does the **body** need to change at all, or only the display? Blocks 05 and 06 are the only body swaps.
4. Which **mono** belongs on stat lines and trip codes — or does the site not want a third voice?
5. Does **07 Fraunces** read as trustworthy-institutional, or as off-brand?

**Out of scope for this bench, deliberately:** production font loading (C1 — the app self-hosts through
`next/font` with `display:"optional"`; the CDN here is bench-only), the final type *scale*, and any change to
`nexo-brand` §2. **§2 remains law until D21 supersedes it.**
