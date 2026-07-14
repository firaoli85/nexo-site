import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Design token colors ───────────────────────────────────────────────
      // Each key becomes a Tailwind utility via bg-{key}, text-{key}, etc.
      //
      // Surface utilities:  bg-bg  bg-surface  bg-surface-hover  bg-surface-alt  bg-input-bg
      // Accent utilities:   bg-accent  bg-accent-hover  text-accent-text
      // Text utilities:     text-default  text-muted  text-subtle  text-disabled
      // Border utility:     border-border  (also border-default via borderColor below)
      // Semantic:           bg-danger  bg-warning  bg-success  (text-danger etc.)
      colors: {
        // Legacy aliases — keep so existing bg-background / text-foreground still resolves
        background:       "var(--background)",
        foreground:       "var(--foreground)",

        // Surfaces
        bg:               "var(--bg)",
        surface:          "var(--surface)",
        "surface-hover":  "var(--surface-hover)",
        "surface-alt":    "var(--surface-alt)",
        "surface-glass":  "var(--surface-glass)",  // translucent sticky nav
        "input-bg":       "var(--input-bg)",

        // Borders
        border:           "var(--border)",         // border-border
        "border-strong":  "var(--border-strong)",  // border-border-strong

        // Text scale (also work as bg / border via bg-default etc.)
        default:          "var(--text)",
        muted:            "var(--text-muted)",
        subtle:           "var(--text-subtle)",
        disabled:         "var(--text-disabled)",

        // Accent
        accent:           "var(--accent)",
        "accent-hover":   "var(--accent-hover)",
        "accent-text":    "var(--accent-text)",
        "accent-subtle":  "var(--accent-subtle)",  // bg-accent-subtle, border-accent-subtle

        // Semantic (+ tinted -subtle bg and darker -hover variants)
        danger:            "var(--danger)",
        "danger-hover":    "var(--danger-hover)",
        "danger-subtle":   "var(--danger-subtle)",
        warning:           "var(--warning)",
        "warning-hover":   "var(--warning-hover)",
        "warning-subtle":  "var(--warning-subtle)",
        success:           "var(--success)",
        "success-hover":   "var(--success-hover)",
        "success-subtle":  "var(--success-subtle)",
        info:              "var(--info)",
        "info-hover":      "var(--info-hover)",
        "info-subtle":     "var(--info-subtle)",

        // Service level (trip_type) — dedicated, outside the status hues.
        "svc-amb":          "var(--svc-amb)",
        "svc-amb-subtle":   "var(--svc-amb-subtle)",
        "svc-wheel":        "var(--svc-wheel)",
        "svc-wheel-subtle": "var(--svc-wheel-subtle)",
        "svc-str":          "var(--svc-str)",
        "svc-str-subtle":   "var(--svc-str-subtle)",

        // ── shadcn/ui compatibility layer ─────────────────────────────────────
        // Maps shadcn's conventional token names onto the existing design tokens
        // above, so components pulled from the shadcn registry / MCP render in
        // this palette without edits. NOTE: `accent` and `muted` intentionally
        // keep their existing meanings (jade accent / muted text) — a pulled
        // component using bg-accent or bg-muted in shadcn's sense may need a
        // one-line swap to bg-surface-hover / bg-surface-alt.
        primary:                  "var(--accent)",
        "primary-foreground":     "var(--accent-text)",
        secondary:                "var(--surface-hover)",
        "secondary-foreground":   "var(--text)",
        destructive:              "var(--danger)",
        "destructive-foreground": "var(--accent-text)",
        "muted-foreground":       "var(--text-muted)",
        "accent-foreground":      "var(--text)",
        input:                    "var(--border)",
        ring:                     "var(--accent)",
        card:                     "var(--surface)",
        "card-foreground":        "var(--text)",
        popover:                  "var(--surface)",
        "popover-foreground":     "var(--text)",
      },

      // border-default → var(--border)  (separate from text-default = var(--text))
      // border (no suffix) also defaults to var(--border) via DEFAULT
      // border-strong → var(--border-strong)
      borderColor: {
        DEFAULT: "var(--border)",
        default: "var(--border)",
        strong:  "var(--border-strong)",
      },

      // Typography — distinctive pairing loaded via next/font (see app/layout.tsx).
      // font-sans (default body) → Manrope; font-display → Bricolage Grotesque.
      fontFamily: {
        sans:    ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },

      // Soft elevation tokens (values in globals.css :root)
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
