#!/usr/bin/env node
/**
 * STATIC MOTION GUARD — the motion-safe architecture, made structural (Task #28, D12).
 *
 * THE LAW IT ENFORCES. nexo-brand §5: "Everything interruptible; reduced-motion = instant."
 * Until Task #28 that was implemented the other way round — motion was declared in the base rules
 * and then PATCHED OFF by a `prefers-reduced-motion: reduce` block full of !important overrides.
 * That works right up until someone adds a transition and forgets the override, and nothing in the
 * build would ever say so. The accessible rendering was a SUBTRACTION from the animated one, held
 * together by review discipline.
 *
 * The architecture is now inverted: the base IS the static, final composition, and motion is
 * ADDITIVE, declared only inside a sanctioned motion-allowed scope. This guard is what makes that
 * inversion permanent instead of aspirational — it is the difference between a convention and a
 * rule. D12 requires a test for any class of mistake that cost real time; the class here is
 * "motion that a reduced-motion user cannot escape", and this is that test.
 *
 * WHAT COUNTS AS A SANCTIONED SCOPE
 *   1. `@media (prefers-reduced-motion: no-preference)` — the explicit motion scope in globals.css.
 *   2. A `[data-*-live]` ARMED-ATTRIBUTE selector. These attributes are set by client code that
 *      early-returns on `matchMedia("(prefers-reduced-motion: reduce)").matches`, so the selector
 *      cannot match at all for a reduced-motion user. Verified arming sites:
 *        RouteOverlay.tsx      `if (!reduce) region.setAttribute("data-spine-live", "")`
 *        TerminusReveal.tsx / AssistScene.tsx / MapObserver.tsx / ProofBand.tsx
 *                              each returns early on the same query before arming.
 *      NOTE the distinction that matters: Radix's `data-state`, and the components' own
 *      `data-active` / `data-level` / `data-leg` / `data-direction`, are set REGARDLESS of the
 *      motion preference. They are state attributes, not motion gates, and they do NOT sanction a
 *      motion declaration. Getting this backwards is the easy mistake here.
 *   3. In TSX, Tailwind's `motion-safe:` variant, which compiles to exactly the media query in (1).
 *
 * WHAT IS DELIBERATELY NOT FLAGGED
 *   - `@keyframes` bodies and definitions. A keyframes block is INERT: it describes an animation
 *     but starts nothing. Motion begins only when an `animation`/`animation-name` declaration
 *     references it, and every such declaration IS checked. Banning the definition would force
 *     pointless duplication inside the media block and buy no safety.
 *   - `duration-*`, `ease-*`, `will-change-*` Tailwind utilities. Inert without a transition-property
 *     or animation-name on the same element, and that only exists under `motion-safe:` now.
 *   - `transition-none`. It REMOVES a transition; guarding it would re-enable one for reduced-motion
 *     users, which is the exact inversion of the point.
 *
 * SANCTIONED FILES (same set and same reason as the type and hex guards)
 *   - src/lib/email/**         HTML email cannot rely on CSS custom properties or media-query
 *                              support; mail clients strip <style>. Those surfaces are static and
 *                              hand-inlined by necessity, and they animate nothing.
 *   - src/app/email-preview/** dev-only preview shell (404 in production) that renders those emails.
 *
 * Run: node scripts/qa/static-motion-check.mjs
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";
const SANCTIONED = ["src/lib/email/", "src/app/email-preview/"];

const MOTION_PROP =
  /^(animation|animation-name|animation-duration|animation-delay|animation-iteration-count|animation-fill-mode|animation-timing-function|animation-play-state|transition|transition-property|transition-duration|transition-delay|transition-timing-function|will-change|scroll-behavior)$/;

const ARMED = /\[data-[a-z-]+-live\]/;
const NO_PREF = /prefers-reduced-motion\s*:\s*no-preference/;

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

/**
 * CSS: a real character-level walk. Whether a declaration is guarded is a question about its
 * ANCESTORS, so line-oriented matching cannot answer it — a `transition` two lines below a media
 * query may or may not be inside it. Comments are blanked (length preserved) so that neither a
 * commented-out rule nor a `{` inside prose can move the parser.
 */
