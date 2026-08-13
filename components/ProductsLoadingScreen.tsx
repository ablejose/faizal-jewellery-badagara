import Image from "next/image";
import { BRAND } from "@/config/brand";

/**
 * Elegant per-page loading overlay for collection pages. Mirrors the site's
 * brand loader (logo + pulsing gold dots) but names the collection being
 * opened. Shown until every product image on the destination page has loaded,
 * so the user never sees partially-loaded imagery. Reduced-motion users get an
 * instant, static overlay via app/globals.css.
 */
export function ProductsLoadingScreen({ name }: { name: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${name}`}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-5 bg-background"
    >
      <Image
        src={BRAND.logo}
        alt={`${BRAND.businessName} logo`}
        width={375}
        height={407}
        className="mb-1 h-auto w-24"
      />
      <span className="px-6 text-center font-display text-display-m text-ivory">{name}</span>
      <span className="mt-1 flex items-center gap-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 animate-bounce rounded-pill bg-gold [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-pill bg-gold [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-pill bg-gold" />
      </span>
    </div>
  );
}
