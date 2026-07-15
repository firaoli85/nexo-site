// PURE lead sanitation + validation helpers (Stage 10S).
//
// Zero imports, zero side effects, no Node/browser/AWS APIs — this module is the ONE place the
// injection-hardening rules live, so both the SES seam (src/lib/mail.ts) and the server action
// (src/app/actions/leads.ts) share the exact same logic, and it can be unit-tested in isolation
// (`node --experimental-strip-types` runs it directly). Keep it pure.

// True for any character we must never let into an email subject/body: CR, LF, tab, every other
// C0 control (<= U+001F), DEL (U+007F), and the C1 controls (U+0080–U+009F). Checked by code point
// (not a regex literal) so no invisible control byte ever lives in this source file.
function isControlOrSpace(code: number): boolean {
  return code <= 0x1f || (code >= 0x7f && code <= 0x9f) || code === 0x20;
}

// Strip control chars from a single field VALUE, collapse any whitespace/control run to ONE space,
// and trim the ends. This is the injection guard: it stops a submitter from smuggling header-like
// lines or fake sections into a subject or a plain-text body. EVERY value that reaches an email
// (subject or body) MUST pass through here.
export function clean(value: string): string {
  let out = "";
  let pendingSpace = false;
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (isControlOrSpace(code)) {
      pendingSpace = out.length > 0; // never leads with a space; collapses runs
    } else {
      if (pendingSpace) out += " ";
      pendingSpace = false;
      out += ch;
    }
  }
  return out;
}

// Deliberately conservative email shape check — no external validator, no ReDoS-prone pattern.
// One `@`, non-empty local part, a dotted domain, no whitespace. Real deliverability is proven by
// the actual SES send, not by regex.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  const v = value.trim();
  return v.length > 0 && v.length <= 254 && EMAIL_RE.test(v);
}

// Build the notification subject from the SANITIZED name only, with a hard length cap so a hostile
// name can never blow out or wrap the subject line. `tag` is a fixed literal, never user input.
const SUBJECT_MAX = 160;
const NAME_IN_SUBJECT_MAX = 120;

export function buildSubject(tag: "Apply" | "Contact", name: string): string {
  const who = clean(name).slice(0, NAME_IN_SUBJECT_MAX) || "(no name)";
  return `[${tag}] ${who}`.slice(0, SUBJECT_MAX);
}

// Keep only values that are in the allow-list (drops anything a tampered client sent). Order and
// de-duplication follow the allow-list, not the submission.
export function whitelist(
  values: readonly string[],
  allowed: readonly string[],
): string[] {
  const sent = new Set(values);
  return allowed.filter((a) => sent.has(a));
}
