import { ArrowRight, PackageSearch } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryFilter, ProductSearch } from "@/components/product/product-filters";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { getCategories, getProducts } from "@/lib/api/public";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse servers, workstations, laptops, networking, displays, printers, power and accessories for business.",
  alternates: { canonical: "/products" },
};

type Props = { searchParams: Promise<{ search?: string; category?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category } = await searchParams;
  const [categories, products, all] = await Promise.all([
    getCategories(),
    getProducts({ search, category }),
    getProducts(),
  ]);
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid mask-fade-b" aria-hidden />
        <div className="absolute -top-32 right-0 -z-10 size-[30rem] rounded-full bg-neon/15 blur-[110px]" aria-hidden />
        <Container className="py-16 sm:py-20">
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold text-ink sm:text-5xl">
            {activeCategory ? activeCategory.name : <>Product <span className="text-gradient">catalog</span></>}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-subtle">
            {activeCategory
              ? activeCategory.description
              : "Business-grade hardware across every category. Don't see exactly what you need? We source beyond the catalog."}
          </p>
          <div className="mt-8 max-w-xl">
            <Suspense>
              <ProductSearch />
            </Suspense>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-[240px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 hidden px-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted lg:block">Categories</h2>
          <CategoryFilter categories={categories} active={category} search={search} total={all.length} />
        </aside>

        <div>
          <p className="mb-6 text-sm text-subtle" aria-live="polite">
            <span className="font-mono text-ink">{products.length}</span> {products.length === 1 ? "product" : "products"}
            {search && (
              <>
                {" "}matching <span className="text-ink">&ldquo;{search}&rdquo;</span>
              </>
            )}
          </p>

          {products.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong px-6 py-20 text-center">
              <div className="grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface text-neon">
                <PackageSearch className="size-6" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold text-ink">Nothing matches — yet.</h2>
              <p className="mt-3 max-w-md text-subtle">
                We source far more than what&apos;s listed here. Tell us what you&apos;re looking for and we&apos;ll find it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/inquiry">
                  Ask us to source it <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/products" variant="secondary">
                  Clear filters
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
