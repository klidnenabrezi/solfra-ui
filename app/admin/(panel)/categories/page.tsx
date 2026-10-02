"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, ArchiveRestore, LoaderCircle, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ImageUpload } from "@/components/admin/image-upload";
import { StatusBadge } from "@/components/admin/status-badge";
import { useToast } from "@/components/admin/toast";
import { ConfirmModal, EmptyRow, ErrorState, Loading, Modal, PageHeader, Panel, td, th } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { createCategory, listCategories, setCategoryStatus, updateCategory } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { categorySchema, type CategoryFormValues } from "@/schemas/admin";

export default function CategoriesPage() {
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(listCategories, []);
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [archiving, setArchiving] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const toggleArchive = async (c: Category, status: Category["status"]) => {
    setBusy(true);
    try {
      await setCategoryStatus(c.id, status);
      toast("success", status === "archived" ? `"${c.name}" archived.` : `"${c.name}" restored.`);
      setArchiving(null);
      reload();
    } catch (e) {
      toast("error", e instanceof ApiError ? e.message : "Couldn't update category.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Categories with products are archived, never deleted."
        actions={
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> Add category
          </Button>
        }
      />

      <Panel className="overflow-hidden">
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line bg-surface/40">
                <tr>
                  <th className={th}>Category</th>
                  <th className={th}>Products</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data?.length ? (
                  data.map((c) => (
                    <tr key={c.id} className="hover:bg-overlay/30">
                      <td className={td}>
                        <p className="font-medium text-ink">{c.name}</p>
                        <p className="font-mono text-xs text-muted">/{c.slug}</p>
                        <p className="mt-1 line-clamp-1 max-w-md text-xs text-subtle">{c.description}</p>
                      </td>
                      <td className={td}>
                        <Link href={`/admin/products?category=${c.id}`} className="font-mono text-subtle hover:text-neon">{c.product_count}</Link>
                      </td>
                      <td className={td}><StatusBadge status={c.status} /></td>
                      <td className={`${td} text-right`}>
                        <div className="inline-flex gap-1">
                          <button onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-overlay hover:text-ink">
                            <Pencil className="size-4" />
                          </button>
                          {c.status === "published" ? (
                            <button onClick={() => setArchiving(c)} aria-label={`Archive ${c.name}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-love/10 hover:text-love">
                              <Archive className="size-4" />
                            </button>
                          ) : (
                            <button onClick={() => toggleArchive(c, "published")} disabled={busy} aria-label={`Restore ${c.name}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-foam/10 hover:text-foam">
                              <ArchiveRestore className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={4}>No categories yet.</EmptyRow>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "New category" : "Edit category"} className="max-w-xl">
        {editing && (
          <CategoryForm
            category={editing === "new" ? undefined : editing}
            onDone={(msg) => {
              toast("success", msg);
              setEditing(null);
              reload();
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!archiving}
        title="Archive category?"
        body={
          <>
            <strong className="text-ink">{archiving?.name}</strong> will be hidden from the public catalog
            {archiving?.product_count ? ` along with its ${archiving.product_count} product listing(s) in the category filter` : ""}. Nothing is deleted.
          </>
        }
        confirmLabel="Archive"
        busy={busy}
        onConfirm={() => archiving && toggleArchive(archiving, "archived")}
        onClose={() => setArchiving(null)}
      />
    </div>
  );
}

function CategoryForm({ category, onDone, onCancel }: { category?: Category; onDone: (msg: string) => void; onCancel: () => void }) {
  const [image, setImage] = useState<string | null>(category?.image ?? null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, control, formState } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "", description: category?.description ?? "", status: category?.status ?? "published" },
  });
  const name = useWatch({ control, name: "name" });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      if (category) {
        await updateCategory(category.id, { ...values, image });
        onDone("Category saved.");
      } else {
        await createCategory({ ...values, image });
        onDone("Category created.");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't save category.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field id="cat-name" label="Name" required error={formState.errors.name?.message} hint={<>Slug: <span className="font-mono">{slugify(name || "") || "…"}</span></>}>
        <input id="cat-name" className={inputClass(!!formState.errors.name, "h-11")} {...register("name")} />
      </Field>
      <Field id="cat-desc" label="Description" error={formState.errors.description?.message}>
        <textarea id="cat-desc" rows={3} className={inputClass(!!formState.errors.description, "resize-y py-3")} {...register("description")} />
      </Field>
      <Field id="cat-status" label="Status" required>
        <select id="cat-status" className={inputClass(false, "h-11")} {...register("status")}>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </Field>
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Image <span className="ml-1 text-xs font-normal text-muted">optional</span></p>
        <ImageUpload value={image} onChange={setImage} label="Category image" className="max-w-xs" />
      </div>
      {error && <p role="alert" className="text-sm text-love">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          {category ? "Save" : "Create"}
        </Button>
      </div>
    </form>
  );
}
