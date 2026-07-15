import { pageMeta, ROUTE_META } from "@/lib/seo";
import { LegalPage, legalLink, type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = pageMeta(ROUTE_META.accessibility);

const HOST = new URL(SITE.domain).host;

// An HONEST statement grounded in the accessibility work actually done on this site — contrast
// verified by luminance calculation, full keyboard access, visible focus, reduced-motion support,
// semantic structure. No phone line, no response-time promise (nexo-brand §7.2), no invented date.
const SECTIONS: LegalSection[] = [
  {
    heading: "Our Commitment",
    body: (
      <p>
        We build and test Nexo Access to meet WCAG 2.1 Level AA. Accessibility is treated as a
        requirement of the work, not an afterthought.
      </p>
    ),
  },
  {
    heading: "How We Build It",
    body: (
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <span className="font-medium text-default">Contrast:</span> text meets at least 4.5:1, and
          controls and meaningful graphics meet at least 3:1 — verified with luminance calculations
          rather than by eye.
        </li>
        <li>
          <span className="font-medium text-default">Keyboard:</span> every interactive element is
          reachable and operable by keyboard, with a visible focus indicator and a “skip to main
          content” link.
        </li>
        <li>
          <span className="font-medium text-default">Motion:</span> animation respects your system’s
          “reduced motion” setting — every animated element has a still end state.
        </li>
        <li>
          <span className="font-medium text-default">Structure:</span> semantic landmarks, sequential
          headings, real form labels tied to their fields, and descriptive link text.
        </li>
        <li>
          <span className="font-medium text-default">Language:</span> plain wording throughout.
        </li>
      </ul>
    ),
  },
  {
    heading: "Scope",
    body: (
      <p>
        This statement covers the {SITE.name} website at {HOST}. The member portal is a separate
        application with its own sign-in.
      </p>
    ),
  },
  {
    heading: "Known Limitations",
    body: (
      <p>
        Accessibility is ongoing work, and no site is ever perfectly done. If you run into a barrier,
        tell us — we’ll work with you to provide the information you need in an accessible format.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        For accessibility concerns or to request an accommodation, email{" "}
        <a href={`mailto:${SITE.email}`} className={legalLink}>
          {SITE.email}
        </a>
        .
      </p>
    ),
  },
];

export default function AccessibilityPage() {
  return (
    <LegalPage
      eyebrow="Accessibility"
      title="Accessibility Statement"
      lead="What we do to make Nexo Access usable for everyone — and how to reach us if something gets in your way."
      sections={SECTIONS}
    />
  );
}
