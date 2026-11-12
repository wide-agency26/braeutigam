import { publicTeam, publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import TeamPage from "../components/TeamPage";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Experten"),
  description:
    "Lernen Sie die Expertinnen und Experten hinter den Carbon-Komponenten von Bräutigam kennen.",
  alternates: { languages: { de: "/team", en: "/en/team" } },
};

export default async function Page() {
  const [experts, videos] = await Promise.all([publicTeam("de"), publicVideos("team", "de")]);
  return <TeamPage experts={experts} video={videos[0]} />;
}
