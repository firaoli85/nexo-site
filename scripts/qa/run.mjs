// qa:sweep orchestrator (Stage 12). Serves the PROD build (.next-check) on :3300 and runs the full
// invariant sweep, then tears the server down. If a server is already answering on the port, it reuses
// it (so you can `npm run build:check && npm run start` in one terminal and sweep from another). Exits
// non-zero if any invariant fails — so it gates a stage report per the nexo-brand regression rule.
import { spawn } from "node:child_process";
import { runSweep, printMatrix } from "./sweep.mjs";
import { checkBuildIdentity, failStale } from "./preflight-build-identity.mjs";
import { checkHostRedirect } from "./i19-host-redirect.mjs";
import { checkNavSeam } from "./i21-nav-seam.mjs";

const PORT = process.env.QA_PORT || "3300";
const DIST = process.env.NEXT_DIST_DIR || ".next-check";
const BASE = `http://localhost:${PORT}`;

async function ready(tries = 90) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(BASE + "/");
      if (r.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

let server = null;
const alreadyUp = await ready(1);
if (!alreadyUp) {
  console.log(`Starting prod server on :${PORT} (NEXT_DIST_DIR=${DIST}) …`);
  server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "start", "-p", PORT], {
    env: { ...process.env, NEXT_DIST_DIR: DIST, PORT },
    stdio: "ignore",
    shell: true,
  });
  if (!(await ready())) {
    console.error("Server did not become ready — did you run `npm run build:check` first?");
    if (server) server.kill();
    process.exit(1);
  }
} else {
  console.log(`Reusing server already answering on :${PORT}.`);
}

// ── STALE-BUILD PREFLIGHT (Task #15, paying the Task #14 debt) ──────────────────────
// Runs for BOTH paths — a server we started and a server we reused. We start ours with the right
// NEXT_DIST_DIR so it should always pass, but checking both means the guard also catches a dist
// dir rebuilt underneath a server we own. The REUSE path is where Task #14 broke.
const identity = await checkBuildIdentity({ base: BASE, dist: DIST });
if (!identity.ok) {
  if (server) {
    if (process.platform === "win32") spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { shell: true, stdio: "ignore" });
    else server.kill("SIGTERM");
  }
  failStale(identity, { port: PORT, dist: DIST });
}
console.log(`Build identity OK — :${PORT} is serving ${DIST} (BUILD_ID ${identity.disk}).`);

// ── I19 HOST REDIRECT (Task #17) ────────────────────────────────────────────────
// The www -> apex 301 is host-conditional, so NO page load in the sweep can reach it:
// the cube addresses localhost by port. This is the raw-request lane the Task #8 spec
// called for. It runs ONCE per sweep (a host rule is global, not per-route) and fails
// the run like any other invariant.
const i19 = await checkHostRedirect({ base: BASE });
console.log(`I19 host redirect: ${i19.pass ? "\u2713" : "\u2717"} ${i19.detail}`);

// I21 NAV SEAM (Task #20, FO-2). Runs ONCE per sweep, like I19, because it needs its own browser
// contexts at four device scale factors and DSF cannot be varied inside an existing cube cell.
// Re-running the 234-cell cube at 4 DSFs to answer a question about ONE element would cost 936
// cells; this is the cheap targeted lane, and it is folded into the same exit code.
const i21 = await checkNavSeam({ base: BASE });
console.log(`I21 nav seam: ${i21.pass ? "✓" : "✗"} ${i21.detail}`);

let failures = 1;
try {
  const out = await runSweep({ base: BASE });
  failures = printMatrix(out);
} finally {
  if (server) {
    if (process.platform === "win32") spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { shell: true, stdio: "ignore" });
    else server.kill("SIGTERM");
  }
}
process.exit(failures === 0 && i19.pass && i21.pass ? 0 : 1);
