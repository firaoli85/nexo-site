# SEO & INDEXING PLAN — P1c

**Task #8, 2026-08-17. Branch `v2`. Research and specification only: no site code changed by this task.**
Implementation lands in **P4** and is re-verified there.

**Source law.** Every factual claim is **VERIFIED** (fetched and quoted, with the date), **REPORTED** (a
source asserts it, unconfirmed by us), or **UNRESOLVED**. There are no search volumes, keyword-difficulty
scores, traffic estimates, or ranking positions anywhere in this document, because **we have no keyword tool
and no Search Console API access**. A fabricated metric would be the worst failure available here, so where a
number is unavailable the text says so. **No ranking outcome is promised anywhere in this plan.**

---

## 1. CURRENT-STATE AUDIT — VERIFIED 2026-08-17

All checks by `curl` (which executes no JavaScript) against the live production site.

### 1.1 Apex vs www — the duplicate-host state

| Check | `nexoaccess.com` | `www.nexoaccess.com` |
|---|---|---|
| HTTPS status | **200** | **200** |
| Redirects to the other host | **none** | **none** |
| `Content-Length` | 222,048 | **222,048 (identical)** |
| `ETag` | `"13x53aqr78w4r74"` | **`"13x53aqr78w4r74"` (identical)** |
| `rel=canonical` (home) | `https://nexoaccess.com` | **`https://nexoaccess.com`** |
| `rel=canonical` (`/platform`) | `https://nexoaccess.com/platform` | **`https://nexoaccess.com/platform`** |
| `robots.txt` | apex `Host:` + apex `Sitemap:` | **identical** |
| `meta robots` | `index, follow` | `index, follow` |

**Both hostnames serve byte-identical 200 responses. Neither redirects.** The cross-host `rel=canonical` is
implemented **correctly**, including on deep pages, and both hosts declare the apex sitemap.

**A redirect layer already exists, and it deliberately preserves host.** Verified 2026-08-17:

- `http://nexoaccess.com/` → **302** → `https://nexoaccess.com/`
- `http://www.nexoaccess.com/` → **302** → `https://www.nexoaccess.com/` — **to www, not to the apex**

So the proxy normalises *protocol* and not *host*. Host normalisation has to be added on purpose; it will not
arrive as a side effect of the TLS layer.

### 1.2 robots.txt and sitemap.xml

`robots.txt` (identical on both hosts):

```
User-Agent: *
Allow: /

Host: https://nexoaccess.com
Sitemap: https://nexoaccess.com/sitemap.xml
```

Zero `Disallow` lines. **Note: the `Host:` directive is a Yandex convention. Google ignores it, and it is not
a substitute for a 301** — this matters, because it is easy to read that line as if host consolidation were
already handled.

`sitemap.xml`: **13 `<loc>` entries, all apex-hostname**, `changefreq: monthly`, `priority` 1 for `/` and 0.7
for the other twelve. No `lastModified` — deliberate (`src/app/sitemap.ts` L7, "we don't fabricate dates").
The 13 match `ROUTE_META` and the QA harness `ALL_ROUTES` exactly. 15 `page.tsx` files exist; the two
excluded are `/email-preview` (dev-only, `robots: noindex`, `notFound()` in production) and `not-found.tsx`.
**That exclusion is correct, not a coverage gap.**

### 1.3 Metadata, OpenGraph and JSON-LD

| | `/` | `/platform` | `/solutions/providers` |
|---|---|---|---|
| Title (chars) | 63 | 40 | 55 |
| Description (chars) | 160 | 157 | 153 |
| Canonical | self, correct | self, correct | self, correct |
| `meta robots` | `index, follow` | `index, follow` | `index, follow` |
| `<h1>` count | 1 | 1 | 1 |
| JSON-LD blocks | 1 | 1 | 1 |
| JSON-LD `@type` | `MedicalBusiness` + nested `AdministrativeArea`/`State` | identical | identical |

Structural observations, all VERIFIED:

- **One `MedicalBusiness` node, site-wide, byte-identical on every route** (`src/lib/schema.ts`, emitted at
  `src/app/layout.tsx:73-76`). Fields: `@id`, `name`, `legalName`, `url`, `logo`, `image`, `email`,
  `telephone`, `description`, `areaServed` (DC, MD, VA). **No `address`, no `aggregateRating`** — deliberate
  omissions with a stated reason at `schema.ts:5-7`.
- **Absent schema types:** no `WebSite`, no `BreadcrumbList`, no `FAQPage`, no `Organization` proper, no
  `Service`. **There is no per-page schema seam at all** — adding one means adding an emitter and choosing a
  mount point, because the root layout takes no route params.
- One shared `/og.png` for every page; no per-page social image. `og:type=website` everywhere.
- `og:locale` is present **only on the homepage**, absent on the two interior pages. Cosmetic inconsistency
  in the metadata factory.
- Titles are **inconsistent in pattern**: home is `Nexo Access | <descriptor>` (brand first), interiors are
  `<page> | Nexo Access, NEMT for the DMV` (brand second). The interior tail is a fixed 30-character
  boilerplate repeated on all 12.
