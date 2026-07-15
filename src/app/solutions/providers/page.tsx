import { pageMeta, ROUTE_META } from "@/lib/seo";
import {
  Truck,
  ClipboardCheck,
  BadgeCheck,
  Handshake,
  Eye,
  ListChecks,
  ScrollText,
  Scale,
  CircleCheck,
  History,
  Check,
} from "lucide-react";
import { SolutionPage, MockCard, type SolutionSection } from "@/components/solutions/SolutionPage";

export const metadata = pageMeta(ROUTE_META.providers);

// Claim-status vignette: one claim visible from submission to decision, with the two-level appeal
// note. NO payment timing, NO trip counts (the copy gate's highest-risk audience). "Sample data".
const CLAIM_STEPS: { label: string; note?: string }[] = [
  { label: "Submitted" },
  { label: "Scrubbed", note: "4/4" },
  { label: "Adjudicated", note: "7/7" },
  { label: "Approved" },
];

function ClaimStatusMock() {
  return (
    <MockCard title="Claim status">
      <div className="mt-3 flex items-center gap-2 text-[13px] text-muted">
        <span className="font-medium tabular-nums text-default">CLM-3390</span>
        <span className="tabular-nums">Trip NX-1042</span>
      </div>
      <ol className="mt-4 space-y-3">
        {CLAIM_STEPS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-text">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {i < CLAIM_STEPS.length - 1 ? (
                <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-border" aria-hidden="true" />
              ) : null}
            </span>
            <span className="text-sm font-medium text-default">{s.label}</span>
            {s.note ? <span className="ml-auto text-[13px] tabular-nums text-muted">{s.note} checks</span> : null}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
        <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
        <span>Denied? A two-level appeal — provable from the records overturns automatically.</span>
      </div>
    </MockCard>
  );
}

const SECTIONS: SolutionSection[] = [
  {
    kicker: "Onboarding",
    claim: "Requirements known up front.",
    body: "You see what’s needed before you commit anything.",
    proofs: [
      { icon: ClipboardCheck, text: "Clear requirements up front, tracked in the platform." },
      { icon: BadgeCheck, text: "Approval before any assignment — no surprises at dispatch." },
      { icon: Handshake, text: "Apply with no committed capacity required." },
    ],
  },
  {
    kicker: "Claim status",
    claim: "Every claim, visible end to end.",
    body: "You can see exactly where a claim is, and why.",
    proofs: [
      { icon: Eye, text: "Every claim’s status is visible from submission to decision." },
      { icon: ListChecks, text: "Claims are scrubbed before submission — checked, not just sent." },
      { icon: ScrollText, text: "When a claim needs work, the reason is on the record." },
    ],
    mock: <ClaimStatusMock />,
  },
  {
    kicker: "Appeals",
    claim: "A fair path when a claim is denied.",
    body: "Two levels of appeal, decided on the evidence.",
    proofs: [
      { icon: Scale, text: "Denied claims get a two-level appeal ladder." },
      { icon: CircleCheck, text: "Appeals provable from the platform’s own records overturn automatically." },
      { icon: History, text: "Every decision traces back to the record it was made on." },
    ],
  },
];

export default function ProvidersPage() {
  return (
    <SolutionPage
      region="va"
      eyebrow="For transport providers"
      eyebrowIcon={Truck}
      h1="Know where you stand, every step."
      subline="Transparent credentialing and clean claims — you always know what’s required, where every trip stands, and how a decision was reached."
      sections={SECTIONS}
      cta={{
        heading: "Apply to join the network.",
        body: "A short application. No committed capacity.",
        label: "Apply as provider",
        href: "/apply",
      }}
    />
  );
}
