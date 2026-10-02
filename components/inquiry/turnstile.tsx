"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
export const PLACEHOLDER_TOKEN = "turnstile-placeholder-token";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loader: Promise<void> | null = null;
function loadScript() {
  loader ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
  return loader;
}

/** Cloudflare Turnstile (TechDoc §11.2). Without a site key, renders a placeholder. */
export function Turnstile({ onToken, theme = "auto" }: { onToken: (token: string) => void; theme?: "auto" | "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  });

  useEffect(() => {
    if (!SITE_KEY) {
      cb.current(PLACEHOLDER_TOKEN);
      return;
    }
    let id: string | undefined;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        id = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          theme,
          callback: (t: string) => cb.current(t),
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      })
      .catch(() => cb.current(""));
    return () => {
      cancelled = true;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [theme]);

  if (!SITE_KEY) {
    return (
      <div className="flex h-[65px] w-full max-w-[300px] items-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface/50 px-4 text-xs text-muted">
        <ShieldCheck className="size-5 shrink-0 text-foam" />
        <span>
          Turnstile placeholder
          <br />
          <span className="font-mono text-[0.65rem]">set NEXT_PUBLIC_TURNSTILE_SITE_KEY</span>
        </span>
      </div>
    );
  }
  return <div ref={ref} className="min-h-[65px]" />;
}
