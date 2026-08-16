import type { Metadata } from "next";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { FloatingWhatsApp } from "@/sections/FloatingWhatsApp";
import { OffersView } from "@/components/OffersView";
import { BRAND } from "@/config/brand";
import { getPublicManifest } from "@/lib/manifest";

const description = `Current offers and promotions at ${BRAND.businessName}, ${BRAND.city}.`;

export const metadata: Metadata = {
  title: "Offers",
  description,
  alternates: { canonical: "/offers" },
  openGraph: {
    title: `Offers | ${BRAND.businessName}`,
    description,
    url: "/offers",
  },
};

export default async function OffersPage() {
  const manifest = await getPublicManifest();
  const posters = (manifest.offers ?? []).map((o) => ({
    id: o.publicId,
    url: o.url,
    width: o.width,
    height: o.height,
  }));

  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">
        <OffersView posters={posters} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
