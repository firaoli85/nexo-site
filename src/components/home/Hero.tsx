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

// THE HERO FIELD IS PURE INK (D31 / the D25 reversal). The warm atmosphere that shipped here in
// Task #27 is gone, and with it the scoped compensated ink pair -- this subtree is back on the
// Task-18 globals, re-measured: B06 1.25:1, --on-ink 16.17:1, --on-ink-muted 9.66:1. The field's
// atmosphere is carried by the AmbientMap alone.
//
// THE BREATHING FIELD IS DELIBERATELY NOT APPLIED HERE, and the reason is arithmetic rather than
// taste. On the returned Task-18 values B06 (--ink-surface vs --ink) measures 1.250:1 -- its floor,
// EXACTLY, with zero headroom. The maximum white alpha this field can carry and still keep the
// console card separating is 0.0000. Any breathing gradient under this hero re-opens precisely the
// deficit the scoped compensated ink pair was invented to pay, and D31 just deleted that machinery
// by ruling. `.breathe` therefore ships as a system primitive with no application yet; it belongs
// on a theater field that carries no raised card (#35), or here only after a compensation pass is
// re-derived on purpose.
export function Hero() {
  return (
    <Section className="relative -mt-16 overflow-hidden bg-ink pt-28 sm:pt-32 lg:pt-36">
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
