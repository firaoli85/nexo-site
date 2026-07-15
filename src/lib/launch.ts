// LAUNCH FLAGS — staged truth for Nexo Access (Stage 6.2).
//
// Each flag gates a copy swap: the site ships the CURRENT honest string today and only swaps to a
// stronger claim once the underlying reality is verified in production. Two things are deliberately
// NOT yet true: FC Nexo's operating model (fleet provider / broker / SaaS / hybrid) is UNDECIDED,
// and the platform is NOT yet verified on the BAA-covered AWS infrastructure. So both flags ship
// `false`, and every consumer below renders the honest current copy.
//
// RULE: a flag flips ONLY on an EXPLICIT owner instruction — NEVER proactively, and never because a
// claim merely "seems true". Flip it when the owner confirms the milestone, then re-verify the copy.
export const LAUNCH = {
  LIVE_OPERATIONS: false, // flip: first real trips are running
  HIPAA_INFRA_VERIFIED: false, // flip: platform verified in production on the BAA-covered AWS
  //                              server WITH TLS + encryption-at-rest confirmed
} as const;

// HIPAA Notice effective date (Stage 13). SET AT DEPLOY to the site's public launch date, e.g.
// "August 1, 2026". Until then it stays null — we never fabricate a date — and the HIPAA Notice shows
// the "takes effect when we first handle member information" sentence instead of a concrete date. The
// owner may instead choose a FIXED ADOPTION DATE (the date the policy was formally adopted) — see the
// Stage-13 report DECISIONS. A real date must be in place before the notice is legally operative.
export const HIPAA_EFFECTIVE_DATE: string | null = null;

// (a) Compliance line. CURRENT: the honest "building toward it" claim (the only HIPAA phrasing the
// copy gate permits pre-verification). STAGED (HIPAA_INFRA_VERIFIED): the concrete infrastructure
// claim. Read by the credential strip + anywhere the compliance phrase appears.
export const COMPLIANCE_LINE: string = LAUNCH.HIPAA_INFRA_VERIFIED
  ? "HIPAA-compliant infrastructure — hosted on AWS under a signed Business Associate Agreement, encrypted in transit and at rest."
  : "Built for HIPAA compliance";

// (b) Service-area tagline. CURRENT: "Built for" (we are built for the region, not yet operating in
// it). STAGED (LIVE_OPERATIONS): "Serving" (real trips are running). Read by the credential-strip
// chip + the footer legal row (+ any other service-area line). NOTE: the neutral eyebrow
// ("Non-emergency medical transportation · DC, MD & VA") is not a service claim and is unaffected.
export const SERVICE_AREA_LINE: string = LAUNCH.LIVE_OPERATIONS
  ? "Serving DC · MD · VA"
  : "Built for DC · MD · VA";

// Prose form of the same claim, for running sentences (e.g. the hero subline): the ACTIVE verb
// "serving" is gated exactly like the chip above — it is only true once real trips run. Until then
// "built for" keeps the whole site's service-area language consistent and honest.
export const SERVICE_AREA_PROSE: string = LAUNCH.LIVE_OPERATIONS
  ? "serving the DMV"
  : "built for the DMV";
