import { SITE } from "@/lib/site";
import { HERO_LEDE } from "@/lib/seo";

// JSON-LD single source (Stage 11; retyped Task #17 per D1/D15). One Organization object,
// emitted once in the root layout.
//
// WHY Organization AND NOT MedicalBusiness (ruling recorded in SEO_PLAN section 3.2, applied here):
//   1. MedicalBusiness is a LocalBusiness subtype, and LocalBusiness expects a postal address. We
//      deliberately publish none, so that type asks for a property we are committed to omitting.
//   2. MedicalBusiness connotes an entity delivering care directly. Under D1/D15 we are a medical
//      transportation MANAGEMENT organization: providers operate the vehicles, we manage the service
//      and answer for it. Organization states that without overclaiming clinical care.
// areaServed stays: the geography is true and flag-independent.
// Absolute URLs (schema requires them). NO `address` property (none is public — omit entirely, don't
// fabricate). NO aggregateRating / review / openingHours (nothing to invent — copy gate). Email is the
// monitored info@ inbox (also the contact-lead recipient); telephone is the public E.164.
const abs = (path: string) => new URL(path, SITE.domain).toString();

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.domain}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.domain,
    logo: abs("/logo.png"),
    image: abs("/og.png"),
    email: SITE.email,
    telephone: SITE.phone.e164,
    // Verbatim the homepage hero's opening sentence (shared constant, so hero + schema cannot drift).
    description: HERO_LEDE,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Washington, DC" },
      { "@type": "State", name: "Maryland" },
      { "@type": "State", name: "Virginia" },
    ],
  };
}

// Serialize for safe embedding inside <script type="application/ld+json">. Escaping `<`, `>`, `&`
// (and the U+2028/U+2029 line separators) prevents a "</script>" breakout while staying valid JSON —
// the \uXXXX escapes are legal JSON string content, so parsers read the data unchanged. The two line
// separators are built via char code so no literal control char lives in this source file.
export function schemaJson(obj: unknown): string {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LS)
    .join("\\u2028")
    .split(PS)
    .join("\\u2029");
}
