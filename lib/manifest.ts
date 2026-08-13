/**
 * The content "database" is a single JSON manifest stored on Cloudinary as a
 * `raw` asset at a fixed public id. This module holds the manifest types plus a
 * PUBLIC read (no secret) used by the public site. Server-only writes and
 * privileged fresh reads live in lib/cloudinary.ts.
 */

export interface ManifestProduct {
  /** Cloudinary public_id — stable id / React key. */
  publicId: string;
  /** Delivery URL. */
  url: string;
  width?: number;
  height?: number;
  name: string;
  /** Price in INR. */
  price: number;
  createdAt: number;
}

export interface ManifestCollection {
  products: ManifestProduct[];
}

export interface Manifest {
  updatedAt: number;
  /** Keyed by collection slug (matches config/collections.ts). */
  collections: Record<string, ManifestCollection>;
}

/** Fixed public id of the manifest raw asset on the primary Cloudinary cloud. */
export const MANIFEST_PUBLIC_ID = "faizal/data/manifest";

export function emptyManifest(): Manifest {
  return { updatedAt: 0, collections: {} };
}

/** Coerce arbitrary JSON into a valid Manifest, dropping malformed entries. */
export function normalizeManifest(raw: unknown): Manifest {
  const obj = (raw ?? {}) as { updatedAt?: unknown; collections?: unknown };
  const collections: Record<string, ManifestCollection> = {};
  const src = obj.collections && typeof obj.collections === "object" ? (obj.collections as Record<string, unknown>) : {};

  for (const [slug, value] of Object.entries(src)) {
    const list = (value as { products?: unknown })?.products;
    const products = Array.isArray(list) ? list : [];
    collections[slug] = {
      products: products
        .filter(
          (p): p is Record<string, unknown> =>
            !!p && typeof (p as { publicId?: unknown }).publicId === "string" && typeof (p as { url?: unknown }).url === "string",
        )
        .map((p) => ({
          publicId: String(p.publicId),
          url: String(p.url),
          width: Number(p.width) || undefined,
          height: Number(p.height) || undefined,
          name: typeof p.name === "string" ? p.name : "",
          price: Number(p.price) || 0,
          createdAt: Number(p.createdAt) || 0,
        })),
    };
  }

  return { updatedAt: Number(obj.updatedAt) || 0, collections };
}

/** Primary Cloudinary cloud name (server env, with a sensible default). */
export function primaryCloudName(): string {
  return (
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "cfg3wh0j"
  );
}

/**
 * PUBLIC read of the manifest via the deterministic `raw` delivery URL — no API
 * secret required. Cached by the Next data cache and tagged "manifest" so admin
 * writes can invalidate it with revalidateTag("manifest"). Returns an empty
 * manifest on any error so the site falls back to config placeholders.
 */
export async function getPublicManifest(): Promise<Manifest> {
  const url = `https://res.cloudinary.com/${primaryCloudName()}/raw/upload/${MANIFEST_PUBLIC_ID}`;
  try {
    const res = await fetch(url, { next: { tags: ["manifest"] } });
    if (!res.ok) return emptyManifest();
    return normalizeManifest(await res.json());
  } catch {
    return emptyManifest();
  }
}

/** Convenience: products for one collection slug from a manifest. */
export function productsForSlug(manifest: Manifest, slug: string): ManifestProduct[] {
  return manifest.collections[slug]?.products ?? [];
}
