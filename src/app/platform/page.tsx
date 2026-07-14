// ⚠️ TEMPORARY STUB — Stage 1 route skeleton. Real content lands in a later stage.
// Exists so chrome links never 404. The four empty <section> anchors below give the
// Platform menu's deep-links (#dispatch, #claims-billing, #compliance, #oversight)
// real scroll targets today. No design intent here.
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function PlatformPage() {
  return (
    <>
      <Section>
        <Container>
          <h1 className="font-display text-4xl font-bold tracking-tight text-default">
            Platform
          </h1>
          <p className="mt-4 text-muted">Content in progress.</p>
        </Container>
      </Section>

      {/* Empty anchored sections — deep-link targets for the Platform menu. */}
      <section id="dispatch" className="scroll-mt-24" />
      <section id="claims-billing" className="scroll-mt-24" />
      <section id="compliance" className="scroll-mt-24" />
      <section id="oversight" className="scroll-mt-24" />
    </>
  );
}