- Homepage canonical is `https://nexoaccess.com` (no trailing slash) while the served URL is
  `https://nexoaccess.com/`. Harmless — Google normalises, and the sitemap uses the same slashless form
  consistently — but noted.
- **A naive grep reports two `application/ld+json` hits per page. There is only one real tag**; the second
  occurrence is inside the Next.js RSC flight payload. Recorded so a future audit does not "fix" a
  duplicate-schema bug that does not exist.

### 1.4 Positioning check — CONFIRMS DISC-7, and it is worse than "the descriptions are stale"

**VERIFIED: the word "management" (and the stem "manage") appears ZERO times across the entire indexed
metadata surface** — title, meta description, every `og:`/`twitter:` tag, the JSON-LD, and the `<h1>` — on
all three audited pages.

The live homepage description reads, verbatim:

> "Non-emergency medical transportation for Medicaid members across DC, Maryland, and Virginia. **Nexo Access
> is the technology-first NEMT company built for the DMV.**"

And the site-wide JSON-LD `description`, served on **every one of the 13 routes**, reads verbatim:

> "**Nexo Access is a technology-first NEMT company built for the DMV.**"

Ground truth §1 (D1, D15) locks the positioning as:

> "Nexo Access is a **medical transportation management organization**. Transportation is the business: trips
> are delivered through our credentialed network of transport providers … Providers operate the vehicles;
> Nexo Access manages and answers for the service."

**The single highest-leverage defect is structural, not editorial.** The old framing is asserted in
machine-readable form on every page from one shared string, and it contradicts the same page's human-readable
copy where that copy is already correct. `/solutions/providers` is the clearest case: its description
correctly says *"Join the Nexo Access network"* while its JSON-LD simultaneously declares the company **is**
an NEMT company. **One edit to the shared schema source corrects the entity description site-wide.**

`og:image:alt` and `twitter:image:alt` carry the same problem site-wide: *"Nexo Access, non-emergency medical
transportation across DC, Maryland, and Virginia"* — the company named **as** the transportation.

### 1.5 SSR — GREEN, tested rather than assumed

**A crawler that executes zero JavaScript sees the full content.** This was tested against the specific
App Router failure mode (content living only inside RSC flight-data script payloads) rather than assumed.

Method: delete every `<script>…</script>` block from the raw response and measure what survives.

| Route | Bytes | Visible text after stripping scripts | Real headings | Crawlable links |
|---|---|---|---|---|
| `/` | 222,048 | 6,056 chars | 17 | 28 |
| `/about` | 74,153 | 1,851 chars | 10 | 21 |
| `/solutions/mcos` | 95,624 | 2,019 chars | 9 | 20 |

Marketing copy sits in ordinary `<p>` elements. The flight payload **duplicates** the HTML, it does not
substitute for it. Scripts are 49–59% of page bytes, which is why the files look large — standard Next.js
hydration data. **Refetching each URL with a Googlebot user-agent returned byte-identical responses with
identical `h1`s: no cloaking.**

**Two honest caveats, neither fatal:**

1. **Header nav links are not in the HTML.** The three nav dropdowns render as bare `<button>` triggers;
   Radix unmounts closed menus, so sub-links appear nowhere in the raw markup. The header contributes only
   **2** crawlable links. **Fully mitigated** by the footer, which ships all 15 route links on every page, so
   all 13 sitemap URLs remain discoverable without JS. But **internal-link equity flows entirely through the
   footer**, where every link is equidistant from every page — the site currently has no editorial internal
   linking that signals which pages matter.
2. **Interior pages are thin on in-body links.** `/solutions/mcos` has **exactly 1** internal link inside
   `<main>`; `/about` has 3. This is the seam §3.3's internal-linking spine is designed to fix.

### 1.6 Search Console facts — OWNER-RELAYED, and one correction to the record

**We have no Search Console access.** Everything in this subsection is owner-relayed except where a Google
document is quoted, and the documents were fetched 2026-08-17.

- **Owner-relayed:** five `www` URLs appear under **"Alternate page with proper canonical tag"**, and the
  homepage is reported as having an indexing problem.
