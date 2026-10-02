import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { getCategories, getSettings } from "@/lib/api/public";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <>
      <Navbar />
      <main id="main" className="pt-16">
        {children}
      </main>
      <Footer settings={settings} categories={categories} />
      <WhatsAppButton number={settings.whatsapp} />
    </>
  );
}
