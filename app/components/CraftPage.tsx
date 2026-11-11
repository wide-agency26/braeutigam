"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteHero from "./SiteHero";

/**
 * Placeholder for Figma Craft (Kohlefaser-Lösungen). Full craft site is not
 * built yet — keep chrome identical to the rest of the site.
 */
import type { Locale } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n";

export default function CraftPage({ locale = "de" }: { locale?: Locale }) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        <div className="noise-overlay pointer-events-none" />
        <SiteChrome />
        <main id="main-content" lang={locale}>
        <SiteHero scrollTarget="#craft-soon" isPageHeading={false} />

        <section
          id="craft-soon"
          className="cv-auto relative mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 md:px-12"
        >
          <p className="copy-tiny text-brand-neon">
            CRAFT // KOHLEFASER-LÖSUNGEN
          </p>
          <h1 className="font-sans text-4xl font-light uppercase tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-5xl">
            Coming soon
          </h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Manufacturing capabilities and carbon solutions are being prepared.
            In the meantime, explore open roles or get in touch.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 font-mono text-[11px] uppercase tracking-wider">
            <Link
              href={localizedHref("/karriere", locale)}
              className="text-zinc-800 underline-offset-4 hover:text-brand-neon hover:underline dark:text-zinc-200"
            >
              {locale === "en" ? "Careers" : "Karriere"}
            </Link>
            <Link
              href={localizedHref("/kontakt", locale)}
              className="text-zinc-800 underline-offset-4 hover:text-brand-neon hover:underline dark:text-zinc-200"
            >
              {locale === "en" ? "Contact" : "Kontakt"}
            </Link>
          </div>
        </section>
        </main>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
