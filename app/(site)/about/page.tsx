import {
  Boxes,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Hotel,
  Landmark,
  PackageCheck,
  Recycle,
  Rocket,
  ShoppingBag,
  Target,
  Telescope,
  Truck,
  Wrench,
  Layers,
} from "lucide-react";
import type { Metadata } from "next";
import { companyStats } from "@/components/home/stats";
import { CtaPanel } from "@/components/site/cta-panel";
import { Reveal } from "@/components/ui/reveal";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/section";
import { getSettings } from "@/lib/api/public";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are, what we do and the industries we equip with business hardware.",
  alternates: { canonical: "/about" },
};

// PLACEHOLDER copy throughout — replace with real company content.
const capabilities = [
  { icon: Boxes, title: "Procurement & sourcing", body: "Volume sourcing across every major hardware category through authorized distribution." },
  { icon: Wrench, title: "Configuration & staging", body: "OS imaging, BIOS and firmware baselines, RAID, asset tagging — done before shipping." },
  { icon: Truck, title: "Delivery & installation", body: "Scheduled delivery, racking, cabling, desk setup and on-site handover." },
  { icon: Layers, title: "Large rollouts", body: "Phased deployments across multiple sites, coordinated with your IT team." },
  { icon: PackageCheck, title: "Warranty & after-sales", body: "We handle RMAs, replacements and warranty claims so your team doesn't have to." },
  { icon: Recycle, title: "Lifecycle & refresh", body: "Refresh planning, trade-in and responsible disposal of retired equipment." },
];

const industries = [
  { icon: Landmark, label: "Finance & banking" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: GraduationCap, label: "Education" },
  { icon: Building2, label: "Government" },
  { icon: Factory, label: "Manufacturing" },
  { icon: ShoppingBag, label: "Retail" },
  { icon: Hotel, label: "Hospitality" },
  { icon: Rocket, label: "Startups & tech" },
];

const milestones = [
  { year: "2014", text: "Founded in Jakarta as a small IT hardware reseller." },
  { year: "2017", text: "Opened a configuration & staging facility." },
  { year: "2020", text: "Began nationwide multi-site rollouts for enterprise clients." },
  { year: "2023", text: "Expanded into data-center and infrastructure hardware." },
  { year: "2026", text: "Launched our online catalog and inquiry service." },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid mask-fade-b" aria-hidden />
        <div className="absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-neon/15 blur-[120px]" aria-hidden />
        <Container className="py-20 sm:py-28">
          <Eyebrow>About {settings.company_name}</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] text-ink sm:text-6xl">
            We make sure the hardware is <span className="text-gradient">the last thing</span> you worry about.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-subtle">{settings.description}</p>
        </Container>
      </section>

      <section className="border-y border-line bg-deep/60">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {companyStats.map((s, i) => (
              <div key={s.label} className={`flex flex-col-reverse px-2 py-8 sm:px-6 ${i % 2 ? "" : "border-r border-line"} ${i < 2 ? "border-b border-line lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
                <dt className="mt-2 text-sm text-subtle">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold text-gradient sm:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Overview + mission/vision */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>Company overview</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">A hardware partner, not just a supplier.</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-subtle">
              <p>
                {settings.company_name} started with a simple idea: buying business hardware shouldn&apos;t be the hard part of running a
                business. Today we equip offices, schools, clinics and data rooms across Indonesia with everything from
                rack servers to the keyboard on every desk.
              </p>
              <p>
                We combine broad sourcing with hands-on technical work — configuring, testing and installing equipment so
                it&apos;s ready to work the moment it arrives. And when something needs attention later, we&apos;re the ones who pick up the phone.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4">
            <Reveal delay={80}>
              <div className="ring-gradient h-full rounded-2xl border border-line bg-card p-7">
                <Target className="size-5 text-neon" />
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">Mission</h3>
                <p className="mt-2 leading-relaxed text-subtle">
                  To give every business reliable, well-supported technology — delivered ready to work and backed by people who care
                  after the sale.
                </p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="ring-gradient h-full rounded-2xl border border-line bg-card p-7">
                <Telescope className="size-5 text-iris" />
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">Vision</h3>
                <p className="mt-2 leading-relaxed text-subtle">
                  To be the most trusted hardware partner for growing organizations in the region — the first call when anything with a
                  power cable is needed.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-y border-line bg-deep/50 py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Capabilities" title="What we do, end to end." description="From the first quote to the day equipment is retired." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70} className="bg-base">
                <div className="group h-full p-8 transition-colors hover:bg-surface">
                  <div className="flex items-center justify-between">
                    <c.icon className="size-5 text-neon" />
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-8 font-display text-lg font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-subtle">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Industries served" title="Trusted across sectors." align="center" />
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {industries.map((ind, i) => (
              <Reveal as="li" key={ind.label} delay={(i % 4) * 60}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-line bg-card px-4 py-7 text-center transition-colors hover:border-neon/40">
                  <ind.icon className="size-6 text-neon" />
                  <span className="text-sm text-ink">{ind.label}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Timeline */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <SectionHeading eyebrow="Our journey" title="A decade of getting it right." />
          <ol className="relative mt-12 grid gap-8 border-l border-line-strong pl-8 md:grid-cols-5 md:border-l-0 md:border-t md:pl-0 md:pt-10">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 80} className="relative">
                <span className="absolute -left-[2.3rem] top-1.5 size-2.5 rounded-full bg-gradient-brand shadow-[0_0_14px_var(--glow)] md:-top-[2.85rem] md:left-0" aria-hidden />
                <p className="font-mono text-sm text-neon">{m.year}</p>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <CtaPanel whatsapp={settings.whatsapp} title="Ready to equip your team?" />
    </>
  );
}
