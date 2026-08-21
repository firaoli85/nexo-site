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

// NOIR CHROME (Task #33, D31). The nav is ONE dark register in every state on every page.
//
// THE BAR is liquid glass at the 0.75 D23 lineage floor with a 16px blur (`.nav-glass`), and the
// `@supports` fallback is the same bar at full opacity — a DESIGNED PEER, not a degradation. Over the
// ink hero the two states are indistinguishable by construction (0.75-over-ink composites to the
// solid value); they only diverge where the backdrop does, which is the point: the braid passing
// beneath transmits through the bar. D31 rules that transmission LEGAL — the mint is seen through the
// chrome, not applied to it.
//
// THE MINT RESTRAINT LAW (D31) governs everything else here: on the noir register mint appears in
// EXACTLY TWO places, the active route and the primary CTA. In this file that means the Apply button
// and nothing else. The magic line, the panel icons, the item arrows and the focus rings were all
// `accent-on-ink` before this task and are now the neutral on-ink ramp. Focus rings did not lose
// contrast in the trade — white measures 16:1 on ink and 7.11:1 over the worst-case glass, against
// mint's 10:1 — so restraint cost nothing an auditor would miss.
//
// THE PANELS are boxed destinations (D27b, the Railway pattern): a darker well holding cells at the
// raised-surface fill. Separation is FILL-AGAINST-FILL rather than borders — panel `bg-ink`, cells
// `bg-ink-surface`, which is D23's B06 card tier (1.25:1) doing exactly the job it was derived for.
//
// Motion is chrome-tier (<=250ms, decelerate `--ease-nav`, transform/opacity only, reduced-motion =
// instant) and, since Task #33, RETARGETABLE: the panel open/close is a transition plus
// `@starting-style`, never a keyframe, so an interrupted open reverses from where it is instead of
// replaying from zero. Every hover state has a focus twin.

// The ONE nav theme bundle — the dark/on-ink register, used in every state.
const NT = {
  wordmark: "text-on-ink",
  trigger: "text-on-ink",
  // The chevron is the ONLY muted thing inside the glass bar, and it is deliberately an ICON: over a
  // white page the 0.75 bar composites to #49514e where on-ink-muted is 4.25:1 — under the 4.5 TEXT
  // floor but comfortably over 1.4.11's 3:1 graphic tier. No muted TEXT may sit in this bar.
  chevron: "text-on-ink-muted",
  // Neutral focus ring (D31 mint restraint). Higher contrast than the mint it replaced.
  ring: "focus-visible:ring-on-ink focus-visible:ring-offset-ink",
  // Neutral magic line. It still slides, it just no longer spends the accent to do it.
  indicatorBar: "bg-on-ink",
  // The panel is the WELL: darker than the cells it holds, with a card-tier edge so it reads over a
  // light page as well as over the ink hero.
  panel: "bg-ink border-on-ink-border-strong",
  // Cells sit at the raised-surface fill and lift to --ink-hover. No borders: the fills do the work.
  cell: "bg-ink-surface hover:bg-ink-hover focus-visible:bg-ink-hover",
  cellIcon: "text-on-ink-muted group-hover:text-on-ink group-focus-visible:text-on-ink",
  itemTitle: "text-on-ink",
  itemDesc: "text-on-ink-muted",
  arrow: "text-on-ink-muted group-hover:text-on-ink group-focus-visible:text-on-ink",
  hamburger: "text-on-ink hover:bg-ink-surface",
} as const;

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[44px] items-center rounded-sm font-display text-lg font-heading tracking-heading motion-safe:transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2",
        NT.wordmark,
        NT.ring
      )}
    >
      {SITE.name}
    </Link>
  );
}

