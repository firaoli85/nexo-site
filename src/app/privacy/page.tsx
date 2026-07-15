import { pageMeta, ROUTE_META } from "@/lib/seo";
import Link from "next/link";
import { LegalPage, legalLink, type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = pageMeta(ROUTE_META.privacy);

const emailLink = (
  <a href={`mailto:${SITE.email}`} className={legalLink}>
    {SITE.email}
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    heading: "Information We Collect",
    body: (
      <p>
        We collect information you provide directly: name, contact information, Medicaid ID, date of
        birth, address, and health-related information necessary to arrange medical transportation.
        We also collect usage data such as login timestamps and trip history.
      </p>
    ),
  },
  {
    heading: "How We Use Your Information",
    body: (
      <p>
        We use your information to schedule and coordinate non-emergency medical transportation,
        verify Medicaid eligibility, communicate trip status, process claims with your MCO, and comply
        with legal obligations.
      </p>
    ),
  },
  {
    heading: "How We Share Your Information",
    body: (
      <p>
        We share your information only with: your MCO/health plan to verify eligibility and process
        claims, transportation providers assigned to your trips, and government agencies when required
        by law. We never sell your information to third parties.
      </p>
    ),
  },
  {
    heading: "Data Security",
    body: (
      <p>
        Form submissions from this website travel over an encrypted connection (TLS) and are delivered
        to our business email; this website operates no member accounts and no database of its own. How
        the {SITE.name} platform stores and protects your protected health information is described in
        our{" "}
        <Link href="/hipaa" className={legalLink}>
          HIPAA Notice
        </Link>
        , and {SITE.name} is built for HIPAA compliance.
      </p>
    ),
  },
  {
    heading: "Your Rights",
    body: (
      <p>
        You have the right to access your personal information, request corrections, and request
        deletion subject to legal retention requirements. Contact us at {emailLink} to exercise these
        rights.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        {SITE.legalName} dba {SITE.name}
        <br />
        Email: {emailLink}
        <br />
        For HIPAA-related concerns, see our{" "}
        <Link href="/hipaa" className={legalLink}>
          HIPAA Notice
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lead="How we collect, use, share, and protect your information — and the rights you have over it."
      sections={SECTIONS}
    />
  );
}
