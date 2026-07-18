# NEXO ACCESS — DESIGN TEARDOWN

*A precise capture of the look, feel, and machinery of the Nexo Access marketing site, produced so another repo can replicate it. Every claim is grounded in `file:line`. Read-only teardown — nothing in the site was modified.*

Scope: the marketing site (`src/`). The `_seed/` directory is the retired reference design and is **not** the subject of this report.

---

## Table of Contents

1. [Stack & Techniques](#1-stack--techniques)
2. [Design Tokens](#2-design-tokens)
   - 2.1 [Color palette (every hex)](#21-color-palette)
   - 2.2 [Typography](#22-typography)
   - 2.3 [Spacing, radii, shadows, borders](#23-spacing-radii-shadows-borders)
3. [Motion Language](#3-motion-language)
   - 3.1 [The two easing curves](#31-the-two-easing-curves)
   - 3.2 [The signature rail / track / van](#32-the-signature-rail--track--van)
   - 3.3 [The "default = complete static composition" doctrine](#33-the-default--complete-static-composition-doctrine)
   - 3.4 [Reveal, spotlight & autoplay patterns](#34-reveal-spotlight--autoplay-patterns)
   - 3.5 [Nav choreography](#35-nav-choreography)
   - 3.6 [Reduced-motion](#36-reduced-motion)
4. [Component Patterns](#4-component-patterns)
   - 4.1 [Layout primitives](#41-layout-primitives)
   - 4.2 [Buttons (all states)](#42-buttons)
   - 4.3 [Navigation](#43-navigation)
   - 4.4 [Hero](#44-hero)
   - 4.5 [Cards, bands & sections](#45-cards-bands--sections)
   - 4.6 [Forms](#46-forms)
   - 4.7 [Footer / terminus](#47-footer--terminus)
5. [Chrome & Assets](#5-chrome--assets)
6. [Why It Works](#6-why-it-works)
7. [Portability](#7-portability)

---

## 1. Stack & Techniques

| Concern | Choice | Evidence |
|---|---|---|
| Framework | **Next.js 14.2.35, App Router**, React 18 | `package.json:20-22` |
| Styling | **Tailwind CSS 3.4** utility-first, driven entirely by **CSS custom properties** | `package.json:33`, `tailwind.config.ts:20-88`, `src/app/globals.css:11-146` |
| Class composition | `clsx` + `tailwind-merge` via a `cn()` helper | `package.json:17,23`, `src/utils/cn.ts:4-6` |
| Nav primitive | `@radix-ui/react-navigation-menu` (magic-line indicator, dropdowns, a11y) | `package.json:16`, `src/components/chrome/Navbar.tsx:331-346` |
| Icons | `lucide-react` | `package.json:19` |
| Animation | **CSS-first** (`globals.css`) for all scroll/autoplay/hover motion; **framer-motion** used only for two generic mount reveals (`Reveal`, `PageTransition`) | `package.json:18`, `src/components/motion/Reveal.tsx:29-31`, `src/components/motion/PageTransition.tsx:29-30`, and the entire motion layer in `src/app/globals.css:194-673` |
| Fonts | `next/font/google` — **Bricolage Grotesque** (display) + **Hanken Grotesk** (body), `display: "optional"` | `src/app/layout.tsx:2, 23-34` |
| Email/forms backend | Next server actions → **AWS SES v2** (`@aws-sdk/client-sesv2`); static site, no DB | `package.json:15`, `src/lib/mail.ts`, `src/app/actions/leads.ts` |

**Unusual, feel-defining techniques:**

- **One-file theming.** All color flows from `:root` in `src/app/globals.css:11-146`; `tailwind.config.ts:20-88` maps each var to a utility. No hardcoded hex lives in any component — re-theming is a single-file edit (`globals.css:5-10`).
- **Ink-safe document root.** `html { background: var(--ink) }` (`globals.css:148-155`) paints the iOS overscroll / URL-bar-collapse region ink so no white ever flashes below the footer; `<body>` paints the light `--bg` over the viewport and uses `min-h-svh` (`layout.tsx:71`) to survive WebKit's dynamic toolbar.
- **Compositor-only animation.** Every animation touches only `transform`, `opacity`, `filter(blur)`, `stroke-dashoffset`, or `offset-distance` — never width/height/layout (survey across `globals.css:194-673`).
- **Scroll-driven "rail."** A single page-level SVG route is drawn 1:1 with scroll via one CSS var (`--route-progress`) written from one rAF (`src/components/home/RouteOverlay.tsx:149-178`) — see §3.2.
- **`font-family` posture `optional`** (not `swap`) renders next/font's metric-matched fallback for a first uncached paint, buying zero font-swap CLS while keeping the real faces on fast/cached loads (`layout.tsx:17-34`).

---

## 2. Design Tokens

### 2.1 Color palette

Every value is a CSS custom property in `src/app/globals.css :root` (lines cited), surfaced as a Tailwind utility in `tailwind.config.ts:20-98`. The palette is a **jade-cast light theme with rare authored-dark ("ink") showcases.**

**Surfaces & inputs**

| Token | Hex | globals.css | Used for |
|---|---|---|---|
| `--bg` (`bg-bg`) | `#fafbfc` | `:13` | Page base (faint cool off-white) |
| `--surface` (`bg-surface`) | `#ffffff` | `:14` | Cards, panels |
| `--surface-hover` | `#f3f5f8` | `:15` | Hover on surfaces |
| `--surface-alt` | `#f5f7fa` | `:16` | Alt tinted banding |
| `--input-bg` | `#f7f9fb` | `:19` | Form inputs |
| `--surface-tint` (`bg-surface-tint`) | `#f4f9f7` | `:109` | Tint bands, eyebrow pills, chips (~4% toward jade) |
| `--surface-tint-border` | `#dbeae3` | `:110` | Tint band / pill borders |

**Borders**

| Token | Hex | globals.css | Used for |
|---|---|---|---|
| `--border` (`border-border`) | `#ebedf1` | `:22` | Standard divider / card border |
| `--border-strong` | `#dcdfe4` | `:23` | Stronger border / hover emphasis |
| `--border-control` | `#7e8d86` | `:27` | **Boundary-dependent controls** — clears WCAG 1.4.11 3:1 on white/tint/bg (light secondary button, form input edges) |

**Text ramp — jade-cast (carries the ink hue, never neutral gray)**

| Token | Hex | globals.css | Contrast |
|---|---|---|---|
| `--text` (`text-default`) | `#0c1512` | `:36` | 17.9:1 on bg |
| `--text-muted` (`text-muted`) | `#42544c` | `:37` | 7.78:1 on bg |
| `--text-subtle` (`text-subtle`) | `#4b5c53` | `:38` | 6.86:1 on bg |
| `--text-disabled` | `#b6c2ba` | `:39` | disabled |

**Accent — deep jade-emerald, used sparingly**

| Token | Hex | globals.css | Note |
|---|---|---|---|
| `--accent` (`text-accent`/`bg-accent`) | `#0b7d56` | `:43` | 5.1:1 on white |
| `--accent-hover` | `#0a6b49` | `:44` | solid-button hover / jade-on-deeper-field |
| `--accent-text` | `#ffffff` | `:45` | text on accent fills |
| `--accent-subtle` | `#e8f8f1` | `:46` | tinted accent bg (icon chips) |

**Ink family — dark showcases only (hero, morph, footer)**

| Token | Hex / value | globals.css | Contrast on ink |
|---|---|---|---|
| `--ink` (`bg-ink`) | `#0b1512` | `:85` | section bg |
| `--ink-surface` | `#12201b` | `:86` | raised surface / glass fallback |
| `--on-ink` (`text-on-ink`) | `#e9f1ee` | `:87` | 16.4:1 primary |
| `--on-ink-muted` | `#adbfb8` | `:92` | 9.7:1 secondary |
| `--on-ink-border` | `#35504a` | `:97` | 2.12:1 — dividers/tracks |
| `--on-ink-border-strong` | `#4a6b60` | `:98` | 3.15:1 — card/panel edges |
| `--accent-on-ink` | `#46d6a0` | `:99` | 10.1:1 — links/CTAs/status on ink |
| `--accent-on-ink-hover` | `#74e2b8` | `:100` | hover |
| `--ink-hover` | `#264035` | `:105` | nav-item hover fill (1.44:1 vs panel — visibly lightens) |

**Glass (only two, both dark jade — see §4.3)**

| Token | Value | globals.css | Used for |
|---|---|---|---|
| `--ink-glass` | `rgb(22 42 34 / 0.70)` | `:129` | cards floating on ink stages (`.ink-glass`, blur 10px) |
| `--nav-glass` | `rgb(12 23 19 / 0.90)` | `:141` | the single nav bar (`.nav-glass`, blur 12px) |

**Semantic status** — `--danger #c81e2c` (`:51`), `--warning #b45309` (`:54`), `--success #0b7d56` (`:57`, = accent), `--info #2563eb` (`:60`), each with `-hover` and `-subtle` variants (`:51-62`). On-ink status: `--danger-on-ink #f87171` (`:115`).

**Service-level palette (dedicated, outside status hues; always paired with icon+label)** — light: `--svc-amb #0f766e` teal (`:69`), `--svc-wheel #6d28d9` violet (`:71`), `--svc-str #a21caf` fuchsia (`:73`), each `-subtle`. On-ink graphics: `--svc-amb-on-ink #2dd4bf` (`:116`), `--svc-wheel-on-ink #a78bfa` (`:117`), `--svc-str-on-ink #e879f9` (`:118`); morph-figure apparatus `--svc-wheel-fig #c4b5fd` (`:121`), `--svc-str-fig #f0abfc` (`:122`).

**Legacy aliases** — `--background: var(--bg)`, `--foreground: var(--text)` (`:144-145`), mapped in `tailwind.config.ts:22-23` so `bg-background`/`text-foreground` still resolve. *(Relevant to portability — §7.)*

Contrast ratios are authored into the token comments and computed against the **actual composited** background (e.g. the 0.90-alpha nav glass over pure white → ~rgb(39 51 46), `globals.css:131-140`), never assumed.

### 2.2 Typography

- **Display:** Bricolage Grotesque, `--font-display` → `font-display`, weights **500/600/700/800** (`layout.tsx:23-28`; `tailwind.config.ts:104`). Headings only.
- **Body:** Hanken Grotesk, `--font-body` → `font-sans`, weights **400/500/600/700** (`layout.tsx:29-34`; `tailwind.config.ts:103`). A warm humanist grotesque on a deliberate **contrast axis** with Bricolage (`layout.tsx:12-16`).
- **Loading:** both `display: "optional"`, `subsets: ["latin"]` (`layout.tsx:27-28, 33-34`); fallback stack `ui-sans-serif, system-ui, -apple-system, sans-serif` (`globals.css:161`, `tailwind.config.ts:103-104`). `<body className="… antialiased">` (`layout.tsx:71`).

**Type scale (observed):**

| Role | Classes | Evidence |
|---|---|---|
| Hero H1 | `text-4xl → sm:text-5xl → lg:text-6xl`, `leading-[1.05]`, `tracking-tight`, `font-bold` | `Hero.tsx:31` |
| Section H2 | `text-3xl → sm:text-4xl` (FinalCta adds `lg:text-5xl`) | `AudienceTriage.tsx:27`, `FinalCta.tsx:14` |
| Solution H1 | `text-4xl → sm:text-5xl → lg:text-6xl`, `leading-[1.08]` | `SolutionPage.tsx:95` |
| Legal H1 | `text-4xl → sm:text-5xl`, `leading-[1.1]` | `LegalPage.tsx:48` |
| Footer wordmark | `text-5xl → sm:text-6xl → lg:text-7xl`, `font-bold`, `tracking-tight` | `Footer.tsx:91` |
| Proof figure | `text-5xl → sm:text-6xl`, `leading-none`, `tabular-nums` | `ProofBand.tsx:50-53` |
| Hero/section subline | `text-xl`, `leading-snug`/`leading-relaxed` | `Hero.tsx:36`, `FinalCta.tsx:17` |
| Marketing body | `text-lg` / `lg:text-[17px]`, `leading-relaxed` | `SolutionPage.tsx:64,131`, `LegalPage.tsx:69` |
| Small tier (floor) | `text-sm` / `text-[15px]` / `text-[13px]` (mock chrome) | `Navbar.tsx:166`, `Footer.tsx:130`, `SolutionPage.tsx:43` |
| Measure cap | `max-w-prose` (~65–75ch) | `Hero.tsx:36`, `LegalPage.tsx:47` |

Displays consistently pair `font-display` + `font-bold` + `tracking-tight`; body copy sits at 17–18px with `leading-relaxed`.

### 2.3 Spacing, radii, shadows, borders

- **Vertical rhythm** is owned by one wrapper: `Section` = `py-16 sm:py-20 lg:py-24` (`Section.tsx:17`); tighter variants on hero bands (`Hero.tsx:20` `pt-28 sm:pt-32 lg:pt-36`; `SolutionPage.tsx:90`, `LegalPage.tsx:46` `py-14 sm:py-16 lg:py-20`).
- **Horizontal rhythm** is owned by one wrapper: `Container` = `mx-auto w-full max-w-6xl px-6 lg:px-8` (`Container.tsx:15`) — 1152px max, 24→32px gutters, shared by every band and the platform sub-nav (`PlatformSubnav.tsx:123`).
- **Radii ladder:** `rounded-full` pills (`Hero.tsx:27`), `rounded-xl` cards & dropdown panels (`AudienceTriage.tsx:36`, `Navbar.tsx:127`), `rounded-lg` buttons + icon chips (`Button.tsx:37`, `Navbar.tsx:150`), `rounded-md` nav triggers/hamburger (`Navbar.tsx:110,389`), `rounded-sm` small links/wordmark (`Footer.tsx:27`), footer endcap `rounded-t-[28px] → sm:rounded-t-[32px]` **top-only, square bottom** (`Footer.tsx:81`).
- **Shadows (3 soft tokens):** `--shadow-sm/md/lg` (`globals.css:77-79`) → `boxShadow` utilities (`tailwind.config.ts:108-112`). Cards use `shadow-sm` (`AudienceTriage.tsx:36`), dropdown panel `shadow-md` (`Navbar.tsx:127`), nav-apply lifts to `shadow-md` on hover (`globals.css:296`). All are low-alpha, no glow/bloom.
- **Borders:** hairline `border-border` seams between bands throughout (`SolutionPage.tsx:111`, `LegalPage.tsx:59`); `border-control` for perceivable control edges; `border-on-ink-border` (dividers) vs `border-on-ink-border-strong` (card/panel edges) on ink.

---

## 3. Motion Language

### 3.1 The two easing curves

The entire system runs on **one decelerate curve** with a single deliberate exception:

- **Primary ease `cubic-bezier(0.22, 1, 0.36, 1)`** (easeOutExpo-ish, no overshoot) — used everywhere: as JS constant `EASE` in `Reveal.tsx:7` and `PageTransition.tsx:30`, and across `globals.css` at lines `202, 236-237, 262, 273, 285, 293, 297, 321, 337, 341, 346, 356, 361, 388, 398-399, 422, 440, 486-487, 501-502, 571, 580, 598-599, 646, 652, 686`.
- **Single overshoot ease `cubic-bezier(0.34, 1.4, 0.64, 1)`** — used exactly once, on the footer terminus node's scale-settle (`globals.css:351`) — the one "arrival pop."
- **Global control feedback:** every `button, [role="button"], a, select, summary, [role="tab"]` transitions color/bg/border/shadow/transform/opacity/fill/stroke at **150ms** on the primary curve (`globals.css:199-203`); active-press dips to `scale(0.97)` (`globals.css:206-211`).
- **Ceilings:** page content ≤ ~300ms; nav chrome earns a higher but still ≤250ms ceiling (`globals.css:247-249`).

### 3.2 The signature rail / track / van

A single continuous SVG line is drawn down the whole homepage as you scroll, with a livery van riding it and performing a U-turn at the footer. This is the site's motif. Machinery (`src/components/home/RouteOverlay.tsx` + `globals.css:631-658`):

**Geometry (measured once on mount + resize):**
- Station nodes at `NODE_FRACTIONS = [12.5, 37.5, 62.5, 87.5]` % down the spine region (`RouteOverlay.tsx:25`); `INK_STOP = 2` marks Stop 3 as the ink band (`:26`).
- Track height `h = seamDoc − regionTopDoc − FOOTER_HANDOFF`, `FOOTER_HANDOFF = 36px` above the footer seam (`:11, 100`).
- Lane X pinned to the container's left gutter (`gutterX`, default 40, else container-left `+2`) so the line never crosses a text column (`:108-110`).
- Path = straight down the gutter, then a cubic Bézier `curveLen = min(h*0.34, 460)` curving to the footer terminus X (`motifX`) (`:130-135`).

**Scroll → progress:**
- `p = clamp((scrollY − docStart) / docSpan, 0, 1)` where `docStart = regionTopDoc − vh*0.72` (`:138-139, 153`), written to one CSS var `--route-progress` from one passive scroll listener → one rAF (`:173-178`).
- **Line draw:** `.route-path { stroke-dasharray: 1; stroke-dashoffset: calc(1 − var(--route-progress,1)) }` — scrubbed 1:1 with scroll, `pathLength={1}`, stroke `2.5`, non-scaling (`globals.css:635`; `RouteOverlay.tsx:277-279`).
- **Van position:** `.route-van { offset-distance: calc(var(--route-progress,0) * 100%) }`, `offset-path` set imperatively to the measured `path("…")` (`globals.css:636-644`; `RouteOverlay.tsx:230-236`).

**The U-turn leg machine (the detail that makes it feel authored):**
- `leg` state starts `"outbound"`; flips `"return"` at `p ≥ 0.985`, resets `"outbound"` at `p ≤ 0.02` (`RouteOverlay.tsx:78, 165-171`).
- Lane is chosen by **leg**, not scroll direction: `.route-van-lane { transform: translateX(12px); transition: transform 450ms }` outbound = **+12px** right lane; `[data-leg="return"] → translateX(-12px)` = **−12px** left lane — the ~450ms cross **is** the visible U-turn (`globals.css:648-653`). Mid-page scroll reversals only rotate the nose (`.route-van svg { rotate(90deg) }`, `[data-direction="up"] → rotate(-90deg)`, 200ms, `globals.css:645-647`).
- Nodes light via IntersectionObserver (`rootMargin "0px 0px -20% 0px"`, play-once): unlit `fill:border-strong; scale(0.8)` → `.is-lit fill:accent; scale(1)`, 220ms (`globals.css:483-490`; `RouteOverlay.tsx:201-213`). Across the ink band the line flips to `accent-on-ink` via a measured gradient (`globals.css:622-626`).
- **Van gate:** shown only where `@supports (offset-path: path("M0 0"))` and the overlay is armed (`globals.css:656-658`); **desktop-only** (`lg`, `RouteOverlay.tsx:84,249`).

**In-section spine mocks** replay subtle loops only when live: marching legs `spineMarch 1.6s linear` (`globals.css:509-510`), pulsing stepper `spinePulse 2.6s` staggered `0.35/0.7/1.05s` (`:512-516`), re-running scrub `spineScrub 7s` staggered `0.16/0.32/0.48s` (`:518-522`).

### 3.3 The "default = complete static composition" doctrine

The load-bearing principle behind the site's stability. **SSR paints the finished state**; JS only *adds* a hidden-initial + reveal, and *only when motion is allowed*. Applied in `RouteOverlay`, `MapObserver`, `TerminusReveal`, `AssistScene`, `ProofSpotlight`, and the spine reveals. Because every element already occupies its final space, CLS is zero and no-JS / reduced-motion render a complete page. Example: the route forces `--route-progress: 1` under reduced-motion/mobile → line fully drawn, nodes lit, no van (`RouteOverlay.tsx:181-195`; `globals.css:657`).

### 3.4 Reveal, spotlight & autoplay patterns

| Pattern | Animates | Duration / stagger | Trigger | Reduced-motion | Evidence |
|---|---|---|---|---|---|
| `Reveal` (framer) | opacity + `y` 14→0 | 550ms; per-sibling `delay` | `whileInView` `once`, `margin -80px` | plain `<div>` | `Reveal.tsx:25-48` |
| `PageTransition` | opacity + `y` 10→0 | 300ms | route mount | plain `<div>` | `PageTransition.tsx:23-30` |
| Spine content | opacity + `y` 14→0 | 550ms; mock +90ms | `.is-revealed` (IO) | static (gated) | `globals.css:498-505` |
| Proof band | `.proof-stat` opacity+`y`12 | 500ms; +70/140/210ms | IO `data-proof-in` | static | `globals.css:395-404` |
| Map landmarks | opacity + `y` 6→0 | 620/720ms | single IO `0.2`, play-once | visible default | `globals.css:384-388`; `MapObserver.tsx:16-33` |
| Assist scene | attendants X ±20→0 | 520/640ms; right +110ms | IO `0.4`, play-once | static | `globals.css:565-573`; `AssistScene.tsx:30-41` |
| Proof spotlight | `.is-active` X+2px + chip fill | 220ms; cycles **3000ms**/item | `setTimeout` loop, IO `0.35` | no-op | `globals.css:580-592`; `ProofSpotlight.tsx:43-59` |
| Service morph | body pose + apparatus crossfade | pose 540ms / opacity 380ms; apparatus +80ms; dwell **4000ms** | progress-bar `animationend` advance, IO `0.4` | static full | `globals.css:594-616`; `ServiceMorph.tsx:17,88-121` |
| Product demo (hero console) | scene opacity+`y`8+blur2 | enter 300 / exit 180ms; dwell **4500ms** | progress-bar `animationend`, IO `0.25` | static full | `globals.css:415-470`; `ProductDemo.tsx:26,288-305` |
| Terminus arrival | line/node/buffer/wordmark/cols | staggered ladder, ≤600ms total | IO `0.2`, play-once | static, zero CLS | `globals.css:326-363`; `TerminusReveal.tsx:14-33` |

**Autoplay is a shared, humane mechanism:** ServiceMorph and ProductDemo both use `@keyframes demoTabProgress { scaleX(0)→(1) }` linear as a GPU timer whose `animationend` advances state (`globals.css:461-470`). Both freeze via inline `animation-play-state: paused` on the union `userPaused || hover || focus || document.hidden || !inView` — no background JS timers, and a hidden tab runs nothing (`ServiceMorph.tsx:108,217`; `ProductDemo.tsx:294,377`). The morph carries a real pause `<button>` (WCAG 2.2.2).

### 3.5 Nav choreography

Chrome earns the higher ceiling (`globals.css:247-249`): magic-line slide `transition: transform 250ms` (`:262`) with `navIndFade 160ms` (`:264-266`); dropdown panel `navPanelIn 200ms` / `navPanelOut 130ms`, origin-anchored to the trigger corner (`:232-245`); item cascade `.nav-cascade` `220ms` with **stagger `calc(var(--i,0) * 45ms + 40ms)`** (`:272-279`); caret `rotate-180` on `data-state=open` (`Navbar.tsx:114-120`); arrow nudge 180ms (`:282-288`); "Apply" lift `translateY(-1px)` + `shadow-md` (`:292-298`). Every hover has a focus-visible twin. The footer link underline-slide (`.footer-link::after scaleX(0)→1`, 200ms, `:311-324`) reuses this grammar.

### 3.6 Reduced-motion

One global block (`globals.css:660-673`) sets `scroll-behavior: auto`, `animation-duration: 0.01ms`, `animation-delay: -1ms` (so delayed fill-both anims start already-complete rather than staggering in), `transition-duration: 0.01ms`, and removes the active-press dip. Components additionally early-return their reveal effects, so nothing arms. Every motion surface has a static end-state — this is a build-failing invariant.

---

## 4. Component Patterns

### 4.1 Layout primitives

`Container` (`Container.tsx:15`) and `Section` (`Section.tsx:17`) own all horizontal/vertical rhythm; see §2.3. `cn()` (`utils/cn.ts:4-6`) merges Tailwind classes safely everywhere.

### 4.2 Buttons

One `Button` (`src/components/ui/Button.tsx`) renders a `<button>` or a Next `<Link>` when `href` is set (`:77-102`). Composition: `cn(base, variantClasses[variant], sizeClasses[size], className)` (`:75`).

- **Base (all variants):** `inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50` (`:37-40`).
- **Focus rings (per-surface):** `LIGHT_RING = focus-visible:ring-accent focus-visible:ring-offset-bg`; `INK_RING = focus-visible:ring-accent-on-ink focus-visible:ring-offset-ink` (`:42-43`).

| Variant | Full classes | Line |
|---|---|---|
| `primary` | `bg-accent text-accent-text hover:bg-accent-hover` + LIGHT_RING | `:46` |
| `secondary` | `border border-control bg-surface text-default hover:bg-surface-hover` + LIGHT_RING | `:48` |
| `ghost` | `text-muted hover:bg-surface-hover hover:text-default` + LIGHT_RING | `:49` |
| `primaryOnInk` | `bg-accent-on-ink text-ink hover:bg-accent-on-ink-hover` + INK_RING | `:52` |
| `secondaryOnInk` | `border border-on-ink-border-strong text-on-ink hover:bg-ink-surface` + INK_RING | `:53` |
| `ghostOnInk` | `text-on-ink-muted hover:bg-ink-surface hover:text-on-ink` + INK_RING | `:54` |

- **Sizes:** `sm = h-9 px-3.5 text-sm`; `md = h-11 px-5 text-sm` (`:57-60`). Defaults `variant="primary" size="md" type="button"` (`:63-69`).
- **States:** hover via per-variant `hover:*` (only `transition-colors`); focus-visible ring per surface; disabled `pointer-events-none opacity-50`; active-press `scale(0.97)` from the global rule (`globals.css:206-211`). The secondary (outline) button uses `border-control` so its shape is perceivable (WCAG 1.4.11).

### 4.3 Navigation

Single **dark "on-ink" register in every state** — no theme flip (`Navbar.tsx:20-27`). Structure: sticky `<header class="nav-glass sticky top-0 z-40 …">` (`:318-323`) → `Container` → `flex h-16 …` (`:326`) with wordmark + Radix `NavigationMenu.Root` + right cluster + hamburger.

- **Glass:** `.nav-glass` = solid `--ink-surface` fallback, upgraded to translucent `--nav-glass` + `blur(12px)` where supported (`globals.css:185-192`). Scroll only toggles the border: `scrolled ? border-b border-on-ink-border : border-b border-transparent`, `scrolled` at `scrollY > 8` (`Navbar.tsx:319-323, 242`).
- **Theme bundle `NT`** centralizes the tokens (`Navbar.tsx:39-62`): trigger `text-on-ink`, chevron `text-on-ink-muted`, ring accent-on-ink, indicator bar `bg-accent-on-ink`, panel `bg-ink-surface border-on-ink-border-strong`, item hover `hover:bg-ink-hover`, icon chip fills accent on hover and inverts the icon.
- **Magic-line indicator:** `NavigationMenu.Indicator.nav-indicator` wrapping `.nav-indicator-bar` (`Navbar.tsx:342-344`); the bar is a centered 62%-wide, 2.5px, pill child (`globals.css:268`) so Radix snaps width while only `transform` animates (`:252-263`). **Critical:** `NavigationMenu.Item` is intentionally *not* `position: relative` — that would make it the trigger's offsetParent and freeze the line; the panel gets its own `relative` wrapper as a sibling (`Navbar.tsx:98-104, 124`).
- **Dropdown panel:** `nav-panel absolute top-full z-50 mt-1.5 rounded-xl border p-2 shadow-md` + origin (`nav-panel-right right-0` else `left-0`) + `NT.panel` + width (`w-[26rem]` / `w-56`) (`Navbar.tsx:125-132, 338-340`). Items: `<ul class="grid gap-1">`, each `<li class="nav-cascade" style="--i:i">` (`:133-137`); link `group flex items-start gap-3 rounded-lg p-3 …` with icon chip `h-9 w-9 rounded-lg`, title `text-[15px] font-semibold`, nudge arrow `.nav-arrow`, desc `text-sm leading-snug` (`:141-166`).
- **Apply CTA:** `<Button href="/apply" variant="primaryOnInk" size="sm" className="nav-apply">` + `.nav-apply-arrow` (`:374-382`).
- **Mobile:** hamburger `h-11 w-11 rounded-md` (`:385-399`) opens a **solid `bg-ink`** `role="dialog" aria-modal` overlay (`:404-446`) with `animate-overlay-in`, hand-rolled focus trap, `inert` siblings, Escape-to-close, focus return (`:261-312`). Accordions reuse `.nav-cascade` + rotating chevrons; collapsed panels toggle `hidden` so links leave the a11y tree (`:186-229`).
- **Sign-in** is a *third menu* in the same grammar (Radix trigger + caret + magic-line), gated by `PORTAL_LIVE`, rendered as a `<div class="relative">` (not a second `<nav>` landmark), anchored right (`:356-372`).

### 4.4 Hero

`<Section class="relative -mt-16 overflow-hidden bg-ink pt-28 sm:pt-32 lg:pt-36">` (`Hero.tsx:20`) — the ink hero pulls up under the 64px nav via `-mt-16` so the page-top chrome sits over ink, not body white. `AmbientMap tone="ink" region="wide"` (`:21`). 12-col grid (`grid items-center gap-12 lg:grid-cols-12`), headline `lg:col-span-5`, demo `lg:col-span-7` (`:24-52`). Eyebrow = `.ink-glass` pill `rounded-full border border-on-ink-border-strong … text-accent-on-ink` with a dot (`:27-30`). H1 `font-display text-4xl … lg:text-6xl leading-[1.05] tracking-tight text-on-ink` with an `text-accent-on-ink` word (`:31-33`); subline `text-xl … text-on-ink-muted` (`:36`); CTA row = `primaryOnInk` + `secondaryOnInk` (`:41`).

### 4.5 Cards, bands & sections

- **Audience cards (the 4-card triage):** the whole card is a `<Link>` — `group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm … hover:border-control hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg` (`AudienceTriage.tsx:36-53`); icon chip `h-10 w-10 rounded-lg bg-accent-subtle text-accent`; action arrow `group-hover:translate-x-0.5`. Grid `sm:grid-cols-2 lg:grid-cols-4` (`:32`).
- **Credential strip:** `border-y border-border bg-surface-tint`, `grid-cols-2 md:grid-cols-4`, static icon+label chips (`CredentialStrip.tsx:21-30`).
- **Proof band:** `bg-surface-tint`, `grid-cols-2 lg:grid-cols-4`, big `text-accent` figures with `max-w-[17ch]` labels (`ProofBand.tsx:43-57`).
- **Provider teaser:** ordered steps, `bg-surface-tint`, numerals in `text-accent`, hairline connectors `bg-surface-tint-border` (`ProviderTeaser.tsx:42-54`).
- **Eyebrow pill (recurring atom):** `inline-flex items-center rounded-full border border-surface-tint-border bg-surface(-tint) px-3 py-1 text-xs font-medium tracking-wide text-accent` (`AudienceTriage.tsx:24`, `SolutionPage.tsx:33`, `LegalPage.tsx:11`).
- **Reusable audience template** `SolutionPage.tsx`: eyebrow → H1 → subline → alternating white/tint proof sections (`i%2` parity, `flip` for layout order, `MockCard` gives a section two columns) → one closing CTA (`:87-170`).
- **Legal template** `LegalPage.tsx`: calm prose column `max-w-prose`, numbered `<h2>` sections, body `text-lg leading-relaxed text-muted`, persistent-underline `legalLink` (`:17-19, 43-75`).
- **Platform sub-nav** `PlatformSubnav.tsx`: quiet sticky scrollspy `sticky top-16 z-30 border-b border-border bg-surface`, horizontally-scrollable chips, active chip `text-accent` + a fading full-width underline, `aria-current`, rAF scrollspy with `TRIGGER = 130` (`:119-146, 77-91`).

### 4.6 Forms

a11y-first lead forms (`src/components/leads/`):

- **Inputs:** base `w-full rounded-lg bg-input-bg px-3.5 py-2.5 text-base text-default … focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface`, edge `border border-control` (error → `border-danger`) (`fields.tsx:11-18`).
- **Wiring:** `<label htmlFor>` ↔ `id={name}`; `aria-required`, `aria-invalid`, `aria-describedby` join hint+error ids; required `*` is a visible `text-danger` span + an sr-only "(required)" (`fields.tsx:20-107`). Errors `mt-1.5 text-sm font-medium text-danger` (`:54-60`). Checkbox groups use `<fieldset><legend>` (`:188-225`).
- **Honeypot:** off-screen `absolute left-[-9999px] … h-0 w-0 overflow-hidden`, `aria-hidden`, `tabIndex={-1}` (`fields.tsx:228-235`).
- **Lifecycle:** `useLeadForm` uses a manual `pending` state, focuses the first errored field / the success `role="status"` panel / the `role="alert"` banner; success cleanly replaces the whole card heading (`useLeadForm.ts:35-76`). Submit label flips to `"Sending…"` (`ApplyForm.tsx:137-139`).
- **PHI microcopy (mandatory, verbatim):** *"Please don't include any member or health information in this form. See our Privacy Policy."* linking `/privacy` (`ApplyForm.tsx:124-133`, `ContactForm.tsx:135-144`).

### 4.7 Footer / terminus

The homepage is one trip; the footer is the **terminus** — an **inset ink endcap flush to the document bottom** (`Footer.tsx:79-145`):

- Frame `<footer class="bg-bg pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">` (side gutters only from `sm`; full-bleed at 390) wraps a `<div data-route-seam class="relative overflow-hidden rounded-t-[28px] bg-ink sm:rounded-t-[32px]">` — **top corners rounded, square bottom, no `pb`** so the last pixels are always ink (`:80-81`). `AmbientMap tone="ink" gutter={false}` is clipped by `overflow-hidden`.
- **(a) Brand row:** the terminus motif SVG (dashed `accent-on-ink` line → filled node → buffer bar, `:49-71`) + the wordmark hero `text-5xl → sm:6xl → lg:7xl` + mission `text-lg text-on-ink-muted` + CTA pair (`primaryOnInk` Apply + `secondaryOnInk` Talk to us) (`:88-105`).
- **(b) Link columns:** `<nav aria-label="Footer" class="grid grid-cols-2 … md:grid-cols-4">`, headers `text-base font-semibold text-on-ink`, links `.footer-link text-base text-on-ink-muted hover:text-on-ink` (`:110-125`). Data comes from `FOOTER_COLUMNS` in `src/lib/nav.ts:124-150` — four columns Platform / Solutions / Company / **Legal**.
- **Legal links (`nav.ts:141-149`):** Privacy → `/privacy`, Terms → `/terms`, HIPAA notice → `/hipaa`, Accessibility → `/accessibility`.
- **(c/d) Utility/legal row:** `© {year} {SITE.legalName} dba {SITE.name} · {SERVICE_AREA_LINE}` + `BackToTop` button (reduced-motion → instant scroll) + gated Sign in (`Footer.tsx:130-145`; `BackToTop.tsx:10-13`).
- Exactly one `<footer>` (contentinfo) landmark; the ink card is a plain `div`. Arrival choreography per §3.4.

---

## 5. Chrome & Assets

- **Favicon:** `src/app/favicon.ico` — the only icon, auto-wired by the App Router file convention. No `icon.tsx`, `apple-icon`, manifest, `favicon.svg`, or generated `opengraph-image`.
- **OG image:** `public/og.png` (1200×630) via `OG_IMAGE` (`seo.ts:19-24`), wired site-wide for OpenGraph + Twitter `summary_large_image` (`layout.tsx:47-61`). `public/logo.png` (512×512) is referenced only by JSON-LD `logo` (`schema.ts:18`).
- **Titles:** homepage `HOME_TITLE = "Nexo Access | Non-Emergency Medical Transportation, DC, MD & VA"` (`seo.ts:11`); interior pattern `"{Page} | Nexo Access, NEMT for the DMV"` (`seo.ts:16`), set via `title.absolute` so the bare `%s` template (`layout.tsx:42`) never doubles the suffix.
- **Metadata:** `metadataBase = new URL(SITE.domain)` → `https://nexoaccess.com` (`layout.tsx:41`); `alternates.canonical` apex, `robots index/follow` (`:45-46`); per-page via `pageMeta()` (`seo.ts:106`). `sitemap.ts`/`robots.ts` emit absolute apex URLs, allow-all, apex `host`, no fabricated dates.
- **JSON-LD:** one `<script type="application/ld+json">` in the root layout (`layout.tsx:73-76`); `organizationSchema()` = `@type "MedicalBusiness"`, `areaServed` = Washington DC (AdministrativeArea) + Maryland + Virginia (State), email `info@`, `telephone` E.164 — **no `address`/`aggregateRating`/`review`/`openingHours`** (`schema.ts:10-29`). `schemaJson()` escapes `< > &` and U+2028/9 to prevent `</script>` breakout (`schema.ts:35-46`).
- **Single-source constants:** brand/URLs from `SITE` (`site.ts:12-44` — `name "Nexo Access"`, `legalName "FC Nexo LLC"`, `domain`, `email info@nexoaccess.com`, `phone (202) 409-2970`, `portalLogin()`); gated copy from `launch.ts` (all flags `false` → `SERVICE_AREA_LINE = "Built for DC · MD · VA"`, `COMPLIANCE_LINE = "Built for HIPAA compliance"`).

---

## 6. Why It Works

The site reads as *premium, calm, and credible* not because of any single flourish but because a few disciplined decisions compound. In order of impact:

1. **Color is assigned by PURPOSE, and the dark register is kept RARE.** Three background registers — white (openings), tint (connective rhythm), ink (authored dark showcases) — and ink appears in exactly three chapters: hero, the Stop-3 morph, and the footer terminus (`page.tsx:12-14`; token families at `globals.css:85-141`). Because ink is scarce and always buffered out through tint (never ink→white), each dark moment reads as a deliberate *showcase* rather than a "dark theme." Scarcity is what makes it feel authored.

2. **Everything is one material: a jade-cast.** The text ramp is not neutral gray — every tier carries the ink hue (`--text #0c1512`, `--text-muted #42544c`, `--text-subtle #4b5c53`, `globals.css:36-38`), the borders are jade-cast (`--border-control #7e8d86`), and even the glass is tinted toward the brand green (`--ink-glass rgb(22 42 34 / 0.70)`, `--nav-glass rgb(12 23 19 / 0.90)`, `:129,141`). Nothing looks like a stock template's blue-gray. The whole page feels cut from one stone.

3. **One easing curve, used everywhere.** `cubic-bezier(0.22, 1, 0.36, 1)` governs essentially every transition in the system (30+ sites in `globals.css`), with a single overshoot curve reserved for exactly one moment — the terminus node's "arrival pop" (`:351`). This is why the motion feels like one hand designed it: coherence through restraint, with the one exception earning its emphasis.

4. **Motion carries MEANING, not decoration — the rail.** The scroll-drawn route line, the van riding it, and the U-turn at the footer (`RouteOverlay.tsx`; `globals.css:631-658`) turn "scrolling a marketing page" into "taking a trip that arrives." A non-emergency *transportation* company literally renders its product as a journey down a track. The metaphor is legible without a caption, and the mechanics are honest — one CSS var, one rAF, measured geometry, a real leg-state machine — so it never stutters.

5. **"Default = the complete static composition."** SSR paints the finished page; JavaScript only adds hidden-initial states and reveals, and only when motion is allowed (`RouteOverlay`, `TerminusReveal`, `AssistScene`, `ProofSpotlight`, spine, map). The payoff is threefold: zero CLS (every element already holds its space), full no-JS/reduced-motion parity, and a subjective sense of *solidity* — nothing pops in late or shoves the layout. Premium feel is mostly the absence of jank, and this doctrine buys it structurally.

6. **Compositor-only animation.** Transform, opacity, filter(blur), stroke-dashoffset, offset-distance — never width/height/layout (survey of `globals.css:194-673`). Autoplay is a shared GPU-timer (`demoTabProgress` scaleX) that advances state on `animationend` and freezes on the union of pause conditions including `document.hidden` (`ProductDemo.tsx:294`, `ServiceMorph.tsx:108`). It stays at 60fps and it's never hostile — a hidden tab runs nothing, and long autoplay has a real pause button (WCAG 2.2.2).

7. **Accessibility is treated as a floor, and legibility reads as confidence.** Contrast is computed against the *actual composited* surface — the 0.90-alpha nav glass is calibrated over pure white, not assumed (`globals.css:131-140`) — and the ratios are baked into the token comments. Controls that depend on their edge use a dedicated `--border-control #7e8d86` that clears WCAG 1.4.11 (`:24-27`). A UI you can effortlessly read is a UI you trust; the rigor is invisible but felt.

8. **A real type contrast axis, at generous sizes.** Bricolage Grotesque (characterful display) against Hanken Grotesk (warm humanist body) on a deliberate contrast axis (`layout.tsx:12-16`), body at 17–18px with relaxed leading and `max-w-prose` measure caps, displays large with `tracking-tight`. It reads editorial and healthcare-credible rather than SaaS-generic — and `display: "optional"` means it achieves that with zero font-swap CLS.

9. **Glass is rationed to two places, both dark.** The single nav register and cards-on-ink only (`globals.css:164-192`) — never on light surfaces, never glass-on-glass, and opacity (not blur) guarantees the contrast. This sidesteps the glassmorphism cliché entirely; the effect reads as a considered material, not a trend.

10. **Total token discipline is what makes it a REFERENCE.** Every color is a CSS variable in one file, mapped to Tailwind utilities, with zero hardcoded hex in any component (`globals.css:5-10`; `tailwind.config.ts:20-98`). The IA, copy, SEO, and schema each have a single source (`nav.ts`, `launch.ts`, `seo.ts`, `schema.ts`, `site.ts`). This is precisely why the look can be lifted and unified across the platform: the design *is* the token file, and the token file is portable.

The through-line: **restraint applied consistently.** Rare ink, one easing curve, one material hue, one horizontal and one vertical rhythm wrapper, motion that means something, and a hard accessibility floor. None of it is loud; all of it is coherent.

---

## 7. Portability

**Transfers to the Next.js platform as-is:**

- **The token file itself.** `globals.css:11-146` + the `tailwind.config.ts` mapping is a self-contained, framework-agnostic theme. Dropping these in gives the platform the exact palette, the jade-cast ramp, the ink family, and the glass values.
- **Font loading.** `next/font/google` with Bricolage + Hanken at `display: "optional"` (`layout.tsx:23-34`) is native Next and moves without change.
- **The motion CSS layer.** `globals.css:194-673` is pure CSS keyed off `data-*` attributes and CSS vars — no framework coupling. The two easing curves, the reveal/spotlight/autoplay patterns, the reduced-motion block, and the "default = complete static composition" doctrine all port directly.
- **Primitives & components.** `Button`, `Container`, `Section`, the eyebrow-pill atom, the card grammar, and the Radix-based `Navbar`/`Footer` are standard React + Tailwind + Radix and lift cleanly.
- **Single-source libs.** `site.ts`, `launch.ts`, `nav.ts`, `seo.ts`, `schema.ts`, `leads.ts` are plain modules — swap the constant values, keep the shape.

**Needs adaptation:**

- **The rail/route system** (`RouteOverlay`, `AmbientMap`, spine, terminus motif) is marketing-narrative furniture tied to homepage geometry and desktop-only (`RouteOverlay.tsx:84`). It's a signature to *reference*, not a component to paste into an app shell — reimplement selectively where a journey metaphor fits.
- **Contrast guarantees are palette-specific.** Every ratio in the token comments was computed for *these* ink/accent/glass values against *these* composited surfaces. If the platform alters any base (ink shade, glass alpha, accent), all dependent pairings must be re-verified with a luminance calculator, not by eye.
- **`min-h-svh` + `html{background:var(--ink)}`** (`layout.tsx:71`, `globals.css:154`) assume an ink-terminated page. A platform whose pages end light must revisit the root background or it will show ink in the overscroll region.

**Likely conflicts with a platform's current token names** (the main integration risk):

- This system names **text tiers** `default` / `muted` / `subtle` (`tailwind.config.ts:37-40`). A shadcn/ui-style platform typically uses `muted` (and `muted-foreground`) for a *surface*, and has no `default` text token. Utility `text-muted` would mean different things in the two systems — a direct namespace collision to resolve.
- **`accent` here is the brand jade green** (`--accent #0b7d56`, `:43`). In shadcn conventions `accent` is usually a subtle hover surface, with the brand color under `primary`. Merging themes blindly would recolor either the brand or every hover state.
- The platform's canonical `background`/`foreground`/`primary`/`card`/`border`/`ring` names mostly don't exist here (this system uses `bg`/`surface`/`default`/`border-border`). Legacy aliases already bridge two of them — `--background: var(--bg)`, `--foreground: var(--text)` (`globals.css:144-145`; `tailwind.config.ts:22-23`) — which is the pattern to extend: add alias mappings rather than rename, so both vocabularies resolve during a migration.
- **Recommendation:** port this palette under a namespaced prefix (e.g. `--nx-*` / `nx-` utilities) or adopt it wholesale as the platform's new base, but do **not** silently merge `muted`/`accent`/`default` into an existing shadcn theme — reconcile those three names explicitly first.
