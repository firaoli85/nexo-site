import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{ts,tsx}",
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

        // Marketing color (Stage 2.5R) — ink (dark sections) + soft jade tint.
        ink:                    "var(--ink)",
        "ink-surface":          "var(--ink-surface)",
        "on-ink":               "var(--on-ink)",
        "on-ink-muted":         "var(--on-ink-muted)",
        "on-ink-border":        "var(--on-ink-border)",
        "on-ink-border-strong": "var(--on-ink-border-strong)",
        "accent-on-ink":        "var(--accent-on-ink)",
        "accent-on-ink-hover":  "var(--accent-on-ink-hover)",
        "ink-hover":            "var(--ink-hover)",   // nav item hover fill on ink (Stage 6)
        "surface-tint":         "var(--surface-tint)",
        "surface-tint-border":  "var(--surface-tint-border)",

        // On-ink status + service-level graphical variants (Stage 4.5).
        "danger-on-ink":        "var(--danger-on-ink)",
        "svc-amb-on-ink":       "var(--svc-amb-on-ink)",
        "svc-wheel-on-ink":     "var(--svc-wheel-on-ink)",
        "svc-str-on-ink":       "var(--svc-str-on-ink)",

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
      },

      // border-default → var(--border)  (separate from text-default = var(--text))
      // border (no suffix) also defaults to var(--border) via DEFAULT
      // border-strong → var(--border-strong)
      borderColor: {
        DEFAULT: "var(--border)",
        default: "var(--border)",
        strong:  "var(--border-strong)",
        control: "var(--border-control)",   // >=3:1 edge for boundary-dependent controls (WCAG 1.4.11)
      },

      // Typography — distinctive pairing loaded via next/font (see app/layout.tsx).
      // font-sans (default body) → Hanken Grotesk; font-display → Bricolage Grotesque.
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
  plugins: [],
};

export default config;
