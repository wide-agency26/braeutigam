import type { Metadata } from "next";
import CareerPage from "../components/CareerPage";

export const metadata: Metadata = {
  title: "Karriere | Bräutigam GmbH",
  description:
    "Fünf Berufe, fünf Geschichten. Offene Stellen in der Carbonfaser-Verarbeitung bei Bräutigam GmbH — Lamination, CAD/CAM, Qualitätssicherung, CNC und Projektleitung.",
};

export default function Page() {
  return <CareerPage />;
}
