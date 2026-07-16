# Nexo Access — Copy & Tech Audit

Read-only inventory generated from source. **Nothing was changed.** Copy is transcribed **verbatim**,
including typographic apostrophes (’), em-dashes (—), and middots (·). Text that is launch-flag gated,
conditional, or generated at runtime is flagged **[DYNAMIC]** / **[CONDITIONAL]**.

Route/source map: pages live in `src/app/**/page.tsx`; shared chrome in `src/components/chrome/`
(Navbar, Footer); IA strings in `src/lib/nav.ts`; launch-gated strings in `src/lib/launch.ts`;
meta titles/descriptions in `src/lib/seo.ts`.

Current flag state (`src/lib/launch.ts`): `LIVE_OPERATIONS = false`, `HIPAA_INFRA_VERIFIED = false`,
`HIPAA_EFFECTIVE_DATE = null`. All gated copy below is shown in its **current** rendered form.

---

# SECTION 1 — FULL COPY INVENTORY

## Global chrome (renders on EVERY page)

### Top navigation (`src/components/chrome/Navbar.tsx`, `src/lib/nav.ts`)
Wordmark: **Nexo Access** (links to `/`).

Desktop menu triggers: **Platform** · **Solutions** · **Company** · **Sign in** (all dropdown menus) · **Apply as provider** (button → `/apply`).

- **Platform** dropdown items (title — description):
  - Dispatch — "Assign and route every trip from one queue." (`/platform#dispatch`)
  - Claims & billing — "Turn completed trips into clean, submittable claims." (`/platform#claims-billing`)
  - Compliance — "Keep credentials, signatures, and audit trails in order." (`/platform#compliance`)
  - Oversight & reporting — "Exception review, pattern reports, and CSV/Excel exports." (`/platform#oversight`)
- **Solutions** dropdown items:
  - MCOs & payers — "Run a transportation benefit and keep cost in view." (`/solutions/mcos`)
  - Transport providers — "Clear credentialing and clean claims, end to end." (`/solutions/providers`)
  - Facilities & case managers — "Book and confirm rides for the people in your care." (`/solutions/facilities`)
  - Members — "Get a reliable ride to your appointment." (`/solutions/members`)
- **Company** dropdown items (no descriptions): About (`/about`) · Contact (`/contact`)
- **Sign in** dropdown items (the three customer portal doors):
  - Member — "See your upcoming and past rides."
  - Provider — "Claims, credentials & scheduling."
  - Care portal — "For case managers & facilities — schedule rides for the people in your care."

Mobile overlay: label **Site menu**; hamburger aria-label "Open menu" / "Close menu"; accordion groups **Platform / Solutions / Company / Sign in** (same items as above); pinned bottom CTA: **Apply as provider** (only — "Sign in" is not duplicated in the pinned row).

### Footer (`src/components/chrome/Footer.tsx`)
- Terminus wordmark: **Nexo Access**
- Mission line: "Every driver credential-verified before dispatch. Every claim checked — automatically — before it’s billed."
- CTA buttons: **Apply as provider** (→ `/apply`) · **Talk to us** (→ `/contact`)
- Link columns (from `FOOTER_COLUMNS`):
  - **Platform**: Dispatch · Claims & billing · Compliance · Oversight & reporting
  - **Solutions**: MCOs & payers · Transport providers · Facilities & case managers · Members
  - **Company**: About · Contact · Apply
  - **Legal**: Privacy · Terms · HIPAA notice · Accessibility
- Bottom row: "© {YEAR} FC Nexo LLC dba Nexo Access · Built for DC · MD · VA" — **[DYNAMIC]** YEAR = `new Date().getFullYear()` (renders 2026 this year); "Built for DC · MD · VA" is `SERVICE_AREA_LINE` **[DYNAMIC]** (flips to "Serving DC · MD · VA" when `LIVE_OPERATIONS`)
- Utility links: **Back to top** · **Sign in** (→ `${appUrl}/login`)

### Skip link (`src/app/layout.tsx`)
- "Skip to main content" (sr-only until focused; first focusable element)

---

## `/` — Home (`src/app/page.tsx`)

**Meta title:** "Nexo Access | Non-Emergency Medical Transportation — DC, MD & VA"
**Meta description:** "Non-emergency medical transportation for Medicaid members across DC, Maryland, and Virginia. Nexo Access is the technology-first NEMT company built for the DMV."

### Hero (INK) — `Hero.tsx`
- Eyebrow pill: "Non-emergency medical transportation · DC, MD & VA"
- H1: "Every trip, **accounted** for."
- Subline: "Nexo Access is a technology-first NEMT company built for the DMV. Every driver is credential-verified before dispatch, and every claim is checked — automatically — before it’s billed." — **[DYNAMIC]** "built for the DMV" is `SERVICE_AREA_PROSE` (→ "serving the DMV" when `LIVE_OPERATIONS`)
- Buttons: **See the platform** (→ `/platform`) · **Talk to us** (→ `/contact`)

### Product demo console (`ProductDemo.tsx`) — self-playing, 4 scenes
- Screen-reader summary (sr-only): "A four-step walkthrough of the Nexo Access operations software. Step one, schedule: composing a wheelchair trip for the sample member J. Sample. Step two, assign: assigning it only to a driver whose credentials are current, since drivers with expired credentials are blocked from assignment. Step three, complete: advancing the trip through validated status changes to a final, tamper-evident completed record. Step four, bill: running the resulting claim through four automated scrubbing checks and seven adjudication checks before it is billed to the plan that covered the member."
- Titlebar: "Nexo Access · Dispatch" · "Sample data"
- **Scene 1 — Schedule:** "New trip" · "NX-1042" · "Pending assignment" · "J. Sample" · "Wheelchair" · "Home — Silver Spring, MD" · "Riverside Dialysis Center" · "9:30 AM" · "Scheduled" · "R. Doe" · "Ambulatory" · "11:15 AM · Queued"
- **Scene 2 — Assign:** "Assign driver" · "M. Rivera" · "Ready · all credentials current" · "D. Okafor" · "Blocked · license expired" · "A. Bello · Ready · credentials current" · "Assignment refused unless credentials are current."
- **Scene 3 — Complete:** "Trip status" · "NX-1042" · steps "Scheduled / Assigned / In progress / Completed" · "J. Sample · Wheelchair · Riverside Dialysis Center" · "Completed 10:12 AM · record locked" · "Every status change validated. Completed is final."
- **Scene 4 — Bill:** "Claim review" · "CLM-3390" · "Trip NX-1042" · checks "Signature on file / Driver match / Vehicle match / Mileage source" · "7/7 adjudication checks passed" · "Checked before it’s billed." · "Auto-approved" · "Billed to the plan that covered the member on the trip date."
- Tab controls: "Schedule / Assign / Complete / Bill"; aria-labels "Step {n} of 4: {label}"; pause button aria-label "Pause walkthrough" / "Play walkthrough" **[CONDITIONAL]** (only when motion allowed)

