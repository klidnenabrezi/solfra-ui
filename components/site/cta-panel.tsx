import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { whatsappLink } from "@/lib/utils";

export function CtaPanel({ whatsapp, title, body }: { whatsapp: string; title?: string; body?: string }) {
  return (
    <Container>
      <div className="relative isolate overflow-hidden rounded-3xl border border-line-strong bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-grid mask-radial" aria-hidden />
        <div className="absolute -bottom-40 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-neon/25 blur-[100px]" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand" aria-hidden />
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">
          {title ?? (
            <>
              Tell us what you need. <span className="text-gradient">We&apos;ll handle the rest.</span>
            </>
          )}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-subtle sm:text-lg">
          {body ?? "One inquiry is all it takes — a specialist will reply with options and a quotation within one business day."}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/inquiry" size="lg">
            Send an Inquiry <ArrowRight className="size-4" />
          </ButtonLink>
          <a href={whatsappLink(whatsapp)} target="_blank" rel="noreferrer" className={buttonClass("secondary", "lg")}>
            <WhatsAppIcon className="size-4 text-[#25d366]" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </Container>
  );
}
