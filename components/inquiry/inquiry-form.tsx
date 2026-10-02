"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert as AlertTriangle, ArrowRight, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { Turnstile } from "@/components/inquiry/turnstile";
import { ApiError } from "@/lib/api/client";
import { submitInquiry } from "@/lib/api/public";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { inquirySchema, MESSAGE_MAX, type InquiryFormValues } from "@/schemas/inquiry";

type FieldName = keyof InquiryFormValues;

export function InquiryForm({
  products,
  categories,
  defaultProductId = "",
}: {
  products: Product[];
  categories: Category[];
  defaultProductId?: string;
}) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      product_id: defaultProductId,
      quantity: "",
      country: "",
      message: "",
      honeypot: "",
    },
  });

  const productId = useWatch({ control, name: "product_id" });
  const message = useWatch({ control, name: "message" }) ?? "";
  const selected = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
  const grouped = useMemo(
    () => categories.map((c) => ({ c, items: products.filter((p) => p.category_id === c.id) })).filter((g) => g.items.length),
    [categories, products],
  );

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    if (!token) {
      setFormError("Please complete the verification check before sending.");
      return;
    }
    try {
      const res = await submitInquiry({
        ...values,
        phone: values.phone || null,
        product_id: values.product_id || null,
        quantity: values.quantity || null,
        country: values.country || null,
        turnstile_token: token,
      });
      router.push(`/inquiry/success?ref=${encodeURIComponent(res.reference)}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && applyFieldErrors(e.detail, setError)) return;
      setFormError(e instanceof ApiError ? e.message : "We couldn't send your inquiry. Please check your connection and try again.");
    }
  });

  const aria = (name: FieldName) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field id="name" label="Full name" required error={errors.name?.message}>
        <input id="name" autoComplete="name" maxLength={100} className={inputClass(!!errors.name, "h-12")} {...aria("name")} {...register("name")} />
      </Field>
      <Field id="company" label="Company" required error={errors.company?.message}>
        <input id="company" autoComplete="organization" maxLength={150} className={inputClass(!!errors.company, "h-12")} {...aria("company")} {...register("company")} />
      </Field>
      <Field id="email" label="Work email" required error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" inputMode="email" className={inputClass(!!errors.email, "h-12")} {...aria("email")} {...register("email")} />
      </Field>
      <Field id="phone" label="Phone / WhatsApp" error={errors.phone?.message}>
        <input id="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} placeholder="+62 …" className={inputClass(!!errors.phone, "h-12")} {...aria("phone")} {...register("phone")} />
      </Field>

      <Field id="product_id" label="Product" className="sm:col-span-2" error={errors.product_id?.message} hint="Pick a product, or leave as a general inquiry.">
        <div className="relative">
          <select id="product_id" className={inputClass(!!errors.product_id, "h-12 appearance-none pr-10")} {...register("product_id")}>
            <option value="">General inquiry — not a specific product</option>
            {grouped.map(({ c, items }) => (
              <optgroup key={c.id} label={c.name}>
                {items.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </Field>

      {selected && (
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-card p-3 sm:col-span-2">
          <ProductImage src={selected.image} alt="" sizes="96px" className="aspect-[4/3] w-24 shrink-0 rounded-xl border border-line" />
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">{selected.category.name}</p>
            <p className="truncate font-medium text-ink">{selected.name}</p>
            <Link href={`/products/${selected.slug}`} className="text-xs text-neon hover:underline" target="_blank">
              View product ↗
            </Link>
          </div>
        </div>
      )}

      <Field id="quantity" label="Quantity / estimated need" error={errors.quantity?.message}>
        <input id="quantity" maxLength={50} placeholder="e.g. 25 units" className={inputClass(!!errors.quantity, "h-12")} {...aria("quantity")} {...register("quantity")} />
      </Field>
      <Field id="country" label="Country / location" error={errors.country?.message}>
        <input id="country" autoComplete="country-name" maxLength={80} placeholder="e.g. Jakarta, Indonesia" className={inputClass(!!errors.country, "h-12")} {...aria("country")} {...register("country")} />
      </Field>

      <Field
        id="message"
        label="Message"
        required
        className="sm:col-span-2"
        error={errors.message?.message}
        aside={
          <span className={cn("font-mono text-xs", message.length > MESSAGE_MAX ? "text-love" : "text-muted")}>
            {message.length}/{MESSAGE_MAX}
          </span>
        }
      >
        <textarea
          id="message"
          rows={6}
          placeholder="Tell us about your requirements — configuration, timeline, delivery location, anything that helps us quote accurately."
          className={inputClass(!!errors.message, "resize-y py-3 leading-relaxed")}
          {...aria("message")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2">
        <Turnstile onToken={setToken} />

        {formError && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-love/40 bg-love/10 px-4 py-3 text-sm text-love">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {formError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted sm:max-w-sm">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            <span>
              We use your details only to respond to this inquiry. See our{" "}
              <Link href="/privacy" className="text-subtle underline-offset-2 hover:text-ink hover:underline">
                privacy notice
              </Link>
              .
            </span>
          </p>
          <Button type="submit" size="lg" disabled={isSubmitting} className="sm:min-w-48">
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send Inquiry <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Maps FastAPI/Pydantic 422 `detail[].loc` onto form fields. Returns true if any matched. */
function applyFieldErrors(
  detail: unknown,
  setError: (name: FieldName, e: { message: string }) => void,
): boolean {
  const items = (detail as { detail?: Array<{ loc?: unknown[]; msg?: string }> } | undefined)?.detail;
  if (!Array.isArray(items)) return false;
  let matched = false;
  for (const it of items) {
    const field = it.loc?.[it.loc.length - 1];
    if (typeof field === "string" && field in inquirySchema.shape) {
      setError(field as FieldName, { message: it.msg ?? "Invalid value." });
      matched = true;
    }
  }
  return matched;
}
