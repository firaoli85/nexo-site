import { pageMeta, ROUTE_META } from "@/lib/seo";
import { ShieldCheck, HeartHandshake, Eye } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AmbientMap } from "@/components/home/AmbientMap";
import { SITE, FOUNDER_REF } from "@/lib/site";
import { SERVICE_AREA_LINE, SERVICE_AREA_PROSE } from "@/lib/launch";

export const metadata = pageMeta(ROUTE_META.about);

const eyebrowPill =
  "inline-flex items-center rounded-full border border-surface-tint-border bg-surface px-3 py-1 text-xs font-medium tracking-wide text-accent";

// PRINCIPLES — three commitments in the certified proof grammar (icon chip + title + line). No scale
// claims, no theater; §7.1 dignity language on the member principle.
const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Enforcement over promises",
    body: "Credentials checked at dispatch, claims checked before billing: by the platform, not a binder.",
  },
  {
    icon: HeartHandshake,
    title: "Dignity for every member",
    body: "The right vehicle and the right help, matched to what each member’s trip actually needs.",
  },
  {
    icon: Eye,
    title: "Transparency for partners",
    body: "Providers and payers see the same trip and claim record, with no separate story for anyone.",
  },
];

const FACTS = [
  { label: "Company", value: `${SITE.legalName}, dba ${SITE.name}` },
  { label: "What we are", value: "A technology-first NEMT company" },
  { label: "Service area", value: SERVICE_AREA_LINE },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO — tint; wide composite bookend. */}
      <section className="relative overflow-hidden bg-surface-tint">
        <AmbientMap tone="light" region="wide" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className={eyebrowPill}>About Nexo Access</span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-default sm:text-5xl lg:text-6xl">
              Built by an operator.
            </h1>
            <p className="mt-5 max-w-prose text-xl leading-relaxed text-muted">
              The person who built this platform spent years dispatching these trips.
            </p>
          </div>
        </Container>
      </section>

      {/* STORY — white; the operator's story (FOUNDER_REF only, never a name/prior company). */}
      <Section className="relative overflow-hidden border-t border-border bg-bg">
        <AmbientMap tone="light" region="wide" gutter={false} />
        <Container className="relative">
          <div className="max-w-prose space-y-5 text-lg leading-relaxed text-muted">
            <p>
              For years, {FOUNDER_REF} ran non-emergency medical transportation in the DMV and watched
              the same things go wrong from the inside: missed pickups, credential files kept in paper
              folders, and claims that came back denied weeks after the trip.
            </p>
            <p>
              Nexo Access is the system {FOUNDER_REF} needed and could not buy. The rules this industry
              keeps in binders, who is allowed to drive, what a clean claim looks like, when a record is
              final, are enforced by the platform itself. An expired license means the assignment is
              refused. A missing signature means the claim does not go out.
            </p>
            <p>
              One honest system for the whole trip, from the first booking to a checked, billable claim.
              It’s {SERVICE_AREA_PROSE}.
            </p>
          </div>
        </Container>
      </Section>

      {/* PRINCIPLES — tint. */}
      <Section className="relative overflow-hidden border-t border-border bg-surface-tint">
        <AmbientMap tone="light" region="wide" gutter={false} />
        <Container className="relative">
          <h2 className="max-w-2xl font-display text-2xl font-bold tracking-tight text-default sm:text-3xl">
            What we hold ourselves to.
          </h2>
          <ul className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-10">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-default">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* COMPANY FACTS — white section, a quiet tint card. */}
      <Section className="relative overflow-hidden border-t border-border bg-bg">
        <AmbientMap tone="light" region="wide" gutter={false} />
        <Container className="relative">
          <div className="max-w-2xl rounded-2xl border border-surface-tint-border bg-surface-tint p-6 sm:p-8">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm font-medium text-subtle">{f.label}</dt>
                  <dd className="mt-1 text-base font-medium text-default">{f.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-sm font-medium text-subtle">Email</dt>
                <dd className="mt-1 text-base font-medium">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="rounded-sm font-medium text-accent underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-tint"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>

      {/* CTA — tint bookend; wide composite. */}
      <section className="relative overflow-hidden border-t border-border bg-surface-tint">
        <AmbientMap tone="light" region="wide" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-default sm:text-4xl">
              Let’s talk about your trips.
            </h2>
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
