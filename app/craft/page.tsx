import { publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import CraftPage from "../components/CraftPage";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Leistungen"),
  description:
    "Kohlefaser-Lösungen von Bräutigam — Craft page coming soon.",
  alternates: { languages: { de: "/craft", en: "/en/craft" } },
};

export default async function Page() {
  const videos = await publicVideos("craft", "de");
  return <CraftPage video={videos[0]} />;
}
