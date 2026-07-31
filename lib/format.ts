export function toDialable(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function telHref(phone: string): string {
  return `tel:${toDialable(phone)}`;
}

export function whatsappHref(whatsapp: string, message?: string): string {
  const number = whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function socialLabel(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

export function socialHandle(url: string): string {
  const handle = url.replace(/\/+$/, "").split("/").pop() ?? "";
  return handle ? `@${handle}` : url;
}

export function splitBrandName(name: string): { primary: string; secondary: string } {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  const letterCount = trimmed.replace(/\s+/g, "").length;

  if (words.length > 1 && letterCount > 7) {
    return { primary: words[0], secondary: words.slice(1).join(" ") };
  }

  return { primary: trimmed, secondary: "" };
}
