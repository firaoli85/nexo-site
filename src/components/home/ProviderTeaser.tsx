import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";

// Section C — provider partnership teaser. Reuses the station/stop grammar (numbered steps)
// but QUIETER so it never competes with the route spine: no scroll-drawn line, no figure,
// smaller numerals, static connectors. Framing leads with TRANSPARENCY + CLEAN CLAIMS (all
// LIVE-true) — never payment speed, never trip volume (copy gate).
const STEPS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Apply", body: "A short form. No committed capacity required." },
  {
    n: "02",
    title: "Credentialing",
    body: "Clear requirements up front, tracked in the platform, with approval before any assignment.",
  },
  {
    n: "03",
    title: "Run trips",
    body: "Every claim’s status visible end to end, scrubbed before submission.",
  },
];

export function ProviderTeaser() {
  return (
    <Section className="relative overflow-hidden bg-surface-tint">
      <AmbientMap tone="light" region="dc" />
      <Container className="relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-surface-tint-border bg-surface px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent">
            For transport providers
          </span>
          <h2 className="mt-4 font-display text-3xl font-heading tracking-heading text-default sm:text-4xl">
            Run trips with us.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Transparent credentialing and clean claims: you always know where every trip and
            every claim stands.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-heading tabular-nums tracking-heading text-accent">
                  {s.n}
                </span>
                {i < STEPS.length - 1 ? (
                  <span className="hidden h-px flex-1 bg-surface-tint-border lg:block" aria-hidden="true" />
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-default">{s.title}</h3>
              <p className="mt-1 max-w-sm text-base leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button href="/apply" variant="primary" size="md">
            Apply as provider
          </Button>
        </div>
      </Container>
    </Section>
  );
}
