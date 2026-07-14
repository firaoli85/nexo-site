"use client";

import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Accessibility, Ambulance, PersonStanding, Pause, Play } from "lucide-react";
import { cn } from "@/utils/cn";

// Stage-4 signature, ink-staged in 4.5: the service-level morph. The hand-built figure
// SVG is passed in as `children` (server-rendered → out of the client bundle). This
// client wrapper owns the level state, an IntersectionObserver-gated cycle, and three
// ink-glass cards that double as controls. The cycle is PROGRESS-BAR-DRIVEN (same
// mechanics family as the hero tabs: a CSS scaleX fill whose animationend advances the
// level) so the active card's fill bar is inherently synced and pauses consistently.
// The figure is decorative; meaning lives on the cards + one sr-only sentence. Ink
// doctrine: cards are ink-glass, accents are svc-*-on-ink, focus rings accent-on-ink.

const DWELL = 4000;

const SR_SENTENCE =
  "Three service levels: ambulatory, wheelchair, and stretcher — each trip scheduled to the member’s mobility needs.";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const LEVELS: {
  key: string;
  label: string;
  line: string;
  Icon: LucideIcon;
  iconColor: string;
  activeBorder: string;
  barColor: string;
}[] = [
  {
    key: "amb",
    label: "Ambulatory",
    line: "Walks with minimal help",
    Icon: PersonStanding,
    iconColor: "text-svc-amb-on-ink",
    activeBorder: "border-svc-amb-on-ink",
    barColor: "bg-svc-amb-on-ink",
  },
  {
    key: "wheel",
    label: "Wheelchair",
    line: "Seated, wheelchair-secured",
    Icon: Accessibility,
    iconColor: "text-svc-wheel-on-ink",
    activeBorder: "border-svc-wheel-on-ink",
    barColor: "bg-svc-wheel-on-ink",
  },
  {
    key: "str",
    label: "Stretcher",
    line: "Transported lying down",
    Icon: Ambulance,
    iconColor: "text-svc-str-on-ink",
    activeBorder: "border-svc-str-on-ink",
    barColor: "bg-svc-str-on-ink",
  },
];

export function ServiceMorph({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(0);
  const [runId, setRunId] = useState(0); // re-keys the fill so it restarts at scaleX(0)
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Timer hygiene (Stage 6.8): a backgrounded tab freezes the cycle too (an IO does NOT report a
  // hidden tab as non-intersecting, so `inView` alone would leave it running).
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const canAnimate = mounted && !reduced;
  // Paused (fill frozen, no advance) when explicitly paused, offscreen, hovered, keyboard-focused, or
  // in a backgrounded tab. Explicit `userPaused` wins over hover-resume (it is just OR-ed in).
  const paused = userPaused || !inView || hoverPaused || focusPaused || hidden;

  const goTo = (i: number) => {
    setLevel(i);
    setRunId((r) => r + 1);
  };

  // The active card's fill completing advances the cycle — offscreen/pause freezes the
  // fill (animation-play-state), so there is no background timer and no drift.
  const handleFillEnd = (e: AnimationEvent<HTMLSpanElement>) => {
    if (e.animationName !== "demoTabProgress") return;
    setLevel((l) => (l + 1) % LEVELS.length);
    setRunId((r) => r + 1);
  };

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setHoverPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setHoverPaused(false);
      }}
      onFocus={(e) => {
        const t = e.target as HTMLElement;
        let keyboard = true;
        try {
          keyboard = t.matches(":focus-visible");
        } catch {
          keyboard = false;
        }
        if (keyboard) setFocusPaused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusPaused(false);
        }
      }}
    >
      <p className="sr-only">{SR_SENTENCE}</p>

      {/* Fixed-size stage (enlarged one step in 4.5) — aspect-ratio locked → zero CLS. The pause
          control (Stage 6.8, WCAG 2.2.2) sits in the stage's top-right corner: an ink-glass chip,
          real <button>, aria-pressed + state label, site focus ring; absolute so it adds zero CLS
          and the 3-card grid stays intact. Only when motion is allowed (reduced-motion → no cycle,
          no control). */}
      <div className="relative mx-auto w-full max-w-[340px]">
        <div className="svc-stage aspect-[4/3] w-full" data-level={LEVELS[level].key}>
          {children}
        </div>
        {canAnimate ? (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Play service level cycle" : "Pause service level cycle"}
            className={cn(
              "ink-glass absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-on-ink-border-strong text-on-ink-muted outline-none transition-colors hover:text-on-ink",
              focusRing
            )}
          >
            {userPaused ? (
              <Play className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Pause className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {LEVELS.map((lvl, i) => {
          const isActive = i === level;
          const Icon = lvl.Icon;
          return (
            <button
              key={lvl.key}
              type="button"
              onClick={(e) => {
                goTo(i);
                if (e.detail > 0) e.currentTarget.blur();
              }}
              aria-pressed={isActive}
              className={cn(
                "ink-glass relative overflow-hidden rounded-xl border p-3 text-center outline-none transition-colors",
                isActive ? lvl.activeBorder : "border-on-ink-border-strong hover:border-on-ink-muted",
                focusRing
              )}
            >
              <Icon className={cn("mx-auto h-5 w-5", lvl.iconColor)} aria-hidden="true" />
              <span className="mt-1.5 block text-[13px] font-semibold text-on-ink">
                {lvl.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-on-ink-muted">
                {lvl.line}
              </span>
              {/* Active-card progress fill — svc-on-ink scaleX over the ~4s dwell; a
                  non-color cue (fill length) beside the border + aria-pressed. */}
              <span
                className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-on-ink-border"
                aria-hidden="true"
              >
                {isActive && canAnimate ? (
                  <span
                    key={runId}
                    className={cn("demo-tab-fill block h-full w-full", lvl.barColor)}
                    style={{
                      animationDuration: `${DWELL}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={handleFillEnd}
                  />
                ) : isActive && reduced ? (
                  <span className={cn("block h-full w-full", lvl.barColor)} />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
