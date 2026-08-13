"use client";

/**
 * Client-side upload helpers for the admin panel.
 *
 * Flow: compress the image to WebP in the browser, ask our server to sign the
 * upload, then send the bytes DIRECTLY to Cloudinary (never through our server).
 */

async function compressToWebp(file: File): Promise<Blob> {
  // Leave vector/animated formats and non-images alone.
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const maxDim = 2400;
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

interface SignResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  publicId: string;
}

export interface UploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
}

/** JSON fetch helper for our own /api/admin/* routes. Throws on non-2xx. */
export async function apiJson<T = unknown>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (HTTP ${res.status}).`);
  }
  return data as T;
}

/** Compress, get a signature from our server, then upload straight to Cloudinary. */
export async function signAndUpload(slug: string, file: File): Promise<UploadResult> {
  const prepared = await compressToWebp(file);
  const sign = await apiJson<SignResponse>("/api/admin/sign-upload", "POST", { slug });

  const form = new FormData();
  form.append("file", prepared, prepared instanceof File ? prepared.name : "upload.webp");
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("public_id", sign.publicId);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${text.slice(0, 200) || res.status}`);
  }
  const data = (await res.json()) as { public_id: string; secure_url: string; width?: number; height?: number };
  return { publicId: data.public_id, url: data.secure_url, width: data.width, height: data.height };
}
