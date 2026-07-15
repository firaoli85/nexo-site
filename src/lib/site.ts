// Single source of truth for site-wide identity, URLs, and service area.
// ALL chrome (Navbar, Footer, metadata, links) reads from here — never hardcode
// a URL, email, or legal name anywhere else in the app.

export const SITE = {
  name: "Nexo Access",
  legalName: "FC Nexo LLC",
  domain: "https://nexoaccess.com",
  appUrl: "https://app.nexoaccess.com",
  // The ONE canonical public email (Stage 13 locked ruling). info@ is the only address that appears
  // ANYWHERE public — rendered pages, mailto links, JSON-LD, and the form auto-ack all read from here.
  email: "info@nexoaccess.com",
  // Public phone (Stage 11). Rendered ONLY by deliberate placement — the /contact primary action card
  // and the JSON-LD telephone (§7.2). `display` for humans, `e164` for `tel:` + schema. A street
  // ADDRESS stays banned (none public).
  phone: { display: "(202) 409-2970", e164: "+12024092970" },
  serviceArea: ["DC", "MD", "VA"],
} as const;

// How the founder is referred to in copy (Stage 9). ONE constant so the owner can later set a real
// name with a single-string flip — used EVERYWHERE the founder appears (never a hardcoded name, never
// a prior/affiliated company). Keep it lowercase so it reads correctly MID-SENTENCE (copy never starts
// a sentence with it). Founder facts are limited to: years of hands-on NEMT operating experience in
// the DMV, and building the platform.
export const FOUNDER_REF = "our founder";

export type Site = typeof SITE;
