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

// The four anchored sections on /platform (seed hunt S2 — #dispatch must never light Oversight).
export const PLATFORM_ANCHORS = ["dispatch", "claims-billing", "compliance", "oversight"];

// Routes that carry a lead form (I13).
export const FORM_ROUTES = ["/apply", "/contact"];
