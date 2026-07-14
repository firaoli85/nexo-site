import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Ban,
  Bookmark,
  Check,
  ClipboardCheck,
  ClipboardList,
  Database,
  History,
  Layers,
  ListChecks,
  Lock,
  MapPin,
  ShieldCheck,
  User,
  Waypoints,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import { ServiceMorph } from "./ServiceMorph";
import { AmbientMap } from "./AmbientMap";
import { AssistScene } from "./AssistScene";
import { ProofSpotlight } from "./ProofSpotlight";

// Stage-3 signature section: four "station stop" feature sections — the story of one trip, from
// request to clean claim. Content is server-rendered static (SSR shows the full composition). The
// scroll-drawn route LINE + station nodes + livery van are the page-level RouteOverlay (Stage 6.4,
// in the layout); it also arms this region ([data-spine-region]) so the stop reveals + mock
// micro-animations play. Every string is inside the copy-honesty gate; the only numbers are the
// permitted 4 / 7 / 13 / 3.

type Proof = { icon: LucideIcon; text: string };

const STOPS: { num: string; claim: string; body: string; proofs: Proof[] }[] = [
  {
    num: "Stop 01",
    claim: "Built around the member.",
    body: "Every trip starts from the member — their mobility level, their care needs, and the places they go again and again.",
    proofs: [
      { icon: Waypoints, text: "Round trips and multi-stop rides booked as one linked trip." },
      { icon: ClipboardList, text: "Mobility and care needs read fresh at every booking." },
      { icon: Bookmark, text: "Saved destinations for recurring care like dialysis." },
    ],
  },
  {
    num: "Stop 02",
    claim: "A lifecycle that can’t be quietly edited.",
    body: "Once a trip exists, its history is protected. Status follows one validated path, and final states stay final.",
    proofs: [
      { icon: Workflow, text: "Every status change validated by a state machine." },
      { icon: Lock, text: "Completed, cancelled, and no-show are final — no silent flips." },
      { icon: ShieldCheck, text: "Dispatchers can’t overwrite each other’s edits." },
      { icon: History, text: "Every turnback and restore carries a logged reason." },
    ],
  },
  {
    num: "Stop 03",
    claim: "Every mobility level, covered.",
    body: "Ambulatory, wheelchair, or stretcher — the platform knows what each trip needs and who is allowed to serve it.",
    proofs: [
      {
        icon: Layers,
        text: "Three service levels — ambulatory, wheelchair, and stretcher — with bariatric & two-person assist available as an add-on to any of them.",
      },
      { icon: Database, text: "A provider only receives service levels it is formally approved for — enforced at the database level." },
      { icon: Lock, text: "Drivers and vehicles with lapsed credentials are blocked from assignment automatically." },
    ],
  },
  {
    num: "Stop 04",
    claim: "Checked before it’s ever billed.",
    body: "No claim goes out unchecked. Scrubbing, adjudication, and a frozen record stand between a completed trip and a bill.",
    proofs: [
      { icon: ListChecks, text: "Four automated scrubbing checks before submission." },
      { icon: ClipboardCheck, text: "Seven adjudication checks route every claim to approve, review, or deny." },
      { icon: ShieldCheck, text: "Thirteen fields frozen at submission into a tamper-evident record." },
      { icon: Lock, text: "A database constraint makes double-paying a claim impossible." },
    ],
  },
];

// ── shared mock atoms (Stage-2 demo grammar) ────────────────────────────────
function MockCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{title}</span>
        <span className="text-[13px] text-subtle">Sample data</span>
      </div>
      {children}
    </div>
  );
}

