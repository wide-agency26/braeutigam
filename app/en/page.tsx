import type { Metadata } from "next";
import HomePage from "../components/HomePage";
import HeroPhotoPreload from "../components/HeroPhotoPreload";
import { pageTitleForLocale } from "@/lib/site-nav";
import { activeHeroSlides, pickRandomHeroSlide } from "@/lib/hero-slides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageTitleForLocale("Start", "en"),
  description:
    "Bräutigam GmbH — premium carbon fiber in Freiberg am Neckar for motorsport and series production.",
  alternates: { languages: { de: "/", en: "/en" } },
};

export default function Page() {
  const heroSlide = pickRandomHeroSlide();
  const fallback = activeHeroSlides()[0];
  const lightSrc = heroSlide?.light ?? fallback?.light ?? "/images/hero/gwagon_light.jpeg";
  const darkSrc = heroSlide?.dark ?? fallback?.dark ?? "/images/hero/gwagon_dark.jpeg";
  return (
    <>
      <HeroPhotoPreload lightSrc={lightSrc} darkSrc={darkSrc} />
      <HomePage heroSlide={heroSlide} locale="en" />
    </>
  );
}
