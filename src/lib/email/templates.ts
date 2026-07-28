// TRANSACTIONAL EMAIL TEMPLATES (Nexo Access). Five typed body builders, each returning a complete
// { subject, html, text } wrapped in the shared chrome. PURE + framework-free (see chrome.ts): the
// "use server" mail seam, the dev-only /email-preview route, and the tsx test-send script all import
// these. A text/plain part is REQUIRED for every template (deliverability + accessibility).
//
// COPY LAWS: zero em-dashes (U+2014) / en-dashes (U+2013) anywhere (grep-verified); plain punctuation;
// no PHI placeholders or examples. If an absolute time is ever rendered, format it on a 12-HOUR clock.
import { LABELS } from "@/lib/leads";
import type { LeadKind } from "@/lib/leads";
import {
  emailBrand,
  emailChrome,
  button,
  escapeHtml,
  renderText,
  h1,
  paragraph,
  mutedParagraph,
} from "./chrome";

export type EmailContent = { subject: string; html: string; text: string };
export type EmailField = { label: string; value: string };

const C = emailBrand.colors;
const FONT = emailBrand.fontStack;

// ── 1. visitorAck ────────────────────────────────────────────────────────────────────────────────
// The approved acknowledgment copy (Stage 10S), reused VERBATIM and restyled into the chrome. The
// greeting is intentionally NAME-FREE: the ack is delivered to a submitter-CONTROLLED address, so it
// must never reflect submitter-supplied text (anti-abuse law; see mail.ts). `name` is accepted for
// call-site symmetry and is deliberately NOT rendered.
export function visitorAck(name: string, kind: LeadKind = "contact"): EmailContent {
  void name;
  const whatNext =
    kind === "provider"
      ? "We’ll review your details and follow up about running trips with us."
      : "We’ll read your note and follow up about your program.";
  const subject =
    kind === "provider" ? "Nexo Access: we received your application" : "Nexo Access: we received your message";
  const receivingReason = "You are receiving this email because you contacted Nexo Access.";

  const bodyLines = [
    "Thanks for reaching out to Nexo Access. We’ve received your message.",
    whatNext,
    "If you need to add anything, just reply to this email.",
  ];
  const bodyHtml = [
    paragraph("Hello,"),
    ...bodyLines.map(paragraph),
    `                    <p style="margin:22px 0 0 0; font-family:${FONT}; font-size:16px; line-height:25px; color:${C.text};">The Nexo Access team</p>`,
  ].join("\n");

  const text = renderText({
    body: ["Hello,", "", ...bodyLines, "", "The Nexo Access team"].join("\n"),
    receivingReason,
  });
  return { subject, html: emailChrome({ preheader: bodyLines[0], receivingReason, bodyHtml }), text };
}

// ── 2. staffNotification ──────────────────────────────────────────────────────────────────────────
// Internal alert to the monitored inbox. A labeled detail table (values ESCAPED) + one Reply button
// that opens a mail composer to the submitter. Subject carries NO submitter text (no header-injection
// surface); the submitter address is read from the fields for the Reply link.
export function staffNotification(kind: LeadKind, fields: ReadonlyArray<EmailField>): EmailContent {
  const isProvider = kind === "provider";
  const subject = isProvider
    ? "New provider application via nexoaccess.com"
    : "New contact message via nexoaccess.com";
  const heading = isProvider ? "New provider application" : "New contact message";
  const receivingReason = "You are receiving this email because a form was submitted on the Nexo Access website.";
  const submitterEmail = (fields.find((f) => f.label === LABELS.email)?.value ?? "").trim();

  const rows = fields
    .map((f) => {
      const val = (f.value ?? "").trim();
      const valCell = val
        ? escapeHtml(val).replace(/\r?\n/g, "<br>")
        : `<span style="color:${C.subtle};">(not provided)</span>`;
      return `                      <tr>
                        <th scope="row" style="padding:10px 16px 10px 0; vertical-align:top; text-align:left; font-family:${FONT}; font-size:13px; line-height:20px; font-weight:600; color:${C.subtle}; white-space:nowrap; border-bottom:1px solid ${C.border};">${escapeHtml(f.label)}</th>
                        <td style="padding:10px 0; vertical-align:top; font-family:${FONT}; font-size:15px; line-height:23px; color:${C.text}; border-bottom:1px solid ${C.border};">${valCell}</td>
                      </tr>`;
    })
    .join("\n");

  const bodyHtml = [
    h1(heading),
    paragraph("A form was submitted on the Nexo Access website. The details are below."),
    `                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:6px 0 4px 0;">
                      <tbody>
${rows}
                      </tbody>
                    </table>`,
    submitterEmail ? button("Reply to sender", `mailto:${submitterEmail}`) : "",
  ]
    .filter(Boolean)
    .join("\n");

  const textRows = fields.map((f) => `${f.label}: ${(f.value ?? "").trim() || "(not provided)"}`);
  const text = renderText({
    body: [
      heading + ".",
      "",
      "A form was submitted on the Nexo Access website.",
      "",
      ...textRows,
      ...(submitterEmail ? ["", `Reply to sender: ${submitterEmail}`] : []),
    ].join("\n"),
    receivingReason,
  });
  return { subject, html: emailChrome({ preheader: `${heading} on nexoaccess.com`, receivingReason, bodyHtml }), text };
}

