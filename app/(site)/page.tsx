import { ArrowRight, Boxes, PackageCheck, Truck, Wrench } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { ProcessSteps } from "@/components/home/process";
import { StatsStrip } from "@/components/home/stats";
import { ValuesGrid } from "@/components/home/values";
import { CategoryCard } from "@/components/product/category-card";
import { ProductCard } from "@/components/product/product-card";
import { CtaPanel } from "@/components/site/cta-panel";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/section";
import { getCategories, getProducts, getSettings } from "@/lib/api/public";

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([getSettings(), getCategories(), getProducts()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      <Hero description={settings.description} />
      <StatsStrip />

      {/* Company introduction */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
              One partner for every machine in the building.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-subtle">
              From the server room to the reception desk, {settings.company_name} sources, configures and delivers the
              hardware businesses depend on. We work with IT teams, procurement and founders alike — and we stay around
              long after delivery.
            </p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neon hover:gap-3 transition-all">
              Learn more about us <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Boxes, title: "Procure", body: "Sourcing across every major hardware category, at volume." },
              { icon: Wrench, title: "Configure", body: "Imaging, BIOS, RAID and firmware set before shipping." },
              { icon: Truck, title: "Deliver", body: "Scheduled delivery, racking, cabling and installation." },
              { icon: PackageCheck, title: "Support", body: "Warranty handling, replacements and lifecycle refresh." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-card p-6">
                  <c.icon className="size-5 text-neon" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-subtle">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Catalog"
            title="Everything an office runs on."
            description="Eight categories, from data-center compute to the keyboard on every desk."
            action={
              <ButtonLink href="/products" variant="secondary">
                View All Products <ArrowRight className="size-4" />
              </ButtonLink>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 4) * 70}>
                <CategoryCard category={c} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Featured"
            title={
              <>
                Popular with <span className="text-gradient">IT teams</span> right now.
              </>
            }
            action={
              <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-neon">
                Browse the full catalog <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="border-y border-line bg-deep/50 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Why SOLFRA"
            title="Built on the things that actually matter."
            description="Hardware is a commodity. The way it's sourced, set up and supported isn't."
          />
          <div className="mt-12">
            <ValuesGrid />
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="How it works" title="From inquiry to installed, in four steps." />
          <div className="mt-14">
            <ProcessSteps />
          </div>
        </Container>
      </section>

      <CtaPanel whatsapp={settings.whatsapp} />
    </>
  );
}
