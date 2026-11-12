import { publicTeam, publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import TeamPage from "../../components/TeamPage";
import { pageTitleForLocale } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitleForLocale("Experten", "en"),
  description: "Meet the experts behind Bräutigam carbon components.",
  alternates: { languages: { de: "/team", en: "/en/team" } },
};

export default async function Page() {
  const [experts, videos] = await Promise.all([publicTeam("en"), publicVideos("team", "en")]);
  return <TeamPage experts={experts} video={videos[0]} locale="en" />;
}
