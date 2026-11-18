import type { Metadata } from "next";
import CraftPage from "../components/CraftPage";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Leistungen"),
  description:
    "Kohlefaser-Lösungen von Bräutigam: Entwicklung, Werkzeugbau, Fertigung und Qualitätssicherung aus einer Hand.",
  alternates: { languages: { de: "/craft", en: "/en/craft" } },
};

export default function Page() {
  return <CraftPage />;
}
