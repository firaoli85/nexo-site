import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// Chrome button primitive. Renders a real <button> by default, or a Next.js
// <Link> when `href` is set. Token classes only — no hardcoded colors.
// Hover is a restrained color shift (globals.css supplies the 150ms ease);
// every instance carries a visible focus-visible ring for keyboard users.

// Light variants + on-ink variants (Stage 4.8, for the ink hero + theme-aware nav).
type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "primaryOnInk"
  | "secondaryOnInk"
  | "ghostOnInk";
type Size = "sm" | "md";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
  /** When provided, the button renders as a Next.js <Link> to this href. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

// Ring COLOR + offset-color live on each variant (not base) so light and on-ink variants
// don't both set --tw-ring-color and collide in source order.
const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap " +
  "select-none motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const LIGHT_RING = "focus-visible:ring-accent focus-visible:ring-offset-bg";
const INK_RING = "focus-visible:ring-accent-on-ink focus-visible:ring-offset-ink";

const variantClasses: Record<Variant, string> = {
  primary: `bg-accent text-accent-text hover:bg-accent-hover ${LIGHT_RING}`,
  // border-control gives the white secondary button a >=3:1 visible edge on its real fields (WCAG 1.4.11)
  secondary: `border border-control bg-surface text-default hover:bg-surface-hover ${LIGHT_RING}`,
  ghost: `text-muted hover:bg-surface-hover hover:text-default ${LIGHT_RING}`,
  // On-ink (Stage 4.8): primary = accent-on-ink fill + ink text (the one bright pop);
  // secondary = ghost with the on-ink-border-strong edge; ghost = quiet on-ink-muted.
  primaryOnInk: `bg-accent-on-ink text-ink hover:bg-accent-on-ink-hover ${INK_RING}`,
  secondaryOnInk: `border border-on-ink-border-strong text-on-ink hover:bg-ink-surface ${INK_RING}`,
  ghostOnInk: `text-on-ink-muted hover:bg-ink-surface hover:text-on-ink ${INK_RING}`,
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  onClick,
  type = "button",
  disabled,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
