# Deploy notes — Nexo Access

The handoff checklist for taking this site live. **Not law** (the brand/build law lives in
`.claude/skills/nexo-brand/SKILL.md`). Authoritative infra source: **NEXO_INFRASTRUCTURE_MASTER (July 14)**
— this supersedes any earlier Vercel assumptions.

## Hosting — Coolify on the company AWS server

- **Deploy target: Coolify** (self-hosted PaaS) on the company's AWS server. **Node runtime**, standard
  Next.js build: **`next build` → `next start`**. No Docker/edge specifics required.
- **No Vercel-specific APIs or config** are used — verified: zero `vercel` / `@vercel` / `runtime = "edge"`
  references in `src/`, `next.config.mjs`, or `package.json`. Pages prerender static (○); the lead-form
  **server actions** run on-demand on the Node server (this is why the site is NOT `output: export`).
- Optional: set `output: "standalone"` in `next.config.mjs` for a smaller self-contained server bundle if
  Coolify's build image benefits — NOT required; `next build`/`next start` work as-is. (Leave `distDir`
  alone; `NEXT_DIST_DIR` is only used by the local `build:check` verification.)
- Serve HTTPS only (Coolify/Traefik provisions the cert); redirect HTTP → HTTPS.

## Environment variables (mirror into Coolify) — server-only, never `NEXT_PUBLIC_`

| Name | Value |
|------|-------|
| `AWS_SES_REGION` | `us-east-2` |
| `AWS_ACCESS_KEY_ID` | *(the send-only IAM key — from the secret store)* |
| `AWS_SECRET_ACCESS_KEY` | *(secret)* |

These are the ONLY secrets. Read at call time by `src/lib/mail.ts`; a missing one degrades the lead form
to a friendly "temporarily unavailable", never a crash. See `.env.example` for the names.

## DNS at GoDaddy (A records) — canonical apex

- **Apex `https://nexoaccess.com` is canonical** (`metadataBase`, every per-page canonical, the sitemap,
  and `robots.host` all use the bare apex — no `www`, no trailing slash on interior routes).
- `A  @   → 18.227.154.219` (the company server).
- `A/CNAME  www  → 18.227.154.219` (or a host-level 301 `www` → apex; either is fine — apex stays canonical).
- **`fcnexo.com` keeps its EXISTING forwarding** (legal-entity domain → brand). Do not repoint it here.

> ### ⚠️ CRITICAL — DO NOT TOUCH THESE GoDaddy RECORDS
> Email delivery + SES sending reputation depend on them. Add/change **ONLY** the `@` and `www` A records.
> - **Leave the MX records** exactly as they are (inbound email).
> - **Leave the three SES DKIM CNAMEs** exactly as they are (`*._domainkey.nexoaccess.com` → AWS) — these
>   are what verify the `nexoaccess.com` sending domain; removing one breaks the lead-form emails.
> - Do not add/alter any SPF/DMARC TXT unless the infra owner directs it.

## Launch-day checklist

- [ ] **Set the HIPAA effective date:** in `src/lib/launch.ts` set `HIPAA_EFFECTIVE_DATE` to the public
      launch date — OR the fixed adoption date the owner chooses (see the launch.ts comment). Until set,
      the HIPAA Notice shows the "takes effect when we first handle member information" line. Rebuild.
      (There is no separate site-launch-date constant — this is the only date to set.)
- [ ] **§10.6 — RE-COUNT THE STATS-BAND NUMBERS against the live platform codebase**
      (**4** scrub · **7** adjudication · **13** frozen fields · **2** appeal levels · **3** service
      levels · **RLS on every table**). This repo cannot see the platform; if any count changed, the copy
      must change (homepage proof band + `/platform` + the service-level morph). These numbers are CLAIMS.
- [ ] **Verify the round-trip / multi-leg copy ban still holds** (§10.4) — copy says "outbound and return
      trips scheduled around the appointment," never "linked" / "as one trip." Lift ONLY when the
      platform's multi-leg redesign actually ships, on the owner's explicit say-so.
