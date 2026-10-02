"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { login } from "@/lib/api/admin";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import { loginSchema, type LoginValues } from "@/schemas/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: USE_MOCK ? "admin@solfra.example" : "", password: "" },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next?.startsWith("/admin") ? next : "/admin");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't reach the server. Try again.");
    }
  });

  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-grid mask-radial" aria-hidden />
      <div className="absolute left-1/2 top-1/3 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-neon/15 blur-[130px]" aria-hidden />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px]">
        <Link href="/" className="mx-auto mb-10 flex w-fit">
          <Logo />
        </Link>
        <div className="relative rounded-3xl border border-line-strong bg-card p-7 shadow-[0_40px_120px_-50px_var(--glow)] backdrop-blur sm:p-9">
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-brand" aria-hidden />
          <div className="grid size-11 place-items-center rounded-xl border border-line-strong bg-overlay/60 text-neon">
            <Lock className="size-5" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-subtle">Manage products, categories and inquiries.</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <Field id="email" label="Email" required error={formState.errors.email?.message}>
              <input id="email" type="email" autoComplete="username" className={inputClass(!!formState.errors.email, "h-12")} {...register("email")} />
            </Field>
            <Field id="password" label="Password" required error={formState.errors.password?.message}>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className={inputClass(!!formState.errors.password, "h-12 pr-12")}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            {error && (
              <p role="alert" className="rounded-xl border border-love/40 bg-love/10 px-4 py-3 text-sm text-love">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
              Sign in {!formState.isSubmitting && <ArrowRight className="size-4" />}
            </Button>
          </form>
          {USE_MOCK && (
            <p className="mt-6 rounded-xl border border-dashed border-line-strong px-4 py-3 text-xs text-muted">
              <span className="font-mono text-gold">MOCK MODE</span> — any email and a password of 4+ characters will sign you in.
            </p>
          )}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck className="size-3.5 text-foam" /> Protected by Cloudflare Access · sessions expire after 8 hours
        </p>
      </div>
    </main>
  );
}
