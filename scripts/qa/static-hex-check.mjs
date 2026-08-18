#!/usr/bin/env node
/**
 * STATIC HEX GUARD — the token law, made structural. Closes DISC-20.
 *
 * nexo-brand §0: "Zero hardcoded hex/rgb in components. Colors come through
 * tokens/Tailwind utilities only." That rule has been repo law since Stage 1 and has
 * been enforced only by review. DISC-20 deferred the guard until hardening thresholds
 * existed, because a guard written before the palette settled would have frozen values
 * that were still moving. D23 set the thresholds, so the deferral condition is met.
 *
 * WHY THIS MATTERS MORE AFTER D23 THAN BEFORE: hardening only works if the token block
 * is genuinely the single source. One inlined #ebedf1 in a component is a hairline that
 * silently keeps the OLD, pre-hardening value forever — invisible on the machine that
 * ships it and invisible on the machine that reads it, because nobody re-greps a value
 * they already "fixed". This makes that failure a build error instead.
 *
 * WHY THE EXEMPTIONS ARE WHAT THEY ARE (same set as the type guard, same reason):
 *   - src/app/globals.css       the token block itself. This is where colour IS defined.
 *   - src/lib/email/**          HTML email CANNOT use CSS custom properties. Mail clients
 *                               strip <style> and ignore var(); every colour must be an
 *                               inline literal or the mail renders unstyled. Hardcoding
 *                               there is mandatory craft, not a violation. `emailBrand.colors`
 *                               deliberately MIRRORS the globals.css tokens by hand — when a
 *                               token changes, that mirror is updated by hand too.
 *   - src/app/email-preview/**  dev-only preview shell (404 in production) whose whole job
 *                               is rendering those emails faithfully.
 * No other file needed an exemption: the sweep at the time of writing found hex literals
 * in exactly these two places and nowhere else.
 *
 * Run: node scripts/qa/static-hex-check.mjs
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";

const SANCTIONED = ["src/app/globals.css", "src/lib/email/", "src/app/email-preview/"];

const RULES = [
  {
    name: "hex-literal",
    // 3/4/6/8 hex digits, not followed by another word char, so route anchors
    // (#dispatch), ids and template placeholders are not mistaken for colours.
    re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/,
  },
  {
    name: "literal-rgb-hsl",
    // rgb()/hsl() with literal channels. A var()-driven form is the SANCTIONED way to
    // compose a token with alpha, so it must not be flagged.
    re: /\b(?:rgba?|hsla?)\s*\((?![^)]*var\()[^)]*\d[^)]*\)/,
  },
];

/** Comments are documentation, not declarations — a comment recording "was #fafbfc" is
 *  exactly the provenance this repo wants. Same policy as the type guard. */
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
let scanned = 0;

for (const f of files) {
  if (SANCTIONED.some((s) => f === s || f.startsWith(s))) continue;
  scanned++;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const rule of RULES) {
      const m = line.match(rule.re);
      if (m) {
        violations.push({ file: f, line: i + 1, rule: rule.name, match: m[0], text: line.trim().slice(0, 120) });
        return;
      }
    }
  });
}

if (violations.length === 0) {
  console.log(`[static-hex] OK — ${scanned} files scanned, 0 colour literals outside the token block.`);
  process.exit(0);
}

console.error(`[static-hex] FAIL — ${violations.length} hardcoded colour literal(s) outside the sanctioned files.`);
console.error(`[static-hex] nexo-brand §0: colour is defined ONLY in src/app/globals.css.`);
console.error("");
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.match}`);
  console.error(`      ${v.text}`);
}
console.error("");
console.error(`[static-hex] Fix: add a token in globals.css, map it in tailwind.config.ts, and use`);
console.error(`[static-hex] the utility (bg-*/text-*/border-*) or var(--token). Never inline a value.`);
process.exit(1);
