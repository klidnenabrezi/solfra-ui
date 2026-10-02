"use client";

import { ArrowLeft, Building2, CircleCheck, Clock, Hash, LoaderCircle, Mail, MapPin, Package, Phone, RotateCcw, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useToast } from "@/components/admin/toast";
import { ErrorState, Loading, Panel } from "@/components/admin/ui";
import { Button, buttonClass } from "@/components/ui/button";
import { NEXT_STATUS, getInquiry, updateInquiryStatus } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import type { InquiryStatus } from "@/lib/types";
import { formatDateTime, timeAgo, whatsappLink } from "@/lib/utils";

const actionLabel: Record<InquiryStatus, { label: string; icon: typeof Send }> = {
  contacted: { label: "Mark as contacted", icon: Send },
  closed: { label: "Close inquiry", icon: CircleCheck },
  new: { label: "Mark as new", icon: RotateCcw },
};

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { data, setData, error, loading, reload } = useAsync(() => getInquiry(id), [id]);
  const [busy, setBusy] = useState<InquiryStatus | null>(null);

  const changeStatus = async (status: InquiryStatus) => {
    if (!data) return;
    setBusy(status);
    try {
      const updated = await updateInquiryStatus(data.id, status);
      setData({ ...data, ...updated });
      toast("success", `Inquiry marked as ${status}.`);
    } catch (e) {
      toast("error", e instanceof ApiError ? e.message : "Couldn't update status.");
    } finally {
      setBusy(null);
    }
  };

  if (loading && !data) return <Loading />;
  if (error || !data) return <ErrorState message={error?.message ?? "Not found"} onRetry={reload} />;

  const next = NEXT_STATUS[data.status];
  const subject = `Re: your inquiry ${data.reference}${data.product ? ` — ${data.product.name}` : ""}`;

  return (
    <div className="space-y-6">
      <Link href="/admin/inquiries" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-ink">
        <ArrowLeft className="size-4" /> All inquiries
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{data.name}</h1>
            <StatusBadge status={data.status} />
          </div>
          <p className="mt-1.5 text-sm text-subtle">
            {data.company} · <span className="font-mono text-xs">{data.reference}</span> · received {timeAgo(data.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {next.map((s) => {
            const A = actionLabel[s];
            return (
              <Button key={s} size="sm" variant={s === "contacted" ? "primary" : "secondary"} disabled={!!busy} onClick={() => changeStatus(s)}>
                {busy === s ? <LoaderCircle className="size-4 animate-spin" /> : <A.icon className="size-4" />}
                {A.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel className="p-6">
            <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">Message</h2>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-ink">{data.message}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
              <a href={`mailto:${data.email}?subject=${encodeURIComponent(subject)}`} className={buttonClass("secondary", "sm")}>
                <Mail className="size-4" /> Reply by email
              </a>
              {data.phone && (
                <a href={whatsappLink(data.phone, `Hello ${data.name}, this is SOLFRA regarding your inquiry ${data.reference}.`)} target="_blank" rel="noreferrer" className={buttonClass("secondary", "sm")}>
                  <WhatsAppIcon className="size-4 text-[#25d366]" /> WhatsApp
                </a>
              )}
            </div>
          </Panel>

          <Panel>
            <h2 className="border-b border-line px-6 py-4 font-display text-base font-semibold text-ink">Notification log</h2>
            {data.notifications.length ? (
              <ul className="divide-y divide-line">
                {data.notifications.map((n) => (
                  <li key={n.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize text-ink">{n.channel}</p>
                      {n.error ? (
                        <p className="mt-0.5 font-mono text-xs text-love">{n.error}</p>
                      ) : (
                        <p className="mt-0.5 font-mono text-xs text-muted">{n.sent_at ? `sent ${formatDateTime(n.sent_at)}` : "queued"}</p>
                      )}
                    </div>
                    <StatusBadge status={n.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-8 text-sm text-subtle">No notification channels were active for this inquiry.</p>
            )}
          </Panel>
        </div>

        <Panel className="h-fit p-6">
          <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">Details</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <Detail icon={Building2} label="Company" value={data.company} />
            <Detail icon={Mail} label="Email" value={<a href={`mailto:${data.email}`} className="text-neon hover:underline">{data.email}</a>} />
            <Detail icon={Phone} label="Phone" value={data.phone ? <a href={`tel:${data.phone.replace(/\s/g, "")}`} className="hover:underline">{data.phone}</a> : null} />
            <Detail
              icon={Package}
              label="Product"
              value={data.product ? <Link href={`/products/${data.product.slug}`} target="_blank" className="text-neon hover:underline">{data.product.name}</Link> : "General inquiry"}
            />
            <Detail icon={Hash} label="Quantity" value={data.quantity} />
            <Detail icon={MapPin} label="Location" value={data.country} />
            <Detail icon={Clock} label="Received" value={formatDateTime(data.created_at)} />
            <Detail icon={RotateCcw} label="Last updated" value={formatDateTime(data.updated_at)} />
          </dl>
        </Panel>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted" />
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-0.5 break-words text-ink">{value || <span className="text-muted">—</span>}</dd>
      </div>
    </div>
  );
}
