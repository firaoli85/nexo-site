/**
 * STALE-BUILD PREFLIGHT — pays the Task #14 debt.
 *
 * WHAT WENT WRONG (2026-08-18, Task #14): a `next start` left over from an earlier
 * session was still holding :3300. run.mjs saw the port answering, logged
 * "Reusing server already answering on :3300", and swept a build that no longer
 * existed on disk. Every page rendered COMPLETELY UNSTYLED and 185 cells "failed".
 * The site was fine. Half an hour of cube time was spent proving that.
 *
 * The gotcha was written down in nexo-brand §8 and enforced by nothing. This makes
 * it structural: the sweep refuses to start against a server it cannot identify as
 * serving the build currently on disk.
 *
 * TWO SIGNALS, because each catches something the other misses:
 *
 *   1. BUILD_ID probe (primary). `.next/BUILD_ID` (or the configured dist dir) is
 *      Next's own identity primitive, and it is also a real directory under
 *      static/. Requesting /_next/static/<diskBuildId>/_buildManifest.js asks the
 *      server directly: "are you running THIS build?" One request, no HTML parsing,
 *      nothing to go stale when markup changes. A stale server 404s.
 *
 *   2. CSS-asset probe (secondary). Parse the served HTML for its stylesheet href
 *      and confirm it resolves. This is the exact signature Task #14 hit — the
 *      served HTML referenced hash 667effaa182fb03f (HTTP 400) while disk held
 *      709e3d23b1dd55e6. It catches a torn or partially-overwritten build where
 *      the BUILD_ID directory survived but the assets did not, which signal 1
 *      alone would wave through.
 *
 * Either signal disagreeing is fatal. Better a false stop than another silent
 * 185-cell lie.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {{ base: string, dist: string }} opts
 * @returns {Promise<{ok: true} | {ok: false, reason: string, disk: string, served: string}>}
 */
export async function checkBuildIdentity({ base, dist }) {
  // ── disk identity ──
  const idPath = join(dist, "BUILD_ID");
  if (!existsSync(idPath)) {
    return {
      ok: false,
      reason: `no build on disk: ${idPath} does not exist`,
      disk: "(none)",
      served: "(not checked)",
    };
  }
  const diskId = readFileSync(idPath, "utf8").trim();

  // ── signal 1: does the server serve THIS build's manifest? ──
  const manifestUrl = `${base}/_next/static/${diskId}/_buildManifest.js`;
  let manifestStatus = 0;
  try {
    const r = await fetch(manifestUrl);
    manifestStatus = r.status;
  } catch (e) {
    return {
      ok: false,
      reason: `server unreachable while probing build identity (${String(e.message).slice(0, 60)})`,
      disk: diskId,
      served: "(unreachable)",
    };
  }
  if (manifestStatus !== 200) {
    return {
      ok: false,
      reason: `server does not recognise the build on disk (build-manifest probe returned ${manifestStatus})`,
      disk: diskId,
      served: `a DIFFERENT build (its own BUILD_ID is not ${diskId})`,
    };
  }

  // ── signal 2: does the stylesheet the server advertises actually resolve? ──
  let html = "";
  try {
    const r = await fetch(`${base}/`);
    html = await r.text();
  } catch (e) {
    return { ok: false, reason: `could not fetch / to verify assets (${String(e.message).slice(0, 60)})`, disk: diskId, served: "(unreachable)" };
  }
  const cssMatch = html.match(/\/_next\/static\/css\/[^"']+\.css/);
  if (cssMatch) {
    const cssUrl = base + cssMatch[0];
    let cssStatus = 0;
    try {
      const r = await fetch(cssUrl);
      cssStatus = r.status;
    } catch { cssStatus = 0; }
    if (cssStatus !== 200) {
      return {
        ok: false,
        reason: `the stylesheet the server advertises does not resolve (${cssMatch[0]} -> ${cssStatus}). This is the Task #14 signature: the server is serving HTML from a build whose assets are gone.`,
        disk: diskId,
        served: `HTML referencing ${cssMatch[0]}`,
      };
    }
  }

  return { ok: true, disk: diskId, served: diskId };
}

/** Print the failure and exit 1. Kept here so run.mjs stays readable. */
export function failStale(res, { port, dist }) {
  console.error("");
  console.error("═══════ STALE BUILD — SWEEP REFUSED ═══════");
  console.error(`  ${res.reason}`);
  console.error("");
  console.error(`  build on disk (${dist}/BUILD_ID) : ${res.disk}`);
  console.error(`  what :${port} is serving          : ${res.served}`);
  console.error("");
  console.error(`  FIX: stale server on :${port} — kill it and rerun.`);
  console.error(`       Windows : netstat -ano | grep ":${port}" ; taskkill //PID <pid> //T //F`);
  console.error(`       macOS/Linux : lsof -ti:${port} | xargs kill -9`);
  console.error(`       then: npm run build:check && npm run qa:sweep`);
  console.error("");
  console.error("  WHY THIS EXISTS: a server holding an old build serves HTML whose CSS is gone.");
  console.error("  Every page renders unstyled and the whole cube 'fails'. The site is fine.");
  console.error("  See FIXLOG 2026-08-18 Task #14.");
  console.error("═══════════════════════════════════════════");
  process.exit(1);
}
