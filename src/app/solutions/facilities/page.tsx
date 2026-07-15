import { pageMeta, ROUTE_META } from "@/lib/seo";
import {
  Hospital,
  CalendarCheck,
  Bookmark,
  CircleCheck,
  ClipboardList,
  Layers,
  RefreshCw,
  Users,
  HeartHandshake,
  PackagePlus,
  User,
  Accessibility,
  MapPin,
  Repeat,
} from "lucide-react";
import { SolutionPage, MockCard, type SolutionSection } from "@/components/solutions/SolutionPage";

export const metadata = pageMeta(ROUTE_META.facilities);

// Trip-composer vignette re-dressed for a facility user: book a member's outbound + return trips around
// the appointment (booking is LIVE). Stage 14 (§10.4): NO "linked"/"one round trip" framing — the
// platform's multi-leg data model is an open bug, so copy stays at "outbound and return trips scheduled
// around the appointment," never joined into one linked booking. "Sample data" hinted.
function BookRideMock() {
  return (
    <MockCard title="Book a ride">
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
      <div className="mt-4 space-y-2 text-[13px] text-muted">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full border border-border-strong bg-surface" aria-hidden="true" />
          <span>Home — Silver Spring, MD</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-default">Riverside Dialysis Center</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full border border-border-strong bg-surface" aria-hidden="true" />
          <span>Home — Silver Spring, MD</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1 text-[13px] font-medium text-muted">
          <Repeat className="h-3 w-3 text-accent" aria-hidden="true" />
          Outbound + return · will-call
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1 text-[13px] font-medium text-muted">
          <Accessibility className="h-3 w-3 text-svc-wheel" aria-hidden="true" />
          Door-to-door
        </span>
      </div>
    </MockCard>
  );
}

const SECTIONS: SolutionSection[] = [
  {
    kicker: "Booking",
    claim: "Book rides for the people in your care.",
    body: "One place to arrange and confirm every trip.",
    proofs: [
      { icon: CalendarCheck, text: "Book outbound and return trips around the appointment time — including will-call returns." },
      { icon: Bookmark, text: "Saved destinations for recurring care like dialysis." },
      { icon: CircleCheck, text: "Confirm the ride and the details in one place." },
    ],
    mock: <BookRideMock />,
  },
  {
    kicker: "Care needs",
    claim: "Needs read fresh, never assumed.",
    body: "The ride matches the person, not last month’s trip.",
    proofs: [
      { icon: ClipboardList, text: "Member mobility and care needs are read fresh at every booking." },
      { icon: Layers, text: "The service level is matched to what the trip actually needs." },
      { icon: RefreshCw, text: "Nothing is carried over from last time by default." },
    ],
  },
  {
    kicker: "Assist",
    claim: "Extra help when it’s needed.",
    body: "Bariatric & two-person assist, as an add-on.",
    proofs: [
      { icon: Users, text: "Bariatric & two-person assist available as an add-on to any service level." },
      { icon: HeartHandshake, text: "Two or more trained attendants when a member’s needs require it." },
      { icon: PackagePlus, text: "Reinforced equipment, matched to need." },
    ],
  },
];

export default function FacilitiesPage() {
  return (
    <SolutionPage
      region="md"
      eyebrow="For facilities & case managers"
      eyebrowIcon={Hospital}
      h1="Book the ride, hold the details."
      subline="Arrange rides for the people in your care — with their mobility and care needs read fresh at every booking."
      sections={SECTIONS}
      cta={{
        heading: "Let’s set up your facility.",
        body: "We’ll get your team booking in one call.",
        label: "Talk to us",
        href: "/contact",
      }}
    />
  );
}
