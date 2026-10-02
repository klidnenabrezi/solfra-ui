import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 -z-10 bg-grid mask-radial" aria-hidden />
      <div className="absolute left-1/2 top-1/2 -z-10 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/15 blur-[120px]" aria-hidden />
      <Link href="/" className="absolute left-4 top-5 sm:left-8">
        <Logo />
      </Link>
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon">Error 404</p>
      <h1 className="mt-4 font-display text-[clamp(5rem,18vw,11rem)] font-semibold leading-none text-gradient">404</h1>
      <p className="mt-4 max-w-md text-lg text-subtle">This page has been unplugged. Let&apos;s get you back to something that works.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">
          <ArrowLeft className="size-4" /> Back home
        </ButtonLink>
        <ButtonLink href="/products" variant="secondary">
          Browse products
        </ButtonLink>
      </div>
    </main>
  );
}
