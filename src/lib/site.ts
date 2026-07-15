// Single source of truth for site-wide identity, URLs, and service area.
// ALL chrome (Navbar, Footer, metadata, links) reads from here — never hardcode
// a URL, email, or legal name anywhere else in the app.

const APP_URL = "https://app.nexoaccess.com";

// The three CUSTOMER-facing portal doors (Stage 15). Admin is DELIBERATELY excluded from every public
// surface — the marketing site never links to, names, or hints at the admin portal (security posture;
// recorded in law §7.4). The platform's own /login picker is the fallback door for direct visits.
export type Portal = "member" | "provider" | "care";

export const SITE = {
  name: "Nexo Access",
  legalName: "FC Nexo LLC",
  domain: "https://nexoaccess.com",
  // The app (platform) ORIGIN — the identity counterpart to `domain`. Most links want a specific door,
  // so they use `loginUrl` / `portalLogin` below (both built from the same APP_URL); `appUrl` is kept as
  // the canonical bare-origin field for JSON-LD / future surfaces that need the origin itself.
  appUrl: APP_URL,
  // The platform's own /login picker — the SAME-TAB fallback door: the footer "Sign in", and where an
  // unknown/absent `?portal=` param lands gracefully today (see portalLogin). A signed-in surface with
  // no audience preselected.
  loginUrl: `${APP_URL}/login`,
  // The ONE canonical public email (Stage 13 locked ruling). info@ is the only address that appears
  // ANYWHERE public — rendered pages, mailto links, JSON-LD, and the form auto-ack all read from here.
  email: "info@nexoaccess.com",
  // Public phone (Stage 11). Rendered ONLY by deliberate placement — the /contact primary action card
  // and the JSON-LD telephone (§7.2). `display` for humans, `e164` for `tel:` + schema. A street
  // ADDRESS stays banned (none public).
  phone: { display: "(202) 409-2970", e164: "+12024092970" },
  serviceArea: ["DC", "MD", "VA"],
  // Deep-link straight to one portal door (Stage 15). THE single source for portal URLs — never hardcode
  // `/login?portal=…` anywhere. `?portal=` is a HINT the platform honors LATER (platform-repo task,
  // flagged in DEPLOY-NOTES); TODAY an unknown/absent param lands gracefully on the loginUrl picker.
  // These are same-tab PRODUCT HANDOFFS, not external references (law §7.4) — callers add no target.
  portalLogin: (portal: Portal) => `${APP_URL}/login?portal=${portal}`,
} as const;

// How the founder is referred to in copy (Stage 9). ONE constant so the owner can later set a real
// name with a single-string flip — used EVERYWHERE the founder appears (never a hardcoded name, never
// a prior/affiliated company). Keep it lowercase so it reads correctly MID-SENTENCE (copy never starts
// a sentence with it). Founder facts are limited to: years of hands-on NEMT operating experience in
// the DMV, and building the platform.
export const FOUNDER_REF = "our founder";

export type Site = typeof SITE;
