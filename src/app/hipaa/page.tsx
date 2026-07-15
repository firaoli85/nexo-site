import { pageMeta, ROUTE_META } from "@/lib/seo";
import Link from "next/link";
import { LegalPage, legalLink, type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";
import { HIPAA_EFFECTIVE_DATE } from "@/lib/launch";

export const metadata = pageMeta(ROUTE_META.hipaa);

const HOST = new URL(SITE.domain).host; // nexoaccess.com

const emailLink = (
  <a href={`mailto:${SITE.email}`} className={legalLink}>
    {SITE.email}
  </a>
);

// The banner HIPAA requires at the top of a Notice of Privacy Practices.
const Banner = (
  <div className="rounded-r-xl border-l-4 border-accent bg-accent-subtle px-5 py-4">
    <p className="text-sm font-semibold uppercase tracking-wide text-default">
      This notice describes how medical information about you may be used and disclosed and how you
      can get access to this information. Please review it carefully.
    </p>
  </div>
);

const SECTIONS: LegalSection[] = [
  {
    heading: "Who We Are",
    body: (
      <p>
        {SITE.legalName}, doing business as {SITE.name}, is a covered entity under HIPAA. We are a
        non-emergency medical transportation (NEMT) coordinator enrolled with Medicaid in DC and
        Maryland.
      </p>
    ),
  },
  {
    heading: "Your Protected Health Information (PHI)",
    body: (
      <p>
        We create and maintain records of your name, Medicaid ID, date of birth, address, health plan
        information, appointment reasons, and trip history. This information is your Protected Health
        Information (PHI).
      </p>
    ),
  },
  {
    heading: "How We May Use and Disclose Your PHI",
    body: (
      <>
        <p>
          <span className="font-semibold text-default">For Treatment:</span> We share your PHI with
          transportation providers to coordinate your rides to medical appointments.
        </p>
        <p>
          <span className="font-semibold text-default">For Payment:</span> We share your PHI with your
          MCO/health plan to verify eligibility and process claims for transportation services.
        </p>
        <p>
          <span className="font-semibold text-default">For Healthcare Operations:</span> We may use
          your PHI to evaluate service quality and train staff.
        </p>
        <p>
          <span className="font-semibold text-default">Required by Law:</span> We will disclose your
          PHI when required by federal or state law.
        </p>
        <p>
          We will not use or disclose your PHI for any other purpose without your written
          authorization.
        </p>
      </>
    ),
  },
  {
    heading: "Your Rights Regarding Your PHI",
    body: (
      <>
        <p>You have the right to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Request access to your PHI</li>
          <li>Request corrections to your PHI</li>
          <li>Request restrictions on how we use your PHI</li>
          <li>Receive an accounting of disclosures</li>
          <li>Receive a paper copy of this notice</li>
          <li>File a complaint if you believe your rights have been violated</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Our Duties",
    body: (
      <p>
        We are required by law to maintain the privacy of your PHI, provide you with this notice, and
        follow the terms of this notice.
      </p>
    ),
  },
  {
    heading: "How to Exercise Your Rights",
    body: (
      <p>
        Submit written requests to: {emailLink}
        <br />
        We will respond within 30 days.
      </p>
    ),
  },
  {
    heading: "Filing a Complaint",
    body: (
      <p>
        If you believe your privacy rights have been violated, you may file a complaint with us at{" "}
        {emailLink} or with the U.S. Department of Health and Human Services Office for Civil Rights
        at{" "}
        <a
          href="https://www.hhs.gov/ocr/privacy/hipaa/complaints"
          target="_blank"
          rel="noopener noreferrer"
          className={legalLink}
        >
          hhs.gov/ocr/privacy/hipaa/complaints
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>
    ),
  },
  {
    heading: "Changes to This Notice",
    body: (
      <p>
        We reserve the right to change this notice. Changes will apply to PHI we already have. The
        current notice is always available at{" "}
        <Link href="/hipaa" className={legalLink}>
          {HOST}/hipaa
        </Link>
        .
      </p>
    ),
  },
];

export default function HipaaPage() {
  // A HIPAA Notice of Privacy Practices requires an EFFECTIVE DATE. We never fabricate one: the date
  // comes from HIPAA_EFFECTIVE_DATE (launch.ts), set at deploy to the public launch date. Until then
  // we show no concrete date and instead state the moment the notice takes effect (below).
  return (
    <LegalPage
      eyebrow="Compliance"
      title="HIPAA Notice of Privacy Practices"
      lead={`This notice takes effect on the date ${SITE.name} first handles your member information.`}
      effectiveNote={HIPAA_EFFECTIVE_DATE ? `Effective date: ${HIPAA_EFFECTIVE_DATE}` : undefined}
      banner={Banner}
      sections={SECTIONS}
    />
  );
}
