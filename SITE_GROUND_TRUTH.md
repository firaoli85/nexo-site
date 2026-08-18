# SITE GROUND TRUTH

**The single source of truth for the Nexo Access marketing site (nexo-site).**
Read this first, every session, before touching anything.

| | |
|---|---|
| **Owner** | Firaoli ("Oli") Seboka, solo founder, FC Nexo LLC dba Nexo Access |
| **Status** | V1 live at nexoaccess.com. V2 rebuild starting: research-first, on the `v2` branch. |
| **Horizon** | Built to hold for 2 to 3 years of solo operation. Oli will be running the business, not rebuilding the site. |
| **Version** | v1.3 — August 17, 2026 |

---

## 0. WHY THIS DOCUMENT EXISTS

V1 was built with real craft and real QA discipline, but its decisions live in code comments and lost chats ("stage reports" cited everywhere, existing nowhere). The site also speaks as the wrong company. This document ends both problems. Every principle and decision lives here or in a doc this file points to. It is law. **If code and this document disagree, this document is right and the code is wrong.** If Oli leaves for two years, this file plus FIXLOG resumes the project.

---

## 1. WHAT NEXO ACCESS IS (positioning law)

**Nexo Access is a medical transportation management organization. Transportation is the business: trips are delivered through our credentialed network of transport providers, on our platform, under our standards, and we take responsibility for every trip. Providers operate the vehicles; Nexo Access manages and answers for the service.**

- First market: **NEMT in the DMV** (DC, Maryland, Virginia). That is the public story.
- The broader ambition (private pay, facility contracts, other transportation management) stays **structural and modular**, not on the site yet. Adding a market later is adding a module, not repositioning.
- The site's job: make an MCO contracting director, a state program officer, or a provider owner conclude within one visit that this is a serious, well-built transportation management company that answers for its network.
- Anti-identity: never consumer taxi language ("book your ride today") in the lead; never framing that disowns transportation ("we don't drive", "we're just software"). We manage the service and we own the outcome.

## 2. AUDIENCES (in priority order)

1. **MCOs and payers** — contracting directors, provider network managers. They evaluate: credibility, compliance posture, network capacity, technology proof, a pilot path.
2. **Transport providers** — owner-operators in the DMV. They evaluate: is joining worth it, what is required, how do claims and payment work, is this company organized. Recruitment surface AND a genuine resource: the site must teach them how to become a compliant provider in each state.
3. **Facilities and case managers** — booking and confirming rides for people in their care.
4. **Members** — reassurance and what to expect. Smallest surface. B2B site; no consumer sign-up.

## 3. VOICE AND MESSAGE PILLARS

Voice: plain, direct, evidence-based. State what the platform enforces; claim nothing the code cannot back. Copy is written last (into COPY_DECK) and is the cheapest layer; the machine underneath is the work.

Pillars (each must be provable from the platform):
1. **We manage, providers drive** — the operating model, stated plainly.
2. **Credential-gated everything** — expired credentials block assignment automatically.
3. **Clean claims by construction** — scrubbing, adjudication, frozen records, no double payment.
4. **Enforced in the database, not a policy binder** — RLS, state machines, audit trails.
5. **Built for the DMV** — regional depth: the states, the programs, the requirements.

## 4. LOCKED DECISIONS LEDGER

Append-only. A decision changes only with a new dated entry stating from where, to where, and why. Nothing is ever deleted; rejected paths stay in the record, marked rejected, with the reason.

