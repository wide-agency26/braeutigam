import type { Metadata } from "next";
import CareerPage, { type CareerOpening } from "../components/CareerPage";
import { listPublishedJobs } from "@/lib/data/jobs";

export const dynamic = "force-dynamic";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Karriere"),
  description:
    "Karriere bei Bräutigam in Freiberg am Neckar: offene Stellen in Laminieren, Zuschnitt, Konstruktion und Projektleitung.",
};

export default async function Page() {
  const openings: CareerOpening[] = await listPublishedJobs();
  return <CareerPage openings={openings} />;
}
