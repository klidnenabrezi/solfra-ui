import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AvailabilityBadge } from "@/components/product/availability";
import { ProductImage } from "@/components/product/product-image";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <article
      className={cn(
        "group ring-gradient relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_var(--glow)]",
        className,
      )}
    >
      <ProductImage src={product.image} alt={product.name} className="aspect-[4/3] border-b border-line" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">
            {product.category.name}
          </span>
          <AvailabilityBadge value={product.availability} />
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-subtle">{product.short_description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-neon">
          View details
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
