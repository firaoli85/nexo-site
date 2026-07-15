import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { ROUTE_META } from "@/lib/seo";

// All public routes, absolute APEX URLs, no trailing slash (the root is the bare apex). Paths come
// from the SEO single source so the sitemap can never drift from the pages that actually exist. No
// `lastModified` — we don't fabricate dates (nexo-brand); changeFrequency/priority are honest hints.
export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => (path === "/" ? SITE.domain : `${SITE.domain}${path}`);
  return Object.values(ROUTE_META).map((r) => ({
    url: abs(r.path),
    changeFrequency: "monthly",
    priority: r.path === "/" ? 1 : 0.7,
  }));
}
