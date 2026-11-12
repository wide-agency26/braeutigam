import { publicTeam, publicReels, publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import HomePage from "../components/HomePage";
import { pageTitleForLocale } from "@/lib/site-nav";
import { pickRandomHeroSlide } from "@/lib/hero-slides";

export const metadata: Metadata = {
  title: pageTitleForLocale("Start", "en"),
  description:
    "Bräutigam GmbH — premium carbon fiber in Freiberg am Neckar for motorsport and series production.",
  alternates: { languages: { de: "/", en: "/en" } },
};

export default async function Page() {
  const heroSlide = pickRandomHeroSlide();
  const [experts, reels, videos] = await Promise.all([publicTeam("en"), publicReels("en"), publicVideos("home", "en")]);
  return <HomePage heroSlide={heroSlide} experts={experts} reels={reels} video={videos[0]} locale="en" />;
}
