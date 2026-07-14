import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductDemo } from "@/components/home/ProductDemo";
import { AmbientMap } from "@/components/home/AmbientMap";
import { SERVICE_AREA_PROSE } from "@/lib/launch";

// Stage 4.8 — the hero is now an INK ENVIRONMENT (lab pick H-A). Nav + hero + console share
// ONE ink world: the console belongs kin-to-kin (its on-ink-border-strong edge carries the
// separation, not a contrasting field), the ambient route-topology gives the field its "sky",
// and headline/subline/CTAs draw from the on-ink ramp. Seam out (Section): ink -> tint
// credential band -> white spine (see the tonal map).

// Headline copy is PLACEHOLDER (approved wording). The accent word is isolated so re-styling
// or re-wording it is a one-line edit.
const HEADLINE = { before: "Every trip, ", accent: "accounted", after: " for." };

export function Hero() {
  return (
    <Section className="relative -mt-16 overflow-hidden bg-ink pt-28 sm:pt-32 lg:pt-36">
      {/* The living map (ink tone) — the hero field's atmosphere. Kept OUT of the console. */}
      <AmbientMap tone="ink" region="wide" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Headline block — server-rendered static; the LCP content. */}
          <div className="lg:col-span-5">
            <span className="ink-glass inline-flex items-center gap-1.5 rounded-full border border-on-ink-border-strong px-3 py-1 text-xs font-medium tracking-wide text-accent-on-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-on-ink" aria-hidden="true" />
              Non-emergency medical transportation · DC, MD &amp; VA
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-on-ink sm:text-5xl lg:text-6xl">
              {HEADLINE.before}
              <span className="text-accent-on-ink">{HEADLINE.accent}</span>
              {HEADLINE.after}
            </h1>
            <p className="mt-5 max-w-prose text-xl leading-snug text-on-ink-muted">
              Nexo Access is a technology-first NEMT company {SERVICE_AREA_PROSE}.
              Every driver is credential-verified before dispatch, and every claim
              is checked — automatically — before it’s billed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/platform" variant="primaryOnInk" size="md">
                See the platform
              </Button>
              <Button href="/contact" variant="secondaryOnInk" size="md">
                Talk to us
              </Button>
            </div>
          </div>

          {/* Demo console — right column, kin-to-kin on the ink field. */}
          <div className="lg:col-span-7">
            <ProductDemo />
          </div>
        </div>
      </Container>
    </Section>
  );
}
