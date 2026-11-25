import "server-only";
import { prisma, databaseReady } from "@/lib/prisma";
import { resolveVideo, type PublishedVideos, type VideoSlot } from "@/lib/videos";
import type { Locale } from "@/lib/i18n";

export async function publishedVideos(locale: Locale): Promise<PublishedVideos> {
  if (!databaseReady()) return {};
  try {
    const records = await prisma.siteVideo.findMany({ where: { published: true } });
    return Object.fromEntries(records.flatMap(record => {
      const video = resolveVideo(record, locale);
      return video ? [[record.slot as VideoSlot, video]] : [];
    }));
  } catch (error) {
    // A rolling release may serve the public page before its additive migration.
    // Keep the photographs available; the CMS still reports migration failures.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2021") {
      console.error("SiteVideo migration has not been applied.");
      return {};
    }
    throw error;
  }
}
