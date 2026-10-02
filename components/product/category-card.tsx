import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group ring-gradient relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all duration-500 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
        <span className="font-mono text-xs text-muted">{category.product_count} items</span>
      </div>
      <div className="relative mx-auto my-4 aspect-[4/3] w-full max-w-[220px]">
        <div className="absolute inset-[15%] rounded-full bg-neon/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
        {category.image && (
          <Image
            src={category.image}
            alt=""
            fill
            unoptimized
            sizes="220px"
            className="placeholder-art object-contain transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{category.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-subtle">{category.description}</p>
      <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-subtle transition-colors group-hover:text-neon">
        Browse <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
