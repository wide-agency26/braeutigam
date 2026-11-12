import "server-only";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/dal";
import type { ContentKind } from "./validation";

export const CONTENT_LABELS = { team: "Team members", videos: "Page videos", reels: "Instagram reels" };
export async function listContent(kind: ContentKind) {
  await verifySession();
  if (kind === "team") return (await prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })).map(row => ({ id: row.id, title: row.name, detail: row.title, published: row.published }));
  if (kind === "videos") return (await prisma.siteVideo.findMany({ orderBy: { placement: "asc" } })).map(row => ({ id: row.id, title: row.title, detail: row.placement, published: row.published }));
  return (await prisma.socialReel.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })).map(row => ({ id: row.id, title: row.title, detail: row.permalink, published: row.published }));
}
export async function getContent(kind: ContentKind, id: string) {
  await verifySession();
  const entry = kind === "team" ? await prisma.teamMember.findUnique({ where: { id } }) : kind === "videos" ? await prisma.siteVideo.findUnique({ where: { id } }) : await prisma.socialReel.findUnique({ where: { id } });
  if (!entry) return null;
  return Object.fromEntries(Object.entries(entry).filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean")) as Record<string, string | number | boolean>;
}
