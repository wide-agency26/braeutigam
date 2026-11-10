import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "../../components/SiteChrome";
import SiteFooter from "../../components/SiteFooter";
import "../../components/CareerPage.css";
import { getPublishedJobBySlug } from "@/lib/data/jobs";
import { EMPLOYMENT_LABEL } from "@/lib/format";
import { jobPageTitle, SITE_TITLE_SUFFIX } from "@/lib/site-nav";
import { ApplyForm } from "./ApplyForm";

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
  return {
    title: jobPageTitle(job.title),
    description: job.description.slice(0, 160),
  };
}

export default async function JobPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  return (
    <LazyMotion features={domAnimation}>
      <div className="career relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main id="main-content" lang="en" className="career-shell relative pb-24 pt-36 md:pb-32 md:pt-44">
          <article id="job-detail">
          <p className="career-eyebrow text-[var(--career-neon)]">
            {job.department} {"//"} {EMPLOYMENT_LABEL[job.employmentType]}
          </p>
          <h1 className="career-heading mt-4 text-zinc-950 dark:text-white">{job.title}</h1>
          <p className="career-eyebrow mt-4 text-zinc-500">LOCATION: {job.location}</p>

          <div className="mt-10 max-w-2xl">
            <ApplyForm jobId={job.id} jobTitle={job.title} />
          </div>

          <div className="mt-16 max-w-3xl border-t border-zinc-300 pt-10 dark:border-zinc-800">
            <h2 className="career-eyebrow text-[var(--career-neon)]">Role</h2>
            <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {job.description}
            </p>
            {job.requirements ? (
              <>
                <h2 className="career-eyebrow mt-10 text-[var(--career-neon)]">Requirements</h2>
                <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {job.requirements}
                </p>
              </>
            ) : null}
            <p className="mt-8">
              <Link className="career-eyebrow text-zinc-500 hover:text-[var(--career-neon)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--career-neon)]" href="/karriere">
                ← All openings
              </Link>
            </p>
          </div>
          </article>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
