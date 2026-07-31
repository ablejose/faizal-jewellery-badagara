import { BRAND } from "@/config/brand";
import { telHref, whatsappHref } from "@/lib/format";

const QUICK_LINKS = [
  { label: "About", href: "#about" },
  { label: "Visit Store", href: "#visit-store" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-16">
      <div className="container-lux grid grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-ivory">{BRAND.businessName}</p>
          <p className="mt-3 max-w-xs font-sans text-body text-muted">{BRAND.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="font-sans text-caption uppercase tracking-[0.14em] text-muted">Quick Links</p>
          <ul className="mt-4 flex flex-col gap-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-body text-ivory transition-colors duration-300 hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-sans text-caption uppercase tracking-[0.14em] text-muted">Contact</p>
          <ul className="mt-4 flex flex-col gap-3 font-sans text-body text-ivory">
            <li>
              <a href={telHref(BRAND.phone)} className="transition-colors duration-300 hover:text-gold">
                {BRAND.phone}
              </a>
            </li>
            <li className="max-w-xs text-muted">{BRAND.address}</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer"
              aria-label={`${BRAND.businessName} on Instagram`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer"
              aria-label={`${BRAND.businessName} on Facebook`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7.02h2.36l.35-2.74h-2.71V9.49c0-.79.22-1.33 1.35-1.33h1.44V5.71a19.3 19.3 0 0 0-2.1-.11c-2.08 0-3.5 1.27-3.5 3.6v2.01H8.32v2.74h2.36V21h2.82Z" />
              </svg>
            </a>
            <a href={whatsappHref(BRAND.phone, BRAND.whatsappMessage)} target="_blank" rel="noopener noreferrer"
              aria-label={`${BRAND.businessName} on WhatsApp`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.892a11.821 11.821 0 00-3.484-8.463z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container-lux mt-12 border-t border-border pt-8">
        <p className="font-sans text-caption text-muted">
          © {year} {BRAND.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
