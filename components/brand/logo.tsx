import { useId } from "react";
import { cn } from "@/lib/utils";

/** Placeholder mark: a neon "sol" disc sliced by horizon lines. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <defs>
        <linearGradient id={`lm-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--neon)" />
          <stop offset=".55" stopColor="var(--love)" />
          <stop offset="1" stopColor="var(--iris)" />
        </linearGradient>
        <mask id={`lk-${id}`}>
          <rect width="32" height="32" fill="#fff" />
          <rect x="0" y="17" width="32" height="1.6" fill="#000" />
          <rect x="0" y="21" width="32" height="2" fill="#000" />
          <rect x="0" y="25.4" width="32" height="2.4" fill="#000" />
        </mask>
      </defs>
      <circle cx="16" cy="16" r="13" fill={`url(#lm-${id})`} mask={`url(#lk-${id})`} />
    </svg>
  );
}

export function Logo({ className, name = "SOLFRA" }: { className?: string; name?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[1.05rem] font-semibold tracking-[0.28em] text-ink">{name}</span>
    </span>
  );
}
