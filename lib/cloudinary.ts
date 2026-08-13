import "server-only";
import { v2 as cloudinary } from "cloudinary";
import {
  type Manifest,
  MANIFEST_PUBLIC_ID,
  emptyManifest,
  normalizeManifest,
} from "@/lib/manifest";

/**
 * Server-only Cloudinary helper. Holds the API secret and NEVER runs in the
 * browser. Credentials are passed per-call (we never touch the global
 * cloudinary.config()) so a second cloud could be added later without global
 * state; today there is a single primary cloud.
 */

interface Creds {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

function credsFor(): Creds {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  };
}

function hasCreds(c: Creds): boolean {
  return Boolean(c.cloud_name && c.api_key && c.api_secret);
}

function assertCreds(c: Creds): void {
  if (!hasCreds(c)) {
    throw new Error(
      "Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the environment.",
    );
  }
}

/** Deterministic-ish product public id under the collection's folder. */
export function productPublicId(slug: string): string {
  const safe = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `faizal/collections/${safe}/${crypto.randomUUID()}`;
}

/** Sign an upload server-side. The API secret is used but never returned. */
export function signUpload(paramsToSign: Record<string, string>): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  const c = credsFor();
  assertCreds(c);
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ ...paramsToSign, timestamp }, c.api_secret);
  return { signature, timestamp, apiKey: c.api_key, cloudName: c.cloud_name };
}

/** Confirm an uploaded asset exists and return its canonical URL + dimensions. */
export async function getImageResource(
  publicId: string,
): Promise<{ url: string; width?: number; height?: number }> {
  const c = credsFor();
  assertCreds(c);
  const res = (await cloudinary.api.resource(publicId, { ...c, resource_type: "image" })) as {
    secure_url?: string;
    url?: string;
    width?: number;
    height?: number;
  };
  return { url: res.secure_url || res.url || "", width: res.width, height: res.height };
}

/** Delete an image (Admin API — requires the secret, hence server-only). */
export async function destroyImage(publicId: string): Promise<void> {
  const c = credsFor();
  assertCreds(c);
  await cloudinary.uploader.destroy(publicId, { ...c, resource_type: "image", invalidate: true });
}

/**
 * Privileged, always-fresh manifest read for the admin flow. Uses the Admin API
 * to resolve the current versioned URL, then fetches it with no caching. Returns
 * an empty manifest when creds are missing or the file doesn't exist yet.
 */
export async function getManifestFresh(): Promise<Manifest> {
  const c = credsFor();
  if (!hasCreds(c)) return emptyManifest();
  try {
    const meta = (await cloudinary.api.resource(MANIFEST_PUBLIC_ID, {
      ...c,
      resource_type: "raw",
    })) as { secure_url?: string };
    if (!meta.secure_url) return emptyManifest();
    const res = await fetch(meta.secure_url, { cache: "no-store" });
    if (!res.ok) return emptyManifest();
    return normalizeManifest(await res.json());
  } catch {
    return emptyManifest();
  }
}

/** Overwrite the manifest raw asset and purge its CDN copy. */
export async function saveManifest(manifest: Manifest): Promise<void> {
  const c = credsFor();
  assertCreds(c);
  manifest.updatedAt = Date.now();
  const buffer = Buffer.from(JSON.stringify(manifest));
  await new Promise<void>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { ...c, resource_type: "raw", public_id: MANIFEST_PUBLIC_ID, overwrite: true, invalidate: true },
      (error) => (error ? reject(error) : resolve()),
    );
    stream.end(buffer);
  });
}
