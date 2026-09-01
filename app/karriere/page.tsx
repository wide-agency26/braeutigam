import type { Metadata } from "next";
import CareerPage, { type CareerOpening } from "../components/CareerPage";
import { listPublishedJobs } from "@/lib/data/jobs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Karriere | Bräutigam GmbH",
  description:
    "Offene Stellen in der Carbonfaser-Verarbeitung bei Bräutigam GmbH — Lamination, CAD/CAM, Qualitätssicherung, CNC und Projektleitung.",
};

export default async function Page() {
  const openings: CareerOpening[] = await listPublishedJobs();
  return <CareerPage openings={openings} />;
}
