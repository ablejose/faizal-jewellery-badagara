import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { FloatingWhatsApp } from "@/sections/FloatingWhatsApp";
import { CollectionView } from "@/components/CollectionView";
import { COLLECTIONS, getCollection } from "@/config/collections";
import { BRAND } from "@/config/brand";
import type { Product } from "@/types/collections";
import { getPublicManifest, productsForSlug } from "@/lib/manifest";

interface PageProps {
  params: { slug: string };
}

// Statically generate a page for every collection in config; unknown slugs 404.
// Revalidated on demand via revalidateTag("manifest") when an admin edits products.
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const collection = getCollection(params.slug);
  if (!collection) return { title: "Collection not found" };

  const title = `${collection.name} | ${BRAND.businessName}`;
  const description =
    collection.description ??
    `Explore the ${collection.name} collection at ${BRAND.businessName}, ${BRAND.city}.`;

  return {
    title: collection.name,
    description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: { title, description, url: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const collection = getCollection(params.slug);
  if (!collection) notFound();

  // Admin-managed products (Cloudinary manifest) are the source of truth; fall
  // back to the config sample products when none have been uploaded yet.
  const manifest = await getPublicManifest();
  const managed = productsForSlug(manifest, collection.slug);
  const products: Product[] =
    managed.length > 0
      ? managed.map((p) => ({
          id: p.publicId,
          name: p.name || collection.name,
          price: p.price,
          image: p.url,
        }))
      : collection.products;

  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">
        <CollectionView collection={collection} products={products} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