function MarchConnector() {
  return (
    <div className="ml-[9px] py-0.5" aria-hidden="true">
      <svg width="2" height="18" viewBox="0 0 2 18" fill="none">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="18"
          className="spine-march stroke-border-strong"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function ScheduleMock() {
  return (
    <MockCard title="Trip composer">
      <div className="mt-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg">
          <User className="h-4 w-4 text-subtle" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-default">J. Sample</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-svc-wheel-subtle px-2 py-1 text-[13px] font-medium text-svc-wheel">
          <Accessibility className="h-3 w-3" aria-hidden="true" />
          Wheelchair
        </span>
      </div>
      <div className="mt-4 text-[13px] text-muted">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full border border-border-strong bg-surface" aria-hidden="true" />
          <span>Home — Silver Spring, MD</span>
        </div>
        <MarchConnector />
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-default">Riverside Dialysis Center</span>
        </div>
        <MarchConnector />
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full border border-border-strong bg-surface" aria-hidden="true" />
          <span>Home — Silver Spring, MD</span>
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1 text-[13px] font-medium text-muted">
        <Accessibility className="h-3 w-3 text-svc-wheel" aria-hidden="true" />
        Uses wheelchair · door-to-door
      </div>
    </MockCard>
  );
}

const LIFECYCLE = ["Scheduled", "Assigned", "In progress", "Completed"];

function LifecycleMock() {
  return (
    <MockCard title="Trip lifecycle">
      <div className="mt-5 flex">
        {LIFECYCLE.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span className={cn("h-px flex-1", i === 0 ? "bg-transparent" : "bg-border")} aria-hidden="true" />
              <span
                className={cn(
                  "spine-pulse flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-text",
                  i === 1 && "spine-pulse-2",
                  i === 2 && "spine-pulse-3",
                  i === 3 && "spine-pulse-4"
                )}
              >
                {i === LIFECYCLE.length - 1 ? (
                  <Lock className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </span>
              <span className={cn("h-px flex-1", i === LIFECYCLE.length - 1 ? "bg-transparent" : "bg-border")} aria-hidden="true" />
            </div>
            <span className="mt-1.5 text-center text-[13px] font-medium leading-tight text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px]">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger-subtle">
          <Ban className="h-3 w-3 text-danger" aria-hidden="true" />
        </span>
        <span className="text-muted">
          Change Completed → Scheduled — <span className="font-medium text-danger">refused</span>
        </span>
      </div>
    </MockCard>
  );
}

// Hand-built service-level figure — ONE SVG, three states via [data-level] on the client
// .svc-stage wrapper (see globals.css .svc-*). Server component (static markup, stays out of
// the client bundle); passed to ServiceMorph as children. Decorative — aria-hidden, no
// <title>/<desc>. Stage 4.8: this is the HEAVY treatment (lab pick M-B) — 2.9px strokes
// (.svc-figure-heavy), FILLED key shapes (wheel hub, stretcher slab, feet, head), the
// further-brightened figure apparatus (fig-wheel/fig-str), and +15% scale, with all boldness
// spent on the wheel. Zero hex — token utilities only.
export function Figure() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="svc-figure-heavy h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* +15% scale around the figure centre; strokes stay crisp (non-scaling-stroke) */}
      <g transform="translate(100 75) scale(1.15) translate(-100 -75)">
        {/* static ground line — same in all states, so the figure never floats */}
        <line className="svc-ground stroke-on-ink-border-strong" x1="40" y1="134" x2="160" y2="134" />

        {/* Ambulatory — the member's legs (ink), standing / mid-stride, with weighted feet. */}
        <g className="svc-app svc-app-amb stroke-on-ink">
          <line x1="100" y1="80" x2="88" y2="132" />
          <line x1="100" y1="80" x2="112" y2="132" />
          <ellipse cx="84" cy="132" rx="6.5" ry="3.2" className="fill-on-ink" stroke="none" />
          <ellipse cx="116" cy="132" rx="6.5" ry="3.2" className="fill-on-ink" stroke="none" />
        </g>

        {/* Wheelchair — the HERO shape: thick ring + filled hub + spokes + caster + frame
            (fig-wheel), the member's seated L-legs (ink). */}
        <g className="svc-app svc-app-wheel fig-wheel stroke-current">
          <circle cx="103" cy="113" r="22" />
          <line x1="103" y1="91" x2="103" y2="135" />
          <line x1="81" y1="113" x2="125" y2="113" />
          <line x1="87.5" y1="97.5" x2="118.5" y2="128.5" />
          <line x1="118.5" y1="97.5" x2="87.5" y2="128.5" />
          <circle cx="103" cy="113" r="5" className="fill-current" stroke="none" />
          <circle cx="74" cy="128" r="6" className="fill-current" stroke="none" />
          <line x1="78" y1="99" x2="112" y2="99" />
          <line x1="112" y1="99" x2="114" y2="76" />
          <line x1="78" y1="99" x2="74" y2="122" />
          <g className="stroke-on-ink">
            <line x1="100" y1="99" x2="77" y2="101" />
            <line x1="77" y1="101" x2="75" y2="120" />
          </g>
        </g>

        {/* Stretcher — filled muted-light slab (bed) + fuchsia frame/pillow/wheels (fig-str)
            + the member's extended legs (ink). */}
        <g className="svc-app svc-app-str fig-str stroke-current">
          <rect x="46" y="89" width="108" height="11" rx="5.5" className="fill-on-ink-muted" />
          <rect x="49" y="80" width="20" height="9" rx="4.5" className="fill-current" stroke="none" />
          <line x1="62" y1="100" x2="62" y2="124" />
          <line x1="138" y1="100" x2="138" y2="124" />
          <circle cx="62" cy="129" r="5.5" className="fill-current" stroke="none" />
          <circle cx="138" cy="129" r="5.5" className="fill-current" stroke="none" />
          <g className="stroke-on-ink">
            <line x1="122" y1="88" x2="146" y2="87" />
          </g>
        </g>

        {/* Persistent body — thick strokes, FILLED head; identical across all three states. */}
        <g className="svc-body stroke-on-ink">
          <circle cx="100" cy="22" r="9" className="fill-on-ink" />
          <rect x="92" y="32" width="16" height="48" rx="8" />
        </g>
      </g>
    </svg>
  );
}

// Stop-3 mock: the service-level morph (Stage-4 signature). The figure is server-
// rendered; ServiceMorph (client) drives the level state, cycle, and card controls.
function ServiceLevelsMock() {
  return (
    <ServiceMorph>
      <Figure />
    </ServiceMorph>
  );
}

const SCRUBS = ["Signature on file", "Driver match", "Vehicle match", "Mileage source"];

function ClaimMock() {
  return (
    <MockCard title="Claim NX-C-2210">
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {SCRUBS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "spine-scrub flex items-center gap-1.5 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-[13px] text-default",
              i === 1 && "spine-scrub-2",
              i === 2 && "spine-scrub-3",
              i === 3 && "spine-scrub-4"
            )}
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent-subtle px-3 py-2 text-[13px] font-medium text-accent">
        <ListChecks className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">7/7</span> adjudication checks passed
      </div>
      <div className="mt-2 flex items-center gap-2 text-[13px] text-default">
        <Lock className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
        <span className="tabular-nums">13</span> fields frozen at submission
      </div>
      <div className="mt-2 text-[13px] text-muted">Claim NX-C-2210 ↔ one payment run</div>
    </MockCard>
  );
}

const MOCKS = [ScheduleMock, LifecycleMock, ServiceLevelsMock, ClaimMock];

// Intentional regional crop per stop — a DC/MD/VA emphasis distributed down the page (the map reads
// as ONE place seen from different angles).
const STOP_REGIONS = ["md", "va", "dc", "md"] as const;

function Stop({ index }: { index: number }) {
  const stop = STOPS[index];
  const Mock = MOCKS[index];
  const flip = index % 2 === 1;
  const ink = index === 2; // Stop 3 is the full-bleed ink band: white / tint / INK / tint.
  return (
    <div
      data-spine-stop
      className={cn(
        "relative overflow-hidden",
        ink ? "bg-ink" : index % 2 === 0 ? "bg-bg" : "bg-surface-tint"
      )}
    >
      {/* The living map — ink tone on the band, light tone on the white/tint stops; a distinct
          variant per stop so it reads as one continuous map. */}
      <AmbientMap tone={ink ? "ink" : "light"} region={STOP_REGIONS[index]} />
      {/* Generous padding on the ink band so it reads as a chapter, not a stripe. */}
      <Section className={cn(ink && "relative py-24 sm:py-28 lg:py-32")}>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pl-20">
            {/* Text — always DOM-first (reading order); visually swapped on even stops. */}
            <div className={cn("spine-reveal", flip && "lg:order-2")}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
                  ink
                    ? "ink-glass border border-on-ink-border text-accent-on-ink"
                    : "bg-accent-subtle text-accent"
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", ink ? "bg-accent-on-ink" : "bg-accent")}
                  aria-hidden="true"
                />
                {stop.num}
              </span>
              <h3
                className={cn(
                  "mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl",
                  ink ? "text-on-ink" : "text-default"
                )}
              >
                {stop.claim}
              </h3>
              <p className={cn("mt-3 max-w-md text-lg leading-relaxed", ink ? "text-on-ink-muted" : "text-muted")}>
                {stop.body}
              </p>
              <ProofSpotlight surface={ink ? "ink" : "light"} className="mt-6 space-y-3">
                {stop.proofs.map(({ icon: Icon, text }) => (
                  <li key={text} data-proof-item className="proof-item flex gap-3">
                    <span
                      className={cn(
                        "proof-chip mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        ink
                          ? "border border-on-ink-border bg-ink-surface text-accent-on-ink"
                          : "bg-accent-subtle text-accent"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span
                      className={cn(
                        "text-base font-medium leading-relaxed lg:text-[17px]",
                        ink ? "text-on-ink" : "text-default"
                      )}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ProofSpotlight>
            </div>
            {/* Mock vignette */}
            <div className={cn("spine-reveal", flip && "lg:order-1")}>
              <Mock />
            </div>
          </div>

          {/* Stage 6 — the ASSIST SCENE: a second movement inside this same ink chapter (below the
              morph). A MODIFIER on the 3 service levels, never a 4th. */}
          {ink ? <AssistScene /> : null}
        </Container>
      </Section>
    </div>
  );
}

export function RouteSpine() {
  return (
    <section aria-labelledby="spine-heading" className="relative">
      <Section className="pb-4 lg:pb-6">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-surface-tint-border bg-surface-tint px-3 py-1 text-xs font-medium tracking-wide text-accent">
              How a trip runs on Nexo
            </span>
            <h2
              id="spine-heading"
              className="mt-4 font-display text-3xl font-bold tracking-tight text-default sm:text-4xl"
            >
              From request to clean claim.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Follow one trip down the line — from the first booking to a checked,
              billable claim — and the guardrails built into every stop.
            </p>
          </div>
        </Container>
      </Section>

      {/* Stops region — the page-level RouteOverlay (in the layout) draws the line across these four
          bands and continues it down the rest of the page to the footer. */}
      <div data-spine-region className="relative">
        {STOPS.map((_, i) => (
          <Stop key={i} index={i} />
        ))}
      </div>
    </section>
  );
}
