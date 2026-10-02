"use client";

import { ArrowRight, ArrowUpRight, Inbox, Package, PackageCheck, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { ErrorState, Loading, PageHeader, Panel, td, th } from "@/components/admin/ui";
import { useAdminUser } from "@/components/admin/shell";
import { ButtonLink } from "@/components/ui/button";
import { getDashboard } from "@/lib/api/admin";
import { useAsync } from "@/lib/hooks/use-async";
import { timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAdminUser();
  const { data, error, loading, reload } = useAsync(getDashboard, []);

  const stats = data
    ? [
        { label: "Total products", value: data.total_products, icon: Package, href: "/admin/products" },
        { label: "Published", value: data.published_products, icon: PackageCheck, href: "/admin/products?status=published" },
        { label: "Total inquiries", value: data.total_inquiries, icon: Inbox, href: "/admin/inquiries" },
        { label: "New inquiries", value: data.new_inquiries, icon: Sparkles, href: "/admin/inquiries?status=new", accent: true },
      ]
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back${user ? `, ${user.name}` : ""}`}
        description="Here's what's happening with your catalog and leads."
        actions={
          <ButtonLink href="/admin/products/new" size="sm">
            <Plus className="size-4" /> Add product
          </ButtonLink>
        }
      />

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : data ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {stats.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group ring-gradient relative overflow-hidden rounded-2xl border border-line bg-card p-5 transition-transform hover:-translate-y-0.5"
              >
                {s.accent && <div className="absolute -right-8 -top-8 size-28 rounded-full bg-neon/20 blur-2xl" aria-hidden />}
                <div className="flex items-center justify-between">
                  <s.icon className={s.accent ? "size-[18px] text-neon" : "size-[18px] text-muted"} />
                  <ArrowUpRight className="size-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className={`mt-6 font-display text-3xl font-semibold sm:text-4xl ${s.accent ? "text-gradient" : "text-ink"}`}>{s.value}</p>
                <p className="mt-1 text-sm text-subtle">{s.label}</p>
              </Link>
            ))}
          </div>

          <Panel>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">Recent inquiries</h2>
              <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-neon">
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-line">
                  <tr>
                    <th className={th}>Customer</th>
                    <th className={th}>Company</th>
                    <th className={th}>Product</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data.recent_inquiries.map((i) => (
                    <tr key={i.id} className="group relative hover:bg-overlay/40">
                      <td className={td}>
                        <Link href={`/admin/inquiries/${i.id}`} className="font-medium text-ink after:absolute after:inset-0">
                          {i.name}
                        </Link>
                      </td>
                      <td className={`${td} text-subtle`}>{i.company}</td>
                      <td className={`${td} max-w-[220px] truncate text-subtle`}>{i.product?.name ?? <span className="text-muted">General</span>}</td>
                      <td className={td}><StatusBadge status={i.status} /></td>
                      <td className={`${td} whitespace-nowrap text-right font-mono text-xs text-muted`}>{timeAgo(i.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile list */}
            <ul className="divide-y divide-line md:hidden">
              {data.recent_inquiries.map((i) => (
                <li key={i.id}>
                  <Link href={`/admin/inquiries/${i.id}`} className="flex items-start justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{i.name}</p>
                      <p className="truncate text-sm text-subtle">{i.company}</p>
                      <p className="mt-1 truncate text-xs text-muted">{i.product?.name ?? "General inquiry"}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatusBadge status={i.status} />
                      <span className="font-mono text-xs text-muted">{timeAgo(i.created_at)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      ) : null}
    </div>
  );
}
