# SITE RECON — 2026-08-17

**First receipt of the Main Page project.** Full inventory of the nexo-site repo, performed by Claude (chat) against the public GitHub repo, commit `f0de3c9`. Everything below is verified from code unless marked HYPOTHESIS.

## 1. REPO INVENTORY

**Stack:** Next.js 14.2.35 · React 18 · TypeScript strict · Tailwind 3.4 · framer-motion 12 · Radix navigation-menu · lucide-react · AWS SES SDK · Playwright 1.61 (dev).

**Pages (src/app):** `/` (home), `/platform`, `/solutions/{mcos,providers,facilities,members}`, `/about`, `/contact`, `/apply`, `/privacy`, `/terms`, `/hipaa`, `/accessibility`, `/email-preview`, `not-found`, plus `robots.ts`, `sitemap.ts`.

**Components:** chrome/ (Navbar single dark jade glass register + Radix menus + magic-line indicator; Footer "premium terminus" with play-once arrival choreography; BackToTop; TerminusReveal). home/ (Hero, ProductDemo 4-scene autoplay walkthrough, AmbientMap regional map layers, RouteOverlay + RouteSpine full-page scroll-drawn route + livery van, ServiceMorph one-SVG figure morph, AssistScene, ProofBand, ProofSpotlight, CredentialStrip, AudienceTriage, ProviderTeaser, FinalCta, MapObserver). leads/ (ApplyForm, ContactForm, fields, useLeadForm → SES email, honeypot, sanitization). solutions/SolutionPage, legal/LegalPage, platform/PlatformSubnav, motion/{PageTransition,Reveal}, ui/{Button,Container,Section}.

**Libs:** site.ts, launch.ts (staged-truth flags), nav.ts, seo.ts, schema.ts (JSON-LD), leads.ts, leadSanitize.ts, mail.ts, email/{chrome,templates}.ts.

**Scripts/CI:** scripts/qa/ harness, build-check.mjs, send-test-email.ts. GitHub Actions: tsc TRUE 0 → prod build → arm64 image → ghcr.io → Coolify webhook; the image/deploy job fires only on push to main. `_seed/` preserves the old V0 public pages.

## 2. STYLING SYSTEM (verified facts)

- All color tokens are plain hex sRGB. Zero OKLCH / lab / display-p3 / color-mix in src or tailwind config. Single token file: globals.css :root; components consume vars/Tailwind mappings only.
- Palette: refined Railway-inspired universal light + jade system. Jade-cast text ramp, deep-jade accent #0b7d56, ink family for dark sections (#0b1512), dedicated service-level palette (teal/violet/fuchsia) outside status hues. Every pairing carries a WCAG ratio comment; the file is its own contrast audit.
- Glass doctrine: glass in exactly two places — nav bar (--nav-glass 0.90 alpha + blur 12px) and cards on ink stages (--ink-glass 0.70 + blur 10px); both fall back to SOLID surfaces via @supports (backdrop-filter). Glass on light surfaces forbidden.
- Fonts: Bricolage Grotesque (display) + Hanken Grotesk (body) via next/font, display:"optional" — a recorded Stage 16.1 owner ruling: slow first loads keep the metric-matched system fallback for the whole visit (zero font CLS); fast/cached loads get the real faces.
- Motion: two easing curves; "default = complete static composition" doctrine (SSR / no-JS / reduced-motion always see a finished page; JS arms data-*-live only when motion allowed); comprehensive prefers-reduced-motion block zeroes all durations/delays; page-level route drawn 1:1 with scroll via one CSS var; demo autoplay is pure CSS.
- A stage-numbered build history (Stage 2.5R → 16.1) lives in CSS/TSX comments; the stage reports those comments cite are NOT in the repo — they lived in past chats. This is the documentation debt the V2 program ends.

## 3. HIDDEN CRAFT DETAILS (owner-flagged, confirmed)

- AmbientMap.tsx: three regional compositions — DC (Washington Monument obelisk + Capitol dome + Potomac bridge + radial arterials), MD, VA — plus a DMV composite (Potomac curve + Beltway ring arcs). Landmark glyphs pinned to page gutters, never over text (invariant I12 enforces).
- RouteOverlay + CSS: a livery van rides the full-page route via offset-path; nose rotates with scroll direction; lane-by-leg logic — outbound right lane (+12px), return left, ~450ms lane-crossing U-turn at the terminus. Homepage-only (Stage 13 ruling); stops 36px short of the footer seam.
- Footer terminus: play-once staggered arrival ≤600ms perceived; static-complete under reduced motion.
- ServiceMorph: one hand-built SVG figure; only transform/opacity animate; apparatus crossfade carries the color change.

## 4. QA HARNESS (exists — strong)

scripts/qa/ — Playwright sweep vs the prod build. THE CUBE: every route × 18 invariants × 3 engines (chromium/webkit/firefox) × 6 profiles (w390/768/1440/1920 + iPhone 14 + Pixel 7). Law-protected: invariants only added, never weakened. I1–I18: footer endcap, no horizontal overflow, heading order, zero console errors, CLS < 0.02, skip-link + focus rings, nav open/close, footer arrival, /platform anchor landing, reduced-motion static composition, JS-disabled SSR content, map gutter clearance, forms pre-submit, metadata/canonical/OG, decorative overlap (van never overlaps text), canonical info@ email, magic-line alignment, ink-safe root.

