# SKILLS REGISTRY — nexo-site

**Date:** 2026-08-17 · **Branch:** `v2` · **Task:** P0 Task #2 (skills audit)
**Method:** the SKILL DISCOVERY standing process (`.claude/skills/nexo-brand/SKILL.md` §0) applied to the ENTIRE
toolchain, under D6 of SITE_GROUND_TRUTH.md: *skills are audited, not assumed; broken tools are stopped and fixed,
never silently worked around.* Every skill was enumerated from the live filesystem (never from memory) and every
Tier-1 tool was executed for real, with evidence files committed. Classification of the 103 skills was performed by
11 parallel read-only subagents that opened the actual SKILL.md files; the auditor then reconciled their output into
one coherent taxonomy (see DISCOVERY 14).

**Scope note:** this task fixed TOOL/ENVIRONMENT breakage only. No site code was touched. Anything found in the site
itself is recorded under DISCOVERIES, never fixed here.

### Verdict legend

| Verdict | Meaning |
|---|---|
| **WORKING** | Exists and was exercised successfully (Tier 1) or resolves and reads coherently (Tier 2/3). |
| **FIXED** | Was broken; this task repaired it. The repair is stated. |
| **BROKEN** | Still broken after a repair attempt. Full diagnosis attached. |
| **NOT-INSTALLED** | Absent from this machine. A finding, not a failure. |
| **REDUNDANT** | Superseded for this project by a named better fit. |
| **NOT-RELEVANT** | Built for a stack, domain, or product shape this project does not have. |

---

## 1. INVENTORY

| Source | Count | Notes |
|---|---|---|
| Project skills (`.claude/skills/`) | **103** | = the 90 user skills (byte-identical) + the 14 superpowers plugin skills, vendored into the repo. |
| User skills (`~/.claude/skills/`) | **89** | Plus one empty `learned/` directory (DISCOVERY 7). |
| Plugin skills | **14** | `superpowers@claude-plugins-official` v6.0.3, enabled in `~/.claude/settings.json`. |
| MCP servers available to Claude Code | **2** | `agent-browser`, `mobbin` (see §7). |

Directory counts are 104 / 90 including one empty `learned/` folder in each tree that contains no `SKILL.md` and no
files at all; the usable totals are 103 / 89.

**"Never cite" list verification** (historical ban): `javascript-testing-patterns` — **absent**;
`auth-implementation-patterns` — **absent**; any `ui-design:*` namespace — **absent**. Nothing to suppress; the ban is
satisfied by the inventory itself.

### CLI tools

| Tool | Version | Status |
|---|---|---|
| node | v24.15.0 | WORKING |
| npm | 11.12.1 | WORKING |
| `npx playwright` | 1.61.1 | WORKING |
| `playwright-cli` | 0.1.18 (via `@playwright/cli`) | **FIXED** (was NOT FOUND) |
| `agent-browser` | 0.31.1 | WORKING |
| Playwright engines | chromium-1228, firefox-1532, webkit-2311 | All three installed; none needed installing. |

---

## 2. TIER 1 — FUNCTIONAL TESTS (critical tools, executed for real)

