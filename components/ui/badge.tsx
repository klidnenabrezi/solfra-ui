import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "neon" | "foam" | "gold" | "iris" | "love" | "muted" | "pine";

const tones: Record<Tone, string> = {
  neon: "text-neon bg-neon/10 ring-neon/25",
  foam: "text-foam bg-foam/10 ring-foam/25",
  gold: "text-gold bg-gold/10 ring-gold/25",
  iris: "text-iris bg-iris/10 ring-iris/25",
  love: "text-love bg-love/10 ring-love/25",
  pine: "text-pine bg-pine/10 ring-pine/25",
  muted: "text-subtle bg-overlay/70 ring-line-strong",
};

export function Badge({ tone = "muted", dot, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
