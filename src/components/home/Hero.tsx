import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductDemo } from "@/components/home/ProductDemo";
import { AmbientMap } from "@/components/home/AmbientMap";
import { HERO_LEDE } from "@/lib/seo";

// Stage 4.8 — the hero is now an INK ENVIRONMENT (lab pick H-A). Nav + hero + console share
// ONE ink world: the console belongs kin-to-kin (its on-ink-border-strong edge carries the
// separation, not a contrasting field), the ambient route-topology gives the field its "sky",
// and headline/subline/CTAs draw from the on-ink ramp. Seam out (Section): ink -> tint
// credential band -> white spine (see the tonal map).

// Headline copy is PLACEHOLDER (approved wording). The accent word is isolated so re-styling
// or re-wording it is a one-line edit.
const HEADLINE = { before: "Every trip, ", accent: "accounted", after: " for." };

// atmo-ink = the D25/T2 atmosphere layer (Task #27), and this is the FLAGSHIP application: the glow
// enters off the right edge and bleeds off the left-bottom corner, so it reads as light in the room
// rather than as a shape on the page. The class ALSO carries the compensated ink tokens, scoped (see
// globals.css) — a glow costs --ink-surface its D23 B06 separation as a matter of arithmetic, so the
// surface and BOTH border tiers are lifted for this subtree only, never globally.
// WIDER ROLLOUT IS P4 PER-PAGE WORK: the interior routes deliberately do NOT wear this yet, because
// each one needs its own painted-pixel AA pass first.
export function Hero() {
  return (
    <Section className="atmo-ink relative -mt-16 overflow-hidden bg-ink pt-28 sm:pt-32 lg:pt-36">
      {/* The living map (ink tone) — the hero field's atmosphere. Kept OUT of the console. */}
      <AmbientMap tone="ink" region="wide" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Headline block — server-rendered static; the LCP content. */}
          <div className="lg:col-span-5">
            <span className="ink-glass inline-flex items-center gap-1.5 rounded-full border border-on-ink-border-strong px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent-on-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-on-ink" aria-hidden="true" />
              Non-emergency medical transportation · DC, MD &amp; VA
            </span>
            <h1 className="mt-4 font-display text-4xl font-hero leading-[1.05] tracking-hero text-on-ink sm:text-5xl lg:text-6xl">
              {HEADLINE.before}
              <span className="text-accent-on-ink">{HEADLINE.accent}</span>
              {HEADLINE.after}
            </h1>
            <p className="mt-5 max-w-prose text-xl leading-snug tracking-lede text-on-ink-muted">
            {/* HERO_LEDE is the COMPLETE owner-approved lede (Task #17). A hardcoded tail used to
              follow it here; the approved second sentence now says "every claim is checked before it
              is billed", so that tail repeated the same claim in one paragraph (7 lines at 1440, 9 at
              390). The dropped driver-credentialing clause survives on this page in CredentialStrip
              and twice in ProductDemo, so no claim was lost. */}
              {HERO_LEDE}
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
