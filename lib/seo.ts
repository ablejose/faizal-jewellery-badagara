import type { BrandConfig } from "@/types/brand";

export function getSiteUrl(brand: BrandConfig): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? brand.seo.canonical).replace(
    /\/$/,
    "",
  );
}

export function buildJsonLd(brand: BrandConfig): Record<string, unknown>[] {
  const url = getSiteUrl(brand);
  const sameAs = [brand.instagram, brand.facebook, brand.youtube].filter(
    (v): v is string => Boolean(v),
  );

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.businessName,
    url,
    logo: `${url}${brand.logo}`,
    sameAs,
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: brand.businessName,
    image: brand.storeImages,
    url,
    telephone: brand.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address,
      addressLocality: brand.city,
      addressRegion: brand.state,
      postalCode: brand.pincode,
      addressCountry: "IN",
    },
    openingHours: ["Mo-Sa 09:30-20:00", "Su 10:00-19:00"],
    sameAs,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.businessName,
    url,
  };

  return [organization, localBusiness, website];
}
