# PLATFORM DESIGN HANDOFF

**Purpose (D4 + D16).** The site's design system is documented here as UI guidance for the `nexo-access` platform
repo. This document is **maintained WHILE building, never retrospectively**: every design decision receives a
**transfer verdict at decision time**, with its reason and date, so the platform team never has to reverse-engineer
intent from finished pages.

**The three verdicts:**

| Verdict | Meaning |
|---|---|
| **TRANSFERS** | Identity-level. The platform adopts it as-is (subject to its own verification). |
| **ADAPTS** | The idea transfers; the platform reworks the execution for its own context. |
| **SITE-ONLY** | Marketing furniture. The platform does not take it. |

**Two different products, one identity.** Neither wholesale copying nor from-scratch. The platform is an operator tool;
the site is a marketing surface. What binds them is identity (color, type, voice), not layout or choreography.

**The rule:** every design task appends its verdict here **in the same task** (standing law, SITE_GROUND_TRUTH §8).
Cross-project checkpoints (D5) continue: exchanges are relayed by Oli and documented.

---

## Verdict ledger

| # | Item | Verdict | Reason | Date | Source |
|---|---|---|---|---|---|
| 1 | Color token architecture (single-file CSS vars, Tailwind mapping) | **TRANSFERS** | Identity-level system; port under a namespaced prefix or alias, never silently merge `muted` / `accent` / `default` into shadcn names | 2026-08-17 | NEXO_SITE_DESIGN_REPORT §7 |
| 2 | Jade palette values | **TRANSFERS** | Brand identity; the platform re-verifies every contrast pair against ITS composited surfaces, ratios are not portable | 2026-08-17 | design report §7 |
| 3 | Fonts: Bricolage + Hanken via `next/font` | **TRANSFERS** | Identity; the platform revisits `display:"optional"` for its own loading context | 2026-08-17 | design report §7 |
| 4 | Motion doctrine (static-complete default, reduced-motion block, easing pair) | **ADAPTS** | Doctrine transfers; ceilings differ, operator tools need instant feedback, not marketing choreography | 2026-08-17 | design report §3 |
| 5 | Glass doctrine | **ADAPTS-RESTRICT** | Platform PRODUCT.md anti-references decorative glass; at most chrome-scale, likely none | 2026-08-17 | platform PRODUCT.md |
| 6 | Route / van / map landmarks / terminus | **SITE-ONLY** | Marketing narrative furniture; reference the journey metaphor selectively, never paste | 2026-08-17 | design report §7 |
| 7 | Button / Container / Section primitives + Radix nav grammar | **ADAPTS** | Patterns lift; density and hierarchy differ for operator screens | 2026-08-17 | design report §4 |
| 8 | Ink-terminated page root (`html` background ink, `min-h-svh`) | **SITE-ONLY** | Platform pages end light; would paint ink in overscroll | 2026-08-17 | design report §7 |

---

**Amendment rule.** Entries only append. A changed verdict gets a **new dated row referencing the old one** (for
example: "supersedes row 5, 2026-08-17"); the original row stays exactly as written. Nothing here is ever deleted, so
the platform can always see what was decided, when, and why it moved.
