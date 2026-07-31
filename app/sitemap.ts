import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl(BRAND);
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
