/**
 * Types for the config-driven product catalogue.
 *
 * There is no backend. config/collections.ts is the single source of truth and
 * drives the homepage "Our Collections" section, the preview marquees, and the
 * dynamic collection pages at /collections/{slug}.
 */

export interface Product {
  /** Stable id, unique within its collection. Used as the React key. */
  id: string;
  /** Display name, e.g. "Antique Temple Necklace". Required. */
  name: string;
  /** Price in Indian Rupees as a plain number, e.g. 25000 -> "₹ 25,000". Required. */
  price: number;
  /** Image URL — a Cloudinary URL or a path under /public. Required. */
  image: string;
}

export interface Collection {
  /** URL slug -> /collections/{slug}. Lowercase, hyphenated, unique. */
  slug: string;
  /** Display name shown on cards and the collection page, e.g. "Bangles". */
  name: string;
  /** Optional one-line description shown on the collection page. */
  description?: string;
  /** Products in display order. The first three feed the homepage preview. */
  products: Product[];
}
