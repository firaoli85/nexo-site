#!/usr/bin/env node
/**
 * STATIC TYPE GUARD — D21's Modular Type Law, made structural.
 *
 * D21: "no component may declare a font family; type flows from the token block only."
 * A law that lives only in a document decays. This makes it fail the build instead.
 *
 * Scans src/ for font-family declarations outside the sanctioned files and exits 1,
 * naming file + line + the offending text. Zero dependencies, no network, no build step.
 *
 * WHY THE EXEMPTIONS ARE WHAT THEY ARE:
 *   - src/app/globals.css   the token block itself. This is where type IS defined.
 *   - src/app/layout.tsx    next/font loading; it emits the --font-*-src variables.
 *   - src/lib/email/**      HTML email CANNOT use CSS custom properties. Mail clients
 *                           strip <style> and ignore var(); every family must be an
 *                           inline literal stack or the mail renders in Times New Roman.
 *                           Hardcoding there is mandatory craft, not a violation.
 *   - src/app/email-preview/**  dev-only preview shell (404 in production) whose whole
 *                           job is rendering those emails faithfully.
 *
 * Run: node scripts/qa/static-type-check.mjs
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";

const SANCTIONED = [
  "src/app/globals.css",
  "src/app/layout.tsx",
  "src/lib/email/",
  "src/app/email-preview/",
];

/** Patterns that constitute "declaring a font family". */
const RULES = [
  { name: "css-font-family", re: /font-family\s*:/i },
  { name: "jsx-fontFamily", re: /\bfontFamily\s*:/ },
  { name: "tailwind-arbitrary-font", re: /\bfont-\[/ },
  { name: "named-family", re: /\b(Bricolage|Hanken|IBM[\s_]?Plex|Inter|Roboto|Helvetica|Arial)\b/i },
  { name: "generic-stack", re: /\b(ui-sans-serif|ui-monospace|ui-serif|system-ui|-apple-system|sans-serif|monospace|serif)\b/ },
];

/** Lines that mention a family only inside a comment are still flagged if they declare;
 *  but a pure prose comment (no declaration) is allowed, so comments are skipped. */
function isComment(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("<!--");
}

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|css)$/.test(e)) out.push(p.split("\\").join("/"));
  }
  return out;
}

const files = walk(ROOT);
const violations = [];

for (const f of files) {
  if (SANCTIONED.some((s) => f === s || f.startsWith(s))) continue;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        violations.push({ file: f, line: i + 1, rule: rule.name, text: line.trim().slice(0, 120) });
        return; // one finding per line is enough to fail it
      }
    }
  });
}

if (violations.length === 0) {
  console.log(`[static-type] OK — ${files.length} files scanned, 0 font-family declarations outside the token block.`);
  process.exit(0);
}

console.error(`[static-type] FAIL — ${violations.length} font-family declaration(s) outside the sanctioned files.`);
console.error(`[static-type] D21 Modular Type Law: type is defined ONLY in src/app/globals.css.`);
console.error("");
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]`);
  console.error(`      ${v.text}`);
}
console.error("");
console.error(`[static-type] Fix: use the Tailwind utilities (font-display / font-sans / font-mono)`);
console.error(`[static-type] which are bound to the globals.css token block. Do not name a family.`);
process.exit(1);