| # | Date | Decision |
|---|---|---|
| D1 | 2026-08-17 | **Positioning:** medical transportation management organization. We manage; providers drive. Resolves the "operating model UNDECIDED" note in `src/lib/launch.ts`. |
| D2 | 2026-08-17 | **Public scope:** NEMT-first, DMV-first. Broader markets modular, later. |
| D3 | 2026-08-17 | **Sign-in visible pre-launch.** Un-gate the existing `PORTAL_LIVE` surface. Any attempt: "no account found, contact support." No sign-up path (B2B). Wire to real auth when app.nexoaccess.com deploys. |
| D4 | 2026-08-17 | **Cross-repo design law:** the site's design system is documented as UI guidance for the nexo-access platform (docs/PLATFORM_DESIGN_HANDOFF.md; seed = NEXO_SITE_DESIGN_REPORT.md §7 incl. shadcn token-collision warnings). |
| D5 | 2026-08-17 | **Cross-project checkpoints** between site and platform, relayed by Oli, every exchange documented. |
| D6 | 2026-08-17 | **Skills audited, not assumed.** Registry doc; broken tools stopped and fixed, never silently worked around. |
| D7 | 2026-08-17 | **REVERSAL — git moves to Claude Code.** WAS: Oli runs all git himself; git never inside a Claude Code prompt. NOW: build prompts include the git steps; Claude Code stages, commits (one commit per task, descriptive message), and pushes. WHY: manual git caused costly mistakes; removing the human step removes the mistake class. Guardrails: never force-push, never push with tsc red, never touch `main` except at declared merge gates. |
| D8 | 2026-08-17 | **Branch strategy:** all V2 work on the `v2` branch. CI typechecks and builds every push; the deploy job fires only on `main` (verified in `.github/workflows/ci.yml`), so pushing `v2` never deploys. Merge `v2` → `main` only when the §7 quality gates pass. The live V1 site stays untouched until then. |
| D9 | 2026-08-17 | **Identity: text wordmark, no logo for now.** A logo waits until one actually satisfies the owner. Many serious companies run on a wordmark; so do we. |
| D10 | 2026-08-17 | **Research-first sequencing.** No page is designed before the research phase documents the industry standard (see §6, P1). |
| D11 | 2026-08-17 | **Mobbin + Figma are the design-reference pipeline.** Inspiration is pulled from Mobbin (and Figma), and every adopted reference gets a receipt in docs/DESIGN_RESEARCH.md: screenshot, what we take, what we reject, why. Both Claude (chat, Mobbin connector live) and Claude Code use it. |
| D12 | 2026-08-17 | **Challenge-to-test law (automatic).** Any task that fixes something genuinely hard — a bug that cost time, a rendering defect, a regression, a class of mistake — must add an automated test (QA invariant, unit test, or script check) covering that problem's whole class, in the same task, same commit. Manual verification recipes are test specs: captured as automation, never performed once and discarded. The owner never has to request this; the prompt template enforces it. |
| D13 | 2026-08-17 | **SITE_BOARD — the visual HQ.** `docs/SITE_PROGRESS.json` (committed) is the living status truth; `scripts/board.mjs` renders self-contained `docs/SITE_BOARD.html` (gitignored, local render). Shows: current task ("you are here"), phase bars P0–P6, plan ledger with status dots, decisions ledger with reversal chains, latest FIXLOG entries, gates dashboard, skills registry, discovery inbox, and a graveyard of rejected/deferred items (kept forever, with reasons). Regenerated at the end of every task automatically. Built in P0 Task #3. |
| D14 | 2026-08-17 | **V2 visual target: Mobbin-class animated premium.** Performance comes from technique + measurement, not restraint. P1a gains a technique-teardown workstream (per admired reference: animation library, what is animated, loading strategy, degradation strategy). Research findings no installed skill covers get encoded into new project skills via skill-creator (first candidate: nexo-motion). The static-complete SSR doctrine is retained. |
| D15 | 2026-08-17 | **Positioning language refinement (amends D1's expression, not its substance).** Public framing never negates: no "we do not drive," no "nothing to do with transportation." We deliver transportation through a credentialed provider network and take responsibility for every trip; providers operate the vehicles, Nexo Access manages and answers for the service. §1 carries the canonical wording. |
| D16 | 2026-08-17 | **Handoff-in-parallel protocol (extends D4).** docs/PLATFORM_DESIGN_HANDOFF.md is maintained WHILE building, never retrospectively: every design decision receives a transfer verdict at decision time — TRANSFERS (identity-level) / ADAPTS (platform reworks it) / SITE-ONLY (marketing furniture) — with reason and date. Two different products, one identity: neither wholesale copying nor from-scratch. Cross-project checkpoints (D5) continue. |
| D17 | 2026-08-17 | **Publish boundary for the resource center: requirements, never advice.** The site states what the rules ARE (insurance tiers, driver/vehicle requirements, WMATC authority, workers' comp thresholds) with citation and verification date. NEVER business-formation, ownership, legal, or financial guidance ("form an LLC" and its relatives are banned). Every resource page carries an informational-only disclaimer and its verification date. Nothing UNRESOLVED or merely REPORTED/OWNER-REPORTED is publishable. |
| D18 | 2026-08-17 | **Broad legibility, local operations (refines D2, does not reverse it).** MCO evaluators contract nationally; the site must read as a national-grade medical transportation management organization whose current operating footprint is the DMV, never as a local-only shop. SEO targets category queries alongside geo queries. Provider resource pages remain state-specific (providers are local); payer-facing surfaces speak nationally. Owner insight on record: the evaluator searching from New York or California must not scroll past us. |
| D19 | 2026-08-17 | **Imagery strategy (closes T3).** Primary imagery = animation + custom illustration in our own visual language. Stock people-photography permanently banned (fake patients read as fake trust). Real photography deferred until real operations exist, then added as truth. The hero receives a new signature animated centerpiece; the current hero is on record as hard to grasp (owner + user feedback). Concept proposed by Claude in P3 as rendered comparisons; owner reacts before build. SafeRide-style flow explanations are built as animation, not video, within this ruling. |
| D20 | 2026-08-17 | **P2 technical ratification.** (a) Performance bar adopted as ceiling: ≤600KB transfer, ≤150KB JS, ≤1200ms DCL, ≤60 requests on the default profile; P5 measurement may tighten, never loosen. (b) Stripe's decline-don't-degrade rule is standing law for any canvas/GPU work (failIfMajorPerformanceCaveat: true; never render slowly). (c) motion-safe: architecture adopted for V2: motion is switched ON by capability classes, never patched off. (d) The four nexo-motion candidates (nexo-drift, nexo-shape, nexo-settle, nexo-accent-card) approved for P3 exploration and encoding into the nexo-motion skill. |
| D-pre21 | 2026-08-17 | **Type process rulings (D21 pending finalist pick).** (a) Premium purchase declined for now; ROADMAP door: if at P6 the type feels insufficient on the real site, evaluate ONE premium face, one-time license only, never subscription, bench rerun required. (b) Commit-and-close law: once D21 locks the finalist, type is CLOSED until post-launch; no re-litigating mid-build. (c) J3 contradiction page names no vendors (trade-libel: the pattern is the story); owner veto open. |

## 5. SITE FACTS (verified 2026-08-17, recon receipt: docs/SITE_RECON_2026-08-17.md)

- **Stack:** Next.js 14.2.35, React 18, TypeScript strict, Tailwind 3.4, framer-motion, Radix nav, Playwright QA. Single hex-sRGB token file (`globals.css`); no OKLCH anywhere.
- **Deploy:** push to `main` → GitHub Actions (tsc TRUE 0 + build) → arm64 image → ghcr.io → Coolify webhook → live. Server never compiles. Branch pushes run checks only.
- **QA:** 18-invariant cube, 3 engines × 6 profiles, regression law, deploy gate = full green + Oli's real-iPhone checklist. Missing: performance budget, throttled old-device profile, visual screenshot diffing.
- **Staged truth:** `launch.ts` flags (LIVE_OPERATIONS, HIPAA_INFRA_VERIFIED, PORTAL_LIVE, HIPAA_EFFECTIVE_DATE) gate every strong claim; flags flip only on explicit owner instruction. This system is kept.
- **Consistency defects on record:** C1 fonts-optional (slow machines keep system fonts), C2 capability forks (glass, van), C3 subtle palette on cheap monitors, C4 unbudgeted animation cost. Measure before fixing (P5 builds the measurement).
- **Known SEO state:** homepage indexing issues open; www→apex 301 redirect planned; canonical/OG currently carry the OLD "NEMT company" positioning and will be rewritten in V2.

## 6. THE V2 PROGRAM (the professional order of work)

Each phase produces documents before code. A phase is done when its documents exist in the repo with a FIXLOG entry. V2 is a reposition + deepen + harden, NOT a teardown: the QA cube, the token system, the motion doctrine, and the signature craft (map landmarks, route van, terminus) carry forward unless a documented decision retires them.

**P0 — The machine.** Task 1: this founding commit (ground truth + FIXLOG + recon receipt on `v2`). Task 2: skills audit — list, test, and register every installed skill and tool (Playwright, agent-browser, screenshot tooling first); fix what is broken; output `docs/SKILLS_REGISTRY.md`. Task 3: the board (D13).

**P1 — Research.** Three documented studies, all with VERIFIED / REPORTED source labels. Timeboxed: research ends when the sitemap can be frozen, not when the internet runs out.
- **P1a Competitor teardown** (`docs/DESIGN_RESEARCH.md` part 1): MTM, Verida, Modivcare, SafeRide Health, and 2 to 3 modern healthcare-infrastructure SaaS sites. Full information-architecture inventory: every page they have, every information category, what an MCO sees, what a provider sees. Copy the good, reject the bad, reasons on record. Includes the SafeRide member-eligibility flow (sign-up → payer check → confirmation email) as a pattern study for the platform. Method: global scope, not NEMT-only — select exemplar companies and dissect them anatomically, section by section from navigation to footer, diagnosing every part (structure, technique, why it works) before any page of ours is designed; Mobbin is the reference tool on both the chat and Claude Code sides.
- **P1b Provider requirements research** (`docs/PROVIDER_REQUIREMENTS_RESEARCH.md`): how a transport company actually becomes a compliant NEMT provider in DC, MD, and VA. Government bodies, portals (ePREP/MPRIME, DC OCP/DHCF, VA DMAS + DMV certificate), inspections, driver requirements, insurance minimums (owner reports a $1.5M figure for at least one payer; strategic plan records VA CSL $300K to $1M — VERIFY both, publish nothing unverified). Feeds the provider resource center: state-by-state guides + downloadable PDFs.
- **P1c SEO/indexing strategy** (`docs/SEO_PLAN.md`): diagnose the homepage indexing issue, www→apex redirect, metadata/JSON-LD rewrite for the new positioning, content strategy for provider-guide pages as the organic engine.

**P2 — Sitemap freeze.** From P1: the full page inventory (how many pages, which pages, what each must contain) frozen into `docs/SITE_BUILD_PLAN.md` as numbered items. Starting hypothesis, to be corrected by research: current 12 public pages + Sign-in + provider resource center (per-state guides + PDFs) + security/trust page + FAQ. The frozen list only shrinks; new ideas go to the roadmap section.

**P3 — Design system.** Mobbin/Figma-driven, component-up: tokens reviewed against C1–C4 findings, then universal primitives (buttons, cards, forms, nav), then page-specific compositions. Every choice receipted in DESIGN_RESEARCH part 2. Consolidate `docs/UI_STANDARDS.md` (from the design report + token file) including the motion budget and the performance budget.

**P4 — Build.** Page by page against the frozen plan, one task at a time, design skills mandatory, each task ending with FIXLOG + progress update + board regeneration + commit + push to `v2` (Claude Code does the git, D7).

**P5 — QA extension + measurement.** Add to the cube: throttled old-device profile with a hard performance budget, and cross-engine visual screenshot baselines with diffing. Then measure C1–C4 and decide each: keep the fork, flatten it, or harden the palette. Decisions become D-entries.

**P6 — Copy + launch.** COPY_DECK written last (fast, per the owner ruling "copy is cheap"). Full-cube green, perf budget green, Oli's real-iPhone checklist, then merge `v2` → `main` = deploy.

## 7. QUALITY GATES (nothing merges to main without all of these)

1. tsc TRUE 0, CI green.
2. Full-cube qa:sweep green for shared-chrome changes (existing law, kept).
3. Performance budget green on the throttled old-device profile (from P5 onward).
4. Reduced-motion path for every animation; every capability fork deliberate and on record.
5. FIXLOG + progress updated in the same commit.
6. Owner's real-device checklist. GREEN IS A FLOOR.

## 8. STANDING LAWS

- **Document-first law:** we communicate through documentation, not chat memory. Every decision, change, fix, and reversal gets a written receipt in the repo. Reversals show from where, to where, and why.
- **Documents are created and edited by Claude Code in the repo.** Chat is for design discussion and sign-off only. The owner is never handed files to move by hand; the owner uploads to project knowledge only by choice.
- **FIXLOG discipline:** append-only, reverse-chronological. Every recon/audit prompt begins "Read FIXLOG.md first — do not re-flag anything recorded there as fixed unless you find evidence of regression." Every build prompt ends with appending its FIXLOG entry in the same task.
- **Discovery capture:** anything found mid-task that is not the task's job is recorded immediately (progress JSON discovery inbox), never acted on mid-task, never lost.
- **Challenge-to-test law:** see D12. Enforced by the prompt template on every fix.
- **Writing rules (site-facing):** no em-dashes in site copy/UI/payer-facing documents; "Built for HIPAA compliance" only, "100% HIPAA compliant" banned; no PHI ever; sample data labeled; 12-hour AM/PM time; evidence-based voice.
- **Skills law:** every prompt uses and combines relevant installed skills; visual work always includes the design skills (frontend-design, emil-design-eng, impeccable, ui-ux-pro-max, frontend-a11y, ui-styling, design-system, design-is, huashu-design); code/perf work uses react-patterns, react-performance, security-review, tdd-workflow; never cite ui-design:* namespace, javascript-testing-patterns, auth-implementation-patterns. FIXLOG records SKILLS USED per task.
- **Prompt format law:** every Claude Code prompt is explicit numbered steps (nothing implied), begins with the FIXLOG read-first line, ends with FIXLOG append + progress/board update + the git steps (D7: one commit, descriptive message, push to `v2`, never force-push, never touch `main`).
- **Instruction-to-Oli law:** anything the owner must do by hand arrives as a short numbered list, one action per line.
- **Publish-boundary law (D17):** resource content states requirements with citations and dates; advice-shaped content is banned; disclaimers and verification dates are mandatory on resource pages.
- **Transfer-verdict law (D16):** every design-decision task appends its verdict to docs/PLATFORM_DESIGN_HANDOFF.md in the same task.
- **Positioning language law (D15):** public copy never negates the transportation role; §1 wording is canonical.
- **GREEN IS A FLOOR:** agent-reported green can miss human-visible defects; the owner's real-device check is the last rung, always.

## 9. CURRENT STATE (update every session)

**As of August 17, 2026:** P1 complete (industry + provider + craft + SEO research, all receipted). P2 complete: SITE_BUILD_PLAN.md frozen (24 pages + workstreams; only shrinks). D18-D20 locked. Open gates: P1-B1 (owner pass on provider questions before P4 provider pages). P1-C1 closed 2026-08-17 with owner Search Console reading. NEXT: P3 design system, opening with the type-specimen bench (T2), then the hero signature concept (D19).
