"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { PORTAL_LIVE } from "@/lib/launch";
import {
  PLATFORM_ITEMS,
  SOLUTIONS_ITEMS,
  COMPANY_ITEMS,
  SIGNIN_ITEMS,
  type NavItem,
} from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";

// SINGLE-REGISTER + CHOREOGRAPHED nav (Stage 6.1). Owner decision: consistency over theming. The
// nav is ONE dark, jade-cast register in every state on every page — the light glass + the
// usePathname/theme-flip machinery are gone. The sticky bar is always `.nav-glass` (dark translucent
// liquid glass, calibrated so the on-ink ramp holds AA even over pure-white sections); the base hue
// sits a hair above --ink so it is near-seamless over the ink hero. Dropdown panels + the mobile
// overlay are a SOLID dark surface (bg-ink / bg-ink-surface), not translucent — a see-through panel
// over white both washes out and collapses the hover-fill contrast. The bar gains a border once
// scrolled (its only scroll-state change).
//
// Motion (nav = chrome, a higher ceiling than page content but still <=250ms, decelerate-eased,
// transform/opacity only, interruptible off Radix data-state, reduced-motion = instant):
//   - a "magic line" (Radix Indicator) slides between triggers on hover/focus;
//   - the caret rotates 180deg on open; the panel grows origin-aware from its trigger;
//   - panel items cascade in; each item has a fill sweep + icon-chip fill + arrow nudge;
//   - the Apply CTA gets a lift + arrow nudge; the mobile items cascade too.
// Every hover state has a focus twin (group-hover + group-focus-within / focus-visible).

// The ONE nav theme bundle — the dark/on-ink register, used in every state. Panel + overlay are
// solid dark (bg-ink), so the hover fill (--ink-hover) reads at ~1.9:1 against them.
const NT = {
  wordmark: "text-on-ink",
  // triggers are full on-ink WHITE at font-medium (Stage 6.4 older-reader pass); the magic line +
  // caret + panel carry the hover/open state, so the label needs no resting→hover colour shift.
  trigger: "text-on-ink",
  chevron: "text-on-ink-muted",
  ring: "focus-visible:ring-accent-on-ink focus-visible:ring-offset-ink",
  indicatorBar: "bg-accent-on-ink",
  // dropdown panel = SOLID ink-surface (never glass over white). ink-surface (not pure ink) so the
  // panel LIFTS a step off the ink hero (a pure-ink panel would match the hero exactly) yet still
  // pops dark over white; the on-ink-border-strong edge is 3.15:1 over the hero / 3.9:1 over white.
  panel: "bg-ink-surface border-on-ink-border-strong",
  // hover fill = --ink-hover (1.45:1 vs the ink-surface panel = a clearly lighter row); desc
  // (on-ink-muted) still clears AA on it.
  itemHover: "hover:bg-ink-hover focus-visible:bg-ink-hover",
  // resting chip = bg-ink (recessed a step BELOW the ink-surface panel, so it reads as a distinct
  // well); the ~10:1 accent-on-ink icon identifies it. Bright accent fill appears on hover/focus.
  chip: "border border-transparent bg-ink text-accent-on-ink group-hover:bg-accent-on-ink group-hover:text-ink group-focus-visible:bg-accent-on-ink group-focus-visible:text-ink",
  // title stays FULL on-ink (crisp); the visible fill + accent chip + arrow carry the hover state.
  itemTitle: "text-on-ink",
  itemDesc: "text-on-ink-muted",
  arrow: "text-accent-on-ink",
  hamburger: "text-on-ink hover:bg-ink-surface",
} as const;
type NT = typeof NT;

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "rounded-sm font-display text-lg font-heading tracking-heading transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2",
        NT.wordmark,
        NT.ring
      )}
    >
      {SITE.name}
    </Link>
  );
}

