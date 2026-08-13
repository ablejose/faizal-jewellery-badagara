/**
 * Tiny stateless admin session: an HMAC-SHA256 signed token carrying only an
 * expiry. No session store. Uses Web Crypto (global `crypto`) so it runs in both
 * Node route handlers and the Edge middleware.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesFromB64url(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64urlFromBytes(new Uint8Array(sig));
}

/** Timing-safe string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) {
    // Touch every byte so the fast path doesn't leak length via timing.
    let acc = 0;
    for (let i = 0; i < ab.length; i++) acc |= ab[i];
    return false;
  }
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

export async function createSessionToken(secret: string, ttlMs = 7 * 24 * 60 * 60 * 1000): Promise<string> {
  const payload = b64urlFromBytes(enc.encode(JSON.stringify({ exp: Date.now() + ttlMs })));
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = await hmac(secret, payload);
  if (!safeEqual(sig, expected)) return false;
  try {
    const obj = JSON.parse(dec.decode(bytesFromB64url(payload))) as { exp?: number };
    return typeof obj.exp === "number" && Date.now() < obj.exp;
  } catch {
    return false;
  }
}

/** The cookie name for the admin session. */
export const ADMIN_COOKIE = "genalpha_admin";

/** Resolve the HMAC signing secret from env, with a safe fallback. */
export function sessionSecret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "faizal-jewellery-badagara-fallback-secret";
}
