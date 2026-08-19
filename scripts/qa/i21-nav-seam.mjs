#!/usr/bin/env node
/**
 * I21 — "THE NAV EDGE EXISTS" (Task #20, the FO-2 receipt).
 *
 * FO-2: the scrolled-nav bottom edge was invisible on the owner's standard laptop even though it
 * shipped at --on-ink-border-strong, the owner's own E2-05 floor. Instruments acquitted all three
 * prime suspects — the edge was PAINTED, armed, at the exact token colour, on chromium/webkit/firefox
 * at DSF 1 / 1.25 / 1.5 / 2, at every scroll position. The defect was PERCEPTUAL POLARITY:
 *
 *   A line is SEEN when it is a LOCAL EXTREMUM — different from the nearest different value on BOTH
 *   sides. Over the ink chapters the edge is a local MAXIMUM and reads (that is the case the F1 bench
 *   fragment tested: it was titled "Nav over ink"). Over LIGHT content the same edge sits
 *   MONOTONICALLY between a dark bar and a bright page, so the eye folds it into the boundary ramp
 *   and reads it as antialiasing. Measured MONOTONIC at all four DSFs. Thickening does not help — a
 *   2px border measured MONOTONIC at all four too, because thickness cannot create an extremum that
 *   polarity denies.
 *
 * So this invariant does NOT assert a colour, a token, or a border width. Any of those can be
 * perfectly correct while the edge is invisible — that is exactly how FO-2 happened. It asserts the
 * only thing that matters: that a painted local extremum EXISTS at the seam, in BOTH registers, at
 * fractional device scale factors.
 *
 * WHY A TARGETED PROBE RATHER THAN CUBE COLUMNS — stated aloud because it is a real tradeoff:
 * the cube is 234 cells; re-running it at four device scale factors would make it 936 to answer a
 * question about ONE element. DSF is also fixed per browser context, so it cannot be varied inside
 * an existing cube cell. This runs once per sweep, like I19, and is folded into the same exit code.
 * The cost is that it only samples the homepage nav; that is where the reported defect lives.
 *
 *   node scripts/qa/i21-nav-seam.mjs              measure (expects a prod server on :3300)
 *   node scripts/qa/i21-nav-seam.mjs --self-test  NEGATIVE TEST: healthy -> sabotaged -> restored
 */
import { chromium } from "playwright";
import { inflateSync } from "node:zlib";

// ── minimal zero-dep PNG decode (8-bit, non-interlaced) — the repo takes no dep for an instrument ──
function decodePNG(buf) {
  let p = 8, w = 0, h = 0, ct = 0; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("ascii", p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); ct = data[9]; }
    else if (type === "IDAT") idat.push(data); else if (type === "IEND") break;
    p += 12 + len;
  }
  const ch = ct === 6 ? 4 : ct === 2 ? 3 : 1;
  const raw = inflateSync(Buffer.concat(idat)), stride = w * ch, out = Buffer.alloc(h * stride);
  let q = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[q++], line = raw.subarray(q, q + stride); q += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev ? prev[x] : 0, c = prev && x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      cur[x] = v & 255;
    }
  }
  return { w, h, ch, data: out };
}
const rowAvg = (img, y) => { let r = 0, g = 0, b = 0; for (let x = 0; x < img.w; x++) { const i = (y * img.w + x) * img.ch; r += img.data[i]; g += img.data[i + 1]; b += img.data[i + 2]; } return [r / img.w, g / img.w, b / img.w]; };
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const Lum = (t) => 0.2126 * lin(t[0]) + 0.7152 * lin(t[1]) + 0.0722 * lin(t[2]);
const cr = (a, b) => { const x = Lum(a), y = Lum(b), h = Math.max(x, y), l = Math.min(x, y); return (h + 0.05) / (l + 0.05); };

/**
 * Is there a painted line here? Collapse equal runs first, THEN look for a run that is a local
 * extremum among runs. Both steps are load-bearing and both were learned the hard way while
 * diagnosing FO-2: comparing the global minimum against the plateaus reports MONOTONIC at a
 * dark-bar/light-page seam (the global minimum IS the bar), and comparing against IMMEDIATE
 * neighbours reports MONOTONIC whenever the edge is thicker than one physical row (at DSF 2 a 1px
 * border is two identical rows, so neither is a STRICT extremum).
 */
function seamStrength(series) {
  const Ls = series.map(Lum);
  const runs = []; let s0 = 0;
  for (let i = 1; i <= Ls.length; i++) {
    if (i === Ls.length || Math.abs(Ls[i] - Ls[s0]) > 0.002) { runs.push({ L: Ls[s0], c: series[s0], n: i - s0 }); s0 = i; }
  }
  let best = null;
  for (let k = 1; k < runs.length - 1; k++) {
    const isMin = runs[k].L < runs[k - 1].L && runs[k].L < runs[k + 1].L;
    const isMax = runs[k].L > runs[k - 1].L && runs[k].L > runs[k + 1].L;
    if (!isMin && !isMax) continue;
    const score = Math.min(cr(runs[k].c, runs[k - 1].c), cr(runs[k].c, runs[k + 1].c));
    if (!best || score > best.score) best = { kind: isMin ? "LOCAL MIN" : "LOCAL MAX", score, px: runs[k].n };
  }
  return best || { kind: "MONOTONIC", score: 0, px: 0 };
}

