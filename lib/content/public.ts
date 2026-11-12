import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { EXPERTS, type Expert } from "@/lib/data/experts";
import { DEFAULT_REELS } from "@/lib/data/social-reels";
import type { Locale } from "@/lib/i18n";
import type { PublicReel, PublicVideo } from "./public-types";

async function contentOrFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.DATABASE_URL) return fallback;
  try { return await query(); }
  catch (error) {
    // Keep the existing public site available during the additive migration rollout.
    if (error instanceof Prisma.PrismaClientKnownRequestError && ["P2021", "P2022"].includes(error.code)) return fallback;
    throw error;
  }
}
const visibleContact = (expert: Expert): Expert => ({ ...expert, email: expert.showContact === false ? "" : expert.email, phone: expert.showContact === false ? "" : expert.phone });

export async function publicTeam(locale: Locale): Promise<Expert[]> {
  return contentOrFallback(async () => (await prisma.teamMember.findMany({
    where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, name: true, title: true, titleEn: true, email: true, phone: true, memberId: true, avatarUrl: true, showContact: true },
  })).map(row => visibleContact({ id: row.id, name: row.name, title: locale === "en" && row.titleEn ? row.titleEn : row.title, email: row.email, phone: row.phone, memberId: row.memberId, avatarUrl: row.avatarUrl, showContact: row.showContact })), EXPERTS.map(visibleContact));
}
export async function publicReels(locale: Locale): Promise<PublicReel[]> {
  return contentOrFallback(async () => (await prisma.socialReel.findMany({
    where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { title: true, titleEn: true, imageUrl: true, permalink: true },
  })).map(row => ({ image: row.imageUrl, alt: locale === "en" && row.titleEn ? row.titleEn : row.title, href: row.permalink })), DEFAULT_REELS);
}
export async function publicVideos(page: "home" | "careers" | "team" | "craft" | "contact", locale: Locale): Promise<PublicVideo[]> {
  return contentOrFallback(async () => (await prisma.siteVideo.findMany({
    where: { published: true, placement: { startsWith: `${page}-` } }, orderBy: { placement: "asc" },
    select: { placement: true, title: true, titleEn: true, description: true, descriptionEn: true, videoUrl: true, posterUrl: true, transcript: true, transcriptEn: true },
  })).map(row => ({ placement: row.placement, title: locale === "en" && row.titleEn ? row.titleEn : row.title, description: locale === "en" && row.descriptionEn ? row.descriptionEn : row.description, transcript: locale === "en" && row.transcriptEn ? row.transcriptEn : row.transcript, videoUrl: row.videoUrl, posterUrl: row.posterUrl })), []);
}
