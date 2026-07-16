"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AmbientMap } from "@/components/home/AmbientMap";
import { cn } from "@/utils/cn";

// Section A — the guardrail numbers. Four figures drawn ONLY from the permitted list
// (7 adjudication checks · 4 scrubbing checks · 13 frozen fields · RLS on every table). A
// staged reveal (not a count-up: single-digit integers barely animate and read gimmicky, and
// a reveal handles the non-numeric "RLS" item uniformly — review-animations). IO play-once,
// tabular-nums, opacity/transform only → zero CLS, reduced-motion = static (visible).
const STATS: { figure: string; num: boolean; label: string }[] = [
  { figure: "7", num: true, label: "adjudication checks on every claim" },
  { figure: "4", num: true, label: "scrubbing checks before submission" },
  { figure: "13", num: true, label: "fields frozen at submission" },
  { figure: "RLS", num: false, label: "Row-Level Security on every table" },
];

export function ProofBand() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-proof-live", ""); // arm the hidden initial state only when animating
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-proof-in", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section className="relative overflow-hidden border-t border-surface-tint-border bg-surface-tint">
      <AmbientMap tone="light" region="va" />
      <Container className="relative">
        <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.figure} className="proof-stat text-center">
              <div
                className={cn(
                  "font-display text-5xl font-bold leading-none tracking-tight text-accent sm:text-6xl",
                  s.num && "tabular-nums"
                )}
              >
                {s.figure}
              </div>
              <p className="mx-auto mt-3 max-w-[17ch] text-base leading-snug text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-base text-muted">
          Every number here is enforced by the platform’s code, not a policy binder.
        </p>
      </Container>
    </Section>
  );
}
