import { pageMeta, ROUTE_META } from "@/lib/seo";
import type { ReactNode } from "react";
import {
  Workflow,
  ShieldCheck,
  Users,
  Waypoints,
  ListChecks,
  ClipboardCheck,
  Snowflake,
  Lock,
  Scale,
  ReceiptText,
  Clock,
  BadgeCheck,
  History,
  Database,
  Flag,
  ScrollText,
  FileSpreadsheet,
  Download,
  Check,
  User,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AmbientMap } from "@/components/home/AmbientMap";
import { ProductDemo } from "@/components/home/ProductDemo";
import { ProofList, MockCard, type Proof } from "@/components/solutions/SolutionPage";
import { PlatformSubnav } from "@/components/platform/PlatformSubnav";
import { COMPLIANCE_LINE } from "@/lib/launch";
import { cn } from "@/utils/cn";

export const metadata = pageMeta(ROUTE_META.platform);

const eyebrowPill =
  "inline-flex items-center gap-1.5 rounded-full border border-surface-tint-border bg-surface px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent";

// ── the four deep-section vignettes (light MockCard demo grammar, "Sample data" hinted) ──────────

function AssignBoardMock() {
  return (
    <MockCard title="Assign driver">
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-subtle">
            <Check className="h-4 w-4 text-accent" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-default">M. Rivera</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Ready · credentials current
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
            <Lock className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-muted">D. Okafor</span>
          <span className="ml-auto text-[13px] font-medium text-danger">Blocked · license expired</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent-subtle bg-accent-subtle px-3 py-2 text-[13px] font-medium text-accent">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Assigned to M. Rivera
      </div>
    </MockCard>
  );
}

const SCRUB = ["Signature on file", "Driver match", "Vehicle match", "Mileage source"];

