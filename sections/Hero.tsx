import { BRAND } from "@/config/brand";
import { Button } from "@/components/Button";
import { splitBrandName, telHref } from "@/lib/format";

/**
 * Hero (redesigned): the film is no longer full-screen. It fills a band of
 * roughly half the viewport height, with the brand name, description and CTAs
 * overlaid neatly within that band.
 *
 * Fully responsive: the band keeps a sensible min-height on small screens and a
 * max-height on very tall ones so the video never dominates the fold. The long
 * description is hidden on the smallest screens and clamped elsewhere so the
 * copy always fits inside the shorter hero.
 */
export function Hero() {
  const { primary } = splitBrandName(BRAND.businessName);

  return (
    <section
      id="top"
      className="relative flex h-[52svh] min-h-[420px] max-h-[640px] w-full items-center overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={BRAND.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* Legibility overlays over the film. */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container-lux relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-title text-display-m font-medium uppercase tracking-[0.2em] text-gold-sweep">
            {primary}
          </h1>
          <p className="mt-4 max-w-xl font-sans text-body-lg text-gold">{BRAND.tagline}</p>
          <p className="mt-3 line-clamp-2 max-w-xl font-sans text-body text-muted max-sm:hidden">
            {BRAND.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="#collections">Explore Collections</Button>
            <Button href="/offers" className="animate-pop" ariaLabel="View current offers">
              <span className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82Z" />
                  <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                Offers
              </span>
            </Button>
            <Button href={telHref(BRAND.phone)} variant="secondary">
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
