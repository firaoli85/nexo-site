import { pageMeta, ROUTE_META } from "@/lib/seo";
import Link from "next/link";
import { Truck, Users, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";
import { ContactForm } from "@/components/leads/ContactForm";
import { SITE } from "@/lib/site";
import { SERVICE_AREA_LINE, PORTAL_LIVE } from "@/lib/launch";

export const metadata = pageMeta(ROUTE_META.contact);

const eyebrowPill =
  "inline-flex items-center rounded-full border border-surface-tint-border bg-surface px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent";

const routeLink =
  "group mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-accent transition-colors hover:text-accent-hover " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

// Inline body links carry a PERSISTENT underline (not hover-only) so they're distinguishable from body
// text without relying on color (WCAG 1.4.1); hover shifts the accent for extra affordance.
const inlineLink =
  "rounded-sm font-medium text-accent underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export default function ContactPage() {
  return (
    <>
      {/* HERO — tint; DC composite bookend. */}
      <section className="relative overflow-hidden bg-surface-tint">
        <AmbientMap tone="light" region="dc" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className={eyebrowPill}>Contact</span>
            <h1 className="mt-4 font-display text-4xl font-hero leading-[1.08] tracking-hero text-default sm:text-5xl lg:text-6xl">
              Tell us about your program.
            </h1>
            <p className="mt-5 max-w-prose text-xl leading-relaxed tracking-lede text-muted">
              If you run a transportation benefit or book rides for the people in your care, tell us
              about the trips you cover, and we’ll show you how Nexo Access handles them.
            </p>
          </div>
        </Container>
      </section>

      {/* PRIMARY ACTION — white; the contact form (Stage 10S). Email stays below as an alternate path. */}
      <Section className="relative overflow-hidden border-t border-border bg-bg">
        <AmbientMap tone="light" region="dc" gutter={false} />
        <Container className="relative">
          <div className="max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>

          {/* Alternate paths — call or email us directly (tel:/mailto: links + values as selectable text). */}
          <div className="mt-6 max-w-2xl space-y-2 text-sm text-muted">
            <p className="font-medium text-default">Prefer to call or email us?</p>
            <p>
              Call{" "}
              <a href={`tel:${SITE.phone.e164}`} className={inlineLink}>
                {SITE.phone.display}
              </a>
              , or copy it:{" "}
              <span className="select-all font-medium text-default">{SITE.phone.display}</span>.
            </p>
            <p>
              Email{" "}
              <a href={`mailto:${SITE.email}`} className={inlineLink}>
                {SITE.email}
              </a>
              , or copy it:{" "}
              <span className="select-all font-medium text-default">{SITE.email}</span>.
            </p>
          </div>
        </Container>
      </Section>

      {/* ROUTING — tint; DC bookend. Providers → apply · Members → the member portal (never email). */}
      <Section className="relative overflow-hidden border-t border-border bg-surface-tint">
        <AmbientMap tone="light" region="dc" />
        <Container className="relative">
          <h2 className="max-w-2xl font-display text-2xl font-heading tracking-heading text-default sm:text-3xl">
            Looking for something else?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-surface-tint-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-default">Transport providers</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">Looking to run trips with us?</p>
              <Link href="/apply" className={routeLink}>
                Apply as provider
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
            {/* Members card — gated: hidden entirely until portal sign-in is live (PORTAL_LIVE), since
                app.nexoaccess.com does not exist yet. The Transport-providers card above always shows. */}
            {PORTAL_LIVE ? (
              <div className="rounded-2xl border border-surface-tint-border bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-default">Members</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  Need a ride or have a question about one? Sign in to your member portal.
                </p>
                {/* Stage 15: the member portal door, SAME-TAB (product handoff, not an external reference —
                    law §7.4). portalLogin is the single source; the old target=_blank + "(opens in a new
                    tab)" cue are gone now that portal navigation stays in-tab. */}
                <Link href={SITE.portalLogin("member")} className={routeLink}>
                  Member sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </div>
          <p className="mt-8 text-sm text-subtle">{SERVICE_AREA_LINE}</p>
        </Container>
      </Section>
    </>
  );
}
