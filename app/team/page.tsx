import type { Metadata } from "next";
import TeamPage from "../components/TeamPage";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Experten"),
  description:
    "Lernen Sie die Expertinnen und Experten hinter den Carbon-Komponenten von Bräutigam kennen.",
};

export default function Page() {
  return <TeamPage />;
}
