import type { Collection } from "@/types/collections";

/**
 * PRODUCT CATALOGUE — collection definitions.
 *
 * Collections (name, slug, description and order) are defined here. The actual
 * products are managed through the admin panel and stored in the Cloudinary
 * manifest (`faizal/data/manifest`), keyed by the slugs below. The `products`
 * arrays here are fallbacks shown ONLY when a collection has no managed
 * products yet — they are intentionally left EMPTY so nothing but real,
 * admin-managed photos ever appears on the site.
 *
 * TO RENAME A COLLECTION: change its `name`. Change `slug` too to change the
 *   URL — the Cloudinary manifest key must then use the new slug.
 * TO ADD A COLLECTION:    copy a block below and give it a unique `slug`.
 * TO MANAGE PRODUCTS:     use the /admin panel (uploads to Cloudinary and
 *   updates the manifest); no code change needed.
 */

export const COLLECTIONS: Collection[] = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The latest additions to the Faizal Jewellery collection.",
    products: [],
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    description: "Handcrafted silver and beaded bracelets for every occasion.",
    products: [],
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    description: "Statement necklaces and everyday chains crafted to last.",
    products: [],
  },
  {
    slug: "earrings",
    name: "Earrings",
    description: "From daily studs to grand jhumkas.",
    products: [],
  },
  {
    slug: "rings",
    name: "Rings",
    description: "Gemstone and silver rings for every finger and every occasion.",
    products: [],
  },
  {
    slug: "gems",
    name: "Gems",
    description:
      "Certified natural gemstones and precious loose stones — sapphire, emerald, coral and more.",
    products: [],
  },
];

/** Look up a single collection by slug. */
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}
