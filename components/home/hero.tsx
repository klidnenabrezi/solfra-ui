import { ArrowRight, BadgeCheck, Timer, Wrench } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";

export function Hero({ description }: { description: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid mask-fade-b" aria-hidden />
      <div className="absolute -left-40 -top-40 -z-10 size-[36rem] rounded-full bg-neon/20 blur-[120px]" aria-hidden />
      <div className="absolute -right-32 top-24 -z-10 size-[28rem] rounded-full bg-iris/15 blur-[120px]" aria-hidden />

      <Container className="grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-28 lg:pt-24">
        <div>
          <Eyebrow>B2B hardware supply · Indonesia</Eyebrow>
          <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] text-ink sm:text-6xl lg:text-[4.3rem]">
            The hardware your business <span className="text-gradient">runs&nbsp;on.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-subtle">{description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/products" size="lg">
              View Products <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/inquiry" size="lg" variant="secondary">
              Send Inquiry
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-subtle sm:grid-cols-3 sm:gap-4">
            {[
              { icon: BadgeCheck, label: "Genuine, warrantied hardware" },
              { icon: Wrench, label: "Configured before delivery" },
              { icon: Timer, label: "Quotes within 1 business day" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-neon" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden>
      {/* orbit rings */}
      <div className="absolute inset-[6%] rounded-full border border-line" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-line-strong opacity-60" />
      <div className="absolute inset-[30%] rounded-full bg-neon/15 blur-3xl" />
      {/* horizon sun */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="hero-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--neon)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--iris)" stopOpacity=".05" />
          </linearGradient>
          <mask id="hero-sun-mask">
            <rect width="400" height="400" fill="#fff" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x="0" y={250 + i * 18} width="400" height={3 + i * 1.6} fill="#000" />
            ))}
          </mask>
        </defs>
        <circle cx="200" cy="230" r="128" fill="url(#hero-sun)" mask="url(#hero-sun-mask)" />
      </svg>
      <div className="absolute inset-[10%] animate-float">
        <Image src="/placeholders/rack-server.svg" alt="" fill priority unoptimized className="placeholder-art object-contain drop-shadow-[0_20px_40px_var(--glow)]" />
      </div>

      <Chip className="left-0 top-[22%] sm:-left-4" label="Compute" value="2 × 32-core · 2 TB" />
      <Chip className="right-0 top-[4%] sm:right-2 [animation-delay:-3s]" label="Network" value="25 GbE · SFP28" />
      <Chip className="bottom-[12%] left-[6%] [animation-delay:-5s]" label="Delivered" value="Racked & tested" accent />
    </div>
  );
}

function Chip({ className, label, value, accent }: { className: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`glass absolute animate-float rounded-xl border border-line-strong px-4 py-3 shadow-[0_16px_40px_-20px_var(--glow)] ${className}`}>
      <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
        <span className={`size-1.5 rounded-full ${accent ? "bg-foam" : "bg-neon"} animate-pulse-soft`} />
        {label}
      </div>
      <div className="mt-1 font-display text-sm font-medium text-ink">{value}</div>
    </div>
  );
}
