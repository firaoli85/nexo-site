// THE EMAIL CHROME (transactional email base layout). PURE + framework-free: no React, no next/*, no
// server APIs — safe to import from the "use server" mail seam, the dev-only preview route, and the
// tsx test-send script alike. Defensive email craft: table-based, 600px, ALL styles inlined, zero
// images (immune to image blocking + dark-mode logo inversion), font-stack fallback (clients don't
// load webfonts), color-scheme meta so clients don't force-invert us blindly.
//
// COPY LAWS (enforced by grep in verification): zero em-dashes (U+2014) and zero en-dashes (U+2013)
// anywhere in rendered output. Plain punctuation only. No PHI placeholders or examples anywhere.

// ── emailBrand: the SINGLE source for every brand value in email ─────────────────────────────────
// Change the brand once, here. Hex values MIRROR the site's design tokens in src/app/globals.css
// (:root) so email and site share one palette source — email cannot read CSS custom properties, so
// the literals are inlined here with their token of origin cited. Keep in sync with globals.css.
export const emailBrand = {
  // wordmark is TEXT, two spans (no image): "Nexo" in ink weight-700, "Access" in jade.
  wordmarkInk: "Nexo",
  wordmarkJade: "Access",
  name: "Nexo Access",
  // exact footer descriptor (owner-approved; note "Non-emergency" uses a hyphen, not a dash).
  descriptor: "Non-emergency medical transportation (NEMT) management company",
  phoneDisplay: "(202) 409-2970", // SITE.phone.display
  phoneHref: "tel:+12024092970", // SITE.phone.e164
  siteLabel: "nexoaccess.com",
  siteUrl: "https://nexoaccess.com", // SITE.domain
  fontStack: "'Hanken Grotesk', -apple-system, 'Segoe UI', Arial, sans-serif",
  colors: {
    page: "#eef1f4", //          soft gray page background (a step grayer than site --bg so the white card lifts)
    card: "#ffffff", //          --surface  (content card)
    ink: "#0b1512", //           --ink      (wordmark "Nexo", headings) — deliberately not pure #000
    text: "#0c1512", //          --text     (primary body text)
    muted: "#42544c", //         --text-muted  (secondary body, footer) — 7.78:1 on white
    subtle: "#4b5c53", //        --text-subtle (fine print)              — 6.86:1 on white
    jade: "#0b7d56", //          --accent   (wordmark "Access", buttons, links) — 5.1:1 on white
    jadeHover: "#0a6b49", //     --accent-hover (button border, so it never vanishes under inversion)
    jadeTint: "#e8f8f1", //      --accent-subtle (vault-box fill)
    border: "#ebedf1", //        --border   (card + divider edges)
  },
} as const;

const C = emailBrand.colors;
const FONT = emailBrand.fontStack;