### Route spine (`RouteSpine.tsx`) — section intro + 4 "stops"
- Eyebrow: "How a trip runs on Nexo"
- H2: "From request to clean claim."
- Intro: "Follow one trip down the line — from the first booking to a checked, billable claim — and the guardrails built into every stop."

**Stop 01 — "Built around the member."**
- Body: "Every trip starts from the member — their mobility level, their care needs, and the places they go again and again."
- Proofs: "Round trips and recurring rides, scheduled around the appointment." · "Mobility and care needs read fresh at every booking." · "Saved destinations for recurring care like dialysis."
- Vignette "Book a ride": "J. Sample" · "Wheelchair" · "Home — Silver Spring, MD" · "Riverside Dialysis Center" · "Home — Silver Spring, MD" · "Uses wheelchair · door-to-door" · "Sample data"

**Stop 02 — "A lifecycle that can’t be quietly edited."**
- Body: "Once a trip exists, its history is protected. Status follows one validated path, and final states stay final."
- Proofs: "Every status change validated by a state machine." · "Completed, cancelled, and no-show are final — no silent flips." · "Dispatchers can’t overwrite each other’s edits." · "Every turnback and restore carries a logged reason."
- Vignette "Trip lifecycle": steps "Scheduled / Assigned / In progress / Completed" · "Change Completed → Scheduled — refused" · "Sample data"

**Stop 03 — "Every mobility level, covered."** (INK band; contains the morph + assist scene)
- Body: "Ambulatory, wheelchair, or stretcher — the platform knows what each trip needs and who is allowed to serve it."
- Proofs: "Three service levels — ambulatory, wheelchair, and stretcher — with bariatric & two-person assist available as an add-on to any of them." · "A provider only receives service levels it is formally approved for — enforced at the database level." · "Drivers and vehicles with lapsed credentials are blocked from assignment automatically."
- **Service morph** (`ServiceMorph.tsx`): sr-sentence "Three service levels: ambulatory, wheelchair, and stretcher — each trip scheduled to the member’s mobility needs." · cards: "Ambulatory / Walks with minimal help", "Wheelchair / Seated, wheelchair-secured", "Stretcher / Transported lying down" · pause aria-label "Pause service level cycle" / "Play service level cycle" **[CONDITIONAL]**
- **Assist scene** (`AssistScene.tsx`): eyebrow "Assist & bariatric" · H4 "Bariatric & two-person assist." · body "Extra trained hands and reinforced equipment on any service level — two or more attendants when a member’s needs require it." · proofs "Available as an add-on to any service level." · "Reinforced equipment and extra trained hands, matched to need."

**Stop 04 — "Checked before it’s ever billed."**
- Body: "No claim goes out unchecked. Scrubbing, adjudication, and a frozen record stand between a completed trip and a bill."
- Proofs: "Four automated scrubbing checks before submission." · "Seven adjudication checks route every claim to approve, review, or deny." · "Thirteen fields frozen at submission into a tamper-evident record." · "A database constraint makes double-paying a claim impossible."
- Vignette "Claim NX-C-2210": checks "Signature on file / Driver match / Vehicle match / Mileage source" · "7/7 adjudication checks passed" · "13 fields frozen at submission" · "Claim NX-C-2210 ↔ one payment run" · "Sample data"

### Proof band (`ProofBand.tsx`)
- Stats: **7** "adjudication checks on every claim" · **4** "scrubbing checks before submission" · **13** "fields frozen at submission" · **RLS** "Row-Level Security on every table"
- Caption: "Every number here is enforced by the platform’s code — not a policy binder."

### Audience triage (`AudienceTriage.tsx`)
- Eyebrow: "Who it’s for"
- H2: "Built for everyone in the trip."
- Cards (name / line / action → href):
  - "MCOs & payers" / "Run a transportation benefit and keep cost in view." / "Talk to us" → `/solutions/mcos`
  - "Transport providers" / "Clear credentialing and clean claims, end to end." / "Partner with us" → `/solutions/providers`
  - "Facilities & case managers" / "Book and confirm rides for the people in your care." / "See how scheduling works" → `/solutions/facilities`
  - "Members" / "A reliable ride to your appointment." / "What to expect" → `/solutions/members`

### Provider teaser (`ProviderTeaser.tsx`)
- Eyebrow: "For transport providers"
- H2: "Run trips with us."
- Body: "Transparent credentialing and clean claims — you always know where every trip and every claim stands."
- Steps: "01 Apply / A short form. No committed capacity required." · "02 Credentialing / Clear requirements up front, tracked in the platform, with approval before any assignment." · "03 Run trips / Every claim’s status visible end to end, scrubbed before submission."
- Button: **Apply as provider** (→ `/apply`)

### Final CTA (`FinalCta.tsx`)
- H2: "Ready when your members are."
- Body: "One platform for every trip — from the first booking to a checked, billable claim."
- Buttons: **Talk to us** (→ `/contact`) · **Apply as provider** (→ `/apply`)

---

## `/about` (`src/app/about/page.tsx`)

**Meta title:** "About | Nexo Access — NEMT for the DMV"
**Meta description:** "Nexo Access is a technology-first NEMT company built by an operator — every rule the industry keeps in a binder, enforced by the platform. Built for the DMV."

- Eyebrow: "About Nexo Access"
- H1: "Built by an operator."
- Subline: "Nexo Access didn’t start in a boardroom. It started in dispatch."
- Story (uses `FOUNDER_REF` = "our founder" **[DYNAMIC constant]**; `SERVICE_AREA_PROSE` **[DYNAMIC]**):
  - "For years, our founder ran non-emergency medical transportation across the DMV — and saw the same failures from the inside: missed pickups, credential files kept on paper, and claims that bounced back weeks after the trip."
  - "Nexo Access is the system our founder wished existed. Every rule the industry keeps in a binder — who is allowed to drive, what a clean claim looks like, when a record is final — the platform enforces in code instead."
  - "It’s built for the DMV: one honest system for the whole trip, from the first booking to a checked, billable claim."
- H2: "What we hold ourselves to."
- Principles: "Enforcement over promises / Credentials checked at dispatch, claims checked before billing — by the platform, not a binder." · "Dignity for every member / The right vehicle and the right help, matched to what each member’s trip actually needs." · "Transparency for partners / Providers and payers see the same trip and claim record — no separate story for anyone."
- Facts card: "Company / FC Nexo LLC, dba Nexo Access" · "What we are / A technology-first NEMT company" · "Service area / Built for DC · MD · VA" **[DYNAMIC]** · "Email / info@nexoaccess.com"
- CTA H2: "Let’s talk about your trips." · Buttons: **Talk to us** (→ `/contact`) · **Apply as provider** (→ `/apply`)

