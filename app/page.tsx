import { publicTeam, publicReels, publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import HomePage from "./components/HomePage";
import { pageTitle } from "@/lib/site-nav";
import { pickRandomHeroSlide } from "@/lib/hero-slides";

export const metadata: Metadata = {
  title: pageTitle("Start"),
  description:
    "Bräutigam GmbH — Premium-Carbon in Freiberg am Neckar für Motorsport und Serienfertigung.",
  alternates: { languages: { de: "/", en: "/en" } },
};

/**
 * Server entry — keeps metadata/layout on the server and mounts a single
 * client island for the interactive page. Theme lives on <html class="dark">
 * so static markup can still theme via CSS without prop drilling.
 */
export default async function Page() {
  const heroSlide = pickRandomHeroSlide();
  const [experts, reels, videos] = await Promise.all([publicTeam("de"), publicReels("de"), publicVideos("home", "de")]);
  return <HomePage heroSlide={heroSlide} experts={experts} reels={reels} video={videos[0]} />;
}
