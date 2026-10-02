"use client";

import { Archive, Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AvailabilityBadge } from "@/components/product/availability";
import { ProductImage } from "@/components/product/product-image";
import { StatusBadge } from "@/components/admin/status-badge";
import { useToast } from "@/components/admin/toast";
import { ConfirmModal, EmptyRow, ErrorState, Loading, PageHeader, Panel, selectClass, td, th } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { inputClass } from "@/components/ui/form";
import { archiveProduct, listCategories, listProducts } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import type { Product, ProductStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export default function ProductsAdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Products />
    </Suspense>
  );
}

function Products() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const toast = useToast();
  const status = (params.get("status") ?? "") as ProductStatus | "";
  const category = params.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [archiving, setArchiving] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

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

  const categories = useAsync(listCategories, []);
  const { data, error, loading, reload } = useAsync(
    () => listProducts({ status, category, search: debounced }),
    [status, category, debounced],
  );

  const confirmArchive = async () => {
    if (!archiving) return;
    setBusy(true);
    try {
      await archiveProduct(archiving.id);
      toast("success", `"${archiving.name}" archived.`);
      setArchiving(null);
      reload();
    } catch (e) {
      toast("error", e instanceof ApiError ? e.message : "Couldn't archive product.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Only published products appear on the public website."
        actions={
          <ButtonLink href="/admin/products/new" size="sm">
            <Plus className="size-4" /> Add product
          </ButtonLink>
        }
      />

      <Panel className="flex flex-col gap-3 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input type="search" aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className={inputClass(false, "h-10 pl-10")} />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => setParam("status", e.target.value)} className={selectClass}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select aria-label="Filter by category" value={category} onChange={(e) => setParam("category", e.target.value)} className={selectClass}>
          <option value="">All categories</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Panel>

      <Panel className="overflow-hidden">
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : (
          <div className="overflow-x-auto">
            <table className={cn("w-full min-w-[720px] text-sm transition-opacity", loading && "opacity-60")}>
              <thead className="border-b border-line bg-surface/40">
                <tr>
                  <th className={th}>Product</th>
                  <th className={th}>Category</th>
                  <th className={th}>Status</th>
                  <th className={th}>Availability</th>
                  <th className={th}>Updated</th>
                  <th className={`${th} text-right`}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data?.length ? (
                  data.map((p) => (
                    <tr key={p.id} className="hover:bg-overlay/30">
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <ProductImage src={p.image} alt="" sizes="64px" className="aspect-[4/3] w-16 shrink-0 rounded-lg border border-line" />
                          <div className="min-w-0">
                            <Link href={`/admin/products/${p.id}`} className="font-medium text-ink hover:text-neon">{p.name}</Link>
                            <p className="truncate font-mono text-xs text-muted">/{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`${td} text-subtle`}>{p.category.name}</td>
                      <td className={td}><StatusBadge status={p.status} /></td>
                      <td className={td}><AvailabilityBadge value={p.availability} /></td>
                      <td className={`${td} whitespace-nowrap font-mono text-xs text-muted`}>{formatDate(p.updated_at)}</td>
                      <td className={`${td} text-right`}>
                        <div className="inline-flex gap-1">
                          <Link href={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-overlay hover:text-ink">
                            <Pencil className="size-4" />
                          </Link>
                          {p.status !== "archived" && (
                            <button onClick={() => setArchiving(p)} aria-label={`Archive ${p.name}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-love/10 hover:text-love">
                              <Archive className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={6}>No products match these filters.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <ConfirmModal
        open={!!archiving}
        title="Archive product?"
        body={
          <>
            <strong className="text-ink">{archiving?.name}</strong> will be hidden from the public website. Existing inquiries keep their link to it, and you
            can restore it later by changing its status.
          </>
        }
        confirmLabel="Archive"
        busy={busy}
        onConfirm={confirmArchive}
        onClose={() => setArchiving(null)}
      />
    </div>
  );
}
