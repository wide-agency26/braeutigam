import type { Metadata } from "next";
import HomePage from "../components/HomePage";
import { pageTitleForLocale } from "@/lib/site-nav";
import { getRequestHeroSlide } from "@/lib/hero-request";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageTitleForLocale("Start", "en"),
  description:
    "Bräutigam GmbH — premium carbon fiber in Freiberg am Neckar for motorsport and series production.",
  alternates: { languages: { de: "/", en: "/en" } },
};

export default async function Page() {
  const heroSlide = await getRequestHeroSlide();
  // SiteHero's Next/Image priority already preloads the responsive sources.
  return <HomePage heroSlide={heroSlide} locale="en" />;
}
