import { Clock, MessageSquare, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { Container, Eyebrow } from "@/components/ui/section";
import { getCategories, getProducts } from "@/lib/api/public";

export const metadata: Metadata = {
  title: "Send an Inquiry",
  description: "Tell us what hardware you need. No account required — a specialist will reply within one business day.",
  alternates: { canonical: "/inquiry" },
};

type Props = { searchParams: Promise<{ product?: string }> };

export default async function InquiryPage({ searchParams }: Props) {
  const { product: slug } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const preselected = products.find((p) => p.slug === slug);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid mask-fade-b" aria-hidden />
      <div className="absolute -left-32 top-0 -z-10 size-[30rem] rounded-full bg-neon/15 blur-[110px]" aria-hidden />
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Inquiry</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl">
            Let&apos;s spec it <span className="text-gradient">together.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-subtle">
            No account, no cart. Tell us what you need and a hardware specialist will come back with options and a
            quotation.
          </p>
          <ul className="mt-10 space-y-5">
            {[
              { icon: Clock, title: "Reply within 1 business day", body: "Usually within a few hours during office hours." },
              { icon: MessageSquare, title: "A real specialist", body: "Not a bot — someone who knows the hardware." },
              { icon: ShieldCheck, title: "Your data stays private", body: "Used only to respond to your inquiry." },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-strong bg-surface text-neon">
                  <Icon className="size-[18px]" />
                </span>
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="text-sm text-subtle">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-3xl border border-line-strong bg-card p-6 shadow-[0_40px_120px_-60px_var(--glow)] sm:p-10">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-brand" aria-hidden />
          <InquiryForm products={products} categories={categories} defaultProductId={preselected?.id} />
        </div>
      </Container>
    </section>
  );
}
