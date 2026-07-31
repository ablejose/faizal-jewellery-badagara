import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { telHref, whatsappHref, socialHandle, socialLabel } from "@/lib/format";

interface Row {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export function Contact() {
  const rows: Row[] = [
    { label: "Business", value: BRAND.businessName },
    { label: "Phone", value: BRAND.phone, href: telHref(BRAND.phone) },
    {
      label: "WhatsApp",
      value: BRAND.phone,
      href: whatsappHref(BRAND.phone, BRAND.whatsappMessage),
      external: true,
    },
    { label: "Email", value: BRAND.email, href: BRAND.email ? `mailto:${BRAND.email}` : undefined },
    { label: "Instagram", value: socialHandle(BRAND.instagram), href: BRAND.instagram, external: true },
    { label: "Facebook", value: socialLabel(BRAND.facebook), href: BRAND.facebook, external: true },
    { label: "Opening Hours", value: BRAND.openingHours },
    { label: "Address", value: BRAND.address },
  ].filter((row) => row.value.trim().length > 0);

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container-lux max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="Get In Touch" title="Contact" align="left" />

          <dl className="mt-10 divide-y divide-border border-t border-border">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                <dt className="w-40 shrink-0 font-sans text-caption uppercase tracking-[0.14em] text-muted">
                  {row.label}
                </dt>
                <dd className="font-sans text-body text-ivory">
                  {row.href ? (
                    <a
                      href={row.href}
                      {...(row.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="transition-colors duration-300 hover:text-gold"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={telHref(BRAND.phone)} variant="primary" className="w-full sm:w-auto">
              Call {BRAND.businessName}
            </Button>
            <Button
              href={whatsappHref(BRAND.whatsapp, BRAND.whatsappMessage)}
              external
              variant="secondary"
              className="w-full sm:w-auto"
            >
              WhatsApp Us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
