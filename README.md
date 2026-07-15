# Nexo Access — marketing site

Premium marketing site for **Nexo Access** (FC Nexo LLC), a technology-first non-emergency medical
transportation (NEMT) company built for DC / Maryland / Virginia. Next.js 14 (App Router), React 18,
Tailwind 3.4. Static pages + on-demand server actions for the lead forms (AWS SES).

## Getting started

```bash
npm install
npm run dev          # dev server → http://localhost:3000
```

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Local dev server |
| `npm run build` / `npm run start` | Production build + serve (the deploy path) |
| `npm run build:check` | Verification build into `.next-check` (safe while a server is up) |
| `npm run qa:sweep` | The standing QA harness — asserts invariants I1–I16 across every route (see `scripts/qa/README.md`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |

## Deploy

**Coolify** on the company AWS server (Node runtime, `next build` → `next start`). **Not Vercel.** The
full handoff — DNS at GoDaddy, env vars, the do-not-touch MX/SES-DKIM warning, and the launch-day
checklist — is in **[`DEPLOY-NOTES.md`](./DEPLOY-NOTES.md)**.

## Brand + build law

All design/copy/build rules live in **`.claude/skills/nexo-brand/SKILL.md`** (the copy honesty gate, the
tonal map, the QA regression rule, and "green is a floor" reporting). Read it before changing anything.
