/** @type {import('next').NextConfig} */
const nextConfig = {
  // Verification builds (`npm run build:check`) set NEXT_DIST_DIR=.next-check so they never
  // share the `.next` a running dev server / `next start` holds (see nexo-brand §8 gotcha).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Emit a self-contained server (+ minimal node_modules) at <distDir>/standalone for container
  // images — the Dockerfile's run stage copies it and runs `node server.js`.
  output: "standalone",

  // www -> apex, 301. The Task #8 spec is law here: statusCode 301 EXPLICITLY, not
  // `permanent: true` (which emits 308). Google treats them alike, but 301 is what every
  // doc and DNS note in this repo says, and a silent 308 would make the record wrong.
  // Path and query are preserved by :path*.
  //
  // WHY AT ALL, given the P1-C1 reading came back green: rel=canonical is a HINT Google may
  // override, and it is emitted per-route from seo.ts where a future edit could silently drop
  // it. A host 301 removes the discretion and cannot be lost by a copy change. Durability,
  // not rescue (SEO_PLAN section 2.3).
  //
  // NOTE: these host literals are the FIRST outside src/lib/site.ts:15 — next.config.mjs is
  // .mjs and cannot import the TS constant. Deliberate, documented duplication.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nexoaccess.com" }],
        destination: "https://nexoaccess.com/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
