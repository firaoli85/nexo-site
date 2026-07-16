"use client";

import { useEffect, useRef, useState, type AnimationEvent } from "react";
import {
  Accessibility,
  Check,
  CircleCheck,
  Clock,
  ListChecks,
  Lock,
  MapPin,
  Pause,
  Play,
  User,
} from "lucide-react";
import { cn } from "@/utils/cn";

// The site's signature animated component: a self-playing, four-scene walkthrough of
// the operations software, staged as an INK CONSOLE (Stage 4.5). All predetermined
// motion is CSS (globals.css .demo-*); React owns the active index + pause booleans.
// Ink doctrine: flat (no glow/gradient/bloom); glass ONLY on cards floating over the
// ink base; on-ink-border is a decorative hairline (never the sole state carrier) so
// focus rings + status use accent-on-ink / danger-on-ink. svc chips keep their light
// -subtle fills — self-contained surfaces that pop on ink. Copy: permitted claims only.

const SCENE_MS = 4500;

// On-ink focus ring — accent-on-ink (10:1) carries it; the offset is ink, not the
// decorative on-ink-border. Used by every interactive control in the console.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const SUMMARY =
  "A four-step walkthrough of the Nexo Access operations software. " +
  "Step one, schedule: composing a wheelchair trip for the sample member J. Sample. " +
  "Step two, assign: assigning it only to a driver whose credentials are current, since drivers with expired credentials are blocked from assignment. " +
  "Step three, complete: advancing the trip through validated status changes to a final, tamper-evident completed record. " +
  "Step four, bill: running the resulting claim through four automated scrubbing checks and seven adjudication checks before it is billed to the plan that covered the member.";

function ScheduleScene() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-on-ink-muted">New trip</span>
        <span className="text-[13px] tabular-nums text-on-ink-muted">NX-1042</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-on-ink-border px-2 py-0.5 text-[13px] font-medium text-on-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-on-ink-muted" aria-hidden="true" />
          Pending assignment
        </span>
      </div>

      <div className="mt-2.5 rounded-xl border border-on-ink-border-strong ink-glass p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-on-ink-border bg-ink-surface">
            <User className="h-4 w-4 text-on-ink-muted" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-on-ink">J. Sample</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-svc-wheel-subtle px-2 py-1 text-[13px] font-medium text-svc-wheel">
            <Accessibility className="h-3 w-3" aria-hidden="true" />
            Wheelchair
          </span>
        </div>
        <div className="mt-3 space-y-2 text-[13px] text-on-ink-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full border border-on-ink-border bg-ink-surface" aria-hidden="true" />
            <span>Home, Silver Spring, MD</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-on-ink" aria-hidden="true" />
            <span className="text-on-ink">Riverside Dialysis Center</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-on-ink-muted" aria-hidden="true" />
            <span className="tabular-nums">9:30 AM</span>
          </div>
        </div>
        <div
          className="demo-pop mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-on-ink"
          style={{ animationDelay: "320ms" }}
        >
          <CircleCheck className="h-4 w-4" aria-hidden="true" />
          Scheduled
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg border border-on-ink-border-strong ink-glass px-3 py-2 text-[13px] text-on-ink-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-on-ink-muted" aria-hidden="true" />
        <span className="font-medium text-on-ink-muted">R. Doe</span>
        <span className="inline-flex items-center rounded bg-svc-amb-subtle px-1.5 py-0.5 text-[13px] font-medium text-svc-amb">
          Ambulatory
        </span>
        <span className="tabular-nums">11:15 AM · Queued</span>
      </div>
    </div>
  );
}

function AssignScene() {
  return (
    <div>
      <span className="text-[13px] font-medium text-on-ink-muted">Assign driver</span>
      <div className="mt-3 space-y-2">
        <div className="relative flex items-center gap-2 rounded-xl border border-on-ink-border-strong ink-glass p-3">
          <span
            className="demo-in pointer-events-none absolute inset-0 rounded-xl ring-2 ring-accent-on-ink"
            style={{ animationDelay: "300ms" }}
            aria-hidden="true"
          />
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-surface">
            <Check className="h-4 w-4 text-accent-on-ink" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-on-ink">M. Rivera</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-on-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-on-ink" aria-hidden="true" />
            Ready · all credentials current
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-on-ink-border-strong ink-glass p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-on-ink-border bg-ink-surface">
            <Lock className="h-3.5 w-3.5 text-danger-on-ink" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-on-ink-muted">D. Okafor</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium text-danger-on-ink">
            Blocked · license expired
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-on-ink-border-strong ink-glass px-3 py-2 text-[13px] text-on-ink-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-on-ink" aria-hidden="true" />
          <span>A. Bello · Ready · credentials current</span>
        </div>
      </div>
      <p className="mt-3 text-[13px] text-on-ink-muted">
        Assignment refused unless credentials are current.
      </p>
    </div>
  );
}

const STATUS = ["Scheduled", "Assigned", "In progress", "Completed"];

function CompleteScene() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-on-ink-muted">Trip status</span>
        <span className="text-[13px] tabular-nums text-on-ink-muted">NX-1042</span>
      </div>
      <div className="mt-5 flex">
        {STATUS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                className={cn("h-px flex-1", i === 0 ? "bg-transparent" : "bg-on-ink-border")}
                aria-hidden="true"
              />
              <span
                className="demo-pop flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-on-ink text-ink"
                style={{ animationDelay: `${150 + i * 130}ms` }}
              >
                {i === STATUS.length - 1 ? (
                  <Lock className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "h-px flex-1",
                  i === STATUS.length - 1 ? "bg-transparent" : "bg-on-ink-border"
                )}
                aria-hidden="true"
              />
            </div>
            <span className="mt-1.5 text-center text-[13px] font-medium leading-tight text-on-ink-muted sm:text-[13px]">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-on-ink-border-strong ink-glass px-3 py-2 text-[13px] text-on-ink-muted">
        <User className="h-3.5 w-3.5 shrink-0 text-on-ink-muted" aria-hidden="true" />
        <span>J. Sample · Wheelchair · Riverside Dialysis Center</span>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-on-ink-border-strong ink-glass px-3 py-2 text-[13px] text-on-ink-muted">
        <Lock className="h-3.5 w-3.5 shrink-0 text-on-ink-muted" aria-hidden="true" />
        <span className="tabular-nums">Completed 10:12 AM · record locked</span>
      </div>
      <p className="mt-3 text-[13px] text-on-ink-muted">
        Every status change validated. Completed is final.
      </p>
    </div>
  );
}

