import { pageMeta, ROUTE_META } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";
import { ApplyForm } from "@/components/leads/ApplyForm";

export const metadata = pageMeta(ROUTE_META.apply);

const eyebrowPill =
  "inline-flex items-center rounded-full border border-surface-tint-border bg-surface px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent";

// What happens next — process, not promises. No time/SLA, no volume, no earnings (nexo-brand §7 + §7.2).
const STEPS = [
  {
    title: "We review your details",
    body: "We read what you send and check the basics for the service levels you run.",
  },
  {
    title: "We talk it through",
    body: "We reach out to walk through credentialing and how trips and claims work on the platform.",
  },
  {
    title: "We set you up",
    body: "Once you’re credentialed, you’re ready to run trips on one shared system.",
  },
];

export default function ApplyPage() {
  return (
    <>
      {/* HERO — tint; MD composite bookend. */}
      <section className="relative overflow-hidden bg-surface-tint">
        <AmbientMap tone="light" region="md" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className={eyebrowPill}>For transport providers</span>
            <h1 className="mt-4 font-display text-4xl font-hero leading-[1.08] tracking-hero text-default sm:text-5xl lg:text-6xl">
              Run trips with us.
            </h1>
            <p className="mt-5 max-w-prose text-xl leading-relaxed tracking-lede text-muted">
              Work from one honest system, with clear credentialing and claims checked before they’re
              billed. Tell us about your operation and we’ll take it from there.
            </p>
          </div>
        </Container>
      </section>

      {/* THE FORM — white; grid whisper only. */}
      <Section className="relative overflow-hidden border-t border-border-strong bg-bg">
        <AmbientMap tone="light" region="md" gutter={false} />
        <Container className="relative">
          <div className="max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <ApplyForm />
          </div>
        </Container>
      </Section>

      {/* WHAT HAPPENS NEXT — tint bookend; MD composite. */}
      <Section className="relative overflow-hidden border-t border-border-strong bg-surface-tint">
        <AmbientMap tone="light" region="md" />
        <Container className="relative">
          <h2 className="max-w-2xl font-display text-2xl font-heading tracking-heading text-default sm:text-3xl">
            What happens next
          </h2>
          <ol className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-10">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle font-display text-lg font-heading text-accent">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-default">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
