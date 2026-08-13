import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CollectionPreview } from "@/components/CollectionPreview";
import { COLLECTIONS } from "@/config/collections";
import { getPublicManifest, productsForSlug } from "@/lib/manifest";

/**
 * "Our Collections" — sits directly below the hero. Renders one preview row per
 * collection. Preview images come from the Cloudinary manifest (admin-managed)
 * when present, otherwise from the config sample products — resolved once here
 * on the server and passed down, so the rows never fetch on the client.
 */
export async function Collections() {
  if (COLLECTIONS.length === 0) return null;

  const manifest = await getPublicManifest();

  const rows = COLLECTIONS.map((collection) => {
    const managed = productsForSlug(manifest, collection.slug);
    const images =
      managed.length > 0
        ? managed.map((p) => p.url)
        : collection.products.map((p) => p.image);
    return { collection, images };
  });

  return (
    <section id="collections" className="py-20 md:py-28">
      <div className="container-lux">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Our Collections"
            subtitle="Handpicked pieces across every category — crafted for every celebration."
          />
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col gap-14 md:mt-16 md:gap-20">
        {rows.map(({ collection, images }) => (
          <Reveal key={collection.slug}>
            <CollectionPreview collection={collection} images={images} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
