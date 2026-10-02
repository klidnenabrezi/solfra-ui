"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("search") ?? "");
  const [pending, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set("search", value.trim());
      else next.delete("search");
      startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by product name…"
        autoComplete="off"
        maxLength={100}
        className="h-12 w-full rounded-full border border-line-strong bg-surface/70 pl-11 pr-11 text-sm text-ink placeholder:text-muted outline-none transition-colors focus:border-neon/60 focus:bg-surface [&::-webkit-search-cancel-button]:hidden"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2">
        {pending ? (
          <LoaderCircle className="size-4 animate-spin text-neon" />
        ) : value ? (
          <button type="button" aria-label="Clear search" onClick={() => setValue("")} className="text-muted hover:text-ink">
            <X className="size-4" />
          </button>
        ) : null}
      </span>
    </div>
  );
}

export function CategoryFilter({
  categories,
  active,
  search,
  total,
}: {
  categories: Category[];
  active?: string;
  search?: string;
  total: number;
}) {
  const href = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (search) p.set("search", search);
    return `/products${p.size ? `?${p}` : ""}`;
  };
  const items = [{ slug: undefined, name: "All products", count: total }, ...categories.map((c) => ({ slug: c.slug, name: c.name, count: c.product_count }))];

  return (
    <nav aria-label="Product categories">
      {/* Mobile: horizontal pills */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden">
        {items.map((c) => (
          <li key={c.name} className="shrink-0">
            <Link
              href={href(c.slug)}
              scroll={false}
              aria-current={active === c.slug ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors",
                active === c.slug
                  ? "border-neon/60 bg-neon/10 text-ink"
                  : "border-line-strong text-subtle hover:text-ink",
              )}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop: vertical list */}
      <ul className="hidden space-y-1 lg:block">
        {items.map((c) => (
          <li key={c.name}>
            <Link
              href={href(c.slug)}
              scroll={false}
              aria-current={active === c.slug ? "page" : undefined}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all",
                active === c.slug ? "bg-overlay/80 text-ink" : "text-subtle hover:bg-overlay/40 hover:text-ink",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-4 w-0.5 rounded-full transition-colors",
                    active === c.slug ? "bg-gradient-brand" : "bg-transparent group-hover:bg-line-strong",
                  )}
                />
                {c.name}
              </span>
              <span className="font-mono text-xs text-muted">{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
