import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";

// Section D — the closing CTA. White (the last light moment before the ink footer, per the
// tonal map). Confident and sparse: a display headline, one supporting line, two actions.
// atmo-light = the D25/T2 atmosphere layer (Task #27), and this is the ONE light band that gets it
// in this task. Why here: it is the last light moment before the ink footer, so warmth reads as the
// page settling rather than as decoration, and it already carries an AmbientMap — the atmosphere
// budget for this band was spent, not added to. NOT AudienceTriage, which the tonal map
// (nexo-brand §6.1) rules must stay CLEAN; cards and an ambient field fought there once already.
// No compensation is needed on light: the bench measured a white card separating BETTER under this
// glow (1.28) than it does today (1.07). WIDER ROLLOUT IS P4 PER-PAGE WORK.
export function FinalCta() {
  return (
    <Section className="atmo-light relative overflow-hidden bg-bg">
      <AmbientMap tone="light" region="md" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-heading leading-[1.08] tracking-heading text-default sm:text-4xl lg:text-5xl">
            Ready when your members are.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-muted">
            One platform for every trip, from the first booking to a checked, billable claim.
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
    </Section>
  );
}
