import { publicVideos } from "@/lib/content/public";
import type { Metadata } from "next";
import CareerPage, { type CareerOpening } from "../components/CareerPage";
import { listPublishedJobs } from "@/lib/data/jobs";

export const dynamic = "force-dynamic";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Karriere"),
  description:
    "Karriere bei Bräutigam in Freiberg am Neckar: offene Stellen in Laminieren, Zuschnitt, Konstruktion und Projektleitung.",
  alternates: { languages: { de: "/karriere", en: "/en/karriere" } },
};

export default async function Page() {
  const [openings, videos]: [CareerOpening[], Awaited<ReturnType<typeof publicVideos>>] = await Promise.all([listPublishedJobs(), publicVideos("careers", "de")]);
  return <CareerPage openings={openings} videos={videos} />;
}