/** One boxed destination — a "room" in the panel rather than a row in a list. */
function DestinationCell({ item, featured }: { item: NavItem; featured?: boolean }) {
  const Icon = item.icon;
  return (
    <NavigationMenu.Link asChild>
      <Link
        href={item.href}
        className={cn(
          "nav-cell group flex h-full rounded-lg p-4 outline-none focus-visible:ring-2",
          featured ? "flex-row items-start gap-3.5" : "flex-col gap-2",
          NT.cell,
          NT.ring
        )}
      >
        {Icon ? (
          <Icon
            aria-hidden="true"
            className={cn(featured ? "mt-0.5 h-6 w-6 shrink-0" : "h-5 w-5", NT.cellIcon)}
          />
        ) : null}
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "flex items-center gap-1.5 font-semibold",
              featured ? "text-base" : "text-[15px]",
              NT.itemTitle
            )}
          >
            {item.label}
            <ArrowRight aria-hidden="true" className={cn("nav-arrow h-3.5 w-3.5 shrink-0", NT.arrow)} />
          </span>
          {item.description ? (
            <span className={cn("mt-1 text-sm leading-snug", NT.itemDesc)}>{item.description}</span>
          ) : null}
        </span>
      </Link>
    </NavigationMenu.Link>
  );
}

// One desktop dropdown. Radix owns hover/focus open, arrow-key traversal, Escape, and
// aria-expanded/aria-controls.
function DesktopMenu({
  label,
  items,
  panelClass,
  gridClass,
  /** Index of the cell that spans the full row. `-1` = an even grid, which is the honest answer
   *  whenever the destinations are peers and featuring one would misrepresent them. */
  featuredIndex = -1,
  align = "left",
}: {
  label: string;
  items: NavItem[];
  panelClass: string;
  gridClass: string;
  featuredIndex?: number;
  align?: "left" | "right";
}) {
  return (
    // The Item is intentionally NOT `position: relative` (Stage 16, Defect B — the frozen magic line).
    // Radix positions the shared Indicator from each trigger's `offsetLeft`; if the Item is the trigger's
    // offsetParent, offsetLeft is 0 for EVERY trigger and the line freezes under the first one. Keeping
    // the Item static makes the shared Root the offsetParent (the same one the Indicator measures
    // against). The panel gets its OWN `relative` wrapper below — a sibling of the trigger, never an
    // ancestor. Verified by I17 across chromium/webkit/firefox.
    <NavigationMenu.Item>
      <NavigationMenu.Trigger
        className={cn(
          // min-h-[44px] answers the sub-44px question the benches raised: these are the real triggers,
          // and they now clear the 44px target on the shipped nav.
          "group inline-flex min-h-[44px] items-center gap-1 rounded-md px-3 py-2 text-sm font-medium outline-none motion-safe:transition-colors focus-visible:ring-2",
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
            "nav-panel absolute top-full z-50 mt-2 rounded-xl border p-2.5 shadow-md",
            align === "right" ? "nav-panel-right right-0" : "left-0",
            NT.panel,
            panelClass
          )}
        >
          <ul className={cn("grid gap-2.5", gridClass)}>
            {items.map((item, i) => (
              <li
                key={item.href}
                className={cn("nav-cascade", i === featuredIndex && "col-span-full")}
                style={{ ["--i" as string]: i }}
              >
                <DestinationCell item={item} featured={i === featuredIndex} />
              </li>
            ))}
          </ul>
        </NavigationMenu.Content>
      </div>
    </NavigationMenu.Item>
  );
}