function scanCss(file, text) {
  let src = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      const stop = end < 0 ? text.length : end + 2;
      for (let k = i; k < stop; k++) src += text[k] === "\n" ? "\n" : " ";
      i = stop - 1;
    } else src += text[i];
  }

  const out = [];
  const stack = [];
  let head = "", decl = "", declStart = 0, declHasContent = false, line = 1;
  const lineAt = new Array(src.length);
  for (let i = 0, l = 1; i < src.length; i++) { lineAt[i] = l; if (src[i] === "\n") l++; }

  const flush = () => {
    const d = decl.trim(); decl = ""; declHasContent = false;
    if (!d) return;
    const c = d.indexOf(":"); if (c < 0) return;
    const prop = d.slice(0, c).trim();
    if (!MOTION_PROP.test(prop)) return;
    const chain = stack.map((s) => s.head);
    if (chain.some((h) => h.startsWith("@keyframes"))) return;      // inert by definition
    if (chain.some((h) => NO_PREF.test(h))) return;                 // sanctioned scope (1)
    if (ARMED.test(chain.join(" "))) return;                        // sanctioned scope (2)
    const sel = [...chain].reverse().find((h) => !h.startsWith("@")) || "(top level)";
    out.push({
      file, line: lineAt[declStart] || 1, rule: "unguarded-motion",
      match: prop, text: `${sel} { ${d.slice(0, 90)} }`,
    });
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") { stack.push({ head: head.replace(/\s+/g, " ").trim() }); head = ""; decl = ""; declHasContent = false; }
    else if (ch === "}") { flush(); stack.pop(); head = ""; decl = ""; declHasContent = false; }
    else if (ch === ";") { flush(); head = ""; }
    else {
      if (!declHasContent && !/\s/.test(ch)) { declStart = i; declHasContent = true; }
      head += ch; decl += ch;
    }
  }
  return out;
}

/**
 * TSX: only inside string literals. A bare `transition` in code is a variable or a prop name
 * (framer-motion used one), not a class, and flagging it would train people to ignore this guard.
 */
const STRING = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
const UTIL = /(?<![\w-])((?:[a-z][a-z0-9-]*:)*)(transition(?:-[a-z]+)?|animate-[a-z0-9-]+)(?![\w-])/g;

function scanTsx(file, text) {
  const out = [];
  text.split("\n").forEach((lineText, idx) => {
    const t = lineText.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
    for (const lit of lineText.match(STRING) || []) {
      for (const m of lit.matchAll(UTIL)) {
        const variants = m[1] || "", util = m[2];
        if (variants.includes("motion-safe:")) continue;
        if (util === "transition-none") continue;
        out.push({
          file, line: idx + 1, rule: "unguarded-motion-utility",
          match: `${variants}${util}`, text: t.slice(0, 110),
        });
      }
    }
  });
  return out;
}

const files = walk(ROOT);
const violations = [];
let scanned = 0;

for (const f of files) {
  if (SANCTIONED.some((s) => f === s || f.startsWith(s))) continue;
  scanned++;
  const text = readFileSync(f, "utf8");
  violations.push(...(f.endsWith(".css") ? scanCss(f, text) : scanTsx(f, text)));
}

if (violations.length === 0) {
  console.log(`[static-motion] OK — ${scanned} files scanned, 0 motion declarations outside a motion-safe scope.`);
  process.exit(0);
}

console.error(`[static-motion] FAIL — ${violations.length} motion declaration(s) outside a sanctioned motion-safe scope.`);
console.error(`[static-motion] nexo-brand §5: reduced-motion is instant, and that is STRUCTURAL now, not a review item.`);
console.error("");
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.match}`);
  console.error(`      ${v.text}`);
}
console.error("");
console.error(`[static-motion] Fix, in order of preference:`);
console.error(`[static-motion]   CSS  — move the declaration into the motion scope at the end of globals.css`);
console.error(`[static-motion]          (@media (prefers-reduced-motion: no-preference)), leaving the base rule`);
console.error(`[static-motion]          as the complete STATIC composition.`);
console.error(`[static-motion]   TSX  — prefix the utility with Tailwind's motion-safe: variant.`);
console.error(`[static-motion]   Either — scope the rule under a [data-*-live] attribute whose arming code`);
console.error(`[static-motion]          early-returns on prefers-reduced-motion. Radix data-state and the`);
console.error(`[static-motion]          components' data-active/data-level/data-leg do NOT count: they are set`);
console.error(`[static-motion]          regardless of the motion preference.`);
console.error(`[static-motion] Whatever you choose, the element must still render its FINAL state with the`);
console.error(`[static-motion] motion scope removed entirely. That is the static-complete doctrine.`);
process.exit(1);
