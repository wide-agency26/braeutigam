"use server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { IMAGE_LIMIT, MEDIA_LIMIT, MEDIA_TYPES } from "@/lib/content/config";
import { publicMediaUrl, signMediaUpload, verifyMediaObject } from "@/lib/content/storage";

const uploadSchema = z.object({
  filename: z.string().min(1).max(180), mime: z.enum(["image/webp", "video/mp4", "video/webm"]),
  bytes: z.number().int().positive().max(MEDIA_LIMIT),
}).refine(value => value.mime !== "image/webp" || value.bytes <= IMAGE_LIMIT, "Images must be smaller than 5 MB.");

export async function beginMediaUpload(input: { filename: string; mime: string; bytes: number }) {
  await verifySession();
  const parsed = uploadSchema.safeParse(input);
  if (!parsed.success) return { error: "Choose a WebP image up to 5 MB or an MP4/WebM video up to 50 MB." };
  try {
    const objectKey = `cms/${randomUUID()}.${MEDIA_TYPES[parsed.data.mime]}`;
    const signedUrl = await signMediaUpload(objectKey);
    const asset = await prisma.mediaAsset.create({ data: { ...parsed.data, objectKey } });
    return { id: asset.id, signedUrl };
  } catch { return { error: "Media storage is unavailable. Check the site-media bucket and server configuration." }; }
}

export async function finishMediaUpload(id: string) {
  await verifySession();
  if (typeof id !== "string" || id.length > 100) return { error: "Invalid upload." };
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { error: "Upload was not found." };
  try {
    await verifyMediaObject(asset);
    await prisma.mediaAsset.update({ where: { id }, data: { verifiedAt: new Date() } });
    return { url: publicMediaUrl(asset.objectKey) };
  } catch (error) { return { error: error instanceof Error ? error.message : "Upload verification failed." }; }
}