- **VERIFIED** (Google Search Console Help, Page indexing report,
  <https://support.google.com/webmasters/answer/7440203>, fetched 2026-08-17), verbatim: *"This page
  correctly points to the canonical page, which is indexed, **so there is nothing you need to do**."* The
  same document says of the whole table: *"These pages have not been indexed, but not necessarily because of
  an error"* and *"You should not expect all URLs on your site to be indexed, only the canonical pages."*

> ### THE RECORD, SO NOBODY PANICS LATER
> **The five `www` rows are not defects and require no work.** They are the documented signature of
> canonicalization **succeeding**: Googlebot fetched the www host, read the cross-host canonical, accepted
> it, clustered the pair, and selected the apex. **Do not remediate them. Do not treat their presence as the
> indexing problem.**
>
> **Correction to the brief's phrasing, recorded deliberately.** The task described this as *"the Validate
> Fix click will always fail by design."* The verified substance is slightly different and worth stating
> precisely: the status is **informational**, sits in the "Why pages aren't indexed" table rather than under
> Errors, and Google's own definition ends *"there is nothing you need to do"* — so there is **nothing to
> validate**, which is a stronger statement than "validation fails". Whether the UI renders a Validate Fix
> affordance for this row at all is **UNRESOLVED** — we have no Search Console access and did not verify the
> interface. **The operational instruction is identical either way: leave these rows alone.**

---

## 2. DIAGNOSIS — the homepage indexing issue

**This section was adversarially reviewed. Four candidate cause-claims were sent to independent skeptics
instructed to refute them. Two were refuted or corrected, and the correction changed the plan.** What follows
is the surviving position, not the intuitive one.

### 2.1 The honest headline

> **The cause of the reported homepage indexing issue is UNRESOLVED and cannot be ranked from the evidence in
> hand.**

That is the finding. Manufacturing a confident cause chain here would be the same class of error as
inventing a search volume.

**Why it cannot be ranked yet:**

- The reported symptom **has no status string attached**. "Indexing problem" could be *Discovered – currently
  not indexed*, *Crawled – currently not indexed*, *Duplicate without user-selected canonical*, or a
  Google-selected canonical differing from ours. **Each has a different cause and a different fix**, and the
  distinguishing datum lives in one URL Inspection result the owner can read in about a minute.
- Site age and backlink profile are **unmeasured**. We have no backlink tool and no Search Console API. A
  causal ranking whose premise is an unmeasured variable is an assumption wearing a finding's clothes.

### 2.2 The www hypothesis — REFUTED as the cause

The intuitive diagnosis — *both hosts serve 200, so crawl budget is split and signals are diluted* — **does
not survive**:

1. **The evidence offered as proof of failure is the documented signature of the mechanism working.** The
   "Alternate page" status means the canonical was honored and the apex was selected (§1.6).
2. **Consolidation is exactly what a honored canonical does.** Google documents cross-host canonicals as
   supported: *"A duplicate can be in a different domain than its canonical"*
   (<https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>, fetched
   2026-08-17). The current configuration is a documented, supported pattern.
3. **Crawl budget does not apply at this scale.** Google scopes crawl-budget management to large sites. This
   site has **13 URLs**.

**Confidence: HIGH that the missing 301 is not the cause of the homepage indexing issue.**

### 2.3 But the 301 is still worth shipping — for a different reason

The opposite over-correction (*"the canonical handles it, so a 301 adds nothing"*) was **also rated
OVERSTATED**. Google documents `rel=canonical` as **a hint, not a rule**, and reserves the right to select a
different canonical than the one declared. Two byte-identical hosts both returning 200 leave the host choice
to Google's discretion on **every URL, forever**.

**A host-level 301 removes the discretion permanently, and — unlike a per-route canonical emitted from
`seo.ts` — it cannot be silently lost by a future code change.** That is the real argument for it:
**durability and hygiene, not rescue.** Ship it; do not expect it to fix indexing.

**Confidence: HIGH.**

### 2.4 Candidate causes, with honest confidence

| # | Candidate | Confidence | Can we fix it in code? |
|---|---|---|---|
| 1 | **Discovery/authority weakness** — few or no inbound links, no entity presence, new domain | **UNMEASURED.** Plausible and common for a site this new, but both premises are unverified | **No.** Time, links, and entity presence. Not a code fix |
| 2 | **Google-selected canonical differs from ours** (e.g. Google picked the www URL) | **UNRESOLVED — testable in one URL Inspection** | Yes: the 301 (§3.1) settles it permanently |
| 3 | **Thin crawlable body + no editorial internal linking** — the homepage's authority flows only through a flat footer, interiors carry 1–3 in-body links | **MEDIUM, and independently worth fixing** | **Yes** — §3.3 internal-linking spine |
| 4 | **Positioning drift confusing entity understanding** — the entity description contradicts the page copy site-wide | **LOW as an indexing cause; HIGH as a correctness defect** | **Yes** — §3.2 |
| 5 | Technical blocking (robots, noindex, JS-only content, cloaking) | **RULED OUT — VERIFIED** (§1.2, §1.5) | n/a — already correct |

### 2.5 Where each lever actually lives

**Fixable by us, in code (P4):** the www→apex 301; the metadata and JSON-LD rewrite; per-page schema types;
the internal-linking spine; the provider resource center.

**Search-Console-side, owner-relayed only:** reading the actual indexing status string on the homepage;
URL Inspection (comparing *Google-selected canonical* against *User-declared canonical*); submitting the
sitemap; requesting indexing. **We cannot do any of these and must not claim to.**

**Only time and links fix:** domain age, inbound links, entity presence in the knowledge graph. **No amount
of on-page work substitutes.** This is the honest ceiling on what P4 can deliver, and it is why §3.3's
content engine matters more than any technical fix in this document.

### 2.6 The one action that would collapse the uncertainty

**Owner, five minutes, before P4 starts:** open Search Console → URL Inspection → `https://nexoaccess.com/`.
Report back three fields verbatim: **(1)** the coverage status string, **(2)** *Google-selected canonical*,
**(3)** *User-declared canonical*. **That single reading converts §2.1 from UNRESOLVED to diagnosed**, and it
determines whether candidate 2 is live. It is recorded as a blocking input in `SITE_PROGRESS.json`.

### 2.7 ADDENDUM 2026-08-17 — OWNER READING (P1-C1): THE GATE IS CLOSED

**ADDENDUM 2026-08-17 — OWNER READING (P1-C1): the homepage IS indexed and canonical selection is confirmed
(Google-selected = declared apex). The historical "homepage indexing issue" is CLOSED as resolved-or-misread;
the Alternate-page rows were canonicalization succeeding. The www→apex 301 (W8) remains durability work, not
rescue. Sitemap "temporary processing error" logged for a later Sitemaps-report glance; not blocking.**

**The readings, verbatim (OWNER-RELAYED, Search Console URL Inspection, 2026-08-17):**

| Field | `https://nexoaccess.com/` | `https://nexoaccess.com/platform` |
|---|---|---|
| Verdict | **"URL is on Google"** | **"URL is on Google"** |
| Indexed | **Yes** | **Yes** |
| Last crawl | **Aug 9, 2026, 11:14 PM** (Googlebot smartphone) | **Aug 5, 2026, 6:44 PM** |
| Crawl allowed | Yes | — |
| Fetch | Successful | — |
| Indexing allowed | Yes | — |
| User-declared canonical | `https://nexoaccess.com/` | — |
| **Google-selected canonical** | **Inspected URL — Google agrees with the apex** | **Inspected URL** |
| Referring pages | — | **include the www variant, consistent with correct alternate handling** |

**Minor observations, recorded and not acted on:** the homepage inspection showed Sitemaps **"Temporary
processing error"**; `/platform` showed **"No referring sitemaps detected"**. Neither blocks anything — both
pages are indexed. Logged for a glance at the Sitemaps report on the owner's next visit.

**What this resolves, and what it does not.**

- **§2.1's UNRESOLVED verdict is now closed.** There was no diagnosable defect to find, which is why the
  evidence refused to support a cause chain. **§2.2's refutation is confirmed by the outcome:** the www rows
  were canonicalization succeeding, exactly as Google's documentation said. Google selected the apex on both
  inspected URLs.
- **§2.3 stands unchanged.** The 301 was never justified as a rescue, and it is not weakened by good news —
  `rel=canonical` remains a hint Google may override, and a 301 removes that discretion permanently. **W8
  ships it as durability work.**
- **Candidate 3 (thin in-body linking) and candidate 4 (positioning drift) are untouched by this reading.**
  Both remain real and independently worth fixing; neither was ever an indexing claim. **`/platform` showing
  "No referring sitemaps detected" is a mild corroboration of the flat-footer linking observation in §1.5.**
- **Two inspected URLs are not thirteen.** This reading covers `/` and `/platform`. The indexing state of
  the other eleven routes remains **unread**.

---

## 3. THE FIX PLAN — specifications, not code

Implementation is **P4**. Each spec states its seam, its cost, and how it gets verified.

### 3.1 www → apex 301

**Three real options, with costs. Recommendation follows.**

**Option A — `next.config.mjs` `redirects()` (RECOMMENDED).**

```js
async redirects() {
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.nexoaccess.com" }],
      destination: "https://nexoaccess.com/:path*",
      statusCode: 301,
    },
  ];
}
```

- Executes inside the standalone Node server (`Dockerfile` CMD `node server.js`), so it works in production
  and travels with the image.
- **Use `statusCode: 301`, not `permanent: true`.** Next emits **308** for `permanent: true`. Google treats
  308 and 301 equivalently, but 301 is the universally understood signal and matches how this fix is recorded
  everywhere else in our docs. Stating this explicitly because it is exactly the detail that silently drifts.
- **Cost, and it is real:** `next.config.mjs` is `.mjs` and cannot import the TypeScript `SITE` constant, so
  the two host strings become **the first hardcoded host literals outside `src/lib/site.ts:15`**. Mitigation:
  a short shared `.mjs`/JSON host module that both `site.ts` and the config read, or an explicit comment at
  both sites pointing at each other. **Do not leave the duplication undocumented.**
- Preserves path and query via `:path*`.

**Option B — `src/middleware.ts`.** Can import `SITE` (no duplication) and could normalise other hosts (bare
IP, preview hostnames). **Cost:** the repo has zero middleware today; adding one introduces a middleware
manifest and a per-request hop across all 13 static routes. **Rejected as disproportionate** for a one-rule
redirect.

**Option C — host-level at Coolify/Traefik.** Zero repo change and **explicitly pre-authorised by
`DEPLOY-NOTES.md:35`** ("or a host-level 301 `www` → apex; either is fine"). The proxy already performs the
protocol redirect (§1.1), so it is the natural home. **Cost:** invisible to the repo, unverifiable by the QA
cube, and **lost if the host is rebuilt** — which, for a solo operator on a 2–3 year horizon, is the decisive
objection.

**Recommendation: Option A**, because it is version-controlled, code-reviewed, travels with the container
image, and is testable by the harness. Accept the documented host-literal duplication as the price.

**Verification (new harness invariant, proposed I19).** No existing invariant covers redirects: the sweep
hits `http://localhost:3300` by port only, so a host rule cannot be exercised by a normal page load. I19 must
issue a **raw request with an explicit `Host:`/`X-Forwarded-Host` header** and assert **301, `Location` =
apex, path preserved, query preserved**. Plus a live post-deploy check:
`curl -sSI https://www.nexoaccess.com/platform` → `301` → `https://nexoaccess.com/platform`.

**Adjacent fact worth recording:** with no `trailingSlash` key set, Next's default already 301s `/path/` →
`/path`. **Trailing-slash normalisation exists; host normalisation does not.**

### 3.2 Metadata and JSON-LD rewrite to D1/D15 positioning

**The blast radius, mapped exactly** (this is why the rewrite is a spec and not a find-and-replace):

| Seam | File | Effect |
|---|---|---|
| Home title/description constants | `src/lib/seo.ts:12-14` | Reach the homepage **through the layout**, not through `pageMeta` |
| Homepage OG/Twitter | `src/app/layout.tsx:47-61` | **Re-use the constants directly.** Editing `ROUTE_META.home` alone would NOT cover them |
| 12 interior descriptions | `src/lib/seo.ts:38-109` | Propagate automatically to `pageMeta` consumers, OG and Twitter |
| Interior title pattern | `src/lib/seo.ts:24` `interiorTitle()` | Any org renaming multiplies across all 12 at once |
| **`HERO_LEDE`** | `src/lib/seo.ts:21` | **Load-bearing.** Both the JSON-LD `description` (`schema.ts:23`) **and** visible homepage hero copy (`Hero.tsx:37`) |
| JSON-LD structure | `src/lib/schema.ts:10-30` | One function, one emitter |

> **`HERO_LEDE` is a COPY GATE event, not a metadata edit.** It is rendered to humans and to machines from
> one string. Rewriting it must preserve the `${SERVICE_AREA_PROSE}` interpolation so the `LIVE_OPERATIONS`
> flag keeps governing "built for" → "serving" on **both** surfaces simultaneously. **Do not inline the
> prose to make the sentence read better.**

**An asymmetry to close while we are in here.** The homepage does **not** use `pageMeta` — `src/app/page.tsx`
exports no metadata and inherits the layout entirely; `ROUTE_META.home` is consumed **only** by the sitemap.
**Recommendation: refactor the layout to `pageMeta(ROUTE_META.home)`** so home stops being a special case
and there is one metadata path. This is the kind of fork that silently rots.

**Copy specs.** Titles keep the searcher's vocabulary (§6.8/§7.3 query-lexicon law: "NEMT" is what people
type); **descriptions carry the accurate model**. Naming the service category is not the banned claim — the
banned claim is describing *the company* as the operator.

