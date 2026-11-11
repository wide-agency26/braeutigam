import type { Metadata } from "next";
import Link from "next/link";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "../components/SiteChrome";
import SiteFooter from "../components/SiteFooter";
import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Impressum"),
  description: "Impressum der Bräutigam GmbH — Platzhalter bis zur finalen Rechtsprüfung.",
  alternates: { languages: { de: "/impressum", en: "/en/imprint" } },
};

export default function ImpressumPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main id="main-content" lang="de" className="mx-auto max-w-3xl px-6 py-32">
          <p className="copy-tiny text-brand-neon">
            TODO — Volltext folgt
          </p>
          <h1 className="mt-4 heading-tertiary">Impressum</h1>
          <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Bräutigam GmbH, Daimlerstraße 13, 71691 Freiberg am Neckar. Diese Seite ist ein
            Platzhalter bis der Kunde den finalen Impressumstext freigibt.
          </p>
          <p className="mt-8">
            <Link className="text-brand-neon underline-offset-4 hover:underline" href="/datenschutz">
              Datenschutz
            </Link>
          </p>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
