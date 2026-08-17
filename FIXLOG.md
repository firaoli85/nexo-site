# FIXLOG — nexo-site

Permanent, append-only, reverse-chronological ledger of every fix, change, and reversal. Newest entry at the top, directly under this header block. Entry format:

### YYYY-MM-DD — task name (short commit)
- **WRONG / BEFORE:** what was wrong or absent, or the state we moved from.
- **CHANGED:** what this task did.
- **VERIFIED:** how it was verified (tsc, qa:sweep scope, manual check).
- **TESTS ADDED:** the challenge-to-test law (D12) — tests created for any hard problem fixed, or "none — no challenge class in this task."
- **SKILLS USED:** which installed skills were used, or "none."
- **AUDIT GUIDANCE:** what a future recon should NOT re-flag because of this entry.

Rule for every future recon/audit prompt: read this file first; do not re-flag anything recorded here as fixed unless there is evidence of regression.

---

### 2026-08-17 — Task #2: P0 skills audit (registry, cube baseline, tool fixes)
- **WRONG / BEFORE:** The toolchain was assumed, never audited (D6). No registry existed, so nobody knew which of the ~100 installed skills applied to this site, which overlapped, or which tools actually ran. `playwright-cli` was documented by an installed skill but was NOT on PATH (the npm package `playwright-cli` is deprecated). The V1 QA cube had no recorded full-green baseline on the `v2` branch, and Stage 16.1's `display:"optional"` font fix was still recorded as NOT VERIFIED because its confirming cube run had been stopped early.
- **CHANGED:** Enumerated the whole toolchain from the live filesystem: 103 project skills (= 90 user skills byte-identical + 14 vendored superpowers plugin skills), 89 user skills, 14 plugin skills, 2 MCP servers (`agent-browser`, `mobbin`). Ran Tier-1 functional tests with committed evidence (3 Playwright engines, the full cube, playwright-cli, agent-browser, a live Mobbin MCP query). **FIXED `playwright-cli`** by following the skill's own §Installation: `npm install -g @playwright/cli@latest` (0.1.18, now on PATH, `open` + `screenshot` verified). Classified all 103 skills into Tier 2 (11 standing design skills) and Tier 3 (92) via 11 parallel read-only subagents, then reconciled their circular rulings into one taxonomy. Wrote `docs/SKILLS_REGISTRY.md` (inventory, Tier-1 table, cube baseline, Tier-2 + sync check, Tier-3 by category, canonical picks, MCP division of labor, 14 discoveries).
- **VERIFIED:** `npx tsc --noEmit` TRUE 0 (no TypeScript touched). **THE CUBE: ALL GREEN** — 234 cells (13 routes x 6 profiles x 3 engines), 3,175 invariant checks passed, 0 failures, 0 retries, 0 console errors, 0 `FAIL_*` artifacts; chromium + webkit + firefox each GREEN. Tier-1 evidence committed under `scripts/qa/artifacts/skills-audit/` (5 screenshots, 10.2–11.8 KB each). `nexo-brand` sync check: repo canonical and user mirror are **IDENTICAL** (71,514 bytes, 809 lines, md5 `08d793ac25e63ed0fa4a17784ade7e62`). Agent claims about `impeccable` and `huashu-design` were re-verified by the auditor directly rather than taken on trust.
- **TESTS ADDED:** none in this commit, and the reason is stated rather than skipped (D12). The one thing FIXED was an environment/install gap (a global CLI absent from PATH), not a code-regression class, and the re-runnable Tier-1 procedure in the registry is its durable check. A real guard — a `scripts/qa/toolchain-check.mjs` preflight asserting node/npm/playwright/3 engines/`playwright-cli`/`agent-browser` resolve, wired into `qa:sweep` — belongs in P0 Task 3 or P5 and is **recommended as a follow-up**; it was not added here because this task's authorized staging list covers only the registry, FIXLOG, and the evidence directory.
- **SKILLS USED:** `nexo-brand` §0 (the SKILL DISCOVERY standing process that structures this audit) and §10/§10.1 (the cube law); `dispatching-parallel-agents` / `do` (11-agent parallel classification); `webapp-testing` + `playwright-cli` + `agent-browser` (Tier-1 execution); `mobbin` MCP (functional verification).
- **AUDIT GUIDANCE:** Do not re-flag anything in `docs/SKILLS_REGISTRY.md` §8 as a new discovery — specifically: the stale `nexo-brand` §7.2 operating-model text (D1 supersedes it; amending BOTH skill copies is a future task), `impeccable`'s `.agents/` script-path breakage and its `NO_PRODUCT_MD` setup block, `huashu-design`'s missing `references/`/`assets/`/`scripts/` and its SEO-site self-exclusion, the stale `playwright-cli` skill doc versus its binary, the empty `learned/` skill directory in both trees, the vendored duplicate of the 14 superpowers skills, the generic-skill-versus-nexo-brand doctrine conflicts, and the deprecation of the npm `playwright-cli` package. Also do not re-flag Stage 16.1's font fix as unverified — this task's cube verified it (`/about` x w768 x chromium x I5 now passes; CLS green in all 234 cells). The cube baseline recorded here found ZERO site defects, so any future cube failure is a genuine regression against this baseline, not a pre-existing condition.

### 2026-08-17 — Task #1: found the machine (v2 branch, ground truth, FIXLOG, recon receipt)
- **WRONG / BEFORE:** No document system in the repo. Decisions lived in code comments and lost chat "stage reports." Site positioned as an NEMT company; operating model recorded as UNDECIDED in src/lib/launch.ts.
- **CHANGED:** Created branch v2. Committed SITE_GROUND_TRUTH.md (law, decisions D1–D13), this FIXLOG, and docs/SITE_RECON_2026-08-17.md (full recon receipt: repo inventory, styling system facts, QA cube facts, cross-machine inconsistency candidates C1–C4, doc inventory, session decisions).
- **VERIFIED:** tsc TRUE 0 (no code changed); files present on v2; push accepted; CI check job expected green.
- **TESTS ADDED:** none — documentation-only founding task; no challenge class fixed.
- **SKILLS USED:** none — documentation task.
- **AUDIT GUIDANCE:** Do not re-flag the missing doc system, the UNDECIDED operating-model note, or the C1–C4 candidates as new discoveries; all are on record here and in the recon receipt. C1–C4 are HYPOTHESES awaiting P5 measurement, not confirmed defects.