- `HERO_LEDE` → `Nexo Access is a medical transportation management organization ${SERVICE_AREA_PROSE}.`
- `HOME_DESCRIPTION` → the phrase **"technology-first NEMT company" must go**; the replacement states the
  network model, e.g. *"…Nexo Access manages every trip through a credentialed network of transport
  providers."* Keep ≤ 160 characters.
- `HOME_TITLE` may stand as-is (63 chars, names the category, does not self-describe as operator). **Flagged
  rather than changed** — a P4 judgment call.
- `OG_IMAGE.alt` → must stop naming the company **as** the transportation.
- **Title-pattern consistency** (home brand-first vs interior brand-second) is a P4 decision; recorded here
  so it is decided rather than inherited.

**Schema specs.**

- **Reconsider `MedicalBusiness`.** It is a `LocalBusiness` subtype that ordinarily expects an address — and
  we deliberately omit one — and it connotes direct clinical care, which under D15 we do not provide.
  **`Organization` is the more accurate type for a management organization.** Flagged as a **P4 decision with
  a recommendation**, not changed unilaterally: `MedicalBusiness` may still be defensible for medical-service
  relevance, and the trade is real.
- **Add `WebSite`** (site name for sitelinks). **Add `BreadcrumbList`** on the provider center once it has
  depth. **Add `FAQPage`** to `/faq` and `/providers/faq` **only when the page genuinely renders those
  Q&As visibly** — schema must never assert what the page does not show.
