import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AmbientMap } from "@/components/home/AmbientMap";

// Branded 404 (Stage 12). Renders inside the root layout, so the nav + terminus footer wrap it
// automatically (the page still ends on ink). Certified grammar: eyebrow → display headline → one honest
// line → two ways out (home + contact). Grid-whisper only. Next returns a real 404 status for this route,
// so no crawl-blocking robots directive is needed or added (the old design-lab rule is gone).
export const metadata: Metadata = {
  title: { absolute: "Page not found | Nexo Access" },
  description: "The page you’re looking for isn’t here.",
};

const eyebrowPill =
  "inline-flex items-center rounded-full border border-surface-tint-border bg-surface px-3 py-1 text-xs font-medium tracking-wide text-accent";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-surface-tint">
      <AmbientMap tone="light" region="wide" gutter={false} />
      <Container className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-xl text-center">
          <span className={eyebrowPill}>404</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-default sm:text-5xl">
            This page took a wrong turn.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            The page you’re looking for isn’t here. It may have moved, or the link was mistyped. Let’s
            get you back on route.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/" variant="primary" size="md">
              Back to home
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
