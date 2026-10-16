"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteHero from "./SiteHero";

/**
 * Placeholder for Figma Craft (Kohlefaser-Lösungen). Full craft site is not
 * built yet — keep chrome identical to the rest of the site.
 */
export default function CraftPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        <div className="noise-overlay pointer-events-none" />
        <SiteChrome />
        <SiteHero scrollTarget="#craft-soon" isPageHeading={false} />

        <section
          id="craft-soon"
          className="cv-auto relative mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24 md:px-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-neon">
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
            <a
              href="/karriere"
              className="text-zinc-800 underline-offset-4 hover:text-brand-neon hover:underline dark:text-zinc-200"
            >
              Crew
            </a>
            <a
              href="/kontakt"
              className="text-zinc-800 underline-offset-4 hover:text-brand-neon hover:underline dark:text-zinc-200"
            >
              Contact
            </a>
          </div>
        </section>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
