import { ArrowLeft, ArrowRight, BadgeCheck, ChevronRight, Truck, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { availabilityMeta, AvailabilityBadge } from "@/components/product/availability";
import { ProductCard } from "@/components/product/product-card";
import { ProductImage } from "@/components/product/product-image";
import { SpecTable } from "@/components/product/spec-table";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { getProduct, getSettings } from "@/lib/api/public";
import { whatsappLink } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product not found" };
  const { product } = data;
  return {
    title: product.name,
    description: product.short_description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description: product.short_description, images: product.image ? [product.image] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [data, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!data) notFound();
  const { product, related } = data;
  const avail = availabilityMeta[product.availability];

  return (
    <>
      <Container className="pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link href="/products" className="hover:text-ink">Products</Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink">{product.category.name}</Link>
          <ChevronRight className="size-3.5" />
          <span className="truncate text-subtle" aria-current="page">{product.name}</span>
        </nav>
      </Container>

      <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-neon/10 blur-3xl" aria-hidden />
            <ProductImage
              src={product.image}
              alt={product.name}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] rounded-3xl border border-line-strong"
            />
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-subtle">
            {[
              { icon: BadgeCheck, label: "Genuine & warrantied" },
              { icon: Wrench, label: "Pre-configured" },
              { icon: Truck, label: "Delivered & installed" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-card px-2 py-4">
                <Icon className="size-4 text-neon" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow>{product.category.name}</Eyebrow>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-[2.6rem]">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-subtle">{product.short_description}</p>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-card p-4">
            <AvailabilityBadge value={product.availability} />
            <p className="text-sm text-subtle">{avail.hint}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/inquiry?product=${product.slug}`} size="lg" className="sm:flex-1">
              Request a Quote <ArrowRight className="size-4" />
            </ButtonLink>
            <a
              href={whatsappLink(settings.whatsapp, `Hello SOLFRA, I'm interested in the ${product.name}.`)}
              target="_blank"
              rel="noreferrer"
              className={buttonClass("secondary", "lg", "sm:flex-1")}
            >
              <WhatsAppIcon className="size-4 text-[#25d366]" /> Ask on WhatsApp
            </a>
          </div>

          <section className="mt-12" aria-labelledby="overview">
            <h2 id="overview" className="font-display text-xl font-semibold text-ink">Overview</h2>
            <p className="mt-3 leading-relaxed text-subtle">{product.description}</p>
          </section>

          <section className="mt-10" aria-labelledby="specs">
            <div className="flex items-baseline justify-between">
              <h2 id="specs" className="font-display text-xl font-semibold text-ink">Specifications</h2>
              <span className="font-mono text-xs text-muted">Configurable · confirm in quote</span>
            </div>
            <div className="mt-4">
              <SpecTable specs={product.specifications} />
            </div>
          </section>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line py-20">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <Eyebrow>Related</Eyebrow>
                <h2 className="mt-4 text-2xl font-semibold text-ink sm:text-3xl">More in {product.category.name}</h2>
              </div>
              <Link href={`/products?category=${product.category.slug}`} className="hidden items-center gap-2 text-sm font-medium text-neon sm:inline-flex">
                View category <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <Container className="pb-4">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-ink">
          <ArrowLeft className="size-4" /> Back to all products
        </Link>
      </Container>

      {/* Mobile sticky CTA */}
      <div className="glass fixed inset-x-0 bottom-0 z-30 border-t border-line p-3 pr-20 lg:hidden">
        <ButtonLink href={`/inquiry?product=${product.slug}`} className="w-full">
          Request a Quote
        </ButtonLink>
      </div>
    </>
  );
}
