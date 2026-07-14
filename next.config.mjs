/** @type {import('next').NextConfig} */
const nextConfig = {
  // Verification builds (`npm run build:check`) set NEXT_DIST_DIR=.next-check so they never
  // share the `.next` a running dev server / `next start` holds (see nexo-brand §8 gotcha).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
