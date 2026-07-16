import { pageMeta, ROUTE_META } from "@/lib/seo";
import {
  Landmark,
  ShieldCheck,
  Lock,
  BadgeCheck,
  ListChecks,
  ClipboardCheck,
  Snowflake,
  Flag,
  FileSpreadsheet,
  Clock,
  CircleCheck,
} from "lucide-react";
import { SolutionPage, MockCard, type SolutionSection } from "@/components/solutions/SolutionPage";

export const metadata = pageMeta(ROUTE_META.mcos);

// Program-integrity vignette: one claim held for exception review (a timely-filing WARN — warns,
// never enforces), one clean claim auto-approved, and a pattern-report export. "Sample data" hinted.
function ExceptionReviewMock() {
  return (
    <MockCard title="Exception review">
      <div className="mt-3 space-y-2">
        <div className="rounded-lg border border-border bg-bg p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold tabular-nums text-default">CLM-4471</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-warning-subtle px-2 py-0.5 text-[13px] font-medium text-warning">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Timely-filing: 5 days left
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
            <Flag className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
            Held out of auto-payment · flagged for review
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
          <CircleCheck className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span className="font-medium tabular-nums text-default">CLM-4470</span>
          <span className="ml-auto tabular-nums">7/7 checks · auto-approved</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
          <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          Pattern report · export CSV / Excel
        </div>
      </div>
    </MockCard>
  );
}

const SECTIONS: SolutionSection[] = [
  {
    kicker: "Credential-gated network",
    claim: "Only current credentials get on the road.",
    body: "The network checks itself before a trip is ever assigned.",
    proofs: [
      { icon: ShieldCheck, text: "Drivers and vehicles with lapsed credentials are blocked from assignment, checked live at dispatch." },
      { icon: Lock, text: "Providers only receive the service levels they’re formally approved for, enforced at the database level." },
      { icon: BadgeCheck, text: "Every assignment carries the credentials it was cleared against." },
    ],
  },
  {
    kicker: "Claims discipline",
    claim: "The same checks on every claim, every time.",
    body: "No claim skips a step, and nothing changes after it’s frozen.",
    proofs: [
      { icon: ListChecks, text: "Four automated scrubbing checks before submission." },
      { icon: ClipboardCheck, text: "Seven adjudication checks route every claim to approve, review, or deny." },
      { icon: Snowflake, text: "Thirteen fields frozen at submission into a tamper-evident record." },
      { icon: Lock, text: "A database constraint makes double-paying a claim impossible." },
    ],
  },
  {
    kicker: "Program integrity",
    claim: "Exceptions surface before the money moves.",
    body: "Flagged claims wait for a person; the rest keep moving.",
    proofs: [
      { icon: Flag, text: "Flagged claims are held out of auto-payment for exception review." },
      { icon: FileSpreadsheet, text: "Pattern reports and CSV / Excel exports for your own analysis." },
      { icon: Clock, text: "Timely-filing windows warn before they lapse." },
    ],
    mock: <ExceptionReviewMock />,
  },
];

export default function McosPage() {
  return (
    <SolutionPage
      region="dc"
      eyebrow="For MCOs & payers"
      eyebrowIcon={Landmark}
      h1="A benefit that holds up to review."
      subline="Every trip runs on a credential-gated network, and every claim clears the same checks, so the transportation benefit stands up to scrutiny."
      sections={SECTIONS}
      cta={{
        heading: "See how it fits your program.",
        body: "We’ll walk your team through the controls and the reporting.",
        label: "Talk to us",
        href: "/contact",
      }}
    />
  );
}
