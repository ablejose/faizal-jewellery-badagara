import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StoreImage } from "@/components/StoreImage";
import { Button } from "@/components/Button";
import { telHref } from "@/lib/format";

export function VisitStore() {
  return (
    <section id="visit-store" className="py-24 md:py-32">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="Come See Us"
            title="Visit Our Store"
            subtitle="Experience timeless craftsmanship in person."
          />
        </Reveal>

        <Reveal>
          <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="marquee-rtl flex w-max gap-6">
              {[...BRAND.storeImages, ...BRAND.storeImages].map((src, index) => (
                <div key={index} className="w-56 shrink-0 sm:w-64 md:w-72">
                  <StoreImage
                    src={src}
                    alt={`${BRAND.businessName} storefront view ${(index % BRAND.storeImages.length) + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="font-display text-display-m text-ivory">{BRAND.businessName}</h3>
              <p className="mt-3 max-w-md font-sans text-body text-muted">{BRAND.address}</p>
              <p className="mt-2 font-sans text-body text-muted">{BRAND.openingHours}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={BRAND.mapsLink} external variant="secondary">
                Get Directions
              </Button>
              <Button href={telHref(BRAND.phone)} variant="primary">
                Call Now
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
