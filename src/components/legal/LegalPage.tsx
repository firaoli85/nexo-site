import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";

// Shared prose layout for the legal / policy pages (Stage 10S): a calm reading column in the site's
// certified type, grid-whisper atmosphere ONLY (no region glyphs, no vignettes), sequential heading
// levels (h1 → h2). Sections auto-number for reference. No dates are invented here — a page supplies
// an `effectiveNote` only when the owner has set a real date.

const eyebrowPill =
  "inline-flex items-center rounded-full border border-surface-tint-border bg-surface px-3 py-1 font-mono text-xs font-medium tracking-mono text-accent";

// Shared inline-link style for legal body copy. PERSISTENT underline (not hover-only) so an inline link
// is distinguishable from body text without relying on color (WCAG 1.4.1); visible focus ring on the
// white content surface.
export const legalLink =
  "rounded-sm font-medium text-accent underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export type LegalSection = { heading: string; body: ReactNode };

export function LegalPage({
  eyebrow,
  title,
  lead,
  effectiveNote,
  banner,
  sections,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  /** Only rendered when a page passes a REAL, owner-set date — never invented. */
  effectiveNote?: string;
  /** Optional prominent notice (e.g. the required HIPAA banner), shown before the sections. */
  banner?: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      {/* HERO — tint; grid whisper only. */}
      <section className="relative overflow-hidden bg-surface-tint">
        <AmbientMap tone="light" region="wide" gutter={false} />
        <Container className="relative py-14 sm:py-16 lg:py-20">
          <div className="max-w-prose">
            <span className={eyebrowPill}>{eyebrow}</span>
            <h1 className="mt-4 font-display text-4xl font-hero leading-[1.1] tracking-hero text-default sm:text-5xl">
              {title}
            </h1>
            {lead ? <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p> : null}
            {effectiveNote ? <p className="mt-3 text-sm text-subtle">{effectiveNote}</p> : null}
          </div>
        </Container>
      </section>

      {/* CONTENT — white; grid whisper only. */}
      <Section className="relative overflow-hidden border-t border-border-strong bg-bg">
        <AmbientMap tone="light" region="wide" gutter={false} />
        <Container className="relative">
          <div className="max-w-prose">
            {banner ? <div className="mb-10">{banner}</div> : null}
            <div className="space-y-10">
              {sections.map((s, i) => (
                <section key={s.heading}>
                  <h2 className="font-display text-xl font-heading tracking-heading text-default">
                    <span className="text-subtle">{i + 1}.</span> {s.heading}
                  </h2>
                  <div className="mt-3 space-y-4 text-lg leading-relaxed text-muted">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