---

## `/platform` (`src/app/platform/page.tsx`)

**Meta title:** "Platform | Nexo Access — NEMT for the DMV"
**Meta description:** "The NEMT platform behind Nexo Access: dispatch, claims, compliance, and oversight in one system for MCOs, transport providers, and facilities across the DMV."

- Eyebrow: "The platform"
- H1: "The whole trip, in one system."
- Subline: "The platform for non-emergency medical transportation (NEMT): dispatch, claims, compliance, and oversight in one system — from the first booking to a checked, billable claim."
- Hero reuses the **Product demo console** (same copy as Home — see above).
- Sub-nav chips (`PlatformSubnav.tsx`): "Dispatch / Claims & billing / Compliance / Oversight" (aria-label "Platform sections")

**#dispatch — "One validated path for every trip."**
- Subline: "From booking to a locked, completed record, the system holds the trip to a single path."
- Proofs: "Every trip follows a validated state machine — completed, cancelled, and no-show are final." · "Drivers and vehicles with lapsed credentials are blocked from assignment, checked live at dispatch." · "Two dispatchers can’t overwrite each other — the losing write is rejected, and every turnback or restore carries a logged reason." · "Outbound and return trips scheduled around the appointment, including will-call returns."
- Vignette "Assign driver": "M. Rivera / Ready · credentials current" · "D. Okafor / Blocked · license expired" · "Assigned to M. Rivera" · "Sample data"

**#claims-billing — "Clean claims, by construction."**
- Subline: "The checks run before submission, and the record can’t be quietly changed after."
- Proofs: "Four automated scrubbing checks before a claim can be submitted." · "Seven adjudication checks route every claim to approve, review, or deny." · "Thirteen fields frozen at submission into a tamper-evident record." · "A database constraint makes double-paying a claim impossible." · "A two-level appeal ladder — appeals provable from the platform’s own records overturn automatically." · "Every claim bills the plan that covered the member on the trip date." · "Timely-filing deadlines warn before they lapse."
- Vignette "Claim review": "CLM-3390 / Trip NX-1042" · scrub checks · "7/7 adjudication checks passed" · "13 fields frozen · tamper-evident" · "Denied? A two-level appeal — provable from the records overturns automatically." · "Sample data"

**#compliance — "Isolation and audit, enforced in the database."**
- Subline: "The controls aren’t a policy binder — they’re constraints the platform can’t skip."
- Proofs: "Credentials tracked for drivers, vehicles, and providers — expiry blocks assignment automatically." · "Providers only receive the service levels they’re formally approved for, enforced at the database level." · "An immutable audit trail on the records that matter." · "Row-Level Security on every table — per-organization isolation." · "Built for HIPAA compliance" (this proof is `COMPLIANCE_LINE` **[DYNAMIC]**)
- Vignette "Credentials": "M. Rivera / Current" · "A. Bello / Expiring · 12 days" · "D. Okafor / Expired · blocked" · "Row-Level Security · per-organization isolation" · "Sample data"

**#oversight — "Exceptions get a person, not a rubber stamp."**
- Subline: "The claims that need judgment wait for it; the rest keep moving."
- Proofs: "Flagged claims are held out of automatic payment until a person reviews them." · "Exception review with a full decision trail." · "Pattern reports by rule, driver, and provider." · "CSV / Excel exports for program reporting."
- Vignette "Exception queue": "CLM-5120 / Held for review" · "Held out of automatic payment" · "In review · assigned to a reviewer" · "Pattern report · by rule, driver, provider" · "Sample data"

- CTA H2: "See it with your own trips in mind." · Body: "A walkthrough with your programs, your providers, and your claims." · Buttons: **Talk to us** (→ `/contact`) · **Apply as provider** (→ `/apply`)

---

## `/solutions/mcos` (`src/app/solutions/mcos/page.tsx`)

**Meta title:** "For MCOs & Payers | Nexo Access — NEMT for the DMV"
**Meta description:** "NEMT for MCOs and payers — credentialing enforced at dispatch and claims checked before billing, so every trip and claim holds up. Built for DC, MD, and VA."

- Eyebrow: "For MCOs & payers"
- H1: "A benefit that holds up to review."
- Subline: "Every trip runs on a credential-gated network, and every claim clears the same checks — so the transportation benefit stands up to scrutiny."
- Section "Credential-gated network / Only current credentials get on the road." — "The network checks itself before a trip is ever assigned." Proofs: "Drivers and vehicles with lapsed credentials are blocked from assignment — checked live at dispatch." · "Providers only receive the service levels they’re formally approved for, enforced at the database level." · "Every assignment carries the credentials it was cleared against."
- Section "Claims discipline / The same checks on every claim, every time." — "No claim skips a step, and nothing changes after it’s frozen." Proofs: "Four automated scrubbing checks before submission." · "Seven adjudication checks route every claim to approve, review, or deny." · "Thirteen fields frozen at submission into a tamper-evident record." · "A database constraint makes double-paying a claim impossible."
- Section "Program integrity / Exceptions surface before the money moves." — "Flagged claims wait for a person; the rest keep moving." Proofs: "Flagged claims are held out of auto-payment for exception review." · "Pattern reports and CSV / Excel exports for your own analysis." · "Timely-filing windows warn before they lapse."
- Vignette "Exception review": "CLM-4471 / Timely-filing: 5 days left" · "Held out of auto-payment · flagged for review" · "CLM-4470 / 7/7 checks · auto-approved" · "Pattern report · export CSV / Excel" · "Sample data"
- CTA: "See how it fits your program." / "We’ll walk your team through the controls and the reporting." / **Talk to us** (→ `/contact`)

---

## `/solutions/providers` (`src/app/solutions/providers/page.tsx`)

**Meta title:** "For Transport Providers | Nexo Access — NEMT for the DMV"
**Meta description:** "For transport providers: clear credentialing and clean claims, end to end, on one system. Join the Nexo Access network across DC, Maryland, and Virginia."

- Eyebrow: "For transport providers"
- H1: "Know where you stand, every step."
- Subline: "Transparent credentialing and clean claims — you always know what’s required, where every trip stands, and how a decision was reached."
- Section "Onboarding / Requirements known up front." — "You see what’s needed before you commit anything." Proofs: "Clear requirements up front, tracked in the platform." · "Approval before any assignment — no surprises at dispatch." · "Apply with no committed capacity required."
- Section "Claim status / Every claim, visible end to end." — "You can see exactly where a claim is, and why." Proofs: "Every claim’s status is visible from submission to decision." · "Claims are scrubbed before submission — checked, not just sent." · "When a claim needs work, the reason is on the record."
- Vignette "Claim status": "CLM-3390 / Trip NX-1042" · steps "Submitted / Scrubbed 4/4 checks / Adjudicated 7/7 checks / Approved" · "Denied? A two-level appeal — provable from the records overturns automatically." · "Sample data"
- Section "Appeals / A fair path when a claim is denied." — "Two levels of appeal, decided on the evidence." Proofs: "Denied claims get a two-level appeal ladder." · "Appeals provable from the platform’s own records overturn automatically." · "Every decision traces back to the record it was made on."
- CTA: "Apply to join the network." / "A short application. No committed capacity." / **Apply as provider** (→ `/apply`)

