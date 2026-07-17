// Shared route list + viewport config for the QA sweep (Stage 12). One source of truth so the sweep,
// the seed hunts, and any future check agree on what "every route" means.

const ALL_ROUTES = [
  "/",
  "/platform",
  "/solutions/mcos",
  "/solutions/providers",
  "/solutions/facilities",
  "/solutions/members",
  "/about",
  "/contact",
  "/apply",
  "/privacy",
  "/terms",
  "/hipaa",
  "/accessibility",
];

export const ROUTES = process.env.QA_ROUTES ? process.env.QA_ROUTES.split(",").map((s) => s.trim()) : ALL_ROUTES;

// A direct 404 check is part of the sweep.
export const NOT_FOUND = "/this-route-does-not-exist-404";

// Assertion widths. 1920 is a layout-invariant pass (same invariants must still hold).
// QA_VIEWPORTS / QA_ROUTES (comma-separated) narrow the sweep for fast iteration.
export const VIEWPORTS = process.env.QA_VIEWPORTS
  ? process.env.QA_VIEWPORTS.split(",").map((n) => +n.trim())
  : [390, 768, 1440, 1920];

export const BASE = process.env.QA_BASE_URL || "http://localhost:3300";

// STANDING LAW (Stage 16): the sweep runs the FULL CUBE — every route × invariant × ENGINE × PROFILE.
// The harness never certifies a single engine again. QA_ENGINES / QA_PROFILES narrow it for iteration.
export const ENGINES = process.env.QA_ENGINES
  ? process.env.QA_ENGINES.split(",").map((s) => s.trim())
  : ["chromium", "webkit", "firefox"];

// Profiles: "wNNN" = a plain desktop viewport of width NNN (height 900); a bare name resolves to a
// Playwright device descriptor (touch, DPR, mobile UA) in sweep.mjs. Stage 16 requires at minimum an
// iPhone descriptor + one Android descriptor alongside the existing desktop widths. (Firefox does not
// accept isMobile — sweep.mjs strips it for that engine.)
export const PROFILES = process.env.QA_PROFILES
  ? process.env.QA_PROFILES.split(",").map((s) => s.trim())
  : ["w390", "w768", "w1440", "w1920", "iPhone 14", "Pixel 7"];

// The four anchored sections on /platform (seed hunt S2 — #dispatch must never light Oversight).
export const PLATFORM_ANCHORS = ["dispatch", "claims-billing", "compliance", "oversight"];

// Routes that carry a lead form (I13).
export const FORM_ROUTES = ["/apply", "/contact"];
