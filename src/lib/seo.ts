import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { SERVICE_AREA_PROSE } from "@/lib/launch";

// SEO single source (Stage 11). Per-route titles + descriptions + the pageMeta() builder (canonical +
// OpenGraph + Twitter). metadataBase lives in the root layout, so relative `path`s here resolve to
// absolute apex URLs. Every string is PUBLIC COPY — audited against the copy gate + the query lexicon:
// "NEMT provider/broker" only ever as searcher/third-party language, NEVER as a Nexo self-description
// (Nexo = "technology-first NEMT company"); no "serving" verb pre-LIVE_OPERATIONS (neutral geography is
// exempt); no banned capability/number.

export const HOME_TITLE = "Nexo Access | Non-Emergency Medical Transportation, DC, MD & VA";
export const HOME_DESCRIPTION =
  "Non-emergency medical transportation for Medicaid members across DC, Maryland, and Virginia. Nexo Access is the technology-first NEMT company built for the DMV.";

// The hero's opening sentence — the §7.2 approved self-description ("technology-first NEMT company")
// plus the launch-flag-governed service-area prose. SINGLE SOURCE: rendered by the homepage hero
// subline (components/home/Hero.tsx) AND used verbatim as the JSON-LD `description` (lib/schema.ts),
// so the two can never drift. Flag-governed, never hardcoded: flipping LIVE_OPERATIONS swaps
// "built for the DMV" -> "serving the DMV" in the hero and the structured data together.
export const HERO_LEDE = `Nexo Access is a technology-first NEMT company ${SERVICE_AREA_PROSE}.`;

// Interior title pattern: "{Page} | Nexo Access — NEMT for the DMV".
export const interiorTitle = (name: string) => `${name} | Nexo Access, NEMT for the DMV`;

// ONE branded OG image, site-wide (1200×630, /public/og.png).
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Nexo Access, non-emergency medical transportation across DC, Maryland, and Virginia",
};

export type RouteMeta = { title: string; description: string; path: string };

export const ROUTE_META = {
  home: { title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" },
  platform: {
    title: interiorTitle("Platform"),
    description:
      "The NEMT platform behind Nexo Access: dispatch, claims, compliance, and oversight in one system for MCOs, transport providers, and facilities across the DMV.",
    path: "/platform",
  },
  mcos: {
    title: interiorTitle("For MCOs & Payers"),
    description:
      "NEMT for MCOs and payers, with credentialing enforced at dispatch and claims checked before billing, so every trip and claim holds up. Built for DC, MD, and VA.",
    path: "/solutions/mcos",
  },
  providers: {
    title: interiorTitle("For Transport Providers"),
    description:
      "For transport providers: clear credentialing and clean claims, end to end, on one system. Join the Nexo Access network across DC, Maryland, and Virginia.",
    path: "/solutions/providers",
  },
  facilities: {
    title: interiorTitle("For Facilities & Case Managers"),
    description:
      "Non-emergency medical transportation for dialysis and recurring care. Nexo Access helps facilities and case managers book reliable trips across the DMV.",
    path: "/solutions/facilities",
  },
  members: {
    title: interiorTitle("For Members"),
    description:
      "Wheelchair and ambulatory rides to medical appointments. Nexo Access is built for Medicaid members and dependable non-emergency transportation across the DMV.",
    path: "/solutions/members",
  },
  apply: {
    title: interiorTitle("Apply as a Provider"),
    description:
      "Run trips with Nexo Access on one system: clear credentialing, and claims checked before billing. Apply to join the transport-provider network in the DMV.",
    path: "/apply",
  },
  about: {
    title: interiorTitle("About"),
    description:
      "Nexo Access is a technology-first NEMT company built by an operator, and every rule the industry keeps in a binder is enforced by the platform. Built for the DMV.",
    path: "/about",
  },
  contact: {
    title: interiorTitle("Contact"),
    description:
      "Talk to Nexo Access about your NEMT program. Payers and facilities, tell us about the trips you cover. Call or email us. DC, Maryland, and Virginia.",
    path: "/contact",
  },
  privacy: {
    title: interiorTitle("Privacy Policy"),
    description:
      "How Nexo Access collects, uses, shares, and protects your information, and the rights you have over it. The privacy policy for our NEMT platform in the DMV.",
    path: "/privacy",
  },
  terms: {
    title: interiorTitle("Terms of Service"),
    description:
      "The terms that govern use of the Nexo Access platform by members, case workers, and transport providers across DC, Maryland, and Virginia.",
    path: "/terms",
  },
  hipaa: {
    title: interiorTitle("HIPAA Notice"),
    description:
      "How Nexo Access may use and disclose your protected health information (PHI), the rights you have over it, and how to exercise them under HIPAA.",
    path: "/hipaa",
  },
  accessibility: {
    title: interiorTitle("Accessibility"),
    description:
      "How we build and test Nexo Access to meet WCAG 2.1 AA: contrast, keyboard access, visible focus, and reduced motion, plus how to reach us about barriers.",
    path: "/accessibility",
  },
} as const satisfies Record<string, RouteMeta>;

export function pageMeta({ title, description, path }: RouteMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  };
}
