import Image from "next/image";

interface StoreImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function StoreImage({ src, alt, priority = false }: StoreImageProps) {
  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-gold/20 shadow-xl shadow-black/40 ring-1 ring-white/5">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 60vw, 20vw"
        className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
    </div>
  );
}
