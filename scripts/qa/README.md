# QA sweep — standing invariant harness

A Playwright sweep that asserts the site's structural invariants against the **prod build**. Built in
Stage 12; **law-protected** (nexo-brand): never deleted, never weakened — invariants are only added.

**Stage 16 — it is now a CUBE:** every route × invariant × **engine** (chromium + webkit + firefox) ×
**profile** (desktop widths 390 / 768 / 1440 / 1920 **plus** the `iPhone 14` and `Pixel 7` device
descriptors — touch, DPR, mobile UA). The harness never certifies a single engine again (§10.1). WebKit
is the Safari engine (the closest automatable proxy for iOS); Firefox is the tiebreaker.

## Run it

```bash
# stop any server holding :3300, then:
npm run build:check          # build the prod bundle into .next-check
npm run qa:sweep             # serve .next-check on :3300, sweep, tear down
```

`qa:sweep` reuses a server already answering on `:3300` if one is up (handy while iterating: run
`npm run start` in one terminal, `npm run qa:sweep` in another). It exits non-zero if any invariant
fails. Failure screenshots land in `scripts/qa/artifacts/`.

Requires the engines installed once: `npx playwright install webkit firefox` (chromium ships with the
dep). Narrow the run for fast iteration (bash: prefix `MSYS_NO_PATHCONV=1` on Git-Bash so `/route` isn't
mangled). `QA_ENGINES` / `QA_PROFILES` / `QA_ROUTES` are for iteration ONLY — the deploy gate is the full
cube:

```bash
QA_ENGINES="webkit" QA_PROFILES="iPhone 14,w1440" QA_ROUTES="/platform,/contact" node scripts/qa/sweep.mjs
```

## THE REGRESSION RULE (law)

Any change touching **shared chrome** — Navbar, Footer, root layout, AmbientMap, globals.css / tokens,
`site` / `launch` / `nav` / `seo` / `schema` libs, or the `SolutionPage` / `LegalPage` / `PlatformSubnav`
patterns — MUST run `npm run qa:sweep` to full green before its stage may report. Shared chrome
propagates; a green sweep proves it didn't regress a sibling route.

## The deploy gate (§10.1)

**Full-cube green + the owner's 5-minute real-device checklist.** Playwright's WebKit is the Safari
*engine* but not the full iOS browser (no live URL-bar dynamics, no rubber-band physics), so the last
rung is human — the owner runs the real-device checklist on an actual iPhone. A green cube is necessary,
never sufficient. A browser/device gap may never ride "NOT VERIFIED" across a deploy.

## Invariants (per route × engine × profile, + a 404 check)

| # | Invariant |
|---|-----------|
| I1 | **ENDCAP** — the document ends at the footer (no scrollable void); nothing pointer-events-auto paints below it; the bottom pixel is the footer. |
| I2 | No horizontal overflow (`scrollWidth ≤ viewport`). |
| I3 | Exactly one `h1`; heading order has no level jumps. |
| I4 | Zero console errors/warnings, pageerrors, or failed requests across load + full scroll + interactions. |
| I5 | CLS ≈ 0 (`< 0.02`) through load + scroll. |
| I6 | Skip-link focuses `#main-content`; a sampled focus walk shows visible rings. |
| I7 | Nav dropdowns open/close (desktop, keyboard Escape) / the mobile overlay opens. |
| I8 | Footer arrival: readable content settles at effective opacity ~1 after a real scroll-in (never stuck hidden). |
| I9 | `/platform` anchors: each of the four hashes lands correctly & stably below both sticky bars, with the correct `aria-current` chip — for BOTH a cold deep-link AND a client-nav from the homepage Platform dropdown (`#dispatch` must never light Oversight). |
| I10 | Reduced-motion: complete static composition, readable, no van. |
| I11 | JS-disabled: SSR renders the content (h1 + substantial text, no blank sections). |
| I12 | Map clearance: xl-only gutter glyph centers stay outside the content column. |
| I13 | Forms (`/apply`, `/contact`): render, honeypot present + hidden, submit present. The sweep never sends email (it asserts pre-submit only). |
| I14 | Metadata: title present, canonical is the exact apex URL, `og:image` is the absolute OG asset (+ I14b: titles unique across routes). |
| I15 | Decorative overlap: interior routes carry ZERO van/route nodes; the homepage van moves with scroll, never overlaps text, never crowds the footer. |
| I16 | Canonical email: every rendered `@nexoaccess.com` address is `info@` — zero `admin@` anywhere (+ I16b: one identical identity across routes). |
| **I17** | **Magic line (Stage 16):** for each desktop nav trigger, hover + open it — the visible indicator's x-center matches the trigger's (±4px). Desktop only. Per engine. |
| **I18** | **Ink-safe root (Stage 16):** `<html>` background is dark ink (no white below the footer on overscroll); scrollHeight never passes the footer. Every engine × profile. |

The 404 check asserts a real `404` status and a BRANDED page (site chrome, one h1, links to `/` and
`/contact` — not the default Next error page). I9 / I10 / I11 run once per engine at the desktop viewport.
