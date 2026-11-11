import type { Metadata } from "next";
import Link from "next/link";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "../../components/SiteChrome";
import SiteFooter from "../../components/SiteFooter";
import { pageTitleForLocale } from "@/lib/site-nav";
import { localizedHref } from "@/lib/i18n";

const SECTIONS = [
  "Job applications & CV retention (30-day deletion)",
  "Referral field",
  "Contact form & email",
  "YouTube embeds (click-to-load)",
  "OpenStreetMap (click-to-load)",
  "Social media links",
] as const;

export const metadata: Metadata = {
  title: pageTitleForLocale("Datenschutz", "en"),
  description: "Bräutigam GmbH privacy notice — outline placeholder.",
  alternates: { languages: { de: "/datenschutz", en: "/en/privacy" } },
};

export default function PrivacyPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main id="main-content" lang="en" className="mx-auto max-w-3xl px-6 py-32">
          <p className="copy-tiny text-brand-neon">
            TODO — full text pending
          </p>
          <h1 className="mt-4 heading-tertiary">
            Privacy policy
          </h1>
          <ul className="mt-6 list-disc space-y-2 pl-6 text-sm text-zinc-700 dark:text-zinc-300">
            {SECTIONS.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
          <p className="mt-8">
            <Link
              className="text-brand-neon underline-offset-4 hover:underline"
              href={localizedHref("/impressum", "en")}
            >
              Imprint
            </Link>
          </p>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
