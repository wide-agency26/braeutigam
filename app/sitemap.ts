import type { MetadataRoute } from "next";
import { listPublishedJobsForSitemap } from "@/lib/data/jobs";
import { localizedHref } from "@/lib/i18n/paths";
import { siteIndexable, siteOrigin } from "@/lib/site-config";

// Publishing, closing or removing a job must take effect without a redeploy.
export const dynamic = "force-dynamic";

const publicPaths = ["/", "/karriere", "/team", "/craft", "/kontakt", "/impressum", "/datenschutz"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Staging and the pre-launch site must not advertise URLs for indexing.
  if (!siteIndexable()) return [];

  const origin = siteOrigin();
  function localizedEntries(path: string, lastModified?: Date): MetadataRoute.Sitemap {
    const languages = {
      de: new URL(localizedHref(path, "de"), origin).href,
      en: new URL(localizedHref(path, "en"), origin).href,
    };
    return Object.values(languages).map((url) => ({
      url,
      alternates: { languages },
      ...(lastModified ? { lastModified } : {}),
    }));
  }

  const jobs = await listPublishedJobsForSitemap();
  return [
    ...publicPaths.flatMap((path) => localizedEntries(path)),
    ...jobs.flatMap((job) => localizedEntries(`/karriere/${encodeURIComponent(job.slug)}`, job.updatedAt)),
  ];
}