- **Add `contactPoint`** using values already public and already rendered on `/contact`.
- **No `address`, no `aggregateRating`, no `founder`, no `foundingDate`.** These stay omitted permanently.
- **There is no per-page schema seam today.** Adding one is itself a P4 work item: the root layout takes no
  route params, so per-page schema needs either a per-page component or a layout-level mechanism.

> **STRUCTURED-DATA HONESTY GATE (new, proposed as law).** Every schema property must be **visible and true
> on the page that emits it**. The existing code already models this correctly — `description` is bound to
> `HERO_LEDE` so the schema sentence and the rendered sentence cannot drift, and `address` is omitted rather
> than invented. **Name that pattern as law and extend it to every property added.**

### 3.3 New-page SEO architecture — the provider resource center as the organic engine

**This is mandated by positioning law, not merely by SEO opportunity.** Ground truth §2 defines audience 2
as transport providers and states the site *"must teach them how to become a compliant provider in each
state."* The organic engine and the product obligation are the same work.

#### The competitive finding — and it is unusually strong

**VERIFIED 2026-08-17 by running the actual target queries:** for *"how to become a NEMT provider in Maryland
requirements"* and the Virginia equivalent, **not one of MTM, Modivcare, Verida, SafeRide, or Roundtrip
appeared in either result set.**