Regression rule (law): any shared-chrome change must sweep to full green before its stage reports. Deploy gate (§10.1): full-cube green + owner's real-iPhone checklist; green necessary, never sufficient.

MISSING (the real gap): no performance budget; no throttled old-device profile; nothing asserts frame smoothness, JS weight, LCP, or animation cost on weak hardware; no cross-engine visual screenshot baseline/diffing. Hygiene: six empty FAIL_chromium_* directories committed in scripts/qa/artifacts/ (stale).

## 5. STAGED TRUTH & SIGN-IN (launch.ts)

- LAUNCH.LIVE_OPERATIONS=false → "Built for DC · MD · VA" (not "Serving"). LAUNCH.HIPAA_INFRA_VERIFIED=false → "Built for HIPAA compliance". HIPAA_EFFECTIVE_DATE=null → honest pending sentence. Flags flip only on explicit owner instruction.
- PORTAL_LIVE=false → a fully built Sign-in surface (desktop dropdown + mobile accordion, three customer portal doors, admin deliberately excluded by law §7.4) is hidden site-wide.
- The file records verbatim: "FC Nexo's operating model (fleet provider / broker / SaaS / hybrid) is UNDECIDED." → DECIDED 2026-08-17 (ground truth D1).

## 6. CROSS-MACHINE INCONSISTENCY — ROOT-CAUSE CANDIDATES (HYPOTHESES until P5 measures)

| # | Candidate | Evidence | Class |
|---|---|---|---|
| C1 | font-display:optional → slow machines render system fonts for the entire visit; typography differs per visitor | layout.tsx comment, Stage 16.1 ruling | Deliberate tradeoff to revisit |
| C2 | @supports capability forks: glass nav vs solid fallback; van hidden without offset-path | globals.css .nav-glass/.ink-glass/route-van gate | By-design divergence |
| C3 | Subtle jade palette + low-alpha glass crushed on cheap/uncalibrated monitors | Token values (#fafbfc vs #ffffff, 0.70/0.90 alphas) | Design robustness |
| C4 | Animation cost (backdrop blur, per-frame scroll var, IO choreography) janks on old CPUs/GPUs; no budget enforces smoothness | globals.css motion layer; harness has no perf profile | Missing budget |

Verification plan: extend the QA cube with (a) a throttled old-device profile (CPU 4–6x throttle + slow network) asserting a defined performance budget, and (b) cross-engine/profile screenshot baselines with diffing. Measure, then decide per cause: keep the fork, flatten it, or harden the palette.

## 7. DOCUMENT INVENTORY (at recon time)

MISSING: SITE_GROUND_TRUTH.md, FIXLOG.md, docs/SITE_BUILD_PLAN.md, docs/SITE_PROGRESS (json), docs/DESIGN_RESEARCH.md, docs/COPY_DECK.md. PARTIAL: docs/UI_STANDARDS.md (NEXO_SITE_DESIGN_REPORT.md, 41KB teardown incl. §7 Portability = site→platform handoff seed with shadcn token-collision warnings; + annotated token file), scripts/RUNBOOK.md (DEPLOY-NOTES.md covers hosting/DNS/launch checklist/NAP rule). EXISTS: docs/QA_HARNESS.md as scripts/qa/README.md (strong; missing perf budget + visual diff).

## 8. DECISIONS LOCKED 2026-08-17

See SITE_GROUND_TRUTH.md §4, D1–D13. Summary: D1 positioning (management organization, we manage / providers drive), D2 NEMT-first public scope, D3 Sign-in visible with honest no-account response and no sign-up, D4 cross-repo design law, D5 cross-project checkpoints, D6 skills audited, D7 REVERSAL git moves to Claude Code, D8 v2 branch strategy, D9 text wordmark, D10 research-first sequencing, D11 Mobbin+Figma pipeline, D12 challenge-to-test law, D13 SITE_BOARD.

## 9. DISCOVERY CAPTURE (found, recorded, NOT acted on)

- Six empty FAIL_chromium_* dirs committed in qa artifacts — cleanup candidate.
- Stage reports referenced in code comments do not exist in the repo — FIXLOG replaces them going forward.
- DEPLOY-NOTES.md flags platform-repo follow-ups (robots disallow-all before app.nexoaccess.com resolves) — platform-side, already tracked.
- www→apex 301 redirect planned — pending.
- Site meta/title/JSON-LD (schema.ts) and OG assets still carry the OLD "NEMT company" positioning — repositioning touches metadata, not just page copy.
- Design-report token-name collision warnings (muted/accent/default vs shadcn) must be honored when the design law crosses to the platform repo.
- Harness has no Lighthouse/perf tooling installed — P5 will add tooling (decide: Playwright traces vs Lighthouse CI).
