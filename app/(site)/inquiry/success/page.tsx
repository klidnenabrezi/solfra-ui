import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { getSettings } from "@/lib/api/public";

export const metadata: Metadata = { title: "Inquiry Sent", robots: { index: false } };

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function InquirySuccessPage({ searchParams }: Props) {
  const [{ ref }, settings] = await Promise.all([searchParams, getSettings()]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid mask-radial" aria-hidden />
      <div className="absolute left-1/2 top-1/3 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-neon/15 blur-[120px]" aria-hidden />
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <div className="relative grid size-20 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-neon/20 [animation-duration:2.4s] [animation-iteration-count:2]" />
          <span className="relative grid size-20 place-items-center rounded-full bg-gradient-brand text-on-neon shadow-[0_0_60px_-10px_var(--glow)]">
            <Check className="size-9" strokeWidth={2.5} />
          </span>
        </div>
        <h1 className="mt-10 text-4xl font-semibold text-ink sm:text-5xl">Inquiry Sent Successfully</h1>
        <p className="mt-5 max-w-lg text-lg text-subtle">
          Thank you — your inquiry is safely with our team. A specialist will reply to you by email within one business
          day.
        </p>
        {ref && (
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-line-strong bg-surface px-5 py-2.5">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">Reference</span>
            <span className="font-mono text-sm text-ink">{ref}</span>
          </div>
        )}
        <p className="mt-6 text-sm text-muted">
          Need it sooner? Email <a className="text-subtle hover:text-ink" href={`mailto:${settings.email}`}>{settings.email}</a> or call{" "}
          <a className="text-subtle hover:text-ink" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/products">
            Keep browsing <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
