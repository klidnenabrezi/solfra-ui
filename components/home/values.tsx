import { BadgeCheck, Handshake, Headset, ShieldCheck, Timer } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: BadgeCheck,
    title: "Genuine quality",
    body: "Only new, authentic hardware through authorized channels — with full manufacturer warranty and documentation.",
    span: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    body: "Every server and workstation is configured, updated and burn-in tested before it leaves us.",
    span: "",
  },
  {
    icon: Handshake,
    title: "Honest pricing",
    body: "Transparent, volume-aware quotations. No hidden fees, no pressure.",
    span: "",
  },
  {
    icon: Headset,
    title: "Service that stays",
    body: "Installation, deployment, warranty handling and a real person to call after the sale.",
    span: "",
  },
  {
    icon: Timer,
    title: "Fast response",
    body: "Inquiries answered within one business day — usually much sooner.",
    span: "",
  },
];

export function ValuesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {values.map((v, i) => (
        <Reveal key={v.title} delay={i * 70} className={cn(v.span)}>
          <div className="group ring-gradient relative h-full overflow-hidden rounded-2xl border border-line bg-card p-7">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-neon/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
            <div className="grid size-11 place-items-center rounded-xl border border-line-strong bg-overlay/60 text-neon">
              <v.icon className="size-5" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold text-ink">{v.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-subtle">{v.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
