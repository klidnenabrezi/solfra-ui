"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyRow, ErrorState, Loading, PageHeader, Panel, td, th } from "@/components/admin/ui";
import { inputClass } from "@/components/ui/form";
import { listInquiries } from "@/lib/api/admin";
import { useAsync } from "@/lib/hooks/use-async";
import type { InquiryStatus } from "@/lib/types";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";

const statuses: Array<{ value: InquiryStatus | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default function InquiriesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Inquiries />
    </Suspense>
  );
}

function Inquiries() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const status = (params.get("status") ?? "") as InquiryStatus | "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [debounced, setDebounced] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const { data, error, loading, reload } = useAsync(
    () => listInquiries({ status, search: debounced, from, to }),
    [status, debounced, from, to],
  );
  const filtered = !!(status || debounced || from || to);

  return (
    <div className="space-y-6">
      <PageHeader title="Inquiries" description="Every inquiry submitted through the website, newest first." />

      <Panel className="space-y-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              aria-label="Search inquiries"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email, reference…"
              className={inputClass(false, "h-10 pl-10")}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="from">From date</label>
            <input id="from" type="date" value={from} max={to || undefined} onChange={(e) => setParam("from", e.target.value)} className={inputClass(false, "h-10 w-auto [color-scheme:inherit]")} />
            <span className="text-muted">–</span>
            <label className="sr-only" htmlFor="to">To date</label>
            <input id="to" type="date" value={to} min={from || undefined} onChange={(e) => setParam("to", e.target.value)} className={inputClass(false, "h-10 w-auto")} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label="Filter by status" className="inline-flex rounded-xl border border-line bg-surface/60 p-1">
            {statuses.map((s) => (
              <button
                key={s.label}
                role="tab"
                aria-selected={status === s.value}
                onClick={() => setParam("status", s.value)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm transition-colors",
                  status === s.value ? "bg-overlay text-ink shadow-sm" : "text-subtle hover:text-ink",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          {filtered && (
            <button
              onClick={() => {
                setSearch("");
                router.replace(pathname, { scroll: false });
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-muted hover:text-ink"
            >
              <X className="size-3.5" /> Clear filters
            </button>
          )}
          {data && <span className="ml-auto font-mono text-xs text-muted">{data.length} results</span>}
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className={cn("w-full text-sm transition-opacity", loading && "opacity-60")}>
                <thead className="border-b border-line bg-surface/40">
                  <tr>
                    <th className={th}>Reference</th>
                    <th className={th}>Customer</th>
                    <th className={th}>Product</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data?.length ? (
                    data.map((i) => (
                      <tr key={i.id} className="relative hover:bg-overlay/40">
                        <td className={`${td} font-mono text-xs text-muted`}>{i.reference}</td>
                        <td className={td}>
                          <Link href={`/admin/inquiries/${i.id}`} className="font-medium text-ink after:absolute after:inset-0">
                            {i.name}
                          </Link>
                          <p className="text-xs text-subtle">{i.company}</p>
                        </td>
                        <td className={`${td} max-w-[240px] truncate text-subtle`}>{i.product?.name ?? <span className="text-muted">General inquiry</span>}</td>
                        <td className={td}><StatusBadge status={i.status} /></td>
                        <td className={`${td} whitespace-nowrap text-right`} title={formatDateTime(i.created_at)}>
                          <span className="font-mono text-xs text-muted">{timeAgo(i.created_at)}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow colSpan={5}>No inquiries match these filters.</EmptyRow>
                  )}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-line md:hidden">
              {data?.length ? (
                data.map((i) => (
                  <li key={i.id}>
                    <Link href={`/admin/inquiries/${i.id}`} className="block px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-ink">{i.name}</p>
                        <StatusBadge status={i.status} />
                      </div>
                      <p className="text-sm text-subtle">{i.company}</p>
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
                        <span className="truncate">{i.product?.name ?? "General inquiry"}</span>
                        <span className="shrink-0 font-mono">{timeAgo(i.created_at)}</span>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-14 text-center text-sm text-subtle">No inquiries match these filters.</li>
              )}
            </ul>
          </>
        )}
      </Panel>
    </div>
  );
}
