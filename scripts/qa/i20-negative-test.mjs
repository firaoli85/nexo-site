#!/usr/bin/env node
/**
 * I20 NEGATIVE TEST — proof that the invariant can actually fail.
 *
 * An invariant nobody has watched fail is not evidence: a check that silently passes on a broken
 * page is worse than no check, because it launders the breakage as verified. This drives the REAL
 * checkVanRidesLine() (imported, not reimplemented) against deliberately broken page states and
 * asserts it reports the RIGHT failure, then confirms it goes green again.
 *
 * Not part of the cube: it needs a running server and it deliberately breaks the page, so it runs
 * by hand when I20 or RouteOverlay geometry changes.
 *   node scripts/qa/i20-negative-test.mjs        (expects a prod server on :3300, or set QA_BASE)
 *
 * NOTE on leg 2b: sabotaging the svg via the DOM only sticks with ResizeObserver stubbed out —
 * with the observer live it re-measures on the host width change and React re-renders the svg back
 * to correct pixel sizing. That self-heal IS the Task #19 fix working, and it is why the sabotage
 * needs the observer removed to be observable at all.
 */import { chromium } from "playwright";
import { checkVanRidesLine } from "./sweep.mjs";
const B = process.env.QA_BASE || "http://localhost:3300";

const b = await chromium.launch();
let bad = 0;
const expect = (label, res, wantPass) => {
  const ok = res.pass === wantPass;
  if (!ok) bad++;
  console.log(`${ok ? "OK  " : "BAD "} ${label}\n     pass=${res.pass} detail=${res.detail || "(none)"}`);
};

// 1. HEALTHY
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  expect("healthy build must PASS", await checkVanRidesLine(page, "/", 1440), true);
  await ctx.close();
}

// 2a. VAN DISPLACED — the plain "van is not on the line" case, testing the delta assertion and
// the 1.0px tolerance directly.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.evaluate(() => { document.querySelector(".route-van").style.translate = "40px 0"; });
  expect("van displaced 40px must FAIL", await checkVanRidesLine(page, "/", 1440), false);
  await ctx.close();
}

// 2b. DIVERGENCE RE-BROKEN — the pre-fix svg sizing restored. NOTE: this only sticks with the
// ResizeObserver stubbed out, because with it live the observer RE-MEASURES on the host width
// change and React re-renders the svg back to its correct pixel sizing. That self-heal is the fix
// working, and it is why the sabotage needs the observer removed to be observable at all.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const svg = document.querySelector(".route-overlay svg");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.width = "100%"; svg.style.height = "100%";
    const host = document.querySelector(".route-overlay").offsetParent;
    host.style.width = (host.getBoundingClientRect().width - 200) + "px";
  });
  await page.waitForTimeout(400);
  const r = await checkVanRidesLine(page, "/", 1440);
  expect("pre-fix svg sizing must FAIL", r, false);
  if (!/CTM is not identity/.test(r.detail || "")) { console.log("     ^ expected the CTM message; got: " + r.detail); bad++; }
  await ctx.close();
}
// 3. REFLOW RE-MEASURE DISABLED — FO-1 mode 2, reproduced by removing the observer entirely.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  });
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  expect("reflow re-measure disabled must FAIL", await checkVanRidesLine(page, "/", 1440), false);
  await ctx.close();
}

// 4. RESTORED (fresh page, nothing stubbed) — must be green again.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  expect("restored must PASS", await checkVanRidesLine(page, "/", 1440), true);
  await ctx.close();
}

// 5. DELIBERATE-ABSENCE SKIPS must be passes, not failures.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  expect("sub-lg (van absent by design) must PASS", await checkVanRidesLine(page, "/", 390), true);
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  expect("reduced-motion (van hidden by design) must PASS", await checkVanRidesLine(page, "/", 1440), true);
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(B + "/platform", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  expect("interior route (zero van nodes) must PASS", await checkVanRidesLine(page, "/platform", 1440), true);
  await ctx.close();
}

await b.close();
console.log(bad === 0 ? "\nNEGATIVE TEST: all 7 legs behaved as specified." : `\nNEGATIVE TEST: ${bad} leg(s) misbehaved.`);
process.exit(bad === 0 ? 0 : 1);
