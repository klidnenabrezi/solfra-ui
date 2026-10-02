"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/admin/image-upload";
import { useToast } from "@/components/admin/toast";
import { ErrorState, Loading, PageHeader, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { getAdminSettings, updateSettings } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import type { CompanySettings } from "@/lib/types";
import { settingsSchema, type SettingsFormValues } from "@/schemas/admin";

export default function SettingsPage() {
  const { data, error, reload } = useAsync(getAdminSettings, []);
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!data) return <Loading />;
  return <SettingsForm initial={data} />;
}

function SettingsForm({ initial }: { initial: CompanySettings }) {
  const toast = useToast();
  const [logo, setLogo] = useState(initial.logo);
  const { register, handleSubmit, formState, reset } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...initial,
      social: { linkedin: "", instagram: "", facebook: "", youtube: "", ...initial.social },
    },
  });
  const { errors, isSubmitting, isDirty } = formState;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const saved = await updateSettings({ ...values, logo });
      reset({ ...saved, social: { linkedin: "", instagram: "", facebook: "", youtube: "", ...saved.social } });
      toast("success", "Settings saved.");
    } catch (e) {
      toast("error", e instanceof ApiError ? e.message : "Couldn't save settings.");
    }
  });

  const text = (name: keyof Omit<SettingsFormValues, "social">, label: string, opts: { required?: boolean; hint?: string; type?: string; placeholder?: string } = {}) => (
    <Field id={name} label={label} required={opts.required} error={errors[name]?.message} hint={opts.hint}>
      <input id={name} type={opts.type ?? "text"} placeholder={opts.placeholder} className={inputClass(!!errors[name], "h-11")} {...register(name)} />
    </Field>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <PageHeader title="Company settings" description="Shown across the public website — header, footer, contact page and WhatsApp links." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel className="space-y-5 p-6">
            <h2 className="font-display text-base font-semibold text-ink">Company profile</h2>
            {text("company_name", "Company name", { required: true })}
            {text("tagline", "Tagline")}
            <Field id="description" label="Short description" error={errors.description?.message} hint="Used on the homepage hero and About page.">
              <textarea id="description" rows={3} className={inputClass(!!errors.description, "resize-y py-3")} {...register("description")} />
            </Field>
          </Panel>

          <Panel className="grid gap-5 p-6 sm:grid-cols-2">
            <h2 className="font-display text-base font-semibold text-ink sm:col-span-2">Contact</h2>
            {text("email", "Email", { required: true, type: "email" })}
            {text("phone", "Phone", { type: "tel" })}
            {text("whatsapp", "WhatsApp number", { required: true, hint: "Digits only, incl. country code — used for wa.me links.", placeholder: "6281234567890" })}
            {text("business_hours", "Business hours")}
            <Field id="address" label="Address" className="sm:col-span-2" error={errors.address?.message}>
              <textarea id="address" rows={2} className={inputClass(!!errors.address, "resize-y py-3")} {...register("address")} />
            </Field>
          </Panel>

          <Panel className="grid gap-5 p-6 sm:grid-cols-2">
            <h2 className="font-display text-base font-semibold text-ink sm:col-span-2">Social links</h2>
            {(["linkedin", "instagram", "facebook", "youtube"] as const).map((k) => (
              <Field key={k} id={`social-${k}`} label={k[0].toUpperCase() + k.slice(1)} error={errors.social?.[k]?.message}>
                <input id={`social-${k}`} type="url" placeholder="https://" className={inputClass(!!errors.social?.[k], "h-11")} {...register(`social.${k}`)} />
              </Field>
            ))}
          </Panel>
        </div>

        <Panel className="h-fit p-6">
          <h2 className="mb-1 font-display text-base font-semibold text-ink">Logo</h2>
          <p className="mb-4 text-xs text-muted">Until a logo is uploaded, the placeholder wordmark is used.</p>
          <ImageUpload value={logo} onChange={setLogo} label="Logo" />
        </Panel>
      </div>

      <div className="glass sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-line-strong px-5 py-3 shadow-2xl">
        <p className="text-sm text-muted">{isDirty || logo !== initial.logo ? "Unsaved changes" : "All changes saved"}</p>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Save settings
        </Button>
      </div>
    </form>
  );
}
