"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// THE PROOF SPOTLIGHT (Stage 6.5) — a thin CLIENT wrapper around a SERVER-rendered proof <ul> (the
// icons stay in the server children, so nothing crosses the RSC boundary as props). READABILITY IS
// FIRST: the resting markup is fully legible on its own; this only adds LIFE. While the list is in
// view (IO-gated), its `[data-proof-item]`s take turns `.is-active` (~3s each) — CSS fills the icon
// chip with accent + a ≤2px settle (transform/colour only → zero CLS). It PAUSES when the pointer or
// focus is inside the list, and hovering/focusing an item makes IT active immediately. Under
// reduced-motion it does NOTHING — every item stays at full resting readability. Timers/observers/
// listeners are all cleaned up (react-patterns: cleanup every subscription); one class-toggle per
// ~3s, never per frame (react-performance: no per-frame work, offscreen timers stop).
export function ProofSpotlight({
  surface,
  className,
  children,
}: {
  surface: "light" | "ink";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ul = ref.current;
    if (!ul) return;
    const items = Array.from(ul.querySelectorAll<HTMLElement>("[data-proof-item]"));
    if (items.length < 2) return;

    let i = 0;
    let inView = false;
    let paused = false; // pointer/focus inside the list (also set while directly on an item)
    let hidden = document.hidden; // backgrounded tab (Stage 6.8 timer hygiene)
    let timer: ReturnType<typeof setTimeout> | undefined;

    const setActive = (idx: number) =>
      items.forEach((el, k) => el.classList.toggle("is-active", k === idx));

    const tick = () => {
      if (timer) clearTimeout(timer);
      if (!inView || paused || hidden) return;
      setActive(i % items.length);
      i += 1;
      timer = setTimeout(tick, 3000);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) tick();
        else if (timer) clearTimeout(timer);
      },
      { threshold: 0.35 }
    );
    io.observe(ul);

    // pause the cycle while the pointer OR focus is inside the list — tracked independently so a
    // mouse-leave never resumes while an item is still keyboard-focused (and vice-versa).
    let pointerInside = false;
    let focusInside = false;
    const sync = () => {
      const now = pointerInside || focusInside;
      if (now === paused) return;
      paused = now;
      if (paused) {
        if (timer) clearTimeout(timer);
      } else {
        tick();
      }
    };
    const onPointerEnter = () => {
      pointerInside = true;
      sync();
    };
    const onPointerLeave = () => {
      pointerInside = false;
      sync();
    };
    const onFocusIn = () => {
      focusInside = true;
      sync();
    };
    const onFocusOut = (e: FocusEvent) => {
      // stay paused while focus merely moves between items inside the list
      if (e.relatedTarget instanceof Node && ul.contains(e.relatedTarget)) return;
      focusInside = false;
      sync();
    };
    ul.addEventListener("pointerenter", onPointerEnter);
    ul.addEventListener("pointerleave", onPointerLeave);
    ul.addEventListener("focusin", onFocusIn);
    ul.addEventListener("focusout", onFocusOut);

    // backgrounded tab: clear the timer (no toggles while hidden), resume on return
    const onVis = () => {
      hidden = document.hidden;
      if (hidden) {
        if (timer) clearTimeout(timer);
      } else {
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // hovering / focusing an item makes IT the active one immediately
    const perItem: Array<() => void> = [];
    items.forEach((el, idx) => {
      const activate = () => {
        setActive(idx);
      };
      el.addEventListener("pointerenter", activate);
      el.addEventListener("focusin", activate);
      perItem.push(() => {
        el.removeEventListener("pointerenter", activate);
        el.removeEventListener("focusin", activate);
      });
    });

    return () => {
      if (timer) clearTimeout(timer);
      io.disconnect();
      ul.removeEventListener("pointerenter", onPointerEnter);
      ul.removeEventListener("pointerleave", onPointerLeave);
      ul.removeEventListener("focusin", onFocusIn);
      ul.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVis);
      perItem.forEach((off) => off());
    };
  }, []);

  return (
    <ul ref={ref} data-proof-surface={surface} className={cn("proof-list", className)}>
      {children}
    </ul>
  );
}
