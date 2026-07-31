import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";

export function BrandIntro() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container-lux grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-8">
          <Reveal>
            <span className="label-eyebrow">Our Heritage</span>
            <h2 className="mt-4 font-display text-display-l text-ivory">
              Craftsmanship you can wear for a lifetime.
            </h2>
            <p className="mt-6 max-w-2xl font-sans text-body-lg text-muted">
              {BRAND.description}
            </p>
            <p className="mt-4 max-w-2xl font-sans text-body text-muted">
              Every piece is chosen for its balance of beauty and lightness — refined designs in
              gold, diamonds and silver, offered as per your occasion, and made to accompany the
              moments that matter most.
            </p>
          </Reveal>
        </div>
        <div className="hidden md:col-span-4 md:flex md:items-center md:justify-end">
          <div className="h-40 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
