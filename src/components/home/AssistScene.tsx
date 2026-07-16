"use client";

import { useEffect, useRef } from "react";
import { Layers, Users } from "lucide-react";
import { ProofSpotlight } from "./ProofSpotlight";

// THE ASSIST SCENE (Stage 6; CONTACT 6.4) — a SECOND MOVEMENT inside the Stop-3 ink chapter (below
// the morph), for the bariatric & two-person assist offering. A MODIFIER on the 3 service levels —
// NEVER a 4th (the morph stays 3 states). Stop grammar flipped: figure stage left, copy right.
// Hand-built in the M-B heavy grammar. The assistance is explicit IN THE FIGURES: both attendants'
// hands are in visible CONTACT on the reinforced chair's armrests, postures engaged toward the
// member; a securement strap (svc-wheel tone) shows the chair is secured. NO floating symbols — the
// final contact IS the reassurance. Attendants on-ink-muted (distinct but EQUAL dignity), member
// on-ink and central. Silhouette test: "two people actively helping one person, with care."
// Motion: IO play-once SETTLE (attendants ease in from the sides, staggered, hands coming to rest on
// the chair) — no loop. Default render = the COMPLETE static composition (SSR / reduced-motion /
// no-JS); JS arms the settle only when motion is allowed.
const PROOFS: { icon: typeof Layers; text: string }[] = [
  { icon: Layers, text: "Available as an add-on to any service level." },
  { icon: Users, text: "Reinforced equipment and extra trained hands, matched to need." },
];

export function AssistScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-assist-live", "");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-assist-in", "");
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-14 border-t border-on-ink-border pt-14 sm:mt-16 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 lg:pl-20">
        {/* Copy — DOM-first (reading order), visually right on desktop. */}
        <div className="lg:order-2">
          <span className="ink-glass inline-flex items-center gap-1.5 rounded-full border border-on-ink-border px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent-on-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-on-ink" aria-hidden="true" />
            Assist &amp; bariatric
          </span>
          {/* h4: this scene is DOM-nested inside Stop 3 (whose claim is h3), so the sequential/
              outline-precise level is h4 — size comes from the classes, never from the tag. */}
          <h4 className="mt-4 font-display text-2xl font-bold tracking-tight text-on-ink sm:text-3xl">
            Bariatric &amp; two-person assist.
          </h4>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-on-ink-muted">
            Extra trained hands and reinforced equipment on any service level, with two or more
            attendants when a member’s needs require it.
          </p>
          <ProofSpotlight surface="ink" className="mt-6 space-y-3">
            {PROOFS.map(({ icon: Icon, text }) => (
              <li key={text} data-proof-item className="proof-item flex gap-3">
                <span className="proof-chip mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-ink-surface text-accent-on-ink">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="text-base font-medium leading-relaxed text-on-ink lg:text-[17px]">{text}</span>
              </li>
            ))}
          </ProofSpotlight>
        </div>

        {/* Figure scene — left on desktop. Fixed aspect stage → zero CLS. */}
        <div className="lg:order-1">
          <div ref={ref} className="assist-stage mx-auto aspect-[4/3] w-full max-w-[380px]">
            <svg viewBox="0 0 320 240" className="svc-figure-heavy h-full w-full" fill="none" aria-hidden="true">
              {/* ground */}
              <line className="svc-ground stroke-on-ink-border-strong" x1="34" y1="212" x2="286" y2="212" />

              {/* REINFORCED WHEELCHAIR (fig-wheel) — drawn FIRST so the member + the attendants'
                  hands paint over the contact points. Wide seat + backrest + side armrests (the grip
                  points) + a securement strap (the chair is secured). */}
              <g className="fig-wheel stroke-current">
                <circle cx="162" cy="172" r="30" />
                <line x1="162" y1="142" x2="162" y2="202" />
                <line x1="132" y1="172" x2="192" y2="172" />
                <line x1="141" y1="151" x2="183" y2="193" />
                <line x1="183" y1="151" x2="141" y2="193" />
                <circle cx="162" cy="172" r="6" className="fill-current" stroke="none" />
                {/* front caster */}
                <circle cx="126" cy="192" r="6" className="fill-current" stroke="none" />
                {/* wide reinforced seat + backrest + side armrests */}
                <line x1="130" y1="150" x2="192" y2="150" />
                <line x1="192" y1="150" x2="190" y2="118" />
                <line x1="130" y1="150" x2="126" y2="186" />
                <path d="M134 150 L134 144 L142 144" />
                <path d="M188 150 L188 144 L180 144" />
              </g>

              {/* MEMBER — seated, filled head + torso (on-ink), seated legs */}
              <g className="assist-member stroke-on-ink">
                <line x1="158" y1="150" x2="132" y2="152" />
                <line x1="132" y1="152" x2="130" y2="178" />
                <circle cx="162" cy="96" r="10" className="fill-on-ink" />
                <rect x="152" y="107" width="20" height="46" rx="10" />
              </g>

              {/* SECUREMENT — a lap belt across the seated member (svc-wheel tone), drawn OVER the
                  member and well ABOVE the seat pan so it reads as a distinct strap, not the seat edge.
                  Inline strokeWidth beats the .svc-figure-heavy `line` rule. */}
              <g className="fig-wheel">
                <line x1="148" y1="138" x2="176" y2="138" className="stroke-current" style={{ strokeWidth: 2.4 }} strokeLinecap="round" />
                <rect x="158" y="134" width="8" height="8" rx="1.5" className="fill-current" stroke="none" />
              </g>

              {/* LEFT ATTENDANT (on-ink-muted) — engaged posture, bent arm, HAND IN CONTACT on the
                  left armrest. The settle ends here: hand at rest on the chair = the reassurance. */}
              <g className="assist-att-l stroke-on-ink-muted">
                <circle cx="74" cy="90" r="9" className="fill-on-ink-muted" stroke="none" />
                <rect x="65" y="101" width="18" height="40" rx="9" />
                <line x1="74" y1="141" x2="66" y2="208" />
                <line x1="74" y1="141" x2="82" y2="208" />
                <line x1="66" y1="208" x2="58" y2="209" />
                <line x1="82" y1="208" x2="90" y2="209" />
                <path d="M82 116 L108 128 L135 145" fill="none" />
                <circle cx="137" cy="146" r="3.6" className="fill-on-ink-muted" stroke="none" />
              </g>

              {/* RIGHT ATTENDANT (on-ink-muted) — mirror, hand in contact on the right armrest */}
              <g className="assist-att-r stroke-on-ink-muted">
                <circle cx="250" cy="90" r="9" className="fill-on-ink-muted" stroke="none" />
                <rect x="241" y="101" width="18" height="40" rx="9" />
                <line x1="250" y1="141" x2="242" y2="208" />
                <line x1="250" y1="141" x2="258" y2="208" />
                <line x1="242" y1="208" x2="234" y2="209" />
                <line x1="258" y1="208" x2="266" y2="209" />
                <path d="M242 116 L216 128 L189 145" fill="none" />
                <circle cx="187" cy="146" r="3.6" className="fill-on-ink-muted" stroke="none" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
