import type { Job } from "@prisma/client";
import type { Locale } from "./paths";

export function resolveJobContent(job: Job, locale: Locale) {
  return {
    title:
      locale === "en" && job.titleEn?.trim() ? job.titleEn.trim() : job.title,
    description:
      locale === "en" && job.descriptionEn?.trim()
        ? job.descriptionEn.trim()
        : job.description,
    requirements:
      locale === "en" && job.requirementsEn?.trim()
        ? job.requirementsEn.trim()
        : job.requirements,
  };
}