// FLOOR — the measured worst case on the fixed build was 1.92 (light, DSF 1.25); the failure mode
// scores exactly 0 (no extremum at all). 1.5 sits below the measured worst with room for engine
// jitter while staying unambiguously above "there is no line here".
const FLOOR = 1.5;
const DSFS = [1, 1.25, 1.5, 2];
const WIDTHS = [1440, 390];

export async function checkNavSeam({ base = "http://localhost:3300", sabotage = false } = {}) {
  const browser = await chromium.launch();
  const problems = [], samples = [];
  try {
    for (const dsf of DSFS) {
      for (const width of WIDTHS) {
        const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: dsf });
        const page = await ctx.newPage();
        await page.goto(base + "/", { waitUntil: "networkidle" });
        await page.waitForTimeout(600);
        if (sabotage) await page.addStyleTag({ content: "header.nav-glass{border-bottom-color:transparent !important;box-shadow:none !important}" });

        // Find a scroll position whose content behind/below the nav is LIGHT and one that is INK.
        // scroll-behavior is smooth on this site, so every scroll MUST be behavior:"instant" — an
        // animated scroll leaves the sticky bar mid-flight and the sample lands on a lagged frame.
        const found = {};
        for (const y of [900, 2200, 2600, 3000, 3400, 3800, 4200, 5200, 5800]) {
          await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
          await page.waitForTimeout(150);
          const bg = await page.evaluate(() => {
            let n = document.elementFromPoint(Math.round(window.innerWidth / 2), 80), c = "rgba(0, 0, 0, 0)";
            while (n && c === "rgba(0, 0, 0, 0)") { c = getComputedStyle(n).backgroundColor; n = n.parentElement; }
            return c;
          });
          const m = /(\d+),\s*(\d+),\s*(\d+)/.exec(bg || "");
          if (!m) continue;
          const l = Lum([+m[1], +m[2], +m[3]]);
          if (l < 0.05 && !found.ink) found.ink = y;
          if (l > 0.6 && !found.light) found.light = y;
        }

        for (const [register, y] of Object.entries(found)) {
          await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
          await page.waitForTimeout(320);
          const armed = await page.evaluate(() => {
            const h = document.querySelector("header");
            return { seam: h.className.includes("nav-seam"), bottom: h.getBoundingClientRect().bottom };
          });
          if (!armed.seam) { problems.push(`w${width} DSF${dsf} ${register}: scrolled state not armed (no nav-seam class)`); continue; }
          const x = Math.max(0, Math.round(width / 2) - 50);
          const png = await page.screenshot({ clip: { x, y: Math.round(armed.bottom) - 5, width: Math.min(100, width - x), height: 10 } });
          const img = decodePNG(png);
          const series = []; for (let r = 0; r < img.h; r++) series.push(rowAvg(img, r));
          const s = seamStrength(series);
          samples.push({ width, dsf, register, ...s });
          if (s.score < FLOOR)
            problems.push(`w${width} DSF${dsf} over ${register}: no painted seam — ${s.kind}, strength ${s.score.toFixed(2)} < ${FLOOR}`);
        }
        await ctx.close();
      }
    }
  } finally { await browser.close(); }
  const worst = samples.length ? samples.reduce((a, c) => (c.score < a.score ? c : a)) : null;
  return {
    pass: problems.length === 0 && samples.length > 0,
    detail: problems.length
      ? problems.slice(0, 3).join("; ")
      : `${samples.length}/${samples.length} seams painted across DSF ${DSFS.join("/")} x w${WIDTHS.join("/w")} x light+ink; weakest ${worst.kind} ${worst.score.toFixed(2)} (w${worst.width} DSF${worst.dsf} ${worst.register}), floor ${FLOOR}`,
    samples,
  };
}

if (process.argv[1] && process.argv[1].endsWith("i21-nav-seam.mjs")) {
  const base = process.env.QA_BASE || "http://localhost:3300";
  if (process.argv.includes("--self-test")) {
    // NEGATIVE TEST — an invariant nobody has watched fail is not evidence.
    let bad = 0;
    const expect = async (label, opts, want) => {
      const r = await checkNavSeam({ base, ...opts });
      const ok = r.pass === want; if (!ok) bad++;
      console.log(`${ok ? "OK  " : "BAD "} ${label}\n     pass=${r.pass} ${r.detail}`);
    };
    await expect("healthy build must PASS", {}, true);
    await expect("edge removed must FAIL", { sabotage: true }, false);
    await expect("restored must PASS", {}, true);
    console.log(bad === 0 ? "\nI21 SELF-TEST: all 3 legs behaved as specified." : `\nI21 SELF-TEST: ${bad} leg(s) misbehaved.`);
    process.exit(bad === 0 ? 0 : 1);
  }
  const r = await checkNavSeam({ base });
  console.log(`I21 nav seam: ${r.pass ? "✓" : "✗"} ${r.detail}`);
  process.exit(r.pass ? 0 : 1);
}
