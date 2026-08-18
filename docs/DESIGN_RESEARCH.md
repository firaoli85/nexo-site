# DESIGN RESEARCH — Part 1: the industry lane

**Task:** P1a industry lane (SITE_GROUND_TRUTH §6 P1a). **Date of research: 2026-08-17.** Branch `v2`.

## Purpose and standing

This is the competitor **information-architecture** teardown: what the established NEMT companies actually
**publish**, audience by audience, page by page. It exists to end guesswork about V2 scope. Per D10
(research-first sequencing) no page of ours is designed before this document exists; per P2 the synthesis
below becomes the frozen page inventory.

**This lane is about INFORMATION DEPTH, not visual design.** PRODUCT.md names legacy broker sites as a design
anti-reference while their information depth is the reference. Design observations appear only where they
change what a reader can find.

## Method and evidence rules

- **Public marketing pages only.** No authenticated areas, no scraping behind logins.
- Each subject's domain was **verified by search before fetching**; where a company had moved, merged or
  rebranded, the truth was followed and recorded in its identity line.
- **Every factual claim is labelled `VERIFIED`** (fetched or rendered and seen, with the URL) **or
  `REPORTED`** (secondhand: search summaries, trade press, third-party directories). A published marketing
  number is VERIFIED **as a published claim**, never as a verified fact about the world.
- **No competitor copy is reproduced beyond short attributed fragments.** Structure and categories are
  described in our own words. This is a legal and ethical constraint, not a style preference.
- Working screenshots were written to `scripts/qa/artifacts/research/` which is **gitignored** — this
  document's text is the receipt, and the URLs are re-fetchable.
- **The copy honesty gate (nexo-brand §7) governs what "copy their good" may ever mean for us.** Structure,
  categories and depth are freely adoptable. Their *claims* are not: any statistic, certification or capability
  we adopt must be independently true of Nexo Access and provable from our own platform, or it does not ship.
  Several subjects publish unsourced statistics; those are recorded as observations, never as models to imitate.

## Subjects

| # | Subject | Resolved domain | Status |
|---|---|---|---|
| 1 | MTM | `mtm-inc.net (canonical host www.mtm-inc.net)` | live-as-given |
| 2 | Modivcare | `www.modivcare.com` | live-as-given |
| 3 | Verida | `verida.com` | live-as-given |
| 4 | SafeRide | `www.saferidehealth.com (apex saferidehealth.com serves the same site)` | live-as-given |
| 5 | Roundtrip | `roundtriphealth.com` | live-as-given |

---

## Contents