---

## `/solutions/facilities` (`src/app/solutions/facilities/page.tsx`)

**Meta title:** "For Facilities & Case Managers | Nexo Access — NEMT for the DMV"
**Meta description:** "Non-emergency medical transportation for dialysis and recurring care. Nexo Access helps facilities and case managers book reliable trips across the DMV."

- Eyebrow: "For facilities & case managers"
- H1: "Book the ride, hold the details."
- Subline: "Arrange rides for the people in your care — with their mobility and care needs read fresh at every booking."
- Section "Booking / Book rides for the people in your care." — "One place to arrange and confirm every trip." Proofs: "Book outbound and return trips around the appointment time — including will-call returns." · "Saved destinations for recurring care like dialysis." · "Confirm the ride and the details in one place."
- Vignette "Book a ride": "J. Sample / Wheelchair" · "Home — Silver Spring, MD" · "Riverside Dialysis Center" · "Home — Silver Spring, MD" · "Outbound + return · will-call" · "Door-to-door" · "Sample data"
- Section "Care needs / Needs read fresh, never assumed." — "The ride matches the person, not last month’s trip." Proofs: "Member mobility and care needs are read fresh at every booking." · "The service level is matched to what the trip actually needs." · "Nothing is carried over from last time by default."
- Section "Assist / Extra help when it’s needed." — "Bariatric & two-person assist, as an add-on." Proofs: "Bariatric & two-person assist available as an add-on to any service level." · "Two or more trained attendants when a member’s needs require it." · "Reinforced equipment, matched to need."
- CTA: "Let’s set up your facility." / "We’ll get your team booking in one call." / **Talk to us** (→ `/contact`)

---

## `/solutions/members` (`src/app/solutions/members/page.tsx`)

**Meta title:** "For Members | Nexo Access — NEMT for the DMV"
**Meta description:** "Wheelchair and ambulatory rides to medical appointments. Nexo Access is built for Medicaid members and dependable non-emergency transportation across the DMV."

- Eyebrow: "For members & families"
- H1: "A ride you can count on."
- Subline: "A verified driver, the right vehicle for your needs, and a simple way to see your rides."
- Section "Your ride / What to expect from a ride." Proofs: "A driver whose credentials are checked before your trip." · "The right vehicle for how you travel, including wheelchair-accessible." · "Door-to-door, so you’re not left to find your way."
- Section "Your needs / Your needs, checked every time." Proofs: "Your needs are checked at every booking — not assumed from last time." · "Tell us what’s changed, and the ride changes with it."
- Section "Extra help / Extra help when you need it." Proofs: "When you need more help, trained attendants can come along." · "The right equipment for a safe, comfortable ride."
- Section "Your rides / See your rides in one place." — "Your upcoming and past rides, in your member portal." Proofs: "See your upcoming rides and their scheduled times." · "Look back at the rides you’ve taken."
- Vignette "My rides": "Upcoming / Wheelchair / Tue · 9:30 AM / Riverside Dialysis Center" · "Fri · 2:00 PM / Completed" · "Sample data"
- CTA: "Ready for your next ride?" / "Sign in to see your rides." / **Member sign in** (→ `${appUrl}/login?portal=member`, same-tab)

---

## `/apply` (`src/app/apply/page.tsx` + `ApplyForm.tsx`)

**Meta title:** "Apply as a Provider | Nexo Access — NEMT for the DMV"
**Meta description:** "Run trips with Nexo Access — clear credentialing and claims checked before billing, on one system. Apply to join the transport-provider network in the DMV."

- Eyebrow: "For transport providers"
- H1: "Run trips with us."
- Subline: "Work from one honest system — clear credentialing, and claims checked before they’re billed. Tell us about your operation and we’ll take it from there."
- **Form** (`ApplyForm.tsx`, kind="provider"):
  - Heading: "Tell us about your operation"
  - Instruction: "A few details to get started. Fields marked * are required."
  - Fields (label / hint): "Name *" · "Company *" · "Email *" · "Phone (optional)" · "Base city & state * — hint: Where you’re based — e.g. Silver Spring, MD." · "Service levels you run (optional) — hint: Select any that apply. Bariatric / two-person assist is an add-on, not a separate level." (checkboxes: Ambulatory / Wheelchair / Stretcher / Bariatric / two-person assist) · "Anything else (optional) — hint: Anything you’d like us to know. Please don’t include member or health information."
  - Privacy note: "Please don’t include any member or health information in this form. See our Privacy Policy." (→ `/privacy`)
  - Submit button: "Submit application" / "Sending…" **[CONDITIONAL]**
  - **[CONDITIONAL] Success panel:** "Thanks — your application is in." / "We’ve got your details and we’ll follow up about running trips with us. If you need to add anything, just reply to the confirmation email." / button "Submit another application"
  - **[CONDITIONAL] Error banner:** "Something went wrong sending your message. Please try again." (client fallback), plus server messages listed in §3a
- "What happens next" H2, steps: "We review your details / We read what you send and check the basics for the service levels you run." · "We talk it through / We reach out to walk through credentialing and how trips and claims work on the platform." · "We set you up / Once you’re credentialed, you’re ready to run trips on one shared system."

---

## `/contact` (`src/app/contact/page.tsx` + `ContactForm.tsx`)

**Meta title:** "Contact | Nexo Access — NEMT for the DMV"
**Meta description:** "Talk to Nexo Access about your NEMT program — payers and facilities, tell us about the trips you cover. Call or email us. DC, Maryland, and Virginia."

- Eyebrow: "Contact"
- H1: "Tell us about your program."
- Subline: "If you run a transportation benefit or book rides for the people in your care, tell us about the trips you cover — and we’ll show you how Nexo Access handles them."
- **Form** (`ContactForm.tsx`, kind="contact"):
  - Heading: "Send us a message"
  - Instruction: "Fields marked * are required. You’ll hear back from the person who built the platform."
  - Fields: "Name *" · "Organization (optional)" · "Email *" · "I am a… *" (select; placeholder "Select one"; options: MCO / payer · Transport provider · Hospital / health system · Facility (dialysis, clinic, day program) · Case manager / caseworker · Member or family member · Other) · "Message * — hint: Tell us about your program. Please don’t include member or health information."
  - **[CONDITIONAL]** provider nudge (shown only when "I am a…" = Transport provider): "Applying to run trips? Use our provider application →" (→ `/apply`)
  - Privacy note: "Please don’t include any member or health information in this form. See our Privacy Policy." (→ `/privacy`)
  - Submit button: "Send message" / "Sending…" **[CONDITIONAL]**
  - **[CONDITIONAL] Success panel:** "Thanks — we’ve got your message." / "We’ll read it and follow up about your program. If you need to add anything, just reply to the confirmation email." / button "Send another message"
