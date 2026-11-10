import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailView } from "@/app/components/JobDetailView";
import { getPublishedJobBySlug } from "@/lib/data/jobs";
import { resolveJobContent } from "@/lib/i18n/job-content";
import { jobPageTitle, SITE_TITLE_SUFFIX } from "@/lib/site-nav";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) {
    return { title: `Stelle nicht gefunden | ${SITE_TITLE_SUFFIX}` };
  }
  const copy = resolveJobContent(job, "de");
  return {
    title: jobPageTitle(copy.title),
    description: copy.description.slice(0, 160),
    alternates: {
      languages: {
        de: `/karriere/${slug}`,
        en: `/en/karriere/${slug}`,
      },
    },
  };
}

export default async function JobPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  return <JobDetailView job={job} locale="de" />;
}
