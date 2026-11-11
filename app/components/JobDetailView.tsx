import Link from "next/link";
import { LazyMotion, domAnimation } from "framer-motion";
import type { Job } from "@prisma/client";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import "./CareerPage.css";
import { EMPLOYMENT_LABEL } from "@/lib/format";
import { getDictionary, localizedHref, type Locale } from "@/lib/i18n";
import { resolveJobContent } from "@/lib/i18n/job-content";
import { ApplyForm } from "../karriere/[slug]/ApplyForm";

export function JobDetailView({ job, locale }: { job: Job; locale: Locale }) {
  const copy = resolveJobContent(job, locale);
  const t = getDictionary(locale).jobDetail;
  const careersHref = localizedHref("/karriere", locale);

  return (
    <LazyMotion features={domAnimation}>
      <div className="career relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main
          id="main-content"
          lang={locale}
          className="career-shell relative pb-24 pt-36 md:pb-32 md:pt-44"
        >
          <article id="job-detail">
            <p className="career-eyebrow copy-tiny text-[var(--career-neon)]">
              {job.department} {"//"} {EMPLOYMENT_LABEL[job.employmentType]}
            </p>
            <h1 className="career-heading heading-tertiary mt-4 text-zinc-950 dark:text-white">
              {copy.title}
            </h1>
            <p className="career-eyebrow copy-tiny mt-4 text-zinc-500">
              {t.location}: {job.location}
            </p>

            <div className="mt-10 max-w-2xl">
              <ApplyForm jobId={job.id} jobTitle={copy.title} locale={locale} />
            </div>

            <div className="mt-16 max-w-3xl border-t border-zinc-300 pt-10 dark:border-zinc-800">
              <h2 className="career-eyebrow copy-tiny text-[var(--career-neon)]">{t.role}</h2>
              <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {copy.description}
              </p>
              {copy.requirements ? (
                <>
                  <h2 className="career-eyebrow copy-tiny mt-10 text-[var(--career-neon)]">
                    {t.requirements}
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {copy.requirements}
                  </p>
                </>
              ) : null}
              <p className="mt-8">
                <Link
                  className="career-eyebrow copy-tiny text-zinc-500 hover:text-[var(--career-neon)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--career-neon)]"
                  href={careersHref}
                >
                  {t.allOpenings}
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
