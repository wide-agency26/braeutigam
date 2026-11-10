import type { Metadata } from "next";
import Link from "next/link";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "../../components/SiteChrome";
import SiteFooter from "../../components/SiteFooter";
import { pageTitleForLocale } from "@/lib/site-nav";
import { localizedHref } from "@/lib/i18n";

export const metadata: Metadata = {
  title: pageTitleForLocale("Impressum", "en"),
  description: "Bräutigam GmbH imprint — placeholder pending legal review.",
  alternates: { languages: { de: "/impressum", en: "/en/imprint" } },
};

export default function ImprintPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main id="main-content" lang="en" className="mx-auto max-w-3xl px-6 py-32">
          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-neon">
            TODO — full text pending
          </p>
          <h1 className="mt-4 font-sans text-3xl font-light uppercase tracking-tight">Imprint</h1>
          <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Bräutigam GmbH, Daimlerstraße 13, 71691 Freiberg am Neckar, Germany. Placeholder until
            client-approved legal copy is available.
          </p>
          <p className="mt-8">
            <Link
              className="text-brand-neon underline-offset-4 hover:underline"
              href={localizedHref("/datenschutz", "en")}
            >
              Privacy policy
            </Link>
          </p>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
