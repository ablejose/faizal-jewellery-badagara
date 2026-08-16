import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { COLLECTIONS } from "@/config/collections";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl(BRAND);
  const now = new Date();

  return [
    { url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/offers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...COLLECTIONS.map((collection) => ({
      url: `${url}/collections/${collection.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
