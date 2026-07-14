import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { FOOTER_COLUMNS } from "@/lib/nav";
import { SERVICE_AREA_LINE } from "@/lib/launch";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AmbientMap } from "@/components/home/AmbientMap";
import { BackToTop } from "@/components/chrome/BackToTop";
import { TerminusReveal } from "@/components/chrome/TerminusReveal";

// THE TERMINUS FOOTER (Stage 6.3; PREMIUM in 6.8). The homepage is one trip down a route line; the
// footer is the END OF THE LINE. It is an INSET FLOATING INK CARD — a solid --ink card, generously
// rounded, inset from the page edges with real margin at every width (the light page shows around
// it), the ambient map clipped to its rounded bounds. Server component; the client leaves are the
// Back-to-top button + TerminusReveal (the play-once arrival choreography). Solid ink; on-ink ramp
// throughout; exactly one <footer> (contentinfo) landmark. The TERMINUS MOTIF (a dashed accent route
// that arrives and stops at a terminal station node by the wordmark) makes the "end of the line"
// literal. Premium step (6.8): the wordmark is the hero of the card; the arrival settles play-once.

// Mission line — a trim of the (approved) hero subline; no new claims, no service-area verb.
const MISSION =
  "Every driver credential-verified before dispatch. Every claim checked — automatically — before it’s billed.";

// Column links adopt the NAV item grammar (6.8): an underline that slides in on hover/focus (the
// `.footer-link` ::after), plus the resting→on-ink colour lift. Every hover has a focus twin.
const footerLink =
  "footer-link inline-block rounded-sm py-1 text-base text-on-ink-muted transition-colors hover:text-on-ink " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

// Back to top — a lift + arrow-nudge on hover/focus (nav grammar); `group` drives the arrow.
const utilityLink =
  "footer-utility group inline-flex items-center gap-1.5 rounded-sm text-[15px] font-medium text-on-ink-muted " +
  "transition-[color,transform] hover:text-on-ink hover:-translate-y-0.5 focus-visible:-translate-y-0.5 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

// Sign in — accent-on-ink with the same underline-slide grammar as the column links.
const signInLink =
  "footer-link inline-flex items-center rounded-sm text-[15px] font-medium text-accent-on-ink transition-colors " +
  "hover:text-accent-on-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

// The terminus: a short dashed accent route enters and STOPS at a terminal station node (ring +
// filled dot) capped by a buffer-stop bar — the "end of the line", in the ambient map's trip
// language (accent-on-ink, dash 5/4.5). Decorative; fixed dims → zero CLS. In 6.8 its three parts
// (line / node / buffer) are grouped so the arrival choreography can draw + settle + land them.
function TerminusMotif() {
  return (
    <svg
      data-route-end
      viewBox="0 0 104 24"
      className="terminus-motif mb-5 h-6 w-[104px] text-accent-on-ink"
      fill="none"
      aria-hidden="true"
    >
      {/* dashed route arriving — draws in from the left */}
      <g className="terminus-line">
        <line x1="0" y1="12" x2="72" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4.5" strokeLinecap="round" />
      </g>
      {/* terminal station node: ring + filled dot — fills with a scale-settle */}
      <g className="terminus-node">
        <circle cx="82" cy="12" r="6.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="82" cy="12" r="2.6" fill="currentColor" stroke="none" />
      </g>
      {/* buffer-stop bar — the line ends here; lands last */}
      <line className="terminus-buffer" x1="97" y1="4.5" x2="97" y2="19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  // ENDCAP (Stage 6.4 A2) — the page always ends on INK, no bottom gap. Side gutters keep the light
  // page visible left/right and run to the document bottom; the card is FLUSH to the bottom (no pb)
  // with rounded TOP corners + square bottom. At 390 it goes full-bleed (rounded top only).
  return (
    <footer className="bg-bg pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">
      <div data-route-seam className="relative overflow-hidden rounded-t-[28px] bg-ink sm:rounded-t-[32px]">
        <AmbientMap tone="ink" region="wide" gutter={false} />
        <TerminusReveal />
        {/* The arriving full-page route lands on this card's TOP EDGE at the terminus motif; a modest
            top pad keeps the motif right at the edge, generous bottom keeps the destination substantial. */}
        <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-10">
          {/* a) BRAND ROW — the footer's one big type moment + mission + CTA pair */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <TerminusMotif />
              <p className="terminus-wordmark font-display text-5xl font-bold tracking-tight text-on-ink sm:text-6xl lg:text-7xl">
                {SITE.name}
              </p>
              <p className="terminus-mission mt-5 text-lg leading-relaxed text-on-ink-muted">{MISSION}</p>
            </div>
            <div className="terminus-cta flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Button href="/apply" variant="primaryOnInk" size="md" className="nav-apply">
                Apply as provider
                <ArrowRight aria-hidden="true" className="nav-apply-arrow h-4 w-4" />
              </Button>
              <Button href="/contact" variant="secondaryOnInk" size="md">
                Talk to us
              </Button>
            </div>
          </div>

          <div className="my-10 border-t border-on-ink-border-strong sm:my-12" />

          {/* b) LINK COLUMNS — 2-col wrap at 390, 4-col from md; one subtle group stagger on arrival */}
          <nav aria-label="Footer" className="terminus-cols grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="text-base font-semibold text-on-ink">{col.title}</h2>
                <ul className="mt-3 flex flex-col gap-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="my-12 border-t border-on-ink-border-strong" />

          {/* c) UTILITY + d) LEGAL — © + launch-flagged tagline · Back to top · Sign in */}
          <div className="flex flex-col gap-5 pt-1 text-[15px] text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {SITE.legalName} dba {SITE.name} · {SERVICE_AREA_LINE}
            </p>
            <div className="flex items-center gap-6">
              <BackToTop className={utilityLink} />
              <Link href={SITE.appUrl} className={signInLink}>
                Sign in
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