const SCRUB_CHECKS = [
  "Signature on file",
  "Driver match",
  "Vehicle match",
  "Mileage source",
];

function BillScene() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-on-ink-muted">Claim review</span>
        <span className="text-[13px] tabular-nums text-on-ink-muted">CLM-3390</span>
        <span className="ml-auto text-[13px] tabular-nums text-on-ink-muted">Trip NX-1042</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {SCRUB_CHECKS.map((label, i) => (
          <div
            key={label}
            className="demo-in flex items-center gap-1.5 rounded-lg border border-on-ink-border-strong ink-glass px-2.5 py-1.5 text-[13px] text-on-ink-muted"
            style={{ animationDelay: `${150 + i * 70}ms` }}
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-accent-on-ink" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
      <div
        className="demo-in mt-3 flex items-center gap-2 rounded-lg border border-on-ink-border-strong ink-glass px-3 py-2 text-[13px] font-medium text-accent-on-ink"
        style={{ animationDelay: "470ms" }}
      >
        <ListChecks className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">7/7</span> adjudication checks passed
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[13px] text-on-ink-muted">Checked before it’s billed.</p>
        <span
          className="demo-pop inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-on-ink px-2.5 py-1 text-[13px] font-semibold text-ink"
          style={{ animationDelay: "600ms" }}
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Auto-approved
        </span>
      </div>
      <p className="mt-2.5 text-[13px] text-on-ink-muted">
        Billed to the plan that covered the member on the trip date.
      </p>
    </div>
  );
}

const SCENES = [
  { key: "schedule", label: "Schedule", Body: ScheduleScene },
  { key: "assign", label: "Assign", Body: AssignScene },
  { key: "complete", label: "Complete", Body: CompleteScene },
  { key: "bill", label: "Bill", Body: BillScene },
];

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const [runId, setRunId] = useState(0); // re-keys the fill so it restarts at scaleX(0)
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Timer hygiene (Stage 6.8): pause the walkthrough when it scrolls out of view (mirror
  // ServiceMorph's IO gate) so no CSS animation keeps advancing offscreen; `hidden` covers the
  // backgrounded tab; both freeze the fill via animation-play-state (no drift, clean resume).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const canAnimate = mounted && !reducedMotion;
  const paused = userPaused || hoverPaused || focusPaused || hidden || !inView;

  const goTo = (i: number) => {
    setActive(i);
    setRunId((r) => r + 1);
  };

  const handleAnimationEnd = (e: AnimationEvent<HTMLSpanElement>) => {
    if (e.animationName !== "demoTabProgress") return;
    setActive((a) => (a + 1) % SCENES.length);
    setRunId((r) => r + 1);
  };

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-2xl border border-on-ink-border-strong bg-ink shadow-sm"
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
      <p className="sr-only">{SUMMARY}</p>

      {/* Ink-glass titlebar strip (solid ink-surface fallback), full-bleed hairline. */}
      <div className="ink-glass flex items-center border-b border-on-ink-border px-4 py-2.5">
        <span className="text-[13px] font-medium text-on-ink-muted">Nexo Access · Dispatch</span>
        <span className="ml-auto text-[13px] text-on-ink-muted">Sample data</span>
      </div>

      <div className="grid p-3 sm:p-4" aria-hidden="true">
        {SCENES.map(({ key, Body }, i) => (
          <div key={key} className="demo-scene" data-active={i === active}>
            <Body />
          </div>
        ))}
      </div>

      {/* Control bar — on-ink tabs, accent-on-ink progress fill, pause anchored right. */}
      <div className="flex items-center gap-1 border-t border-on-ink-border px-3 py-2 sm:px-4">
        {SCENES.map(({ key, label }, i) => {
          const isActive = i === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => goTo(i)}
              aria-pressed={isActive}
              aria-label={`Step ${i + 1} of ${SCENES.length}: ${label}`}
              className={cn(
                "relative shrink-0 rounded-md px-2 py-2 text-[13px] font-medium outline-none transition-colors",
                isActive ? "text-on-ink" : "text-on-ink-muted hover:text-on-ink",
                focusRing
              )}
            >
              <span>{label}</span>
              <span
                className="absolute inset-x-1.5 bottom-0 h-[3px] overflow-hidden rounded-full bg-on-ink-border"
                aria-hidden="true"
              >
                {isActive && canAnimate ? (
                  <span
                    key={runId}
                    className="demo-tab-fill block h-full w-full rounded-full bg-accent-on-ink"
                    style={{
                      animationDuration: `${SCENE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={handleAnimationEnd}
                  />
                ) : isActive && reducedMotion ? (
                  <span className="block h-full w-full rounded-full bg-accent-on-ink" />
                ) : null}
              </span>
            </button>
          );
        })}

        <div className="ml-auto h-8 w-8 shrink-0">
          {canAnimate ? (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Play walkthrough" : "Pause walkthrough"}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-on-ink-muted outline-none transition-colors hover:text-on-ink",
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
      </div>
    </div>
  );
}