1. [MTM](#1-mtm) · 2. [Modivcare](#2-modivcare) · 3. [Verida](#3-verida) · 4. [SafeRide](#4-saferide) ·
5. [Roundtrip](#5-roundtrip) · 6. [**SYNTHESIS**](#6-synthesis-feeds-p2) — [category matrix](#6a-the-category-matrix),
[provider findings](#6b-provider-resource-findings-input-for-p1b), [sign-in patterns](#6c-sign-in-patterns-input-for-the-d3-task),
[vocabulary](#6d-vocabulary-findings-mapped-against-d15), [page recommendation](#6e-page-count-recommendation--draft-for-p2-freeze-not-frozen)

> **Reading order:** sections 1-5 are a reference inventory (dense by design; ~300 page types and 326
> information categories enumerated). **Section 6 is the part that feeds P2** — start there.

---

## 1. MTM

### a. Identity line

- **Domain verification:** resolved to `mtm-inc.net (canonical host www.mtm-inc.net)` — status **live-as-given**. VERIFIED. The expected domain is correct and current — but the BRAND on it changed while the domain did not. I fetched https://www.mtm-inc.net/ and it serves a live marketing site whose logo, nav, and body copy all read 'MTM Health' (e.g. nav item 'About MTM Health', footer 'MTM Health Giving'). Yet the HTML <title> still reads 'Your One Stop NEMT Solution - MTM, Inc.', so the legacy 'MTM, Inc.' identity is still baked into their title tags. I also fetched https://www.mtm-inc.net/robots.txt (VERIFIED, declares Sitemap: https://www.mtm-inc.net/sitemap_index.xml), https://www.mtm-inc.net/sitemap_index.xml (VERIFIED, 9 child sitemaps), and https://www.mtm-inc.net/page-sitemap.xml (VERIFIED, ~170 live page URLs). There is no mtmhealth.com migration: the rebrand kept the old domain. The rename itself is corroborated on their own domain at https://www.mtm-inc.net/mtm-is-now-mtm-health-marking-30-years-of-transformative-growth/ (REPORTED — surfaced in search results, page not individually fetched) and by third-party newswire coverage dating the announcement to February 2025 (REPORTED). Related properties, all VERIFIED as linked from the mtm-inc.net footer: mtmtransit.com (MTM Transit — the transit-operations sibling brand, kept deliberately separate), wanda.care (Wanda — an SDOH services brand), mtm.work (member portal, separate host), mtm.mtmlink.net (client/agency portal, separate host), and veyo.com (affiliate brand used to recruit independent gig drivers). Not moved, not merged away, not squatted.
- **Self-description (short attributed fragment):** "one of the nation's largest and most experienced transportation brokers" (MTM Health, /healthcare/nemt/) — **VERIFIED** (https://www.mtm-inc.net/healthcare/nemt/ (broker noun, footprint stats); https://www.mtm-inc.net/about-mtm/ (management-company noun); https://www.mtm-inc.net/service-providers/ (four-population network model); https://www.mtm-inc.net/ (homepage H1 and audience triage))
- **The noun they use (vocabulary finding):** BROKER — and they say it plainly. The literal noun on the payer-facing NEMT page is "transportation brokers", and the FAQ on that same page reinforces it with the phrase "an experienced broker like MTM Health". This is the single most important vocabulary finding in this teardown: the legacy incumbent does NOT run from the word broker, it leads with it. Note the register split, though — on /about-mtm/ the noun shifts to "healthcare and transportation management company" and "transportation management company", with the word broker absent from that page entirely. So: broker when selling to payers, management company when telling the corporate story. A third register appears in the homepage H1, which is solution-language rather than role-language ("Your One Stop NEMT Solution"). All three VERIFIED.
- **Operating model as they state it:** They state that they MANAGE and CONTRACT a network — they do not claim to own or operate the vehicles that carry members. In their own framing they manage every aspect of the programs they operate and manage transportation benefits on behalf of Medicaid and Medicare programs, state and county governments, and MCOs (VERIFIED, /healthcare/nemt/). The supply side is explicitly four distinct populations, enumerated on /service-providers/ (VERIFIED): contracted commercial transportation companies with their own drivers and vehicles (described as the backbone of the network); Independent Driver Providers, i.e. gig drivers in personal vehicles, recruited through the affiliate brand Veyo/VeyoRide and handed off off-domain to veyo.com/drivers; unpaid community volunteer drivers reimbursed for mileage; and HCBS therapy providers (equine, music, art, pet). On top of that sits a proprietary software layer they name and brand as a product, MTM Link, spanning client, provider, facility, and member portals plus a member mobile app and a driver app (VERIFIED). So the honest read is: broker + contracted network + owned technology platform. Vehicle operation is deliberately fenced off into the separate sibling brand MTM Transit (mtmtransit.com), which is linked from the footer but is not part of this site's IA (VERIFIED). Worth noting for our own positioning: their model is asset-light on the health side by design, and the site never claims otherwise.
- **Footprint:** Published, but as marketing claims with no sourcing. On /healthcare/nemt/ (VERIFIED as published claims, NOT verified as true): rural and urban networks in "more than half of the United States"; more than 600 customer service agents located across 21 states; in excess of 13.5 million calls annually; customer satisfaction exceeding 95%; NEMT cost reduction of up to 25% for previously unmanaged programs; established 1995 with "nearly 30 years of experience". On /healthcare/social-determinants-of-health/ (VERIFIED as published claim): 35 million trips annually. On /healthcare/home-health-coordination/ (VERIFIED as published claim): more than 6,000 therapy referrals and more than 127,000 provider claims in 2023. A concrete member count is NOT published anywhere I fetched. The state footprint is discoverable structurally rather than stated — the sitemap exposes dedicated landing pages for roughly 15-16 jurisdictions (Washington DC, Texas, Connecticut, Idaho, Iowa, Minnesota, Northern Minnesota, Missouri, Nevada, Rhode Island, Wisconsin, Mississippi, Florida FFS, Oregon/Trillium, plus a Virginia training page and an Arizona will-call page), while the mileage-reimbursement trip logs imply active programs in a wider set including Arizona, Illinois, Michigan, New Hampshire, New Jersey, North Carolina, Ohio and Hawaii (VERIFIED from published PDF filenames). Notably, the 'Locations' nav item does NOT resolve to a states list — see verdicts. No org chart, no headcount, no revenue, no client roster, and no list of which state contracts they actually hold.

### b. Nav map

| Top-level label | Dropdown children | |
|---|---|---|
| `Services` | `Non-Emergency Medical Transportation (NEMT) → /healthcare/nemt/`, `Mobile Integrated Health → /healthcare/mih/`, `Home and Community Based Service (HCBS) Therapies → /healthcare/home-health-coordination/`, `Social Determinants of Health (SDOH) → /healthcare/social-determinants-of-health/`, `Case Studies → /case-studies/` | VERIFIED |
| `Discover` | `--- Manage Your Trips (column heading) ---`, `Member Login → https://mtm.mtmlink.net/#/`, `Member Portal → https://mtm.work/`, `Healthcare Providers → /healthcare-providers/ (means medical facilities, NOT transportation providers)`, `Transportation Providers → /service-providers/`, `Mileage Reimbursement → /mileage-reimbursement/`, `MTM Link User Guides → /mtm-link/`, `--- About Us (column heading) ---`, `About MTM Health → /about-mtm/`, `Locations → /locations/ (observed 301-redirecting to https://mtm.work/)`, `MTM Health Giving → /giving/`, `Preventing Fraud → /case-studies/fraud-prevention/`, `Contact → /contact/`, `--- News (column heading) ---`, `News → /news/`, `Member Stories → /member-stories/`, `Tradeshows → /tradeshows/`, `Newsletter → /more-information/ (destination is the 'Healthcare More Information Form' lead form, not a newsletter)`, `--- Join Our Team (column heading) ---`, `Careers → /careers/`, `Current Openings → https://app.largely.com/v/HP4X-NthRyfQOQyjpfo1F (external ATS)`, `Join Our Network → /service-providers/` | VERIFIED |
| `Sign In` | `(no dropdown — single direct link to https://mtm.mtmlink.net/)` | VERIFIED |
| `Mobile Integrated Health (MIH)` | `NOTE: this is not a top-level item. Recording it here only to flag a label discrepancy — one homepage read returned this Services child as 'Mobile Integrated Health (MIH)' and a second, more literal read returned 'Mobile Integrated Health'. The href is /healthcare/mih/ in both. Treat the parenthetical acronym suffixes in the Services dropdown as lower-confidence.` | REPORTED |

### c. Page inventory (73 distinct public page types enumerated)

**PAYER** (18)

| Page type | URL | |
|---|---|---|
| NEMT service page — the primary payer/MCO document; role statement, network claim, driver standards, tech, FWA, FAQ | `https://www.mtm-inc.net/healthcare/nemt/` | VERIFIED |
| Healthcare section index (parent of the four service lines) | `https://www.mtm-inc.net/healthcare/` | VERIFIED |
| Mobile Integrated Health (MIH) service page | `https://www.mtm-inc.net/healthcare/mih/` | VERIFIED |
| HCBS Therapies service page — equine/pet/art/music/aquatic; publishes 2023 referral and claim volumes | `https://www.mtm-inc.net/healthcare/home-health-coordination/` | VERIFIED |
| Social Determinants of Health service page — non-medical destinations, grocery, pharmacy, employment, Wanda platform | `https://www.mtm-inc.net/healthcare/social-determinants-of-health/` | VERIFIED |
| Preventative Care service page | `https://www.mtm-inc.net/healthcare/preventative-care/` | VERIFIED |
| Case Studies index — six studies, ungated, no form wall | `https://www.mtm-inc.net/case-studies/` | VERIFIED |
| Case study: Revolutionizing NEMT Fraud Prevention — also serves as the nav/footer 'Preventing Fraud' trust page | `https://www.mtm-inc.net/case-studies/fraud-prevention/` | VERIFIED |
| Case study: Managed Long Term Care (MLTC) members in New York | `https://www.mtm-inc.net/case-studies/mltc-ny-case-study/` | VERIFIED |
| Case study: Community Driven volunteer transportation — the only one with a hard savings number | `https://www.mtm-inc.net/case-studies/volunteer-case-study/` | VERIFIED |
| Case study: Martin County, Florida | `https://www.mtm-inc.net/case-studies/martin-county-fl-case-study/` | VERIFIED |
| Case study: Member Wallet — public transit fare distribution | `https://www.mtm-inc.net/case-studies/member-wallet-case-study/` | VERIFIED |
| Case study: Removing Barriers to Routine Screenings | `https://www.mtm-inc.net/case-studies/removing-barriers-to-routine-screenings/` | VERIFIED |
| Healthcare More Information Form — the ONLY payer lead-capture route; also the destination of the nav item labelled 'Newsletter' | `https://www.mtm-inc.net/more-information/` | VERIFIED |
| NEMT technology page (sitemap only, not in nav) | `https://www.mtm-inc.net/nemt-tech/` | VERIFIED |
| Power BI reporting page (sitemap only, not in nav) | `https://www.mtm-inc.net/power-bi-reporting/` | VERIFIED |
| Sales/contact conversion pages: Let's Talk and Let's Talk pop-up | `https://www.mtm-inc.net/lets-talk/` | VERIFIED |
| CLIENT-SPECIFIC — HCSC page | `https://www.mtm-inc.net/hcsc/` | VERIFIED |

**PROVIDER** (10)

| Page type | URL | |
|---|---|---|
| Service Providers hub — segments the supply side into four populations, each with its own CTA and destination | `https://www.mtm-inc.net/service-providers/` | VERIFIED |
| Provider onboarding / application — 'Drivers Wanted'; publishes the six-stage funnel and hosts the embedded Formstack application | `https://www.mtm-inc.net/driverswanted/` | VERIFIED |
| Community volunteer driver recruitment | `https://www.mtm-inc.net/community-driven/` | VERIFIED |
| HCBS provider network application | `https://www.mtm-inc.net/healthcare/home-health-coordination/home-healthcare-provider-network-application/` | VERIFIED |
| Transportation Provider Training & Resources hub — open, ungated; accident/incident forms plus eight topical training pages | `https://www.mtm-inc.net/training/` | VERIFIED |
| Training sub-pages (8): transporting dialysis patients, transporting cancer patients, fuel saving tips, tire replacement, summer pedestrian safety, safe winter driving, slippery conditions, ergonomics | `https://www.mtm-inc.net/training/transporting-dialysis-patients/ (and 7 siblings)` | VERIFIED |
| Virtual vehicle inspections | `https://www.mtm-inc.net/inspections/` | VERIFIED |
| SambaSafety driver-monitoring page (sitemap only) | `https://www.mtm-inc.net/samba-safety/` | VERIFIED |
| Virginia training page (sitemap only — the only Virginia surface on the site) | `https://www.mtm-inc.net/virginia-training/` | VERIFIED |
| Texas Transportation Providers — credentialing/insurance/rates/no-show/dispatch FAQ plus two provider PDFs | `https://www.mtm-inc.net/texas/transportation-providers/` | VERIFIED |

**MEMBER** (10)

| Page type | URL | |
|---|---|---|
| MTM Link User Guides — member portal and mobile app guides, split Migrated vs Non-Migrated plans, plus a trifold; also carries the Navigator Line phone | `https://www.mtm-inc.net/mtm-link/` | VERIFIED |
| Duplicate MTM Link pages (decay): /mtm-link-2/ and /mtm-link-a2c-intro/ | `https://www.mtm-inc.net/mtm-link-2/` | VERIFIED |
| Gas Mileage Reimbursement — 'MTM Currency' debit-card program; ~35 per-state/per-plan trip log PDFs, most with Spanish twins; app, mail, email and fax submission paths with deadlines | `https://www.mtm-inc.net/mileage-reimbursement/` | VERIFIED |
| Member Stories | `https://www.mtm-inc.net/member-stories/` | VERIFIED |
| Member entry vanity URLs, overlapping: /needaride/ (a redirect shim to an Electronic Trip Form), /need-a-ride/, /medicaltrip/ | `https://www.mtm-inc.net/needaride/` | VERIFIED |
| Member benefit/marketplace pages: /marketplace/, /more-info-mp/, /uber-voucher/, /lyft-flex/, /az-willcall/ | `https://www.mtm-inc.net/marketplace/` | VERIFIED |
| Member survey pages: /member-exp-survey-opt-in/ and /iva-survey/ | `https://www.mtm-inc.net/member-exp-survey-opt-in/` | VERIFIED |
| COVID vaccine transport (legacy campaign page) | `https://www.mtm-inc.net/covid-vaccine-transport/` | VERIFIED |
| DC Recipient Responsibilities sub-page | `https://www.mtm-inc.net/washington-dc/dc-recipient-responsibilities/` | VERIFIED |
| Texas Members — eligibility by plan, booking script, ride-day timing rules, escort rules, level-of-service, grievance path, FAQ phrased as user questions, downloads | `https://www.mtm-inc.net/texas/members/` | VERIFIED |

**FACILITY** (4)

| Page type | URL | |
|---|---|---|
| Healthcare Providers hub — this is the MEDICAL FACILITY page despite the label; standard + state-specific forms library, portal registration request, Community Outreach reps | `https://www.mtm-inc.net/healthcare-providers/` | VERIFIED |
| Facility trip verification utility | `https://www.mtm-inc.net/facility-trip-verification/` | VERIFIED |
| Webinars index plus ~17 individual webinar pages (assessments, quality assurance, care coordination, travel training, paratransit eligibility, seasonal series, fleet maintenance) | `https://www.mtm-inc.net/webinars/` | VERIFIED |
| Texas Medical Facilities | `https://www.mtm-inc.net/texas/medical-facilities/` | VERIFIED |

**COMPANY-GENERAL** (31)

| Page type | URL | |
|---|---|---|
| Homepage — headline is solution-language, plus a 'Customize your experience' audience-triage band with four tiles (Members/Riders, Service Providers, Medical Facilities, Clients) | `https://www.mtm-inc.net/` | VERIFIED |
| STATE TEMPLATE — Washington DC hub. Richest state page on the site: 'Quick Downloads and Important Links' plus three audience blocks (Recipients / Medical Facilities / Transportation Providers), four phone numbers including a complaint line and the state Ombudsman, a named state program manager's direct line, hours, and ~14 downloadable PDFs/DOCs | `https://www.mtm-inc.net/washington-dc/` | VERIFIED |
| STATE TEMPLATE — Texas hub, with three audience sub-pages; publishes 15 distinct per-health-plan toll-free numbers and 24/7/365 scheduling hours | `https://www.mtm-inc.net/texas/` | VERIFIED |
| STATE — Connecticut hub + /connecticut/members/, /connecticut/providers/, /connecticut/facilities/ | `https://www.mtm-inc.net/connecticut/` | VERIFIED |
| STATE — Idaho hub + /idaho/members/, /idaho/transportation-providers/, /idaho/medical-facilities/, /idaho/idaho-glossary/ | `https://www.mtm-inc.net/idaho/` | VERIFIED |
| STATE — Iowa hub + /iowa/members/, /iowa/transportation-providers/, /iowa/medical-facilities/ | `https://www.mtm-inc.net/iowa/` | VERIFIED |
| STATE — Minnesota hub + /minnesota/recipients/ (with /glossary/ and /responsibilities-conduct/ sub-pages), /minnesota/transportation-providers/, /minnesota/medical-facilities/ | `https://www.mtm-inc.net/minnesota/` | VERIFIED |
| SUB-REGION — Northern Minnesota hub + /clients/, /transportation-providers/, /medical-facilities/ (proves they will shard below state level when a contract demands it) | `https://www.mtm-inc.net/northern-minnesota/` | VERIFIED |
| STATE — Missouri hub + /missouri/participants/, /missouri/transportation-providers/, /missouri/medical-facilities/ (note: members are called 'participants' here) | `https://www.mtm-inc.net/missouri/` | VERIFIED |
| STATE — Nevada hub + /nevada/members/, /nevada/transportation-providers/, /nevada/medical-facilities/ | `https://www.mtm-inc.net/nevada/` | VERIFIED |
| STATE — Rhode Island hub + /rhode-island/recipients/, /rhode-island/transportation-providers/, /rhode-island/medicalfacilities/ (inconsistent slug) | `https://www.mtm-inc.net/rhode-island/` | VERIFIED |
| STATE — Wisconsin hub + /wisconsin/members/, /wisconsin/providers/, /wisconsin/facilities/, plus an orphan duplicate /wisconsin-2/ | `https://www.mtm-inc.net/wisconsin/` | VERIFIED |
| STATE — Mississippi hub + /mississippi/liquidated-damage-history/ (a contract-performance disclosure page, unique on the site) | `https://www.mtm-inc.net/mississippi/` | VERIFIED |
| STATE — Florida FFS | `https://www.mtm-inc.net/floridaffs/` | VERIFIED |
| PLAN-SPECIFIC — Oregon/Trillium hub + /members/, /transportation-providers/, /medical-facilities/ (shows they will build a full audience matrix for a single payer client) | `https://www.mtm-inc.net/oregon-trillium/` | VERIFIED |
| About MTM Health — vision, mission, core values, sustainability, awards taxonomy; no founding year, no footprint numbers | `https://www.mtm-inc.net/about-mtm/` | VERIFIED |
| CEO profile page | `https://www.mtm-inc.net/alaina-macia/` | VERIFIED |
| Locations — linked as 'Locations' from nav AND footer, but observed returning 301 to https://mtm.work/ (a zip-code plan finder, not a locations list) | `https://www.mtm-inc.net/locations/` | VERIFIED |
| MTM Health Giving — corporate citizenship | `https://www.mtm-inc.net/giving/` | VERIFIED |
| Contact — five audience-routed Formstack forms, HQ address/phone/fax, and four compliance-notice headings (HIPAA, Members' Rights, Non-Discrimination, Language Assistance) | `https://www.mtm-inc.net/contact/` | VERIFIED |
| Contact thank-you pages — eight distinct ones, one per form path (general, community driver, internship, HCBS letter of intent, marketplace, transportation provider application, VVI, plus healthcare/transit variants) | `https://www.mtm-inc.net/contact/thank-you/` | VERIFIED |
| News / newsroom index (plus an unenumerated post-sitemap.xml archive) | `https://www.mtm-inc.net/news/` | VERIFIED |
| Tradeshows / events | `https://www.mtm-inc.net/tradeshows/` | VERIFIED |
| Careers (listings handed off to external ATS app.largely.com) | `https://www.mtm-inc.net/careers/` | VERIFIED |
| Privacy Policy | `https://www.mtm-inc.net/privacy-policy/` | VERIFIED |
| Terms of Use | `https://www.mtm-inc.net/terms-of-use/` | VERIFIED |
| Your Privacy Choices / privacy settings (consent manager) | `https://www.mtm-inc.net/privacy-settings/` | VERIFIED |
| CA Collection Notice and Cookie Policy — served as loose .html files from /wp-content/uploads/, not as real routes | `https://www.mtm-inc.net/wp-content/uploads/2018/12/CookiePolicyJune2023.html` | VERIFIED |
| Brand asset library, publicly indexed: /branding/ plus /colors/, /typefaces/, /mtm-logo/, /veyoride-branding/, /yellowcab-aaa-branding/, /mtm-holiday/ | `https://www.mtm-inc.net/branding/` | VERIFIED |
| Internal/test debris published in the sitemap: /testing/, /testing2/, and an obfuscated-slug section (long random string) containing operator employee pages and independent-driver pages in English and Spanish | `https://www.mtm-inc.net/testing/` | VERIFIED |
| Rebrand announcement + 30-facts anniversary pages (surfaced via search on their own domain; not individually fetched) | `https://www.mtm-inc.net/mtm-is-now-mtm-health-marking-30-years-of-transformative-growth/` | REPORTED |


### d. Information categories by audience

**PAYER**

- /healthcare/nemt/ is the single load-bearing payer document — role statement, network claim, driver-standards list, technology description, FWA approach, and an FAQ, all on one long page rather than split across a section (VERIFIED)
- Role is stated in procurement-legible language: they name themselves a transportation broker and answer the question "Why do health plans and state agencies outsource NEMT?" directly in an FAQ (VERIFIED)
- Driver credentialing is enumerated as a concrete list rather than gestured at: ADA education, CPR certification, HIPAA training, sensitivity training, medical-needs training, drug testing, and multi-level background checks (VERIFIED)
- Compliance posture is asserted by reference to recognized bodies: operations claimed to exceed NCQA standards, and a URAC accreditation directory link is carried in the site footer pointing at accreditnet.urac.org (VERIFIED that both appear; the URAC record itself was not opened)
- Network claim is geographic and vague rather than numeric: rural and urban networks in more than half of the United States, with no state-by-state contract roster anywhere on the site (VERIFIED)
- Outcome statistics are published but entirely unsourced — 95% satisfaction, 13.5M calls annually, 35M trips annually, up to 25% cost reduction, 600+ agents across 21 states. No methodology, date, or auditor given for any of them (VERIFIED as published claims; NOT verified as true)
- Technology is sold as proprietary IP with a product name: MTM Link, described with cloud-based dispatching, GPS tracking, a call-mining platform, IVA systems, predictive analytics and fraud detection (VERIFIED)
- Fraud/waste/abuse gets its own destination — /case-studies/fraud-prevention/ doubles as both a case study and the 'Preventing Fraud' trust page linked from nav and footer (VERIFIED as a dual-purpose URL; page itself not fetched)
- Case studies are ungated — six of them, no form wall, listed at /case-studies/ (VERIFIED). But the proof is thin: only one carries a hard number, an average cost saving of $65.99 per one-way trip on the volunteer program (VERIFIED)
- Adjacent service lines are presented as a portfolio a payer can buy alongside NEMT: Mobile Integrated Health, HCBS Therapies, Social Determinants of Health, and Preventative Care (VERIFIED that all four exist as pages)
- Reporting/analytics surfaces exist as standalone URLs but are not in the nav — /power-bi-reporting/ and /nemt-tech/ are in the sitemap only (VERIFIED that the URLs exist; contents REPORTED/unfetched)
- There is NO procurement page, NO RFP page, NO pricing, NO SLA table, NO implementation-timeline page, and NO named business-development contact. The entire payer conversion path is one lead form at /more-information/ labelled 'Healthcare More Information Form', plus a 'Contact Sales' anchor on the homepage (VERIFIED)
- There is no security/HIPAA posture page for payers — HIPAA appears as a driver-training bullet and as a disclosure heading on /contact/, not as an infrastructure or compliance page (VERIFIED)

**PROVIDER**

- /service-providers/ is the network-recruitment hub and it segments the supply side into FOUR named populations rather than one: Transportation Providers (companies with fleets), Independent Driver Providers (gig, personal vehicle), Community Volunteer Drivers (unpaid, mileage-reimbursed), and HCBS Providers (equine/music/art/pet therapy). Each gets its own CTA and its own destination (VERIFIED)
- Each population is routed somewhere different, which is the smartest structural move on the site: companies go to /driverswanted/, gig drivers are handed off-domain to veyo.com/drivers, volunteers to /community-driven/, therapy providers to a dedicated HCBS network application URL (VERIFIED)
- /driverswanted/ publishes the onboarding funnel as named, ordered stages — Provider Application, interview with a network representative, Contracting, Credentialing with document submission, Training, then first trip assignment (VERIFIED). This is the single most useful thing on their provider side: it tells an applicant how long the road is before they start.
- Requirements are NAMED but never QUANTIFIED. Credentialing, current licensure, background checks, certifications and insurance are all cited as required; there is no insurance dollar limit, no vehicle model-year floor, no document checklist, and no stated turnaround time (VERIFIED)
- Rates are explicitly withheld: negotiated with each provider individually. Insurance specifics are likewise deferred to the credentialing conversation (VERIFIED, /texas/transportation-providers/)
- A state-level provider FAQ answers the six questions providers actually ask — how to join, whether driver/MVR/CPR/defensive-driving/passenger-assistance standards exist, how trip assignments arrive, what happens on a no-show or door cancel, what the rates are, and what insurance is needed (VERIFIED, /texas/transportation-providers/)
- One hard operational rule IS published plainly: no-shows are not reimbursed (VERIFIED)
- Trip dispatch mechanism is stated: assignments are transmitted electronically via the MTM Link Provider Portal (VERIFIED)
- /training/ is open and ungated — no login. It carries accident and incident report forms as downloadable .doc/.docx (split Nevada vs all other locations) plus eight topical training pages: transporting dialysis patients, transporting patients with cancer, fuel saving, tire replacement, summer pedestrian safety, winter driving, slippery roads, ergonomics (VERIFIED)
- Provider tooling gets its own pages: /inspections/ for virtual vehicle inspections, /samba-safety/ (a driver-monitoring vendor, in sitemap only) (VERIFIED that URLs exist)
- Downloadable provider docs exist but are sparse at the national level — MTM Link Driver App Reference Guide and MTM Link Portal Helpful Tips for TPs (VERIFIED links)
- Provider depth is dramatically better at STATE level than nationally. The DC page publishes a full Transportation Provider Manual PDF, a Provider FAQ .docx, an Affidavit of Compliance PDF, and even the roster of contracted providers as a PDF — none of which has a national equivalent (VERIFIED links, /washington-dc/)
- In-network providers are given a named human channel: a dedicated Vendor Account Manager, and are told explicitly not to use the public contact form (VERIFIED, /contact/)

**MEMBER**

- Members are served almost entirely at the STATE level, not nationally. The national member surface is thin — /mtm-link/, /mileage-reimbursement/, /member-stories/ — while the substance lives on per-state member/recipient/participant pages (VERIFIED)
- Eligibility is expressed as a list of contracted health plan names, not as a rules test. A Texas member identifies themselves by finding their plan in the list (VERIFIED, /texas/members/)
- Booking has three published channels: phone (the number depends on your plan), the MTM Link Member mobile app, and the Member Portal at mtm.work (VERIFIED)
- The exact information a member must have ready when calling is enumerated — name, DOB, address, phone, Medicaid ID, appointment location and time, medical reason, service type, special needs, whether an attendant is needed (VERIFIED, /texas/members/). This is genuinely useful and rare.
- Ride-day expectations are published as concrete numbers, which is the strongest member content on the site: be ready at least 90 minutes before the appointment, expect to arrive 15 to 60 minutes early, call if the ride is more than 15 minutes late, a will-call return should arrive within an hour (VERIFIED, /texas/members/)
- Escort and companion rules are stated: under-18 members must ride with a parent or guardian; adults may request a companion (VERIFIED)
- Level of service is framed honestly as assigned, not chosen — sedan, wheelchair-equipped vehicle, gas mileage reimbursement, or public transit, based on documented need, with an explicit statement that the member cannot pick the vehicle type or guarantee a specific provider (VERIFIED)
- Grievance and appeal are routed AWAY from the broker and to the health plan's ID-card number (VERIFIED, /texas/members/). DC, by contrast, publishes a dedicated complaint line and the state Ombudsman number (VERIFIED, /washington-dc/) — so the complaint path is contract-shaped, not consistent.
- Mileage reimbursement is a fully built-out member product with its own brand name (MTM Currency, a reloadable debit card) and a documented flow: submit in-app via 'I'm Leaving'/'I'm Here' with location verification for payment in seven business days, or mail/email/fax a paper log within 60 days of the oldest trip (VERIFIED, /mileage-reimbursement/)
- Trip logs are keyed per state AND per health plan — roughly 35 PDFs — with Spanish twins for most (VERIFIED)
- Spanish parity exists on DOWNLOADS but not on page bodies. I found no Spanish-language page routes in the sitemap; the bilingual effort is entirely in the PDFs (VERIFIED from filenames; absence of /es/ routes VERIFIED from page-sitemap.xml)
- Member-education support pages exist per state: recipient responsibilities and conduct pages (DC, Minnesota) and glossary pages (Idaho, Minnesota) (VERIFIED that URLs exist)
- Standalone member-entry vanity URLs exist and overlap: /needaride/, /need-a-ride/, /medicaltrip/, /marketplace/, /uber-voucher/, /lyft-flex/, /az-willcall/ (VERIFIED URLs; /needaride/ fetched and found to be a redirect shim to an Electronic Trip Form)
- App-support has its own phone line, the Navigator Line at 888-597-1189 (VERIFIED, /mtm-link/)

**FACILITY**

- /healthcare-providers/ is the facility hub — note the label mismatch, 'Healthcare Providers' here means clinics and facilities, NOT transportation providers, which are called 'Service Providers'. That is a real vocabulary trap in their IA (VERIFIED)
- The facility offer is framed around four things: booking trips online, dedicated per-state Community Outreach representatives, training/webinars on trip intake and self-service scheduling, and around-the-clock scheduling support including weather and holiday communication (VERIFIED)
- Facility portal access is gated behind a manual registration REQUEST form on Formstack — there is no self-serve facility signup (VERIFIED)
- A genuine forms library is the centerpiece, split into 'Standard Forms' and 'State-Specific Forms'. Standard: Level of Need, Medical Necessity (attendant), Parental Consent, Distance Verification, Holiday Schedule, Inclement Weather. State-specific: Illinois Certificate of Transportation Services and Physician Certification Statement as PDFs, plus per-state form sets for CT, ID, IA, MN, MO, NV, RI, TX (VERIFIED)
- Facilities get a named human channel and a role email rather than a generic form: state-assigned Community Outreach reps and CO@mtm-inc.net (VERIFIED)
- Facility training is delivered as webinars, and the webinar archive is large — the sitemap exposes roughly 17 webinar pages including assessments, quality assurance, care coordination, travel training, paratransit eligibility and seasonal series (VERIFIED that URLs exist)
- /facility-trip-verification/ exists as a standalone facility utility page (VERIFIED that the URL exists; contents REPORTED)
- State-level facility depth again exceeds national: DC publishes a Medical Facility Resource Guide in EN and ES plus an MTM Link Facility Portal brochure in EN and ES (VERIFIED links)
- Per-state facility sub-pages are a standard slot in their state template — /texas/medical-facilities/, /minnesota/medical-facilities/, /connecticut/facilities/, /wisconsin/facilities/, /iowa/medical-facilities/, /nevada/medical-facilities/, /missouri/medical-facilities/, /idaho/medical-facilities/, /rhode-island/medicalfacilities/, /northern-minnesota/medical-facilities/, /oregon-trillium/medical-facilities/ (VERIFIED). Note the inconsistent slugs — 'medical-facilities' vs 'facilities' vs 'medicalfacilities'.

**COMPANY**

- /about-mtm/ is structured as a values document, not a story: Meet MTM Health, Vision, Mission, Core Values, Commitment to the Environment and Sustainability, then a long Awards & Accolades section subdivided into Growth, Corporate Culture & Wellness, Customer Service, Employee Training & Development, and Individual Staff Recognition (VERIFIED)
- Named leadership is published, including a CEO with a dedicated page at /alaina-macia/, plus CFO and HR executives cited via awards (VERIFIED). The sitemap index also exposes modernteammembers-sitemap.xml and modernteamgroups-sitemap.xml, implying a structured team directory I did not map (VERIFIED that the sitemaps exist)
- Notably absent from /about-mtm/: the founding year, the state count, the member count, and the trip count. Those numbers live on the SERVICE pages instead. The About page is culture-and-awards; the proof is elsewhere (VERIFIED)
- Full corporate transparency on contact: HQ street address, phone, and fax are all published on /contact/ (VERIFIED)
- Corporate-citizenship surface: /giving/ ('MTM Health Giving') carried in both nav and footer (VERIFIED that the URL exists)
- Newsroom is real: /news/, /member-stories/, /tradeshows/, plus a whole post-sitemap.xml I did not enumerate (VERIFIED)
- Careers is on-domain for the pitch (/careers/) and off-domain for the listings (app.largely.com) (VERIFIED)
- Legal set: /privacy-policy/, /terms-of-use/, /privacy-settings/ ('Your Privacy Choices'), plus a CA Collection Notice and a Cookie Policy that are served as raw .html files out of /wp-content/uploads/ rather than as real pages (VERIFIED)
- Healthcare-specific notices are placed on /contact/ rather than in a legal section: HIPAA Disclosure, Members' Rights, Notice of Non-Discrimination, and a Notice of Availability of Language Assistance Services and Auxiliary Aids and Services (VERIFIED)
- A public /branding/ section is indexed in the sitemap and exposes brand assets — colors, typefaces, MTM logo, VeyoRide branding, Yellow Cab/AAA branding, and a holiday page (VERIFIED that the URLs exist). This reads as an internal asset library that leaked into the public IA.
- Sibling and partner brands are surfaced only in the footer legal row, not in the nav: MTM Transit and Wanda (VERIFIED)
- The sitemap also carries clear internal/test debris: /testing/, /testing2/, /iva-survey/, and an obfuscated-slug section (a long random string) containing employee and independent-driver pages for specific operators (VERIFIED that these URLs are published in page-sitemap.xml)


### e. Artifacts

**Downloadable documents (21)**

- MTM Link Member Portal User Guide — 2026, split into 'Migrated Plans' and 'Non-Migrated Plans' editions (PDF) — link published on /mtm-link/ (VERIFIED link, PDF contents not opened)
- MTM Link Member Mobile App User Guide — 2026, same Migrated/Non-Migrated split, EN + ES (PDF) — /mtm-link/ and /texas/members/ (VERIFIED link)
- MTM Link Trifold — member-facing one-sheet on the app/portal (PDF) — /mtm-link/ (VERIFIED link)
- MTM Link Driver App Reference Guide (PDF) — driver-facing app walkthrough — /texas/transportation-providers/ (VERIFIED link)
- MTM Link Portal Helpful Tips for TPs (PDF) — provider portal tips — /texas/transportation-providers/ (VERIFIED link)
- MTM Link Facility Portal Brochure, EN + ES (PDF) — facility portal explainer — /washington-dc/ (VERIFIED link)
- Gas Mileage Reimbursement Trip Log — roughly 35 separate PDFs, keyed per state AND per health plan (AZ Banner/Centene/Molina/UHC, CT, FL AHCA/Sunshine/UHC, HI, ID, IL Meridian/YouthCare, IA, MI x4, MN, MO, NH x2, NJ, NC x2, NV, OH, RI, TX, DC, WI x2, plus a Generic), many with a Spanish twin — /mileage-reimbursement/ (VERIFIED links)
- TX Gas Mileage Reimbursement Packet, EN + ES (PDF) and ITP Trip Log EN + ES (PDF) — /texas/members/ (VERIFIED links)
- DC Transportation Provider Manual / Handbook (PDF) — the full provider handbook, published openly — /washington-dc/ (VERIFIED link)
- DC NET Provider FAQ (.docx) — provider Q&A as an editable Word doc — /washington-dc/ (VERIFIED link)
- Transportation Provider Daily Reports Affidavit of Compliance, DC Medicaid (PDF) — a compliance attestation form published publicly — /washington-dc/ (VERIFIED link)
- MTM Transportation Provider List (PDF, dated 10/2024) — the actual roster of contracted providers in DC — /washington-dc/ (VERIFIED link)
- DC Medical Facility Resource Guide, EN + ES (PDF) — facility how-to — /washington-dc/ (VERIFIED link)
- DC Recipient NEMT Brochure / Trifold 2025, EN + ES (PDF) — member-facing benefit explainer — /washington-dc/ (VERIFIED link)
- Standard Level of Need (LON) form (PDF + Formstack web form) — clinical justification doc — /washington-dc/ and /healthcare-providers/ (VERIFIED link)
- Illinois Certificate of Transportation Services (CTS) and Physician Certification Statement (PCS) forms (PDF) — /healthcare-providers/ (VERIFIED links)
- Accident and Incident Report Form — Nevada (.docx) and All Other Locations (.doc) — provider incident reporting — /training/ (VERIFIED links)
- SmarTrip Log (.docx) — DC transit-fare log — /washington-dc/ (VERIFIED link)
- Verification Trip Log EN + ES (PDF) — DC mileage log — /washington-dc/ (VERIFIED link)
- CA Collection Notice and Cookie Policy — published as raw .html files inside /wp-content/uploads/, not as real pages — footer (VERIFIED links)
- NOTE: robots.txt on this domain disallows crawling of PDFs and DOCs, so every document above is VERIFIED as a published, linked artifact but its contents were NOT opened or read (REPORTED as to substance)

**Portals (11)**

- MTM Link — the umbrella product name covering client, provider, facility, and member surfaces (VERIFIED, named across /healthcare/nemt/, /mtm-link/, /service-providers/)
- Client / agency portal: https://mtm.mtmlink.net/ — this is what the single header 'Sign In' link points at, and also what the homepage 'Clients' triage tile points at (VERIFIED, homepage)
- Member Portal: https://mtm.work/ — separate hostname; landing screen is a zip-code lookup ('Enter Your Zip Code' + a 'Fetch!' button) that resolves the member's plan before anything else. No sign-in or registration form on that landing screen (VERIFIED, fetched mtm.work)
- MTM Link Member mobile app — iOS (apps.apple.com id1534737345) and Android (play.google.com net.mtmlink.member); used for booking, ride tracking, and 'I'm Leaving'/'I'm Here' mileage-claim submission (VERIFIED, /mtm-link/ and /mileage-reimbursement/)
- MTM Link Provider Portal — named as the channel through which trip assignments are transmitted electronically to contracted providers; no public URL exposed on the provider page (VERIFIED that it is named, /texas/transportation-providers/)
- MTM Link Facility Portal — access is NOT self-serve; a facility submits a 'Facilities Portal Registration Request' via Formstack (mtminc.formstack.com/forms/mtm_facilities_portal_registration_request) and is presumably provisioned manually (VERIFIED, /healthcare-providers/)
- Veyo driver funnel: https://veyo.com/drivers — independent/gig drivers are handed off to the affiliate brand entirely, off-domain (VERIFIED, /service-providers/)
- Formstack is the forms layer for everything: securemtm.formstack.com (clinical/member/facility forms) and mtminc.formstack.com (portal registration) (VERIFIED, /healthcare-providers/ and /contact/)
- Zendesk instance for online GMR trip-log submission in Wisconsin: mtmgmr.zendesk.com (VERIFIED, /mileage-reimbursement/)
- Careers ATS is off-domain: app.largely.com (VERIFIED, nav 'Current Openings')
- Sibling/partner destinations reachable from the footer: MTM Transit (mtmtransit.com) and Wanda (wanda.care) (VERIFIED, footer)

**Contact patterns (11)**

- No phone number anywhere in the header or footer. The site is phone-free at the chrome level (VERIFIED, homepage fetch found none).
- Corporate phone appears only on /contact/: 636-561-5686, plus fax 636-561-2962 and a full HQ street address, 16 Hawk Ridge Drive, Lake St. Louis, Missouri 63367 (VERIFIED, /contact/).
- Member phone numbers are NOT national — they are per-state AND per-health-plan. The Texas page alone publishes 15 distinct toll-free numbers, one per plan/product line (Aetna Better Health STAR, Community Health Choice STAR / STAR Plus / D-SNP, El Paso Health STAR / STAR PLUS / D-SNP, WellPoint STAR / STAR PLUS / STAR Kids, etc.) (VERIFIED, /texas/ and /texas/members/).
- Where the contract is with a state rather than plans, the numbers are functional rather than plan-keyed. DC publishes four: 1-866-796-0601 scheduling, 1-866-436-0457 complaints, 1-888-293-4687 late return rides, plus the state DHCF Ombudsman 202-724-7491 — and even a named state program manager's direct line and a program fax (VERIFIED, /washington-dc/).
- A separate product-support line exists for the app/portal itself: the 'Navigator Line', 888-597-1189 (VERIFIED, /mtm-link/).
- /contact/ splits into five audience-routed Formstack forms — member/rider, medical facility, business inquiries, transportation provider & driver, and a general 'other' — rather than one generic form (VERIFIED, /contact/).
- Providers already in network are explicitly told not to use the public form and to go to their assigned Vendor Account Manager instead (VERIFIED, /contact/).
- Role-based email addresses are used rather than personal ones for operations: CO@mtm-inc.net (Community Outreach, facility-facing), payme@mtm-inc.net (mileage trip logs), txgmr@mtm-inc.net (Texas mileage), marketing@mtm-inc.net (general corporate). One named-person media contact is published, mlucas@mtm-inc.net (VERIFIED, /contact/, /healthcare-providers/, /mileage-reimbursement/, /texas/members/).
- Fax is still a first-class intake channel for claims: 1-888-513-1610 for general trip logs, 888-407-0936 for Texas, plus a postal mail address for paper logs (VERIFIED, /mileage-reimbursement/ and /texas/members/).
- The payer/sales contact path is thin: no procurement or RFP page, no sales phone, no named business-development contact. The only route is the 'Healthcare More Information Form' at /more-information/ and a 'Contact Sales' anchor on the homepage that jumps to an on-page form section (VERIFIED, /more-information/ and homepage).
- /contact/ also carries compliance-notice headings alongside the forms: HIPAA Disclosure, Members' Rights, Notice of Non-Discrimination, and Notice of Availability of Language Assistance Services and Auxiliary Aids and Services (VERIFIED, /contact/).

### f. Verdict table

| Ruling | Item | Reason |
|---|---|---|
| **COPY** | The state × audience page matrix: a hub page per jurisdiction, each fanning out to members / transportation providers / medical facilities sub-pages, and sharding below state level (Northern Minnesota) or per-payer (Oregon/Trillium) when a contract demands it | This is the strongest structural idea on their entire site and it is the one we should learn from most directly. Their national pages are generic marketing; every genuinely useful sentence lives at the state level, because NEMT rules ARE state-level. We serve DC/MD/VA, so the analogue is obvious: a DC page, an MD page, a VA page, each answering the three audiences separately, rather than one blended service page that hedges across three jurisdictions. Their DC page in particular is a working model of what ours should contain. VERIFIED across ~15 state hubs in page-sitemap.xml and confirmed by fetching /texas/ and /washington-dc/. |
| **COPY** | FAQ headings written as the literal question a user would ask — "What do I do if my ride is late?", "How do I file a grievance or appeal?", "What kind of insurance coverage does my company need to have?" | Every heading is a search query and a real anxiety at the same time. It costs nothing, it is honest, and it is the opposite of the abstract-noun headings most healthcare sites use. It also maps cleanly onto our existing query-lexicon law. VERIFIED on /texas/members/ and /texas/transportation-providers/. |
| **COPY** | Publishing concrete, numeric ride-day expectations for members: be ready 90 minutes before, expect to arrive 15–60 minutes early, call if the ride is more than 15 minutes late, a will-call return should arrive within the hour | This is the single most member-respectful thing on their site. It replaces reassurance with arithmetic, which is what someone getting to dialysis actually needs. CAUTION for us: these are operational commitments and our copy gate treats any "within X" as a claim requiring substantiation. Copy the FORM (specific, checkable expectations) and only publish numbers we can actually stand behind. VERIFIED on /texas/members/. |
| **COPY** | Downloadable forms published in English and Spanish side by side, at scale — roughly 35 mileage trip logs, member brochures, facility resource guides | Bilingual parity in the artifacts that people actually have to fill out is a real access decision, not a gesture. VERIFIED from published filenames across /mileage-reimbursement/, /washington-dc/, /texas/members/. The half-measure to avoid is theirs: the PDFs are bilingual but the page bodies are English-only, with no Spanish routes in the sitemap. If we do this, do it at the page level too. |
| **COPY** | The facility forms library split into "Standard Forms" and "State-Specific Forms" — Level of Need, Medical Necessity, Parental Consent, Distance Verification, plus per-state sets | It answers the facility's actual job — "which piece of paper do I need for this patient today" — with a two-axis library rather than prose. That standard-vs-jurisdictional split is exactly the right decomposition for a DC/MD/VA operator. VERIFIED on /healthcare-providers/. |
| **COPY** | Naming the provider onboarding funnel as ordered stages: Provider Application → interview → Contracting → Credentialing → Training → first trip assignment | Telling an applicant how long the road is before they earn anything is respectful and it self-selects. Most competitor sites show a form and hide the journey. VERIFIED on /driverswanted/. |
| **COPY** | Provider training and case studies left completely open — no login, no gate, no lead form | Ungated proof and ungated training signal confidence and cost them nothing in a market where the buyer is a procurement officer, not an impulse purchaser. Gating a case study behind a form would have bought them a lead and cost them credibility. VERIFIED on /training/ and /case-studies/. |
| **COPY** | Segmenting the SUPPLY side into four distinct populations — fleet companies, independent gig drivers, unpaid community volunteers, HCBS therapy providers — each with its own CTA and its own destination | "Provider" is not one audience, and pretending it is produces a page that speaks to nobody. Even if we only ever recruit fleet companies and individual drivers, splitting the door by what the applicant BRINGS (a fleet vs a car vs time) is the right cut. VERIFIED on /service-providers/. |
| **COPY** | Publishing the DC Transportation Provider Manual, a Provider FAQ, an Affidavit of Compliance, and the actual roster of contracted providers as open public documents | Publishing the compliance instrument and the provider roster is a transparency posture most brokers avoid, and it is unusually persuasive to a state evaluator. Note it happens ONLY where a state contract presumably requires it — which is itself the tell: they do the honest thing when watched. We can choose to do it unwatched. VERIFIED as published links on /washington-dc/. |
| **COPY** | Routing contact into five audience-specific forms, and telling in-network providers explicitly NOT to use the public form but to go to their named Vendor Account Manager | Both halves are good: the intake is pre-sorted, and existing relationships are protected from the general queue by naming a human role. The "you already have a person, use them" instruction is a small piece of operational honesty worth imitating. VERIFIED on /contact/. |
| REJECT | Three top-level nav items with everything non-service crammed into one "Discover" mega-menu — members, providers, facilities, about, news, and careers all in the same undifferentiated bucket | "Discover" is a word that describes nothing and promises nothing. A dialysis patient looking for a ride and a state procurement officer evaluating a bid are given the same single doorway, and the four column headings inside are the real nav pretending to be a submenu. Our audience triage must be visible AT the top level, not one hover deep behind a mood word. VERIFIED, homepage read twice. |
| REJECT | A single undifferentiated "Sign In" in the header pointing every audience at the client/agency portal, while two different member portal links ("Member Login" and "Member Portal", on two different hostnames) hide inside a mega-menu column | The most prominent authentication affordance on the site sends members to the wrong building, and the two links that would send them to the right one are ambiguously labelled and buried. This validates the Stage-15 decision to make Sign-in a real portal MENU with named doors per audience. Their failure is our proof. VERIFIED, homepage. |
| REJECT | The nav and footer item labelled "Locations" 301-redirecting to mtm.work, a zip-code plan finder — not a locations page | A label in both nav AND footer that does not deliver what it names is a broken promise on the highest-traffic surface of the site, and for a company whose main credibility claim is geographic reach, losing the states list is a self-inflicted wound. It also means there is NO page anywhere that simply says where they operate — you have to reverse-engineer it from the sitemap. Observed once as a 301; recorded in caveats. Our footprint must be a real, readable page. |
| REJECT | The nav item labelled "Newsletter" pointing at /more-information/, which renders as a "Healthcare More Information Form" sales lead-capture | A reader who clicks "Newsletter" expecting to subscribe is dropped into a B2B sales form. Whether that is decay or intent, it reads as bait. Label and destination must match, always. VERIFIED, homepage nav/footer href plus fetching /more-information/. |
| REJECT | Calling medical facilities "Healthcare Providers" while calling transportation companies "Service Providers" and "Transportation Providers" | Three overlapping uses of "provider" across two completely different audiences guarantees misrouting in exactly the population least able to absorb the confusion. Directly relevant to us — our own Stage-6.2 ruling keeps third-party "provider" language, so we must be disciplined that ONE noun maps to ONE audience site-wide. VERIFIED across nav, /healthcare-providers/, /service-providers/. |
| REJECT | Provider requirements named but never quantified — insurance "details will be discussed", rates "determined on an individual basis", no document checklist, no vehicle standards, no timeline | The page's implicit promise is "here is what it takes to join" and it answers every hard question with "apply and we'll tell you". That converts a qualified operator into a lead-gen form fill, which is a bad trade for a network that says providers are its backbone. If we publish a requirements page it must contain requirements — a real document checklist and real minimums. VERIFIED on /texas/transportation-providers/ and /driverswanted/. |
| REJECT | Headline statistics published with no source, method, date, or auditor — 95% satisfaction, 13.5M calls, 35M trips, "up to 25%" cost reduction, networks in "more than half" the US | Every one of these would fail our copy honesty gate on the spot. "Up to 25%" in particular is the classic unfalsifiable construction. An incumbent can get away with unsourced numbers on reputation; a new entrant cannot, and should not want to. Our stats band stays recount-at-deploy and substantiated. VERIFIED as published claims on /healthcare/nemt/ and /healthcare/social-determinants-of-health/. |
| REJECT | A case-studies section that is ungated and prominent but almost entirely free of numbers — one hard figure across six studies | They earned the reader's click by not gating it and then spent it on qualitative language. A proof section with no proof is worse than no proof section, because it advertises the absence. If we publish case studies they carry a number or they do not ship. VERIFIED on /case-studies/. |
| REJECT | Sitemap hygiene: /testing/ and /testing2/ indexed, an obfuscated random-string section containing operator employee pages, duplicate routes (/needaride/ + /need-a-ride/ + /medicaltrip/, /mtm-link/ + /mtm-link-2/, /wisconsin/ + /wisconsin-2/), and inconsistent slugs (medical-facilities vs facilities vs medicalfacilities) | Twenty years of accretion with no gardener. The obfuscated slug is security-by-URL-secrecy that the sitemap then publishes, which defeats itself entirely. This is the failure mode of a site that grows one contract at a time with no route convention. Our per-state and per-audience slugs need a written convention before the third state, not after. VERIFIED from page-sitemap.xml. |
| REJECT | A public /branding/ section — logo, colors, typefaces, partner brand pages — indexed in the sitemap alongside marketing pages | An internal asset library leaking into the public IA. Harmless in isolation, but it is evidence of the same absent gardener, and it dilutes the sitemap a search engine uses to understand what the site is for. VERIFIED from page-sitemap.xml. |
| REJECT | No public security, privacy-infrastructure, or HIPAA-posture page for payer evaluators — HIPAA appears only as a driver-training bullet and a disclosure heading on the contact page | Their most sophisticated audience is the one asked to trust them with member PHI, and there is nothing on the site addressing that directly. This is a genuine gap in the incumbent's IA and therefore an opening for us — provided anything we publish stays inside our own gated "Built for" language and never claims certification. VERIFIED as an absence across the pages fetched; caveat that ~154 sitemap URLs were not opened. |
| REJECT | Placing the About page's substance in awards and values while the actual proof (founding year, scale, footprint) sits on the service pages | A reader who goes to About to answer "who are these people and how big are they" gets a trophy case instead. The facts and the story should be on the page named after the company. Directly applicable to our /about — text-led story plus a facts card is the right shape, and this is the counterexample that confirms it. VERIFIED on /about-mtm/. |

### Caveats and unverified areas

WHAT I COULD NOT VERIFY, AND WHY. 1) PDFs and DOCs were never opened. Their robots.txt explicitly disallows PDF and DOC paths. Every document in artifacts.documents is VERIFIED only in the sense that the link is published on an HTML page I actually fetched — I did NOT read any PDF's contents. Any statement about what is INSIDE those documents would be inference, and I have made none. 2) Coverage is a sample, not a census. page-sitemap.xml lists roughly 170 URLs; I fetched about 16 pages. Every URL in pageInventory is VERIFIED as existing (I fetched page-sitemap.xml directly, so URL existence is a direct observation), but content depth is VERIFIED only for the pages I actually opened: /, /about-mtm/, /contact/, /healthcare/nemt/, /healthcare/social-determinants-of-health/, /healthcare/home-health-coordination/, /healthcare-providers/, /service-providers/, /driverswanted/, /training/, /mtm-link/, /mileage-reimbursement/, /case-studies/, /texas/, /texas/members/, /texas/transportation-providers/, /washington-dc/, /needaride/, mtm.work, robots.txt, sitemap_index.xml, page-sitemap.xml. Where I describe a page I did not open, I say so. 3) post-sitemap.xml (the blog/news archive) was NOT enumerated. The news volume is therefore unknown. Same for category-sitemap, post_tag-sitemap (two files, implying a large tag archive), modernteammembers-sitemap and modernteamgroups-sitemap (which imply a structured leadership/team directory I did not map), and wpa-stats-type-sitemap. 4) The browser tool (agent-browser) timed out and never returned, so I could not take an accessibility-tree snapshot. ALL navigation labels come from WebFetch's markdown conversion of the homepage, read twice with different prompts. The two reads agreed on structure and hrefs but disagreed on one label's parenthetical suffix — 'Mobile Integrated Health' vs 'Mobile Integrated Health (MIH)'. I have gone with the second, more literal read. Treat parenthetical acronym suffixes in the Services dropdown as slightly lower confidence than the rest. I have marked those two nav labels REPORTED rather than VERIFIED for that reason. 5) Mobile navigation was never inspected. Everything described is the desktop chrome. Whether the mega-menu collapses to an accordion, and whether Sign In stays pinned, is unknown. 6) No portal was logged into. mtm.mtmlink.net, the Provider Portal, and the Facility Portal are described only from how the public site frames them. mtm.work I fetched, but only its unauthenticated landing screen. What a member, provider, or facility sees after auth is entirely unknown. 7) One finding I want to flag as possibly transient rather than intentional: https://www.mtm-inc.net/locations/ returned a 301 to https://mtm.work/. That is a direct observation (the redirect was reported by the fetch with the server's Location header), and /locations/ is linked as 'Locations' from both the nav and the footer. I did not re-test it a second time or from another network, so I cannot rule out a temporary redirect rule. I have recorded it as observed and drawn a verdict from it, but it is a single observation. 8) Statistics attributed to them (95% satisfaction, 13.5M calls, 35M trips, up to 25% cost reduction, 600+ agents across 21 states, networks in more than half the US) are VERIFIED as claims they publish on their own pages. They are NOT verified as true. No source, methodology, date, or auditor is given on-page for any of them. Do not let these travel into our materials as facts. 9) The 1995 founding date and the Feb-2025 'MTM is now MTM Health' rebrand are corroborated by their own site (/healthcare/nemt/ states 1995; /mtm-is-now-mtm-health.../ exists on their domain) AND by third-party newswire coverage. The rebrand narrative details — that operations/partnerships are unaffected and that transit stays under MTM Transit — come from press-release summaries and are REPORTED, not verified against a primary company statement I read in full. 10) I deliberately did not reproduce their marketing copy. Every quoted fragment in this report is short and attributed. Descriptions of what pages contain are my own summarization of structure and category, not their prose.

---

## 2. Modivcare

### a. Identity line

- **Domain verification:** resolved to `www.modivcare.com` — status **live-as-given**. Fetched https://www.modivcare.com directly — live, serving current marketing content with a full WordPress/Yoast IA. Confirmed https://www.modivcare.com/robots.txt (crawl-delay 10, no disallows, points to sitemap_index.xml) and https://www.modivcare.com/sitemap.xml, which returned an 11-child sitemap index. /page-sitemap.xml enumerated 144 live URLs including current leadership and 'Board of Managers' pages. VERIFIED: the expected domain is correct and current. TWO IMPORTANT WRINKLES, both VERIFIED. (1) The legacy LogistiCare domain is STILL IN PRODUCTION serving live portals: the Transportation Provider Portal runs at transportationco.logisticare.com and the facility feedback tool at wecarefacility.logisticare.com, both linked from current modivcare.com pages (/login/ and /tripcare-resource-center/). The rebrand was never completed at the portal layer. (2) The nav includes 'Board of Managers' rather than 'Board of Directors' — the LLC/private-ownership governance vocabulary consistent with a post-restructuring private company. REPORTED (search summaries only, not corroborated on-site): Providence Service Corporation rebranded to ModivCare Inc. in Jan 2021 and LogistiCare Solutions LLC became ModivCare Solutions LLC; the company filed Chapter 11 in Aug 2025 with $1.4B+ debt and emerged Dec 29, 2025 as a private lender-owned entity after eliminating ~$1.1B of debt. The public site carries no notice of any of this.
- **Self-description (short attributed fragment):** "leading provider of non-emergency medical transportation, personal care services, and monitoring solutions" — **VERIFIED** (https://www.modivcare.com/company/about-modivcare/)
- **The noun they use (vocabulary finding):** "provider" — never "broker". This is the single most consequential finding of the teardown. The actual nouns they use, all VERIFIED: "leading provider" (/company/about-modivcare/ and /company/), "nation's leading provider of Non-Emergency Medical Transportation" (/offerings/nemt/), "healthcare company" and "value-based solutions provider" (/company/), "largest provider of non-emergency medical transportation" (/company/our-brands/). The word "broker" was confirmed ABSENT from their payer conversion page (VERIFIED, /state-agencies-payers-and-health-systems/) and did not surface on any of the 17 pages I read. Meanwhile third parties — NEMT trade press, billing guides, state Medicaid program documents — label them a broker as the default descriptor (REPORTED, search summaries). THE COLLISION: they call themselves a "provider" while simultaneously calling their contracted network "transportation providers" on the same site, and give that network its own nav item, its own portal, and its own complaints line. The same noun therefore denotes both the manager and the managed. This looks like a deliberate trade — accepting internal ambiguity to avoid "broker", a word that in NEMT carries denial-and-no-show baggage with members and legislators. It directly validates our Stage-6.2 ruling (self-describe as a "company", let third-party "provider" stand), and it shows the cost of NOT doing what we did.
- **Operating model as they state it:** They state plainly that they CONTRACT A NETWORK and do not own the NEMT vehicles — the NEMT product page describes partnering with transportation providers in each community and building relationships with a network of drivers, and lists modes they clearly do not own outright (rideshare, public transit, bus passes) alongside specialized and door-to-door van service (VERIFIED, /offerings/nemt/). Their described role is the broker function in all but name: provider screening, eligibility validation, trip authorization, driver and vehicle data capture, GPS-supported records, field vehicle inspections, credentialing, and paying provider claims (VERIFIED, /nemt-fraud-waste-abuse-prevention/ and /who-we-serve/transportation-provider-driver/). Notably the About page itself declines to explain the operating model at all — it describes offerings and values, not mechanics (VERIFIED, /company/about-modivcare/). The other two lines differ: personal care is OWNED, assembled from eight acquired home-care brands still operating under their own names and domains (VERIFIED, /company/our-brands/), and they also license dispatch software (WellRyde) to the very NEMT businesses they contract, making them simultaneously the network manager and a vendor to their own network (VERIFIED, /login/ and sitemap).
- **Footprint:** PUBLISHED, but stranded in an odd place — the scale numbers appear on the brand-architecture page, not About, not the payer pages, and not the homepage: '30M trips and more than 36M lives' plus 'over 15,000 caregivers' for the personal-care arm (VERIFIED, /company/our-brands/). The About page and the /company/ hub publish NO numbers at all (VERIFIED, both fetched). One state-level program proof exists on the NEMT product page: a 2024 Florida PPEC program cited at 547,056 trips with a 99.67% standing-order completion rate and 95.20% on-time pickup (Leg-A DO) (VERIFIED, /offerings/nemt/). A state count is never published on any page I read; the facilities sitemap enumerates 35 state pages, which is a verified floor, not a claim they make (VERIFIED, /facilities-sitemap.xml). Per-state economic-impact figures are published for a political audience — Maine alone lists 91 local employees, 1.7M annual reservations, 300K calls, and a service-level breakdown of 1.1M ambulatory / 77K wheelchair / 100K mass transit / 365K friends-and-family trips (VERIFIED, /state/maine/). REPORTED only: ~48 states plus DC and ~37M annual trips (search summaries, not found on-site).

### b. Nav map

| Top-level label | Dropdown children | |
|---|---|---|
| `Who We Serve` | `Members and Caregivers (links EXTERNALLY to mymodivcare.com)`, `Medicaid Plans & State Agencies`, `Medicare Advantage & SNP Plans`, `Health Systems`, `Healthcare Professionals`, `Transportation Providers/Drivers` | VERIFIED |
| `Offerings` | `Non-Emergency Medical Transportation`, `Personal Care`, `Remote Monitoring`, `Integrated Supportive Care` | VERIFIED |
| `Company` | `About Modivcare`, `Contact Us`, `Leadership`, `Board of Managers`, `Events`, `Security`, `NEMT Fraud, Waste & Abuse Prevention`, `Careers` | VERIFIED |
| `Newsroom` | (no dropdown) | VERIFIED |
| `Login` | `Portal Logins & Information` | VERIFIED |
| `Insights (FOOTER-ONLY — absent from primary nav despite being a full content tree at /insights/)` | `Blog`, `Library`, `White papers`, `Thought Leadership Articles`, `Infographics`, `Videos` | VERIFIED |
| `Resources (FOOTER-ONLY — the two deepest information trees on the entire site are reachable from the footer only)` | `Facilities`, `Members` | VERIFIED |
| `Legal/policy row (FOOTER-ONLY)` | `Terms & Conditions`, `Privacy Notice`, `Accessibility`, `Ethics`, `Service Animal Policy` | VERIFIED |

### c. Page inventory (74 distinct public page types enumerated)

**PAYER** (15)

| Page type | URL | |
|---|---|---|
| Medicaid Plans & State Agencies | `/who-we-serve/medicaid-plans-state-agencies/` | VERIFIED |
| Medicare Advantage & SNP Plans (sitemap only) | `/who-we-serve/medicare-advantage-plans/` | VERIFIED |
| Health Systems (sitemap only) | `/who-we-serve/health-systems/` | VERIFIED |
| Managed Care Organization (sitemap only) | `/who-we-serve/managed-care-organization/` | VERIFIED |
| Sales conversion page for state agencies, payers and health systems | `/state-agencies-payers-and-health-systems/` | VERIFIED |
| MCO / state agency contact form (referenced from contact router) | `/mcos-state-agencies-contact-us/` | VERIFIED |
| NEMT offering page — the only page carrying operational proof metrics | `/offerings/nemt/` | VERIFIED |
| Personal Care / Remote Monitoring / Integrated Supportive Care offering pages (sitemap only) | `/offerings/personal-care/` | VERIFIED |
| Security hub + Security Practices + Data Protection & Availability + Security Request Form (4 pages) | `/company/security/` | VERIFIED |
| NEMT Fraud, Waste & Abuse Prevention (plus a second FWA page under /company/) | `/nemt-fraud-waste-abuse-prevention/` | VERIFIED |
| State economic-impact hub + per-state pages (ME, NJ, DE, WV, MI, GA seen) | `/state/` | VERIFIED |
| White papers index — 3 ungated PDFs | `/insights/library/library-white-papers/` | VERIFIED |
| Infographics / Videos / Thought Leadership Articles library indexes (sitemap only) | `/insights/library/library-infographics/` | VERIFIED |
| Payer-pain campaign LPs: HEDIS control, MLR shortfalls, breaking silos, senior services, MHPA (sitemap only) | `/lp/improving-hedis-control/` | VERIFIED |
| Consultation request LP (sitemap only) | `/lp/request-for-consultation/` | VERIFIED |

**PROVIDER** (12)

| Page type | URL | |
|---|---|---|
| Transportation Providers/Drivers landing page | `/who-we-serve/transportation-provider-driver/` | VERIFIED |
| Join-our-network contact form | `/transportation-providers-contact-us/` | VERIFIED |
| Transportation provider support form (sitemap only) | `/transportation-provider-support-form/` | VERIFIED |
| Provider submission confirmation (sitemap only) | `/tp-confirmation/` | VERIFIED |
| Provider compliance attestation (sitemap only) | `/tp-compliance-attestation/` | VERIFIED |
| Provider perks / Insider program (sitemap only) | `/insights/tp-perks/` | VERIFIED |
| WellRyde dispatch software product page (sitemap only) | `/who-we-serve/wellryde-dispatch-software/` | VERIFIED |
| Driver recruitment campaign 2025 (sitemap only) | `/drive-with-us-2025/` | VERIFIED |
| Veteran-targeted start-your-NEMT-business LP (sitemap only) | `/lp/start-your-transportation-provider-business-veterans/` | VERIFIED |
| Mississippi transportation providers — carries the ONLY provider manual PDF | `/mississippi/mississippi-transportation-providers/` | VERIFIED |
| Mississippi provider complaint & appeals (sitemap only) | `/mississippi/complaint-appeals-for-transportation-providers/` | VERIFIED |
| Safety digest subscription (sitemap only) | `/safety-digest-subscribe-sign-up/` | VERIFIED |

**MEMBER** (10)

| Page type | URL | |
|---|---|---|
| Member destination — EXTERNAL app domain linked from primary nav | `https://www.mymodivcare.com/` | VERIFIED |
| Find Your Plan locator (external, referenced from contact router) | `https://www.mymodivcare.com/find-your-plan` | VERIFIED |
| Member state page — the ONLY entry in members-sitemap.xml; carries the full operational rulebook | `/members/ms/` | VERIFIED |
| Mississippi section hub (sitemap only) | `/mississippi/` | VERIFIED |
| Mississippi member complaint & appeal (sitemap only) | `/mississippi/complaint-appeal-for-members/` | VERIFIED |
| WeCare feedback / complaint / compliment page | `/who-we-serve/wecare/` | VERIFIED |
| Service Animal Policy (sitemap only) | `/service-animal-policy/` | VERIFIED |
| Care Everyday (sitemap only) | `/care-everyday/` | VERIFIED |
| Personal care branch directory + per-branch sitemap tree (sitemap only, volume NOT enumerated) | `/personal-care-branches/` | VERIFIED |
| Member-focused transportation and healthcare access LPs (sitemap only) | `/lp/member-focused-transportation/` | VERIFIED |

**FACILITY** (8)

| Page type | URL | |
|---|---|---|
| Healthcare Professionals landing page | `/who-we-serve/health-care-professional/` | VERIFIED |
| Facility resources hub — index only, no documents of its own | `/facility-resources/` | VERIFIED |
| Per-state facility document pages — 35 states, each a PDF library (VA fetched: ~18 PDFs) | `/facilities/va/` | VERIFIED |
| Facilities index page (sitemap only) | `/facilities/` | VERIFIED |
| Plan-specific facility page (HMSA) — one non-geographic entry in the facilities tree (sitemap only) | `/facilities/hmsa/` | VERIFIED |
| TripCare resource center + Tips & Tricks + New Features (3 pages) | `/tripcare-resource-center/` | VERIFIED |
| TripCare training page under Who We Serve (sitemap only) | `/who-we-serve/tripcare-training/` | VERIFIED |
| Mississippi medical facilities (sitemap only) | `/mississippi/mississippi-medical-facilities/` | VERIFIED |

**COMPANY-GENERAL** (29)

| Page type | URL | |
|---|---|---|
| Homepage | `https://www.modivcare.com/` | VERIFIED |
| Who We Serve hub (6 audience cards) | `/who-we-serve/` | VERIFIED |
| Offerings hub | `/offerings/` | VERIFIED |
| Company hub | `/company/` | VERIFIED |
| About | `/company/about-modivcare/` | VERIFIED |
| Brand architecture / acquired sub-brands | `/company/our-brands/` | VERIFIED |
| Technology (sitemap only) | `/company/technology/` | VERIFIED |
| Leadership index + ~18 individual bio pages (sitemap only) | `/company/leadership/` | VERIFIED |
| Board of Managers index + 8 bio pages (sitemap only) | `/company/board-of-managers/` | VERIFIED |
| Employee story profiles, ~20 pages (sitemap only) | `/people/` | VERIFIED |
| Careers hub + Benefits + Life at + Training (sitemap only) | `/company/careers/` | VERIFIED |
| Modivcare Labs mini-site + its own Benefits and Training pages (sitemap only) | `/modivcare-labs/` | VERIFIED |
| Newsroom (sitemap only) | `/newsroom/` | VERIFIED |
| Events (sitemap only) | `/events/` | VERIFIED |
| Insights hub (sitemap only) | `/insights/` | VERIFIED |
| Blog index (sitemap only) | `/insights/blog/` | VERIFIED |
| Library hub (sitemap only) | `/insights/library/` | VERIFIED |
| Contact router — 4 audience paths + corporate address | `/contact-us-business/` | VERIFIED |
| Sustainability report announcement (sitemap only) | `/modivcare-releases-2024-sustainability-report/` | VERIFIED |
| Terms & Conditions (sitemap only) | `/terms-conditions/` | VERIFIED |
| Privacy Notice (sitemap only) | `/privacy-notice/` | VERIFIED |
| CCPA notice (sitemap only) | `/california-consumer-privacy-act-ccpa/` | VERIFIED |
| Ethics (sitemap only) | `/ethics/` | VERIFIED |
| Accessibility statement (sitemap only) | `/accessibility/` | VERIFIED |
| Accessibility statement, Spanish (sitemap only) | `/accesibilidad/` | VERIFIED |
| Email preference center / unsubscribe / safety-digest signup — 3 indexed utility pages (sitemap only) | `/email-preference-center/` | VERIFIED |
| Campaign landing-page tree /lp/* incl. expired event RSVP pages (sitemap only) | `/lp/` | VERIFIED |
| Digital partnership content page (sitemap only) | `/company/digital-partnership-content-page/` | VERIFIED |
| Blog posts, news/press releases, categories, authors — 5 further child sitemaps NOT enumerated | `/post-sitemap.xml` | VERIFIED |


### d. Information categories by audience

**PAYER**

- Four segmented audience pages (Medicaid plans & state agencies, Medicare Advantage & SNP, health systems, managed care organization) that describe services but publish NO outcome numbers, NO case studies and NO network-size figures on the page itself (VERIFIED)
- The only vague scale claim on the payer page is serving millions of members nationally, with nothing behind it (VERIFIED)
- Real proof numbers EXIST but are stranded on the product page instead of the buyer page: one state PPEC program at 547,056 trips, 99.67% standing-order completion, 95.20% on-time pickup (VERIFIED, /offerings/nemt/)
- Enterprise scale (30M trips, 36M lives, 15,000+ caregivers) is published only on the brand-architecture page, three clicks from any payer entry point (VERIFIED, /company/our-brands/)
- Security posture page names SOX, SOC 1 and SOC 2 third-party review, and product penetration testing; it does NOT name HIPAA, HITRUST or NIST (VERIFIED)
- Five described control families: risk management with risk-to-controls mapping, incident response and BCDR plans, SSO and adaptive authentication, 100% background checks and 100% annual security training completion, and third-party risk management (VERIFIED)
- SOC documentation is gated behind a request form rather than published — a deliberate qualify-the-lead move (VERIFIED)
- A full program-integrity page describing FWA controls per service line (trip authorization and GPS records for NEMT, electronic visit verification for personal care, licensing and credentialing for monitoring), a Special Investigations Unit, an anonymous hotline, and a non-retaliation position (VERIFIED)
- NO RFP or procurement page, NO contract-award list, NO state-by-state contract table anywhere in the sitemap (VERIFIED by full enumeration)
- No pricing, no demo scheduler, no pilot path, no implementation timeline — conversion is a single generic form (VERIFIED)
- State pages sell economic impact and local jobs to a POLITICAL audience rather than clinical outcomes to a buying one (VERIFIED, /state/maine/)
- Thin thought-leadership layer: 3 ungated white paper PDFs total across the whole library (VERIFIED)
- Campaign landing pages hit payer pain directly (HEDIS control, MLR shortfalls, breaking silos, senior services, an MHPA-targeted page) but are unlinked from the nav and reachable only via sitemap or paid media (VERIFIED, sitemap)
- Third parties describe them as a Medicaid NEMT broker under state contracts across ~48 states and DC at ~37M annual trips — numbers the site itself never states (REPORTED)

**PROVIDER**

- One national page whose 'JOIN OUR NETWORK' CTA routes to a contact form, NOT an application — no application exists on the public site (VERIFIED)
- NO national requirements list: no vehicle standards, no insurance minimums, no driver qualification criteria, no credentialing checklist published anywhere in the provider section (VERIFIED)
- Credentialing is described only in prose — field vehicle inspections, an 'automated credentialing approach' framed as in development, ongoing compliance communications (VERIFIED)
- The only substantive provider manual is a STATE-specific PDF reached through the Mississippi state page, not the provider section — a major findability failure (VERIFIED)
- Payment is explained as benefits, never terms: web-based billing, GPS-automated claims, faster payment. No rates, no payment cycle, no denial or appeal detail (VERIFIED)
- Two separate provider phone lines split by function — a provider line and a provider-complaints line (VERIFIED)
- A formal provider complaint-and-appeal page exists, but only inside the Mississippi section (VERIFIED, sitemap)
- Compliance attestation is collected through its own dedicated page (VERIFIED, sitemap)
- A genuine loyalty layer: maintenance discounts, an NEMT-specific insurance program, monthly recognition awards, private networking groups, business tips (VERIFIED)
- Training is portal-gated — driver safety courses are booked inside the provider portal; nothing downloadable publicly (VERIFIED)
- A dispatch-software product page (WellRyde) doubles as a provider-recruitment surface, selling software to the same firms they contract (VERIFIED)
- Segmented recruitment campaigns: a veteran-targeted 'start your NEMT business' page and a dated 2025 driver-recruitment page (VERIFIED, sitemap)
- A safety-digest email subscription aimed at drivers and providers (VERIFIED, sitemap)
- The provider portal is still served from the legacy logisticare.com domain — the rebrand never reached the provider layer (VERIFIED)
- Volume and revenue framing is used as the recruitment pitch: revenue stability and more work for strong performance (VERIFIED)

**MEMBER**

- The primary member door is an EXTERNAL app domain (mymodivcare.com) linked straight from the nav — members are pushed off the marketing site immediately (VERIFIED)
- Only ONE member page exists on the marketing site: members-sitemap.xml contains a single URL, /members/ms/ (VERIFIED)
- That one page carries the entire operational picture, and it is genuinely excellent — booking channels: phone with weekday hours, online portal, an automated reservation assistant, plus 24/7 urgent and hospital-discharge handling (VERIFIED)
- A checklist of exactly what a caller must have ready: name, address, phone, Medicaid ID, pickup location, provider details, appointment date/time, special needs (VERIFIED)
- Advance-notice rule stated numerically — three business days / 72 hours — with a named exception path for dialysis and wound care confirmed by the facility (VERIFIED)
- Ride-level menu published plainly: mileage reimbursement, fixed-route bus tickets, ambulatory sedan/van, wheelchair-accessible vehicle (VERIFIED)
- Service expectations published as NUMBERS, which is rare and valuable: driver wait 5-10 minutes, pickup within 15 minutes either side of schedule, unscheduled return arranged within 45 minutes (VERIFIED)
- Rules on escorts (one adult if medically necessary), service animals, member-supplied wheelchairs and child safety seats (VERIFIED)
- Eligibility is deliberately DEFERRED to the health plan rather than asserted — they tell members to confirm benefits with their plan (VERIFIED)
- Four function-split member phone numbers plus an urgent escalation line (VERIFIED)
- Free interpreter access advertised with its own number, 24/7/365 (VERIFIED)
- Complaint path is multi-channel and branded: WeCare site, a dedicated complaints line, and a member feedback form, with a stated 24-hour response commitment (VERIFIED)
- Member handbook and the bilingual mileage-reimbursement pack are PDFs — but they sit on the FACILITY state page, not any member page (VERIFIED)
- Standalone service-animal policy and an accessibility statement with a Spanish twin (VERIFIED, sitemap)
- A Mississippi-only member complaint-and-appeal page, with no equivalent for other states in the sitemap (VERIFIED, sitemap)

**FACILITY**

- A dedicated healthcare-professional page explaining portal booking, standing orders, discharge trips, 24/7 web access and real-time trip monitoring with member ETAs (VERIFIED)
- The facility-resources hub holds NO documents — it is purely an A-to-Z index into ~35 state pages (VERIFIED)
- The state facility page is where the real depth lives: the Virginia page alone carries roughly 18 PDFs (VERIFIED, n=1)
- Form types published: level-of-service, standing order, single trip request, minor consent in English and Spanish, attendant-care eligibility assessment, attendant pre-assessment checklist, advance-notice flyer, transportation tips (VERIFIED)
- Facility phone AND fax with explicit business hours, plus a separate bus-ticket coordinator line (VERIFIED)
- A reservation number per health plan — seven distinct plan lines for one state across Medicaid managed care and Medicare Advantage, plus a fee-for-service line (VERIFIED)
- Six geographic 'Ride Assist' regional numbers within that same state, labeled by region and city (VERIFIED)
- Operational commitments stated in numbers, e.g. a three-hour window to assign and collect a hospital discharge (VERIFIED)
- Definitions published rather than assumed, e.g. a standing order defined as trips at least three days per week for three months or more (VERIFIED)
- The emergency boundary is stated bluntly: ambulance trips are not arranged through them, call 911 (VERIFIED)
- A separate TripCare resource center with a hosted training-video library, tips-and-tricks page, release-notes page, and weekly virtual office hours with a named product owner (VERIFIED)
- A SECOND facility platform, Modivcare Connect, on an acquired-company domain, for on-demand ordering — two competing facility tools, unreconciled (VERIFIED)
- Facility feedback routed to yet another WeCare instance on the legacy LogistiCare domain (VERIFIED)
- Only Mississippi gets a dedicated medical-facilities page outside the /facilities/ tree (VERIFIED, sitemap)
- Named facility liaisons offered as a single point of contact (VERIFIED)

**COMPANY**

- About page leads with purpose, vision and values, not operating model or scale; section headings run Our Purpose / Our Vision / Our Values / CARING / PURPOSEFUL / COLLABORATIVE / DEDICATED (VERIFIED)
- Full leadership roster with ~18 individual bio pages, plus a SEPARATE Board of Managers roster with 8 more bio pages (VERIFIED)
- A third people layer: ~20 employee-story profile pages under /people/, distinct from leadership, used for culture and recruiting (VERIFIED)
- Brand-architecture page naming eight acquired personal-care brands, each still on its own domain — unusual transparency about roll-up structure (VERIFIED)
- Careers section with benefits, life-at-company and training sub-pages, PLUS a separate 'Modivcare Labs' mini-site carrying its own duplicate benefits and training pages (VERIFIED)
- Content marketing stack: newsroom, events, blog, and a library split four ways into white papers, infographics, videos and thought leadership articles (VERIFIED)
- A standalone technology page and a 2024 sustainability report announcement (VERIFIED, sitemap)
- Legal set is complete and conventional: terms, privacy notice, CCPA, ethics, accessibility, and a Spanish accessibility twin at /accesibilidad/ (VERIFIED, sitemap)
- Corporate mailing address, media and investor-relations emails, and an outsourced employment-verification vendor are all published (VERIFIED)
- Marketing-email plumbing is exposed as public indexed pages: preference center, unsubscribe, and a safety-digest signup (VERIFIED, sitemap)
- A large /lp/ campaign tree sits outside the nav, including expired event RSVP pages for VIP dinners and happy hours, still in the public sitemap (VERIFIED, sitemap)
- No investor-relations section, no restructuring notice, and no contract-award or state-contract listing anywhere in the sitemap (VERIFIED by full enumeration)
- The company emerged from Chapter 11 under lender ownership in Dec 2025; the site acknowledges none of it, though the 'Board of Managers' label is consistent with the new private structure (REPORTED)


### e. Artifacts

**Downloadable documents (19)**

- Mississippi Medicaid Transportation Provider Manual — the only real provider manual found anywhere on the site; direct ungated PDF at /wp-content/uploads/2024/06/Mississippi-Medicaid-Transportation-Provider-Manual-1.pdf, linked from the Mississippi provider page, NOT from the national provider section (VERIFIED link + URL; PDF contents NOT opened)
- VA Level of Service Form — clinical level-of-service designation form for facilities, /wp-content/uploads/2022/10/VA-Level_of_Service-Form.pdf (VERIFIED)
- Standing Order Form (VA) — recurring-trip authorization, /wp-content/uploads/2022/10/VA-Standing-Order-Form-5.24.pdf (VERIFIED)
- Single Trip Request Form (VA) — one-off trip request, /wp-content/uploads/2022/10/VA-Single_Trip_Request-Form.pdf (VERIFIED)
- Attendant Care Eligibility Assessment Form (VA) — determines whether an escort/attendant is covered, /wp-content/uploads/2022/10/VA-Attendant_Care_Eligibility_Assessment-Form.pdf (VERIFIED)
- Attendant Pre-Assessment Checklist (VA) — companion checklist to the above (VERIFIED)
- Child Consent Form, English and Spanish (VA) — consent for transporting a minor; two separate PDFs (VERIFIED)
- 5 Day Notice Requirement Flyer (VA) — one-page advance-notice rule explainer for facility staff (VERIFIED)
- Non-Emergency Transportation Tips (VA) — facility-facing operational tips sheet (VERIFIED)
- Member Handbook (Aug 2022) — member-facing handbook PDF, but hosted on the FACILITY state page rather than any member page (VERIFIED)
- Mileage Reimbursement pack — 8 PDFs: program instructions, trip log, trip log instructions, and a fillable digital trip log, each in English and Spanish (VERIFIED, /facilities/va/)
- White paper: aging independently / where older adults receive care — direct PDF, no form gate, /wp-content/uploads/2023/05/Modivcare_WP-Aging_Independently-1-1.pdf (VERIFIED)
- White paper: value-based care drivers and SDoH impact — direct PDF, /wp-content/uploads/2023/05/Modivcare_WP-SDoH.pdf (VERIFIED)
- White paper: personal emergency response program and cost of care for fall-history patients — direct PDF, /wp-content/uploads/2025/01/Modivcare_PersonalEmergencyResponseProgram_Impact_2024.pdf (VERIFIED)
- SOC 1 / SOC 2 documentation — NOT published; gated behind a 'REQUEST ACCESS' form at /company/security/security-request-form/ (VERIFIED that it is gated)
- TripCare training video library — hosted off-path at p.modivcare.com/TripCareTraining.html, not a downloadable file (VERIFIED link)
- 2024 Sustainability Report — announced via a page at /modivcare-releases-2024-sustainability-report/ (VERIFIED page exists in sitemap; report file NOT retrieved)
- Library sub-taxonomies for Infographics, Videos, and Thought Leadership Articles exist as separate index pages (VERIFIED URLs); their item counts were NOT enumerated (only the white-paper index was fetched, and it held just 3 items)
- NOTE: no national provider requirements PDF, no credentialing checklist, no rate sheet, and no RFP/procurement document was found anywhere in the sitemap (VERIFIED by full sitemap_index enumeration)

**Portals (10)**

- Member Portal — member.modivcare.com/en/login, for members and caregivers, pitched as self-service ride scheduling (VERIFIED, /login/)
- TripCare — tripcare.modivcare.com/login, the facility booking platform; has its own resource center, training videos and release notes on the marketing site (VERIFIED)
- Modivcare Connect — app.circulation.com/login, on-demand ride ordering for health systems and facilities; runs on a separate acquired-company domain (VERIFIED)
- Transportation Provider Portal — transportationco.logisticare.com, for billing, claims, reservations and booking driver safety training; still served from the LEGACY LogistiCare domain (VERIFIED)
- WellRyde — portal.app.wellryde.com, routing/dispatch SaaS sold to NEMT businesses; also has a marketing page at /who-we-serve/wellryde-dispatch-software/ (VERIFIED)
- WeCare — wecare.modivcare.com, the named feedback/complaint intake used for members, caregivers and provider support (VERIFIED, /contact-us-business/)
- WeCare Facility — wecarefacility.logisticare.com, a SEPARATE facility feedback instance, also on the legacy domain (VERIFIED, /tripcare-resource-center/)
- Ethics hotline — ethicshotline.modivcare.com, anonymous fraud/waste/abuse reporting (VERIFIED, /nemt-fraud-waste-abuse-prevention/)
- MyModivcare — www.mymodivcare.com, the external member destination linked directly from the primary nav's 'Members and Caregivers' item; includes a 'Find Your Plan' locator at /find-your-plan (VERIFIED as link target; the app itself was NOT fetched)
- Employment verification — outsourced to CCCVerify.com (VERIFIED, /contact-us-business/)

**Contact patterns (14)**

- ZERO phone numbers on the corporate marketing layer: home, about, company, offerings, who-we-serve hubs, all four payer pages, the national provider page and the facility-resources hub all publish none (VERIFIED across every one of those fetches)
- Phone numbers live exclusively on STATE-SCOPED pages — the member state page and the facility state page carry them all (VERIFIED, /members/ms/ and /facilities/va/)
- Member numbers are split BY FUNCTION, not one main line: scheduling 1-866-331-6004, late-ride assist 1-866-334-3794, complaints 1-866-381-4853, TTY 1-866-288-3133, urgent member experience 1-800-486-7647 opt.4 (VERIFIED, /members/ms/)
- Provider numbers are likewise function-split: NET provider line 1-866-333-1043 and a distinct provider-complaints line 1-866-381-4852 (VERIFIED, /mississippi/mississippi-transportation-providers/)
- Facility numbers add a fax and explicit business hours: utilization review/facility 866-679-6330, fax 866-907-1491, 8:00 AM-5:00 PM Mon-Fri, plus a bus-ticket coordinator on 804-236-1570 / 866-810-8305 ext. 608 (VERIFIED, /facilities/va/)
- A THIRD numbering axis on the facility page: a reservation number per health plan (seven distinct plan lines listed for Virginia across Medicaid managed care and Medicare Advantage, plus a fee-for-service Medicaid line) (VERIFIED)
- A FOURTH axis: six geographic 'Ride Assist' regional numbers within a single state, labeled by region and city (VERIFIED, /facilities/va/)
- Interpreter access is advertised as a phone capability with a number, 24/7/365, at no cost (VERIFIED, /members/ms/)
- Contact page is a ROUTER, not a form: /contact-us-business/ sorts visitors into four paths (individuals seeking services, caregivers/healthcare professionals, transportation providers/drivers, business development) and hands each off to an external portal or a different form (VERIFIED)
- Corporate address IS published: 6900 Layton Avenue, Suite 1200, Denver, CO 80237 (VERIFIED, /contact-us-business/)
- Role-based emails published for media and investor relations only; no general or sales email (VERIFIED, /contact-us-business/ — the addresses were masked in the fetch pipeline)
- Distinct forms rather than one contact form: /transportation-providers-contact-us/ (provider join), /transportation-provider-support-form/, /tp-compliance-attestation/, /mcos-state-agencies-contact-us/ (sales), /state-agencies-payers-and-health-systems/ (sales), /company/security/security-request-form/, /higi-contact-us/, /non-emergency-medical-transportation-contact-us/, /lp/request-for-consultation/ (VERIFIED via sitemap + page fetches)
- FWA reporting gets its own channel set: hotline 855-818-6929, an email address, and an anonymous web portal, with a stated non-retaliation position (VERIFIED, /nemt-fraud-waste-abuse-prevention/)
- Primary CTA verbs are segregated by audience: 'GET STARTED' / 'LET'S GET STARTED' / 'CONTACT US' for payers, 'JOIN OUR NETWORK' for providers (VERIFIED)

### f. Verdict table

| Ruling | Item | Reason |
|---|---|---|
| **COPY** | Avoiding the noun "broker" and self-describing as a "provider" | The instinct is right and it independently validates our Stage-6.2 ruling — "broker" carries denial-and-no-show baggage with members and legislators, and the largest incumbent in the category refuses the word. But their SUBSTITUTE is bad: they call themselves a "provider" while calling their contracted network "transportation providers" on the same page, giving the same noun two referents. COPY the avoidance, REJECT the replacement. Our existing split — "company" for ourselves, "provider" reserved for the third-party network — is strictly better and we should not drift off it. |
| **COPY** | Publishing service expectations as hard NUMBERS on the member page | Driver wait 5-10 minutes, pickup within 15 minutes either side of schedule, unscheduled return within 45 minutes, three-business-day advance notice with a named dialysis/wound-care exception. This is the single most valuable content on their entire site and it is exactly what an anxious member or a discharge planner actually needs. It converts an abstract benefit into a checkable promise. CAUTION under our §7.2: these are operational commitments, so we may only publish numbers we can actually hold to. Publish the ones we control today (what to have ready, notice window, escort and service-animal rules) and hold the timing numbers until they are real. |
| **COPY** | Deferring eligibility to the health plan instead of asserting it | They tell members to confirm benefits with their own plan rather than claiming to know coverage. Honest, legally safer, and it prevents the worst member experience — being told you are covered by a website and then denied. Directly compatible with our copy honesty gate. |
| **COPY** | Ungated white papers as direct PDFs with no form wall | Three payer-facing PDFs served straight from the CDN with no lead-capture gate. Removes friction for an MCO evaluator doing quiet diligence — exactly the reader we care about, who will not fill a form during early screening. Low cost, high trust signal. |
| **COPY** | Function-segmented phone numbers rather than one switchboard | Separate lines for scheduling, late-ride assistance, complaints and TTY, with interpreter access advertised at its own number. A member whose ride is late has a different urgency than one booking next month, and one number for both guarantees the urgent caller waits. Adapt to our single-number reality by labelling WHAT each contact path is for, even where the number is shared. |
| **COPY** | A visible, named complaint and feedback path (WeCare) that also accepts compliments | A dedicated, branded channel for grievances signals confidence rather than defensiveness, and accepting compliments about drivers gives the channel a non-adversarial reason to exist. Payers and state agencies specifically look for a member grievance path. COPY the visible complaint route; REJECT their stated 24-hour response commitment, which is exactly the SLA promise our §7.2 gate forbids. |
| **COPY** | A dedicated program-integrity / fraud-waste-abuse page with an anonymous reporting channel | Describes controls per service line, names a Special Investigations Unit, publishes a hotline and an anonymous web portal, and states a non-retaliation position. This is high-value payer trust content that costs nothing but honesty, and it is the kind of page an MCO compliance reviewer looks for by name. We can write a truthful version at our scale today. |
| **COPY** | Gating SOC-type documentation behind a request form instead of publishing or omitting it | Elegant middle path — signals that formal documentation exists without publishing audit artifacts publicly, and qualifies the requester. Note carefully that their security page names SOX and SOC 1/SOC 2 but does NOT claim HIPAA, HITRUST or NIST certification, which is consistent with our own ban on the word "certified". Adopt the request-form pattern only when we genuinely have something to hand over. |
| **COPY** | Per-state facility document libraries with direct, ungated, task-named PDFs | The Virginia page alone carries ~18 PDFs named for the job to be done — level of service, standing order, single trip request, minor consent in two languages. A discharge planner can find, print and fax without an account. This is the deepest real utility on their site. Adapt to our DC/MD/VA footprint, but at OUR scale build it as one properly-structured page per jurisdiction rather than 35 thin ones. |
| **COPY** | Publishing the emergency boundary explicitly (ambulance trips are not arranged, call 911) | Names what the service is NOT, in the place where someone might wrongly rely on it. Safety-critical, trust-building, and cheap. We should state this plainly on member and facility surfaces. |
| REJECT | Payer pages that carry no numbers, no case studies and no proof | All four payer-facing pages describe services and route to a generic form with nothing an evaluator can act on. The proof they DO have is misfiled — a real program result with trip volume, completion and on-time rates sits on the product page, and enterprise scale sits on the brand-architecture page. An MCO reviewer hits the buyer page, finds nothing, and leaves. Our proof must live ON the buyer page, and per §10.6 every number gets recounted at deploy. |
| REJECT | "JOIN OUR NETWORK" with zero published requirements | The national provider page has a recruitment CTA but no vehicle standards, no insurance minimums, no driver qualifications, no credentialing checklist and no rates — the only real manual is a state PDF buried under a state page. Every serious applicant is forced into a contact form to learn whether they even qualify, which wastes their time and ours. Our /apply must publish the requirements BEFORE the form. |
| REJECT | Wildly uneven depth across states — Mississippi complete, Maine hollow | Mississippi has member, provider and facility pages with numbers, rules and a manual; Maine gets an economic-impact page with jobs and reservation counts and no booking information at all. A Maine member landing there learns nothing useful. Across a three-jurisdiction footprint this is entirely avoidable: our DC, MD and VA pages must be structurally identical, and we should not ship a jurisdiction page until it carries the same content skeleton as the others. |
| REJECT | The two richest information trees are reachable only from the FOOTER | Facilities and Members — the per-state document libraries and the member operational rulebook, the most useful content on the site — appear under a footer "Resources" heading and are absent from the primary nav. Insights is footer-only too. They have buried their best material. Whatever we build deepest must be reachable from the nav. |
| REJECT | Legacy logisticare.com and circulation.com domains still serving production portals | Five years after the rebrand, providers still log in at transportationco.logisticare.com and facilities send feedback to wecarefacility.logisticare.com. Users are handed an unfamiliar domain at the exact moment they are asked to enter credentials — which is the shape of a phishing page and a real trust and security cost, not just brand untidiness. Our SITE.portalLogin() single-source keeps us clean; never let a portal handoff cross to a domain the visitor has not been shown. |
| REJECT | Two competing, unreconciled facility booking platforms (TripCare and Modivcare Connect) | Both target facilities, both appear on the login page, and nothing explains which one a given facility should use — the acquisition seam is exposed directly to the user as a choice they cannot make. Argues hard for our one-portal-per-audience discipline. |
| REJECT | Member handbook and mileage-reimbursement forms filed under FACILITIES | The member-facing handbook and the bilingual reimbursement pack live on the facility state page, while the member tree has exactly one page in its entire sitemap. Documents are filed by who administers them, not by who needs them. File by READER. |
| REJECT | Heavy company theater — leadership bios, board roster, employee profiles, values pages, eight sub-brands | Roughly 45 of 144 pages are people and culture pages. For a large incumbent this is legitimate recruiting infrastructure; for us it is precisely what our §7.2 gate forbids, and attempting it at our scale would read as inflation. Our /about stays text-led story and principles with the founder referenced only as "our founder". |
| REJECT | Campaign, RSVP, unsubscribe and preference-center pages left in the public sitemap | Expired VIP dinner and happy hour RSVP pages, a confirmation page, an unsubscribe page and an email preference center are all indexed. Wastes crawl budget, surfaces dead pages in search, and makes the site look unmaintained. Our sitemap discipline (email-preview already excluded) is correct — keep utility and campaign pages out. |
| REJECT | Library split four ways to hold three documents | White papers, infographics, videos and thought-leadership articles each get an index page; the white-paper index holds three PDFs. The taxonomy is heavier than the content, so every path leads to a near-empty room. Ship one insights index and only split it when volume demands. |
| REJECT | No phone number anywhere on the corporate marketing layer | Home, about, offerings, all four payer pages, the national provider page and the facility hub carry no number at all — a corporate address is published, but a visitor who wants to talk to a human must first correctly identify their state and audience. Contact is a router, not an answer. Our SITE.phone placement (Stage-11) is the better call; keep a reachable contact on the main marketing surfaces. |
| REJECT | About page that never explains the operating model | The About page leads with purpose, vision and values and never says how the service actually works — that they contract a network rather than own vehicles is only discoverable on the NEMT product page. The single question a serious evaluator brings to an About page goes unanswered. Ours should state the operating model plainly once the owner settles it (still UNDECIDED per Stage-6.2). |

### Caveats and unverified areas

WHAT I ACTUALLY FETCHED (17 pages + 4 sitemap/robots files): home, /sitemap.xml (index), /page-sitemap.xml, /members-sitemap.xml, /facilities-sitemap.xml, /robots.txt, /company/about-modivcare/, /company/, /company/our-brands/, /company/security/security-practices/, /who-we-serve/, /who-we-serve/transportation-provider-driver/, /who-we-serve/medicaid-plans-state-agencies/, /who-we-serve/health-care-professional/, /who-we-serve/wecare/, /offerings/nemt/, /login/, /facility-resources/, /facilities/va/, /members/ms/, /state/maine/, /mississippi/mississippi-transportation-providers/, /nemt-fraud-waste-abuse-prevention/, /tripcare-resource-center/, /state-agencies-payers-and-health-systems/, /insights/library/library-white-papers/, /contact-us-business/. VERIFIED IN THIS REPORT MEANS ONE OF TWO THINGS, and they are not equally strong. (a) For the pages listed above, I fetched them and the content claim is first-hand. (b) For the ~110 other pageInventory rows, VERIFIED means the URL was confirmed present in the sitemap I fetched — the page EXISTS, but I did not read it, and its audience assignment is my inference from URL path and nav position. Treat every "(sitemap only)" row as existence-verified, content-unverified. NOT VERIFIED / OPEN GAPS: - I did not open a single PDF. Every document in artifacts.documents is verified as a link and URL on a page I read; the contents are unread. The Mississippi provider manual almost certainly contains the vehicle/insurance/driver requirements that are conspicuously absent from the HTML, but I cannot confirm that. - I did not fetch mymodivcare.com, member.modivcare.com, tripcare.modivcare.com, or any portal login. These are the member-facing product surfaces and my read of what members find is therefore limited to the marketing site plus one state page. - I fetched exactly ONE facility state page (VA) and ONE member state page (MS, the only entry in members-sitemap.xml). The VA document set may not be representative; other states may carry more, fewer, or different forms. The claim "the state facility page is the real artifact library" generalizes from n=1 and should be spot-checked against a second state before we design around it. - I fetched one state economic-impact page (Maine) out of at least six. The "state pages carry no booking info" finding is n=1. - Five child sitemaps were NOT enumerated: post-sitemap, news_press-sitemap, personal-care-branch-sitemap, category-sitemap, wpa-stats-type-sitemap, news_press_type-sitemap, author-sitemap. Blog, news and personal-care-branch page COUNTS are therefore unknown, and the personal-care-branch tree is likely large (a location directory). My pageInventory covers TYPES from those trees, not volume. - Library item counts: only the white-paper index was fetched (3 items). Infographics, Videos and Thought Leadership Articles counts are unknown, so "thin content layer" is an inference extrapolated from one of four sub-libraries. CONTRADICTIONS AND PIPELINE ARTIFACTS I AM FLAGGING RATHER THAN SMOOTHING OVER: - The facilities sitemap fetch reported "Total URLs: 35" then listed 36. I report 36 URLs = 1 hub + 35 state-level pages, but the exact count is approximate. - The /who-we-serve/ fetch returned a summary headed "Health Systems Page", which suggests a possible redirect or a mis-titled render. I kept its six audience cards only because they match the homepage nav children exactly — cross-verified, but the page identity is slightly uncertain. - WebFetch summarizes through an intermediate model, so "verbatim" labels are verbatim as relayed, not as scraped from raw DOM. Nav labels are the highest-confidence set because they appeared identically in two independent fetches (homepage nav and who-we-serve cards). Casing of ALL-CAPS CTAs ("GET STARTED", "JOIN OUR NETWORK") may be CSS text-transform rather than authored copy. - The email addresses on /contact-us-business/ were masked as "[email protected]" by the fetch pipeline; I know media and IR addresses exist but not their local parts. INFERENCE, EXPLICITLY LABELED AS SUCH — not verified fact: - The claim that they deliberately avoid the word "broker" is MY INFERENCE. What is verified: they self-describe as "provider" on three separate pages, and "broker" was confirmed absent from the payer conversion page. I did not run a site-wide search for the token, so I cannot assert it appears nowhere. - "Content depth is uneven by state" is inferred from the structural fact that members-sitemap.xml holds exactly one state (MS) while facilities-sitemap.xml holds 35 — a strong signal, but I did not verify that the other 34 lack member equivalents elsewhere in the URL structure. REPORTED (secondhand, from search-result summaries only — I fetched no court filing, press release, or investor document): the LogistiCare-to-ModivCare rename via Providence Service Corporation in Jan 2021; the Aug 2025 Chapter 11 filing with $1.4B+ debt; the Dec 2025 plan confirmation and Dec 29, 2025 emergence as a private lender-owned company with ~$1.1B of debt eliminated; the ~48 states + DC footprint and ~37M annual trips; and the characterization of the company as a Medicaid NEMT broker. None of this was corroborated on modivcare.com itself, and notably I found no investor-relations or restructuring notice in the sitemap. One WebSearch call was rate-limited on first attempt and retried successfully; no data was lost.

---

## 3. Verida

### a. Identity line

- **Domain verification:** resolved to `verida.com` — status **live-as-given**. VERIFIED. verida.com IS the NEMT company, not the Verida identity/data company. Fetched https://verida.com/ (HTTP 200) and the homepage self-describes as a minority-owned NEMT management company in Villa Rica, GA, formerly Southeastrans. Corroborating structural evidence: (a) https://verida.com/wp-sitemap-posts-post-1.xml lists dozens of legacy news posts still on Southeastrans URLs (e.g. /southeastrans-awarded-arkansas-contract-to-manage-medicaid-non-emergency-medical-transportation/); (b) /about-verida/ tells the rename story explicitly (founder Steve Adams, name from 'Veritas' + 'ride'); (c) legacy portal hosts provider.southeastrans.com and facility.southeastrans.com are still hyperlinked from /washington-dc-providers/ and /washington-d-c-facilities/. IMPORTANT FETCH NOTE: WebFetch returned HTTP 403 on every verida.com URL (WAF blocks the default agent). All verification was done via curl with a standard Chrome User-Agent, which returns 200. Sitemap index is at /wp-sitemap.xml (WordPress/Divi), NOT /sitemap.xml; robots.txt VERIFIED and points to it.
- **Self-description (short attributed fragment):** "a minority-owned, non-emergency medical transportation (NEMT) management company" (homepage); "As a transportation broker" (state provider pages) — **VERIFIED** (https://verida.com/ , https://verida.com/about-verida/ , https://verida.com/services/ , https://verida.com/transportation-providers/ , https://verida.com/verida-mission-and-vision/ , https://verida.com/georgia-providers/)
- **The noun they use (vocabulary finding):** PRIMARY NOUN = "management company" — specifically "NEMT management company" (homepage) and "Non-Emergency Medical Transportation Management Company" (/verida-news/). SECONDARY, OPERATIONAL NOUN = "broker" — used freely and without apology: "over 20 years of NEMT broker experience" (homepage), "As a transportation broker, we know..." (/georgia-providers/, /washington-dc-providers/), and the self-applied reputation phrase the "NEMT provider-friendly" broker (/transportation-providers/). LEGAL/REGULATORY NOUN = "transportation brokerage, coordination, and service programs" (/title6/). They also sell a named technology product (Net InSight / NET Insight) but NEVER call themselves a technology platform or a benefit manager. Net finding: the marketing register is "management company", the working register is "broker", and they switch to "broker" precisely when addressing transportation providers. All VERIFIED.
- **Operating model as they state it:** VERIFIED — asset-light network manager, not a fleet owner. They state they contract a third-party network and administer it: "Verida currently contracts with more than 900 NEMT providers" (/transportation-providers/) and describe recruiting, credentialing, training, and monitoring those providers. /services/ enumerates the administrative stack they actually run: seven centralized call centers, gatekeeping/eligibility, claims management and provider payment, credentialing (criminal background, drug, OIG/SAM, sex offender registry, MVR), field monitoring and vehicle inspections, utilization review, quality management, and state-agency reporting. They build and give away the software rather than sell it standalone — free mobile devices/app (Net InSight) to contracted providers, plus a Client Portal for payers, a Member Portal/App, a Facility Portal, and a Provider Portal. They are explicit about mode-tiering including non-vehicle modes: public transit vouchers, mileage/gas reimbursement, and volunteer drivers. Vehicle types coordinated: ambulatory, wheelchair, stretcher, and in some programs BLS and ALS. /about-verida/ signals deliberate drift beyond transport: "we are not just a transportation company anymore." Nothing on the site claims they own or operate vehicles.
- **Footprint:** VERIFIED but INTERNALLY INCONSISTENT — three different service-area lists exist on the live site. (1) Homepage: Arkansas, Georgia, Indiana, Louisiana, Tennessee, Washington DC (six). (2) /member-resources/ prose adds Mississippi (seven), yet its own program tiles link only to the six. (3) The /contact-us/ form's "I live in" dropdown lists ten: Alabama, Arkansas, Georgia, Indiana, Louisiana, Mississippi, South Carolina, Tennessee, Virginia, Washington. Per-state member programs are named, not generic: Arkansas Medicaid + Arkansas BlueMedicare, Georgia Medicaid (DCH), Indiana FSSA Medicaid, Louisiana FFS Legacy, Tennessee BlueCare & TennCare Select, and Washington DC = HSCSN (Health Services for Children with Special Needs). SCALE STATS PUBLISHED (VERIFIED as published, unaudited, and mutually contradictory): 3M+ covered lives; 5M+ calls annually; 5M+ trips annually (homepage) vs "about 5.5 million trips" (/interested-providers/, /provider-driver-training/); 900+ contracted NEMT providers (/transportation-providers/) vs "more than 350 independent NEMT Providers" (/interested-providers/); 5,300+ credentialed vehicles and drivers; seven call centers; "99.9% complaint-free rating"; URAC accredited since 2011; PASS certified; GHCA member.

### b. Nav map

| Top-level label | Dropdown children | |
|---|---|---|
| `Contact Us` | (no dropdown) | VERIFIED |
| `Members` | (no dropdown) | VERIFIED |
| `Transportation Providers` | (no dropdown) | VERIFIED |
| `Facilities` | (no dropdown) | VERIFIED |
| `Corporate` | `About Verida`, `Company Overview`, `Leadership Team`, `Our Services`, `Careers`, `VERIDA News` | VERIFIED |
| `(search icon — no text label; opens an inline site search field)` | (no dropdown) | VERIFIED |
| `Select Page (mobile menu toggle label)` | `Members`, `Transportation Providers`, `Facilities`, `Corporate` | VERIFIED |
| `FOOTER COLUMN — Verida (blurb, no links)` | (no dropdown) | VERIFIED |
| `FOOTER COLUMN — Resources` | `Members`, `Providers`, `Facilities`, `Covid-19 Information Hub` | VERIFIED |
| `FOOTER COLUMN — Links` | `Company Overview`, `Leadership Team`, `Our Services`, `Careers`, `Verida News` | VERIFIED |
| `FOOTER COLUMN — Let's Connect` | `Verida, Inc. / 843 Dallas Highway / Villa Rica, Georgia 30180`, `Office: 678-510-4600` | VERIFIED |
| `FOOTER — Translate this website / Translation Guide` | `A 20-language guide link (Spanish, Kurdish, Arabic, Chinese, Vietnamese, Korean, French, Amharic, Gujarati, Lao, German, Tagalog, Hindi, Serbo-Croatian, Russian, Nepali, Farsi, Pilipino, Kreola, Aleman) served as a /download/22361/ asset`, `a floating "Translate »" widget` | VERIFIED |
| `FOOTER — Notice of Privacy Practices (NPP)` | `links to a Member Rights Regarding PHI Disclosure PDF` | VERIFIED |
| `FOOTER — © Copyright 2026 Verida. All rights reserved \| Privacy Policy` | (no dropdown) | VERIFIED |
| `IN-PAGE BREADCRUMB STRIP (on state pages, not global nav) — e.g. HOME \| GEORGIA \| MEMBERS \| TRANSPORTATION PROVIDERS \| FACILITIES` | `Cross-links the three audiences within one state; on /contact-us/ and /title6/ it reads HOME \| MEMBERS \| MEMBER FEEDBACK \| TRANSPORTATION PROVIDERS \| FACILITIES` | VERIFIED |
| `NOT PRESENT: any Sign in / Log in / Portal item anywhere in the header, top bar, mobile menu, or footer` | `Verified by string search of the rendered header markup — zero matches for sign in / log in / portal` | VERIFIED |
| `NOT PRESENT: any Payer / Health Plan / MCO / Solutions item in nav or footer` | `/solutions/ exists and returns 200 but is not linked from the nav, the footer, or any of the ~35 pages fetched` | VERIFIED |

### c. Page inventory (45 distinct public page types enumerated)

**PAYER** (2)

| Page type | URL | |
|---|---|---|
| Our Services — 8-category operational capability list (call center, IT, network, compliance, training, QM, admin/reporting, utilization review) | `https://verida.com/services/` | VERIFIED |
| Solutions — the ONLY true payer/MCO landing page: brochure download + "Schedule A Conversation" form. ORPHANED (200, but linked from nothing) | `https://verida.com/solutions/` | VERIFIED |

**PROVIDER** (11)

| Page type | URL | |
|---|---|---|
| MDM — AirWatch device-enrollment instructions + PDF guide + iSupport email (operational, publicly reachable) | `https://verida.com/mdm/` | VERIFIED |
| Transportation Providers — audience hub; ROUTER of 6 state tiles + network-scale claim + credentialing teaser | `https://verida.com/transportation-providers/` | VERIFIED |
| Per-state provider pages (6+): Arkansas, Washington DC, Georgia, Indiana, Louisiana, Tennessee — each with provider line, claims line, named Provider Relations Manager + email, RFQ CTA, tech-support mailto, 6-item compliance checklist, insurance-requirement FAQ, portal banner | `https://verida.com/georgia-providers/` | VERIFIED |
| Georgia Providers (DHS) — a second Georgia provider page for the DHS/CTS contract line | `https://verida.com/georgia-providers-dhs/` | VERIFIED |
| Georgia Informational (DHS) + backup variant | `https://verida.com/georgia-informational-dhs/` | VERIFIED |
| Provider Training — full curriculum syllabus across 7 training domains + the 4-step credentialing process | `https://verida.com/provider-driver-training/` | VERIFIED |
| Interested Providers — 4-step onboarding narrative (near-duplicate of the training page, with stale stats and typos) | `https://verida.com/interested-providers/` | VERIFIED |
| Request for Qualification (RFQ) landing | `https://verida.com/request-for-qualification/` | VERIFIED |
| Provider Request for Qualifications Form — the actual application intake with driver + vehicle lists | `https://verida.com/provider-request-for-qualifications-form/` | VERIFIED |
| Provider file a complaint form + provider file a compliment form | `https://verida.com/provider-file-a-complaint-form-3/` | VERIFIED |
| prmapps provider variants (Louisiana, Mississippi) — parallel provider-relations app entry points | `https://verida.com/louisiana-providers-2-prmapps/` | VERIFIED |

**MEMBER** (10)

| Page type | URL | |
|---|---|---|
| Member Resources — audience hub; a pure ROUTER of 7 state/plan program tiles, no substantive member content of its own | `https://verida.com/member-resources/` | VERIFIED |
| Per-state member program pages (7): Arkansas Medicaid, Arkansas BlueMedicare, Georgia Medicaid DCH, Indiana FSSA, Louisiana FFS Legacy, Tennessee BlueCare/TennCare Select, Washington DC HSCSN — each carries INFO AT A GLANCE, region phone matrix, named director, Rider's Guide PDF, service map, FAQ | `https://verida.com/georgia-members-dch/` | VERIFIED |
| Member Feedback form — the members' contact/complaint intake, plus regional office numbers | `https://verida.com/member-contact-us/` | VERIFIED |
| Members file a complaint form | `https://verida.com/members-file-a-complaint-form/` | VERIFIED |
| Members file a compliment form (a separate form from the complaint form) | `https://verida.com/members-file-a-compliment-form/` | VERIFIED |
| Tennessee-specific member complaint and compliment forms (state-forked duplicates) | `https://verida.com/tennessee-member-file-a-complaint-form/` | VERIFIED |
| TNC Flex Rides — 4-step Lyft-based on-demand ride explainer + walkthrough video | `https://verida.com/flex/` | VERIFIED |
| Gas Reimbursement Program help page | `https://verida.com/gr/` | VERIFIED |
| Member Portal Video (how-to) | `https://verida.com/member-portal-video/` | VERIFIED |
| Info at a Glance rider tile (reusable content block published as its own page) | `https://verida.com/info-at-a-glance-rider-tile/` | VERIFIED |

**FACILITY** (5)

| Page type | URL | |
|---|---|---|
| Facilities — audience hub; ROUTER of 6 state tiles + a reduce-administrative-burden pitch | `https://verida.com/facilities/` | VERIFIED |
| Per-state facility pages (6): Arkansas, Washington DC, Georgia, Indiana, Louisiana, Tennessee — each with INFO AT A GLANCE, Special Services number, named Facility Outreach Manager, Facility Guide PDF, portal registration prompt, booking-data checklist, FAQ | `https://verida.com/georgia-facilities/` | VERIFIED |
| Facility Portal registration form — request-an-account gate plus an "Already Registered?" log-on link | `https://verida.com/facilit-portal-form/` | VERIFIED |
| Facilities file a complaint form + facilities file a compliment form | `https://verida.com/facilities-file-a-complaint-form/` | VERIFIED |
| Indiana Standing Order Form (recurring-trip authorization, PDF-backed) | `https://verida.com/indiana-facilities/` | VERIFIED |

**COMPANY-GENERAL** (17)

| Page type | URL | |
|---|---|---|
| Homepage — positioning, VERIDA AT A GLANCE stat band, 3 differentiators, Title VI callout | `https://verida.com/` | VERIFIED |
| About Verida — the Southeastrans-to-Verida rebrand story and name etymology | `https://verida.com/about-verida/` | VERIFIED |
| Company Overview — mission, vision, founder story, 4 capability pillars, accreditations | `https://verida.com/verida-mission-and-vision/` | VERIFIED |
| Leadership Team — 8 C-suite/VP + state directors, each linking to a bio page | `https://verida.com/verida-executive-team/` | VERIFIED |
| Individual executive/director bio pages (~20 distinct URLs: steve-adams, jim-degliumberto, dena-adams-mcneish, chris-lee, gary-kinard, ronda-walker-jones, stephenie-pope, bryan-joswick, cynthia-washington, andrew-tomys, michael-hanner, steve-buckner, jennifer-adkins, linda-wiant, bill-carmack, crystal-scott, sandra-lowe, darlene-winkles, jodie/others) | `https://verida.com/steve-adams/` | VERIFIED |
| Careers | `https://verida.com/careers-2/` | VERIFIED |
| VERIDA News — reverse-chronological press/community index grouped by year (2024, 2023, 2022...) | `https://verida.com/verida-news/` | VERIFIED |
| Individual news posts (~40+, many still on legacy /southeastrans-* URLs: contract awards, hurricane/weather advisories, promotions, community events, a patent award) | `https://verida.com/southeastrans-awarded-arkansas-contract-to-manage-medicaid-non-emergency-medical-transportation/` | VERIFIED |
| Contact Us — routing hub by intent + corporate address + 6 regional office numbers + ethics hotline + state-dropdown form | `https://verida.com/contact-us/` | VERIFIED |
| Title VI Plan — full civil-rights/compliance document library (Title VI, EEOC, ADA, LEP plans + 4 complaint forms + posters + drug-free workplace policy) | `https://verida.com/title6/` | VERIFIED |
| Privacy Policy | `https://verida.com/privacypolicy/` | VERIFIED |
| Terms and Conditions | `https://verida.com/terms-and-conditions/` | VERIFIED |
| Covid-19 Information Hub (footer-only entry, returns 200) | `https://verida.com/covid-hub` | VERIFIED |
| Verida History | `https://verida.com/verida-history/` | VERIFIED |
| Verida Audio Branding (brand asset page) | `https://verida.com/verida-audio-branding/` | VERIFIED |
| DEAD WEIGHT still in the public sitemap (~30-40 URLs): *-archives / *-archives-2 / *-archives-2a variants of nearly every state page, plus video-test, exec-team-test, test-solutions, rfq-test-form, video-grform, verida-redirect, iwd2024, 110643-2, post-number-1..4 | `https://verida.com/wp-sitemap-posts-page-1.xml` | VERIFIED |
| TOTALS: 106 URLs in the page sitemap; 11 child sitemaps in the index (posts, pages, divi_mega_pro, divi_overlay, layouts, da_image, categories, tags, post_format, dlm_download_category, users) | `https://verida.com/wp-sitemap.xml` | VERIFIED |


### d. Information categories by audience

**PAYER**

- NO payer landing page exists in the navigation at all — there is no Payers / Health Plans / MCO / State Agencies item anywhere in the nav or footer. A payer evaluator arriving at the homepage has no door of their own. (VERIFIED)
- The one genuinely payer-facing page, /solutions/, is ORPHANED: it returns 200 but is not linked from the nav, the footer, or any of the ~35 pages fetched. It is effectively findable only via search engine or direct URL. (VERIFIED)
- Capability inventory rather than outcomes: /services/ lists 8 operational domains — call center, information technology, transportation provider network, compliance, NEMT training, quality management, administration and reporting, utilization review — each as 3-4 bullet capabilities. Detailed on WHAT they run, silent on results. (VERIFIED)
- Gatekeeping and cost-control language aimed squarely at a payer: eligibility and medical-necessity assessment, "least costly, but most appropriate mode" mode-tiering, utilization review of unusual requests, verification of Medicaid-billable destinations, and member no-show/behavioral letters. (VERIFIED)
- Fraud, waste and abuse mitigation is named repeatedly as a distinct service line, with GPS/geocoded trip verification positioned as the detection mechanism. (VERIFIED)
- Client Portal for payers is described (real-time access to the same data the operations team sees, individual-member and aggregate) but is NOT linked, demoed, or screenshotted anywhere. (VERIFIED)
- Accreditation posture is the strongest payer asset: URAC Health Care Management certification since 2011, hyperlinked to the live URAC AccreditNet public registry entry — verifiable, not a logo. Plus PASS (CTAA) certification and GHCA membership. (VERIFIED)
- Compliance/oversight depth a procurement reviewer would actually want: credentialing before network admission, criminal background + drug + OIG/SAM + sex offender registry + MVR screening, field monitoring, mandatory vehicle inspections, a full-time QM staff per operation, monthly satisfaction surveys by an independent agency, and an EthicsPoint anonymous compliance hotline. (VERIFIED)
- Scale statistics are published but unsourced, undated, and mutually contradictory — 900+ vs 350 contracted providers, 5M vs 5.5M annual trips, plus a bare "99.9% complaint-free rating" with no period or methodology. (VERIFIED)
- Technology narrative on /verida-mission-and-vision/ covers Net InSight, cloud call-center infrastructure, AI speech/NLP analysis of every recorded call, the Member App, and a Member Care Program routing driver-observed social-needs concerns (utilities, food, neglect, abuse) to case contacts — the closest thing to an SDOH pitch on the site. (VERIFIED)
- ONE downloadable procurement artifact: a Business Solutions Brochure PDF, reachable only from the orphaned /solutions/ page and dated 11.04.22. (VERIFIED)
- NO case studies, NO named client references, NO outcomes/ROI data, NO cost-savings figures, NO implementation or go-live timeline, NO RFP/procurement page, NO pilot path, NO SLA or performance-guarantee content, NO security/HIPAA certification page (SOC 2 etc.), NO data-integration or API documentation. (VERIFIED — absent across all fetched pages and the full 106-URL page sitemap)
- The only new-business path is a single named human: Chief Development Officer Dena Adams-McNeish, dadams@verida.com, cited on both /services/ and /contact-us/. Plus a "Schedule A Conversation" form on the orphaned /solutions/ page. (VERIFIED)
- Contract/program evidence is indirect, living in the news archive rather than a payer page — e.g. legacy posts about an Arkansas Medicaid NEMT contract award and a BlueCare Tennessee contract. A payer must dig through press releases to learn who they serve. (VERIFIED)

**PROVIDER**

- Genuinely deep and the best-served audience on the site. The provider path is: hub → state page → compliance checklist → RFQ form → 4-step credentialing → training curriculum → portal. (VERIFIED)
- Open, pre-application self-qualification: a 6-item COMPLIANCE CHECKLIST published on every state provider page — current business license, verification of liability insurance coverage, driver credentials, current criminal background checks for all drivers, current drug screens for all owners and drivers, current motor vehicle driving report for all drivers. A prospect can disqualify themselves before filling in anything. (VERIFIED)
- The full 4-step credentialing process is published as a numbered sequence with what happens at each stage: (1) submit RFQ + driver list + vehicle list, (2) submit required business documents, (3) vehicle safety inspections + driver training, (4) NEMT provider orientation and contracting. (VERIFIED)
- Honest gating language most competitors hide: applications are reviewed to determine whether a NEED EXISTS for new providers in the applicant's region, and only then does an interview and Step 2 follow. Expectations are set before effort is spent. (VERIFIED)
- Insurance requirements published at line-item specificity: A- or better carrier, listed covered vehicles, GL policy with $1M SAM / $2M aggregate, auto liability with "All Owned, Hired, and Non-Owned" coverage, and on the DC page additionally: Verida and HSCSN named as additional insured, primary and non-contributory, 30-day notice of cancellation, and workers compensation. (VERIFIED)
- A complete training syllabus at /provider-driver-training/ across 7 domains — Customer Service (incl. HIPAA, BAAs, Title VI), Wheelchair/Stretcher (pre-trip assessment, securement of chair and occupant, hands-on), Medic First Aid/CPR/AED + bloodborne pathogens, NEMT Concepts (gatekeeping, utilization review), Sensitivity (ADA, mental health and substance abuse, conduct standards), Defensive Driving (NSC, AAA in TN, inspections, collision reporting), and Mobile Technology. (VERIFIED)
- Service modes they contract for are named explicitly: ambulatory, wheelchair, stretcher, and in some programs BLS and ALS. (VERIFIED)
- Named human owner per state/region with a direct mailto — e.g. Georgia splits into a North GA Provider Relations Manager and an Atlanta Provider Relations Manager, each with their own email; DC has a Regional Director. (VERIFIED)
- Two distinct phone lines per state page: a Transportation Provider / Provider Service Line, and a separate Claims Line (678-510-4600, press 2). (VERIFIED)
- Dedicated tech-support path for the issued hardware and portal — an isupport@verida.com mailto framed as help with iPads or the Provider Portal, plus a public /mdm/ page with AirWatch enrollment instructions and a PDF guide. (VERIFIED)
- Economic proposition stated plainly on /services/: automated trip documentation, electronic claim submission for quick payment, electronic payment option, and free mobile technology devices to contracted providers. (VERIFIED)
- Portal capability is itemized before login: complete claims information, claims submission, reports, trip manifests, forms, and other provider documentation. (VERIFIED)
- Downloadable state service-area maps identifying regions AND the Provider Relations Manager per region. (VERIFIED)
- Separate provider complaint AND provider compliment forms. (VERIFIED)
- NO published rate schedule, fee table, or payment-timing commitment; NO downloadable provider manual or contract template (the RFQ is a web form, not a PDF packet); NO searchable provider directory. (VERIFIED — absent across fetched pages)
- Quality defects in this path: /interested-providers/ contradicts /transportation-providers/ (350 vs 900 providers, 5.5M vs 5M trips) and still contains "THE SETI DIFFERENCE" and "more thatn" — unedited legacy Southeastrans copy. The Georgia page's RFQ link resolves to https://verida.com/arkansas-providers/provider-request-for-qualifications-form (a broken relative path). The DC page's portal link still points at provider.southeastrans.com. (VERIFIED)

**MEMBER**

- Deep on operational reality, entirely PHONE-FIRST, and organized by state-then-program rather than by task. (VERIFIED)
- Eligibility framed consistently and repeatedly: NEMT is for Medicaid/Medicare members who need transport to Medicaid-billable services AND have no other means of transportation. The gate is stated up front rather than buried. (VERIFIED)
- Booking lead times are explicit and differ by program — Georgia: at least 3 business days ahead, up to 30 business days out; DC/HSCSN: at least 24 business hours ahead. (VERIFIED)
- A pre-call preparation checklist ("Making Transportation Arrangements") telling the member exactly what to have ready: full name, phone, address, DOB, county; Medicaid number from the card; special needs such as oxygen or escort; emergency contact; destination address, phone, doctor name, appointment type, facility name; mobility status (walking, wheelchair, stretcher); room number for stretcher. (VERIFIED)
- "Where's My Ride?" is a first-class, separately-numbered service with a stated 15-minute-past-pickup threshold and its own per-region toll-free numbers. This is the single best member-service idea on the site. (VERIFIED)
- Hours of operation and after-hours coverage stated plainly — e.g. Georgia 7:00am-6:00pm EST M-F, DC 6:00am-6:00pm EST M-F, with urgent care trips available 24/7. (VERIFIED)
- Downloadable NEMT Rider's Guide PDF per state (GA, AR, IN, TN, LA) — a durable artifact a member can keep or print. (VERIFIED)
- Honest, expectation-setting FAQs that answer what members actually get wrong: it is a SHARED-ride service, not private; travel is limited to your home community unless the service is unavailable there; only ONE bag that must fit on your lap, "no exceptions"; one adult escort allowed for a medical reason with the same origin and destination and MUST be requested at scheduling; medical appointments only. (VERIFIED)
- Alternative modes are surfaced as member-facing options with their own flyers: public transportation vouchers and gas/mileage reimbursement, plus a dedicated /gr/ Gas Reimbursement help page. (VERIFIED)
- TNC Flex Rides (/flex/) documents a Lyft-based on-demand option in 4 concrete steps, including the real-world detail of unblocking Lyft SMS by texting STARTALL to 46080, plus a walkthrough video. (VERIFIED)
- Quality Assurance is given a named contact route — a QA phone number and a state QA mailbox (e.g. GAQA@verida.com) — separate from booking. (VERIFIED)
- Complaint AND compliment forms as separate paths, with Tennessee-specific forks; plus a general Member Feedback form at /member-contact-us/. (VERIFIED)
- County-by-county region assignment published in full for Georgia (all five regions enumerated by county with the matching phone number), plus a downloadable region map. Extremely thorough, extremely dense. (VERIFIED)
- Language access is real: a 20-language translation guide, LEP and i-Speak posters, a Spanish-language phone line per state, and Spanish Title VI notices. (VERIFIED)
- Online self-service is nearly invisible: member.verida.com is linked from exactly ONE page (/georgia-members-dch/) and only as an unlabeled image banner whose filename is still "SETI-WEBSITE-MEMBERS-1_Book Your Trip-BTN". Members in the other five programs are given no portal entry point at all. A Member App is described on the corporate page but is not linked to any app store. (VERIFIED)

**FACILITY**

- Treated as a genuine third audience with its own nav item, its own state pages, and its own artifacts — not folded into providers or members. This is the structural decision most NEMT sites get wrong. (VERIFIED)
- The pitch is administrative-burden reduction and better patient outcomes via easy-to-use online tools, aimed at discharge planners and clinic schedulers. (VERIFIED)
- A dedicated Special Services Representatives line for booking on a member's behalf (e.g. 1-866-388-9844 option 4) — a distinct route from the member line. (VERIFIED)
- Downloadable NEMT Facility Guide PDF per state (Georgia, Indiana verified) in a landscape 14x8.5 print format. (VERIFIED)
- Named Facility Outreach Manager with a direct email (e.g. La-Tonia Dixon, ldixon@verida.com, Georgia). (VERIFIED)
- The same INFO AT A GLANCE tile as members — region phone matrix, Where's My Ride numbers, Spanish line, hours, 24/7 urgent care — so a facility scheduler sees the identical operational facts the member sees. (VERIFIED)
- A booking-data checklist written from the facility's point of view ("when scheduling transportation FOR A MEMBER"), mirroring the member checklist but reframed. (VERIFIED)
- Facility Portal onboarding is explicit and gated: not self-serve signup but "register for an online account which will provide you with a personal login" via a request form at /facilit-portal-form/, after which a representative contacts you to begin enrollment. An "Already Registered? Click Here to Log on" link sits beside it. (VERIFIED)
- On the state facility pages the registration prompt is "Not Registered on the Facility Portal? Click Here to Send Request" — which resolves to a mailto:isupport@verida.com rather than to the registration form. (VERIFIED)
- Facility-specific eligibility FAQ (member must be Medicaid-eligible on the date of service and have no other transport) plus complaint and compliment forms. (VERIFIED)
- Indiana publishes a Standing Order Form PDF for recurring trips such as dialysis — a real facility workflow artifact. (VERIFIED)
- Shared Quality Assurance contact route with members (QA phone + state QA mailbox). (VERIFIED)
- Defect: /washington-d-c-facilities/ shows link text reading facility.verida.com while the actual href points to facility.southeastrans.com — visible text and destination disagree. (VERIFIED)
- NO integration content for facilities — no EMR/EHR integration, no bulk or API scheduling, no standing-order documentation outside Indiana. (VERIFIED — absent)

**COMPANY**

- Rebrand story told openly and at length on /about-verida/ — founder Steve Adams, the original Southeastrans name, the reasoning for the change, and the etymology ("Veritas" meaning truth, plus "ride"). They do not hide the old name. (VERIFIED)
- Founder-origin narrative on /verida-mission-and-vision/: career began in 1974 as an EMT in Carrollton, Georgia; purchased the ambulance company two years later; built West Georgia Ambulance Service into one of the southeast's largest minority-owned ambulance services. (VERIFIED)
- Explicit mission and vision statements as separate labelled blocks. (VERIFIED)
- Full leadership roster with photos, titles, and a dedicated bio page per person — 8 executives (President/CEO, COO, Chief Development Officer, Chief Corporate Counsel, CFO, VP Finance, VP and Controller, VP Compliance) plus a separate State Directors group for Arkansas, Georgia, Indiana, Louisiana, DC and Tennessee. (VERIFIED)
- Minority-owned status stated in the first sentence of the homepage. (VERIFIED)
- Physical corporate address published in the footer of every page: Verida, Inc., 843 Dallas Highway, Villa Rica, Georgia 30180, Office 678-510-4600. (VERIFIED)
- An unusually complete public compliance library at /title6/ — Title VI Plan, Title VI public notices in English and Spanish, Title VI complaint form, EEOC Plan and complaint form, ADA Plan and complaint form, LEP Plan and complaint form, i-Speak poster, LEP poster, and an alcohol/drug-free workplace policy — with a dedicated TitleVICoordinator@verida.com intake and a stated 180-day filing window. (VERIFIED)
- EthicsPoint-hosted anonymous ethics/compliance hotline for reporting policy violations. (VERIFIED)
- News/press archive organized by year with community-engagement items alongside contract awards; many entries still carry Southeastrans URLs and headlines. (VERIFIED)
- Careers page exists in nav, footer, and sitemap. (VERIFIED that it exists and returns content; its internal structure was not read in detail — REPORTED)
- Privacy Policy, Terms and Conditions, and a Notice of Privacy Practices / Member Rights Regarding PHI Disclosure PDF in the global footer. (VERIFIED)
- Site search is available as an icon-only expanding field in the header. (VERIFIED)
- NO investor page, NO ESG/impact report, NO annual report, NO security or HIPAA-posture page, NO office/facility list beyond the phone-number block on /contact-us/. (VERIFIED — absent)


### e. Artifacts

**Downloadable documents (16)**

- Member Rider's Guide PDF, per state — the flagship member artifact, one per program, refreshed on a visible cadence. Verified live: Georgia 2026 (VERIDA-MEMBER-RIDERS-GUIDE-GEORGIA_2026_8.5X11_DIGITAL_ENG_v2.pdf), Arkansas 2026 (…ARKANSAS-8.5x11-2026_01.28.26-DIGITAL.pdf) alongside a still-linked 2022 Arkansas edition, Indiana 2025, Tennessee 2025 (V3), Louisiana 2022. (VERIFIED)
- NEMT Facility Guide PDF, per state — landscape 14x8.5 print format. Verified: Georgia 2026 (VERIDA-FACILITY-GUIDE-GEORGIA-14X8.5-2026_PRINT_v2.pdf) and Indiana 2024. (VERIFIED)
- Business Solutions Brochure PDF — the only payer/procurement collateral on the site (VERIDA_Mini-Proposal-Design-1-SHORT-VERSION_Booklet-FINAL-11.04.22_v2.pdf), reachable ONLY from the orphaned /solutions/ page. (VERIFIED)
- State service-area map PDFs — e.g. State-Map-Georgia-Statewide-All-Regions-2026-copy.pdf (dual-purpose: shows regions to members and the Provider Relations Manager per region to providers), State-Map-Indiana-Members-Page-copy.pdf, Arkansas-large-copy.pdf. (VERIFIED)
- Gas Reimbursement flyers, per state — GAS-REIMBURSEMENT_GA_2026.pdf plus AR, LA, TN editions, and a bilingual English/Spanish Indiana flyer. (VERIFIED)
- Public Transportation flyers, per state — PUBLIC-TRANSPORTATION_GA / _AR / _LA / _TN, plus a bilingual Indiana edition. (VERIFIED)
- Civil-rights and compliance plan set (all dated 2026): Verida Inc. Civil Rights Title VI Plan (CTS), Title VI Public Notice for GA DHS CTS in English and Spanish, Verida Inc. Civil Rights Title VI Complaint Form, Verida Inc. EEOC Plan, EEOC Complaint Form, ADA Service Compliance Plan, ADA Complaint Form, Limited English Proficiency (LEP) Plan, DHS LEP Complaint Form. (VERIFIED)
- Language-access posters: i-speak-poster.pdf and LEP_Poster_2026_ENG-ESP.pdf. (VERIFIED)
- Alcohol and Drug-Free Workplace policy PDF (1301, revised 05/26/2026). (VERIFIED)
- Notice of Privacy Practices / Member Rights Regarding PHI Disclosure PDF — linked from the global footer on every page. (VERIFIED)
- Indiana Standing Order Form PDF (updated May 2026) — recurring-trip authorization for facilities. (VERIFIED)
- Verida AirWatch Device Enrollment guide PDF, linked from the public /mdm/ page. (VERIFIED)
- A 20-language Translation Guide served through the Download Monitor plugin at /download/22361/ rather than as a direct file. (VERIFIED)
- Download Monitor taxonomy exposes two document categories publicly: 'rfq' and 'indiana-town-hall' — implying a gated or semi-gated document library beyond what the pages link. (VERIFIED via /wp-sitemap-taxonomies-dlm_download_category-1.xml)
- NOT PRESENT: no provider manual, no provider contract or rate schedule PDF, no credentialing packet, no case study, no white paper, no annual/outcomes report. Everything provider-side is a web form or on-page text. (VERIFIED — absent across all fetched pages and the 106-URL page sitemap)
- NOTE: PDF URLs were enumerated from page markup and confirmed as links; the PDF contents themselves were not opened. Content descriptions above are inferred from filename and link context. (REPORTED)

**Portals (8)**

- THREE separate audience portals on dedicated subdomains, all returning HTTP 200: https://member.verida.com (member self-scheduling), https://provider.verida.com (transportation provider claims/manifests), https://facility.verida.com (facility scheduling hub). (VERIFIED)
- A FOURTH portal — the payer-facing "Client Portal" — is described in prose on /verida-mission-and-vision/ (real-time program data, individual-member and aggregate) but has NO link, URL, screenshot, or demo anywhere on the site. (VERIFIED)
- Portals are NOT in the global navigation. They appear only deep inside individual state pages, and only as decorative image banners. (VERIFIED)
- Portal coverage is wildly uneven across states: member.verida.com is linked from ONE page only (/georgia-members-dch/); provider.verida.com from three (GA, TN, DC); facility.verida.com from two (GA, DC). The other programs surface no portal at all. (VERIFIED)
- LEGACY LINK ROT: /washington-dc-providers/ still links https://provider.southeastrans.com/login.aspx?ReturnUrl=%2f and /washington-d-c-facilities/ still links https://facility.southeastrans.com — including one anchor whose VISIBLE TEXT reads facility.verida.com while the href points to facility.southeastrans.com. (VERIFIED)
- Facility Portal access is request-gated, not self-serve: /facilit-portal-form/ asks you to register for an account and states a representative will contact you to begin enrollment, with a separate "Already Registered? Click Here to Log on" link. On state facility pages the equivalent prompt ("Not Registered on the Facility Portal? Click Here to Send Request") resolves to a mailto:isupport@verida.com. (VERIFIED)
- Provider Portal access is implicitly gated behind the 4-step credentialing process; its feature set (claims info, claims submission, reports, trip manifests, forms) is described on /services/ before login. (VERIFIED)
- Supporting operational surfaces: an AirWatch MDM device-enrollment endpoint published openly at /mdm/, a member-facing /member-portal-video/ how-to, and a Member App described as mirroring the Member Portal but with no app-store link. (VERIFIED)

**Contact patterns (15)**

- PHONE IS THE PRODUCT. Every audience page leads with numbers, not forms. The organizing device is a repeated tile literally headed "INFO AT A GLANCE" with the subhead about important information at your fingertips — it appears on essentially every state page for every audience and always carries the same slot structure. (VERIFIED)
- Phone numbers are segmented on THREE axes at once — by state, by region-within-state, and by task. Georgia members alone get: Atlanta 404-209-4000, North GA 678-510-4555, toll-free 866-388-9844, Central 888-224-7981, East 888-224-7988, Southwest 888-224-7985. (VERIFIED)
- "Where's My Ride" is a distinct, separately-numbered service with its own per-region toll-free lines (Atlanta/North GA 866-388-9844 opt 2, East 866-213-6853, Central 866-429-4061, Southwest 877-972-5461) and a published 15-minute trigger. (VERIFIED)
- Task-specific lines beyond booking: Transportation Provider Line 877-236-1352 (all GA regions), DC Provider Service Line 866-991-5433, Claims Line 678-510-4600 press 2, Special Services for facilities 1-866-388-9844 option 4, Quality Assurance 678-510-4513, and a Spanish line per state. (VERIFIED)
- Hours and after-hours coverage published beside the numbers on every tile (e.g. 7:00am-6:00pm EST M-F in GA, 6:00am-6:00pm EST M-F in DC) with "Urgent Care Trips: Available 24/7". /services/ separately claims live representatives 24 hours a day, seven days a week — which sits in tension with the posted call-center hours. (VERIFIED)
- NAMED HUMANS WITH DIRECT EMAILS on nearly every state page — Andrew Tomys (Georgia State Director, atomys@), Jennifer Adkins (Washington DC Regional Director, jadkins@), Jody Boyer (North GA Provider Relations Manager, jboyer@), Tanisha Holmes (Atlanta Provider Relations Manager, taholmes@), La-Tonia Dixon (Facility Outreach Manager, ldixon@), Dena Adams-McNeish (Chief Development Officer, dadams@). Accountability has a face and a mailbox. (VERIFIED)
- Functional/departmental mailboxes: isupport@verida.com (device and portal tech support), GAQA@verida.com (Georgia quality assurance), media@verida.com (press), TitleVICoordinator@verida.com (civil-rights complaints). (VERIFIED)
- /contact-us/ is built as an INTENT ROUTER rather than a form page — four labelled doors (members needing to schedule, gas-reimbursement questions, prospective transportation providers, ethics hotline) each handing off to the right state page, with an "Other Inquiries" block for new business, member, and provider routes underneath. (VERIFIED)
- Six regional office numbers published on /contact-us/: Corporate/Georgia 678-510-4600, Arkansas 501-954-8900, Indiana 317-613-0820, Louisiana 225-726-2790, Tennessee 423-893-8282, Washington DC 202-450-5089. (VERIFIED)
- Corporate postal address in the global footer on every page (843 Dallas Highway, Villa Rica, Georgia 30180) — rendered with a typo, "Dallas Highwway", on /member-contact-us/. (VERIFIED)
- FORMS ARE SPLIT BY AUDIENCE AND BY SENTIMENT — separate complaint AND compliment forms exist for members, providers, and facilities, with Tennessee-specific member forks. Soliciting compliments as a first-class path is unusual and worth stealing. (VERIFIED)
- Other forms: a general contact form with an "I live in" state dropdown, a Member Feedback form (/member-contact-us/), the Provider Request for Qualifications form with driver and vehicle lists, the Facility Portal registration request, and a "Schedule A Conversation" form on the orphaned /solutions/ page. (VERIFIED)
- Anonymous third-party ethics hotline hosted on EthicsPoint (secure.ethicspoint.com), framed for reporting policy or standards violations in confidence. (VERIFIED)
- Language access woven into the contact layer: a 20-language translation guide in the footer, a persistent "Translate »" widget, Spanish phone lines, LEP and i-Speak posters, and Spanish-language public notices. (VERIFIED)
- The contact form's state dropdown (Alabama, Arkansas, Georgia, Indiana, Louisiana, Mississippi, South Carolina, Tennessee, Virginia, Washington) does not match the six-state footprint claimed on the homepage. (VERIFIED)

### f. Verdict table

| Ruling | Item | Reason |
|---|---|---|
| **COPY** | Audience-first primary navigation: Members / Transportation Providers / Facilities as three literal top-level doors, before any company content | VERIFIED. Three of the four nav slots are audiences, not marketing concepts. A visitor self-sorts in one click with zero interpretation. This validates our own three-door model — and note they put the audiences FIRST and company content last under a single collapsed item, rather than leading with About. |
| **COPY** | The repeated "INFO AT A GLANCE" tile — one consistently-slotted box on every state page carrying phones, hours, urgent-care coverage, the downloadable guide, and the named local contact | VERIFIED across member, provider, and facility state pages. The same slots in the same order everywhere means a returning user learns the shape once and never hunts again. It is the strongest single IA device on the entire site, and it is a content pattern rather than a design flourish — portable straight into our own state/audience pages. |
| **COPY** | Cross-audience breadcrumb strip on state pages (HOME \| GEORGIA \| MEMBERS \| TRANSPORTATION PROVIDERS \| FACILITIES) | VERIFIED. A mis-routed visitor — a facility scheduler who landed on the member page — self-corrects laterally without going back to the homepage. It also makes the state, not the audience, the unit of context, which matches how NEMT actually varies. Cheap to build, high recovery value. |
| **COPY** | Publishing the provider compliance checklist openly BEFORE any form (business license, liability insurance, driver credentials, criminal background checks, drug screens, MVR) | VERIFIED on every state provider page. It lets an unqualified prospect disqualify themselves in ten seconds and a qualified one arrive at the form already assembling documents. Respects the reader's time and filters our intake — directly applicable to /apply. |
| **COPY** | The 4-step credentialing process published as a numbered sequence with what happens at each stage, including the honest gate that applications proceed only if a NEED EXISTS in that region | VERIFIED on /provider-driver-training/ and every state provider page. Publishing the rejection condition up front is rare and builds trust; it converts an opaque black box into a legible pipeline. Note this is a claim about THEIR process — we must write our own honestly rather than mirror the steps. |
| **COPY** | A named human owner per state/region with a direct mailto, on the page itself | VERIFIED — Georgia even splits North GA and Atlanta into two separate Provider Relations Managers with distinct emails. Accountability with a face and a mailbox outperforms a generic contact form for high-stakes audiences. CAUTION: our Stage-9 gate (§7.2) bans named individuals and company theater, so we adopt the PRINCIPLE (a specific, owned route per region) via role-based mailboxes, not personal names. |
| **COPY** | "Where's My Ride?" as a first-class, separately-numbered service with a published 15-minute threshold | VERIFIED on member and facility state pages. They identified the single highest-anxiety moment in the whole product and gave it a name, its own number, and an objective trigger for when to use it. Naming the anxious moment is the insight worth stealing, independent of the phone-first delivery. |
| **COPY** | FAQs that answer the operationally awkward truths — shared-ride not private, one bag that must fit on your lap, one escort with the same origin and destination, home-community travel limits, medical appointments only | VERIFIED on /georgia-members-dch/. These are the questions that generate complaint calls, answered plainly and without softening. Setting hard expectations pre-booking is a service decision, not a copy decision, and it is exactly the register our COPY HONESTY GATE already pushes toward. |
| **COPY** | A durable downloadable artifact per state per audience — Rider's Guide for members, Facility Guide for facilities — visibly refreshed (2026 editions live) | VERIFIED (GA 2026, AR 2026, IN 2025, TN 2025 rider guides; GA 2026, IN 2024 facility guides). A printable guide survives outside the browser for a population with limited connectivity, and the visible year in the filename signals maintenance. Worth adopting even at our smaller footprint. |
| **COPY** | Separate COMPLIMENT forms alongside complaint forms, for all three audiences | VERIFIED (members, providers, facilities each have both, plus Tennessee member forks). Almost no competitor solicits positive feedback as a first-class path. It is cheap, it generates usable testimonial material, and it signals that the feedback loop is not purely defensive. |
| **COPY** | Accreditation linked to the verifying third-party registry (URAC AccreditNet directory) rather than a logo, plus PASS/CTAA linked to the certifying body | VERIFIED — the URAC claim resolves to accreditnet.urac.org and PASS to ctaa.org. A claim a reader can independently check is worth an order of magnitude more than a badge image. This is precisely the discipline our copy gate demands, and it is the one place Verida is genuinely rigorous. |
| **COPY** | A complete public civil-rights and compliance library (Title VI, EEOC, ADA, LEP plans plus four complaint forms, posters, and a 180-day filing window) with a dedicated coordinator mailbox | VERIFIED at /title6/, all documents dated 2026. For a Medicaid-adjacent business this is both a legal necessity and a trust asset, and they treat it as a real page rather than a footer afterthought. Strong precedent for giving our own compliance surface genuine weight. |
| **COPY** | Real language access — 20-language translation guide, Spanish phone lines per state, LEP and i-Speak posters, bilingual flyers, Spanish public notices | VERIFIED. This is access infrastructure, not a decorative Google Translate widget bolted on. For a Medicaid population it is table stakes done properly, and it is a category we have not yet planned for. |
| REJECT | NO sign-in anywhere in the header, footer, or mobile menu — portals buried at leaf level | VERIFIED by string search of the rendered header: zero matches for sign in / log in / portal. Returning users — the highest-intent, highest-frequency visitors — have no persistent door. Our Stage-15 pattern (Sign in as a third nav dropdown with three labelled customer doors) is strictly better than what the positioning inspiration actually ships. |
| REJECT | Portal entry points rendered as unlabeled image banners with empty alt text, one still named "SETI-WEBSITE-MEMBERS-1_Book Your Trip-BTN" | VERIFIED in the markup of /georgia-members-dch/ and /georgia-providers/. Invisible to screen readers, to link-text scanning, and to search. For a disability-heavy user base this is not a nitpick — it is a failure of the primary conversion path. Portal links must be text, always. |
| REJECT | Portal coverage inconsistent by state — member portal linked from 1 of 7 member programs, provider from 3 of 6, facility from 2 of 6 | VERIFIED by grepping every fetched state page for each subdomain. Whether you can self-serve depends on which state page you happened to land on, not on whether the capability exists. Any capability we ship must appear on every page where its audience lands, or it effectively does not exist. |
| REJECT | Stale legacy southeastrans.com portal links still live on DC pages, including an anchor whose visible text says facility.verida.com while the href points to facility.southeastrans.com | VERIFIED. Four-plus years post-rebrand, the login layer still hands users the old brand — and text/destination disagreement is a genuine trust hazard on a page that asks for credentials. Argues for a single-source constant for every portal URL (our SITE.portalLogin pattern) so a rename can never drift. |
| REJECT | Mutually contradictory scale statistics across pages — 900+ vs 350 providers, 5M vs 5.5M trips | VERIFIED: "more than 900 NEMT providers" on /transportation-providers/ against "more than 350 independent NEMT Providers" on /interested-providers/; "more than 5 million trips" on the homepage against "about 5.5 million trips" on /interested-providers/ and /provider-driver-training/. A payer evaluator who reads two pages catches this. Direct vindication of our §10.6 law: stats-band numbers are claims and must be recounted at every deploy from one source. |
| REJECT | Unsourced, undated "99.9% complaint-free rating" presented as a headline statistic | VERIFIED on the homepage stat band. No period, no denominator, no methodology, no auditor — sitting directly beside a URAC claim that IS independently verifiable, which makes the contrast worse. Exactly the class of claim our COPY HONESTY GATE forbids. |
| REJECT | The payer/MCO page (/solutions/) is orphaned — returns 200 but is linked from no nav, no footer, and none of the ~35 pages fetched | VERIFIED. Their highest-value audience — the one that signs the contract — has no navigable door, while three operational audiences each get a top-level slot. The only procurement collateral on the site sits behind that unreachable page. Our /mcos page must be a first-class nav destination. |
| REJECT | Near-total absence of payer-facing depth: no case studies, no outcomes or ROI data, no named client references, no implementation timeline, no RFP path, no security/HIPAA posture page | VERIFIED absent across all fetched pages and the full 106-URL page sitemap. A payer evaluator finds a capability LIST and an accreditation, then hits a dead end at one CDO's email address. This is the widest open gap in the category and the clearest opportunity for our own /mcos and /platform pages. |
| REJECT | Audience hub pages (/member-resources/, /transportation-providers/, /facilities/) are near-empty routers | VERIFIED — each is one paragraph plus a grid of state tiles. The click a user spends there buys almost nothing, and the pattern presumes the visitor already knows their state and plan. Our audience pages should carry real, universally-true substance and route as a secondary act, not the only one. |
| REJECT | ~30-40 dead, duplicate, and test pages left live in the public sitemap (*-archives, *-archives-2, *-archives-2a, video-test, exec-team-test, test-solutions, rfq-test-form, post-number-1..4) | VERIFIED in /wp-sitemap-posts-page-1.xml (106 URLs total). Roughly a third of the indexed surface is debris, competing for crawl budget and surfacing stale phone numbers and prices to searchers. Our ROUTE_META + sitemap generation must stay the single source, and nothing unpublished should ever reach the sitemap. |
| REJECT | Typos and unedited legacy copy in live body text — "THE SETI DIFFERENCE", "more thatn", "Dallas Highwway", "Lousiana" | VERIFIED on /interested-providers/, /member-contact-us/, and /transportation-providers/. "SETI" is the pre-rebrand acronym still shouting from a headline. Small errors compound into a credibility problem on a site whose entire pitch is operational reliability. |
| REJECT | Broken and inconsistent internal links in the highest-value conversion path — the Georgia provider RFQ CTA resolving to https://verida.com/arkansas-providers/provider-request-for-qualifications-form | VERIFIED. The RFQ links are authored as bare relative paths without a leading slash, so they resolve against whatever state page they sit on. A Georgia provider is silently routed through an Arkansas URL. Vindicates our absolute-path and single-source-route discipline. |
| REJECT | Same FAQ accordion block rendered twice on the same page | VERIFIED — /georgia-providers/ and /georgia-members-dch/ each output their full FAQ set twice (almost certainly a desktop/mobile duplicate rather than responsive CSS). It doubles page weight, duplicates content for crawlers, and creates two divergent copies to maintain. |
| REJECT | Three contradictory service-area lists — homepage says six states, /member-resources/ prose adds Mississippi, the contact form dropdown lists ten including Alabama, South Carolina and Virginia | VERIFIED across the homepage, /member-resources/, and /contact-us/. Footprint is the most basic qualifying question a visitor asks, and the site gives three different answers. Confirms our SERVICE_AREA single-constant approach and the flip-drift lesson from Stage 9. |
| REJECT | "Corporate" as the label for the company dropdown | VERIFIED in the nav markup. It is an org-chart word, not a reader's word — nobody thinks "I need the corporate section." Beside three plain-language audience labels it reads as an internal category leaking onto the page. "Company" or "About" costs nothing and means something. |
| REJECT | Everything funnels to the telephone; online self-service is barely surfaced | VERIFIED — the INFO AT A GLANCE tile leads with phone numbers on every page, and five of seven member programs offer no portal link at all. They have built member portals and a mobile app and then hidden both. The lesson is not that phone support is wrong (it is essential for this population) but that a working digital path must be given equal placement rather than buried in an alt-less banner. |

### Caveats and unverified areas

FETCH METHOD AND WHAT IT LIMITS. WebFetch returned HTTP 403 on EVERY verida.com URL including the homepage and sitemap — their WAF blocks the default agent. The agent-browser MCP tool was tried next and timed out without responding (1800s, aborted). All evidence therefore comes from curl with a standard Chrome User-Agent, which returns 200. CONSEQUENCE: I read SERVER-RENDERED HTML, not a JavaScript-executed DOM. This site runs WordPress with the Divi builder plus Divi Overlays and Divi Mega Pro plugins, and the sitemap index exposes divi_overlay and divi_mega_pro post types. Content injected client-side — modal/overlay bodies, mega-menu panels, lazily-hydrated widgets, and the Gravity/Ninja form fields behind the "JavaScript is required for this content" notice on /facilit-portal-form/ — may be under-represented in everything above. In particular, I cannot rule out that a mega-menu renders additional nav children at runtime that are absent from the static markup; the nav I report is the static #top-menu markup, which is what search engines and no-JS users see. I also could not take screenshots, so ALL design observations are inferred from markup and are deliberately minimal. COVERAGE. The page sitemap holds 106 URLs; I fetched and read roughly 35. Enumeration in pageInventory is complete for page TYPES (drawn from the full sitemap, the nav, and the footer), but per-page CONTENT claims are verified only for the pages I actually read: home, member-resources, transportation-providers, facilities, services, solutions, about-verida, verida-mission-and-vision, verida-executive-team, verida-news, contact-us, member-contact-us, facilit-portal-form, interested-providers, provider-driver-training, title6, flex, mdm, gr, and the Georgia/DC/Tennessee state pages. State pages for Arkansas, Indiana and Louisiana were downloaded and mined for links and PDFs but not read line by line — their structure is asserted by pattern-match against the states I did read, which is a reasonable inference given the site is visibly templated, but it IS an inference. The Careers page was fetched but not read; I claim only that it exists. NOT INSPECTED. I did not open a single PDF. Every document claim describes the URL, the link context, and the filename — the internal contents are NOT verified, and descriptions inferred from filenames are flagged REPORTED in the documents array. I did not authenticate to any portal; member.verida.com, provider.verida.com and facility.verida.com were confirmed only as HTTP 200 responses, so nothing about their actual feature set is verified beyond what the marketing pages claim. The Download Monitor taxonomy hints at a document library (categories 'rfq' and 'indiana-town-hall') whose full contents I could not enumerate. I did not submit any form. INFERENCE FLAGS. (1) "/solutions/ is orphaned" is a strong but bounded claim: it is unlinked from the nav, the footer, and all ~35 pages I fetched — I did not crawl all 106, so a link could exist on a page I did not read. (2) The duplicated FAQ blocks are ATTRIBUTED to a desktop/mobile markup duplicate; the duplication itself is verified, the cause is my inference. (3) The claim that provider portal access is gated behind credentialing is an inference from the absence of any registration link, not a stated policy. (4) Statistic contradictions are verified as PUBLISHED text; I make no claim about which figure is true. (5) Stat currency is unknown — several claims sit on pages whose surrounding assets date to 2020-2022, so "current" figures may simply be stale. DATE CONTEXT. Fetched 2026-08-17. Footer reads "© Copyright 2026". The most recent news entry is dated November 2024, i.e. roughly 21 months stale, while compliance PDFs and rider guides carry 2026 dates — maintenance is uneven by section rather than uniformly neglected. ATTRIBUTION DISCIPLINE. All quoted fragments are held under ~15 words and attributed to a specific URL, per the constraint. Descriptions of information architecture, categories, and depth are my own words throughout. One earlier WebSearch result summary contributed background (Villa Rica HQ, six states, member.verida.com booking) but every one of those facts was subsequently confirmed by direct fetch, so nothing in this report rests on the search summary alone.

---

## 4. SafeRide

### a. Identity line

- **Domain verification:** resolved to `www.saferidehealth.com (apex saferidehealth.com serves the same site)` — status **live-as-given**. VERIFIED: fetched https://www.saferidehealth.com/ and got a live SafeRide Health marketing homepage with full nav, footer and stats. VERIFIED: https://www.saferidehealth.com/sitemap.xml returns a live sitemap (reported as 367 URLs; ~270 enumerated in my fetch), all on the saferidehealth.com apex. VERIFIED: https://www.saferidehealth.com/robots.txt resolves and declares Sitemap: https://www.saferidehealth.com/sitemap.xml. Interior pages fetched successfully across /about, /network, /platform, /access, /visibility, /for-members, /member-health-plan, /member-health-plan/unitedhealthcare-maryland, /care-portal, /what-to-expect-nemt-provider, /contact, /contact/nemt-providers, /resources, /mileage-reimbursement-driver, /accessibility-statement and four /help-center/* trees. No redirect to another brand, no parked page, no acquisition banner. Content is self-consistently SafeRide Health and includes 2026-dated posts (/post/inc-5000-2026, /post/2026-medtech-breakthrough-award), so the company operates under this name today. NOTE (VERIFIED): the sitemap emits apex-form URLs (https://saferidehealth.com/...) while the site serves www. - a canonical-host split, not a domain move. CAVEAT: my second WebSearch (acquisition/merger check) was rate-limited and never ran, so 'not acquired/merged' is an inference from live-site evidence, not search-corroborated.
- **Self-description (short attributed fragment):** "We transform health outcomes for America's most vulnerable by ensuring access to life-sustaining healthcare." (/about, VERIFIED) — **VERIFIED** (https://www.saferidehealth.com/platform (vocabulary + operating model); https://www.saferidehealth.com/about (self-description); https://www.saferidehealth.com/network (footprint))
- **The noun they use (vocabulary finding):** THE HEADLINE FINDING: they refuse the noun "broker" for themselves and use "platform" / "solution" / "network" / "technology" instead. VERIFIED on /platform, where "broker" appears ONLY as the thing they are not - short attributed fragment: "antiquated, one-dimensional NEMT broker model" - framed as the legacy category they disrupt. Their own nouns, VERIFIED across pages: "platform" (most frequent; /access uses "ride scheduling platform"), "solution" ("best-in-class solution", "NEMT solution"), "network" ("digitized NEMT network", "Tier 1 Supplier Network"), "technology". They do NOT use "transportation manager" or "benefit manager" anywhere I fetched. REPORTED counter-signal: third parties classify them as a broker anyway - a Bambi (hibambi.com) article is titled "NEMT Broker: SafeRide Health" in search results, and their own blog slug /post/nemt-brokers-supporting-medi-cal uses "brokers" for the category. So: category = broker, self-label = platform. That gap is the entire positioning play.
- **Operating model as they state it:** They contract a third-party network; they never claim to own vehicles or employ drivers. VERIFIED on /network: they describe mobilizing NEMT, rideshare and local transportation "partners", and call the counterparties "NEMT partners", "suppliers", "transportation providers", "transportation fleets". Providers are onboarded, credentialed and tiered by SafeRide (VERIFIED /what-to-expect-nemt-provider) - broker mechanics described in platform vocabulary. The software-vs-service question is answered unusually well: /platform splits into two named engagement models (VERIFIED) - Self-Managed, where the health plan keeps its own call center and brand and merely runs on SafeRide's platform, and Fully-Managed, where SafeRide supplies the multilingual call center and end-to-end service. So they sell BOTH a technology license and a full managed benefit, and they name the difference on the URL instead of burying it in a sales call.
- **Footprint:** VERIFIED but INTERNALLY INCONSISTENT. /network: "900+ NEMT partners in 48 states", "12M+ annual rides delivered", and a third figure "6,000,000+ Ride Volume" on the same page. /access: "600+ NEMT Partners" and "12,000,000+ Rides delivered". Homepage: "12M+ rides delivered annually", "99.2% fulfillment rate", "< .25% grievance rates", "65% of all trips are to life-sustaining care", and also "9 million annual rides". Market-sizing stats on the homepage: "3.5 million appointments missed annually", "$37 billion" in no-show cost. Plan footprint is firmer and inferable: ~80 health plans enumerated on /member-health-plan (VERIFIED), UnitedHealthcare state plans dominating (~40 states of UHC alone). Notably /about - the trust page - publishes NO footprint numbers at all (VERIFIED): no states, no members, no rides, no certifications, no founding year.

### b. Nav map

| Top-level label | Dropdown children | |
|---|---|---|
| `Members` | `How rides work`, `Use the MySafeRide app`, `Pick your health plan`, `Mileage reimbursement`, `Help center`, `Support` | VERIFIED |
| `Health Plans` | `Seamless access to care`, `Built for your plan`, `Nationwide transportation network`, `Live performance data`, `Plan support`, `Talk with our team` | VERIFIED |
| `Care Providers` | `Care Portal`, `Find a member's plan`, `Provider help` | VERIFIED |
| `Drivers (NEMT)` | `Why drive with us`, `Join our NEMT network`, `About mileage reimbursement`, `Driver help` | VERIFIED |
| `Get Started` | `Member sign in`, `Driver sign in`, `Submit miles for reimbursement`, `Care Portal sign in`, `Health plan sign in`, `Download the MySafeRide app` | VERIFIED |
| `News and Insights` | `White Papers`, `Articles and Perspectives`, `Case studies`, `Company news` | VERIFIED |
| `Why SafeRide` | (no dropdown) | VERIFIED |
| `About SafeRide` | (no dropdown) | VERIFIED |
| `FOOTER COLUMN - Solutions` | `Seamless Access (/access)`, `Customizable Platform (/platform)`, `Connected Network (/network)`, `Real-Time Visibility (/visibility)` | VERIFIED |
| `FOOTER COLUMN - Support` | `For Members (/for-members)`, `Login (https://app.saferidehealth.com/)`, `Contact Us (/contact)`, `Help Center (/help-center/members)` | VERIFIED |
| `FOOTER COLUMN - Company` | `About (/about)`, `Careers (/careers)`, `Resources (/resources)` | VERIFIED |
| `FOOTER COLUMN - Get Started` | `Member Login (goes to /member-health-plan, the plan picker, NOT a login)`, `NEMT Driver Login (app.saferidehealth.com)`, `Health Plan Login (app.saferidehealth.com)`, `Gas Mileage Reimbursement (/mileage-reimbursement-driver)` | VERIFIED |
| `FOOTER COLUMN - Legal` | `Privacy Policy (/privacy-policy)`, `Terms of Service (/terms-of-service)`, `Accessibility Statement (/accessibility-statement)` | VERIFIED |

### c. Page inventory (43 distinct public page types enumerated)

**PAYER** (11)

| Page type | URL | |
|---|---|---|
| Solutions pillar 1 - Seamless Access (member-experience framing, animated ride counter) | `https://www.saferidehealth.com/access` | VERIFIED |
| Solutions pillar 2 - Customizable Platform (operating-model page; HITRUST r2, proprietary APIs, EHR integration, explicit anti-broker positioning) | `https://www.saferidehealth.com/platform` | VERIFIED |
| Product model page - Self-Managed (plan keeps its own call center and brand) | `https://saferidehealth.com/platform/self-managed` | REPORTED |
| Product model page - Fully-Managed (SafeRide supplies multilingual call center + end-to-end service) | `https://saferidehealth.com/platform/fully-managed` | REPORTED |
| Solutions pillar 3 - Connected Network (network scale, modes of transport, Tier 1 Supplier program) | `https://www.saferidehealth.com/network` | VERIFIED |
| Solutions pillar 4 - Real-Time Visibility (reporting/dashboard metric families; NO compliance claims present) | `https://www.saferidehealth.com/visibility` | VERIFIED |
| Health-plan help center - 5 FAQ categories, but no implementation, reporting, compliance, claims or escalation content | `https://www.saferidehealth.com/help-center/health-plans` | VERIFIED |
| Health-plan contact form | `https://saferidehealth.com/contact/health-plan` | VERIFIED |
| Case studies as payer proof (no-show and call-center-volume reduction; member experience and FWA limiting) | `https://saferidehealth.com/post/case-study-how-saferide-health-reduced-no-shows-by-63-and-call-center-volume-by-30-with-flexible-rides` | VERIFIED |
| State/market white-paper landings used as procurement bait (Oregon, Florida, Illinois, Ohio, Medi-Cal/CalAIM, Virginia Cardinal Care RFP, Section 1115 waivers) | `https://saferidehealth.com/post/white-paper-from-fragmentation-to-access-rethinking-nemt-in-oregon` | VERIFIED |
| Investor/credibility press posts (Series A/B/C, SCAN investment, HITRUST certification + 2025 renewal, Deloitte Fast 500 #84, Inc. 5000, board appointments) | `https://saferidehealth.com/post/saferide-health-platform-secures-hitrust-certification` | VERIFIED |

**PROVIDER** (7)

| Page type | URL | |
|---|---|---|
| Provider join / 'what to expect' page - 5-stage onboarding, insurance minimums, driver check list, embedded form anchor (#form), 2 PDFs | `https://www.saferidehealth.com/what-to-expect-nemt-provider` | VERIFIED |
| NEMT provider help center - only 2 FAQ categories (Account Management, Ride Management), operational only | `https://www.saferidehealth.com/help-center/nemt-companies` | VERIFIED |
| NEMT provider contact page - bounces to the /what-to-expect-nemt-provider#form anchor rather than hosting a form | `https://www.saferidehealth.com/contact/nemt-providers` | VERIFIED |
| Tier 1 Supplier Network overview asset | `https://saferidehealth.com/post/saferide-tier-1-supplier-network-overview` | VERIFIED |
| 'What to expect: SafeRide Tier 1 Supplier Network' asset | `https://saferidehealth.com/post/what-to-expect-saferide-tier-1-supplier-network` | VERIFIED |
| Gas mileage reimbursement driver page - friends/family driver enrollment, plan dropdown to per-plan portal, published turnaround times | `https://www.saferidehealth.com/mileage-reimbursement-driver` | VERIFIED |
| NEMT industry survey report landings (2023 + 2024) | `https://saferidehealth.com/post/nemt-survey-report-2024` | VERIFIED |

**MEMBER** (7)

| Page type | URL | |
|---|---|---|
| Member hub 'For Members' - 5-step how-it-works, 3 service tiers (NEMT / NMT / Personal Reimbursement), FAQ block | `https://www.saferidehealth.com/for-members` | VERIFIED |
| Health-plan picker / eligibility front door - ~80 plans, alphabetical, no search box, 'Select Health Plan' | `https://www.saferidehealth.com/member-health-plan` | VERIFIED |
| Per-plan member landing pages x~80 (/member-health-plan/<plan>) - each carries a plan-specific phone number, MySafeRide web login, App Store + Google Play links | `https://www.saferidehealth.com/member-health-plan/unitedhealthcare-maryland` | VERIFIED |
| Member help center - 5 FAQ categories (MySafeRide Member App, SafeRide Definitions, Booking a Ride, Ride Logistics, Ride Troubleshooting & After the Ride) | `https://www.saferidehealth.com/help-center/members` | VERIFIED |
| MySafeRide app page | `https://saferidehealth.com/mysaferide` | REPORTED |
| MySafeRide member app overview one-pager asset | `https://saferidehealth.com/post/saferide-mysaferide-member-app-overview` | VERIFIED |
| Co-branded short-slug campaign landings x~21 running PARALLEL to /member-health-plan/* (/driscoll, /buckeye, /sunflower, /meridian, /scan, /humana, /humana-medicaid, /caresource, /silversummit, /community-first, /texas-childrens, /priority-health-plan, /molina-tx, /united-group-retiree, /united-kansas-medicaid, /united-virginia-medicaid, /united-texas-medicaid, /united-dc-medicaid, /united-massachusetts-medicaid, /united-florida, /texas) | `https://saferidehealth.com/driscoll` | VERIFIED |

**FACILITY** (4)

| Page type | URL | |
|---|---|---|
| Care Portal product page - facility booking tool: rosters, eligibility verification, reports, 3 tutorial videos, 30+ FAQ | `https://www.saferidehealth.com/care-portal` | VERIFIED |
| Care provider help center - 4 FAQ categories (SafeRide Definitions, Getting Started, Ride Booking, Ride Troubleshooting) | `https://www.saferidehealth.com/help-center/care-providers` | VERIFIED |
| Care provider contact form | `https://saferidehealth.com/contact/care-providers` | VERIFIED |
| Care Portal overview one-pager asset | `https://saferidehealth.com/post/saferide-care-portal-overview` | VERIFIED |

**COMPANY-GENERAL** (14)

| Page type | URL | |
|---|---|---|
| Home | `https://www.saferidehealth.com/` | VERIFIED |
| About - mission, 4 core values, 7-exec leadership grid with photos; no numbers, no certifications, no investors, no founding year | `https://www.saferidehealth.com/about` | VERIFIED |
| Careers | `https://saferidehealth.com/careers` | REPORTED |
| Contact router - audience-selection buttons only, no form and no phone on the router itself | `https://www.saferidehealth.com/contact` | VERIFIED |
| Resources hub with type filters (All / Blogs / Case Studies / White Papers / Press Releases / Webinars / One Pagers) | `https://www.saferidehealth.com/resources` | VERIFIED |
| Resource type indexes x6: /resources/blogs, /case-studies, /white-papers, /press-releases, /webinars, /one-pagers | `https://saferidehealth.com/resources/white-papers` | VERIFIED |
| Article/asset detail pages - ~130 under /post/*; blogs, white-paper landings, case studies, one-pagers, webinars and press releases ALL share one flat /post/ namespace | `https://saferidehealth.com/post/nemt-reform-white-paper` | VERIFIED |
| Privacy Policy | `https://saferidehealth.com/privacy-policy` | VERIFIED |
| Terms of Service | `https://saferidehealth.com/terms-of-service` | VERIFIED |
| Terms of Service - payer-specific variant, implies contract-driven legal forks per plan | `https://saferidehealth.com/terms-of-service/uhc` | VERIFIED |
| Accessibility Statement - partial WCAG 2.1 AA conformance claim + compliance@ remediation channel | `https://www.saferidehealth.com/accessibility-statement` | VERIFIED |
| Gated-asset thank-you page - evidence at least one download is form-gated | `https://saferidehealth.com/thank-you-nemt-industry-survey-2023` | VERIFIED |
| CMS LEAK: internal component staging page published in the sitemap | `https://saferidehealth.com/menu-component-workarea` | VERIFIED |
| CMS LEAK: unrenamed duplicate page in the sitemap (/copy-meridian-...-copy) | `https://saferidehealth.com/copy-meridian-health-plan-gas-mileage-reimbursement-program-copy` | VERIFIED |


### d. Information categories by audience

**PAYER**

- Operating model is NAMED, not hidden: two explicit engagement products - Self-Managed (plan keeps its call center and brand) and Fully-Managed (SafeRide runs a multilingual call center end-to-end) - each with its own URL and stated 'best for' criteria (limited internal resources, multi-state programs, rural populations). (VERIFIED /platform)
- Solution surface is split into four named pillars with four URLs - Seamless Access, Customizable Platform, Connected Network, Real-Time Visibility - mirrored exactly in the footer Solutions column. (VERIFIED /platform, /access, /network, /visibility, homepage footer)
- Compliance posture: HITRUST r2 certification and HIPAA-compliant integrations, stated on the platform page and reinforced by three press posts (initial certification, platform certification, 2025 renewal). NO SOC 2 claim found anywhere. (VERIFIED /platform + sitemap slugs)
- Compliance is MISPLACED: /visibility - the page a payer reads to evaluate data handling and reporting - carries no HITRUST, HIPAA or SOC 2 mention at all. (VERIFIED /visibility)
- Network claims contradict across pages: '900+ NEMT partners in 48 states' on /network vs '600+ NEMT Partners' on /access. (VERIFIED both pages)
- Outcome/performance stats live on the HOMEPAGE, not on the payer pages: 99.2% fulfillment rate, <.25% grievance rate, 65% of trips to life-sustaining care. (VERIFIED homepage)
- Reporting depth is described by metric family rather than by screenshot: member experience (ride counts, ratings, cost, grievance rate, utilization), transportation network (on-time performance, cancellation vs completion, driver/vehicle efficiency), service delivery (call-center quality, speed of answer, complaint resolution velocity). (VERIFIED /visibility)
- Integration story is asserted but undocumented: 'proprietary APIs' integrating with EHRs and member eligibility databases, with no named integration partners, no technical docs and no API reference published. (VERIFIED /platform)
- Case-study proof exists but sits in the flat /post/ blog namespace rather than a payer-facing proof section, so it competes with culture blogs for attention. (VERIFIED /resources + sitemap)
- Procurement bait is deliberate and state-targeted - white papers keyed to named state programs and live RFPs (Oregon, Florida, Illinois, Ohio Next Generation, Medi-Cal/CalAIM, Virginia Cardinal Care RFP goals, Section 1115 waivers). This is the strongest payer play on the site. (VERIFIED sitemap + /resources + /network)
- Pilot/RFP path is soft: 'Get a Demo' / 'Book a Demo' buttons and a 'Request an intro call, demo, or proposal' link into /contact/health-plan. No public RFP portal, no procurement packet, no pricing. (VERIFIED /platform, /visibility, /contact)
- Credibility signalled via awards and funding press rather than client logos: Series A/B/C, SCAN Health Plan investment, Deloitte Technology Fast 500 (#84), Inc. 5000, Forbes Best Startup Employers, USA Today Top Workplaces, board appointments. (VERIFIED sitemap)
- Named payer relationships are inferable from the ~80-plan member directory and co-branded landings (UnitedHealthcare across ~40 states, Humana, Molina, CareSource, Kaiser, Aetna, SCAN, Superior, Driscoll) - the plan picker doubles as an unlabelled client list. (VERIFIED /member-health-plan)
- The health-plan help center answers NONE of the payer-evaluator questions: no implementation/onboarding guidance, no reporting how-to, no compliance section, no claims or utilization procedure, no escalation matrix. It reads as a copy of the member ride FAQ. (VERIFIED /help-center/health-plans)
- Absent everywhere I fetched: SLA table, pricing, contract terms, coverage map, state-by-state license or certification list. (VERIFIED by absence across /platform, /network, /visibility, /access)

**PROVIDER**

- Join process is published as an explicit 5-stage journey BEFORE any form: Getting Started, Credentialing Process, Delivering Rides, Becoming Tier 1 Provider, Ongoing Partnership. (VERIFIED /what-to-expect-nemt-provider)
- Insurance minimums are stated in public, in numbers - minimum $1M CGL per occurrence, minimum $2M CGL aggregate, minimum $500K auto liability, SafeRide named as additional insured. Unusually concrete for a NEMT site. (VERIFIED /what-to-expect-nemt-provider)
- Driver credentialing list is itemised: driver's license and social security information, national background check, national sex offender registry check, motor vehicle report, pre-hire drug screening. (VERIFIED /what-to-expect-nemt-provider)
- Driver training requirements are itemised: first aid / CPR / AED, defensive driver training, wheelchair securement training. (VERIFIED /what-to-expect-nemt-provider)
- Vehicle requirements are thin by comparison - registration and insurance documentation only; no vehicle age, mileage, inspection or lift-certification standard published. (VERIFIED /what-to-expect-nemt-provider)
- Tier 1 Supplier Network is a named performance program with stated benefits: priority access to ride volume, automated claims submission, guaranteed payment turnaround, dedicated account manager, vehicle and driver compliance support. (VERIFIED /network)
- An earnings claim of up to ~$380,000 annually for high-volume providers circulates in search summaries of their provider pages; I did not see this figure in any page body I fetched. (REPORTED, search-result summary only)
- Payment mechanics are a HOLE: the join page does not explain claims submission, rate structure or payment turnaround, and the provider help center contains zero payment or claims questions. 'Guaranteed payment turnaround' is asserted on /network with no number attached. (VERIFIED by absence)
- Credentialing is a SECOND HOLE in support: the provider help center has only Account Management (driver authentication, dispatcher setup, mobile app access) and Ride Management (accept, cancel, add notes, service, assign driver) - no credentialing questions at all. (VERIFIED /help-center/nemt-companies)
- Portal/app instructions ARE deep - extensive step-by-step guidance for the driver app and dispatcher accounts. Operations are documented; economics are not. (VERIFIED /help-center/nemt-companies)
- Two provider PDFs are offered before the form: a 'what it's like to work with SafeRide Health' overview and a Tier 1 Provider Program explainer. Tier 1 benefit detail is deferred INTO the PDF rather than shown on the page. (VERIFIED /what-to-expect-nemt-provider)
- Provider contact is a single national line plus a shared inbox - (855) 955-7433 and team@saferidehealth.com - with no named regional or network-development contact. (VERIFIED /help-center/nemt-companies, /contact/nemt-providers)
- A separate, well-signposted lane exists for INDIVIDUAL drivers (friends/family), distinct from fleet companies: gas mileage reimbursement enrollment with a plan dropdown, required docs (driver's license, vehicle insurance, digital attestation), member name + Medical ID, and published processing times of ~72 hours online vs ~5 business days by email/fax. (VERIFIED /mileage-reimbursement-driver)
- Reimbursement RATES are explicitly not published - drivers are told to ask the health plan directly; rates, appeal processes and eligibility vary by state and plan. (VERIFIED /mileage-reimbursement-driver)
- NEMT industry survey reports (2023, 2024) are used as provider-side thought leadership and lead capture. (VERIFIED sitemap + /resources)
- No provider manual, rate/fee schedule, credentialing packet or checklist PDF found anywhere. (VERIFIED by absence)

**MEMBER**

- The member front door is a HEALTH-PLAN PICKER, not a booking form - eligibility is plan-scoped, so the site makes you identify your plan first. ~80 plans, alphabetical, no search box, headings 'Find the right health plan' and 'Select Health Plan'. (VERIFIED /member-health-plan)
- Each per-plan child page is a tight, high-utility card: a plan-specific phone number (e.g. 866-244-3123 for UnitedHealthcare Maryland), a MySafeRide web login, and App Store + Google Play links. (VERIFIED /member-health-plan/unitedhealthcare-maryland)
- But those per-plan pages carry NO eligibility rules, NO ride limits, NO hours of operation and NO advance-notice requirement - the plan-specific facts a member most needs are exactly what the plan-specific page omits. (VERIFIED /member-health-plan/unitedhealthcare-maryland)
- How-to-book is published as a 5-step narrative: check eligibility and get registered, secure your ride, track your ride, meet your driver, ride - with call-center backup. (VERIFIED /for-members)
- First-time members CANNOT self-serve: a member with no prior SafeRide history must call the plan-specific line and answer verification questions before a MySafeRide account can be created. (VERIFIED /for-members)
- Booking inputs are named up front: first name, last name, Member ID, date of birth, plus appointment details and medical needs. (VERIFIED /for-members)
- Advance-notice rule published: 2+ days notice to book; NEMT changes are easy 3+ days out, and inside 3 days you must phone the plan line; rideshare can be changed anytime. (VERIFIED /help-center/members, /for-members)
- Wait-time expectations published in MINUTES: ~5 minutes for rideshare, ~15 minutes for NEMT vehicles in most cases - rare and useful, and carefully hedged so it is not an SLA. (VERIFIED /for-members)
- Service levels are named in member-readable language: ambulatory, wheelchair, bariatric, stretcher/gurney, two-person assist, BLS/ALS - plus non-medical modes (rideshare, taxi, livery, bus, train) and personal reimbursement (mileage, meals, lodging, airfare). (VERIFIED /network, /help-center/members)
- Companion and service-animal policy published: one additional person permitted for the duration of the ride; service animals under ADA. (VERIFIED /for-members)
- Cost expectation stated conditionally and honestly - no out-of-pocket while within your plan's maximum eligible rides, with plans varying on hard stops at the limit. (VERIFIED /for-members)
- Ride tracking described concretely: text and voice alerts carrying vehicle details, arrival time and driver information. (VERIFIED /for-members)
- COMPLAINT PATH DEAD-ENDS: members are told to file complaints with their health plan directly and SafeRide receives them relayed - while positive feedback is collected by SafeRide itself via post-ride text survey and call center. They take praise directly and route grievances away. (VERIFIED /for-members, /help-center/members)
- Member help center is structured by member mental model, not org chart: MySafeRide Member App / SafeRide Definitions / Booking a Ride / Ride Logistics / Ride Troubleshooting & After the Ride. (VERIFIED /help-center/members)
- One national member line - (855) 955-7433 - but the site repeatedly steers members to the plan-specific number instead. NO member email address is published anywhere. (VERIFIED /help-center/members)
- A parallel set of ~21 short-slug co-branded landings (/driscoll, /buckeye, /scan, /humana...) duplicates the /member-health-plan/* set, presumably for print, IVR or plan-material URLs. (VERIFIED sitemap)

**FACILITY**

- Care Portal is a NAMED PRODUCT with its own page, aimed at care coordinators, discharge planners and case managers at hospitals, clinics, nursing homes and dialysis centers. (VERIFIED /care-portal)
- Published capability list is concrete and operational: book one-way or round-trip rides, track ride status in real time, manage member rosters, open member profiles with ride history and eligibility, verify benefit structure, run performance reports. (VERIFIED /care-portal)
- Eligibility verification is offered to the FACILITY - member profiles expose eligibility detail and benefit structure - a capability the member-facing pages never surface that plainly. (VERIFIED /care-portal)
- Access is explicitly NOT self-serve: a facility submits a Care Portal interest form, then a named role - a 'SafeRide Facilities Relationship Manager' - contacts them to set up designated admins and accounts. (VERIFIED /care-portal)
- The interest form is hosted on a raw third-party Atlassian Jira Service Desk URL (saferidehealth-facilities.atlassian.net/servicedesk/customer/portals) - an off-brand hand-off in the middle of the onboarding path. (VERIFIED /care-portal)
- Training is video-first: three tutorials covering account activation, portal navigation and member management, plus a link out to a larger Wistia tutorial library. No downloadable manual. (VERIFIED /care-portal)
- A 30+ question FAQ sits on the product page itself, with a separate thinner help center (SafeRide Definitions / Getting Started / Ride Booking / Ride Troubleshooting). (VERIFIED /care-portal, /help-center/care-providers)
- Facility support has a dedicated TECHNICAL inbox distinct from the general one - support@saferidehealth.com alongside team@saferidehealth.com and (855) 955-7433 - plus a 'dedicated Customer Success team member' for live accounts. (VERIFIED /help-center/care-providers)
- Facility-side gaps: no written roster-management instructions, no downloadable guides, no published turnaround for a facility-placed ride request, no discharge-timing workflow content. (VERIFIED by absence /help-center/care-providers)
- A Care Portal overview one-pager exists in the resource library. (VERIFIED sitemap /post/saferide-care-portal-overview)

**COMPANY**

- About page is text-led and unusually empty for a venture-backed company: mission, four core values, a seven-person leadership grid with photos - and no numbers, no certifications, no investors, no founding year. (VERIFIED /about)
- All quantitative credibility is displaced from /about onto the homepage and /network, so the trust page carries the least trust content on the site. (VERIFIED /about vs homepage)
- Careers is a distinct company page, heavily fed by employer-brand posts (USA Today Top Workplaces, Forbes Best Startup Employers, Best Places to Work LA, San Antonio Express-News, 'what makes a workplace culture work'). (REPORTED - /careers not fetched; VERIFIED post slugs in sitemap)
- Legal set is three pages - Privacy Policy, Terms of Service, Accessibility Statement - plus a payer-specific ToS variant at /terms-of-service/uhc, implying contract-driven legal forks per plan. (VERIFIED sitemap + footer)
- Accessibility Statement claims PARTIAL conformance with WCAG 2.1 Level AA and openly says some content does not fully conform, with a named remediation channel (compliance@saferidehealth.com) and a required report format: name, barrier description, page URL, contact info. Honest and actionable. (VERIFIED /accessibility-statement)
- Content operation is large and sustained: ~130 /post/ articles spanning policy analysis (CMS rules, Section 1115 waivers, Medicaid redetermination, Star Ratings, MA final rule), state programs, product overviews, funding and awards - dated through 2026. (VERIFIED sitemap)
- A rebrand is publicly narrated (/post/why-we-rebranded-a-new-identity-for-saferide-health, /post/what-our-brand-pillars-mean-to-us) - they treat brand positioning itself as publishable content. (VERIFIED sitemap)
- No public HQ address, no mailing address and no general corporate phone on /contact, despite a headquarters-announcement blog post existing. (VERIFIED /contact + sitemap)
- Sitemap hygiene is poor: an internal component staging page (/menu-component-workarea) and an unrenamed duplicate (/copy-...-copy) are both indexed. (VERIFIED sitemap)
- Canonical-host split: the sitemap emits apex saferidehealth.com URLs while the site serves www.saferidehealth.com. (VERIFIED sitemap vs live fetches)


### e. Artifacts

**Downloadable documents (13)**

- 'What it's like to work with SafeRide Health' - provider-facing PDF offered on the join page, ahead of the form (VERIFIED, /what-to-expect-nemt-provider)
- 'About our Tier 1 Provider Program' - PDF carrying the Tier 1 benefit detail the page itself withholds (VERIFIED, /what-to-expect-nemt-provider)
- White papers, state/program-targeted - Oregon ('From Fragmentation to Access'), Florida ('Access Delivered'), Illinois Medicaid, 'The Case for NEMT Reform', Medicaid redetermination opportunities, Medicaid technology/regulatory, State of Transportation for Medicaid Managed Care, '5 Trends Impacting Medicare Advantage in 2026' (VERIFIED, /resources + /network + sitemap)
- One-pagers, product and segment - SafeRide Medicaid Solutions, SafeRide Medicare Advantage Solutions, SafeRide Special Needs Plans Solutions, MySafeRide Member App Overview, Care Portal Overview, Fully-Managed Product Overview, Self-Managed Product Overview, Tier 1 Supplier Network Overview (VERIFIED, /resources + sitemap slugs)
- Case studies - no-show reduction and call-center-volume reduction with flexible rides; member experience and FWA limiting (VERIFIED, sitemap + /resources)
- NEMT Industry Survey reports, 2023 and 2024 editions - the 2023 edition has a /thank-you-nemt-industry-survey-2023 page, so at least that one is form-gated (VERIFIED, sitemap)
- On-demand webinars x3 - changing payer landscape, member-experience best practices, D-SNP NEMT benefits (VERIFIED, sitemap + /resources)
- Infographic asset (/post/infographic-nemt) and a '10 facts about NEMT' explainer (VERIFIED, sitemap)
- Gas Mileage Reimbursement registration form + 'Gas Mileage Reimbursement Information Request Form', submittable online, by email or by mail (VERIFIED, /mileage-reimbursement-driver)
- Care Portal tutorial videos x3 (account activation, portal navigation, member management) plus a larger Wistia-hosted tutorial library (VERIFIED, /care-portal)
- MySafeRide member app on Apple App Store and Google Play, plus a web equivalent for members without a smartphone (VERIFIED, /member-health-plan/unitedhealthcare-maryland, homepage nav)
- NOT FOUND anywhere I fetched: provider manual, rate/fee schedule, credentialing packet or checklist PDF, SLA document, security whitepaper, API reference (VERIFIED by absence)
- Gating status of the main library is only partly known: the /resources listing showed no email wall on the links themselves, but I never attempted a download (REPORTED)

**Portals (8)**

- member.saferidehealth.com/welcome - member portal, on its OWN subdomain, separate from every other door (VERIFIED, /for-members)
- app.saferidehealth.com/login - ONE shared host serving three different audiences: NEMT driver, Care Portal (facility) and health plan sign-in (VERIFIED, /for-members, /care-portal, footer)
- app.saferidehealth.com - the bare footer 'Login' target (VERIFIED, homepage footer)
- saferidehealth-facilities.atlassian.net/servicedesk/customer/portals - facility access-request intake on a raw third-party Jira Service Desk (VERIFIED, /care-portal)
- MySafeRide app - iOS App Store and Google Play, plus a web version (VERIFIED, /member-health-plan/unitedhealthcare-maryland)
- Per-plan gas mileage reimbursement portals, reachable only after selecting a plan from a dropdown - no direct URL published (VERIFIED, /mileage-reimbursement-driver)
- Wistia-hosted tutorial library for Care Portal training (VERIFIED, /care-portal)
- info.saferidehealth.com - a separate SafeRide marketing/landing subdomain surfaced in search results; not fetched, purpose inferred (REPORTED)

**Contact patterns (11)**

- /contact is a pure AUDIENCE ROUTER with no form and no phone on it - six options: 'Member', 'Health Plan', 'NEMT Provider', 'Care Provider', 'Other', 'Gas Mileage Reimbursement Driver' (VERIFIED, /contact)
- Four dedicated contact children behind the router: /contact/health-plan, /contact/nemt-providers, /contact/care-providers, /contact/other (VERIFIED, sitemap + /contact)
- ONE national phone number reused across every audience help center: (855) 955-7433 (VERIFIED, /help-center/members, /help-center/nemt-companies, /help-center/care-providers, /help-center/health-plans, /contact/nemt-providers)
- PER-PLAN member phone numbers are the real member contact layer - each of the ~80 /member-health-plan/* pages publishes its own number under a 'Phone Number' heading (e.g. 866-244-3123, UnitedHealthcare Maryland). This is how they handle 48-state number sprawl without listing 80 numbers anywhere (VERIFIED, /member-health-plan/unitedhealthcare-maryland)
- Three role-scoped email addresses: team@saferidehealth.com (general, provider, facility, health plan), support@saferidehealth.com (facility technical), compliance@saferidehealth.com (accessibility barrier reports) (VERIFIED, /help-center/* and /accessibility-statement)
- No mailing address and no corporate switchboard published on /contact (VERIFIED, /contact)
- Provider intake is a FORM, not an inbox - embedded at /what-to-expect-nemt-provider#form with the confirmation line 'A team member will get in touch with you shortly'; the dedicated /contact/nemt-providers page merely links back to that anchor (VERIFIED, /what-to-expect-nemt-provider, /contact/nemt-providers)
- Facility intake is a form on someone else's domain (Atlassian Jira) followed by a named human, the 'SafeRide Facilities Relationship Manager' (VERIFIED, /care-portal)
- Payer intake is demo-led - 'Get a Demo' / 'Book a Demo' plus 'Request an intro call, demo, or proposal' into /contact/health-plan (VERIFIED, /platform, /visibility)
- Members are steered to phone, not email - no member email address is published anywhere, and grievances are routed to the health plan rather than to SafeRide (VERIFIED, /help-center/members, /for-members)
- Provider form FIELDS could not be enumerated - the form did not render in my fetch, so whether they ask fleet size, states served, vehicle types or NPI is UNKNOWN (NOT VERIFIED)

### f. Verdict table

| Ruling | Item | Reason |
|---|---|---|
| **COPY** | Health-plan picker as the member front door, with per-plan child pages carrying a real phone number + app links | The single best structural idea on the site. NEMT eligibility is plan-scoped, so 'which plan are you on' is the correct first question - it converts an unanswerable 'am I eligible?' into a one-click routing decision, scales to 48 states without a wall of phone numbers, and quietly doubles as a client list. Our /members page should adopt this shape for DC/MD/VA plans: pick your plan, get your number. (VERIFIED /member-health-plan, /member-health-plan/unitedhealthcare-maryland) |
| REJECT | Per-plan pages published WITHOUT eligibility rules, ride limits, hours or advance-notice requirements | They built the perfect routing page and then stripped the plan-specific facts out of it. A member reaching the UnitedHealthcare Maryland page learns a phone number and nothing about whether they qualify, how many rides they get, or how far ahead to book. If we build plan pages, each must answer eligibility, limit, notice window and hours - otherwise it is a phone-number redirect wearing a page's clothes. (VERIFIED /member-health-plan/unitedhealthcare-maryland) |
| **COPY** | Sign-in exposed as a four-door nav dropdown with a purpose gloss per door | Independently validates our Stage-15 sign-in dropdown decision and goes one better: each door carries a short 'what you do here' line, so a facility coordinator never has to guess whether they are the member or the provider. Their split is member/driver/care portal/health plan; ours is member/provider/care portal. The gloss lines are the upgrade worth taking. Their nav-vs-footer label drift ('sign in' vs 'Login') is the part to avoid. (VERIFIED homepage nav + footer) |
| **COPY** | Publishing concrete provider requirements - $1M/$2M CGL, $500K auto liability, named background checks, named training - in public, before the form | Real information depth that self-qualifies applicants: a fleet owner can decide in thirty seconds whether to bother. Most NEMT sites make you fill in a form to learn the bar. Our /apply page should publish the actual requirement list rather than a vague 'credentialing required'. Constraint under our copy gate: publish only requirements we will genuinely enforce, because an unenforced number is a claim. (VERIFIED /what-to-expect-nemt-provider) |
| REJECT | Provider help center with zero credentialing, payment or claims answers | Their provider FAQ has exactly two categories - Account Management and Ride Management - both about operating the app. The two questions every NEMT owner actually asks (how do I get credentialed, and when do I get paid) are answered nowhere, while 'guaranteed payment turnaround' is asserted on /network with no number behind it. Our provider surface should answer money and credentialing first, app mechanics second. (VERIFIED /help-center/nemt-companies, /network) |
| **COPY** | Audience-segmented help centers - four separate FAQ trees at /help-center/{members,nemt-companies,care-providers,health-plans} | Four URLs, four mental models, no mixed FAQ soup, each linkable from that audience's nav and contact route. The structure is right even where their content is thin. Worth adopting as our help IA. Caveat proven by their own site: the health-plan tree is a near-copy of the member ride FAQ, so the structure only pays if each tree gets genuinely different content. (VERIFIED all four) |
| **COPY** | Contact page as a pure audience router with no form on it | Six labelled doors, each to a purpose-built child page, with members pushed toward the plan picker and help center rather than into a generic inbox. This matches our /contact routing-cards pattern and confirms the instinct - routing beats one big form when audiences need different fields. (VERIFIED /contact) |
| **COPY** | Naming the engagement model publicly: Self-Managed vs Fully-Managed as two separate product pages | Most competitors hide 'do you run the call center or do we' until a sales call. Publishing both models with stated 'best for' criteria lets a payer self-select and makes the company look confident about its boundaries. Directly relevant to our UNDECIDED operating-model flag: when we decide, we should name the model on a page rather than imply it. (VERIFIED /platform) |
| REJECT | The same partner/ride numbers contradicting each other across pages - '900+ partners' on /network vs '600+' on /access; 12M vs 9M vs 6M rides | Live proof of exactly the failure our stats-are-claims-recount-at-deploy law exists to prevent. The numbers drifted because different pages were written at different times and nobody recounted. Any number we publish needs one source of truth and a recount gate, or we ship the same contradiction on a smaller site. (VERIFIED /network vs /access vs homepage) |
| REJECT | Routing member grievances away to the health plan while collecting praise directly | Members are told to file complaints with their plan and SafeRide only receives them relayed, while SafeRide collects positive feedback itself via post-ride text survey and call center. The asymmetry is bad faith on its face and worse for a vulnerable rider stranded with no idea who to call. We should publish a direct complaint path we actually staff. (VERIFIED /for-members, /help-center/members) |
| **COPY** | Publishing wait-time expectations as actual minutes (~5 rideshare, ~15 NEMT) and a 2-day booking notice | Rare and genuinely useful - it sets an expectation a rider can hold the service to. Note the careful hedging ('in most cases') that keeps it from hardening into an SLA. That hedge is the technique: give the number, scope the number. Only viable for us once we have real operating data, and it must not read as a service guarantee under our no-SLA rule. (VERIFIED /for-members) |
| REJECT | HITRUST/compliance posture appearing only on /platform and in blog posts, absent from /visibility | The page a payer opens to evaluate data handling and reporting carries no security or compliance claim at all. The certification is their strongest payer asset and it is filed under the wrong page. Compliance belongs wherever data is discussed, not only where the sales pitch lives. (VERIFIED /visibility vs /platform) |
| REJECT | Handing facilities off to a raw third-party Jira Service Desk URL as the onboarding path | A hospital discharge planner clicks 'Get Started' and lands on saferidehealth-facilities.atlassian.net - off-brand, unexpected, and it reads as a phishing hop to anyone security-trained inside a hospital. Facility intake should stay on our own domain even when a ticketing system sits behind it. (VERIFIED /care-portal) |
| **COPY** | Gas mileage reimbursement given its own audience lane, nav slot, page and enrollment flow | The friend-or-family driver is a real, distinct audience most NEMT sites bury inside a member FAQ. They gave it a nav slot, a page, per-plan portals, a required-document list and published processing times (~72h online vs ~5 business days by email). Cheap to build, high-relief for the person who needs it. (VERIFIED /mileage-reimbursement-driver) |
| REJECT | An /about page with no footprint numbers, no certifications, no founding facts | For a venture-backed company with HITRUST certification, Series C funding and 48-state coverage, a trust page carrying only a mission line, four values and seven headshots is a wasted surface - every credibility fact lives somewhere else. Our /about already leads with story and principles plus a facts card; their gap validates that instinct, and the facts card is the differentiator to keep. (VERIFIED /about) |
| **COPY** | Ungated resource library with type filters (All / Blogs / Case Studies / White Papers / Press Releases / Webinars / One Pagers) | Filterable by artifact type, each type also having its own index URL, with no visible email wall on the listing - low friction for an evaluator doing due diligence at 11pm. The one structural mistake to avoid: they dump every asset type into one flat /post/ namespace, so a white paper and a company-culture blog share a URL shape and compete against each other. (VERIFIED /resources, sitemap) |
| **COPY** | Publishing state- and RFP-targeted white papers (Oregon, Florida, Illinois, Ohio, Medi-Cal, Virginia Cardinal Care RFP) | The sharpest payer play on the site - content aimed at named state programs and live procurements, which is how you get read by the people writing the RFP. Directly transferable: DC/MD/VA program-specific pieces are our equivalent, and our geography is narrow enough to cover properly rather than superficially. (VERIFIED sitemap, /network) |
| REJECT | Indexing CMS junk in the sitemap - /menu-component-workarea and /copy-...-copy | An internal component staging page and an unrenamed duplicate are both publicly crawlable. Combined with a sitemap that emits apex URLs while the site serves www, this is sloppy hygiene across ~367 URLs. Our QA sweep should assert that every sitemap URL is intentional and canonical-host-correct. (VERIFIED sitemap) |
| **COPY** | Refusing the noun 'broker' and self-labelling as a platform while operating broker mechanics | Ruled COPY on the technique, not on deception. They contract a third-party network, credential it and tier it - broker mechanics - but they use 'broker' only to name the legacy category they displace. That is legitimate and effective positioning for a modern entrant and maps onto our own vocabulary problem. The line not to cross: they never actually deny contracting a network, they just decline the label. Positioning against a category is fair; misdescribing your operating model is not, and our copy gate must hold us to describing the network relationship plainly wherever a reader could be misled. (VERIFIED /platform, /network) |

### Caveats and unverified areas

WHAT I COULD NOT VERIFY, EXPLICITLY. (1) The acquisition/merger check NEVER RAN - my second WebSearch was rate-limited and returned an error, so "not acquired, not merged, not rebranded" is an INFERENCE from live-site evidence (self-consistent SafeRide branding, 2026-dated content, working sitemap and interior pages), not search-corroborated. Treat domainVerification status "live-as-given" as strongly evidenced but not independently confirmed. (2) FETCH METHOD LIMIT: WebFetch converts pages to markdown via a summarizing model, so JS-rendered menus, embedded forms and interactive widgets may be partially or wholly missing. Concretely, the provider intake form at /what-to-expect-nemt-provider#form did NOT render, so its field labels, required markers, and whether it asks fleet size / states served / vehicle types / NPI are UNKNOWN - marked unverified rather than guessed. /contact likewise showed audience buttons but no form fields; I cannot rule out client-side forms there. (3) Nav dropdown children came from a SINGLE homepage fetch. The labels are VERIFIED as text present on the page, but the parent-child grouping and ordering may reflect DOM/mobile order rather than the visual desktop menu, and a hover-only dropdown could have been missed entirely. (4) PAGES NOT FETCHED - inventoried from the sitemap only, therefore REPORTED for content: /careers, /mysaferide, /platform/self-managed, /platform/fully-managed (their descriptions come from the /platform page's own summary of them, not from the pages themselves), /privacy-policy, /terms-of-service, /terms-of-service/uhc, /contact/health-plan, /contact/care-providers, /contact/other, all ~130 /post/* articles, all ~80 /member-health-plan/* children except unitedhealthcare-maryland, and all ~21 co-branded short-slug landings. Their EXISTENCE and URL is VERIFIED via sitemap; their CONTENT is not. (5) I did not download any PDF. The two provider PDFs, the white papers and the one-pagers are verified as OFFERED, not as read - Tier 1 benefit detail specifically lives inside a PDF I did not open. (6) GATING is only partly known: the /resources listing showed no email wall on the links, but I never attempted a download, and /thank-you-nemt-industry-survey-2023 proves at least one asset IS form-gated. Treat "ungated library" as REPORTED. (7) The ~$380,000 annual provider earnings figure is REPORTED from a search-result summary only - I did not see it in any page body I fetched, and it should not be relied on. (8) robots.txt returned only the Sitemap declaration in my fetch; I cannot confirm whether Disallow rules exist, so "no crawl restrictions" is NOT claimed. (9) The sitemap fetch reported 367 unique URLs but enumerated roughly 270; my page counts (~130 posts, ~80 plan pages, ~21 co-branded landings) are APPROXIMATE and derived from the enumerated subset - the true inventory is larger than what I list. (10) info.saferidehealth.com appeared in search results as a SafeRide-owned subdomain; I did not fetch it and its purpose (likely a marketing/landing host) is an inference. (11) All stat figures are quoted as the site presents them and are NOT independently corroborated - I am reporting that they PUBLISH these numbers, not that the numbers are true, and I have flagged that several contradict each other across their own pages. (12) Per the brief, all verbatim quotes are short (single words or short phrases) reproduced only as evidence of vocabulary and structure; no marketing copy was reproduced at length. Every structural and categorical description is in my own words.

---

## 5. Roundtrip

### a. Identity line

- **Domain verification:** resolved to `roundtriphealth.com` — status **live-as-given**. The expected domain is correct and actively served. I fetched https://roundtriphealth.com/ (renders a full marketing site titled around "Patient Transportation Software for Hospitals and Health Plans", footer copyright 2026), https://roundtriphealth.com/robots.txt (returns Crawl-delay: 10, User-agent: * with empty Disallow, and Sitemap: https://roundtriphealth.com/sitemap_index.xml), and https://roundtriphealth.com/sitemap.xml which resolves to a live sitemap index listing five child sitemaps (post, page, press, customer-stories, category). All five child sitemaps returned current URLs. The site is self-branded with no parent-company, "a [X] company", or "part of" language on the homepage, /company/ or the footer (VERIFIED absent). Blog posts dated 2026 and a press item slug referencing a 2025 partnership confirm the site is actively maintained, not parked or archived. NO acquisition or merger evidence was found. A leadership transition is REPORTED only: search summaries indicate Sam Farmer became CEO with founder Mark Switaj moving to board chair, corroborated by a first-party press URL in their sitemap (/press/roundtrip-announces-farmer-as-ceo-switaj-as-chairman/) which I confirmed exists but did not open. Note a distinct unrelated domain exists at roundtrips.net (a different NEMT operator) - it is NOT this company.
- **Self-description (short attributed fragment):** Their FAQ answers "What is Roundtrip?" with: "Technology company that helps hospitals, health plans... remove transportation as a barrier to care" (VERIFIED, https://roundtriphealth.com/faq/) — **VERIFIED** (https://roundtriphealth.com/faq/ (self-description and footprint); https://roundtriphealth.com/product/ (marketplace noun); https://roundtriphealth.com/ (title tag))
- **The noun they use (vocabulary finding):** TECHNOLOGY PLATFORM / MARKETPLACE - and they are emphatic about it. The actual nouns they use for themselves, all VERIFIED: "Technology company" (/faq/), "digital transportation marketplace" (/product/ headline, and the same phrase in their own press: "digital transportation marketplace for providers, patients"), "a comprehensive market aggregator" (/product/), "Patient Transportation Software" (homepage title tag), and "an easy-to-use ride booking platform for transportation requesters" (/health-systems/). They NEVER call themselves a broker, a transportation manager, a benefit manager, or an NEMT provider. Critically, they run an FAQ entry titled "Is Roundtrip a transportation company?" specifically to disclaim it. They reserve the noun "provider" for the third-party transportation companies in their network, and call the transportation businesses "transportation companies" / "transport companies" in nav and footer. Buyer-side counterparties are "health systems" and "health plans"; riders are "patients" on buyer-facing pages and "members" on co-branded plan pages.
- **Operating model as they state it:** Asset-light aggregator, stated outright rather than left ambiguous. They say plainly that they do not own or operate vehicles and do not employ drivers - the FAQ states they "do not supply the vehicles or transports" and instead connect clients with existing transportation companies (VERIFIED, /faq/). What they sell is software plus wraparound service: a booking layer that a hospital, health plan or transit agency uses to order a ride, which is then fulfilled by a credentialed third-party network spanning rideshare (Lyft named as preferred, Uber as secondary), medical sedans, wheelchair vans, stretcher vehicles and ambulance. They also explicitly accommodate a customer's EXISTING carrier relationships rather than displacing them (FAQ: "What if I have contracts or relationships with transportation companies?"). Two more model tells: transportation companies join FREE and are paid on roughly net-45 terms, which means Roundtrip sits in the payment flow between the healthcare buyer and the carrier, and the tier page (Basic / Pro / Enterprise) prices access to progressively richer vehicle levels and workflow centralization. They are therefore NOT a broker-of-record in the Medicaid MCO sense and NOT a benefit manager - they position as the ordering and visibility layer, with a network attached.
- **Footprint:** Deliberately vague and stated only in adjectives. Their FAQ answer to "Where does Roundtrip operate?" is: "We have established a transportation presence in almost every state" (VERIFIED, /faq/). No state list, no coverage map, no county detail. Network size is likewise qualitative only - the health-plans page claims a "credentialed network" and "the most reliable NEMT network" with NO provider count (VERIFIED, /health-plans/). Member counts, annual trip volume, and driver counts are NOT PUBLISHED anywhere I fetched. The only quantified public figures are outcome claims, not scale claims: partner no-show rates "lower than 4%" against an industry average "over 20%", and a daily figure of 10,000 patients missing or delaying care over a transportation barrier (VERIFIED, homepage and /healthcare-delivery-systems/) - both presented without visible citation. Geographic reality can be inferred from named customers and programs (PA, NJ, DE, MD, VA, GA, OH, TX, CA, and a Southern California Medicaid partnership) but they never aggregate it into a footprint claim. Corporate offices: Philadelphia, PA and Richmond, VA (VERIFIED).

### b. Nav map

| Top-level label | Dropdown children | |
|---|---|---|
| `Solution` | `Health Systems`, `Health Plans`, `Transportation Companies` | VERIFIED |
| `Resources` | `Resource Center`, `Customer Stories`, `Blog`, `FAQs`, `Press`, `Partners` | VERIFIED |
| `Company` | (no dropdown) | VERIFIED |
| `Contact Sales` | (no dropdown) | VERIFIED |
| `Login` | (no dropdown) | VERIFIED |
| `FOOTER COLUMN - About` | `Product`, `Company`, `Careers`, `Press` | VERIFIED |
| `FOOTER COLUMN - Solutions` | `Health Systems`, `Health Plans`, `Transport Companies` | VERIFIED |
| `FOOTER COLUMN - Resources` | `Resource Center`, `Customer Stories`, `Blog`, `FAQs`, `Legal`, `Privacy Policy`, `Security`, `Terms of Use` | VERIFIED |

### c. Page inventory (62 distinct public page types enumerated)

**PAYER** (4)

| Page type | URL | |
|---|---|---|
| Health Plans - primary payer landing page (HIPAA + SOC 2 badges, HEDIS / STAR vocabulary) | `https://roundtriphealth.com/health-plans/` | VERIFIED |
| Roundtrip for Health Plan Overview - campaign LP | `https://roundtriphealth.com/landing-page-roundtrip-for-health-plan-overview/` | REPORTED |
| RFP Question Bank - gated procurement template for evaluators writing an NEMT RFP | `https://roundtriphealth.com/rfp-question-bank/` | VERIFIED |
| The Next Evolution of Medicare Advantage - on-demand webinar LP | `https://roundtriphealth.com/next-evolution-medicare-advantage-ondemand-webinar/` | REPORTED |

**PROVIDER** (6)

| Page type | URL | |
|---|---|---|
| Transportation Companies - the ONE and ONLY provider-facing page | `https://roundtriphealth.com/transport-companies/` | VERIFIED |
| Signup - transportation-company application form page | `https://roundtriphealth.com/signup/` | VERIFIED |
| Integrate - CAD onboarding walkthrough (Traumasoft named; 3 steps, no developer docs) | `https://roundtriphealth.com/integrate/` | VERIFIED |
| Logis Dispatch Integration | `https://roundtriphealth.com/logis-dispatch-integration/` | REPORTED |
| Essential Guide to CAD Integrations - gated guide LP | `https://roundtriphealth.com/essential-guide-cad-integrations/` | REPORTED |
| How to Maximize NEMT Reimbursement - webinar LP (provider revenue angle) | `https://roundtriphealth.com/maximize_nemt_reimbursement_webinar/` | REPORTED |

**MEMBER** (12)

| Page type | URL | |
|---|---|---|
| RideAccess - generic co-branded member/rider get-started page | `https://roundtriphealth.com/rideaccess/` | VERIFIED |
| Mass Advantage - co-branded health-plan member page | `https://roundtriphealth.com/massadvantage/` | VERIFIED |
| Chesterfield (County Mobility Services) - co-branded county rider page | `https://roundtriphealth.com/chesterfield/` | VERIFIED |
| American Cancer Society "Road To Recovery" - co-branded rider program page (publishes ACS's 1-888-227-6333 and links a Quick Start Guide + FAQ) | `https://roundtriphealth.com/acs/` | VERIFIED |
| ACS Espanol - Spanish-language variant of the ACS rider page (the ONLY non-English page found) | `https://roundtriphealth.com/acs-espanol/` | REPORTED |
| Alterwood (Medicare Advantage plan) - co-branded member page | `https://roundtriphealth.com/alterwood/` | REPORTED |
| Healthfirst - co-branded plan member page | `https://roundtriphealth.com/healthfirst/` | REPORTED |
| IBC (Independence Blue Cross) - co-branded plan member page | `https://roundtriphealth.com/ibc/` | REPORTED |
| GRTC - co-branded transit-agency rider page | `https://roundtriphealth.com/grtc/` | REPORTED |
| Access / Access Form / Chesterfield Access on Demand - rider program entry pages | `https://roundtriphealth.com/access/` | REPORTED |
| Program intake forms: GRTC Form, HanoverDash Form, Access Form (all render the same generic contact form template) | `https://roundtriphealth.com/grtc-form/` | REPORTED |
| Program email templates (GRTC, Hanover County, CFC) - sponsor-facing outreach templates left publicly indexed | `https://roundtriphealth.com/cfc-email-template/` | REPORTED |

**FACILITY** (15)

| Page type | URL | |
|---|---|---|
| Health Systems - primary facility/hospital landing page | `https://roundtriphealth.com/health-systems/` | VERIFIED |
| Healthcare Delivery Systems - near-duplicate second facility page, carries the stats the /health-systems/ page omits | `https://roundtriphealth.com/healthcare-delivery-systems/` | VERIFIED |
| Roundtrip for Outpatient Care overview | `https://roundtriphealth.com/roundtrip-for-outpatient-care-overview/` | REPORTED |
| Paratransit - transit-agency variant of the facility page (rider-adjacent, agency-sold) | `https://roundtriphealth.com/paratransit/` | VERIFIED |
| Compare Features - Basic / Pro / Enterprise tier grid, no prices | `https://roundtriphealth.com/compare-features/` | VERIFIED |
| Benefit proof sub-pages x4: Reducing No-Shows, Saving Time and Money, Every Vehicle for Every Patient, Better Insights Better Outcomes | `https://roundtriphealth.com/reducing-no-shows/` | REPORTED |
| Transportation Impact Calculator (healthcare providers) - ROI tool | `https://roundtriphealth.com/transportation-impact-calculator-healthcare-providers/` | REPORTED |
| Online Ride Ordering Portal Impact Calculator - ROI tool | `https://roundtriphealth.com/online-ride-ordering-portal-impact-calculator/` | REPORTED |
| Ride and Authorization Volume Calculator - ROI tool | `https://roundtriphealth.com/ride-authorization-volume-calculator-healthcare-providers/` | REPORTED |
| Transportation Partnership Inventory - vendor-inventory template | `https://roundtriphealth.com/transportation-partnership-inventory/` | REPORTED |
| Transportation Impact / Capacity Management | `https://roundtriphealth.com/transportation-impact-capacity-management/` | REPORTED |
| Build & Optimize a Transportation Network - gated ebook LP | `https://roundtriphealth.com/build-optimize-transportation-network-ebook/` | REPORTED |
| Transportation Blueprint - gated LP | `https://roundtriphealth.com/lp-transportation-blueprint/` | REPORTED |
| EHR Guide - gated LP | `https://roundtriphealth.com/lp-ehrguide/` | REPORTED |
| Webinar LPs: Transportation Maturity Model, Memorial Hermann, Roundtrip Summit 2025 Transfer Command Centers | `https://roundtriphealth.com/transportation-maturity-model-webinar/` | REPORTED |

**COMPANY-GENERAL** (25)

| Page type | URL | |
|---|---|---|
| Homepage | `https://roundtriphealth.com/` | VERIFIED |
| Product overview - "Inside our digital transportation marketplace" | `https://roundtriphealth.com/product/` | VERIFIED |
| Company / About - careers-led, no leadership or founding story | `https://roundtriphealth.com/company/` | VERIFIED |
| Contact | `https://roundtriphealth.com/contact/` | VERIFIED |
| Demo request (target of every "Contact Sales" CTA) | `https://roundtriphealth.com/demo/` | VERIFIED |
| Contact Sales | `https://roundtriphealth.com/contact-sales/` | REPORTED |
| Thank-you / post-submit page | `https://roundtriphealth.com/thank-you/` | REPORTED |
| FAQs - one flat list mixing patient, provider and buyer questions | `https://roundtriphealth.com/faq/` | VERIFIED |
| Partners - integrations + industry associations logo wall | `https://roundtriphealth.com/partners/` | VERIFIED |
| Partnerships (second, overlapping partner page) | `https://roundtriphealth.com/partnerships/` | REPORTED |
| Security - links out to an external Drata trust center | `https://roundtriphealth.com/security/` | VERIFIED |
| Privacy Policy | `https://roundtriphealth.com/privacy/` | REPORTED |
| Terms of Use | `https://roundtriphealth.com/terms/` | REPORTED |
| Cookie Policy | `https://roundtriphealth.com/cookie-policy/` | REPORTED |
| Webinar Policy | `https://roundtriphealth.com/webinar-policy/` | REPORTED |
| Resource Center (nav target) | `https://roundtriphealth.com/resources/` | VERIFIED |
| Resource Library - filterable by Customer Stories / Ebooks-Guides / ROI Calculators / Solution Briefs / Templates / Videos / Webinars | `https://roundtriphealth.com/resource_library/` | VERIFIED |
| Blog index | `https://roundtriphealth.com/blog/` | VERIFIED |
| Blog category pages x6 - blog, rthealthier-communities, improving-care, nemt-101, rtupdates, user-spotlights | `https://roundtriphealth.com/blog/category/nemt-101/` | VERIFIED |
| Press index + approximately 64 individual press items (funding, partnerships, SOC 2 audit, state expansion, CEO announcement) | `https://roundtriphealth.com/press/` | VERIFIED |
| Customer Stories index + 16 individual named case studies | `https://roundtriphealth.com/customer-stories/` | VERIFIED |
| "Roundtrip TV" interview series - 9 separate landing pages (guest-per-page) | `https://roundtriphealth.com/roundtrip-tv-with-rt-team/` | REPORTED |
| 2022 State of Healthcare Transportation Survey - first-party research report | `https://roundtriphealth.com/2022-state-of-healthcare-transportation-survey/` | REPORTED |
| AVIA Marketplace "Voices of the Network" feature | `https://roundtriphealth.com/avia-marketplace-voice-network-roundtrip/` | REPORTED |
| Investor Roundup | `https://roundtriphealth.com/roundtripinvestorroundup/` | REPORTED |


### d. Information categories by audience

**PAYER**

- Dedicated /health-plans/ page structured as: member-satisfaction promise, "Built For Healthcare", "How it works", "How we're different", benefit-design pitch (VERIFIED)
- HIPAA and SOC 2 badges rendered directly on the health-plans page - compliance is surfaced at the buying moment, not buried on a legal page (VERIFIED)
- Public third-party trust center: the footer "Security" link goes to an external Drata portal (app.drata.com/trust/...), so an evaluator can pull compliance records without a sales call (VERIFIED)
- Quality-program vocabulary aimed squarely at plan buyers: HEDIS measures and STAR ratings referenced on /health-plans/ (VERIFIED)
- SOC 2 Type II + HIPAA audit completion announced in the press archive (VERIFIED - URL /press/roundtrip-successfully-completes-soc2-type-ii-hipaa-audit/ confirmed in press-sitemap.xml; release body not opened)
- Network described ONLY in adjectives - "credentialed network", "the most reliable NEMT network" - with zero provider count, zero coverage map, zero state list (VERIFIED absence)
- Footprint given as "a transportation presence in almost every state" - unquantified and unmapped (VERIFIED, /faq/)
- Outcome stats are thin and uncited: no-show rates "lower than 4%" vs industry "over 20%", and 10,000 patients per day delayed by a transportation barrier. No methodology, no source, no date (VERIFIED)
- Procurement enablement is the standout: a gated "Request for Proposal Question Bank" template of categorized vendor-evaluation questions, explicitly framed for health plans and health systems writing an RFP (VERIFIED)
- Three ROI calculators (transportation impact, ordering-portal impact, ride/authorization volume) let a buyer build an internal business case (VERIFIED)
- Medicare Advantage proof exists as a named case study (Alterwood Advantage) plus a dedicated MA webinar; a Medicaid proof point exists via a Southern California broker partnership in the press archive (VERIFIED)
- Pricing withheld: Basic / Pro / Enterprise tiers each end in "Request A Quote" (VERIFIED, /compare-features/)
- Pilot / entry path is a single demo form. No self-serve, no RFP submission portal, no implementation timeline, no SLA language published anywhere (VERIFIED absence)
- NOT PUBLISHED for payers: state contract list, Medicaid program participation by state, encounter/claims data handling detail, grievance & appeals handling, credentialing standards, driver qualification standards, on-time-performance definitions or figures (VERIFIED absence across /health-plans/, /security/, /faq/)

**PROVIDER**

- Everything for transportation companies lives on ONE page, /transport-companies/, plus a form page at /signup/ (VERIFIED)
- Join flow published as three explicit stages: complete application and submit required documents, receive onboarding materials, begin receiving and scheduling ride requests (VERIFIED)
- Cost of joining stated outright - "Roundtrip is free to join" (VERIFIED)
- Insurance floor published with real numbers: general and automobile liability at no less than $1,000,000 per occurrence and $1,000,000 annual aggregate, with medical professional liability and workers' compensation possible depending on state and local rules (VERIFIED). This is unusually concrete for a public page.
- PAYMENT TERMS PUBLISHED - payment for Roundtrip rides "on average, net 45 days" (VERIFIED). Naming a cash-flow term publicly is rare and answers a carrier's first question.
- Credentialing referenced only in the abstract: network described as "credentialed, qualified transportation companies" with a reference to being certified to provide Medicaid. NO checklist, NO document list, NO standards detail (VERIFIED)
- Dedicated provider email transport@roundtriphealth.com for insurance-requirement questions (VERIFIED)
- Provider-specific FAQ block on the page, plus a downloadable executive summary PDF and an explainer video (VERIFIED)
- CAD/dispatch integration documented shallowly: /integrate/ walks a three-step Traumasoft flow (getting started, configuration with vehicle-type mapping, ready to use). Logis and ESO appear via press. No API docs, no FHIR spec, no developer portal (VERIFIED)
- A gated "Essential Guide to CAD Integrations" and a "How to Maximize NEMT Reimbursement" webinar are the only deeper provider assets (VERIFIED)
- NOT PUBLISHED for providers: provider manual, required-document checklist, vehicle standards, driver qualification/background-check standards, training materials, rate schedule or per-mile economics, claims/billing submission mechanics, dispute or appeal process, performance expectations, deactivation criteria, and any provider portal or app (VERIFIED absence)
- CTA is "LET'S GET STARTED" into the same generic contact form - not a real structured application with document upload (VERIFIED that the form exists; its fields did not render, see caveats)

**MEMBER**

- THE DEFINING FACT: members cannot self-serve. The FAQ entry "I'm a patient - Can I book a ride for myself?" directs the patient to tell their doctor, social worker or care coordinator, because ride requests must originate from a partner organization (VERIFIED, /faq/)
- There is NO member section in the primary navigation. Member content exists only as co-branded, per-sponsor landing pages that are reached by a link the sponsor hands out (VERIFIED - /rideaccess/, /massadvantage/, /chesterfield/, /acs/, /alterwood/, /healthfirst/, /ibc/, /grtc/)
- Those pages run a near-identical template: "Trusted, Reliable Medical Transportation" -> "Get Started" -> "Download the App" -> "An experience built with you in mind" (VERIFIED)
- What a member actually gets: a three-step start (download the app, register with a member ID, book), iOS + Android store links, a web portal at book.rideroundtrip.com, the vehicle types available (standard vehicles, wheelchair vans, medical sedans), same-day or advance booking, real-time trip updates and reminders, door-to-door service, change/cancel capability, and an ADA note (VERIFIED)
- A benefit disclaimer is used instead of specifics: options "may vary according to your health plan benefit" (VERIFIED)
- Spanish exists for exactly one program (/acs-espanol/) - there is no site-wide language switcher (VERIFIED URL; content REPORTED)
- The ACS Road To Recovery page is the deepest member page: it publishes a phone number (1-888-227-6333, the sponsor's line), describes the volunteer-driver model, and links a Quick Start Guide and a member FAQ (VERIFIED)
- /paratransit/ mentions a 24/7 call center as a rider channel but publishes no number for it (VERIFIED)
- NOT PUBLISHED for members on any page I fetched: eligibility rules, service hours, service-area boundaries, fares or copays, trip limits, how far in advance to book, pickup-window expectations, no-show/cancellation policy, what to do if the ride does not arrive, escort/companion policy, complaint or grievance path, and any accessible non-app booking route for a member without a smartphone (VERIFIED absence across /rideaccess/, /massadvantage/, /chesterfield/, /acs/). This is the single biggest information gap on the site.

**FACILITY**

- Two overlapping facility pages: /health-systems/ (workflow-led, no numbers) and /healthcare-delivery-systems/ (carries the stats and the full vehicle ladder). The near-duplication is itself a finding (VERIFIED)
- Section spine on /health-systems/: streamline transportation, "Built For Healthcare", book rides in under three minutes, drive better health outcomes, improve operational efficiencies, centralize booking, integrate seamlessly, save money (VERIFIED)
- Full vehicle ladder published: rideshare (Lyft/Uber), medical sedan, wheelchair van, stretcher vehicle, ambulance (VERIFIED, /healthcare-delivery-systems/ and /product/)
- Outcome framing is clinical and operational: reduce no-shows, increase follow-up adherence, prevent unnecessary readmissions, expedite discharge, patient flow and transfer-center use cases (VERIFIED)
- Integration proof is the strongest asset for this audience - a named partner wall on /partners/ split into Partners, Integrations, and Industry Associations: Epic, Oracle Health, Meditech, Veradigm, Athena Health, Salesforce, CarePort, Redox, AWS, findhelp, Logis, TeleTracking, TigerConnect, Bamboo Health, ZOLL, Traumasoft, with Lyft as preferred and Uber as secondary; associations ACMA, CMSA, NEMTAC (VERIFIED)
- 16 named, UNGATED customer stories with real organizations: Jefferson Health, Geisinger, AtlantiCare, Sentara Cancer Network, St. Luke's University Health Network, MD Anderson at Cooper, Contra Costa, BrightView, Nemours, VCU Health, Saint Peter's, Alterwood Advantage, GRTC and others (VERIFIED, /customer-stories/)
- Quantified case-study outcomes are used sparingly but concretely - a $1M cost saving at St. Luke's, 4,000 rides in six months from an EHR integration, and a no-show rate framed as 5x better than the national average at MD Anderson at Cooper (VERIFIED as headline text on the index)
- Both Solution Briefs (Health System, Health Plan) are direct PDFs, ungated, while ebooks and templates sit behind forms - a deliberate gate tier (VERIFIED)
- Tier page Basic / Pro / Enterprise maps to vehicle types, trip types, ride support and reporting/data - four comparison rows, no prices (VERIFIED)
- NOT PUBLISHED: implementation timeline, staffing/training requirements, uptime or support SLAs, data-export/reporting specification, security architecture detail beyond the badges (VERIFIED absence)

**COMPANY**

- /company/ is a CAREERS page wearing an About page's title. It publishes benefits (health/dental/vision, unlimited PTO, "Feel Good Fridays", remote stipends, 401K match), culture and diversity sections, a Transparency of Coverage link, and an external Gusto job board (VERIFIED)
- NO leadership names, NO bios, NO founding story, NO investor list, NO founding year on /company/ (VERIFIED absence) - the leadership change and funding history live only in the press archive, not in a maintained About narrative
- Mission stated as a one-line values sentence rather than a company story (VERIFIED)
- Two office addresses published: Philadelphia, PA and Richmond, VA (VERIFIED)
- A large first-party press archive - roughly 64 items spanning 2018 to 2025+ - covering funding rounds, EHR/FHIR integration launches, partnerships (Lyft, Redox, Hitch Health, The Helper Bees, Clover Health, Call the Car), state expansion, awards, and the SOC 2 Type II / HIPAA audit (VERIFIED via press-sitemap.xml)
- Blog with six categories including NEMT 101 (education), Improving Care, Healthier Communities, Roundtrip Updates and User Spotlights, plus recurring "Get to Know the Roundtrip Team" employee profiles and conference recaps (VERIFIED)
- A "Roundtrip TV" interview series occupying nine separate landing pages (VERIFIED via sitemap)
- Legal set is complete: Privacy Policy, Terms of Use, Cookie Policy, Webinar Policy, Security (VERIFIED URLs in sitemap; footer labels VERIFIED)
- No trust/compliance page of their own authorship beyond a thin /security/ page that defers to the external Drata portal (VERIFIED)


### e. Artifacts

**Downloadable documents (15)**

- Health System Solution Brief - served as a DIRECT PDF file (not gated) from the resource library (VERIFIED, https://roundtriphealth.com/resource_library/)
- Health Plan Solution Brief - also a direct PDF file, ungated (VERIFIED, /resource_library/)
- "Download Our Solution Brief" / executive-summary CTA repeated on audience pages (health-systems, transport-companies, paratransit) (VERIFIED)
- Build & Optimize a Transportation Network - ebook behind a landing-page form (VERIFIED, /build-optimize-transportation-network-ebook/ + /resource_library/)
- Essential Guide to CAD Integrations - guide, gated landing page (VERIFIED, /essential-guide-cad-integrations/)
- Request for Proposal Question Bank - procurement template, gated; content is categorized vendor-evaluation questions to paste into an RFP (VERIFIED, /rfp-question-bank/)
- Transportation Vendor Inventory / Transportation Partnership Inventory - template (VERIFIED, /resource_library/ + /transportation-partnership-inventory/)
- Transportation Impact Calculator (healthcare providers) - interactive ROI tool (VERIFIED, /transportation-impact-calculator-healthcare-providers/)
- Online Ride Ordering Portal Impact Calculator - ROI tool (VERIFIED, /online-ride-ordering-portal-impact-calculator/)
- Ride and Authorization Volume Calculator - ROI tool (VERIFIED, /ride-authorization-volume-calculator-healthcare-providers/)
- Webinars as gated assets: How to Maximize NEMT Reimbursement, Understanding the Transportation Maturity Model, The Next Evolution of Medicare Advantage, Memorial Hermann, Roundtrip Summit 2025 Transfer Command Centers (VERIFIED titles from /resource_library/ and /page-sitemap.xml)
- 2022 State of Healthcare Transportation Survey - first-party research report (REPORTED - URL confirmed in page-sitemap.xml, page not fetched)
- EHR Guide landing page (/lp-ehrguide/) and Transportation Blueprint landing page (/lp-transportation-blueprint/) (REPORTED - sitemap URLs, audience inferred from slug)
- Member "Quick Start Guide" and a member FAQ are LINKED from the American Cancer Society program page (VERIFIED that links with those labels exist on /acs/; file format and contents NOT verified)
- NOTABLE ABSENCE: no provider manual, no credentialing document checklist, no driver/vehicle standards PDF, no billing/claims guide anywhere in the resource library or on the transportation-company page (VERIFIED absent from /transport-companies/ and /resource_library/)

**Portals (6)**

- app.rideroundtrip.com - the ONLY destination behind the header "Login" link; serves healthcare staff / organizational users (VERIFIED as the href on https://roundtriphealth.com/; the login UI itself returned a "Redirecting..." shell, so its fields and any audience split are NOT VERIFIED)
- book.rideroundtrip.com - separate rider/member booking portal. Surfaced ONLY inside co-branded program pages, never in the global nav (VERIFIED on /rideaccess/, /massadvantage/, /chesterfield/, /acs/)
- Native mobile apps for riders on iOS App Store and Google Play, promoted with store badges on every co-branded member page (VERIFIED)
- app.drata.com trust center - external third-party compliance portal linked from the footer under the label "Security" (VERIFIED, link surfaced on /security/ and in footer)
- Gusto-hosted job board for careers, linked from /company/ (VERIFIED)
- NO public transportation-company / provider portal is surfaced anywhere on the marketing site (VERIFIED absent from /transport-companies/, nav, and footer)

**Contact patterns (11)**

- NO phone number is published anywhere on the corporate marketing site - verified absent from the homepage, /contact/, /company/, /health-systems/, /health-plans/, /transport-companies/ and /paratransit/ (VERIFIED)
- info@roundtriphealth.com - single general-purpose email, repeated in the footer and on /contact/, /company/, /paratransit/, /security/ (VERIFIED)
- transport@roundtriphealth.com - dedicated provider-intake email, published only on /transport-companies/ for insurance-requirement questions (VERIFIED)
- Two street addresses published: Philadelphia, PA (1516 N. 5th Street, Unit 320) and Richmond, VA (1717 E Cary Street) (VERIFIED on /company/, /contact/, /paratransit/)
- One generic form template is reused everywhere - /contact/, /demo/, /signup/, /access-form/ and gated asset pages all carry the identical "Fill out the form below" instruction. No audience routing, no role dropdown, no state selector observed (VERIFIED as a repeated pattern across 5 fetches; individual field labels NOT VERIFIED, see caveats)
- "Contact Sales" is the persistent primary header CTA and resolves to /demo (VERIFIED)
- "Request A Demo" is the repeated in-page CTA on every audience page, paired with "See How Roundtrip Can Work For You" (VERIFIED)
- /paratransit/ describes a "24/7 call center" as a rider booking channel but publishes no number for it (VERIFIED)
- 1-888-227-6333 appears on /acs/ - this is the American Cancer Society sponsor line for the Road To Recovery program, not a Roundtrip line (VERIFIED)
- No per-state phone numbers, no per-plan member services numbers, no support/escalation line, no grievance contact anywhere (VERIFIED absent across all fetched pages)
- Pricing is never published; the tier page /compare-features/ replaces price with a "Request A Quote" button per tier (VERIFIED)

### f. Verdict table

| Ruling | Item | Reason |
|---|---|---|
| **COPY** | Publishing hard provider economics on a public page: "free to join", payment on average net 45 days, and an explicit $1,000,000 per-occurrence / $1,000,000 aggregate liability insurance floor (/transport-companies/) | This is the single best thing on their site. A transportation company's first two questions are "what does it cost me" and "when do I get paid", and Roundtrip answers both before a call. Concrete numbers also act as a self-qualifying filter, so unqualified applicants never enter the funnel. Our provider page currently pitches; it should also state terms. Note our copy gate: we can only publish terms we can actually honor, so this is a decision to force, not a claim to copy. |
| **COPY** | An FAQ entry titled "Is Roundtrip a transportation company?" that answers with a flat no and explains they do not supply vehicles or transports | They resolve the operating-model question in one sentence instead of letting a reader guess. This maps directly onto our UNDECIDED operating model in launch.ts. Whatever we decide - own vehicles, contracted network, or software only - the lesson is to say it plainly on a page a reader can find, rather than hiding behind "solutions" and "partner" language. Ambiguity about whether you drive the van is the most expensive ambiguity in this category. |
| **COPY** | Tiered gating: Solution Briefs served as ungated direct PDFs, while ebooks, templates, calculators and webinars sit behind forms | The cheap overview is free so an evaluator can circulate it internally without giving up their email; the expensive tooling costs a contact. That is a defensible trade rather than the usual all-or-nothing gate, and it means their brief actually reaches the committee members who never fill out forms. |
| **COPY** | A gated "Request for Proposal Question Bank" - categorized vendor-evaluation questions a payer or health system can paste into their own RFP | It meets a payer evaluator inside their real workflow instead of shouting at them from a landing page, and it quietly shapes the criteria the buyer will use. Highest-leverage payer artifact on the entire site. Strong candidate for our own procurement surface. |
| **COPY** | Three audience doors under one "Solution" dropdown (Health Systems / Health Plans / Transportation Companies), each page running the same spine: Built For Healthcare, How it works, How we're different | A reader identifies their door on hover, and the parallel structure means the second page you read is instantly legible because you already learned the shape. Validates our own four-audience solutions pattern and the reusable SolutionPage spine. |
| **COPY** | Sixteen ungated customer stories naming real organizations, with quantified headlines ($1M saved, 4,000 rides in six months, no-show rate 5x better than national average) | Named institutions with numbers are the most load-bearing trust asset a young NEMT company can build, and leaving them ungated maximizes reach. IMPORTANT CAVEAT FOR US: our §7 NO-REAL-INSTITUTION-NAMES gate and the copy-honesty gate mean we cannot imitate this until we have real, permissioned customers with real numbers. Copy the FORM, never fabricate the CONTENT. |
| **COPY** | Footer "Security" link pointing to an external third-party trust center (Drata) rather than a self-authored compliance page | Outsourcing the claim to an auditor's portal is more credible than a page of badges we wrote ourselves, and it lets a security reviewer self-serve without a sales call. Directly relevant to our HIPAA-claim gating problem: a third-party attestation link is a claim we can make honestly the moment we have one. |
| **COPY** | A named integration wall (Epic, Oracle Health, Meditech, Veradigm, Redox, Salesforce, Logis, Traumasoft, Lyft preferred / Uber secondary) plus industry associations (ACMA, CMSA, NEMTAC) | It converts an unfalsifiable "we fit your stack" into something a hospital IT reviewer can check against their own systems. The association memberships do quiet legitimacy work for a young company that has no scale numbers to show. |
| **COPY** | A resource library with real type filters (Customer Stories / Ebooks-Guides / ROI Calculators / Solution Briefs / Templates / Videos / Webinars) | Typed filtering respects that a CFO, a transport manager and a clinician want completely different objects. Far better than a single undifferentiated "Resources" dump, and it makes the depth of the library legible at a glance. |
| REJECT | Zero phone number anywhere on the corporate site - absent from the homepage, /contact/, /company/, /health-systems/, /health-plans/, /transport-companies/ and /paratransit/ | A transportation company whose end users are disproportionately elderly, disabled, low-vision or without reliable data service publishes no way to phone anyone. /paratransit/ even advertises a "24/7 call center" and still gives no number. This is the loudest accessibility failure on the site and an easy place for us to simply be better. |
| REJECT | Member pages omit hours, fares, eligibility, service-area boundaries, cancellation/no-show policy, pickup-window expectations, and any complaint or grievance path | Every member page is a download-the-app pitch with a benefit disclaimer standing in for actual answers. These are precisely the questions a rider has before their first trip and the ones that generate call volume when unanswered. Publishing them is cheap, humane, and a genuine differentiator - our member page should answer what theirs dodges. |
| REJECT | One generic "Fill out the form below" template reused for /contact/, /demo/, /signup/ (the transportation-company application), /access-form/ and every gated asset | A carrier applying to the network, a hospital VP requesting a demo, and someone downloading an ebook all submit the same undifferentiated form. There is no role routing and no document upload, so the "application" is really just a lead capture that pushes the actual intake into email. Our /contact/ role routing and structured /apply/ flow are already better than this; keep it that way. |
| REJECT | Provider information stops at the join pitch - no credentialing checklist, no required-document list, no vehicle or driver standards, no rate transparency, no claims/billing mechanics, no dispute process, no provider portal | Ironic given how good their insurance and payment-terms disclosure is: they answer two questions well and then go silent on the ten that follow. A carrier deciding whether to invest onboarding effort cannot see what compliance actually requires. Deep provider documentation is an unclaimed position in this market. |
| REJECT | Sign-in is a single "Login" to the staff app, while the rider portal (book.rideroundtrip.com) is a different subdomain never referenced in the nav | A member arriving from search has no path to their own login and, if they click the only Login link, lands in the wrong application entirely. Validates our Stage-15 decision to split Sign-in into explicit customer doors - the split is not overengineering, it is the fix for exactly this failure. |
| REJECT | /company/ is a careers page wearing an About page's name - no leadership, no founding story, no investors, no founding year | The trust page recruits employees rather than reassuring buyers. A payer doing diligence on a young vendor finds culture perks and a Gusto board. Their actual credibility material (funding, audits, CEO transition) is stranded in a press archive nobody reads chronologically. Our /about/ trust-page approach is the right instinct. |
| REJECT | Network scale published only as adjectives - "almost every state", "the most reliable NEMT network", "credentialed network" - with no counts, no state list, no coverage map | An evaluator cannot size the network or check coverage for their population, and superlatives without numbers read as weaker than an honest small number. Our advantage is the opposite move: name DC/MD/VA precisely and let specificity carry the credibility that scale claims cannot. |
| REJECT | Duplicate and stale surfaces: /health-systems/ vs /healthcare-delivery-systems/ covering the same audience, /partners/ vs /partnerships/, plus a long tail of dead campaign LPs and internal email templates left publicly indexed in the sitemap | Split authority between near-identical pages, an inconsistent story (the duplicate carries stats the primary omits), and internal sponsor outreach templates exposed to crawlers. Our sitemap discipline and ROUTE_META single-source approach should stay strict - one canonical page per audience, and nothing ships to the sitemap that is not a real public page. |
| REJECT | Headline statistics presented without citation - no-shows "lower than 4%" vs industry "over 20%", and 10,000 patients per day delayed by a transportation barrier - with no source, methodology or date | Uncited comparative claims are exactly what our copy-honesty gate and the §10.6 stats-are-claims rule exist to prevent. If we publish a number it needs a source and a recount at deploy; if we cannot source it, we say less and say it truthfully. |
| REJECT | FAQ is one flat undifferentiated list mixing "I'm a patient - can I book a ride for myself?" with buyer, security and provider questions | The patient - the most anxious and least expert reader - has to scan past procurement and integration questions to find the one line that concerns them. Trivial to fix with audience grouping, and a missed chance to give the member audience any dedicated surface at all. |

### Caveats and unverified areas

HONEST LIMITS OF THIS TEARDOWN. (1) FORM INTERNALS NOT VERIFIED. The forms on /demo/, /contact/, /signup/, /access-form/ and the gated asset pages are embedded (JS/iframe) and did not render to WebFetch. I confirmed a form EXISTS on each and that the surrounding instruction copy is identical, but field labels, dropdown options, required-document uploads and any hidden audience routing are NOT VERIFIED. My claim that there is "no audience routing" is an inference from the absence of visible routing UI plus the identical page copy - treat it as REPORTED, not proven. (2) LOGIN UI NOT VERIFIED. https://app.rideroundtrip.com/ returned only a "Redirecting..." shell to WebFetch. I verified the header "Login" href points there; I could NOT verify whether the authenticated app splits users by role, offers SSO, password reset, or self-registration. The statement that sign-in is undifferentiated applies to the MARKETING layer only. (3) PDF BINARIES NOT OPENED. The resource-library fetch reported the two Solution Briefs as direct PDF links rather than gated landing pages. I did not fetch the PDF files themselves, so their existence and gating status are VERIFIED but their contents are not. (4) SITEMAP-ONLY ROWS. roundtriphealth.com/sitemap_index.xml and its children (page, press, customer-stories, category) were fetched successfully, so every URL listed genuinely exists in their first-party sitemap. Where I did not open the page, I labeled the row REPORTED because the AUDIENCE classification is inferred from the URL slug, not read off the page. Verified-fetched pages are labeled VERIFIED. (5) NOT FULLY ENUMERATED. I did not fetch /post-sitemap.xml, so the blog post inventory is partial (blog structure came from the /blog/ index). I also did not open each of the ~64 press items or each of the 16 customer stories; those counts come from the fetched sitemaps, which is reliable for counting but not for content. (6) LOGO WALL UNRESOLVED. The homepage customer logos are images; most carry no resolvable text label. Only Bon Secours, Crozer-Keystone and Sidney Kimmel Cancer Center at Jefferson Health were name-resolvable from the homepage itself. The fuller customer list I report comes from /customer-stories/, which is text. (7) NO ACQUISITION FOUND, BUT ABSENCE IS WEAK EVIDENCE. The brief flagged a possible acquisition. I found none: the site is live, self-branded, copyright 2026, with 2026-dated blog posts and no "part of" or parent-company language on the homepage or /company/. A leadership change (Sam Farmer as CEO, founder Mark Switaj as chairman) is REPORTED - it comes from a search-result summary plus a first-party press URL slug (/press/roundtrip-announces-farmer-as-ceo-switaj-as-chairman/) that I confirmed exists in the sitemap but did NOT open. Funding figures (~$11M raised) are REPORTED from a search summary only and were not confirmed on their site. (8) FETCH-SUMMARY MEDIATION. All page content reached me through WebFetch's summarization pass, not raw HTML I inspected byte-for-byte. The short quoted fragments are as that pass reported them. I kept every quote under ~15 words and attributed each one; no marketing copy was reproduced at length, per the constraint. (9) NOT CHECKED AT ALL. Accessibility conformance, page performance, mobile behavior, analytics/tracking stack, and any state-specific Medicaid compliance pages (none were found, but I did not exhaustively probe for unlinked ones beyond the sitemap).

---

# 6. SYNTHESIS (feeds P2)

## 6a. THE CATEGORY MATRIX

Rows are every information category discovered anywhere across the five subjects. Columns: the five subjects,
then **NEXO V1** (our live site, audited first-hand from this repo on 2026-08-17), then **NEXO V2** (carry /
skip, with the reason). Legend: **Y** present, **P** partial, **n** absent.

Honesty note on the V1 column: it was scored against the actual repo (13 public routes, `src/lib/nav.ts`,
`public/`), not from memory or optimism. V1 has **zero downloadable artifacts**, **zero per-state content**,
and its sign-in surface is built but flag-gated off.

### Payer / MCO evaluator

| # | Category | MTM | Modi | Verida | SafeRide | Rndtrip | V1 | V2 | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Dedicated payer landing page | Y | Y | n | Y | Y | **Y** | **carry** | V1 has /solutions/mcos. Verida's is orphaned, which is a warning not a model. |
| 2 | Segmented payer sub-audiences (Medicaid / MA / health system) | P | Y | n | Y | Y | n | **carry (light)** | One page today; split only when we have distinct proof per segment. |
| 3 | Compliance + accreditation posture page | P | Y | Y | Y | Y | P | **CARRY (priority)** | Four of five publish this; V1 has only /hipaa. Biggest payer-facing gap. |
| 4 | Public third-party trust center | n | n | n | n | Y | n | **carry (later)** | Roundtrip's Drata portal is the standout. Needs real audits first. |
| 5 | Program integrity / FWA controls | Y | Y | Y | P | n | P | **carry** | We can prove ours from the platform (scrub, adjudication, frozen fields). |
| 6 | Outcome statistics | Y | Y | Y | Y | Y | **Y** | **carry** | Everyone publishes; nearly all unsourced. Ours stay the permitted, provable set. |
| 7 | Case studies / named clients | Y | P | n | P | Y | n | **skip (for now)** | Copy gate: we have no clients to cite. Revisit post-contract. |
| 8 | RFP / procurement enablement | n | n | n | P | Y | n | **carry** | Roundtrip's RFP question bank is the single best payer asset found. |
| 9 | ROI calculators | n | n | n | n | Y | n | **skip** | Requires real cost data we do not have. Would breach the honesty gate. |
| 10 | Published pricing or tiers | n | n | n | n | P | n | **skip** | Nobody publishes real prices; ours are contract-negotiated. |
| 11 | Pilot path / demo route | P | P | P | Y | Y | P | **carry** | Ours is /contact today. Make the pilot path explicit. |
| 12 | Reporting + analytics description | Y | Y | Y | Y | Y | **Y** | **carry** | V1 covers it at /platform#oversight. |
| 13 | State contract / award list | n | n | P | n | n | n | **skip** | None publish it; we have none. |
| 14 | Named engagement models (self-managed vs full-service) | n | n | n | Y | n | n | **carry** | SafeRide's clearest idea: name the shapes of the deal. |
| 15 | Security posture (SOC / pen-test / control families) | n | Y | n | Y | Y | n | **carry** | Folds into #3. Ours must be flag-gated until infrastructure is verified. |

### Transport provider

| # | Category | MTM | Modi | Verida | SafeRide | Rndtrip | V1 | V2 | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 16 | Provider landing / join hub | Y | Y | Y | Y | Y | **Y** | **carry** | V1 has /solutions/providers + /apply. |
| 17 | Supply-side segmentation (company vs individual driver) | Y | P | P | Y | P | n | **carry** | MTM routes four supply populations differently. We need at least two. |
| 18 | Published requirements checklist | P | n | **Y** | P | n | n | **CARRY (priority)** | Verida publishes a pre-application compliance checklist. Our single biggest content gap. |
| 19 | Insurance minimums at line-item specificity | n | n | **Y** | n | n | n | **carry (P1b verifies)** | Verida names carrier rating and covered-vehicle terms. P1b must verify DC/MD/VA numbers before we publish any. |
| 20 | Credentialing steps as a numbered process | P | P | **Y** | P | n | n | **CARRY (priority)** | Verida's 4-step sequence with what happens at each stage. |
| 21 | Provider manual / handbook PDF | **Y** | Y | Y | n | n | n | **carry** | MTM publishes a full DC provider handbook openly — in our market. |
| 22 | Training syllabus or materials | Y | n | **Y** | n | n | n | **carry** | Verida publishes a 7-domain syllabus; MTM's training page is ungated. |
| 23 | Payment + claims explanation | P | P | Y | P | P | **Y** | **carry** | V1's /platform#claims-billing is already stronger than most. |
| 24 | Published rates | n | n | n | n | n | n | **skip** | Universally withheld; negotiated per provider. |
| 25 | Named human contact per region | Y | P | **Y** | n | n | n | **carry (honest form)** | Verida names a person per state. We are solo: one named route, no fake org chart. |
| 26 | Provider portal | Y | Y | Y | Y | Y | **gated** | **carry (D3)** | Built and hidden behind PORTAL_LIVE. |
| 27 | Provider complaint / appeal path | P | Y | Y | n | n | n | **carry** | Modivcare and Verida both give providers a formal escalation route. |
| 28 | Provider FAQ | Y | P | Y | P | Y | n | **carry** | Answers the six questions providers actually ask. |

### Member

| # | Category | MTM | Modi | Verida | SafeRide | Rndtrip | V1 | V2 | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 29 | How to book + eligibility | Y | Y | Y | Y | Y | P | **carry** | V1's /solutions/members is thin on the mechanics. |
| 30 | What to expect on the day | Y | Y | Y | Y | P | **Y** | **carry** | One of V1's genuine strengths. |
| 31 | Complaint / grievance path | Y | Y | Y | P | n | n | **carry** | MTM publishes a dedicated DC complaints number; a Medicaid expectation. |
| 32 | Member guides per state or plan (PDF) | **Y** | Y | Y | P | n | n | **defer** | MTM publishes ~35 keyed trip-log PDFs. Only meaningful once we run a program. |
| 33 | Mileage reimbursement mechanics | **Y** | Y | Y | n | n | n | **skip** | Not a benefit we administer today. |
| 34 | Member portal / app | Y | Y | Y | Y | P | **gated** | **carry (D3)** | Built and hidden. |
| 35 | Plan directory (find your plan) | Y | P | P | **Y** | n | n | **defer** | SafeRide's ~80-plan directory is the pattern once we carry plans. |

### Facility / case manager, and company-general

| # | Category | MTM | Modi | Verida | SafeRide | Rndtrip | V1 | V2 | Reason |
|---|---|---|---|---|---|---|---|---|---|
| 36 | Facility landing page | Y | Y | Y | Y | **Y** | **Y** | **carry** | Roundtrip is strongest here; V1 already has /solutions/facilities. |
| 37 | Facility portal access route | Y | Y | Y | P | Y | n | **carry** | MTM uses a registration request, not self-serve. Good model for us. |
| 38 | Per-state / per-jurisdiction pages | **Y** | Y | Y | P | n | n | **CARRY (priority)** | MTM's state pages carry the real depth. This is our organic engine (P1c). |
| 39 | News / insights library | Y | Y | Y | Y | Y | n | **defer** | Real but expensive to sustain solo. Post-launch. |
| 40 | Careers | Y | Y | Y | Y | Y | n | **skip** | We are one person. A careers page would be theater. |
| 41 | Legal + policy set | Y | Y | Y | Y | Y | **Y** | **carry** | V1 already has privacy/terms/hipaa/accessibility. |
| 42 | Non-discrimination + language assistance notices | **Y** | Y | Y | P | n | n | **carry** | A Medicaid-program expectation V1 misses entirely. |
| 43 | Adjacent service lines / portfolio | Y | Y | P | n | n | n | **skip** | D2: NEMT-first. Broader markets stay modular and off-site. |

**Matrix headline: 43 categories found. V1 carries 10 fully and 6 partially; 27 are absent.** The absences
cluster in exactly three places: **provider requirements depth**, **compliance/security posture**, and
**per-state jurisdiction content**.

---

## 6b. PROVIDER-RESOURCE FINDINGS (input for P1b)

This records **only what competitors surface**. P1b does the primary-source state research; nothing here is
treated as authoritative about DC/MD/VA requirements.

- **Verida publishes the most complete provider onboarding kit found** (VERIFIED): a pre-application
  compliance checklist, a four-step credentialing sequence with what happens at each stage, insurance
  requirements at line-item specificity (carrier rating, listed covered vehicles), a seven-domain training
  syllabus, named service modes (ambulatory, wheelchair, stretcher, and in some programs more), and a named
  human contact per state with a direct mailto. It also publishes the honest gate most competitors hide:
  applications are reviewed against whether a **need exists** in that area.
- **MTM publishes state-level provider depth far exceeding its national pages** (VERIFIED), and critically
  **in our first market**: a DC Transportation Provider Manual, a DC provider FAQ, a DC daily-reports
  affidavit of compliance, and a dated roster of contracted DC providers. Its national provider pages, by
  contrast, name requirements without quantifying them.
- **MTM segments the supply side four ways and routes each differently** (VERIFIED) — transportation
  companies, individual/gig drivers (handed off to an affiliate brand entirely), and others. Providers already
  in network are told **not** to use the public form and to contact their assigned account manager.
- **Modivcare's national provider page has no requirements list at all** (VERIFIED); its one substantive
  provider manual is reached through a state section. Its training is portal-gated. It does publish a genuine
  loyalty layer (maintenance discounts, an NEMT-specific insurance program) and a provider complaint-and-appeal
  page inside a state section.
- **Rates are withheld by every subject** (VERIFIED across all five). Payment is described as *benefits*
  (faster payment, GPS-automated claims) rather than terms. No fee schedules anywhere.
- **Insurance figures seen on competitor sites are NOT verified requirements.** P1b must establish DC, MD and
  VA numbers from primary state sources. The owner-reported $1.5M payer figure and the strategic plan's VA CSL
  $300K-$1M range both remain **unverified** and must not be published until P1b confirms them.

---

## 6c. SIGN-IN PATTERNS (input for the D3 task)

| Subject | Placement | Wording | Audience split | Sign-up? |
|---|---|---|---|---|
| MTM | Third top-level nav item, plain link | `Sign In` | **No split in chrome** — the one link goes to the client/agency portal; the member portal lives on a separate hostname reached elsewhere | No |
| Modivcare | Top-level nav item with a single dropdown child | `Login` -> "Portal Logins & Information" | Split happens on an **interstitial page**, not in the nav | No |
| Verida | **Absent from the site chrome entirely** | none | Portals are reached from audience pages instead | No |
| SafeRide | **First-class nav dropdown; the dropdown IS the portal menu** | `Get Started` | **Four doors** (member, driver, care portal, plus utilities) | Member eligibility flow exists |
| Roundtrip | Far-right nav item past "Contact Sales" | `Login` | Single undifferentiated door; the rider door is effectively hidden | No |

**Findings for D3.** (1) **Nobody offers public sign-up** — B2B portal access is provisioned, which validates
our no-sign-up decision. (2) The **audience split is the real design question**, and the industry is evenly
divided: MTM/Roundtrip use one undifferentiated door, Modivcare defers the split to an interstitial, SafeRide
splits in the dropdown itself, and Verida omits sign-in from the chrome altogether. (3) **Our built surface
already matches the strongest pattern** (SafeRide's): a nav dropdown that is itself the portal menu with named
doors. D3 un-gates what we have rather than redesigning it. (4) SafeRide labels the menu `Get Started`, which
doubles as a conversion CTA; we should keep `Sign in` because our conversion CTA is already "Apply as
provider" and merging the two would blur an evaluator's path.

---

## 6d. VOCABULARY FINDINGS (mapped against D15)

The single most useful outcome of this lane. The industry does **not** share one self-description:

| Subject | Primary noun for itself | Register split observed |
|---|---|---|
| MTM | **"transportation broker"** — leads with it on payer pages | Shifts to "transportation management company" on the corporate About page; "broker" absent there |
| Modivcare | **"provider"** — "leading provider of non-emergency medical transportation" | Never uses "broker" anywhere fetched, while third parties label it a broker by default |
| Verida | **"NEMT management company"** | Switches to "broker" precisely when addressing transport providers; regulatory pages say "brokerage" |
| SafeRide | **"platform" / "solution" / "network"** | Uses "broker" only as the thing it is *not* ("antiquated ... broker model") |
| Roundtrip | **"technology company" / "digital transportation marketplace"** | Runs an FAQ entry specifically to disclaim being a transportation company |

**Mapped against D15:**

1. **Our canonical wording is corroborated, not invented.** Verida — the closest analogue in operating model,
   and a company that actually operates in **Washington DC**, our first market — self-describes as an
   **"NEMT management company"**. Our "medical transportation management organization" sits in the same family.
   MTM reaches for the same noun ("transportation management company") whenever it tells its corporate story.
2. **"Broker" is live industry vocabulary, not a slur** — the largest incumbent leads with it to payers. But it
   carries denial-and-no-show baggage with members and legislators, which is visibly why Modivcare and SafeRide
   route around it. **Our §7.2 ban on "broker" as a self-description stands**, and this research explains the
   cost of the alternative: Modivcare's escape produced a genuine collision, calling itself a "provider" while
   its contracted network is also "providers".
3. **D15's no-negation rule is validated by watching Roundtrip do the opposite.** Roundtrip publishes an FAQ
   entry to disclaim being a transportation company, and describes its network only in adjectives. That is
   exactly the posture D15 forbids for us: it disowns the service and leaves no one accountable for the trip.
   Our line — trips delivered through a credentialed network, and **we answer for every trip** — is the
   differentiated position precisely because the modern entrants vacate it.
4. **Nobody in the set claims responsibility for the trip.** Not one of the five says, in its own voice, that
   it answers for the outcome. That is an open lane.

---

## 6e. PAGE-COUNT RECOMMENDATION — **DRAFT FOR P2 FREEZE (not frozen)**

**Recommendation: 24 pages** (V1 has 13). Derived from the matrix: carry what V1 has, add only where the
matrix shows a real, honestly-fillable gap. Anything requiring claims we cannot yet prove is deferred, not
scoped.

**Carried from V1 (13, all repositioned to D1/D15 language)**

1. `/` home · 2. `/platform` · 3. `/solutions/mcos` · 4. `/solutions/providers` · 5. `/solutions/facilities`
· 6. `/solutions/members` · 7. `/about` · 8. `/contact` · 9. `/apply` · 10. `/privacy` · 11. `/terms` ·
12. `/hipaa` · 13. `/accessibility`

**New (11)**

14. `/security` — compliance and security posture (matrix #3, #15). The largest payer gap. Flag-gated content.
15. `/providers/requirements` — the published requirements checklist (matrix #18). Our biggest content gap.
16. `/providers/credentialing` — the numbered credentialing sequence (matrix #20).
17. `/providers/dc` — DC provider guide (matrix #38, P1b-sourced).
18. `/providers/maryland` — MD provider guide.
19. `/providers/virginia` — VA provider guide.
20. `/providers/faq` — the six questions providers actually ask (matrix #28).
21. `/faq` — general FAQ across audiences.
22. `/notices` — non-discrimination + language assistance (matrix #42; Medicaid expectation).
23. `/members/how-it-works` — booking mechanics, eligibility, complaint path (matrix #29, #31).
24. **Sign-in surface un-gated** (D3) — not a new page, a chrome change; listed so P2 counts it.

**Explicitly deferred (not scoped, with reasons):** case studies and named clients (no clients yet), ROI
calculators and pricing (no real data), member guides per plan and mileage reimbursement (not a program we
run), news/insights (unsustainable solo pre-launch), careers (one person), adjacent service lines (D2 keeps
NEMT-first).

**The frozen list only shrinks.** Per P2, new ideas go to a roadmap section rather than expanding this.


---

# PART 2 — CRAFT LANE: EXEMPLAR DISSECTION

**Task #7 (P1a craft lane). Subjects: Stripe (primary, full anatomy), Linear (secondary, motion only).**
Part 1 asked *what pages exist and why*. Part 2 asks *how the surface is actually built*, so that P2 and P3
inherit technique rather than vibes.

## 7. METHOD, AND WHAT THIS PASS CANNOT SEE

**Instrumentation.** Headless Chromium via Playwright, viewport 1440x900, run 2026-08-17. Each subject was
loaded twice, once normally and once with `prefers-reduced-motion: reduce`, with a `getContext` interceptor
installed before page scripts so canvas context requests could be captured with their attributes. Section,
nav, footer, and type measurements are `getComputedStyle` and `getBoundingClientRect` readings taken after a
full scroll pass to trigger lazy content.

**Source law applies.** Everything in Part 2 is **VERIFIED (observed 2026-08-17)** unless labelled otherwise:
it is a direct machine reading of the live page, not recall. Where an instrument could not see something, that
is stated as a limit rather than filled in.

**Four limits, stated up front:**

1. **The harness has software WebGL only.** A control canvas proves WebGL is *available* here
   (`getContext("webgl")` returns a context; renderer reports `ANGLE (Google, Vulkan 1.3.0 (SwiftShader
   Device (Subzero)), SwiftShader driver)`). It is software-rasterized, not GPU. So this pass can observe what
   Stripe does when it *declines* a weak GPU, and cannot observe what it renders when it accepts a strong one.
2. **Stripe's stylesheets are cross-origin and unreadable** (`cssRules` throws). Its
   `prefers-reduced-motion` CSS therefore **could not be inspected in either direction**. No claim is made
   about whether Stripe ships reduced-motion CSS. Linear's and Maze's sheets are same-origin and fully
   readable, so absences recorded for them are real absences.
3. **Transfer and request counts are single-run with an uncontrolled HTTP cache.** Both runs of a subject
   share a browser, so the second run may be warm. Treat the byte figures as indicative magnitude, never as
   a measurement. The direction is not even consistent (Linear's reduced-motion run transferred *more*), which
   is itself evidence of run-to-run noise.
4. **Section enumeration is selector-dependent.** On pages that do not use `<section>` (Stripe `/enterprise`,
   ElevenLabs) the probe collapsed the page into one block. Where that happened it is reported as a probe
   limit, not as "the page has one section".

---

## 8. STRIPE — FULL ANATOMY

### 8.0 PRIORITY QUESTION: how does the gradient hero degrade?

**The premise needed correcting, and the correction is the finding.**

**stripe.com's hero is not WebGL today.** The hero wave is a pre-rendered raster image. Inside
`.hero-wave-animation` the probe counted **0 canvas, 0 svg, 0 video, 1 img**. The DOM is:

```
.hero-wave-animation
  .hero-wave-animation__layout
    .hero-wave-animation__contents
      .hero-wave-animation__static      <- transform: matrix(1,0,0,1,-696,-487.5)
        <picture>
          <source media="(min-width: 1264px)">                        wave-fallback-desktop.png?w=1392
          <source media="(min-width: 640px) and (max-width: 1263px)"> wave-fallback-tablet.png?w=1248&fm=webp
          <source media="(max-width: 639px)">                         wave-fallback-mobile.png?w=624&fm=webp
          <img alt="" loading="auto" decoding="auto">                 1392x975 natural, q=60
```

Stripe's own asset filenames are **`wave-fallback-desktop.png`, `wave-fallback-tablet.png`,
`wave-fallback-mobile.png`**, served from `images.stripeassets.com` (Contentful). The wrapper class is
`__static`. Stripe named this path "fallback" and "static" itself. That is the blueprint stated in their
vocabulary, not mine.

**Three details worth stealing:** the image is **art-directed at three breakpoints** (different crops, not one
image scaled), delivered as **WebP at `q=60`** (aggressive compression is invisible on a soft gradient, so the
quality budget is spent where the eye cannot audit it), and carries **`alt=""`** so it is correctly absent
from the accessibility tree. It is positioned by a **translate on an oversized image** rather than by
background-size trickery.

**The capability gate is the real prize.** The only canvas on the homepage is `squeezy-carousel__canvas`
(1232x460) at document Y ~11,676, deep inside the "What's happening" section. Intercepting its context
requests captured this exact ladder:

| # | Request | Attributes | Result |
|---|---------|-----------|--------|
| 1 | `getContext("webgl")` | `alpha:false, antialias:false, depth:false, stencil:false, failIfMajorPerformanceCaveat:true, powerPreference:"high-performance"` | **null** |
| 2 | `getContext("experimental-webgl")` | same attributes | **null** |
| 3 | `getContext("2d")` | none | **granted** |

**The discriminator is `failIfMajorPerformanceCaveat: true`, not the absence of WebGL.** Proven with a
control canvas created in the same document at the same moment:

| Control request | Result |
|---|---|
| `getContext("webgl")` plain | **true** |
| `getContext("webgl", {failIfMajorPerformanceCaveat: true})` | **false** |
| `getContext("webgl", {powerPreference: "high-performance", failIfMajorPerformanceCaveat: true})` | **false** |

WebGL works in this environment. Stripe **refuses it anyway** because the browser would only hand back a
software rasterizer. This is voluntary degradation: rather than render a GPU effect slowly on a weak machine,
Stripe declines the context and takes a cheaper path. `antialias:false` and `depth:false` and `stencil:false`
in the same request show the effect is a flat 2D shader with no depth buffer, requested as cheaply as possible.

**So the full degradation ladder Stripe ships is four rungs, and we can see three of them:**

1. **Strong GPU** — WebGL granted, live effect. *Not observable in this harness (limit 1).*
2. **Weak or software GPU** — WebGL deliberately refused via `failIfMajorPerformanceCaveat`. **Observed.**
3. **No WebGL at all** — falls through `experimental-webgl` to a **2D canvas context**. **Observed.**
4. **Hero specifically** — never gambles at all; ships a named, art-directed, responsive static image.
   **Observed.**

**Reduced motion:** the hero is byte-identical between the normal and reduced-motion runs, because a static
image has nothing to reduce. The logo carousel container reports `animation-name: none` on both the container
and its child in both runs, so the marquee is not CSS-keyframe driven. The only named animation running at rest
is `detect-scroll` with a `null` duration, which is the CSS-scroll-timeline-as-scroll-sensor trick rather than
a visual effect. Whether Stripe suppresses anything else under reduced motion **cannot be determined** (limit 2).

> **VERDICT — TAKE, and it resolves an open question for us.** Our morph, spine, van, and ambient map are all
> hand-built SVG and CSS, which is rung 4 by construction: our "fallback" and our "effect" are the same
> artifact, so we have no degradation cliff to fall off. Stripe's ladder tells us the *right* answer if we ever
> reach for GPU work: gate it behind `failIfMajorPerformanceCaveat: true`, keep a named static asset, and never
> put the gamble in the hero. **Recorded as the standing rule for any future canvas or WebGL work on this site.**

### 8.1 Homepage, section by section

Thirteen sections survived the >80px filter, measured after a full scroll.

| # | Height | Background | Heading | Content |
|---|--------|-----------|---------|---------|
| 1 | 685 | `#ffffff` | Financial infrastructure to grow your revenue | 1 img, 38 svg, 30 links |
| 2 | 2196 | `#ffffff` | Flexible solutions for every business model | 12 img, 41 svg |
| 3 | 560 | `#ffffff` | *(none)* | 2 img |
| 4 | 977 | `#ffffff` | The backbone of global commerce | `stats-section--time-sunset` |
| 5 | 4610 | `#ffffff` | Powering businesses of all sizes | 18 img, 60 svg, 31 links |
| 6 | 1388 | transparent | Transform your enterprise with agile financial infrastructure | 4 img, 23 svg, 12 links |
| 7 | 1026 | transparent | Build a foundation for your startup | 9 img, 22 svg, 11 links |
| 8 | 624 | transparent | *(none)* `startups-carousel` | 8 img, 18 svg |
| 9 | 1533 | transparent | Make your SaaS platform a complete financial operating system | 5 img, 15 svg |
| 10 | 2341 | **`rgb(13,23,56)` = `#0d1738`** | Reliable, extensible infrastructure for every stack | 1 img, 4 svg, 5 links |
| 11 | 1741 | `#ffffff` | What's happening | 9 img, 20 svg, **1 canvas** |
| 12 | 701 | transparent | What's happening *(nested row)* | 8 img, 18 svg |
| 13 | 380 | `rgb(248,250,253)` = `#f8fafd` | *(none)* | pre-footer |

**PURPOSE.** A single page that sells to five different buyers in sequence (general, enterprise, startup,
carousel of startups, SaaS platform) before turning to infrastructure credibility and then news.

**STRUCTURE.** Audience-segmented middle. Sections 6, 7, and 9 are the same shape repeated per audience
(`section-row section-row-gap`), which is the pattern our own audience triage already gestures at. The
document is 14,644px tall.

**TECHNIQUE.** Near-total white. **Exactly one dark chapter in thirteen sections** (#10, deep navy `#0d1738`),
and it is spent on the infrastructure claim, the most technical and least emotional content on the page. The
pre-footer steps to a very light blue-grey rather than jumping straight from white.

**DEGRADATION.** 54 images of which 51 are `loading="lazy"`; only the hero and near-hero images load eagerly.

> **VERDICT — VALIDATES OUR TONAL MAP, with one adjustment to consider.** Stripe spends its single dark
> chapter on *infrastructure credibility*. We spend three on hero, morph, and footer. Ours is defensible
> because our ink hero is the brand opening and our footer is the terminus, but the observation is worth
> holding: **the highest-authority use of dark is a technical proof section, not decoration.** Our Stop 3
> morph already does this. Also note the light-grey pre-footer step (#13): Stripe buffers *into* its footer
> the way our law buffers *out of* ink.

### 8.2 The nav system

| Property | Observed |
|---|---|
| `<nav>` landmark count | **1** |
| Header `position` | **`relative`** (not sticky, not fixed) |
| Header background | `rgba(0,0,0,0)` transparent |
| Header `backdrop-filter` | `none` |
| Header height | 76px |
| Dropdown triggers | 4 `<button aria-expanded>`: Products, Solutions, Developers, Resources |
| Plain links | Pricing, Sign in |
| CTAs | Start now, Contact sales |
| Mobile | includes a `Back` button (drill-down, not accordion) |
| Open panel | 1262 x 630px, **33 links** |
| Panel transition | `clip-path, max-height, opacity, transform, height` at `0.2s, 0.2s, 0.3s, 0.3s, 0.3s, 0.3s` |

**PURPOSE.** Route four audiences into a very deep catalogue without a mega-menu that feels like a sitemap.

**STRUCTURE.** Triggers are real `<button>`s carrying `aria-expanded`, and the panel is a single shared
container that re-shapes per trigger. Thirty-three links in one panel is far denser than ours (our largest is
well under half that).

**TECHNIQUE — the one to steal.** The panel animates **`clip-path` and `height`/`max-height` together with
opacity and transform**. That combination is what produces the famous Stripe morph: the container's *shape*
interpolates between the old and new panel size while the contents cross-fade, so switching from Products to
Solutions reads as one object changing shape rather than two panels swapping. Two durations are in play: 200ms
for the clip and max-height, 300ms for opacity, transform, and height.

**DEGRADATION.** Not determinable (limit 2). The header being `position: relative` means there is no scrolled
state to degrade at all.

> **VERDICT — PARTIALLY TAKE.**
> - **TAKE the shape-morph vocabulary.** Our Radix Indicator already slides a magic line between triggers, but
>   our panel currently grows origin-aware from its trigger and does not interpolate between *sizes* when the
>   user moves from one open menu to another. Adding a height/clip interpolation on trigger-to-trigger movement
>   is the single highest-value nav upgrade available, and it stays inside our 250ms ceiling if we adopt
>   Stripe's split (200ms shape, 250ms contents, capped).
> - **REJECT the non-sticky header.** Stripe can afford `position: relative` because its page is a catalogue
>   people scan. Ours is a decision path with a persistent Apply action; our sticky nav stays.
> - **CONFIRMS our one-landmark law.** Stripe ships exactly one `<nav>`, which is what our Stage-15
>   `NavigationMenu.Root asChild` fix was protecting. Independent corroboration that the rule is normal
>   practice, not our idiosyncrasy.
> - **REJECT the density.** 33 links per panel serves a catalogue. Ours serves a choice.

### 8.3 The footer system

| Property | Observed |
|---|---|
| Links | **85** |
| Height | 1078px |
| Background | `rgb(248,250,253)` = `#f8fafd` (very light blue-grey) |
| Region / language control | 1 |
| Column headings | **not resolvable by this probe** (their headings are not the immediate previous sibling of each `<ul>`; the count is not zero, it is unmeasured) |

**PURPOSE.** Terminal sitemap plus jurisdiction switching.

**TECHNIQUE.** The footer is **light, not dark.** Stripe ends the page on a near-white blue-grey, one step
down from the white body, with a light-grey section (#13) buffering into it.

> **VERDICT — DO NOT TAKE; our divergence is deliberate and we should record why.** Our footer is the ink
> terminus and it is one of only three ink chapters. Stripe's light footer works because Stripe's page is a
> catalogue that should feel like it continues; ours is a decision path that should feel like it *lands*.
> Stripe at 85 links is a sitemap; ours is a close. **This is a considered divergence, and Part 2 is where we
> log that we looked at the alternative and rejected it.** The one element worth importing is the
> **jurisdiction control**: Stripe surfaces region in the footer, and our DC/MD/VA service area is the same
> class of information. Worth a P2 question, not a change today.

### 8.4 Deep page — `/enterprise`

**Why this page.** It is the closest structural analogue we have to `/platform` and to our MCO and facility
audience pages: one long page selling to a committee reader who did not arrive ready to buy, where the CTA is
a conversation rather than a signup.

| Property | Observed |
|---|---|
| Title | Enterprise Payment Solutions for Large Businesses \| Stripe |
| Document height | **14,184px** |
| Sticky in-page sub-nav | **false** |
| Dark usage | **card-level, not section-level**: `AccentedCard__background` `rgb(12,46,78)` 389px; `EnterpriseHubStatsCarousel__waveContainer` `rgb(0,0,0)` 800px |
| CTA vocabulary | **Contact sales** (dominant, repeated), Start now, Get support, Startups |
| Claim style | "Grow payment volume 2x faster on average" (hedged with "on average") |

**STRUCTURE.** Section headings run: Build the next era of your enterprise / Global payments / Platform
payments / Finance automation, then a stats carousel.

**TECHNIQUE.** Dark is applied to **cards inside light sections** rather than to whole bands. That is a
different tool from our tonal map: it lets a page raise emphasis locally without spending a chapter.

**DEGRADATION — and a defect we should not copy.** The page contains **20 `<h1>` elements**. The list includes
`H1: Stripe logo`, and the nav panel's group labels each appear as `H1` twice over (`Payments`, `Revenue`,
`Money management`, `Platforms and marketplaces`, `More`), alongside genuine section titles. On the homepage
the hero ships **two** `h1`s, `hero-section__title--background` and `hero-section__title--foreground`, a
layered treatment for the colour effect.

> **VERDICT — MIXED, and the failure is the more useful half.**
> - **TAKE the dark-card idea** as a way to raise emphasis on interior pages without adding a fourth ink
>   chapter. This is a real gap in our system: today we have only "whole band goes ink" or "stay light".
> - **TAKE the hedged-claim grammar.** "on average" is doing legal work in that sentence. Our copy gate bans
>   the statistic outright, which is stricter and stays, but the *construction* is worth noting for the day a
>   real number exists.
> - **REJECT, loudly, the heading structure.** 20 `h1`s including the logo and duplicated nav labels is a
>   genuine accessibility defect on a site we otherwise treat as an exemplar. Our §2 sequential-heading law
>   (h1 -> h2 -> h3, never picked for size) is *better than Stripe's*. **Exemplars are dissected, not
>   worshipped**, and this is the proof: world-class visual craft and a broken document outline ship together
>   all the time.
> - **NOTE the absent sub-nav.** 14,184px with no sticky anchor nav. Our `/platform` ships a scrollspy
>   sub-nav at the same page length. We keep ours; a committee reader comparing four capabilities needs to
>   jump. Divergence logged, not corrected.

### 8.5 Typography

| | Stripe |
|---|---|
| Fonts actually loaded | **`sohne-var` only** (variable, weight axis 1-1000). `SourceCodePro` present but `unloaded`. |
| Body | 16px |
| h1 | 48px / **weight 300** / line-height 55.2px (1.15) / letter-spacing -0.96px (-0.02em) |
| h2 | 32px / weight 300 / lh 35.2px (1.1) |
| h3 | 26px / weight 300 / lh 29.12px (1.12) |
| Lead paragraph | 32px / weight 300 |
| Body paragraphs | 16-18px, line-height 1.4 |
| Measure | **42-56 characters** |

**TECHNIQUE.** One variable font for the entire site, which is why 274 requests still feel fast: the type
system costs a single file. Display sizes are set at **weight 300**, light rather than bold, with negative
tracking, which is where the "expensive and calm" quality comes from. Line-height at display sizes is 1.1-1.15,
much tighter than body.

> **VERDICT — MOSTLY CONFIRMS US, with two concrete deltas.**
> - **Our two-family system (Bricolage display + Hanken body) stays.** Stripe's one-family approach depends on
>   a licensed variable face with a huge weight axis doing all the contrast work. Our contrast comes from the
>   family pairing instead. Both are valid; ours is already built and already passes.
> - **DELTA 1, light display weight.** Stripe sets 48px headings at weight 300. Worth a test on our display
>   face, because light-weight large display is the single strongest "premium" signal in this sample and it
>   costs nothing.
> - **DELTA 2, measure.** Stripe runs 42-56 characters. Our §2 law mandates 65-75ch (`max-w-prose`). Stripe's
>   is *narrower than our floor.* Their content is scannable marketing fragments; ours includes genuine prose
>   on `/about` and the legal pages, which needs the wider measure. **No change, but the law should note that
>   65-75ch is a prose rule and short marketing columns may sit narrower.**
> - **CONFIRMED, tight display leading and negative tracking.** Our `tracking-tight` at `-0.04em` is actually
>   *more* aggressive than Stripe's -0.02em. Ours is fine on Bricolage; recorded for reference.

---

## 9. LINEAR — MOTION ONLY

> **STANDING NOTE: Linear's dark register is NOT taken.** Linear is a dark-mode-native product site. Our tonal
> map keeps ink to three chapters and everything else light. Nothing in this section is an argument to darken
> the site. Linear is read here **for motion vocabulary only**, and its type and colour are recorded solely so
> the motion measurements have context.

| Measurement | Normal | Reduced motion |
|---|---|---|
| Running animations at rest | **139** | **103** |
| Named CSS animations | `grid-dot-0-0-agent`, `grid-dot-0-1-agent`, `grid-dot-0-2-agent` ... (2 each) | same set, still running |
| WAAPI animations | 36 | drops out of the top ten |
| Duration min / median / max | 500 / 2800 / 3200 ms | 1200 / 2800 / 3200 ms |
| `will-change` elements | **4** (of ~4000 sampled) | 4 |
| Transformed elements | 91 | 91 |
| Filtered / of which blurred | 54 / 9 | 54 / 9 |
| `prefers-reduced-motion` CSS rules | **1 of 1359** | 1 of 1346 |

**PURPOSE.** Ambient aliveness. The page is never fully still, but nothing demands attention.

**STRUCTURE.** The signature effect is a **programmatically generated dot grid**: animations are named
`grid-dot-{row}-{col}-agent`, one keyframe animation per cell, two animations per cell. The grid is not one
animation on one element; it is dozens of individually scheduled cell animations, which is what allows wave
and ripple patterns to propagate across it.

**TECHNIQUE — three things worth taking.**
1. **Long durations.** Median 2800ms, max 3200ms. Ambient motion is slow motion. Anything that loops must be
   too slow to track, or it becomes a distraction. Our current motion ceiling is 300ms for page content and
   250ms for nav, which is correct for *response* motion. **We have no vocabulary at all for ambient motion,
   and this is where the 2-3 second band belongs.**
2. **`will-change` restraint.** Four elements out of roughly four thousand. Linear runs 139 simultaneous
   animations while promoting almost nothing to its own layer. This is the opposite of the usual advice and it
   is correct: `will-change` is for imminent transitions, not for permanent residents.
3. **Per-cell scheduling.** One animation per grid cell, offset, rather than one animation over a group.

**DEGRADATION — and this is a failure, recorded as such.** Linear's stylesheets are **same-origin and fully
readable** (1359 rules enumerated), so this is a real absence and not an inspection limit. Of those 1359 rules,
exactly **one** sits inside a `prefers-reduced-motion` media query, and it is not Linear's:

```
.sonner-loading-bar, [data-sonner-toast], [data-sonner-toast] > * {
  transition: none !important; animation: auto ease 0s 1 normal ...
}
```

That is `sonner`, a third-party toast library, shipping its own accessibility. **Linear ships no first-party
reduced-motion CSS.** Something JavaScript-side does respond, since the animation count falls from 139 to 103
and the shortest duration rises from 500ms to 1200ms, but **103 animations still run** for a user who has
explicitly asked their operating system for less motion, and the dot grid is among them.

**Type, recorded for context only, not adopted:** Inter Variable and Berkeley Mono; h1 64px at weight **510**
with line-height 64px (ratio 1.0) and letter-spacing -1.408px; h2 48px/510; h3 20px/590; body 15px/400/lh 24px.
The weights 510 and 590 are custom variable-axis values rather than the standard 500 and 600.

> **VERDICT — TAKE THE VOCABULARY, REJECT THE POSTURE.**
> - **TAKE** long ambient durations (2-3s), `will-change` restraint, and per-cell offset scheduling.
> - **REJECT** the reduced-motion posture entirely. Our §0 non-negotiable requires every motion surface to have
>   a static end-state and the global `@media (prefers-reduced-motion: reduce)` block to zero durations and
>   delays. **Our law is materially stronger than Linear's implementation**, and this measurement is the
>   evidence. Any ambient system we build from Linear's vocabulary inherits *our* reduced-motion rule, which
>   means it must be capable of stopping dead, not merely slowing down.
> - **NOTE the 15px body.** Below our 17-18px marketing-body law and below our 14px small-text floor for its
>   secondary text. Not taken.

---

## 10. THE PERFORMANCE BAR

**Label: observed 2026-08-17, single run, headless Chromium, 1440x900, unthrottled home broadband,
uncontrolled cache state. This is not lab-grade. No throttling profile, no percentile, n=1.** It establishes an
order of magnitude, nothing finer. Byte counts marked "not measurable" are cases where responses carried no
`content-length` header; reporting those as zero would be a lie.

| | Stripe | Linear | Maze | ElevenLabs |
|---|---|---|---|---|
| Transfer | ~2,942 KB | ~1,474 KB | ~2,631 KB | ~1,498 KB |
| Requests | 274 | 553 | 58 | 134 |
| Script requests | not isolated | **372** | not isolated | not isolated |
| JS bytes | 952 KB (127 files) | **not measurable** (no `content-length`) | not isolated | not isolated |
| DOMContentLoaded | 1,956 ms | 2,686 ms | 4,440 ms | 3,799 ms |
| Network idle | 5,468 ms | 3,810 ms | not captured | not captured |
| Document height | 14,644 px | 10,898 px | 8,323 px | 10,758 px |
| Images / lazy | 54 / 51 | 32 / 30 | 95 / n/a | 46 / n/a |

**Reading it honestly.** Every one of these sites is heavy. Stripe transfers roughly 2.9 MB and takes about
5.5 seconds to reach network idle. Linear issues 553 requests, 372 of them scripts. Maze takes 4.4 seconds to
DOMContentLoaded. **Being an exemplar of craft does not make a site fast**, and the reflex of copying an
admired site's techniques wholesale imports its weight as well.

**THE BAR WE SET.** These numbers are a ceiling to stay far below, not a target to approach. Our site is a
static Next.js export with hand-built SVG, no video, no WebGL, and one animation library. Proposed and
recorded here for P2 to ratify:

| Metric | Nexo bar | Versus this sample |
|---|---|---|
| Total transfer, any route | **<= 600 KB** | ~5x under Stripe |
| JS transferred | **<= 150 KB** | ~6x under Stripe |
| DOMContentLoaded | **<= 1,200 ms** | ~1.6x under Stripe's best |
| Requests | **<= 60** | comparable to Maze, far under Linear |
| Lighthouse Performance | **>= 98** | already achieved at Stage 11 |

The existing Stage-11 result (Performance >= 98, SEO 100) says we are already inside this envelope. The bar's
job is to stop P2 and P3 from spending it. **Every new dependency, font, or effect is measured against this
table before it ships**, and the measurement is re-run at deploy, consistent with the §10.6 recount law.

---

## 11. SYNTHESIS

### 11a. Nav and footer verdicts

**Nav.**

| Decision | Verdict | Basis |
|---|---|---|
| One `<nav>` landmark | **KEEP** | Stripe ships exactly 1; corroborates our Stage-1 and Stage-15 rule |
| Sticky header | **KEEP ours, diverge from Stripe** | Stripe is `position: relative`; our page is a decision path with a persistent Apply |
| Panel shape morph | **ADOPT (highest-value nav upgrade)** | Stripe transitions `clip-path` + `height`/`max-height` + opacity + transform, 200ms shape / 300ms contents |
| Panel density | **REJECT** | 33 links per panel is a catalogue; ours is a choice |
| Real `<button aria-expanded>` triggers | **KEEP** | Same as ours via Radix |
| Mobile drill-down with Back | **NOTE** | Stripe drills; we accordion. Ours is simpler and already passes the cube. No change without a reason. |

**Footer.**

| Decision | Verdict | Basis |
|---|---|---|
| Ink terminus footer | **KEEP, as a logged divergence** | Stripe ends light (`#f8fafd`, 85 links, sitemap-shaped). Ours ends dark because our page must land, not continue. Considered and rejected, not overlooked. |
| Link count | **KEEP ours far lower** | 85 is a sitemap |
| Jurisdiction control in footer | **OPEN QUESTION for P2** | Stripe surfaces region there; our DC/MD/VA service area is the same class of fact |
| Light pre-footer buffer step | **ALREADY OURS** | Stripe steps white -> `#f8fafd` -> footer; our law already forbids ink -> white without a tint buffer |

### 11b. Typography direction

Our system holds. Bricolage Grotesque for display against Hanken Grotesk for body remains correct, and it
solves by family pairing what Stripe solves with one variable face and what Linear solves with custom weight
axes. Three specific movements come out of this pass, none of them structural:

1. **Test light display weight.** Stripe sets 48px at weight 300 and ElevenLabs sets 48px at weight 300, the
   same value from two independent premium sites. This is the strongest single correlation in the sample.
   Worth a lab comparison on Bricolage before P3.
2. **Clarify the measure law.** §2 mandates 65-75ch. Stripe runs 42-56ch, ElevenLabs sets 18px body. The
   resolution is that **65-75ch is a law for prose** (`/about`, the legal pages) and short marketing columns
   may legitimately sit narrower. This is a clarification to §2, not a relaxation.
3. **Hold the body size.** ElevenLabs at 18px sits inside our 17-18px law; Linear at 15px and Stripe at 16px
   sit below it. Two of four are below us and both are product-led sites talking to engineers. Our readers
   include case managers and members. **Our floor stays.**

Tight display leading (1.1-1.15) and negative display tracking are confirmed across every subject and already
match our practice.

### 11c. `nexo-motion` candidates

The gap this pass exposes is specific: **our motion system has a response vocabulary and no ambient
vocabulary.** Our ceilings (300ms content, 250ms nav) are correct for motion that answers an action. Linear's
2-3 second band is for motion that occupies a room. Four candidates, each one bound to our §0 reduced-motion
non-negotiable, meaning each must have a static end-state and must stop dead, not slow down:

| # | Candidate | Mechanism | Duration band | Where it would live | Reduced motion |
|---|---|---|---|---|---|
| 1 | **`nexo-drift`** | Per-node offset opacity/transform cycle across the AmbientMap dot grid, scheduled per cell in Linear's `grid-dot-{r}-{c}` manner, amplitude far below Linear's | 2400-3200ms | AmbientMap, all tones | Static grid, current appearance exactly |
| 2 | **`nexo-shape`** | Nav panel size interpolation on trigger-to-trigger movement: `clip-path` + `height` at 200ms, contents at 250ms | 200 / 250ms | Desktop nav panel | Instant swap, no interpolation |
| 3 | **`nexo-settle`** | Existing play-once settle grammar (AssistScene, premium terminus) formalised as a named primitive rather than re-authored per component | <= 300ms | Any IO-gated arrival | Final frame, immediately |
| 4 | **`nexo-accent-card`** | Local dark card on a light section, from Stripe `/enterprise`, so interior pages can raise emphasis without a fourth ink chapter | static, no motion | Interior page proof blocks | n/a |

**Governing rules for all four**, carried from the two subjects:

- **`will-change` is for imminent transitions only.** Linear runs 139 animations with `will-change` on 4
  elements. Ambient residents never get a permanent layer.
- **Ambient motion is slow.** If a loop can be tracked by eye, it is too fast.
- **Transform and opacity only** (our existing §5 rule; nothing here needs an exception).
- **Every candidate ships its static end-state first**, and the animated layer is added on top. This is
  Stripe's hero lesson generalised: the fallback and the artifact should be the same object wherever possible.

Candidate 2 (`nexo-shape`) is the highest value per unit of risk and is recommended first. Candidate 4 is not
motion at all but falls out of the same dissection and closes a real gap in the tonal system.

### 11d. Maze and ElevenLabs

**Maze** (observed 2026-08-17, 1440x900). Maze sets its h1 at **130px, weight 300, letter-spacing -11.7px**
(about -0.09em) in a face named `Phonic`, which is the most extreme display typography in the sample and the
clearest demonstration that scale plus light weight plus tight tracking reads as confidence rather than
shouting. The page is 8,323px over eight sections, nearly all transparent-backgrounded with a single warm
off-white band, and it uses **`oklch()` colour in production** (`oklch(0.967 0.005 95.1)` for that band and the
footer), which is worth noting as evidence that the modern colour space is shippable today. It carries 95
images, no canvas and no video, so its entire visual identity is raster and SVG. Two failures are worth
recording precisely because the surface is so accomplished: the page has **zero `<nav>` landmarks**, and
across four fully readable stylesheets and 473 rules there is **not one `prefers-reduced-motion` rule**.
Animation count does fall from 19 to 11 under reduced motion, so JavaScript responds where CSS does not.
**Verdict: take the display-type confidence and the oklch note; reject the landmark and reduced-motion
posture, both of which our law already prevents.**

**ElevenLabs** (observed 2026-08-17, 1440x900). The most disciplined page in the sample and the closest to our
own values. At rest it runs **zero animations** and sets `will-change` on **zero elements**, while still having
105 transformed elements, meaning the composition is built with transforms but nothing is in motion until
something is asked of it. Body type is **Inter at 18px**, which sits inside our 17-18px marketing-body law, and
the h1 is 48px at weight 300 in a custom face named `Waldenburg`, the same light-display value Stripe uses. It
ships **one `<nav>` landmark**. Its reduced-motion approach is the technique most worth stealing: rather than
writing `prefers-reduced-motion` overrides to switch animation *off*, it uses Tailwind's **`motion-safe:`
variant to switch animation *on***, so the observed rules read `.motion-safe\:tw-transition-\[height\,opacity\]`
and `.motion-safe\:tw-duration-300`. **Motion becomes opt-in at the utility level, which makes the accessible
path the default and forgetting impossible.** Note the inspection limit: only 4 of 9 stylesheets were readable,
so 3 rules is a floor and not a total. **Verdict: strongest candidate for adoption in the sample. The
`motion-safe:` inversion should be evaluated for our Tailwind config in P2**, because it converts our
reduced-motion law from something a developer must remember into something the class names enforce.

---

## 12. PART 2 CLOSE-OUT

**What Part 2 changes about our plan.** Nothing structural. The V1 site's architecture, tonal map, type system,
copy gate, and reduced-motion law all survive contact with four exemplars, and in two measurable respects
(sequential headings, reduced-motion enforcement) **our law is stronger than what these sites actually ship**.
What Part 2 adds is a motion vocabulary we did not have, one nav upgrade worth doing, one tonal tool
(`nexo-accent-card`) that closes a real gap, a performance bar with numbers in it, and a set of divergences
that are now logged as chosen rather than unexamined.

**What stays blocked.** Every candidate in 11c is a proposal for P2 and P3, not an approved change. Nothing
here is published to the site. The performance bar is proposed for P2 ratification.

**Standing rule added by this pass.** Any future canvas or WebGL work on this site must follow the Stripe
ladder: gate the GPU request behind `failIfMajorPerformanceCaveat: true`, ship a named art-directed static
asset as the resting state, and never place the gamble in a hero.

---

# §13 OWNER TASTE RECEIPTS — 2026-08-17 (P3 ranking pending; nothing rejected)

**Evidence tier: OWNER-STATED.** This section records the owner's own taste, in his words, lightly cleaned
from voice-to-text with meaning preserved. It is not a measurement and it is not a research finding. It sits
in its own tier for the same reason §5b of the provider research does: owner judgment is real input and must
never be silently promoted to a verified fact or to an approved decision.

**Status: NOTHING HERE IS RANKED AND NOTHING IS REJECTED.** P3 ranks these. A reference appearing below is a
receipt of what the owner responded to, not a commitment to build it.

## 13a. The candidate list

| # | Reference | Link | Why the owner picked it |
|---|---|---|---|
| 1 | **Greptile** | `mobbin.com/sites/greptile-02f7f385-cda0-48df-97cf-369a65a163b2/8aeb813a-2a94-4f34-8183-c24951b5d81e/preview` | Heavy technical register. The font and the technological confidence: "seems like they know what they're doing." He likes the animation and the technology feel even if this is not the final choice. |
| 2 | **Autosend** | `mobbin.com/sites/autosend-bdddcd67-7fe6-4128-b071-880d3d552c49/26abdd8b-4f28-4865-95af-7516342cbf15/preview` | The simplistic approach. The simplicity itself is the appeal, not a by-product of it. |
| 3 | **Amplemarket** | `mobbin.com/sites/amplemarket-40514184-d6e8-4d9c-898c-5ee5a56948d3/d2d1b0fc-24ac-4ec7-9aee-a1ea6a6f36db/preview` | A Stripe-adjacent skeleton made distinct by aggressive colour choice plus simplicity. |
| 4 | **Flighty** | `mobbin.com/sites/flighty-96152d40-1521-4e8e-995f-375d2fd13781/4ab7ed4d-2072-439f-a037-7d59bba7782a/preview` | The borderless feel: no visible containment, broad and flexible. He actively dislikes the visible-border convention he sees everywhere. |
| 5 | **Mercury** | `mobbin.com/sites/mercury-b76b83da-80e8-408c-a49f-7991b331735b/6ffa382b-213b-4cc4-a087-fb5c1e199b70/preview` | Good, simple. No explanation needed. |
| 6 | **Railway** | `mobbin.com/sites/railway-45b631c3-5efb-43bb-904c-cfeb03060fec/ba883b62-3d6c-456d-8916-2f9fa3f668be/preview` | A pure feel pick, chosen without reference to the codebase. |
| 7 | **Jasper** | `mobbin.com/sites/jasper-809ccfa6-b4b5-4f2c-8859-b83d2b680bca/1c1563ca-69a8-4c9a-b06d-5e5eb21c88c0/preview` | Looks good. A supporting reference rather than a lead. |

### The Railway convergence — VERIFIED, and larger than stated

The owner picked Railway on feel alone. **V1's design tokens are already documented as Railway-derived**, and
the dependency is deeper than the palette. Verified in `src/app/globals.css` on 2026-08-17:

| Line | What it credits to Railway |
|---|---|
| 5 | `/* ── Design tokens — refined Railway-inspired universal LIGHT theme` |
| 21 | `/* Borders — soft, low-contrast (Railway uses very subtle borders) */` |
| 76 | `/* Soft depth — gentle elevation, not heavy (Railway uses subtle shadows) */` |
| 194 | `/* ── Motion — Railway-informed micro-interactions` |
| 204 | `/* Press feedback — the control dips when actively pressed (Railway-style tactility). */` |

**The owner's eye independently returned to his own token file's ancestor**, across five separate systems
(colour, borders, elevation, motion, tactility) rather than one. He did not know he was doing it.

**This is the strongest available receipt for HARDEN-AND-EVOLVE over REPLACE.** The existing visual foundation
is not an accident he has outgrown; it is a foundation he still independently prefers when shown it cold and
unlabelled. A V2 that discards the token system would be discarding something that just passed a blind test.

**Ties to C3.** C3 on the consistency-defects register (SITE_GROUND_TRUTH §9) is *"subtle palette on cheap
monitors"*, awaiting P5 measurement. Note the tension honestly: the very Railway traits the owner is drawn to
(**"very subtle borders"**, **"gentle elevation, not heavy"**) are the traits C3 suspects of disappearing on a
low-quality display. **The taste receipt and the defect register are pointing at the same property from
opposite sides.** P5 measures it; P3 must not resolve it by guessing. The likely shape of the answer is
*keep the subtlety and raise the floor* — that is, preserve the Railway restraint while ensuring every
boundary that carries meaning still clears WCAG 1.4.11 at 3:1 on a bad screen, which our `--border-control`
token already does for controls and does not yet do everywhere.

## 13b. Themes — owner rulings for P2 and P3

> These are the owner's rulings, recorded verbatim in spirit. T1 and T5 are binding constraints on P3. T2, T3
> and T4 are workstreams and open decisions, not settled outcomes.

**T1 — COMBINATION OVER CLONING.** The industry has converged on one look. We synthesise pieces from many
references into something that is ours. **Copying any single site is banned.** This governs every reference in
13a and every verdict in Part 2: those documents are quarries, not blueprints. It also raises the bar on
Part 2's §11 candidates, which must be recombined rather than imported wholesale.

**T2 — FONTS ARE A WOUND.** The owner has never been satisfied with any font choice the site has had. His
words: *not bold enough*. He is drawn to the technical register he saw in Greptile. **P3 must include a
dedicated type-specimen workstream**, and it must be judged the way our §8 visual-verification law already
demands: candidates compared as **rendered screens at real sizes and weights**, never as names in a list.
Scope: heavier display weights than we currently ship, and a possible **mono or technical accent layer** as a
third voice. **The current pair (Bricolage Grotesque + Hanken Grotesk) competes as the incumbent, not as the
default winner.** Cross-reference Part 2 §11b, which found light-weight display at 300 correlating across
Stripe and ElevenLabs — that finding now sits in direct tension with "not bold enough", and the specimen pass
is where the tension gets resolved by eye rather than by argument.

**T3 — THE IMAGERY GAP IS REAL USER FEEDBACK.** People have told the owner the site lacks pictures. That is
unsolicited feedback from outside the build, which makes it the most valuable signal in this section.
**Opened as a P2 decision, "IMAGERY STRATEGY"**, with three options: premium photography (licensed or
commissioned), custom illustration, or animation-as-imagery. **The owner's stated lean is aggressive animation
over photographs**, but the lean does not close the decision: the gap must be answered deliberately, because
"we chose animation" and "we never got round to imagery" look identical to a visitor. Constraints that hold
whichever way it goes: high quality only, **no PHI and no real members**, and any sample or staged content
labelled as such (§7 copy gate).

**T4 — BORDERLESS FULL-BLEED.** A candidate layout language for P3, from the Flighty reference: sections that
breathe without visible containment; mobile-friendly without looking mobile-first. Note the direct collision
with 13a's Railway convergence, which is a *bordered* (if subtly bordered) system, and with C3. **Not
resolved here.** P3 decides whether borderless is the language, a treatment for particular sections, or a
rejected direction.

**T5 — KEEP OUR CREATIVITY.** The van, the DMV monuments and landmarks, and the signature details stay. This
is already law (§6.1 atmosphere systems, and the Stage-6.5/6.6 landmark vocabulary). **Aggressive animation
raises the ceiling; it does not replace the identity.** Anything P3 proposes under T2, T3 or T4 that would
cost us the van or the map is out of scope by this ruling.

## 13c. What P2 and P3 owe against this section

1. **P3 type-specimen workstream** (T2) — rendered-screen comparison, incumbent pair included, heavier display
   weights and a mono/technical accent evaluated.
2. **P2 decision: IMAGERY STRATEGY** (T3) — photography vs illustration vs animation-as-imagery, decided, not
   defaulted.
3. **P3 layout-language ruling** (T4) — borderless full-bleed adopted, scoped, or rejected, with the C3 and
   Railway-convergence tension addressed rather than ignored.
4. **P3 harden-and-evolve stance** (13a) — the Railway convergence is the argument against a from-scratch
   visual rebuild; if P3 rebuilds anyway, it must say why this receipt was overridden.
5. **T1 and T5 are binding on all of the above.**