- Alternate paths: "Prefer to call or email us?" · "Call (202) 409-2970 — or copy it: (202) 409-2970." (tel: link + selectable span) · "Email info@nexoaccess.com — or copy it: info@nexoaccess.com." (mailto: link + selectable span)
- Routing H2: "Looking for something else?"
  - Card "Transport providers / Looking to run trips with us?" → **Apply as provider** (→ `/apply`)
  - Card "Members / Need a ride or have a question about one? Sign in to your member portal." → **Member sign in** (→ `${appUrl}/login?portal=member`, same-tab)
- Footer line of section: "Built for DC · MD · VA" (`SERVICE_AREA_LINE` **[DYNAMIC]**)

---

## `/privacy` (`src/app/privacy/page.tsx` via `LegalPage`)

**Meta title:** "Privacy Policy | Nexo Access — NEMT for the DMV"
**Meta description:** "How Nexo Access collects, uses, shares, and protects your information — and the rights you have over it. The privacy policy for our NEMT platform in the DMV."

- Eyebrow: "Legal" · H1: "Privacy Policy"
- Lead: "How we collect, use, share, and protect your information — and the rights you have over it."
- **1. Information We Collect:** "We collect information you provide directly: name, contact information, Medicaid ID, date of birth, address, and health-related information necessary to arrange medical transportation. We also collect usage data such as login timestamps and trip history."
- **2. How We Use Your Information:** "We use your information to schedule and coordinate non-emergency medical transportation, verify Medicaid eligibility, communicate trip status, process claims with your MCO, and comply with legal obligations."
- **3. How We Share Your Information:** "We share your information only with: your MCO/health plan to verify eligibility and process claims, transportation providers assigned to your trips, and government agencies when required by law. We never sell your information to third parties."
- **4. Data Security:** "Form submissions from this website travel over an encrypted connection (TLS) and are delivered to our business email; this website operates no member accounts and no database of its own. How the Nexo Access platform stores and protects your protected health information is described in our HIPAA Notice, and Nexo Access is built for HIPAA compliance." (link → `/hipaa`)
- **5. Your Rights:** "You have the right to access your personal information, request corrections, and request deletion subject to legal retention requirements. Contact us at info@nexoaccess.com to exercise these rights."
- **6. Contact:** "FC Nexo LLC dba Nexo Access / Email: info@nexoaccess.com / For HIPAA-related concerns, see our HIPAA Notice." (link → `/hipaa`)

---

## `/terms` (`src/app/terms/page.tsx` via `LegalPage`)

**Meta title:** "Terms of Service | Nexo Access — NEMT for the DMV"
**Meta description:** "The terms that govern use of the Nexo Access platform by members, case workers, and transport providers across DC, Maryland, and Virginia."

- Eyebrow: "Legal" · H1: "Terms of Service"
- Lead: "The terms that govern use of the Nexo Access platform."
- **1. Acceptance of Terms:** "By using Nexo Access, you agree to these terms. If you do not agree, do not use the platform."
- **2. Services:** "Nexo Access provides a platform for scheduling and coordinating non-emergency medical transportation (NEMT) for Medicaid-eligible members in DC and Maryland. We are not a transportation provider — we coordinate between members, case workers, and credentialed transportation providers."
- **3. User Accounts:** "You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized access."
- **4. Provider Obligations:** "Transportation providers using this platform agree to maintain all required credentials, carry valid insurance, employ only credentialed drivers, and comply with all applicable Medicaid transportation regulations."
- **5. Prohibited Uses:** "You may not use this platform to submit fraudulent claims, misrepresent trip completion, share account credentials, or circumvent any platform security measures."
- **6. Limitation of Liability:** "Nexo Access coordinates transportation services but is not liable for delays, cancellations, or incidents that occur during transportation. Provider companies carry their own liability insurance."
- **7. Governing Law:** "These terms are governed by the laws of the State of Maryland, without regard to its conflict-of-laws rules. Any dispute arising under them will be brought in the state or federal courts located in Maryland."
- **8. Contact:** "For questions about these terms: info@nexoaccess.com"

---

## `/hipaa` (`src/app/hipaa/page.tsx` via `LegalPage`)

**Meta title:** "HIPAA Notice | Nexo Access — NEMT for the DMV"
**Meta description:** "How Nexo Access may use and disclose your protected health information (PHI), the rights you have over it, and how to exercise them under HIPAA."

- Eyebrow: "Compliance" · H1: "HIPAA Notice of Privacy Practices"
- Lead: "This notice takes effect on the date Nexo Access first handles your member information." — **[CONDITIONAL]** no "Effective date:" line renders while `HIPAA_EFFECTIVE_DATE = null`; when set, a line "Effective date: {date}" appears.
- Banner: "This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully."
- **1. Who We Are:** "FC Nexo LLC, doing business as Nexo Access, is a covered entity under HIPAA. We are a non-emergency medical transportation (NEMT) coordinator enrolled with Medicaid in DC and Maryland."
- **2. Your Protected Health Information (PHI):** "We create and maintain records of your name, Medicaid ID, date of birth, address, health plan information, appointment reasons, and trip history. This information is your Protected Health Information (PHI)."
- **3. How We May Use and Disclose Your PHI:** "For Treatment: We share your PHI with transportation providers to coordinate your rides to medical appointments." · "For Payment: We share your PHI with your MCO/health plan to verify eligibility and process claims for transportation services." · "For Healthcare Operations: We may use your PHI to evaluate service quality and train staff." · "Required by Law: We will disclose your PHI when required by federal or state law." · "We will not use or disclose your PHI for any other purpose without your written authorization."
- **4. Your Rights Regarding Your PHI:** "You have the right to:" — "Request access to your PHI" · "Request corrections to your PHI" · "Request restrictions on how we use your PHI" · "Receive an accounting of disclosures" · "Receive a paper copy of this notice" · "File a complaint if you believe your rights have been violated"
- **5. Our Duties:** "We are required by law to maintain the privacy of your PHI, provide you with this notice, and follow the terms of this notice."
- **6. How to Exercise Your Rights:** "Submit written requests to: info@nexoaccess.com / We will respond within 30 days."
- **7. Filing a Complaint:** "If you believe your privacy rights have been violated, you may file a complaint with us at info@nexoaccess.com or with the U.S. Department of Health and Human Services Office for Civil Rights at hhs.gov/ocr/privacy/hipaa/complaints." (external link opens new tab; sr-only "(opens in a new tab)")
- **8. Changes to This Notice:** "We reserve the right to change this notice. Changes will apply to PHI we already have. The current notice is always available at nexoaccess.com/hipaa."