- [ ] **SES production access:** the account is in the **SES sandbox** (domain verified). Auto-acks reach
      only verified addresses until AWS grants production access; check its status. When granted, re-confirm
      the anti-abuse posture (per-recipient ack cooldown + global per-instance cap) before relying on it.
- [ ] **Trusted-proxy IP boundary:** `clientIp()` (`src/app/actions/leads.ts`) prefers `x-real-ip` then the
      first `x-forwarded-for` hop. Confirm Coolify's proxy (Traefik) sets a trustworthy client-IP header so
      the leftmost XFF can't be spoofed; the global per-instance cap is the spoof-proof backstop regardless.
- [ ] **`LIVE_OPERATIONS` stays `false`** until real trips run (keeps "Built for the DMV", never "serving").
- [ ] **`HIPAA_INFRA_VERIFIED` stays `false`** until the platform is verified in production on the
      BAA-covered AWS server (TLS + encryption-at-rest confirmed) — it gates the "Built for HIPAA
      compliance" → concrete-infrastructure copy swap.
- [ ] **Google Search Console:** verify the apex (TXT record — this is fine to add, it is not MX/DKIM),
      then **submit `https://nexoaccess.com/sitemap.xml`**.
- [ ] **Rich Results test** on the live URL: <https://search.google.com/test/rich-results> (the JSON-LD was
      structurally validated pre-deploy; the Rich Results test needs the public page).
- [ ] **Google Business Profile:** create as a **service-area business** (no storefront address), category
      **"Medical transportation service"**, phone **(202) 409-2970**, service area DC/MD/VA.
- [ ] **Bing Webmaster Tools:** import from Search Console + submit the same sitemap.
- [ ] Confirm `robots.txt` + `sitemap.xml` resolve on the live apex and list only apex URLs; re-run
      Lighthouse (SEO + Performance ≥ 90) against the live URL.

## Platform-repo follow-ups (flagged — NOT this repo's launch)

- **Honor the `?portal=` sign-in hint.** The marketing nav's "Sign in" menu deep-links to
  `https://app.nexoaccess.com/login?portal=<member|provider|care>` (single-sourced from
  `SITE.portalLogin`). **Today the platform can ignore the param** — an unknown/absent `?portal=` must
  land gracefully on the existing `/login` picker (the same page the footer "Sign in" →
  `SITE.loginUrl` points at). The platform-side task is to READ `?portal=` and preselect / route to
  that audience's door. Until then, everything still works (picker fallback); this is an enhancement,
  not a blocker.
- **Admin stays off every public surface.** The three public doors are `member` / `provider` / `care`
  only. The admin / staff / ops portal is **never** linked, named, or hinted at on the marketing site
  (security posture, recorded in brand law §7.4). If the platform adds an admin login, it does NOT get
  a marketing-site link.

## NAP consistency (permanent rule)

**Name / Phone / Email must be letter-identical everywhere, forever** — the site, JSON-LD, Google Business
Profile, Bing, any directory. On the site this is single-sourced from `src/lib/site.ts` and guarded by
harness invariant **I16** (zero non-`info@` email; identity consistent across routes). Name = **Nexo
Access** (legal **FC Nexo LLC**); Phone = **(202) 409-2970**; Email = **info@nexoaccess.com**. Off-site
listings must match exactly.

## Future content layer (post-launch SEO — record, don't build yet)

- **Per-city / per-jurisdiction service pages** (NEMT in Washington DC; Montgomery County, MD; Fairfax
  County, VA) as a programmatic content layer once `LIVE_OPERATIONS` flips to "serving" — honest,
  launch-flag-governed copy, each with its own canonical + sitemap entry.
- Revisit the sitemap `changeFrequency`/`priority` + add real `lastModified` once there's a genuine
  content-change signal (no fabricated dates before then).
