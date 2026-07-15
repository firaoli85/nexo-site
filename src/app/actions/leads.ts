"use server";

// THE SINGLE LEAD ACTION (Stage 10S). Runs server-side only. Applies every protection, then hands a
// sanitized payload to the SES seam. Returns a typed LeadState the client renders — never throws to
// the client, never leaks vendor error detail.

import { headers } from "next/headers";
import { SITE } from "@/lib/site";
import {
  type LeadKind,
  type LeadState,
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  FIELDS,
  LABELS,
  LIMITS,
  SERVICE_LEVELS,
  SERVICE_LEVEL_VALUES,
  CONTACT_ROLES,
  CONTACT_ROLE_VALUES,
} from "@/lib/leads";
import { isEmail, whitelist } from "@/lib/leadSanitize";
import { sendLeadEmails, type LeadField } from "@/lib/mail";

// --- friendly, detail-free failure messages ------------------------------------------------------
const MSG = {
  tooFast: "That came through a little too fast. Please take a moment and try again.",
  throttled:
    "We’ve received several submissions from your network. Please try again in a little while.",
  unavailable: `Our submission system is temporarily unavailable. Please email us directly at ${SITE.email}.`,
} as const;

// --- min-elapsed-time trap ----------------------------------------------------------------------
const MIN_ELAPSED_MS = 3000;

// --- rate limiting (in-memory) ------------------------------------------------------------------
// TWO layers, because the per-IP key can be spoofed (see clientIp):
//   1) per-IP window limit — slows a single client
//   2) GLOBAL per-instance window cap — a spoof-PROOF backstop: rotating X-Forwarded-For gets a fresh
//      IP bucket every request, but every request still counts against the global cap. This bounds the
//      auto-ack reflection/abuse surface even when the IP key is untrustworthy.
// HONEST CAVEAT: serverless runs many isolated instances and recycles them, so BOTH counters are
// per-instance and best-effort — they do NOT enforce a cross-instance global limit. A durable limiter
// would need shared storage, which this database-free site intentionally lacks.
const THROTTLE_MAX = 5; // per IP / hour
const GLOBAL_MAX = 100; // per instance / hour — the spoof-proof backstop
const THROTTLE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_KEYS = 10_000; // hard cap on the IP map so spoofed-IP floods can't grow memory unbounded
const hits = new Map<string, number[]>();
let globalHits: number[] = [];

function prune(times: number[], now: number): number[] {
  return times.filter((t) => now - t < THROTTLE_WINDOW_MS);
}

function isThrottled(ip: string): boolean {
  const now = Date.now();
  // Global backstop first (cannot be bypassed by IP rotation).
  globalHits = prune(globalHits, now);
  globalHits.push(now);
  if (globalHits.length > GLOBAL_MAX) return true;
  // Bound memory: when the map gets large, evict keys whose window has fully elapsed; if still large,
  // clear it (a blunt reset is acceptable under an active spoofed-IP flood).
  if (hits.size > MAX_KEYS) {
    hits.forEach((arr, k) => {
      if (prune(arr, now).length === 0) hits.delete(k);
    });
    if (hits.size > MAX_KEYS) hits.clear();
  }
  const recent = prune(hits.get(ip) ?? [], now);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > THROTTLE_MAX;
}

// Trusted-proxy note: prefer the edge's real-client-IP header (set by the platform proxy, NOT
// appendable by the client). Fall back to the first X-Forwarded-For hop. On a self-managed proxy that
// does not overwrite XFF, the leftmost token is client-spoofable — which is exactly why the GLOBAL cap
// above exists. Pin the trusted-proxy boundary at deploy (see DEPLOY-NOTES).
function clientIp(): string {
  const h = headers();
  const real = h.get("x-real-ip");
  if (real && real.trim()) return real.trim();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim() || "unknown";
  return "unknown";
}

