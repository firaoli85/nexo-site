"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/utils/cn";

// THE SECTION SUB-NAV (Stage 8) — a QUIET sticky bar under the main nav for the four /platform
// anchors. Hairline, smaller type, never competing with the primary nav. Scrollspy: ONE
// IntersectionObserver marks the section nearest the top as active (aria-current="true"); a real
// <a href="#id"> keeps it keyboard-operable + no-JS-navigable, with a smooth scroll gated by
// prefers-reduced-motion. At 390 the chips scroll horizontally (no wrap, no overflow). Every section
// carries scroll-margin-top for BOTH sticky bars so a heading always lands fully in view.
const LINKS = [
  { id: "dispatch", label: "Dispatch" },
  { id: "claims-billing", label: "Claims & billing" },
  { id: "compliance", label: "Compliance" },
  { id: "oversight", label: "Oversight" },
];

export function PlatformSubnav() {
  const [active, setActive] = useState(LINKS[0].id);
  // Lets onClick (a chip activation) abort the deep-link re-scroll below — a chip click/tap is not a
  // wheel/touch/keydown, so without this it would fight a chip clicked during the settle window.
  const cancelInitialScroll = useRef<() => void>(() => {});

  // Deep-link landing (nav dropdown → /platform#id): the browser's native hash jump fires BEFORE fonts
  // + the ProductDemo hydration settle, so the page grows underneath it and the section lands early
  // (and one re-scroll gets overridden). Re-apply the scroll on a short interval (~1s, capped) while
  // the page settles — but STOP the moment the user takes over (wheel/touch/keydown OR a chip click),
  // so it never fights a real scroll.
  useEffect(() => {
    const id = decodeURIComponent((window.location.hash || "").slice(1));
    if (!id || !LINKS.some((l) => l.id === id)) return;
    setActive(id);
    let n = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (iv) {
        clearInterval(iv);
        iv = undefined;
      }
    };
    cancelInitialScroll.current = stop; // expose the abort to onClick
    iv = setInterval(() => {
      if (++n > 10) {
        stop();
        return;
      }
      const el = document.getElementById(id);
      // "instant" so the correction re-pins immediately — a bare "auto" would inherit a global
      // scroll-behavior:smooth and animate each re-pin, fighting the settle.
      if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }, 100);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      cancelInitialScroll.current = () => {};
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (s): s is HTMLElement => !!s
    );
    if (sections.length < 2) return;
    // Active = the LAST section whose top has passed the trigger line just below both sticky bars — i.e.
    // the section currently sitting under the bars. This is computed from LIVE positions (not from
    // which entries an IntersectionObserver batched), so it is deterministic: a cold deep-link and a
    // client-nav that settle at the SAME scroll position always resolve to the SAME chip. (An IO that
    // picked "topmost intersecting a band" lit the PREVIOUS section, whose tail still clipped the band's
    // top edge by a few px — that was the client-nav wrong-chip bug.) TRIGGER matches the sections'
    // scroll-mt-[124px] landing, so the deep-linked section is active the instant it lands.
    const TRIGGER = 130;
    let raf = 0;
    const compute = () => {
      raf = 0;
      let current = sections[0].id;
      for (const s of sections) if (s.getBoundingClientRect().top <= TRIGGER) current = s.id;
      // At the very bottom of the page the last section's top may never reach the trigger (a tall
      // viewport bottoms out first), so pin the last section once we're scrolled to the end.
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    // Don't run the initial compute when a deep-link hash is present: effect-1 already set the correct
    // chip, and a mount-time compute (scroll still at 0, before the hash jump settles) would briefly
    // clobber it back to the first section. Scroll events then keep it accurate.
    const initialHash = decodeURIComponent((window.location.hash || "").slice(1));
    if (!LINKS.some((l) => l.id === initialHash)) compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return; // no target → let the native href handle it
    cancelInitialScroll.current(); // a chip click is "the user took over" → stop any deep-link re-scroll
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <nav
      aria-label="Platform sections"
      className="sticky top-16 z-30 border-b border-border-strong bg-surface"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LINKS.map((l) => {
          const isActive = active === l.id;
          return (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => onClick(e, l.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative shrink-0 whitespace-nowrap rounded-sm px-3 py-3 text-sm font-medium outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                isActive ? "text-accent" : "text-muted hover:text-default"
              )}
            >
              {l.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
