"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ExternalLink, GripVertical, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ImageUpload } from "@/components/admin/image-upload";
import { useToast } from "@/components/admin/toast";
import { Panel } from "@/components/admin/ui";
import { availabilityMeta } from "@/components/product/availability";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { createProduct, updateProduct } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { Category, Product, ProductAvailability, ProductStatus } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { productSchema, type ProductFormValues } from "@/schemas/admin";

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const toast = useToast();
  const [image, setImage] = useState<string | null>(product?.image ?? null);
  const [imageDirty, setImageDirty] = useState(false);

  const { register, handleSubmit, control, formState } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      category_id: product?.category_id ?? "",
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      status: product?.status ?? "draft",
      availability: product?.availability ?? "in_stock",
      featured: product?.featured ?? false,
      specifications: product?.specifications ?? [{ name: "", value: "" }],
    },
  });
  const specs = useFieldArray({ control, name: "specifications" });
  const name = useWatch({ control, name: "name" });
  const { errors, isSubmitting, isDirty } = formState;

  const onSubmit = handleSubmit(async (values) => {
    const input = { ...values, image };
    try {
      if (product) {
        await updateProduct(product.id, input);
        toast("success", "Product saved.");
        router.push("/admin/products");
      } else {
        await createProduct(input);
        toast("success", "Product created.");
        router.push("/admin/products");
      }
    } catch (e) {
      toast("error", e instanceof ApiError ? e.message : "Couldn't save product.");
    }
  });

  const live = categories.filter((c) => c.status === "published" || c.id === product?.category_id);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-subtle hover:text-ink">
            <ArrowLeft className="size-4" /> Products
          </Link>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">{product ? "Edit product" : "New product"}</h1>
        </div>
        {product?.status === "published" && (
          <Link href={`/products/${product.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-neon">
            View on site <ExternalLink className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel className="space-y-5 p-6">
            <h2 className="font-display text-base font-semibold text-ink">Basics</h2>
            <Field id="name" label="Product name" required error={errors.name?.message} hint={<>URL: <span className="font-mono">/products/{slugify(name || "…") || "…"}</span></>}>
              <input id="name" className={inputClass(!!errors.name, "h-11")} {...register("name")} />
            </Field>
            <Field id="category_id" label="Category" required error={errors.category_id?.message}>
              <select id="category_id" className={inputClass(!!errors.category_id, "h-11")} {...register("category_id")}>
                <option value="">Choose a category…</option>
                {live.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.status === "archived" ? " (archived)" : ""}</option>
                ))}
              </select>
            </Field>
            <Field id="short_description" label="Short description" required error={errors.short_description?.message} hint="Shown on product cards. One sentence.">
              <input id="short_description" maxLength={200} className={inputClass(!!errors.short_description, "h-11")} {...register("short_description")} />
            </Field>
            <Field id="description" label="Full description" error={errors.description?.message}>
              <textarea id="description" rows={6} className={inputClass(!!errors.description, "resize-y py-3 leading-relaxed")} {...register("description")} />
            </Field>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-semibold text-ink">Specifications</h2>
                <p className="mt-0.5 text-xs text-muted">Stored as name/value pairs.</p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => specs.append({ name: "", value: "" })}>
                <Plus className="size-4" /> Add row
              </Button>
            </div>
            <ul className="mt-5 space-y-2">
              {specs.fields.map((f, i) => (
                <li key={f.id} className="flex items-start gap-2">
                  <GripVertical className="mt-3 size-4 shrink-0 text-muted" aria-hidden />
                  <div className="grid flex-1 gap-2 sm:grid-cols-[2fr_3fr]">
                    <input aria-label={`Spec ${i + 1} name`} placeholder="e.g. Memory" className={inputClass(!!errors.specifications?.[i]?.name, "h-10")} {...register(`specifications.${i}.name`)} />
                    <input aria-label={`Spec ${i + 1} value`} placeholder="e.g. Up to 2 TB DDR5" className={inputClass(!!errors.specifications?.[i]?.value, "h-10")} {...register(`specifications.${i}.value`)} />
                  </div>
                  <button type="button" onClick={() => specs.remove(i)} aria-label={`Remove spec ${i + 1}`} className="grid size-10 shrink-0 place-items-center rounded-xl text-muted hover:bg-love/10 hover:text-love">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
              {!specs.fields.length && <li className="rounded-xl border border-dashed border-line-strong py-6 text-center text-sm text-muted">No specifications yet.</li>}
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="space-y-5 p-6">
            <h2 className="font-display text-base font-semibold text-ink">Publishing</h2>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <fieldset>
                  <legend className="text-sm font-medium text-ink">Status</legend>
                  <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface/60 p-1">
                    {(["draft", "published", "archived"] as ProductStatus[]).map((s) => (
                      <label key={s} className={cn("cursor-pointer rounded-lg py-2 text-center text-sm capitalize transition-colors has-focus-visible:ring-2 has-focus-visible:ring-neon", field.value === s ? "bg-overlay text-ink" : "text-subtle hover:text-ink")}>
                        <input type="radio" className="sr-only" value={s} checked={field.value === s} onChange={() => field.onChange(s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            />
            <Field id="availability" label="Availability" required>
              <select id="availability" className={inputClass(false, "h-11")} {...register("availability")}>
                {(Object.keys(availabilityMeta) as ProductAvailability[]).map((a) => (
                  <option key={a} value={a}>{availabilityMeta[a].label}</option>
                ))}
              </select>
            </Field>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
              <span>
                <span className="block text-sm font-medium text-ink">Featured on homepage</span>
                <span className="text-xs text-muted">Shown in the &ldquo;Popular&rdquo; section.</span>
              </span>
              <input type="checkbox" className="peer sr-only" {...register("featured")} />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-overlay transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-subtle after:transition-transform peer-checked:bg-neon peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-neon" />
            </label>
          </Panel>

          <Panel className="p-6">
            <h2 className="mb-4 font-display text-base font-semibold text-ink">Image</h2>
            <ImageUpload
              value={image}
              onChange={(v) => {
                setImage(v);
                setImageDirty(true);
              }}
              label="Product image"
            />
          </Panel>
        </div>
      </div>

      <div className="glass sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-line-strong px-5 py-3 shadow-2xl">
        <p className="text-sm text-muted">{isDirty || imageDirty ? "Unsaved changes" : product ? "No changes" : "Fill in the details"}</p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {product ? "Save changes" : "Create product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
