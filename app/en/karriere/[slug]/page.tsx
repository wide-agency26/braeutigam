import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailView } from "@/app/components/JobDetailView";
import { getPublishedJobBySlug } from "@/lib/data/jobs";
import { resolveJobContent } from "@/lib/i18n/job-content";
import { jobPageTitleForLocale, SITE_TITLE_SUFFIX } from "@/lib/site-nav";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) {
    return { title: `Role not found | ${SITE_TITLE_SUFFIX}` };
  }
  const copy = resolveJobContent(job, "en");
  return {
    title: jobPageTitleForLocale(copy.title, "en"),
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
  return <JobDetailView job={job} locale="en" />;
}
