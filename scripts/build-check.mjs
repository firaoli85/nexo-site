// Verification build into a SEPARATE dist dir (.next-check) so it never touches the `.next`
// a running dev server / `next start` holds — the two must never share .next (nexo-brand §8).
// Invoked by `npm run build:check`.
import { spawnSync } from "node:child_process";

const res = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-check" },
});

process.exit(res.status ?? 1);