// ── 3. notificationShell ──────────────────────────────────────────────────────────────────────────
// PHI-SAFE BY CONSTRUCTION. This shell renders EXACTLY the neutral strings it is given (a title, a
// one-line message, a button label) plus one link. It performs NO interpolation of member, health,
// appointment, or trip data, and has no access to any: there is literally no code path here that can
// surface protected health information. Callers MUST pass only neutral, non-PHI strings. (NO-PHI LAW.)
export function notificationShell(
  title: string,
  message: string,
  ctaLabel: string,
  ctaUrl: string,
): EmailContent {
  const receivingReason = "You are receiving this email because of activity on your Nexo Access account.";
  const bodyHtml = [h1(title), paragraph(message), button(ctaLabel, ctaUrl)].join("\n");
  const text = renderText({ body: `${title}\n\n${message}\n\n${ctaLabel}: ${ctaUrl}`, receivingReason });
  return { subject: title, html: emailChrome({ preheader: message, receivingReason, bodyHtml }), text };
}

// ── 4. securityCode (the vault treatment) ──────────────────────────────────────────────────────────
export function securityCode(code: string, expiresMinutes: number): EmailContent {
  const subject = "Your Nexo Access verification code";
  const receivingReason =
    "You are receiving this email because a verification code was requested for your Nexo Access account.";
  // Relative time only (no absolute time to format). If an absolute expiry is ever shown, use a
  // 12-hour clock (COPY LAWS).
  const expiryLine = `This code expires in ${expiresMinutes} minutes.`;
  const safety =
    "If you did not request this code, you can ignore this email. Never share this code with anyone.";

  // The vault: centered, large monospace, wide letter-spacing, jade-tinted fill + jade border. The
  // asymmetric horizontal padding (left > right) compensates for the trailing letter-spacing so the
  // digits sit optically centered in the box.
  const vault = `                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td align="center" style="padding:8px 0 22px 0;">
                        <div style="font-family:'Courier New', Consolas, 'Liberation Mono', monospace; font-size:34px; line-height:44px; font-weight:700; letter-spacing:9px; color:${C.ink}; background-color:${C.jadeTint}; border:1px solid ${C.jade}; border-radius:10px; padding:20px 18px 20px 27px; text-align:center;">${escapeHtml(code)}</div>
                      </td></tr>
                    </table>`;

  const bodyHtml = [
    h1("Your verification code"),
    paragraph("Enter this code to continue."),
    vault,
    mutedParagraph(expiryLine),
    mutedParagraph(safety),
  ].join("\n");

  const text = renderText({
    body: ["Your Nexo Access verification code:", "", code, "", expiryLine, "", safety].join("\n"),
    receivingReason,
  });
  return {
    subject,
    html: emailChrome({ preheader: `Your code expires in ${expiresMinutes} minutes.`, receivingReason, bodyHtml }),
    text,
  };
}

// ── 5. invitationAction ─────────────────────────────────────────────────────────────────────────
// `context` is a two-sentence neutral string supplied by the caller; `expiresText` is caller-provided
// (if it contains an absolute time, the caller must format it on a 12-HOUR clock; COPY LAWS).
export function invitationAction(
  context: string,
  ctaLabel: string,
  ctaUrl: string,
  expiresText: string,
): EmailContent {
  const subject = "You have been invited to Nexo Access";
  const receivingReason = "You are receiving this email because you were invited to Nexo Access.";
  const bodyHtml = [
    h1("You have been invited"),
    paragraph(context),
    button(ctaLabel, ctaUrl),
    `                    <p style="margin:16px 0 0 0; text-align:center; font-family:${FONT}; font-size:13px; line-height:20px; color:${C.subtle};">${escapeHtml(expiresText)}</p>`,
  ].join("\n");
  const text = renderText({
    body: `You have been invited to Nexo Access.\n\n${context}\n\n${ctaLabel}: ${ctaUrl}\n\n${expiresText}`,
    receivingReason,
  });
  return { subject, html: emailChrome({ preheader: context, receivingReason, bodyHtml }), text };
}
