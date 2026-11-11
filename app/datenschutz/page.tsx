import type { Metadata } from "next";
import Link from "next/link";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "../components/SiteChrome";
import SiteFooter from "../components/SiteFooter";
import { pageTitle } from "@/lib/site-nav";

const SECTIONS = [
  "Bewerbungen & Lebensläufe (Speicherung, 30-Tage-Löschung)",
  "Empfohlen-von-Feld",
  "Kontaktformular & E-Mail",
  "YouTube-Einbettungen (nach Klick)",
  "OpenStreetMap-Karte (nach Klick)",
  "Social-Media-Links",
] as const;

export const metadata: Metadata = {
  title: pageTitle("Datenschutz"),
  description: "Datenschutzhinweise der Bräutigam GmbH — Gliederung als Platzhalter.",
  alternates: { languages: { de: "/datenschutz", en: "/en/privacy" } },
};

export default function DatenschutzPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main id="main-content" lang="de" className="mx-auto max-w-3xl px-6 py-32">
          <p className="copy-tiny text-brand-neon">
            TODO — Volltext folgt
          </p>
          <h1 className="mt-4 heading-tertiary">
            Datenschutz
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Übersicht der Abschnitte, die in der finalen Datenschutzerklärung ausgearbeitet werden:
          </p>
          <ul className="mt-6 list-disc space-y-2 pl-6 text-sm text-zinc-700 dark:text-zinc-300">
            {SECTIONS.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
          <p className="mt-8">
            <Link className="text-brand-neon underline-offset-4 hover:underline" href="/impressum">
              Impressum
            </Link>
          </p>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