// ── HTML-escaping (submitted values become HTML in the staff notification) ───────────────────────
// Text-node context. Ampersand FIRST. Also strip nothing else — length caps + validation happen
// upstream; this is purely injection-safety for values we render into markup.
export function escapeHtml(v: string): string {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
// Attribute context (href values): escape quotes + angle brackets + ampersand.
export function escapeAttr(v: string): string {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── bulletproof button: a PADDED TABLE CELL, solid jade bg, white text, 1px darker-jade border ────
// The border guarantees it stays visible even when a client (Gmail/Apple dark mode) inverts the fill.
// bgcolor attribute + inline background-color covers Outlook's Word engine. target=_blank + rel.
export function button(label: string, url: string): string {
  // Outlook ignores margin:auto, so an align="center" outer cell does the centering; the inner cell is
  // the padded, bordered jade button. Top padding gives it breathing room from the copy above.
  return `                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td align="center" style="padding:10px 0 4px 0;">
                        <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                          <tr>
                            <td align="center" bgcolor="${C.jade}" style="background-color:${C.jade}; border:1px solid ${C.jadeHover}; border-radius:8px; padding:13px 26px;">
                              <a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; font-family:${FONT}; font-size:16px; line-height:20px; font-weight:600; color:#ffffff; text-decoration:none;">${escapeHtml(label)}</a>
                            </td>
                          </tr>
                        </table>
                      </td></tr>
                    </table>`;
}

// ── the ONE base layout wrapping any body: header wordmark, content card, footer ─────────────────
export function emailChrome(opts: { preheader: string; receivingReason: string; bodyHtml: string }): string {
  const { preheader, receivingReason, bodyHtml } = opts;
  return `<!doctype html>
<html lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="x-ua-compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(emailBrand.name)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <style>table,td,div,p,a,span{font-family:Arial,'Segoe UI',sans-serif !important;}</style>
  <![endif]-->
  <style>
    body{margin:0;padding:0;width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table{border-collapse:collapse;}
    a{color:${C.jade};}
    @media only screen and (max-width:620px){
      .container{width:100% !important;}
      .pad{padding-left:22px !important;padding-right:22px !important;}
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${C.page}; color:${C.text}; font-family:${FONT};">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:${C.page};">${escapeHtml(preheader)}&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; margin:0 auto;">
          <!-- header wordmark (text, no image) -->
          <tr>
            <td class="pad" style="padding:4px 32px 18px 32px; font-family:${FONT};">
              <span style="font-size:23px; font-weight:700; letter-spacing:-0.3px; color:${C.ink};">${emailBrand.wordmarkInk}</span><span style="font-size:23px; font-weight:700; letter-spacing:-0.3px; color:${C.jade};">${emailBrand.wordmarkJade}</span>
            </td>
          </tr>
          <!-- content card: white, thin jade top border, soft edge -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.card}; border:1px solid ${C.border}; border-top:3px solid ${C.jade}; border-radius:12px;">
                <tr>
                  <td class="pad" style="padding:34px 32px 30px 32px; font-family:${FONT}; color:${C.text};">
${bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- footer -->
          <tr>
            <td class="pad" style="padding:22px 32px 8px 32px; font-family:${FONT};">
              <p style="margin:0 0 3px 0; font-size:13px; font-weight:600; color:${C.muted};">${escapeHtml(emailBrand.name)}</p>
              <p style="margin:0 0 8px 0; font-size:13px; line-height:19px; color:${C.subtle};">${escapeHtml(emailBrand.descriptor)}</p>
              <p style="margin:0 0 8px 0; font-size:13px; line-height:19px; color:${C.subtle};">
                <a href="${emailBrand.phoneHref}" style="color:${C.muted}; text-decoration:none;">${escapeHtml(emailBrand.phoneDisplay)}</a>
                &nbsp;&#183;&nbsp;
                <a href="${emailBrand.siteUrl}" target="_blank" rel="noopener noreferrer" style="color:${C.jade}; text-decoration:none;">${escapeHtml(emailBrand.siteLabel)}</a>
              </p>
              <p style="margin:0; font-size:12px; line-height:18px; color:${C.subtle};">${escapeHtml(receivingReason)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── plain-text chrome (deliverability requires a text/plain alternative for every template) ──────
export function textFooter(receivingReason: string): string {
  return [
    emailBrand.name,
    emailBrand.descriptor,
    emailBrand.phoneDisplay,
    emailBrand.siteLabel,
    "",
    receivingReason,
  ].join("\n");
}

export function renderText(opts: { body: string; receivingReason: string }): string {
  return `${opts.body}\n\n----\n${textFooter(opts.receivingReason)}\n`;
}

// ── small HTML body helpers (shared type + spacing so every template reads as one system) ────────
export function h1(text: string): string {
  return `                    <h1 style="margin:0 0 14px 0; font-family:${FONT}; font-size:21px; line-height:28px; font-weight:700; color:${C.ink};">${escapeHtml(text)}</h1>`;
}
export function paragraph(text: string): string {
  return `                    <p style="margin:0 0 16px 0; font-family:${FONT}; font-size:16px; line-height:25px; color:${C.text};">${escapeHtml(text)}</p>`;
}
export function mutedParagraph(text: string): string {
  return `                    <p style="margin:0 0 4px 0; font-family:${FONT}; font-size:14px; line-height:22px; color:${C.muted};">${escapeHtml(text)}</p>`;
}