// --- small field helpers ------------------------------------------------------------------------
function field(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function required(errors: Record<string, string>, key: string, value: string, label: string) {
  if (!value) errors[key] = `${label} is required.`;
}
function capped(errors: Record<string, string>, key: string, value: string, max: number, label: string) {
  if (value.length > max) errors[key] = `${label} is too long (max ${max} characters).`;
}

// --- per-kind validation → { errors, payload fields } -------------------------------------------
type Validated = { errors: Record<string, string>; name: string; email: string; fields: LeadField[] };

function validateProvider(fd: FormData): Validated {
  const errors: Record<string, string> = {};
  const name = field(fd, FIELDS.name);
  const company = field(fd, FIELDS.company);
  const email = field(fd, FIELDS.email);
  const phone = field(fd, FIELDS.phone);
  const city = field(fd, FIELDS.city);
  const notes = field(fd, FIELDS.notes);
  const levels = whitelist(fd.getAll(FIELDS.serviceLevels).map(String), SERVICE_LEVEL_VALUES);

  required(errors, FIELDS.name, name, LABELS.contactName);
  capped(errors, FIELDS.name, name, LIMITS.name, LABELS.contactName);
  required(errors, FIELDS.company, company, LABELS.company);
  capped(errors, FIELDS.company, company, LIMITS.company, LABELS.company);
  required(errors, FIELDS.email, email, LABELS.email);
  if (email && !isEmail(email)) errors[FIELDS.email] = "Please enter a valid email address.";
  capped(errors, FIELDS.email, email, LIMITS.email, LABELS.email);
  capped(errors, FIELDS.phone, phone, LIMITS.phone, LABELS.phone);
  required(errors, FIELDS.city, city, LABELS.city);
  capped(errors, FIELDS.city, city, LIMITS.city, LABELS.city);
  capped(errors, FIELDS.notes, notes, LIMITS.notes, LABELS.notes);

  const levelLabels = SERVICE_LEVELS.filter((s) => levels.includes(s.value)).map((s) => s.label);
  const fields: LeadField[] = [
    { label: LABELS.contactName, value: name },
    { label: LABELS.company, value: company },
    { label: LABELS.email, value: email },
    { label: LABELS.phone, value: phone },
    { label: LABELS.city, value: city },
    { label: LABELS.serviceLevels, value: levelLabels.join(", ") },
    { label: LABELS.notes, value: notes },
  ];
  return { errors, name, email, fields };
}

function validateContact(fd: FormData): Validated {
  const errors: Record<string, string> = {};
  const name = field(fd, FIELDS.name);
  const organization = field(fd, FIELDS.organization);
  const email = field(fd, FIELDS.email);
  const role = field(fd, FIELDS.role);
  const message = field(fd, FIELDS.message);

  required(errors, FIELDS.name, name, LABELS.name);
  capped(errors, FIELDS.name, name, LIMITS.name, LABELS.name);
  capped(errors, FIELDS.organization, organization, LIMITS.company, LABELS.organization);
  required(errors, FIELDS.email, email, LABELS.email);
  if (email && !isEmail(email)) errors[FIELDS.email] = "Please enter a valid email address.";
  capped(errors, FIELDS.email, email, LIMITS.email, LABELS.email);
  if (role && !(CONTACT_ROLE_VALUES as readonly string[]).includes(role))
    errors[FIELDS.role] = "Please choose one of the listed options.";
  required(errors, FIELDS.message, message, LABELS.message);
  capped(errors, FIELDS.message, message, LIMITS.message, LABELS.message);

  const roleLabel = CONTACT_ROLES.find((r) => r.value === role)?.label ?? "";
  const fields: LeadField[] = [
    { label: LABELS.name, value: name },
    { label: LABELS.organization, value: organization },
    { label: LABELS.email, value: email },
    { label: LABELS.role, value: roleLabel },
    { label: LABELS.message, value: message },
  ];
  return { errors, name, email, fields };
}

// --- the action ---------------------------------------------------------------------------------
export async function submitLead(kind: LeadKind, formData: FormData): Promise<LeadState> {
  // kind is client-supplied → validate against the whitelist.
  if (kind !== "provider" && kind !== "contact") return { ok: false, formError: MSG.unavailable };

  // 1. HONEYPOT — a filled hidden field means a bot. Silently "succeed" (send nothing) so we never
  //    reveal the trap.
  if (field(formData, HONEYPOT_FIELD) !== "") return { ok: true };

  // 2. MIN-ELAPSED-TIME — a submit under ~3s is a bot; reject. FAIL CLOSED: a missing/empty/zero/garbled
  //    timestamp (e.g. a direct POST that never ran the client) must be rejected too. NOTE: Number("")
  //    is 0 (finite!), so we check the RAW string is present and the value is a positive epoch.
  const rawTs = field(formData, TIMESTAMP_FIELD);
  const loadedAt = Number(rawTs);
  if (rawTs === "" || !Number.isFinite(loadedAt) || loadedAt <= 0 || Date.now() - loadedAt < MIN_ELAPSED_MS) {
    return { ok: false, formError: MSG.tooFast };
  }

  // 3. THROTTLE — per-IP, best-effort (see caveat above).
  if (isThrottled(clientIp())) return { ok: false, formError: MSG.throttled };

  // 4. VALIDATE (dependency-free) — required fields, email shape, length caps, service-level allow-list.
  const v = kind === "provider" ? validateProvider(formData) : validateContact(formData);
  if (Object.keys(v.errors).length > 0) return { ok: false, fieldErrors: v.errors };

  // 5. SEND. The notification is the system of record; its result is the form's result.
  const sourcePage = kind === "provider" ? "/apply" : "/contact";
  const result = await sendLeadEmails({
    kind,
    name: v.name,
    email: v.email,
    fields: v.fields,
    sourcePage,
    submittedAt: new Date().toISOString(),
  });

  if (result.ok) return { ok: true };
  // Both "unavailable" (no env) and "send_failed" map to the same friendly banner — no detail leak.
  return { ok: false, formError: MSG.unavailable };
}
