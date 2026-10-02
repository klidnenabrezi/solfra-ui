import Image from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK = "/placeholders/generic.svg";

export function ProductImage({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const url = src || FALLBACK;
  const isPlaceholder = url.startsWith("/placeholders/");
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <div className="absolute inset-0 bg-grid mask-radial opacity-80" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 size-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/10 blur-3xl"
        aria-hidden
      />
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={url.endsWith(".svg") || url.startsWith("blob:")}
        className={cn(
          "transition-transform duration-700 ease-out group-hover:scale-[1.04]",
          isPlaceholder ? "placeholder-art object-contain p-[8%]" : "object-cover",
        )}
      />
    </div>
  );
}
