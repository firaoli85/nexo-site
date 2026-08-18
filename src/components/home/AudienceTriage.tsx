import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Landmark, Truck, Hospital, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

// Section B — audience triage. Four whole-card links into /solutions/*. The card IS the link
// (one <a>, focus ring on the card); hover = the established card grammar (edge/tint shift +
// arrow nudge). Honest one-liners only — no volume, no payment-speed (copy gate).
type Audience = { name: string; href: string; icon: LucideIcon; line: string; action: string };

const AUDIENCES: Audience[] = [
  { name: "MCOs & payers", href: "/solutions/mcos", icon: Landmark, line: "Run a transportation benefit and keep cost in view.", action: "Talk to us" },
  { name: "Transport providers", href: "/solutions/providers", icon: Truck, line: "Clear credentialing and clean claims, end to end.", action: "Partner with us" },
  { name: "Facilities & case managers", href: "/solutions/facilities", icon: Hospital, line: "Book and confirm rides for the people in your care.", action: "See how scheduling works" },
  { name: "Members", href: "/solutions/members", icon: Users, line: "A reliable ride to your appointment.", action: "What to expect" },
];

export function AudienceTriage() {
  return (
    <Section className="bg-bg">
      <Container>
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-surface-tint-border bg-surface-tint px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent">
            Who it’s for
          </span>
          <h2 className="mt-4 font-display text-3xl font-heading tracking-heading text-default sm:text-4xl">
            Built for everyone in the trip.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm outline-none transition-colors hover:border-control hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="mt-4 text-base font-semibold text-default">{a.name}</span>
                <span className="mt-1 flex-1 text-[15px] leading-snug text-muted">{a.line}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {a.action}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