// One desktop dropdown. Radix owns hover/focus open, arrow-key traversal, Escape, and
// aria-expanded/aria-controls. The panel is a solid dark surface with a card edge and grows
// origin-aware from its trigger (.nav-panel); items cascade in and choreograph on hover.
function DesktopMenu({
  label,
  items,
  panelClass,
  align = "left",
}: {
  label: string;
  items: NavItem[];
  panelClass: string;
  /** Which trigger edge the panel anchors to. Right-seated menus (Sign in) anchor RIGHT so a wide
   *  panel opens inward instead of off the viewport's right edge; the grow-origin follows (.nav-panel-right). */
  align?: "left" | "right";
}) {
  return (
    // The Item is intentionally NOT `position: relative` (Stage 16, Defect B — the frozen magic line).
    // Radix positions the shared Indicator from each trigger's `offsetLeft`; if the Item is the trigger's
    // offsetParent, offsetLeft is 0 for EVERY trigger and the line freezes under the first one. Keeping
    // the Item static makes the shared Root the offsetParent (the same one the Indicator measures
    // against), so offsetLeft is correct. The dropdown panel gets its OWN `relative` wrapper below — a
    // sibling of the trigger, never an ancestor — so it still anchors under its trigger without
    // reintroducing the offsetParent bug. Verified by I17 across chromium/webkit/firefox.
    <NavigationMenu.Item>
      <NavigationMenu.Trigger
        className={cn(
          "group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2",
          NT.trigger,
          NT.ring
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 transition-[transform,color] duration-200 group-data-[state=open]:rotate-180",
            NT.chevron
          )}
        />
      </NavigationMenu.Trigger>
      {/* Relative wrapper for the absolute panel (Stage 16): restores per-trigger anchoring now that the
          Item is static. It is a SIBLING of the trigger, so it does not become the trigger's offsetParent. */}
      <div className="relative">
      <NavigationMenu.Content
        className={cn(
          "nav-panel absolute top-full z-50 mt-1.5 rounded-xl border p-2 shadow-md",
          align === "right" ? "nav-panel-right right-0" : "left-0",
          NT.panel,
          panelClass
        )}
      >
        <ul className="grid gap-1">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.href} className="nav-cascade" style={{ ["--i" as string]: i }}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-start gap-3 rounded-lg p-3 outline-none transition-colors focus-visible:ring-2",
                      NT.itemHover,
                      NT.ring
                    )}
                  >
                    {Icon ? (
                      <span
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                          NT.chip
                        )}
                      >
                        <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                      </span>
                    ) : null}
                    <span className="flex min-w-0 flex-col">
                      <span className={cn("flex items-center gap-1 text-[15px] font-semibold transition-colors", NT.itemTitle)}>
                        {item.label}
                        <ArrowRight
                          aria-hidden="true"
                          className={cn("nav-arrow h-3.5 w-3.5 shrink-0", NT.arrow)}
                        />
                      </span>
                      {item.description ? (
                        <span className={cn("mt-0.5 text-sm leading-snug", NT.itemDesc)}>
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </NavigationMenu.Link>
              </li>
            );
          })}
        </ul>
      </NavigationMenu.Content>
      </div>
    </NavigationMenu.Item>
  );
}