| Tool | Test performed | Evidence file | Verdict | Notes |
|---|---|---|---|---|
| Playwright **chromium** | Headless launch → `https://example.com` → HTTP 200, title "Example Domain" → screenshot | `scripts/qa/artifacts/skills-audit/engine-chromium.png` (10,278 B) | **WORKING** | 7.2 s. |
| Playwright **webkit** | Same | `…/engine-webkit.png` (10,793 B) | **WORKING** | 4.9 s. The Safari engine; carries the iOS proxy role in the cube. |
| Playwright **firefox** | Same | `…/engine-firefox.png` (11,215 B) | **WORKING** | 13.8 s (slowest launch). |
| **THE CUBE** (`npm run build:check` + `npm run qa:sweep`) | Full sweep, no narrowing: 13 routes × 18 invariants × 3 engines × 6 profiles | see §3 | **WORKING** | Build exit 0; sweep exit 0. |
| **playwright-cli** | `--version`, then `open https://example.com` → `screenshot --filename=…` | `…/playwright-cli.png` (11,759 B) | **FIXED** | Was NOT on PATH. Repair: `npm install -g @playwright/cli@latest` (the skill's own §Installation instruction). See DISCOVERY 6 + 13. |
| **agent-browser** | `open https://example.com` → `screenshot <path>` → `close` | `…/agent-browser.png` (10,768 B) | **WORKING** | Installed at `~/AppData/Roaming/npm/agent-browser`. Syntax is **positional** (`screenshot [selector] [path]`); `--path` is not a flag. `open` holds a persistent session, so pipe-and-exit shells appear to hang. Also exposed as MCP (§7). |
| **Mobbin MCP** | Live `search_screens` call (web platform) | returned a real screen + citable `mobbin_url` | **WORKING** | Functionally verified, not merely schema-present. See DISCOVERY 10. |

---

## 3. THE CUBE — V1 BASELINE (2026-08-17)

**Result: `═══════ CUBE ALL GREEN ✓ ═══════`** — sweep exit code 0.

| Metric | Value |
|---|---|
| Matrix cells (route × profile × engine) | **234** (13 routes × 6 profiles × 3 engines) |
| Individual invariant checks passed (✓ marks) | **3,175** |
| Failing cells | **0** |
| Retried cells (retry-once fired) | **0** |
| Errors / console errors | **0** |
| `FAIL_*.png` artifacts produced | **0** |

Per engine: **chromium GREEN ✓ · webkit GREEN ✓ · firefox GREEN ✓**. In every engine: I9 anchors all pass, I10
reduced-motion all pass, I11 no-JS all pass, I14b title uniqueness ✓, I16b canonical-identity ✓.

**Site failures (DISCOVERY class): NONE.** The cube surfaced zero real site defects, so nothing in this section is
escalated. **Environment failures requiring a fix: NONE** — no missing engine, no port-3300 conflict, no dependency
error. (Port 3300 was proactively cleared and stale `FAIL_*` artifacts removed before the run so the baseline was
measured clean.)

**This run also closes a previously-open verification gap.** Stage 16.1 changed both fonts to `display: "optional"`
to remove a font-swap reflow, but its confirming cube run was stopped before completing, leaving the change recorded
as NOT VERIFIED. In this baseline the exact cell that used to fail — `/about` × `w768` × chromium × **I5 (CLS)**,
previously 0.0213 against a 0.02 floor — is **✓**, and CLS passes in all 234 cells. The Stage-16.1 fix is now
cube-verified across all three engines.

---

## 4. TIER 2 — THE STANDING DESIGN SET

All 11 resolve, all are readable, all **WORKING**. Contributions below are grounded in the files themselves.

| Skill | One-line contribution | Verdict |
|---|---|---|
| `nexo-brand` | Supplies the actual law: 3-chapter tonal map, Bricolage/Hanken type, jade token hex, glass doctrine, COPY HONESTY GATE, visual-verification loop, QA engine-cube. | WORKING |
| `huashu-design` | Anti-AI-slop table (no purple gradients, emoji icons, SVG people), 3-parallel-direction variant exploration, four positional questions, honest-placeholder rule, Playwright screenshot verification. | WORKING |
| `frontend-design` | Two-pass method: brainstorm a token plan (4-6 named hex, display+body+utility faces, ASCII wireframes, one signature element), critique against AI-default looks, then build. | WORKING |
| `emil-design-eng` | Concrete motion law: animate-or-not frequency table, custom cubic-bezier easings, sub-300ms durations, never scale(0), transform/opacity-only, Radix transform-origin var. | WORKING |
| `impeccable` | Register-based flow: read reference/brand.md for marketing surfaces, then craft/shape/critique/audit/polish sub-commands, plus absolute bans (gradient text, per-section eyebrow, ghost-card border+shadow, 32px radii). | WORKING |
| `ui-ux-pro-max` | Queryable CSV design database via scripts/search.py (--design-system, --domain ux/landing/color/typography, --stack nextjs) plus a 10-priority checklist: contrast, 44px targets, CLS, 150-300ms motion. | WORKING |
| `design-system` | Audit lens: 10-dimension 0-10 visual scorecard with file:line fixes, an AI-slop checklist, and a generate mode emitting DESIGN.md + design-tokens.json + preview page. | WORKING |
| `ui-styling` | shadcn/Radix + Tailwind reference library (7 docs: components, theming, a11y, utilities, responsive, customization, canvas) plus utility-first, mobile-first, no-dynamic-class-names practices. | WORKING |
| `frontend-a11y` | Concrete label/id, aria-describedby+role=alert errors, aria-expanded/controls, modal focus-restore, icon-button patterns, plus an 8-item pre-review checklist for lead forms and nav. | WORKING |
| `design-is` | Rams ten-principle audit: 0-3 evidence-cited scores, five parallel evidence subagents, NEW/REFINE/REDESIGN threshold verdict, and a self-contained /make-plan handoff. | WORKING |
| `review-animations` | Ten non-negotiable motion standards plus escalation triggers, remedial hierarchy, and a Before/After table + Block/Approve verdict gating van, morph, and scroll-spine motion. | WORKING |

### Precedence rule (confirmed)

**`nexo-brand` WINS on any Nexo-specific value or rule.** Its own §0 ranks itself first and names the others as
combinable. Confirmed conflicts where the others must yield are recorded as DISCOVERY 9 — the generic skills propose
motion libraries, blur/glow effects, glassmorphism, spring physics, and their own palettes/fonts, all of which
`nexo-brand` overrides with committed token, motion, and dependency law.

### nexo-brand sync check (Step 2)

**IDENTICAL.** Repo canonical `.claude/skills/nexo-brand/SKILL.md` and user mirror
`~/.claude/skills/nexo-brand/SKILL.md` are byte-for-byte the same: **71,514 bytes, 809 lines, md5
`08d793ac25e63ed0fa4a17784ade7e62`** on both. No drift. Neither copy was edited by this task.

---

## 5. TIER 3 — EVERYTHING ELSE (92 skills)

Tally: **19 RELEVANT-TO-SITE · 14 REDUNDANT · 59 NOT-RELEVANT.**

### Overlap-family rulings (the named collisions)

**brand-family** — Keep nexo-brand as the single brand authority for this repo — it already encodes identity, voice/copy law, and consistency enforcement with real project values — and drop both brand (generic build-a-brand toolkit whose token-sync pipeline conflicts with globals.css) and brand-guidelines (Anthropic's own colors/fonts for pptx artifacts, wrong brand entirely).


**testing-family** — Keep exactly one: **playwright-cli**, as the ad-hoc browser lane that serves nexo-brand §8's visual-verification loop and §0.1's human-eye pass — while *what* gets tested and *when* stays owned by nexo-brand §10/§10.1 plus the law-protected `scripts/qa` cube harness; the other five are either duplicate doctrine or built for an app shape (runner + DB + API routes + auth + git) this static marketing site does not have.


**design-family** — Keep `design-is` as the only skill we invoke from this family — it is the sole one with machinery this repo lacks (an evidence-cited Rams audit that terminates in a NEW/REFINE/REDESIGN verdict, exactly the V2 rebuild question), run with `nexo-brand` supplying the actual values its generic anchors ask for; `design-system` is redundant against `nexo-brand` + the cube harness, and `design` and `theme-factory` are brand-asset/deck factories with no surface on a static Next.js marketing site.

**Code / perf / security**

| Skill | Purpose | Classification |
|---|---|---|
| `api-design` | REST resource naming, status codes, pagination, versioning, rate limiting for production APIs. | NOT-RELEVANT |
| `backend-patterns` | Repository/service layers, DB query tuning, Redis caching, JWT auth, queues for Node backends. | NOT-RELEVANT |
| `click-path-audit` | Traces each button handler's state sequence to find handlers that silently undo each other. | RELEVANT-TO-SITE |
| `coding-standards` | Baseline naming, immutability, error handling, code-smell conventions across TypeScript, React and APIs. | REDUNDANT (← react-patterns) |
| `error-handling` | Typed error hierarchies, Result patterns, retries, circuit breakers, error boundaries across TypeScript, Python, Go. | NOT-RELEVANT |
| `frontend-patterns` | Generic React and Next patterns: composition, hooks, state, memoization, forms, error boundaries, accessibility. | REDUNDANT (← react-patterns) |
| `nextjs-turbopack` | Next.js 16+ Turbopack: incremental bundling, FS caching, webpack fallback, proxy.ts middleware rename. | NOT-RELEVANT |
| `ponytail` | Lazy-senior-dev mode: YAGNI, stdlib and native platform before dependencies, shortest working diff. | RELEVANT-TO-SITE |
| `ponytail-audit` | Whole-repo over-engineering audit; ranked list of what to delete, shrink, or replace with native features. | RELEVANT-TO-SITE |
| `ponytail-debt` | Harvest `ponytail:` shortcut comments across the repo into a tracked deferral ledger. | NOT-RELEVANT |
| `ponytail-gain` | Print ponytail's published benchmark scoreboard (lines, cost, speed). One-shot display, changes nothing. | NOT-RELEVANT |
| `ponytail-help` | Quick-reference card for ponytail levels, sibling skills, plugin updates, and default-mode config. | NOT-RELEVANT |
| `ponytail-review` | Diff review focused only on over-engineering: delete, stdlib, native, yagni, shrink findings. | REDUNDANT (← the /simplify + /code-review slash commands (built-ins, not skills)) |
| `production-audit` | Local-evidence production-readiness audit producing blockers, scored risk, and a ship or block call. | RELEVANT-TO-SITE |
| `react-patterns` | React 18/19 hooks discipline, server/client boundaries, Suspense, form actions, state-location decisions. | RELEVANT-TO-SITE |
| `react-performance` | React/Next.js performance rules: waterfalls, bundle size, server rendering, re-render and hydration cost. | RELEVANT-TO-SITE |
| `security-review` | Security checklist for secrets, input validation, auth, endpoints, and sensitive-data handling. | RELEVANT-TO-SITE |
| `security-scan` | Scan .claude config (CLAUDE.md, settings, MCP, hooks, agents) for injection risk using AgentShield. | NOT-RELEVANT |
| `systematic-debugging` | Root-cause-first debugging: investigate, reproduce, and instrument boundaries before proposing any fix. | RELEVANT-TO-SITE |

**Data layer (project has none)**

| Skill | Purpose | Classification |
|---|---|---|
| `database-migrations` | Safe schema and data migrations, expand-contract, zero-downtime patterns for Postgres and ORMs. | NOT-RELEVANT |
| `postgres-patterns` | PostgreSQL indexing, schema design, query optimization, and row-level-security patterns. | NOT-RELEVANT |
| `supabase` | Supabase Database, Auth, Edge Functions, Realtime, Storage, CLI and SSR client integration guidance. | NOT-RELEVANT |
| `supabase-postgres-best-practices` | Postgres query, index, schema, RLS and connection-pooling performance rules from Supabase. | NOT-RELEVANT |

**Design / visual**

| Skill | Purpose | Classification |
|---|---|---|
| `algorithmic-art` | Creates p5.js seeded generative art with an Anthropic-branded interactive parameter viewer. | NOT-RELEVANT |
| `banner-design` | Designs social, ad, hero and print banners with Gemini-generated visuals and PNG export. | NOT-RELEVANT |
| `brand` | Brand voice, visual identity, asset validation and brand-guidelines-to-design-tokens sync via cjs scripts. | REDUNDANT (← nexo-brand) |
| `brand-guidelines` | Applies Anthropic's own corporate colors and Poppins/Lora typography to generated artifacts. | NOT-RELEVANT |
| `canvas-design` | Writes a design philosophy then renders museum-quality poster art as .png or .pdf. | NOT-RELEVANT |
| `design` | Mega design router: logos, corporate identity mockups, slides, banners, icons, social photos via Gemini. | NOT-RELEVANT |
| `pptx` | Create, read, and edit PowerPoint .pptx decks from templates or from scratch. | NOT-RELEVANT |
| `slack-gif-creator` | Build animated GIFs sized and optimized for Slack emoji and message posts. | NOT-RELEVANT |
| `sleek-design-mobile-apps` | Design mobile app screens through the sleek.design REST API using a SLEEK_API_KEY. | NOT-RELEVANT |
| `slides` | Builds strategic HTML presentation decks with Chart.js, layout patterns, and copywriting formulas. | NOT-RELEVANT |
| `theme-factory` | Applies ten preset color/font themes, or a generated one, to decks and HTML artifacts. | NOT-RELEVANT |
| `web-artifacts-builder` | Scaffolds and bundles multi-component React/shadcn claude.ai artifacts into one self-contained HTML file. | NOT-RELEVANT |
| `wowerpoint` | Turns one document into a kawaii NotebookLM slide-deck PDF via an external authenticated CLI. | NOT-RELEVANT |

**Docs / process**

| Skill | Purpose | Classification |
|---|---|---|
| `doc-coauthoring` | Three-stage workflow for co-authoring docs, specs, and proposals: context gathering, refinement, reader testing. | RELEVANT-TO-SITE |
| `docx` | Create, read, and edit Word .docx files including tracked changes, templates, and formatting. | NOT-RELEVANT |
| `ecc-guide` | Navigate and explain the Everything Claude Code repo's skills, commands, agents, hooks, install profiles. | NOT-RELEVANT |
| `how-it-works` | Explains what claude-mem captures, when memory injection starts, and where its local data lives. | NOT-RELEVANT |
| `internal-comms` | Write internal company communications: 3P updates, newsletters, FAQs, status reports, incident reports. | NOT-RELEVANT |
| `knowledge-agent` | Build and query filtered corpora, or brains, from claude-mem observation history via MCP. | NOT-RELEVANT |
| `mem-search` | Search claude-mem's cross-session observation database using a search, timeline, then fetch workflow. | NOT-RELEVANT |
| `pdf` | Read, create, merge, split, watermark, OCR, and fill PDF files with Python tooling. | NOT-RELEVANT |
| `skill-creator` | Create, edit, evaluate, and description-tune Claude skills, with eval scripts and benchmarking. | RELEVANT-TO-SITE |
| `standup` | Facilitates a multi-worktree/PR agent standup that reconciles scattered branches into one consolidated worktree. | NOT-RELEVANT |
| `template-skill` | Empty SKILL.md boilerplate stub with placeholder frontmatter and no instructions. | NOT-RELEVANT |
| `timeline-report` | Generates a narrative "Journey Into [Project]" report from the claude-mem development timeline. | NOT-RELEVANT |
| `weekly-digests` | Produces week-by-week narrative chapters of a project's claude-mem history via serial subagents. | NOT-RELEVANT |
| `writing-plans` | Writes zero-context implementation plans as bite-sized TDD tasks saved under docs/superpowers/plans. | REDUNDANT (← make-plan) |
| `writing-skills` | TDD for skill authoring: subagent pressure tests as baseline, then write and refactor SKILL.md. | REDUNDANT (← skill-creator) |
| `xlsx` | Create, read and repair .xlsx/.csv spreadsheets and financial models with formatting standards. | NOT-RELEVANT |

**Healthcare / compliance**

| Skill | Purpose | Classification |
|---|---|---|
| `healthcare-cdss-patterns` | Build clinical decision support: drug interaction checks, dose validation, NEWS2 scoring, alert severity. | NOT-RELEVANT |
| `healthcare-emr-patterns` | EMR/EHR encounter workflows, clinical notes, prescriptions, lab displays, audit trails, clinical data entry. | NOT-RELEVANT |
| `healthcare-eval-harness` | Jest safety gates blocking healthcare deploys on CDSS accuracy, PHI exposure, and data-integrity failures. | NOT-RELEVANT |
| `healthcare-phi-compliance` | PHI/PII classification, row-level security, audit trails, encryption, and leak vectors for clinical systems. | NOT-RELEVANT |
| `hipaa-compliance` | HIPAA entrypoint: PHI decision gates, BAA questions, minimum-necessary access, logging and vendor guardrails. | RELEVANT-TO-SITE |

**Other**

| Skill | Purpose | Classification |
|---|---|---|
| `documentation-lookup` | Fetch current library and framework docs through the Context7 MCP instead of training data. | NOT-RELEVANT |

**Testing / QA**

| Skill | Purpose | Classification |
|---|---|---|
| `e2e-testing` | Playwright @playwright/test patterns: Page Object Model, config, flaky-test triage, artifacts, CI integration. | NOT-RELEVANT |
| `playwright-cli` | Drive a browser from the `playwright-cli` command line: snapshot, click, screenshot, trace, mock network. | REDUNDANT (← webapp-testing + agent-browser MCP (kept installed, now FIXED)) |
| `react-testing` | Component and hook testing with React Testing Library, Vitest/Jest, MSW, and axe assertions. | NOT-RELEVANT |
| `tdd-workflow` | ECC TDD cycle enforcing 80%+ coverage across unit, integration and E2E tests from a plan. | REDUNDANT (← test-driven-development) |
| `test-driven-development` | Red-green-refactor discipline: watch the test fail before writing any implementation code. | NOT-RELEVANT |
| `verification-before-completion` | Gate requiring fresh command evidence before claiming anything is complete, fixed, or passing. | REDUNDANT (← nexo-brand §0.1 GREEN IS A FLOOR) |
| `webapp-testing` | Python Playwright scripts plus a server-lifecycle helper for driving and debugging local web apps. | RELEVANT-TO-SITE |

**Workflow / orchestration**

| Skill | Purpose | Classification |
|---|---|---|
| `agent-sort` | Sorts ECC skills, commands, rules and hooks into DAILY vs LIBRARY buckets using repo evidence. | NOT-RELEVANT |
| `babysit` | Polls a GitHub PR's checks, comments and review threads until it is merge-ready. | NOT-RELEVANT |
| `brainstorming` | Explores intent and requirements through dialogue, then writes an approved design spec before coding. | RELEVANT-TO-SITE |
| `claude-api` | Anthropic SDK reference: model IDs, pricing, streaming, tool use, caching, managed agents. | NOT-RELEVANT |
| `claude-code-plugin-release` | Semantic version bump, tagging, GitHub release and npm handoff for Claude Code plugins. | NOT-RELEVANT |
| `codebase-onboarding` | Reconnoiters an unfamiliar repo and emits an onboarding guide plus starter CLAUDE.md. | REDUNDANT (← SITE_GROUND_TRUTH.md + FIXLOG (doc system, not a skill)) |
| `config-gc` | Human-confirmed cleanup of stale ~/.claude skills, memory, hooks, permissions, MCP servers and caches. | NOT-RELEVANT |
| `configure-ecc` | Interactive wizard that clones the ECC repo and installs selected skills and rules. | NOT-RELEVANT |
| `context-budget` | Estimates token overhead of agents, skills, MCP servers and rules, then ranks trims. | NOT-RELEVANT |
| `deployment-patterns` | CI/CD pipelines, multi-stage Docker, health checks, rollback strategies and production readiness checklists. | RELEVANT-TO-SITE |
| `dispatching-parallel-agents` | Splits independent problem domains across concurrently dispatched subagents with focused, self-contained prompts. | RELEVANT-TO-SITE |
| `do` | Orchestrates a phased plan with implementation, verification, anti-pattern and review subagents per phase. | RELEVANT-TO-SITE |
| `executing-plans` | Load a written plan, review it critically, execute tasks sequentially, then finish the branch. | REDUNDANT (← do) |
| `finishing-a-development-branch` | Verify tests, then present merge, PR, keep, or discard options and clean up worktrees. | RELEVANT-TO-SITE |
| `git-workflow` | Team Git practice: branching strategies, commit conventions, merge versus rebase, conflicts, release tagging. | NOT-RELEVANT |
| `learn-codebase` | Prime a project by reading every source file in full, paging through large ones. | REDUNDANT (← SITE_GROUND_TRUTH.md + docs/SITE_RECON (the doc system now does onboarding)) |
| `make-plan` | Author phased implementation plans starting with subagent documentation discovery and per-phase verification checklists. | RELEVANT-TO-SITE |
| `mcp-builder` | Design and build MCP servers exposing external APIs as LLM tools in TypeScript or Python. | NOT-RELEVANT |
| `oh-my-issues` | Cluster a GitHub issue backlog by root cause into plan-master issues and bundled fix PRs. | NOT-RELEVANT |
| `pathfinder` | Map a codebase into per-feature flowcharts, hunt duplication, propose a unified architecture via subagents. | NOT-RELEVANT |
| `receiving-code-review` | Evaluate review feedback technically: verify against the codebase, push back, no performative agreement. | RELEVANT-TO-SITE |
| `requesting-code-review` | Dispatch a reviewer subagent over a BASE_SHA..HEAD_SHA range with a templated context brief. | REDUNDANT (← the /code-review slash command (built-in, not a skill)) |
| `smart-explore` | Token-cheap AST code search via smart_search/smart_outline/smart_unfold MCP tools instead of reading whole files. | NOT-RELEVANT |
| `subagent-driven-development` | Executes an implementation plan by dispatching one fresh implementer subagent plus review per task. | REDUNDANT (← do) |
| `using-git-worktrees` | Ensures feature work happens in an isolated worktree, detecting existing isolation before creating one. | NOT-RELEVANT |
| `using-superpowers` | Meta-rule forcing skill discovery and invocation before any response, question, or action. | NOT-RELEVANT |
| `what-the` | One-line prompt asking for a plain-English who/what/where/why/when breakdown of something technical. | NOT-RELEVANT |

---

## 6. CANONICAL PICKS (what we use going forward)

| Category | Canonical pick(s) | Rationale |
|---|---|---|
| **Design law** | `nexo-brand` | The only skill carrying real Nexo values (tokens, tonal map, copy gate, QA law). Wins every conflict. |
| **General design** | `impeccable` (brand register) + `frontend-design` | `impeccable` supplies the register-based craft flow and the absolute-bans list; `frontend-design` the two-pass token/wireframe method. Both yield to nexo-brand on values. |
| **Design audit / verdict** | `design-is` | The only one that terminates in an evidence-cited NEW / REFINE / REDESIGN verdict — exactly the V2 question. `design-system` is kept as a scorecard lens only. |
| **Anti-slop doctrine** | `huashu-design` (doctrine only) | Its anti-AI-slop table and variants-not-final-answers rule transfer; its machinery does not, and it self-excludes SEO sites. |
| **Accessibility** | `frontend-a11y` | Concrete label/aria/focus patterns matching the lead forms and nav. |
| **Motion review** | `review-animations` + `emil-design-eng` | Gate the van, morph, and scroll-spine motion; both align with nexo-brand §5 ceilings. |
| **UI implementation reference** | `ui-styling` | Tailwind/Radix reference. Note: this project does **not** use shadcn, so its shadcn half is inert. |
| **Cross-check list** | `ui-ux-pro-max` | Its enumerated a11y/perf/layout/forms checklist maps ~1:1 onto existing cube invariants; use as an independent second pass, never as a palette/font generator. |
| **React code** | `react-patterns` (+ `react-performance` from P5) | Supersedes `frontend-patterns` and `coding-standards` for this stack. |
| **Testing / QA** | **`scripts/qa` cube** (law: nexo-brand §10 / §10.1) — primary; `webapp-testing` for ad-hoc §8 screenshot loops; **agent-browser MCP** for one-off inspection | The cube is the test suite. `playwright-cli` is installed and now working but is not the default lane. No test runner, no component tests, no DB/auth/API routes exist, so the runner-based testing skills do not apply. |
| **Security** | `security-review` + `healthcare-phi-compliance` / `hipaa-compliance` | Server-action, header/injection, and PHI-gate review. |
| **Code/perf audits** | `production-audit`, `click-path-audit`, `systematic-debugging`, `ponytail` / `ponytail-audit` | Used for the P5 hardening pass and for defect hunts. |
| **Docs / process** | The repo doc system (`SITE_GROUND_TRUTH.md` + `FIXLOG.md`) is authoritative; `doc-coauthoring` for long docs, `skill-creator` for authoring skills | The doc system supersedes the codebase-onboarding skills for resuming work. |
| **Workflow / orchestration** | `do`, `dispatching-parallel-agents`, `brainstorming`, `make-plan` | `do` + parallel agents drove this very audit. |

---

## 7. MCP INVENTORY + MOBBIN / FIGMA DIVISION OF LABOR

| Server | Scope | Available to Claude Code? | Verified |
|---|---|---|---|
| **`agent-browser`** | user-level (`~/.claude.json`) | **YES** | CLI + MCP surface both exercised. |
| **`mobbin`** | user-level (`~/.claude.json`) | **YES** | Live `search_screens` call returned a real screen with a citable `mobbin_url`. |
| `playwright` (MCP) | scoped to a **different project path** | no | Not available in this repo; the Playwright **library** + cube are used instead. |
| `shadcn` (MCP) | scoped to a **different project path** | no | Not available here; this project does not use shadcn. |
| **Figma** | not configured anywhere | **no** | — |

**Division of labor (corrects the assumption in D11):** **Mobbin research can run directly inside Claude Code** — I can
search Mobbin, receive screens as images, and cite `mobbin_url` per reference, which is exactly what the D11 receipt
discipline requires (screenshot + what we take + what we reject + why) in `docs/DESIGN_RESEARCH.md`. **Figma has no MCP
server**, so Figma references still arrive through Claude chat as screenshots/links and are receipted the same way.
D11 remains correct that both Claude chat and Claude Code use the pipeline; it is now established that Claude Code is
not limited to second-hand Mobbin material.

---

## 8. DISCOVERIES (found, recorded, NOT acted on)

1. **`nexo-brand` §7.2 is stale versus D1.** The skill still states "the operating model is UNDECIDED" (lines 15,
   605–606) and **bans "provider", "broker", and "operations platform" as self-descriptions**, permitting only
   "technology-first NEMT company". SITE_GROUND_TRUTH D1 now fixes the positioning as a **medical transportation
   management organization ("we manage; providers drive")**. The skill must be amended in **BOTH copies in the same
   change** (its own SYNC RULE) — a future task, not this one.
2. **`impeccable` script paths cannot resolve.** Every command it documents points at
   `.agents/skills/impeccable/scripts/*.mjs`, but there is **no `.agents/` directory**; the 26 `.mjs` scripts actually
   live at `.claude/skills/impeccable/scripts/`. Verified directly. Its scripted steps fail as written; the doctrine
   is still usable.
3. **`impeccable` setup hard-blocks on this repo.** Setup step 1 routes to `reference/init.md` when it reports
   `NO_PRODUCT_MD`; **no `PRODUCT.md` (or `DESIGN.md`) exists** at the repo root. A literal run detours into init
   before any design work. (Deciding whether to add PRODUCT.md or invoke it partially is a P3 decision.)
4. **`huashu-design` has dangling references.** Its directory contains **only `SKILL.md`** — every `references/*.md`,
   `assets/*`, and `scripts/*` path it routes to is missing. Verified directly.
5. **`huashu-design` self-excludes this project type.** Its own scope section lists SEO/marketing sites as
   不适用 (not applicable) and defers them to `frontend-design`. Only its transferable doctrine is adopted (§6 canonical picks).
6. **The `playwright-cli` skill doc is stale versus the installed binary.** The tool prints a version-mismatch banner
   and offers `playwright-cli install --skills`; the doc's `screenshot --path=` is wrong (the real flag is
   `--filename`, or a positional path). **Not run here** because it would rewrite a repo-tracked skill file outside
   this task's authorized staging list.
7. **Empty `learned/` skill directory** exists in **both** `.claude/skills/` and `~/.claude/skills/` — no `SKILL.md`,
   no files at all. Cleanup candidate.
8. **The repo vendors a copy of the 14 superpowers plugin skills.** Each of those skills therefore exists twice (plugin
   cache + repo copy). Today they are byte-identical, but this is a drift surface with no sync rule attached.
9. **Doctrine conflicts between the generic design skills and `nexo-brand`** (nexo-brand wins; recorded so future tasks
   do not "fix" the site toward the generic advice): `impeccable` endorses motion libraries (motion/gsap/anime.js/lenis)
   and blur/glow as premium materials, and caps card radii at 12–16px — against nexo-brand's no-new-dependency rule,
   §5 no-glow/bloom/gradient ceiling, and the footer's deliberate 28/32px endcap; `ui-ux-pro-max` treats
   `--design-system` (palette + font recommendations) as required, offers glassmorphism as a selectable style, prefers
   spring physics over the nav's fixed decelerate cubic-bezier, and states a 16px body minimum against nexo-brand's
   13px console floor.
10. **D11 correction — Mobbin MCP is available to Claude Code** and was functionally verified. The fallback wording
    ("Mobbin/Figma research runs through Claude chat") applies only to **Figma**, which has no MCP server. `shadcn` and
    `playwright` MCP servers exist in the user config but are scoped to a different project and are unavailable here.
11. **Stage 16.1's open verification gap is now closed** (recorded so it is not re-flagged as outstanding): the
    `display: "optional"` font change is cube-verified; `/about` × `w768` × chromium × I5 passes, CLS green in all 234 cells.
12. **The npm package `playwright-cli` is deprecated** ("use `@playwright/cli` instead"). Recorded so no future task
    reinstalls the wrong package; `@playwright/cli@0.1.18` is what is now installed globally.
13. **QA artifacts hygiene** — the six stale `FAIL_chromium_*` entries under `scripts/qa/artifacts/` are **tracked
    files**, not directories (recon receipt §9 called them directories; corrected here). Clearing artifacts before the
    baseline run deleted them; they were **restored unchanged** because cleanup belongs to a future task, not this
    one. They remain a cleanup candidate.
14. **Parallel classification produces circular rulings — a method note for future audits.** Splitting one taxonomy
    across independent batch agents yielded mutually-superseding pairs (`learn-codebase ↔ codebase-onboarding`,
    `make-plan ↔ writing-plans`, `webapp-testing ↔ playwright-cli`, `do ↔ subagent-driven-development`,
    `frontend-patterns ↔ react-patterns`). The auditor reconciled all of them into one taxonomy (20 rows overridden).
    Two agent rulings also cited `/simplify` and `/code-review` as superseding "skills"; those are **built-in slash
    commands, not installed skills**, and were corrected. Future skill audits should assign overlap families to a
    single agent (as this task did for the three named families) rather than to independent batches.
15. **`playwright-cli` writes scratch into the repo root.** Running it created an untracked `.playwright-cli/`
    directory (page snapshot `.yml` files). Removed after the test. It is a `.gitignore` candidate so the tool cannot
    dirty the working tree during a future task.
