import { BRAND } from "@/config/brand";
import { Button } from "@/components/Button";
import { splitBrandName, telHref } from "@/lib/format";

export function Hero() {
  const { primary, secondary } = splitBrandName(BRAND.businessName);

  return (
    <section id="top" className="relative flex h-svh min-h-[640px] w-full items-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container-lux relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-display-xl text-gold-sweep">{primary}</h1>
          {secondary ? (
            <p className="mt-3 label-eyebrow">{secondary}</p>
          ) : null}
          <p className="mt-6 font-sans text-body-lg text-gold">{BRAND.tagline}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#visit-store">Visit Store</Button>
            <Button href={telHref(BRAND.phone)} variant="secondary">
              Call Now
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <span className="flex flex-col items-center gap-2 text-muted" aria-hidden="true">
          <span className="text-caption uppercase tracking-[0.2em]">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gold/60" />
        </span>
      </div>
    </section>
  );
}