// Mobile accordion group (on the solid dark overlay). Native <button> with aria-expanded/
// aria-controls; the panel toggles flex/hidden so collapsed links leave the tab order + a11y tree.
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
        className="flex min-h-[44px] w-full items-center justify-between rounded-md py-4 text-left text-base font-semibold text-on-ink outline-none motion-safe:transition-colors focus-visible:ring-2 focus-visible:ring-on-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("h-5 w-5 text-on-ink-muted motion-safe:transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <ul id={panelId} className={cn("flex-col gap-1 pb-3", open ? "flex" : "hidden")}>
        {items.map((item, i) => (
          <li key={item.href} className="nav-cascade" style={{ ["--i" as string]: i }}>
            <Link
              href={item.href}
              onClick={onNavigate}
              // py-3 + min-h: the sub-44px question answered on mobile too. These were 40px.
              className="flex min-h-[44px] items-center rounded-lg bg-ink-surface px-3 py-3 text-sm text-on-ink-muted motion-safe:transition-colors hover:bg-ink-hover hover:text-on-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
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

  // Single register: the bar is always the dark nav-glass, so no usePathname / theme branching.
  // `scrolled` only toggles the bottom border. First render is `scrolled=false`, matching the server.
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
          "nav-glass sticky top-0 z-40 motion-safe:transition-colors duration-200",
          // I21 — the painted nav edge, PRESERVED IN MECHANISM AND NEUTRALISED IN COLOUR (D31: the
          // mint underline is retired; the boundary is glass + structure + a neutral hairline). The
          // card-tier border reads over the ink chapters; `nav-seam` adds the dark hairline that
          // supplies the missing polarity over LIGHT content, where the edge would otherwise sit
          // monotonically between a dark bar and a bright page and be read as antialiasing.
          scrolled ? "border-b border-on-ink-border-strong nav-seam" : "border-b border-transparent"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Wordmark />

            {/* The ONE nav landmark (Stage-1 rule). Platform / Solutions / Company with the shared
                magic line. Panel shapes differ ON PURPOSE and the difference is editorial, not
                decorative — see the grid/featured props below. */}
            <NavigationMenu.Root
              aria-label="Primary"
              delayDuration={100}
              skipDelayDuration={300}
              className="relative hidden lg:flex"
            >
              <NavigationMenu.List className="flex items-center gap-1">
                {/* Platform: Dispatch is featured because it is the spine the other three hang off —
                    claims, compliance and oversight are all downstream of a trip being dispatched. */}
                <DesktopMenu
                  label="Platform"
                  items={PLATFORM_ITEMS}
                  panelClass="w-[36rem]"
                  gridClass="grid-cols-3"
                  featuredIndex={0}
                />
                {/* Solutions: four PEER audiences. Featuring one would say the business favours it,
                    which is not true and is not ours to imply — so this grid is deliberately even. */}
                <DesktopMenu
                  label="Solutions"
                  items={SOLUTIONS_ITEMS}
                  panelClass="w-[34rem]"
                  gridClass="grid-cols-2"
                />
                <DesktopMenu
                  label="Company"
                  items={COMPANY_ITEMS}
                  panelClass="w-[22rem]"
                  gridClass="grid-cols-2"
                />
                <NavigationMenu.Indicator className="nav-indicator">
                  <div className={cn("nav-indicator-bar", NT.indicatorBar)} />
                </NavigationMenu.Indicator>
              </NavigationMenu.List>
            </NavigationMenu.Root>

            <div className="hidden items-center gap-2 lg:flex">
              {/* Sign in — a peer menu in the nav grammar (Stage 15). Its own Root so the indicator
                  tracks its own trigger, rendered `asChild` as a <div> so the site keeps exactly ONE
                  nav landmark. Three customer portal doors; admin excluded (law §7.4). */}
              {PORTAL_LIVE ? (
                <NavigationMenu.Root asChild delayDuration={100} skipDelayDuration={300}>
                  <div className="relative">
                    <NavigationMenu.List className="flex items-center">
                      <DesktopMenu
                        label="Sign in"
                        items={SIGNIN_ITEMS}
                        panelClass="w-[30rem]"
                        gridClass="grid-cols-1"
                        align="right"
                      />
                      <NavigationMenu.Indicator className="nav-indicator">
                        <div className={cn("nav-indicator-bar", NT.indicatorBar)} />
                      </NavigationMenu.Indicator>
                    </NavigationMenu.List>
                  </div>
                </NavigationMenu.Root>
              ) : null}
              {/* Apply — ONE of the two sanctioned mint surfaces on the noir register (D31). */}
              <Button href="/apply" variant="primaryOnInk" size="sm" className="nav-apply min-h-[44px]">
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
                "inline-flex h-11 w-11 items-center justify-center rounded-md motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 lg:hidden",
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
          className="motion-safe:animate-overlay-in fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-on-ink-border px-6">
            <Wordmark onClick={closeMobile} />
            <button
              ref={closeRef}
              type="button"
              onClick={closeMobile}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-on-ink motion-safe:transition-colors hover:bg-ink-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <X aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <MobileAccordion label="Platform" items={PLATFORM_ITEMS} onNavigate={closeMobile} index={0} />
            <MobileAccordion label="Solutions" items={SOLUTIONS_ITEMS} onNavigate={closeMobile} index={1} />
            <MobileAccordion label="Company" items={COMPANY_ITEMS} onNavigate={closeMobile} index={2} />
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
