"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { videoSchema, youtubeId } from "@/lib/videos";

export type VideoState = { error?: string; success?: string; fieldErrors?: Record<string, string[]> };

export async function saveVideo(_previous: VideoState, formData: FormData): Promise<VideoState> {
  await verifySession();
  const parsed = videoSchema.safeParse({
    slot: formData.get("slot"), mode: formData.get("mode"),
    urlDe: formData.get("urlDe") ?? "", urlEn: formData.get("urlEn") ?? "",
    titleDe: formData.get("titleDe") ?? "", titleEn: formData.get("titleEn") ?? "",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const { slot, mode, urlDe, urlEn, ...content } = parsed.data;
  const data = { ...content, mode, youtubeIdDe: youtubeId(urlDe) ?? "", youtubeIdEn: youtubeId(urlEn) ?? "" };
  try {
    await prisma.siteVideo.upsert({ where: { slot }, create: { slot, ...data }, update: data });
  } catch {
    return { error: "The video could not be saved. Please try again; if this persists, check that the video database migration has been applied." };
  }
  revalidatePath("/cms/admin/videos");
  revalidatePath("/karriere");
  revalidatePath("/en/karriere");
  return { success: content.published ? "Saved and published on both language pages." : "Saved as draft. The page shows its original photograph." };
}
