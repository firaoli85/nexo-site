import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Allow all crawlers; point them at the sitemap. Apex host is canonical.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain,
  };
}
