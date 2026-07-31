import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { telHref } from "@/lib/format";

export function FinalCta() {
  return (
    <section className="border-y border-border py-28 md:py-36">
      <div className="container-lux flex flex-col items-center gap-10 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-display-l text-ivory">
            Begin your next celebration with us.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="#visit-store" variant="primary">
              Visit Store
            </Button>
            <Button href={telHref(BRAND.phone)} variant="secondary">
              Call Now
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