// Mobile accordion group (on the solid dark overlay). Native <button> with aria-expanded/
// aria-controls; the panel toggles flex/hidden so collapsed links leave the tab order + a11y tree;
// items cascade; chevron rotates.
function MobileAccordion({
  label,
  items,
  onNavigate,
  index,
}: {
  label: string;
  items: NavItem[];
  onNavigate: () => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="nav-cascade border-b border-on-ink-border" style={{ ["--i" as string]: index }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-md py-4 text-left text-base font-semibold text-on-ink outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-on-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("h-5 w-5 text-on-ink-muted transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <ul id={panelId} className={cn("flex-col gap-0.5 pb-3", open ? "flex" : "hidden")}>
        {items.map((item, i) => (
          <li key={item.href} className="nav-cascade" style={{ ["--i" as string]: i }}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-lg px-3 py-2.5 text-sm text-on-ink-muted transition-colors hover:bg-ink-hover hover:text-on-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Single register: the bar is always the dark nav-glass (on-ink ramp everywhere), so no
  // usePathname / theme branching. `scrolled` only toggles the bottom border. First render is
  // `scrolled=false`, matching the server output.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile overlay if the viewport grows to lg (prevents a stranded inert page).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mobile overlay effect (runs only while open): lock scroll, inert the rest of the page,
  // Escape to close, hand-rolled Tab focus trap, focus returned to the hamburger on close.
  useEffect(() => {
    if (!mobileOpen) return;
    const hamburger = hamburgerRef.current;
    const overlay = overlayRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inerted: Element[] = [];
    if (overlay?.parentElement) {
      for (const child of Array.from(overlay.parentElement.children)) {
        if (child !== overlay) {
          child.setAttribute("inert", "");
          child.setAttribute("aria-hidden", "true");
          inerted.push(child);
        }
      }
    }
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab" || !overlay) return;
      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      ).filter((el) => el.getClientRects().length > 0);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      for (const el of inerted) {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
      hamburger?.focus();
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={cn(
          // always the dark nav-glass; the border is the only scroll-state change.
          "nav-glass sticky top-0 z-40 transition-colors duration-200",
          scrolled ? "border-b border-on-ink-border" : "border-b border-transparent"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Wordmark />

            {/* The ONE nav landmark (Stage-1 rule: the nav landmark appears exactly once). Platform /
                Solutions / Company live here with the shared magic line. */}
            <NavigationMenu.Root
              aria-label="Primary"
              delayDuration={100}
              skipDelayDuration={300}
              className="relative hidden lg:flex"
            >
              <NavigationMenu.List className="flex items-center gap-1">
                <DesktopMenu label="Platform" items={PLATFORM_ITEMS} panelClass="w-[26rem]" />
                <DesktopMenu label="Solutions" items={SOLUTIONS_ITEMS} panelClass="w-[26rem]" />
                <DesktopMenu label="Company" items={COMPANY_ITEMS} panelClass="w-56" />
                {/* Magic line — slides between triggers following the open/focused item. */}
                <NavigationMenu.Indicator className="nav-indicator">
                  <div className={cn("nav-indicator-bar", NT.indicatorBar)} />
                </NavigationMenu.Indicator>
              </NavigationMenu.List>
            </NavigationMenu.Root>

            <div className="hidden items-center gap-2 lg:flex">
              {/* Sign in — a peer menu in the nav grammar (Stage 15): Radix trigger + caret + magic line
                  + solid-ink panel + item cascade, same weight/register as the left menus, seated in the
                  right cluster before Apply. It gets its OWN NavigationMenu.Root so its indicator tracks
                  its own trigger — but that Root renders `asChild` as a <div>, NOT a second <nav>, so the
                  site keeps exactly ONE nav landmark (the "Primary" root above; Stage-1 rule). Lists the
                  three customer portal doors; admin is deliberately excluded (law §7.4). Panel anchors
                  RIGHT so it opens inward. */}
              {PORTAL_LIVE ? (
                <NavigationMenu.Root asChild delayDuration={100} skipDelayDuration={300}>
                  <div className="relative">
                    <NavigationMenu.List className="flex items-center">
                      <DesktopMenu
                        label="Sign in"
                        items={SIGNIN_ITEMS}
                        panelClass="w-[26rem]"
                        align="right"
                      />
                      <NavigationMenu.Indicator className="nav-indicator">
                        <div className={cn("nav-indicator-bar", NT.indicatorBar)} />
                      </NavigationMenu.Indicator>
                    </NavigationMenu.List>
                  </div>
                </NavigationMenu.Root>
              ) : null}
              {/* Apply — lift + arrow nudge; the single bright accent pop on the dark bar. */}
              <Button
                href="/apply"
                variant="primaryOnInk"
                size="sm"
                className="nav-apply"
              >
                Apply as provider
                <ArrowRight aria-hidden="true" className="nav-apply-arrow h-4 w-4" />
              </Button>
            </div>

            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 lg:hidden",
                NT.hamburger,
                NT.ring
              )}
            >
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </Container>
      </header>

      {mobileOpen ? (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="animate-overlay-in fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-on-ink-border px-6">
            <Wordmark onClick={closeMobile} />
            <button
              ref={closeRef}
              type="button"
              onClick={closeMobile}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-on-ink transition-colors hover:bg-ink-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <X aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <MobileAccordion label="Platform" items={PLATFORM_ITEMS} onNavigate={closeMobile} index={0} />
            <MobileAccordion label="Solutions" items={SOLUTIONS_ITEMS} onNavigate={closeMobile} index={1} />
            <MobileAccordion label="Company" items={COMPANY_ITEMS} onNavigate={closeMobile} index={2} />
            {/* Sign in — a fourth accordion group in the same grammar (Stage 15), holding the three portal
                doors. The pinned row below keeps ONLY the primary CTA so "Sign in" appears exactly once
                (no duplicate affordance). */}
            {PORTAL_LIVE ? (
              <MobileAccordion label="Sign in" items={SIGNIN_ITEMS} onNavigate={closeMobile} index={3} />
            ) : null}
          </div>

          <div
            className="nav-cascade flex shrink-0 flex-col gap-3 border-t border-on-ink-border p-6"
            style={{ ["--i" as string]: 4 }}
          >
            <Button href="/apply" variant="primaryOnInk" size="md" className="w-full" onClick={closeMobile}>
              Apply as provider
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