**Across all five incumbents, our entire three-jurisdiction geography is covered by exactly ONE page**
(`verida.com/washington-dc-providers/`). The reason is structural, not accidental: **brokers publish provider
pages only where they hold the contract, so their coverage maps their contracts, not demand.** MTM has 12
state provider pages and **zero** for DC, MD, or VA — despite being REPORTED as the current DC broker.
Modivcare's only state provider pages are Mississippi. SafeRide and Roundtrip have no state pages at all.

**The real competition is NEMT software vendors** (MediRoutes, Bambi/hibambi, Spedsta, RouteGenie, ZeitRide)
publishing 50-state guides as lead-gen. **They rank on topical volume and domain momentum, not on being
right.** Verified by fetching the two strongest Virginia rankers: **both omit the Virginia DMV NEMT carrier
certificate, form OA 151, the $350,000 insurance tier, and the $25,000 surety bond** — that is, all four
actual gates. Further weakness visible in the results: form scrapers holding top positions (one page labelled
*"2012 Form VA DMV OA151-I"*), two near-duplicate AI-generated URLs ranking simultaneously for the same cost
query, one vendor citing another vendor's blog as its source for rate data, and four incompatible unsourced
startup-cost ranges across four sites. A Maryland licensing-directory page **fabricates an issuing agency
that does not exist**.

**Our defensible edge is standing, not volume:** a company actually operating in DC/MD/VA can write
jurisdiction-specific truth that a national vendor writes generically and stale.

**Stated honestly, where we cannot win:** navigational `.gov` queries (dmv.virginia.gov, dmas.virginia.gov,
DHCF, MDH are the destination the searcher wants, and displacing them would be a bad-faith use of a
healthcare-adjacent site); broker-brand queries; national insurance-shopping queries where insurer-scale
domains sit. **The realistic best outcome on those is ranking beneath the agency as the page that explains
what to do with what the agency told you.** **And MTM is the one to watch:** it runs genuine recruitment SEO
with state-scoped URLs and purpose-written meta descriptions. **If MTM ever templatises across states, this
window narrows fast.**

#### Target query classes per page

Volume data is unavailable for every query below. Classification is by intent and by observed SERP
composition only.

| Planned page | Query classes it should serve |
|---|---|
| `/providers/requirements` | cross-state comparison; "NEMT insurance requirements {state}"; capacity-tier questions ("how much insurance for a wheelchair van") |
| `/providers/credentialing` | "what to have ready before the broker call"; document checklists; "how long does credentialing take" |
| `/providers/dc` | "DC Medicaid transportation provider requirements"; DFHV vehicle-for-hire licensing; **WMATC operating authority**; DC workers' comp thresholds |
| `/providers/maryland` | "how to become a NEMT provider in Maryland"; **"do I need PSC authority for NEMT in Maryland"**; per-county administration across 23 counties + Baltimore City |
| `/providers/virginia` | "how to become a NEMT provider in Virginia"; DMV carrier certificate + **form OA 151**; **"do you need a CDL for NEMT in Virginia"**; the $350,000 tier vs the circulating "$100,000 GL" figure |
| `/providers/faq` | the long-tail question forms; the honest "is this worth it" query |

**The strongest openings, in order** (each is a documented vacuum, not a guess):

1. **The insurance-contradiction page.** State sources say **$350,000** for 1–6 passengers (Code of Virginia
   § 46.2-2053); vendor and insurance pages circulate **"$100,000 GL / 25-50-25"** as the Virginia minimum.
   **Nobody has published a page placing both side by side and attributing each to the requirement it
   actually belongs to.** Highest trust value available, and currently unowned.
2. **The licence-class question.** VERIFIED: the CDL query's entire first page is consumer directories, a job
   listing, and operator homepages. **Zero pages attempt the answer.**
3. **Maryland PSC authority.** VERIFIED total vacuum: the PSC's own page never mentions medical
   transportation; the county pages that rank are rider-facing.
4. **The capacity-tier map** — which insurance band the vehicle you are about to buy actually falls into.
5. **A sourced cost floor** listing only citable costs, against four unsourced ranges.

#### Internal-linking spine

Today: **the header contributes 2 crawlable links; the footer carries everything; `/solutions/mcos` has 1
in-body internal link.** Every page is equidistant from every other, so nothing signals importance.

The spine to build in P4:

- `/solutions/providers` (the recruitment page) becomes the **hub**, linking down to every `/providers/*`
  page in body copy.
- Each state page links **laterally** to the other two states and **up** to `/providers/requirements`.
- `/providers/requirements` links **down** to each state page.
- **Editorial in-body links, not just footer links.** The footer stays as-is (it is the discovery safety net
  proven in §1.5).
- **Descriptive anchor text**, never "learn more".

#### Sitemap strategy

