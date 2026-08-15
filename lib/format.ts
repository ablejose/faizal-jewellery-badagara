/**
 * Pure, reusable formatting utilities. No brand data lives here.
 */

/** Strip everything but digits (and a leading +) from a phone/WhatsApp value. */
export function toDialable(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/** Build a tel: href from a phone number. */
export function telHref(phone: string): string {
  return `tel:${toDialable(phone)}`;
}

/** Build a wa.me link with an optional prefilled message. */
export function whatsappHref(whatsapp: string, message?: string): string {
  const number = whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Human-readable label for a social URL: strip protocol, "www." and trailing slash. */
export function socialLabel(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

/** Derive an @handle from a profile URL (uses the last path segment). */
export function socialHandle(url: string): string {
  const handle = url.replace(/\/+$/, "").split("/").pop() ?? "";
  return handle ? `@${handle}` : url;
}

/**
 * Return the brand/business name as a single primary line, with no secondary
 * descriptor. The wordmark shows the full name together (e.g. "Gen Alpha")
 * instead of splitting the first word onto its own line.
 */
export function splitBrandName(name: string): { primary: string; secondary: string } {
  return { primary: name.trim(), secondary: "" };
}

/**
 * Format a plain rupee amount with the ₹ symbol and Indian digit grouping.
 * e.g. 25000 -> "₹ 25,000", 185000 -> "₹ 1,85,000".
 */
export function formatRupees(amount: number): string {
  return `₹ ${Math.round(amount).toLocaleString("en-IN")}`;
}

/** Build the route to a collection page from its slug. */
export function collectionHref(slug: string): string {
  return `/collections/${slug}`;
}

/**
 * Human label for an optional product quantity + unit, e.g. "2 carat".
 * Returns "" when neither is set.
 */
export function quantityLabel(quantity?: string, unit?: string): string {
  const q = (quantity ?? "").trim();
  const u = (unit ?? "").trim();
  if (q && u) return `${q} ${u}`;
  return q || u || "";
}
