// ⚠️ TEMPORARY STUB — Stage 1 route skeleton. Real content lands in a later stage.
// Exists so chrome links never 404. No design intent here.
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function FacilitiesPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display text-4xl font-bold tracking-tight text-default">
          Facilities &amp; case managers
        </h1>
        <p className="mt-4 text-muted">Content in progress.</p>
        {/* Stage-5.1 seed (placeholder — Stage 6 writes the full copy): */}
        <p className="mt-4 max-w-prose text-muted">
          For members who need heavy-assist support, book bariatric &amp; two-person assist — two
          or more trained attendants when a member’s needs require it, layered on any of the
          three service levels.
        </p>
      </Container>
    </Section>
  );
}