Keep the generated `Object.values(ROUTE_META)` pattern — new pages join `ROUTE_META` and appear
automatically, which is why the 13/13 match holds. **Keep omitting `lastModified` unless it becomes real**
(and under §3.4 it *will* become real for resource pages via the verification-date map, at which point
emitting it is honest and worthwhile). Re-tier `priority` once the provider center exists: hub pages above
legal pages.

#### D17 compliance notes

**D17 governs this entire section: requirements, never advice.** Business-formation, ownership, legal, and
financial guidance are banned — which, usefully, is exactly the content the ranking LLC-formation affiliates
and business-plan farms publish. **We beat them by being narrower and correct, not by matching them.**

- Every resource page carries an **informational-only disclaimer** and its **verification date**.
- **Nothing UNRESOLVED or merely REPORTED/OWNER-REPORTED is publishable.** The 58 open owner questions and
  the §5b OWNER-REPORTED items (OR-1/OR-2/OR-3) **gate these pages** — tracked as item `P1-B1`.
- The DC $1.5M figure stays **BLOCKED** per Task #6, notwithstanding that publishing it would be
  competitively useful.
- **Verification dates are trust signals for search, not merely compliance overhead.** Against a SERP holding
  a 2012 form revision and fabricated agency names, a visible "Source verified 2026-08-17" with a deep link
  to the issuing authority is a genuine ranking-relevant differentiator. **The honesty gate and the SEO
  strategy point the same direction here** — which is worth stating, because they will not always.

### 3.4 E-E-A-T posture

**VERIFIED (Google Search Central, "Creating helpful, reliable, people-first content", fetched 2026-08-17),
verbatim:** *"our systems give even more weight to content that aligns with strong E-E-A-T for topics that
could significantly impact the health, financial stability, or safety of people… We call these 'Your Money or
Your Life' topics."*

**Verdict: this is a clear-YMYL site** and must be built to the YMYL floor.

> **THE HEADLINE FINDING, AND IT IS COUNTER-INTUITIVE.** Google's rater guidance treats *"who is responsible
> for this website"* as a **floor** whose absence forces a LOW rating, while treating **absent** third-party
> reputation as explicitly **neutral**. So our constraint set — no team page, no founder name, no address, no
> certifications, no statistics — **removes almost nothing Google actually asks for, and the things it removes
> are the things Google penalises when faked.** The honest version of this site can reach the top of its
> achievable range. **Being unable to fake authority is not the handicap it feels like.**

**Signals we can ship honestly:**

| # | Signal | How it ships without violating a constraint |
|---|---|---|
| S1 | **Publisher identity on every page** | One footer line from existing constants: *"Published by FC Nexo LLC, dba Nexo Access."* No new facts |
| S2 | **Organizational authorship** | **Ship no bylines at all.** See the ruling below |
| S3 | **Entity/schema hardening** | `contactPoint` from already-public values; `sameAs` only for profiles we actually control |
| S4 | **Identity consistency (NAP minus the A)** | `src/lib/site.ts` is already the single source, guarded by harness **I16**. Extend off-site: add an IDENTITY RECORD block to `DEPLOY-NOTES.md` with the exact canonical strings every external surface must reproduce character-for-character. **The existing NAP rule stands unchanged** |
| S5 | **Primary-source citation with visible verification dates** | The largest available honest win. Agency name + deep link + "Source verified {date}" from a typed constant map. Pairs with §3.3's D17 notes |
| S6 | **Experience via operator provenance** | Strictly through `FOUNDER_REF` ("our founder"). Qualitative only — **"years of" is permitted; "eight years" is a number and stays banned** |
| S7 | **`/security` page** | **Does not exist yet** (verified). Build on the existing `LegalPage` component, from repo-verifiable facts only: TLS in transit; SES with send-only least-privilege IAM; no PHI collected by any marketing form and forms engineered to reject it; honeypot and timing defenses |
| S8 | **Contact/routing clarity** | Make routing explicit without stating an SLA (the "within X hours" ban stands) |
| S9 | **Structured-data honesty gate** | As specified in §3.2 |
| S10 | **Local/entity presence — WAIT, deliberately** | Ship nothing external today. Gate GBP creation on `LAUNCH.LIVE_OPERATIONS` flipping true, as a service-area business with address hidden. **Creating a profile for a company not yet running trips is the exact company theater our law forbids** |
| S11 | **Depth as the carrier** | Requirement → citation + verified date → operator's practical reading → what the platform does about it. **The one thing a competitor's thin page cannot copy** |

**MUST NOT — recorded because these are the top recommendations in nearly every E-E-A-T article, and every
one of them is forbidden here:**

- **No author bylines, "Reviewed by", "Medically reviewed by", credential strings, or headshots.** Forbidden
  twice over: site law bans fabricated authorship, and Google's rater guidance treats overstated expertise
  claims *"included just to impress website visitors"* as grounds for a LOW rating. Google's own wording is
  conditional — bylines *"where one might be expected"* — and **nobody expects a byline on a company service
  page**. Ship organizational authorship instead.
