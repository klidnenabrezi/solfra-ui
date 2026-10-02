"use client";

import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Package,
  Settings,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { logout, me } from "@/lib/api/admin";
import { ApiError, USE_MOCK } from "@/lib/api/client";
import type { AdminUser } from "@/lib/types";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const UserCtx = createContext<AdminUser | null>(null);
export const useAdminUser = () => useContext(UserCtx);

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  // The drawer belongs to the page it was opened on, so navigating closes it.
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const drawer = drawerPath === pathname;
  const setDrawer = (open: boolean) => setDrawerPath(open ? pathname : null);

  useEffect(() => {
    me()
      .then(setUser)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        }
      });
    // Only on mount: the session doesn't change with navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await logout().catch(() => {});
    router.replace("/admin/login");
  };

  if (!user) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <LoaderCircle className="size-5 animate-spin text-neon" aria-label="Loading" />
      </div>
    );
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <LogoMark className="size-7" />
          <span className="font-display text-sm font-semibold tracking-[0.24em] text-ink">SOLFRA</span>
          <span className="rounded-md border border-line-strong px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted">Admin</span>
        </Link>
        <button className="lg:hidden text-muted hover:text-ink" onClick={() => setDrawer(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4" aria-label="Admin">
        <ul className="space-y-1">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive(n.href) ? "bg-overlay text-ink" : "text-subtle hover:bg-overlay/50 hover:text-ink",
                )}
              >
                {isActive(n.href) && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-brand" aria-hidden />}
                <n.icon className={cn("size-[18px]", isActive(n.href) ? "text-neon" : "text-muted group-hover:text-subtle")} />
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-subtle hover:bg-overlay/50 hover:text-ink">
          <ExternalLink className="size-[18px] text-muted" /> View website
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-brand font-display text-sm font-semibold uppercase text-on-neon">
            {user.name.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <button onClick={signOut} aria-label="Sign out" title="Sign out" className="grid size-8 place-items-center rounded-lg text-muted hover:bg-overlay hover:text-love">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <UserCtx.Provider value={user}>
      <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-dvh border-r border-line bg-deep lg:block">{sidebar}</aside>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-deep/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-deep">{sidebar}</aside>
          </div>
        )}

        <div className="min-w-0">
          <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button className="grid size-9 place-items-center rounded-lg text-subtle hover:bg-overlay lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu">
                <Menu className="size-5" />
              </button>
              <span className="text-sm text-muted">
                {nav.find((n) => isActive(n.href))?.label ?? "Admin"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {USE_MOCK && (
                <span className="hidden rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold sm:inline">
                  Mock data
                </span>
              )}
              <ThemeToggle />
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
        </div>
      </div>
    </UserCtx.Provider>
  );
}
