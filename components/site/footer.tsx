import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand/social-icons";
import { Container } from "@/components/ui/section";
import type { Category, CompanySettings } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";

export function Footer({ settings, categories }: { settings: CompanySettings; categories: Category[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-deep">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-neon/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo name={settings.company_name} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-subtle">{settings.tagline}</p>
          <div className="mt-6 flex gap-2">
            {settings.social.linkedin && (
              <a href={settings.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-line text-subtle transition-colors hover:border-neon/50 hover:text-ink">
                <LinkedInIcon className="size-4" />
              </a>
            )}
            {settings.social.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-line text-subtle transition-colors hover:border-neon/50 hover:text-ink">
                <InstagramIcon className="size-4" />
              </a>
            )}
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-9 place-items-center rounded-full border border-line text-subtle transition-colors hover:border-neon/50 hover:text-ink">
              <WhatsAppIcon className="size-4" />
            </a>
          </div>
        </div>

        <FooterCol title="Catalog" className="md:col-span-3">
          {categories.slice(0, 6).map((c) => (
            <li key={c.id}>
              <Link href={`/products?category=${c.slug}`} className="hover:text-ink">
                {c.name}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Company" className="md:col-span-2">
          <li><Link href="/about" className="hover:text-ink">About us</Link></li>
          <li><Link href="/products" className="hover:text-ink">All products</Link></li>
          <li><Link href="/inquiry" className="hover:text-ink">Send an inquiry</Link></li>
          <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
          <li><Link href="/privacy" className="hover:text-ink">Privacy notice</Link></li>
        </FooterCol>

        <FooterCol title="Reach us" className="md:col-span-3">
          <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-neon" />{settings.address}</li>
          <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-neon" /><a href={`mailto:${settings.email}`} className="hover:text-ink">{settings.email}</a></li>
          <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-neon" /><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-ink">{settings.phone}</a></li>
          <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-neon" />{settings.business_hours}</li>
        </FooterCol>
      </Container>
      <Container className="relative flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {settings.company_name}. All rights reserved.</p>
        <p className="font-mono uppercase tracking-[0.18em]">Built for business · Delivered ready</p>
      </Container>
    </footer>
  );
}

function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h3 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-subtle">{children}</ul>
    </div>
  );
}
