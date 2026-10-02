import { WhatsAppIcon } from "@/components/brand/social-icons";
import { whatsappLink } from "@/lib/utils";

export function WhatsAppButton({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, "Hello SOLFRA, I'd like to ask about your products.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with sales on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-line-strong bg-surface/90 p-3 text-ink shadow-[0_10px_40px_-10px_var(--glow)] backdrop-blur transition-all hover:border-neon/60 sm:bottom-6 sm:right-6"
    >
      <span className="relative grid size-7 place-items-center rounded-full bg-[#25d366] text-white">
        <WhatsAppIcon className="size-4" />
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.6s]" aria-hidden />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 group-focus-visible:max-w-40">
        Chat with sales
      </span>
    </a>
  );
}