function ClaimReviewMock() {
  return (
    <MockCard title="Claim review">
      <div className="mt-3 flex items-center gap-2 text-[13px] text-muted">
        <span className="font-medium tabular-nums text-default">CLM-3390</span>
        <span className="tabular-nums">Trip NX-1042</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {SCRUB.map((l) => (
          <div key={l} className="flex items-center gap-1.5 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-[13px] text-muted">
            <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            {l}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] font-medium text-accent">
        <ListChecks className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">7/7</span> adjudication checks passed
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
        <Snowflake className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
        13 fields frozen · tamper-evident
      </div>
      <div className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
        <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
        <span>Denied? A two-level appeal, provable from the records, overturns automatically.</span>
      </div>
    </MockCard>
  );
}

const CRED_ROWS: { name: string; chip: string; chipClass: string }[] = [
  { name: "M. Rivera", chip: "Current", chipClass: "bg-accent-subtle text-accent" },
  { name: "A. Bello", chip: "Expiring · 12 days", chipClass: "bg-warning-subtle text-warning" },
  { name: "D. Okafor", chip: "Expired · blocked", chipClass: "bg-danger-subtle text-danger" },
];

function CredentialWallMock() {
  return (
    <MockCard title="Credentials">
      <div className="mt-3 space-y-2">
        {CRED_ROWS.map((r) => (
          <div key={r.name} className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2.5">
            <BadgeCheck className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
            <span className="text-sm font-medium text-default">{r.name}</span>
            <span className={cn("ml-auto rounded-md px-2 py-0.5 text-[13px] font-medium", r.chipClass)}>{r.chip}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
        <Database className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
        Row-Level Security · per-organization isolation
      </div>
    </MockCard>
  );
}

function ExceptionQueueMock() {
  return (
    <MockCard title="Exception queue">
      <div className="mt-3 rounded-lg border border-border bg-bg p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold tabular-nums text-default">CLM-5120</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-warning-subtle px-2 py-0.5 text-[13px] font-medium text-warning">
            <Flag className="h-3 w-3" aria-hidden="true" />
            Held for review
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5 text-[13px] text-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            Held out of automatic payment
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
            In review · assigned to a reviewer
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
        <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
        Pattern report · by rule, driver, provider
      </div>
    </MockCard>
  );
}

// ── the four sections ────────────────────────────────────────────────────────────────────────────
type PlatformSection = { id: string; kicker: string; claim: string; subline: string; proofs: Proof[]; mock: ReactNode };

const SECTIONS: PlatformSection[] = [
  {
    id: "dispatch",
    kicker: "Dispatch",
    claim: "One validated path for every trip.",
    subline: "From booking to a locked, completed record, the system holds the trip to a single path.",
    proofs: [
      { icon: Workflow, text: "Every trip follows a validated state machine. Completed, cancelled, and no-show are final." },
      { icon: ShieldCheck, text: "Drivers and vehicles with lapsed credentials are blocked from assignment, checked live at dispatch." },
      { icon: Users, text: "Two dispatchers can’t overwrite each other: the losing write is rejected, and every turnback or restore carries a logged reason." },
      { icon: Waypoints, text: "Outbound and return trips scheduled around the appointment, including will-call returns." },
    ],
    mock: <AssignBoardMock />,
  },
  {
    id: "claims-billing",
    kicker: "Claims & billing",
    claim: "Clean claims, by construction.",
    subline: "The checks run before submission, and the record can’t be quietly changed after.",
    proofs: [
      { icon: ListChecks, text: "Four automated scrubbing checks before a claim can be submitted." },
      { icon: ClipboardCheck, text: "Seven adjudication checks route every claim to approve, review, or deny." },
      { icon: Snowflake, text: "Thirteen fields frozen at submission into a tamper-evident record." },
      { icon: Lock, text: "A database constraint makes double-paying a claim impossible." },
      { icon: Scale, text: "A two-level appeal ladder: appeals provable from the platform’s own records overturn automatically." },
      { icon: ReceiptText, text: "Every claim bills the plan that covered the member on the trip date." },
      { icon: Clock, text: "Timely-filing deadlines warn before they lapse." },
    ],
    mock: <ClaimReviewMock />,
  },
  {
    id: "compliance",
    kicker: "Compliance",
    claim: "Isolation and audit, enforced in the database.",
    subline: "These controls are constraints the platform can’t skip, not entries in a policy binder.",
    proofs: [
      { icon: BadgeCheck, text: "Credentials tracked for drivers, vehicles, and providers. Expiry blocks assignment automatically." },
      { icon: Lock, text: "Providers only receive the service levels they’re formally approved for, enforced at the database level." },
      { icon: History, text: "An immutable audit trail on the records that matter." },
      { icon: Database, text: "Row-Level Security on every table, for per-organization isolation." },
      { icon: ShieldCheck, text: COMPLIANCE_LINE },
    ],
    mock: <CredentialWallMock />,
  },
  {
    id: "oversight",
    kicker: "Oversight & reporting",
    claim: "Exceptions get a person, not a rubber stamp.",
    subline: "The claims that need judgment wait for it; the rest keep moving.",
    proofs: [
      { icon: Flag, text: "Flagged claims are held out of automatic payment until a person reviews them." },
      { icon: ScrollText, text: "Exception review with a full decision trail." },
      { icon: FileSpreadsheet, text: "Pattern reports by rule, driver, and provider." },
      { icon: Download, text: "CSV / Excel exports for program reporting." },
    ],
    mock: <ExceptionQueueMock />,
  },
];

const KICKER = "text-xs font-semibold uppercase tracking-[0.08em] text-accent";

export default function PlatformPage() {
  return (
    <>
      {/* HERO — a tint opening; the reused ProductDemo is the opening proof (self-contained ink card,
          not a new ink chapter). Wide region crop bookends the page. */}
      <section className="relative overflow-hidden bg-surface-tint">
        <AmbientMap tone="light" region="wide" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <span className={eyebrowPill}>The platform</span>
              <h1 className="mt-4 font-display text-4xl font-hero leading-[1.08] tracking-hero text-default sm:text-5xl lg:text-6xl">
                The whole trip, in one system.
              </h1>
              <p className="mt-5 max-w-prose text-xl leading-relaxed tracking-lede text-muted">
                The platform for non-emergency medical transportation (NEMT): dispatch, claims,
                compliance, and oversight in one system, from the first booking to a checked,
                billable claim.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ProductDemo />
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION SUB-NAV — scrollspy, sticky below the main nav. */}
      <PlatformSubnav />

      {/* THE FOUR DEEP SECTIONS — alternating white/tint; each anchored with scroll-margin sized for
          BOTH sticky bars (nav 64px + sub-nav ~48px). Grid whisper only (region glyphs stay on the
          hero + CTA bookends). */}
      {SECTIONS.map((s, i) => {
        const tint = i % 2 === 1;
        const flip = i % 2 === 1;
        return (
          <Section
            key={s.id}
            id={s.id}
            className={cn(
              "relative scroll-mt-[124px] overflow-hidden border-t border-border",
              tint ? "bg-surface-tint" : "bg-bg"
            )}
          >
            <AmbientMap tone="light" region="wide" gutter={false} />
            <Container className="relative">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
                <div className={cn("max-w-xl", flip && "lg:order-2")}>
                  <span className={KICKER}>{s.kicker}</span>
                  <h2 className="mt-2 font-display text-2xl font-heading tracking-heading text-default sm:text-3xl">
                    {s.claim}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-muted">{s.subline}</p>
                  <ProofList proofs={s.proofs} />
                </div>
                <div className={cn(flip && "lg:order-1")}>{s.mock}</div>
              </div>
            </Container>
          </Section>
        );
      })}

      {/* CLOSING CTA BAND — DUAL CTA (mixed readers; the B5 one-CTA rule is for the audience pages). */}
      <section className="relative overflow-hidden border-t border-border bg-surface-tint">
        <AmbientMap tone="light" region="wide" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-heading leading-[1.1] tracking-heading text-default sm:text-4xl">
              See it with your own trips in mind.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
              A walkthrough with your programs, your providers, and your claims.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/contact" variant="primary" size="md">
                Talk to us
              </Button>
              <Button href="/apply" variant="secondary" size="md">
                Apply as provider
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
