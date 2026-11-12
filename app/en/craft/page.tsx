import { publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import CraftPage from "../../components/CraftPage";
import { pageTitleForLocale } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitleForLocale("Leistungen", "en"),
  description: "Bräutigam carbon solutions — craft page coming soon.",
  alternates: { languages: { de: "/craft", en: "/en/craft" } },
};

export default async function Page() {
  const videos = await publicVideos("craft", "en");
  return <CraftPage video={videos[0]} locale="en" />;
}