---

## `/accessibility` (`src/app/accessibility/page.tsx` via `LegalPage`)

**Meta title:** "Accessibility | Nexo Access — NEMT for the DMV"
**Meta description:** "How we build and test Nexo Access to meet WCAG 2.1 AA — contrast, keyboard access, visible focus, and reduced motion — plus how to reach us about barriers."

- Eyebrow: "Accessibility" · H1: "Accessibility Statement"
- Lead: "What we do to make Nexo Access usable for everyone — and how to reach us if something gets in your way."
- **1. Our Commitment:** "We build and test Nexo Access to meet WCAG 2.1 Level AA. Accessibility is treated as a requirement of the work, not an afterthought."
- **2. How We Build It:** "Contrast: text meets at least 4.5:1, and controls and meaningful graphics meet at least 3:1 — verified with luminance calculations rather than by eye." · "Keyboard: every interactive element is reachable and operable by keyboard, with a visible focus indicator and a “skip to main content” link." · "Motion: animation respects your system’s “reduced motion” setting — every animated element has a still end state." · "Structure: semantic landmarks, sequential headings, real form labels tied to their fields, and descriptive link text." · "Language: plain wording throughout."
- **3. Scope:** "This statement covers the Nexo Access website at nexoaccess.com. The member portal is a separate application with its own sign-in."
- **4. Known Limitations:** "Accessibility is ongoing work, and no site is ever perfectly done. If you run into a barrier, tell us — we’ll work with you to provide the information you need in an accessible format."
- **5. Contact:** "For accessibility concerns or to request an accommodation, email info@nexoaccess.com."

---

## 404 — not found (`src/app/not-found.tsx`) — renders for any unmatched route
- Meta title: "Page not found | Nexo Access" · Meta description: "The page you’re looking for isn’t here."
- Eyebrow: "404" · H1: "This page took a wrong turn."
- Body: "The page you’re looking for isn’t here — it may have moved, or the link was mistyped. Let’s get you back on route."
- Buttons: **Back to home** (→ `/`) · **Contact us** (→ `/contact`)

---

# SECTION 2 — CLAIMS REGISTER

Every sentence/phrase that asserts a fact, capability, number, security property, service, or coverage.
Grouped by claim type. Location = page · component.

### A. The permitted numbers (each is a factual capability claim — verify against the live platform at every deploy)
| Claim | Where |
|---|---|
| "Seven adjudication checks route every claim to approve, review, or deny." | Home RouteSpine Stop 04; /platform #claims-billing; /solutions/mcos Claims discipline |
| "7 / adjudication checks on every claim" | Home ProofBand |
| "7/7 adjudication checks passed" | ProductDemo Bill scene; Home ClaimMock; /platform ClaimReviewMock |
| "Four automated scrubbing checks before submission." | Home RouteSpine Stop 04; /platform #claims-billing; /solutions/mcos |
| "4 / scrubbing checks before submission" | Home ProofBand |
| "Thirteen fields frozen at submission into a tamper-evident record." | Home RouteSpine Stop 04; /platform #claims-billing; /solutions/mcos |
| "13 / fields frozen at submission" | Home ProofBand; ClaimMock; /platform "13 fields frozen · tamper-evident" |
| "A two-level appeal ladder" / "two-level appeal" | /platform #claims-billing; /solutions/providers (Appeals + vignette); /platform ClaimReviewMock |
| "Three service levels — ambulatory, wheelchair, and stretcher" | Home RouteSpine Stop 03; ServiceMorph sr-sentence |
| "Row-Level Security on every table" / "RLS" | Home ProofBand; /platform #compliance + CredentialWallMock |
| "A database constraint makes double-paying a claim impossible." | Home Stop 04; /platform #claims-billing; /solutions/mcos |

### B. Security / compliance claims
| Claim | Where |
|---|---|
| "Built for HIPAA compliance" (`COMPLIANCE_LINE` **[DYNAMIC]** — the ONLY HIPAA phrasing used; never "HIPAA compliant") | Home CredentialStrip; /platform #compliance |
| "FC Nexo LLC, doing business as Nexo Access, is a covered entity under HIPAA." | /hipaa §1 |
| "…enforced at the database level." / "enforced in the database" | Home Stop 03; /platform #compliance; /solutions/mcos |
| "An immutable audit trail on the records that matter." | /platform #compliance |
| "Row-Level Security · per-organization isolation." | /platform #compliance |
| "Form submissions from this website travel over an encrypted connection (TLS)…this website operates no member accounts and no database of its own." | /privacy §4 |
| "We never sell your information to third parties." | /privacy §3 |
| "credential-verified before dispatch" / "Credential-gated dispatch" / "checked live at dispatch" | Home Hero + CredentialStrip; /platform #dispatch; /solutions/mcos; Footer mission |
| "Drivers and vehicles with lapsed credentials are blocked from assignment" | Home Stop 03; ProductDemo Assign; /platform #dispatch/#compliance; /solutions/mcos |
| "We build and test Nexo Access to meet WCAG 2.1 Level AA." + contrast ≥4.5:1 / controls ≥3:1 | /accessibility §1–2 |

### C. Service / offering claims
| Claim | Where |
|---|---|
| "Nexo Access is a technology-first NEMT company" / "A technology-first NEMT company" | Home Hero; /about facts + meta |
| "built for the DMV" / "Built for DC · MD · VA" (`SERVICE_AREA_*` **[DYNAMIC]** — NOT "serving" pre-launch) | Home Hero; CredentialStrip; /about; Footer; /contact |
| "Non-emergency medical transportation · DC, MD & VA" (neutral eyebrow) | Home Hero |
| Coverage "DC, Maryland, and Virginia" / "the DMV" | meta descriptions site-wide; schema areaServed |
| "enrolled with Medicaid in DC and Maryland" | /hipaa §1 |
| "for Medicaid-eligible members in DC and Maryland" | /terms §2 |
| "We are not a transportation provider — we coordinate between members, case workers, and credentialed transportation providers." | /terms §2 |
| "Bariatric & two-person assist available as an add-on to any service level." / "two or more trained attendants when a member’s needs require it." (MODIFIER, never a 4th level) | Home AssistScene; /solutions/facilities Assist; /solutions/members Extra help |
| "Outbound and return trips scheduled around the appointment, including will-call returns." (round trips as scheduled offering; NOT "linked/one trip" — gated §10.4) | /platform #dispatch; /solutions/facilities; Home Stop 01 ("Round trips and recurring rides, scheduled around the appointment.") |
| "The right vehicle for how you travel, including wheelchair-accessible." / "Door-to-door" | /solutions/members Your ride; Home mocks |
| "Timely-filing deadlines warn before they lapse." (warns, not enforces) | /platform #claims-billing; /solutions/mcos |
| "Every claim bills the plan that covered the member on the trip date." | /platform #claims-billing; ProductDemo Bill |

