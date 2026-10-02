import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-on-neon shadow-[0_0_0_1px_color-mix(in_oklab,var(--neon)_40%,transparent),0_8px_30px_-8px_var(--glow)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--neon)_60%,transparent),0_12px_40px_-6px_var(--glow)] hover:brightness-110",
  secondary: "border border-line-strong bg-surface/60 text-ink hover:border-neon/60 hover:bg-overlay/70",
  ghost: "text-subtle hover:text-ink hover:bg-overlay/60",
  danger: "border border-love/40 text-love hover:bg-love/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[0.95rem]",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);

interface Common {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & Common) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & Common) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
