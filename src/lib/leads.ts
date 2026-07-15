// SHARED lead-form contract (Stage 10S).
//
// Pure data + types imported by BOTH the client forms and the server action, so field names,
// option whitelists, and length caps can never drift between the two sides of the boundary. No
// "use server"/"use client" marker, no secrets, no Node/browser APIs — safe on either side.

export type LeadKind = "provider" | "contact";

// What the server action returns to the client:
//   ok:true            → show the success panel (move focus, announce via aria-live)
//   ok:false + fields  → render inline field errors (aria-describedby), focus the first one
//   ok:false + form    → render the friendly banner (temporarily unavailable / too fast / throttled)
export type LeadState =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

// Hidden anti-bot fields. `HONEYPOT_FIELD` is an off-screen input a human never sees but a naive bot
// fills; `TIMESTAMP_FIELD` carries the client-side form-render time for the min-elapsed-time trap.
export const HONEYPOT_FIELD = "website";
export const TIMESTAMP_FIELD = "loaded_at";

// Real field names — one source of truth for <input name> and formData.get().
export const FIELDS = {
  name: "name",
  company: "company",
  email: "email",
  phone: "phone",
  city: "city",
  serviceLevels: "serviceLevels",
  notes: "notes",
  organization: "organization",
  role: "role",
  message: "message",
} as const;

// Service levels a provider can offer. The 4th is the ASSIST MODIFIER, never a 4th service level
// (nexo-brand §7.1) — it is labeled as an add-on, not leveled with the three.
export const SERVICE_LEVELS = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
  { value: "assist", label: "Bariatric / two-person assist" },
] as const;

// "I am a…" options on /contact (Stage 13). "provider" surfaces an inline nudge toward /apply, but the
// contact message stays fully sendable.
export const CONTACT_ROLES = [
  { value: "mco", label: "MCO / payer" },
  { value: "provider", label: "Transport provider" },
  { value: "hospital", label: "Hospital / health system" },
  { value: "facility", label: "Facility (dialysis, clinic, day program)" },
  { value: "case-manager", label: "Case manager / caseworker" },
  { value: "member", label: "Member or family member" },
  { value: "other", label: "Other" },
] as const;

export const SERVICE_LEVEL_VALUES = SERVICE_LEVELS.map((s) => s.value);
export const CONTACT_ROLE_VALUES = CONTACT_ROLES.map((r) => r.value);

// Length caps (characters). Enforced server-side; the client mirrors them as maxLength for courtesy.
export const LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  phone: 40,
  city: 120,
  role: 40,
  notes: 2000,
  message: 4000,
} as const;

// Labels used in the notification email body + the visible <label> text (kept together so the two
// never disagree about what a field is called).
export const LABELS = {
  contactName: "Contact name",
  company: "Company",
  email: "Email",
  phone: "Phone",
  city: "Base city & state",
  serviceLevels: "Service levels",
  notes: "Anything else",
  name: "Name",
  organization: "Organization",
  role: "I am a",
  message: "Message",
} as const;
