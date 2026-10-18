import type { Metadata } from "next";
import TeamPage from "../components/TeamPage";

export const metadata: Metadata = {
  title: "Team | Bräutigam GmbH",
  description:
    "Lernen Sie die Expertinnen und Experten hinter den Carbon-Komponenten von Bräutigam kennen.",
};

export default function Page() {
  return <TeamPage />;
}
