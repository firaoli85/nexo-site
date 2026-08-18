/**
 * I19 — HOST REDIRECT: www -> apex, 301, path and query preserved.
 *
 * The redirect ships with its test (D12). Task #8 specified this as "the raw-request
 * lane", and building it proved WHY that wording was necessary:
 *
 *   `fetch()` CANNOT DO THIS. `Host` is a forbidden header in the fetch spec, so undici
 *   silently drops it and the request arrives as `Host: localhost:3300` — which does not
 *   match the rule, returns 200, and looks exactly like a broken redirect. The first
 *   version of this file used fetch and reported a false failure against a redirect that
 *   was working correctly. Use node:http, which lets you set Host explicitly.
 *
 * WHAT THIS PROVES AND WHAT IT CANNOT — stated here, not buried in a report:
 *   PROVES: the compiled rule exists in the running server, matches on the www Host
 *   header, answers 301 (not 308), rewrites to the apex origin, and preserves path and
 *   query. Also that the apex Host does NOT redirect (no loop). That is the whole of
 *   what next.config.mjs contributes.
 *   CANNOT PROVE: that DNS points www at this app, or that the Coolify/Traefik proxy
 *   forwards Host unmodified in production. Those are deployment facts. Only a real
 *   request to https://www.nexoaccess.com settles them, and that check is recorded as
 *   owed at the v2 deploy.
 */
import http from "node:http";

const CASES = [
  { path: "/", expect: "https://nexoaccess.com" }, // :path* matches empty at root -> slashless, which is also this repo's canonical form (sitemap + rel=canonical both omit it)
  { path: "/platform", expect: "https://nexoaccess.com/platform" },
  { path: "/solutions/providers?utm_source=x&a=1", expect: "https://nexoaccess.com/solutions/providers?utm_source=x&a=1" },
];

/** Raw request with a real Host header. Resolves headers only; body is discarded. */
function rawGet({ port, hostname, path, hostHeader }) {
  return new Promise((resolve) => {
    const req = http.request(
      { host: hostname, port, path, method: "GET", headers: { Host: hostHeader }, timeout: 10000 },
      (res) => {
        res.resume(); // drain
        resolve({ status: res.statusCode, location: res.headers.location || "" });
      }
    );
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, location: "", err: "timeout" }); });
    req.on("error", (e) => resolve({ status: 0, location: "", err: String(e.message).slice(0, 60) }));
    req.end();
  });
}

/**
 * @param {{ base: string, host?: string, expectStatus?: number }} opts
 */
export async function checkHostRedirect({ base, host = "www.nexoaccess.com", expectStatus = 301 }) {
  const u = new URL(base);
  const port = u.port || (u.protocol === "https:" ? 443 : 80);
  const results = [];

  for (const c of CASES) {
    const r = await rawGet({ port, hostname: u.hostname, path: c.path, hostHeader: host });
    results.push({
      path: c.path,
      status: r.status,
      location: r.location,
      expected: c.expect,
      expectStatus,
      ok: r.status === expectStatus && r.location === c.expect,
      err: r.err || "",
    });
  }

  // Control: the apex Host must NOT redirect. Without this a rule matching everything
  // would pass the cases above and ship an infinite loop.
  const apex = await rawGet({ port, hostname: u.hostname, path: "/platform", hostHeader: "nexoaccess.com" });
  const apexOk = apex.status === 200;
  results.push({
    path: "/platform (Host: apex, control)",
    status: apex.status,
    location: apex.location,
    expected: "200, no redirect",
    expectStatus: 200,
    ok: apexOk,
    err: apex.err || "",
  });

  const bad = results.filter((r) => !r.ok);
  return {
    pass: bad.length === 0,
    detail: bad.length
      ? bad
          .map((b) => `${b.path} -> ${b.status}${b.err ? " " + b.err : ""} ${b.location || "(no Location)"} (want ${b.expectStatus} ${b.expected})`)
          .join(" | ")
      : `${results.length}/${results.length}: 301 to apex with path+query preserved, apex host unaffected`,
    results,
  };
}
