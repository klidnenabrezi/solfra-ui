import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { Container, Eyebrow } from "@/components/ui/section";
import { getCategories, getProducts, getSettings } from "@/lib/api/public";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the SOLFRA sales team by email, phone or WhatsApp — or send an inquiry online.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, products, categories] = await Promise.all([getSettings(), getProducts(), getCategories()]);
  const channels = [
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with sales", href: whatsappLink(settings.whatsapp), external: true },
    { icon: Clock, label: "Business hours", value: settings.business_hours },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-grid mask-fade-b" aria-hidden />
        <div className="absolute -right-32 -top-32 -z-10 size-[30rem] rounded-full bg-iris/15 blur-[110px]" aria-hidden />
        <Container className="py-16 sm:py-20">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
            Talk to people who <span className="text-gradient">know hardware.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-subtle">
            Whether it&apos;s one laptop or a full server room, we&apos;re happy to help you work out what you need.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => {
              const inner = (
                <>
                  <c.icon className="size-5 text-neon" />
                  <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">{c.label}</p>
                  <p className="mt-1.5 break-words font-medium text-ink">{c.value}</p>
                </>
              );
              const cls = "ring-gradient block h-full rounded-2xl border border-line bg-card p-6 transition-transform duration-300";
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noreferrer" : undefined} className={`${cls} hover:-translate-y-1`}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Visit our office</h2>
          <p className="mt-3 flex gap-3 text-subtle">
            <MapPin className="mt-1 size-4 shrink-0 text-neon" />
            {settings.address}
          </p>
          <MapPlaceholder />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Send us a message</h2>
          <p className="mt-3 text-subtle">General questions, partnerships or product inquiries — all welcome.</p>
          <div className="mt-8 rounded-3xl border border-line-strong bg-card p-6 sm:p-8">
            <InquiryForm products={products} categories={categories} />
          </div>
        </div>
      </Container>
    </>
  );
}

/** Stylized stand-in until a real map embed (or static map image) is chosen. */
function MapPlaceholder() {
  return (
    <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl border border-line-strong bg-surface">
      <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden>
        <g fill="none" stroke="var(--line-strong)" strokeWidth="10" strokeLinecap="round">
          <path d="M-20 210 C 80 190, 140 120, 230 130 S 380 80, 430 60" />
          <path d="M120 -20 C 140 80, 110 180, 150 320" />
        </g>
        <g fill="none" stroke="var(--line)" strokeWidth="5">
          <path d="M-10 90 H 420" />
          <path d="M300 -10 V 310" />
          <path d="M-10 260 C 100 250, 250 270, 420 240" />
        </g>
        <circle cx="210" cy="132" r="46" fill="var(--neon)" opacity=".12" />
        <circle cx="210" cy="132" r="22" fill="var(--neon)" opacity=".2" />
      </svg>
      <div className="absolute left-[52.5%] top-[44%] -translate-x-1/2 -translate-y-full">
        <div className="grid size-10 place-items-center rounded-full rounded-br-none bg-gradient-brand text-on-neon shadow-[0_10px_30px_-5px_var(--glow)] rotate-45">
          <MapPin className="size-4 -rotate-45" />
        </div>
      </div>
      <span className="absolute bottom-4 left-4 rounded-full border border-line bg-base/80 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted backdrop-blur">
        Map placeholder
      </span>
    </div>
  );
}
