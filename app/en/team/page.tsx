import type { Metadata } from "next";
import TeamPage from "../../components/TeamPage";
import { pageTitleForLocale } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitleForLocale("Experten", "en"),
  description: "Meet the experts behind Bräutigam carbon components.",
  alternates: { languages: { de: "/team", en: "/en/team" } },
};

export default function Page() {
  return <TeamPage locale="en" />;
}
