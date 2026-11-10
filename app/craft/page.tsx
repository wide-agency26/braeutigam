import type { Metadata } from "next";
import CraftPage from "../components/CraftPage";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Leistungen"),
  description:
    "Kohlefaser-Lösungen von Bräutigam — Craft page coming soon.",
};

export default function Page() {
  return <CraftPage />;
}
