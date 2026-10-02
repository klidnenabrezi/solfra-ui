import { Info } from "lucide-react";
import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/section";
import { getSettings } from "@/lib/api/public";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How we collect, use and protect personal data submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const s = await getSettings();
  const sections = [
    {
      h: "What we collect",
      p: "When you send an inquiry we collect your name, company, email address, and — if you provide them — your phone/WhatsApp number, location, the product you're interested in, quantity and your message.",
    },
    {
      h: "Why we collect it",
      p: "Only to respond to your inquiry, prepare quotations and follow up on your request. We do not sell your data or use it for unrelated marketing.",
    },
    {
      h: "How long we keep it",
      p: "Inquiry records are kept for [RETENTION PERIOD] after your inquiry is closed, then deleted. (To be set by the company before launch.)",
    },
    {
      h: "Who can access it",
      p: "Only authorized staff with an administrator account. Data is stored on infrastructure we operate and is protected in transit with HTTPS.",
    },
    {
      h: "Analytics",
      p: "We use privacy-friendly, cookie-free analytics to understand aggregate site usage. No tracking cookies are set.",
    },
    {
      h: "Your rights",
      p: `Under Indonesia's Personal Data Protection Law (UU No. 27/2022) you may request access to, correction of, or deletion of your personal data. Email ${s.email} and we will respond within the period required by law.`,
    },
  ];

  return (
    <Container className="max-w-3xl py-16 sm:py-24">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-5 text-4xl font-semibold text-ink sm:text-5xl">Privacy Notice</h1>
      <div className="mt-8 flex gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
        <Info className="mt-0.5 size-4 shrink-0" />
        Placeholder text. This notice must be reviewed and finalized by the company before go-live (TechDoc §20).
      </div>
      <div className="mt-12 space-y-10">
        {sections.map((sec) => (
          <section key={sec.h}>
            <h2 className="font-display text-xl font-semibold text-ink">{sec.h}</h2>
            <p className="mt-3 leading-relaxed text-subtle">{sec.p}</p>
          </section>
        ))}
      </div>
      <p className="mt-14 font-mono text-xs text-muted">Last updated: [DATE] · {s.company_name}</p>
    </Container>
  );
}
