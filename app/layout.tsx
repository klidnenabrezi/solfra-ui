import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solfra.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "SOLFRA — Enterprise hardware for every desk, rack and room", template: "%s · SOLFRA" },
  description:
    "Servers, workstations, networking, displays and office hardware for businesses — sourced, configured and delivered ready to work.",
  openGraph: { type: "website", siteName: "SOLFRA", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#191724" },
    { media: "(prefers-color-scheme: light)", color: "#faf4ed" },
  ],
};

// Runs before paint: dark is the default, a stored choice wins.
const themeScript = `(function(){try{var t=localStorage.getItem("solfra-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}document.documentElement.dataset.js=""})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const beacon = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        {children}
        {beacon && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: beacon })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
