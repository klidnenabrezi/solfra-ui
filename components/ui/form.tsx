import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass = (invalid?: boolean, className?: string) =>
  cn(
    "w-full rounded-xl border bg-surface/70 px-4 text-sm text-ink placeholder:text-muted outline-none transition-colors",
    "focus:bg-surface disabled:opacity-60",
    invalid ? "border-love/70 focus:border-love" : "border-line-strong focus:border-neon/60",
    className,
  );

export function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
  aside,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-neon" aria-hidden>*</span> : <span className="ml-1.5 text-xs font-normal text-muted">optional</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-love">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