### D. Feature / capability promises (process, not performance)
| Claim | Where |
|---|---|
| "One validated path for every trip." / "validated state machine" / "completed, cancelled, and no-show are final" | /platform #dispatch; Home Stop 02 |
| "Two dispatchers can’t overwrite each other — the losing write is rejected…logged reason." | /platform #dispatch; Home Stop 02 |
| "CSV / Excel exports for program reporting." / "Pattern reports by rule, driver, and provider." | /platform #oversight; /solutions/mcos |
| "Flagged claims are held out of automatic payment until a person reviews them." | /platform #oversight; /solutions/mcos |
| "Every claim’s status is visible from submission to decision." | /solutions/providers; Home ProviderTeaser |
| "Appeals provable from the platform’s own records overturn automatically." | /platform; /solutions/providers |
| "Apply with no committed capacity required." | /solutions/providers; Home ProviderTeaser; /apply |
| "You’ll hear back from the person who built the platform." / "built by an operator" (`FOUNDER_REF`) | /contact form; /about |

**Notes for the copy gate:** No GPS/live-tracking/ETA/map claims appear (members pages say "scheduled times," "see your rides," never "track"). No EDI/837/835/clearinghouse, no driver-app, no automated-eligibility, no analytics-dashboard, and **no volume or performance statistics** anywhere. Sample records are obviously fictional (J. Sample, R. Doe, M. Rivera, D. Okafor, A. Bello, Riverside Dialysis Center, NX-1042, CLM-3390/4470/4471/5120, NX-C-2210). All consistent with the permitted-claims list.

---

# SECTION 3 — TECH RECON

## (a) What the forms call on submit + exact env variable NAMES

Both forms share one path: `useLeadForm` (`src/components/leads/useLeadForm.ts`) → server action
**`submitLead(kind, formData)`** (`src/app/actions/leads.ts`, `"use server"`) → **`sendLeadEmails(payload)`**
(`src/lib/mail.ts`, server-only) → **AWS SES v2** (`@aws-sdk/client-sesv2`, `SendEmailCommand`).

- `/contact` → `submitLead("contact", …)`; `/apply` → `submitLead("provider", …)`.
- On submit the hook does `e.preventDefault()`, builds `FormData`, stamps the hidden `loaded_at`
  timestamp, calls the action, and renders the returned `LeadState`. A thrown action is caught and
  shows a friendly banner (never leaves the form stuck).
- Server-side guards, in order: (1) `kind` whitelist; (2) **honeypot** `website` filled → silent
  success; (3) **min-elapsed-time** ≥ 3000 ms, **fail-closed** (missing/empty/zero/garbled timestamp is
  rejected); (4) **throttle** — per-IP (`x-real-ip`, else first `x-forwarded-for` hop) max 5/hr **and** a
  global per-instance cap of 100/hr; (5) validation (required, email shape, length caps, service-level
  allow-list); (6) send.

**Exact env variable NAMES required** (read at call time in `src/lib/mail.ts` → `readConfig()`):
- **`AWS_SES_REGION`** (value in repo/docs: `us-east-2`)
- **`AWS_ACCESS_KEY_ID`**
- **`AWS_SECRET_ACCESS_KEY`**

If any is missing, `readConfig()` returns `null` → the form shows "Our submission system is temporarily
unavailable. Please email us directly at info@nexoaccess.com." — no crash, no faked success. These are
the ONLY secrets the app reads. Server error/rate/timing messages (verbatim):
- tooFast: "That came through a little too fast. Please take a moment and try again."
- throttled: "We’ve received several submissions from your network. Please try again in a little while."
- unavailable: "Our submission system is temporarily unavailable. Please email us directly at info@nexoaccess.com."

Mail routing: notification From `no-reply@nexoaccess.com`; notification To `providers@nexoaccess.com`
(applications) / `info@nexoaccess.com` (contact); ReplyTo = submitter; auto-ack From `info@nexoaccess.com`.

## (b) Does the visitor-acknowledgment (auto-ack) email fail gracefully?

**Yes.** In `sendLeadEmails` (`src/lib/mail.ts`) the two sends are asymmetric by contract:
- **(a) Notification** is the system of record — it is `await`ed inside a `try/catch`; on failure the
  function returns `{ ok:false, reason:"send_failed" }` and the visitor sees the "temporarily
  unavailable" banner.
- **(b) Auto-ack** is **best-effort**: it is sent only if there's a deliverable address and the
  per-recipient 10-min cooldown allows it, and it is wrapped in its own `try/catch` that only
  `console.warn`s. **The function has already committed to `return { ok: true }` regardless of the
  ack result** (line ~214). So if the notification succeeds but the ack send throws (e.g. SES-sandbox
  reject of an unverified submitter address), **the visitor still sees the success panel.** Confirmed
  in code — the ack failure cannot flip the form result.

## (c) Supabase / database imports or hardcoded secrets

**None in application code.** Grep across `src/**` for
`supabase|@supabase|createClient|prisma|drizzle|mongodb|postgres|mysql|DATABASE_URL|SUPABASE` → **0 hits.**
The site is intentionally **database-free and static**; lead forms email through SES and store nothing
(see `src/lib/mail.ts` header comment). The only `process.env` reads anywhere are the three AWS SES
names in `mail.ts` (§3a). Secret-pattern sweep (`AKIA…`, `-----BEGIN`, `AIza…`, `sk_live`, `xox…`,
inline `password=`) over the repo → **0 hits in `src/`** (the only matches are inside unrelated
`.claude/skills/**` documentation, not shipped code). Credentials come only from env at runtime.

## (d) Where "Sign in" points + every place it appears

`SITE.portalLogin(p)` = `https://app.nexoaccess.com/login?portal=<p>`; `SITE.loginUrl` =
`https://app.nexoaccess.com/login`; `SITE.appUrl` = `https://app.nexoaccess.com`. **All portal links are
SAME-TAB** (product handoff, law §7.4 — no `target="_blank"`). Admin is deliberately absent everywhere.

