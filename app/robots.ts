import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl(BRAND);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
