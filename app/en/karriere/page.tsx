import type { Metadata } from "next";
import CareerPage, { type CareerOpening } from "../../components/CareerPage";
import { publishedVideos } from "@/lib/data/videos";
import { listPublishedJobs } from "@/lib/data/jobs";
import { pageTitleForLocale } from "@/lib/site-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageTitleForLocale("Karriere", "en"),
  description:
    "Careers at Bräutigam in Freiberg am Neckar — open roles in laminating, cutting, engineering, and project management.",
  alternates: { languages: { de: "/karriere", en: "/en/karriere" } },
};

export default async function Page() {
  const [openings, videos]: [CareerOpening[], Awaited<ReturnType<typeof publishedVideos>>] = await Promise.all([listPublishedJobs(), publishedVideos("en")]);
  return <CareerPage openings={openings} videos={videos} locale="en" />;
}
