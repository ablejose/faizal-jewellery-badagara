import type { Collection } from "@/types/collections";

/**
 * PRODUCT CATALOGUE — SINGLE SOURCE OF TRUTH.
 *
 * There is no backend / admin database. To manage the catalogue you edit THIS
 * file and redeploy (the same workflow as config/brand.ts). Everything on the
 * site is driven from here:
 *   • the homepage "Our Collections" section (one row per collection)
 *   • the scrolling preview (first 3 products of each collection)
 *   • the dedicated collection pages at /collections/{slug}
 *
 * TO RENAME A COLLECTION: change its `name`. Keep `slug` stable to preserve the
 *   URL — or change the slug too and every link + page follows automatically.
 * TO ADD A COLLECTION:    copy a block below and give it a unique `slug`.
 * TO ADD A PRODUCT:       add an object to that collection's `products` array.
 *                         `image`, `name` and `price` are all required.
 * PRODUCT ORDER:          array order === display order. The first three
 *                         products feed the homepage preview marquee.
 *
 * IMAGES: use a Cloudinary URL (cloud "sqsrrir4") or a path under /public.
 *   The images below are PLACEHOLDERS reusing existing site assets — swap them
 *   for real product photos. To use a new remote host, whitelist it in
 *   next.config.mjs (images.remotePatterns).
 */

// Placeholder imagery — reuses assets already shipped with the site so nothing
// is broken out of the box. Replace with real product photos.
const PH = {
  a: "/images/store1.webp",
  b: "/images/store2.webp",
  c: "/images/store3.webp",
  d: "/images/store4.webp",
} as const;

export const COLLECTIONS: Collection[] = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The latest additions to the Faizal Jewellery collection.",
    products: [
      { id: "na-1", name: "Kundan Statement Necklace", price: 185000, image: PH.a },
      { id: "na-2", name: "Rose Gold Diamond Ring", price: 74500, image: PH.b },
      { id: "na-3", name: "Temple Jhumka Earrings", price: 42000, image: PH.c },
      { id: "na-4", name: "Antique Gold Bangle Set", price: 128000, image: PH.d },
      { id: "na-5", name: "Polki Pendant", price: 56000, image: PH.a },
      { id: "na-6", name: "Emerald Drop Earrings", price: 98000, image: PH.b },
    ],
  },
  {
    slug: "bangles",
    name: "Bangles",
    description: "Handcrafted gold and diamond bangles for every occasion.",
    products: [
      { id: "bg-1", name: "Classic Gold Kada", price: 92000, image: PH.b },
      { id: "bg-2", name: "Diamond Tennis Bangle", price: 164000, image: PH.c },
      { id: "bg-3", name: "Antique Broad Bangle", price: 138000, image: PH.d },
      { id: "bg-4", name: "Filigree Gold Bangle", price: 68000, image: PH.a },
      { id: "bg-5", name: "Ruby Studded Kada", price: 121000, image: PH.b },
      { id: "bg-6", name: "Everyday Slim Bangle Pair", price: 47000, image: PH.c },
    ],
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    description: "Statement necklaces and everyday chains crafted to last.",
    products: [
      { id: "nk-1", name: "Bridal Choker Set", price: 285000, image: PH.c },
      { id: "nk-2", name: "Kundan Long Haram", price: 342000, image: PH.d },
      { id: "nk-3", name: "Diamond Solitaire Pendant Set", price: 156000, image: PH.a },
      { id: "nk-4", name: "Antique Lakshmi Necklace", price: 214000, image: PH.b },
      { id: "nk-5", name: "Minimal Gold Chain", price: 39000, image: PH.c },
      { id: "nk-6", name: "Emerald Layered Necklace", price: 268000, image: PH.d },
    ],
  },
  {
    slug: "earrings",
    name: "Earrings",
    description: "From daily studs to grand jhumkas.",
    products: [
      { id: "er-1", name: "Diamond Stud Pair", price: 58000, image: PH.d },
      { id: "er-2", name: "Temple Jhumkas", price: 74000, image: PH.a },
      { id: "er-3", name: "Chandbali Earrings", price: 96000, image: PH.b },
      { id: "er-4", name: "Pearl Drop Earrings", price: 43000, image: PH.c },
      { id: "er-5", name: "Gold Hoop Earrings", price: 36000, image: PH.d },
    ],
  },
  {
    slug: "rings",
    name: "Rings",
    description: "Engagement rings and timeless everyday bands.",
    products: [
      { id: "rg-1", name: "Solitaire Engagement Ring", price: 132000, image: PH.a },
      { id: "rg-2", name: "Rose Gold Band", price: 41000, image: PH.b },
      { id: "rg-3", name: "Ruby Cocktail Ring", price: 88000, image: PH.c },
      { id: "rg-4", name: "Diamond Cluster Ring", price: 115000, image: PH.d },
      { id: "rg-5", name: "Classic Gold Ring", price: 34000, image: PH.a },
    ],
  },
];

/** Look up a single collection by slug. */
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}