- **No team page, board of advisors, office photos, headshots, client logos, testimonials, or case studies.**
  All are company theater for a pre-launch one-founder entity. **There is no version of this that is a small
  stretch.**
- **No founder name, prior employer, LinkedIn, or bio; no `founder` property in schema.** `FOUNDER_REF` only.
- **No `foundingDate`, "Founded in 20XX", or "Since 20XX"** anywhere: copy, schema, footer, or OG.
- **No "certified", no "HIPAA compliant"** (only "Built for HIPAA compliance"), no statistics.

> **PROPOSED LAW — AUTHORSHIP IS ORGANIZATIONAL.** No page carries a personal byline, no "Reviewed by", no
> credential string, no headshot, and no author schema naming a person. The publisher is FC Nexo LLC.
> **Recommended for the `nexo-brand` skill in a later task** — flagged, not written, because this task
> changes no skill files.

---

## 4. MEASUREMENT PLAN

**We have no Search Console API access. Every reading below is owner-relayed.** This plan is written so the
owner can execute each check without interpretation, and so no result gets over-read.

### 4.1 Immediately, before P4 (blocking input)

**URL Inspection on `https://nexoaccess.com/`.** Report verbatim: **(1)** coverage status string,
**(2)** *Google-selected canonical*, **(3)** *User-declared canonical*. **This is the single reading that
converts §2.1 from UNRESOLVED to diagnosed.** Recorded as a gate in `SITE_PROGRESS.json`.

### 4.2 At P4 deploy (the day the redirect and metadata ship)

Machine-checkable by us, no Search Console needed:

- `curl -sSI https://www.nexoaccess.com/` → **301** → `https://nexoaccess.com/`
- `curl -sSI "https://www.nexoaccess.com/platform?x=1"` → **301**, **path and query preserved**
- Harness **I19** green in the cube.
- Zero occurrences of "technology-first NEMT company" in any served HTML (grep the built output).
- JSON-LD `description` matches the rendered hero sentence exactly (the §3.2 honesty gate, mechanically
  checkable).
- Rich Results test passes on the live URL.

Owner-relayed, same day: re-submit `sitemap.xml`; **Request Indexing on the homepage once**.

### 4.3 Then: +1 week, +1 month, +3 months

| Milestone | What to read | What "good" looks like |
|---|---|---|
| **+1 week** | Page indexing report | www rows begin migrating from "Alternate page with proper canonical tag" toward "Page with redirect" — **this is the expected, correct movement, not a regression**. Homepage status string changed or resolved |
| **+1 month** | URL Inspection on home; Page indexing | Google-selected canonical **is** the apex. Homepage indexed |
| **+3 months** | Performance report, provider pages | Any impressions at all on provider-requirement queries. **Impressions before positions; positions before traffic** |

**What "fixed" means for the homepage indexing issue, stated precisely:** URL Inspection reports the homepage
as **indexed**, with *Google-selected canonical* equal to `https://nexoaccess.com/`. **Nothing less counts,
and a change in the www rows alone does not count.**

**Re-verification cadence:** technical checks (§4.2) re-run **at every deploy** — this is the §10.6 recount
discipline extended to SEO. **Every regulatory citation on a resource page re-verified against its primary
source before publication and re-stamped on a scheduled cadence** (D17). Competitor SERP composition
re-observed **quarterly** — specifically watching whether MTM templatises its state provider pages, which is
the identified threat to the §3.3 window.

### 4.4 What we will not measure, and will not claim

- **No rankings are promised.** Not in this document, not in any report against it.
- **No traffic forecast**, no volume estimate, no keyword-difficulty score. We have no tool that produces
  them, and estimating them from intuition would be fabrication.
- **We cannot attribute causation** between our fixes and any indexing change. Google does not report why.
  Correlation with a dated change is the strongest available claim, and it must be stated as such.

---

## 5. NOT VERIFIED / OPEN

| # | Item | Status |
|---|---|---|
| 1 | The actual homepage indexing **status string** | **CLOSED 2026-08-17** — owner reading: "URL is on Google", indexed, Google-selected canonical = apex (§2.7) |
| 2 | Whether the five www rows expose a Validate Fix affordance | **UNRESOLVED** — UI not inspected. Substance is settled (§1.6): leave them alone |
| 3 | Site age, backlink profile, referring domains | **UNMEASURED** — no backlink tool. Now moot as an indexing explanation (§2.7), still unmeasured as a ranking factor |
| 4 | Whether any page is currently indexed | **PARTIALLY CLOSED** — `/` and `/platform` VERIFIED indexed 2026-08-17 (§2.7). The other **11 routes remain unread** |
| 5 | `MedicalBusiness` vs `Organization` | **P4 decision**, recommendation recorded (§3.2) |
| 6 | Title-pattern consistency (home vs interior) | **P4 decision**, flagged (§3.2) |
| 7 | All live-site evidence | Single-fetch, **2026-08-17**. Re-verify before acting on any specific value |
| 8 | Competitor SERP composition | Observed **2026-08-17**. Third-party sites change; MTM is the one to watch |
| 9 | Provider-page publication | **BLOCKED** by `P1-B1` (58 owner questions + OR-1/OR-2/OR-3) under D17 |