| # | Where | Label | Target |
|---|---|---|---|
| 1 | Desktop nav — **Sign in dropdown** (`Navbar.tsx`) → Member | "Member" | `…/login?portal=member` |
| 2 | Desktop nav — Sign in dropdown → Provider | "Provider" | `…/login?portal=provider` |
| 3 | Desktop nav — Sign in dropdown → Care portal | "Care portal" | `…/login?portal=care` |
| 4 | Mobile overlay — **Sign in accordion** (`Navbar.tsx`) | same 3 items | same 3 portal URLs |
| 5 | Footer utility row (`Footer.tsx`) | "Sign in" | `…/login` (picker, no `?portal`) |
| 6 | `/contact` routing card (`contact/page.tsx`) | "Member sign in" | `…/login?portal=member` |
| 7 | `/solutions/members` closing CTA (`members/page.tsx`) | "Member sign in" | `…/login?portal=member` |

The bare token "Sign in" also appears as the desktop menu trigger label and the mobile accordion label
(#1/#4). No "Sign in" appears in the mobile pinned CTA row (only "Apply as provider"), so it is not
duplicated. `?portal=` is a hint the platform honors later; an absent/invalid value lands on the picker.

## (e) Animations / transitions + what's gated on `prefers-reduced-motion`

All motion is transform/opacity/filter (+ SVG dashoffset for the route draw); every animated element has
a static end state. Defined in `src/app/globals.css` unless noted.

**Keyframes:** `overlayIn`, `panelIn`, `stepIn`, `navPanelIn`/`navPanelOut`, `navIndFade`, `navCascade`,
`demoIn`, `demoPop`, `demoTabProgress` (the shared progress-fill that drives the demo tabs AND the
service-morph cycle), `spineMarch`, `spinePulse`, `spineScrub`.

**Chrome / nav:** magic-line indicator slide (`transition: transform 250ms`), caret 180° rotate, panel
grow-in (`navPanelIn/Out`), item cascade (`navCascade`, `--i` stagger), item fill/chip/arrow transitions,
Apply-button lift + arrow-nudge, mobile overlay fade (`overlayIn`), mobile accordion chevron rotate.

**Home:** ProductDemo auto-cycle (CSS `demoTabProgress`; `demoIn`/`demoPop` micro-pops) — pauses on
hover, keyboard-focus, tab-hidden (`visibilitychange`), and off-screen (IntersectionObserver); user
Pause/Play button. ServiceMorph level cycle (same `demoTabProgress` fill; IO-gated, pauses like the
demo). ProofBand staged reveal (IO play-once, arms `data-proof-live`). ProofSpotlight rotating
`.is-active` spotlight (JS `setTimeout` ~3s, IO-gated, pauses on pointer/focus/hidden). AssistScene
play-once "settle" (IO, arms `data-assist-in`). RouteSpine mock micro-animations (`spineMarch`,
`spinePulse`, `spineScrub`) armed only under `[data-spine-live]`. Route line draw + livery van
(`RouteOverlay.tsx`) — `--route-progress` scrubbed 1:1 with scroll; van shown only where
`@supports (offset-path)` AND the overlay is armed.

**`prefers-reduced-motion: reduce` gating (globals.css `@media` block, lines ~655–668):**
- Global kill-switch: `animation-duration: 0.01ms !important`, `animation-delay: -1ms !important`
  (delayed/fill-mode animations start already-completed), `animation-iteration-count: 1 !important`,
  `transition-duration: 0.01ms !important`, `transition-delay: 0s !important`; `html { scroll-behavior: auto }`;
  active-state transforms removed.
- Component-level branches also **hard-branch** on the media query in JS and render a static end-state
  (no cycle, no controls): `ProductDemo`, `ServiceMorph` (no cycle + no pause button), `ProofBand`,
  `ProofSpotlight` (does nothing — full resting readability), `AssistScene`, `PlatformSubnav`
  (smooth-scroll → `auto`), `RouteOverlay` (van suppressed). Result: reduced-motion users get the full
  composition with zero motion.

## (f) robots.txt + sitemap.xml contents

**robots.txt** (`src/app/robots.ts`) — allows all, apex host canonical:
```
User-Agent: *
Allow: /

Host: https://nexoaccess.com
Sitemap: https://nexoaccess.com/sitemap.xml
```

**sitemap.xml** (`src/app/sitemap.ts`) — 13 URLs, absolute apex, no trailing slash, **no `lastModified`**
(dates aren't fabricated), `changeFrequency: monthly`, `priority: 1.0` for `/` else `0.7`. URLs (from the
SEO single source, so it can't drift from real pages):
`https://nexoaccess.com/` (1.0), `/platform`, `/solutions/mcos`, `/solutions/providers`,
`/solutions/facilities`, `/solutions/members`, `/apply`, `/about`, `/contact`, `/privacy`, `/terms`,
`/hipaa`, `/accessibility` (all 0.7). All pages are indexable (`layout.tsx` sets `robots: index,follow`);
the 404 route returns a real 404 status and carries no special robots directive.

## (g) Em-dash (—, U+2014) count in user-visible copy, per page

Counted from source with developer comments stripped (block + line comments removed) so only
copy/JSX-text em-dashes are counted. Shared templates (`SolutionPage`, `LegalPage`, `fields`) contribute
0; `ProductDemo` contributes 1 and is counted on both pages that render it (Home, /platform). The
**Global chrome** row (nav + footer) adds **4** to every page on top of the body count below.

| Page | Em-dashes (body copy) | Contributors |
|---|---|---|
| `/` (home) | **19** | Hero 2, ProductDemo 1, RouteSpine 11, ServiceMorph 1, AssistScene 1, ProofBand 1, ProviderTeaser 1, FinalCta 1 |
| `/about` | **5** | page 5 |
| `/platform` | **9** | page 8, ProductDemo 1 |
| `/apply` | **3** | page 1, ApplyForm 2 |
| `/contact` | **4** | page 3, ContactForm 1 |
| `/solutions/mcos` | **2** | page 2 |
| `/solutions/providers` | **4** | page 4 |
| `/solutions/facilities` | **4** | page 4 |
| `/solutions/members` | **1** | page 1 |
| `/hipaa` | **0** | — |
| `/privacy` | **1** | page 1 |
| `/terms` | **1** | page 1 |
| `/accessibility` | **4** | page 4 |
| **Global chrome** (nav + footer, on every page) | **4** | Footer 2 (mission line "checked — automatically —"), nav.ts 1 (Sign-in "Care portal —" desc), launch.ts 1 (staged line, NOT rendered) |

Method note: this is a **static source count** with comments stripped, not a DOM render. It excludes the
launch-gated strings that don't currently render (e.g. `launch.ts` counts 1 for the staged
"HIPAA-compliant infrastructure —" line, which is NOT shown while `HIPAA_INFRA_VERIFIED = false`), so the
chrome row's live-rendered total is effectively **3**. Counts include em-dashes inside `Sample data`
vignettes (visible on-screen). For an exact rendered-DOM count, render each route and count `innerText`
occurrences of U+2014.

---

*End of audit. Read-only — no source files were modified; no git was run.*
