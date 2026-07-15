import { pageMeta, ROUTE_META } from "@/lib/seo";
import { LegalPage, legalLink, type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = pageMeta(ROUTE_META.terms);

const SECTIONS: LegalSection[] = [
  {
    heading: "Acceptance of Terms",
    body: (
      <p>
        By using {SITE.name}, you agree to these terms. If you do not agree, do not use the platform.
      </p>
    ),
  },
  {
    heading: "Services",
    body: (
      <p>
        {SITE.name} provides a platform for scheduling and coordinating non-emergency medical
        transportation (NEMT) for Medicaid-eligible members in DC and Maryland. We are not a
        transportation provider — we coordinate between members, case workers, and credentialed
        transportation providers.
      </p>
    ),
  },
  {
    heading: "User Accounts",
    body: (
      <p>
        You are responsible for maintaining the confidentiality of your account credentials. You must
        notify us immediately of any unauthorized access.
      </p>
    ),
  },
  {
    heading: "Provider Obligations",
    body: (
      <p>
        Transportation providers using this platform agree to maintain all required credentials, carry
        valid insurance, employ only credentialed drivers, and comply with all applicable Medicaid
        transportation regulations.
      </p>
    ),
  },
  {
    heading: "Prohibited Uses",
    body: (
      <p>
        You may not use this platform to submit fraudulent claims, misrepresent trip completion, share
        account credentials, or circumvent any platform security measures.
      </p>
    ),
  },
  {
    heading: "Limitation of Liability",
    body: (
      <p>
        {SITE.name} coordinates transportation services but is not liable for delays, cancellations, or
        incidents that occur during transportation. Provider companies carry their own liability
        insurance.
      </p>
    ),
  },
  {
    heading: "Governing Law",
    body: (
      <p>
        These terms are governed by the laws of the State of Maryland, without regard to its
        conflict-of-laws rules. Any dispute arising under them will be brought in the state or federal
        courts located in Maryland.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        For questions about these terms:{" "}
        <a href={`mailto:${SITE.email}`} className={legalLink}>
          {SITE.email}
        </a>
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lead="The terms that govern use of the Nexo Access platform."
      sections={SECTIONS}
    />
  );
}
