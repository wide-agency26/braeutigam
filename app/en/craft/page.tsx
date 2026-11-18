import type { Metadata } from "next";
import CraftPage from "../../components/CraftPage";
import { pageTitleForLocale } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitleForLocale("Leistungen", "en"),
  description: "From CAD and tooling to prepreg layup, autoclave curing and quality assurance: explore Bräutigam’s in-house carbon manufacturing process.",
  alternates: { languages: { de: "/craft", en: "/en/craft" } },
};

export default function Page() {
  return <CraftPage locale="en" />;
}
