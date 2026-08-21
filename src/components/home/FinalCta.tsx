import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";

// Section D — the closing CTA. White (the last light moment before the ink footer, per the
// tonal map). Confident and sparse: a display headline, one supporting line, two actions.
// The band is PLAIN LIGHT again (D31 / the D25 reversal). Its atmosphere is the AmbientMap alone.
// The breathing field is deliberately NOT applied here: D30 makes breathing a THEATER-register
// tool, and this band is paper -- the last light moment before the ink footer.
export function FinalCta() {
  return (
    <Section className="relative overflow-hidden bg-bg">
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
