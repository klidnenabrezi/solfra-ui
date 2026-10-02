"use client";

import { TriangleAlert, LoaderCircle } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-subtle">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-card", className)}>{children}</div>;
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-sm text-subtle">
      <LoaderCircle className="size-4 animate-spin text-neon" /> {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <TriangleAlert className="size-6 text-love" />
      <p className="text-sm text-subtle">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-16 text-center text-sm text-subtle">
        {children}
      </td>
    </tr>
  );
}

export const th = "px-5 py-3 text-left font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-muted whitespace-nowrap";
export const td = "px-5 py-3.5 align-middle";
export const selectClass =
  "h-10 rounded-xl border border-line-strong bg-surface/70 px-3 pr-8 text-sm text-ink outline-none focus:border-neon/60";

/** Accessible modal built on <dialog>. */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-2xl backdrop:bg-deep/70 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {open && (
        <div className="p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="text-sm leading-relaxed text-subtle">{body}</div>
      <div className="mt-7 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm} disabled={busy}>
          {busy && <LoaderCircle className="size-4 animate-spin" />} {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
