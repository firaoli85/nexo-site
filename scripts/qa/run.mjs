// qa:sweep orchestrator (Stage 12). Serves the PROD build (.next-check) on :3300 and runs the full
// invariant sweep, then tears the server down. If a server is already answering on the port, it reuses
// it (so you can `npm run build:check && npm run start` in one terminal and sweep from another). Exits
// non-zero if any invariant fails — so it gates a stage report per the nexo-brand regression rule.
import { spawn } from "node:child_process";
import { runSweep, printMatrix } from "./sweep.mjs";

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
process.exit(failures === 0 ? 0 : 1);
