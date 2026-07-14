// Single source of truth for site-wide identity, URLs, and service area.
// ALL chrome (Navbar, Footer, metadata, links) reads from here — never hardcode
// a URL, email, or legal name anywhere else in the app.

export const SITE = {
  name: "Nexo Access",
  legalName: "FC Nexo LLC",
  domain: "https://nexoaccess.com",
  appUrl: "https://app.nexoaccess.com",
  email: "admin@nexoaccess.com",
  serviceArea: ["DC", "MD", "VA"],
} as const;

export type Site = typeof SITE;
