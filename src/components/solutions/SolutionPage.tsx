import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AmbientMap } from "@/components/home/AmbientMap";
import { cn } from "@/utils/cn";

// THE AUDIENCE-PAGE PATTERN (Stage 7) — ONE reusable arrangement of EXISTING pieces (Section /
// Container / AmbientMap / Button / the stop-grammar proof line + the light MockCard vignette). Each
// /solutions/* page is DATA + one <SolutionPage/> + its own metadata; nothing here is a new design.
// Interior pages stay in the WHITE/TINT rhythm — NO new ink (the terminus footer is the page's only
// ink chapter). The page's ONE region crop bookends it via AmbientMap on the hero + CTA; the proof
// sections stay calm (like the homepage audience triage). Server-rendered — no client, no cycle.

export type Region = "wide" | "dc" | "md" | "va";
export type Proof = { icon: LucideIcon; text: string };
export type SolutionSection = {
  kicker?: string;
  claim: string;
  body?: string;
  proofs: Proof[];
  /** The ONE product-mock vignette per page lives on exactly one section (makes it two-column). */
  mock?: ReactNode;
};
export type SolutionCta = {
  heading: string;
  body?: string;
  label: string;
  href: string;
};

const eyebrowPill =
  "inline-flex items-center gap-1.5 rounded-full border border-surface-tint-border bg-surface px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent";

// The light MockCard atom (Stage-2 demo grammar) — the per-page vignettes re-dress this. Always
// hints "Sample data" so a reader never mistakes a mock for a real record (copy gate).
export function MockCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{title}</span>
        <span className="text-[13px] text-subtle">Sample data</span>
      </div>
      {children}
    </div>
  );
}

// The established proof-line grammar (icon chip + full-strength text) — shared by the audience pages
// and the /platform deep sections.
export function ProofList({ proofs }: { proofs: Proof[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {proofs.map(({ icon: Icon, text }) => (
        <li key={text} className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-base font-medium leading-relaxed text-default lg:text-[17px]">{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function SolutionPage({
  region,
  eyebrow,
  eyebrowIcon: Eyebrow,
  h1,
  subline,
  sections,
  cta,
}: {
  region: Region;
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  h1: string;
  subline: string;
  sections: SolutionSection[];
  cta: SolutionCta;
}) {
  return (
    <>
      {/* HERO — a tint opening (soft, not the ink hero); the page's one region crop. */}
      <section className="relative overflow-hidden bg-surface-tint">
        <AmbientMap tone="light" region={region} />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className={eyebrowPill}>
              <Eyebrow className="h-3.5 w-3.5" aria-hidden="true" />
              {eyebrow}
            </span>
            <h1 className="mt-4 font-display text-4xl font-hero leading-[1.08] tracking-hero text-default sm:text-5xl lg:text-6xl">
              {h1}
            </h1>
            <p className="mt-5 max-w-prose text-xl leading-relaxed tracking-lede text-muted">{subline}</p>
          </div>
        </Container>
      </section>

      {/* PROOF SECTIONS — the stop grammar (icon proof lines); alternate white/tint; the ONE mock
          section is two-column, the rest a single readable column. */}
      {sections.map((s, i) => {
        const tint = i % 2 === 1; // proof 0 = white, 1 = tint, ...
        const flip = i % 2 === 1; // alternate which side the mock sits on
        return (
          <Section
            key={s.claim}
            className={cn("relative overflow-hidden border-t border-border-strong", tint ? "bg-surface-tint" : "bg-bg")}
          >
            {/* Grid whisper only (gutter={false}): subtle texture that ties the middle sections to the
                homepage rhythm WITHOUT repeating the region's landmark glyphs down the page (that would
                break the no-adjacent-repeat rule) — the glyphs stay on the hero + CTA bookends. */}
            <AmbientMap tone="light" region={region} gutter={false} />
            <Container className="relative">
              <div className={cn("grid items-center gap-10", s.mock ? "lg:grid-cols-2 lg:gap-12" : "lg:grid-cols-1")}>
                <div className={cn("max-w-xl", s.mock && flip && "lg:order-2")}>
                  {s.kicker ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">{s.kicker}</span>
                  ) : null}
                  <h2
                    className={cn(
                      "font-display text-2xl font-heading tracking-heading text-default sm:text-3xl",
                      s.kicker && "mt-2"
                    )}
                  >
                    {s.claim}
                  </h2>
                  {s.body ? <p className="mt-3 text-lg leading-relaxed text-muted">{s.body}</p> : null}
                  <ProofList proofs={s.proofs} />
                </div>
                {s.mock ? <div className={cn(flip && "lg:order-1")}>{s.mock}</div> : null}
              </div>
            </Container>
          </Section>
        );
      })}

      {/* CLOSING CTA — the last light moment before the ink footer; exactly ONE primary action (B5).
          Alternates cleanly off the last proof section; the region crop closes the page. */}
      <section
        className={cn(
          "relative overflow-hidden border-t border-border-strong",
          sections.length % 2 === 1 ? "bg-surface-tint" : "bg-bg"
        )}
      >
        <AmbientMap tone="light" region={region} />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-heading leading-[1.1] tracking-heading text-default sm:text-4xl">
              {cta.heading}
            </h2>
            {cta.body ? (
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">{cta.body}</p>
            ) : null}
            {/* The CTA button renders only when a label is provided; a page may gate it off (e.g. the
                members portal sign-in before app.nexoaccess.com is live) by passing an empty label. The
                solution-page CTA is always SAME-TAB when present (law §7.4). */}
            {cta.label ? (
              <div className="mt-8">
                <Button href={cta.href} variant="primary" size="md">
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
