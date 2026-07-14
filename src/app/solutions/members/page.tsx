// ⚠️ TEMPORARY STUB — Stage 1 route skeleton. Real content lands in a later stage.
// Exists so chrome links never 404. No design intent here.
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function MembersPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display text-4xl font-bold tracking-tight text-default">
          Members
        </h1>
        <p className="mt-4 text-muted">Content in progress.</p>
        {/* Stage-5.1 seed (placeholder — Stage 6 writes the full copy): */}
        <p className="mt-4 max-w-prose text-muted">
          Need extra help getting in and out? Ask about bariatric &amp; two-person assist — two
          or more trained attendants when a member’s needs require it, on any of the three
          service levels.
        </p>
      </Container>
    </Section>
  );
}
