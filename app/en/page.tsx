import type { Metadata } from "next";
import HomePage from "../components/HomePage";
import { pageTitleForLocale } from "@/lib/site-nav";
export const metadata: Metadata = {
  title: pageTitleForLocale("Start", "en"),
  description:
    "Bräutigam GmbH — premium carbon fiber in Freiberg am Neckar for motorsport and series production.",
  alternates: { languages: { de: "/", en: "/en" } },
};

export default function Page() {
  return <HomePage locale="en" />;
}
