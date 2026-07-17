/** @type {import('next').NextConfig} */
const nextConfig = {
  // Verification builds (`npm run build:check`) set NEXT_DIST_DIR=.next-check so they never
  // share the `.next` a running dev server / `next start` holds (see nexo-brand §8 gotcha).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Emit a self-contained server (+ minimal node_modules) at <distDir>/standalone for container
  // images — the Dockerfile's run stage copies it and runs `node server.js`.
  output: "standalone",
};

export default nextConfig;
