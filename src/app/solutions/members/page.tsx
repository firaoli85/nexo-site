import { pageMeta, ROUTE_META } from "@/lib/seo";
import {
  Users,
  ShieldCheck,
  Accessibility,
  DoorOpen,
  ClipboardList,
  MessageSquare,
  HeartHandshake,
  PackagePlus,
  CalendarClock,
  History,
  MapPin,
  CircleCheck,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { SolutionPage, MockCard, type SolutionSection } from "@/components/solutions/SolutionPage";

export const metadata = pageMeta(ROUTE_META.members);

// Member "my rides" vignette: an upcoming ride and a past one, plainly. NO live tracking anywhere on
// this page — "scheduled times", not "where your ride is". "Sample data" hinted.
function MyRidesMock() {
  return (
    <MockCard title="My rides">
      <div className="mt-3 space-y-2">
        <div className="rounded-lg border border-border bg-bg p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold text-accent">Upcoming</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-svc-wheel-subtle px-2 py-0.5 text-[13px] font-medium text-svc-wheel">
              <Accessibility className="h-3 w-3" aria-hidden="true" />
              Wheelchair
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-muted">
            <CalendarClock className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span className="font-medium text-default">Tue · 9:30 AM</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[13px] text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
            <span>Riverside Dialysis Center</span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-[13px] text-muted">
          <CircleCheck className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span>Fri · 2:00 PM</span>
          <span className="ml-auto">Completed</span>
        </div>
      </div>
    </MockCard>
  );
}

const SECTIONS: SolutionSection[] = [
  {
    kicker: "Your ride",
    claim: "What to expect from a ride.",
    proofs: [
      { icon: ShieldCheck, text: "A driver whose credentials are checked before your trip." },
      { icon: Accessibility, text: "The right vehicle for how you travel, including wheelchair-accessible." },
      { icon: DoorOpen, text: "Door-to-door, so you’re not left to find your way." },
    ],
  },
  {
    kicker: "Your needs",
    claim: "Your needs, checked every time.",
    proofs: [
      { icon: ClipboardList, text: "Your needs are checked at every booking — not assumed from last time." },
      { icon: MessageSquare, text: "Tell us what’s changed, and the ride changes with it." },
    ],
  },
  {
    kicker: "Extra help",
    claim: "Extra help when you need it.",
    proofs: [
      { icon: HeartHandshake, text: "When you need more help, trained attendants can come along." },
      { icon: PackagePlus, text: "The right equipment for a safe, comfortable ride." },
    ],
  },
  {
    kicker: "Your rides",
    claim: "See your rides in one place.",
    body: "Your upcoming and past rides, in your member portal.",
    proofs: [
      { icon: CalendarClock, text: "See your upcoming rides and their scheduled times." },
      { icon: History, text: "Look back at the rides you’ve taken." },
    ],
    mock: <MyRidesMock />,
  },
];

export default function MembersPage() {
  return (
    <SolutionPage
      region="wide"
      eyebrow="For members & families"
      eyebrowIcon={Users}
      h1="A ride you can count on."
      subline="A verified driver, the right vehicle for your needs, and a simple way to see your rides."
      sections={SECTIONS}
      cta={{
        heading: "Ready for your next ride?",
        body: "Sign in to see your rides.",
        label: "Member sign in",
        // Stage 15: the member portal door, SAME-TAB (product handoff, not an external reference —
        // law §7.4). portalLogin is the single source; the old target=_blank + new-tab cue are gone.
        href: SITE.portalLogin("member"),
      }}
    />
  );
}
