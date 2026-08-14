import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/types/collections";
import { collectionHref } from "@/lib/format";

interface CollectionPreviewProps {
  collection: Collection;
  /** Preview image URLs (already resolved server-side: manifest first, else config). */
  images: string[];
}

/**
 * One homepage row per collection:
 *
 *   [ Collection Name .......................... View All → ]
 *   [ continuous right-to-left scrolling preview of images  ]
 *
 * Server component — the preview images are resolved by the parent section from
 * the Cloudinary manifest (falling back to config products), so this renders no
 * client fetch. Reuses the site's `.marquee-rtl` (smooth, infinite, pauses on
 * hover). Clicking "View All" or any image opens /collections/{slug}.
 */
export function CollectionPreview({ collection, images }: CollectionPreviewProps) {
  const href = collectionHref(collection.slug);
  const preview = images.slice(0, 3);

  if (preview.length === 0) return null;

  // Repeat the images enough to fill wide viewports, then duplicate the whole
  // track so the `-50%` marquee keyframe loops with no visible jump.
  const half = [...preview, ...preview, ...preview];
  const track = [...half, ...half];

  return (
    <div className="border-t border-border pt-8">
      <div className="container-lux flex items-baseline justify-between gap-4">
        <h3 className="font-display text-display-m text-ivory">{collection.name}</h3>
        <Link
          href={href}
          className="label-eyebrow shrink-0 whitespace-nowrap transition-colors hover:text-ivory"
        >
          View All →
        </Link>
      </div>

      <div className="container-lux mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-rtl flex w-max gap-6">
          {track.map((src, index) => (
            <Link
              key={`${src}-${index}`}
              href={href}
              aria-label={`View the ${collection.name} collection`}
              className="group relative block w-56 shrink-0 overflow-hidden rounded-3xl border border-gold/20 shadow-xl shadow-black/40 ring-1 ring-white/5 sm:w-64 md:w-72"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={src}
                  alt={`${collection.name} preview`}
                  fill
                  sizes="(max-width: 768px) 60vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
