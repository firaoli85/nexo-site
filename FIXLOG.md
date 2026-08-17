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

### 2026-08-17 — Task #1: found the machine (v2 branch, ground truth, FIXLOG, recon receipt)
- **WRONG / BEFORE:** No document system in the repo. Decisions lived in code comments and lost chat "stage reports." Site positioned as an NEMT company; operating model recorded as UNDECIDED in src/lib/launch.ts.
- **CHANGED:** Created branch v2. Committed SITE_GROUND_TRUTH.md (law, decisions D1–D13), this FIXLOG, and docs/SITE_RECON_2026-08-17.md (full recon receipt: repo inventory, styling system facts, QA cube facts, cross-machine inconsistency candidates C1–C4, doc inventory, session decisions).
- **VERIFIED:** tsc TRUE 0 (no code changed); files present on v2; push accepted; CI check job expected green.
- **TESTS ADDED:** none — documentation-only founding task; no challenge class fixed.
- **SKILLS USED:** none — documentation task.
- **AUDIT GUIDANCE:** Do not re-flag the missing doc system, the UNDECIDED operating-model note, or the C1–C4 candidates as new discoveries; all are on record here and in the recon receipt. C1–C4 are HYPOTHESES awaiting P5 measurement, not confirmed defects.
