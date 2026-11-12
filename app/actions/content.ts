"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { fieldErrors, type FieldErrors } from "@/lib/validations";
import { contentKindSchema, teamSchema, videoSchema, reelSchema, type ContentKind } from "@/lib/content/validation";
import { publicMediaUrl } from "@/lib/content/storage";

export type ContentState = { error?: string; fieldErrors?: FieldErrors };

async function approvedMedia(url: string, kind: "image" | "video") {
  // Existing checked-in images remain usable when editing migrated content.
  if (kind === "image" && /^\/images\/(experts|crew|social)\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|jpeg)$/.test(url)) return true;
  const prefix = publicMediaUrl("");
  if (!url.startsWith(prefix)) return false;
  const objectKey = url.slice(prefix.length);
  if (!/^cms\/[0-9a-f-]+\.(webp|mp4|webm)$/.test(objectKey)) return false;
  const asset = await prisma.mediaAsset.findUnique({ where: { objectKey }, select: { mime: true, verifiedAt: true } });
  return Boolean(asset?.verifiedAt && asset.mime.startsWith(`${kind}/`));
}

function refreshContent(kind: ContentKind) {
  for (const path of ["/", "/en", "/team", "/en/team", "/karriere", "/en/karriere", "/craft", "/en/craft", "/kontakt", "/en/kontakt", `/cms/admin/content/${kind}`]) revalidatePath(path);
}

export async function saveContent(_previous: ContentState, formData: FormData): Promise<ContentState> {
  await verifySession();
  const kind = contentKindSchema.safeParse(formData.get("kind"));
  if (!kind.success) return { error: "Unknown content type." };
  const id = String(formData.get("id") ?? "");
  if (id.length > 100) return { error: "Invalid entry." };
  const input = { ...Object.fromEntries(formData), published: formData.get("published") === "on", showContact: formData.get("showContact") === "on" };
  try {
    if (kind.data === "team") {
      const parsed = teamSchema.safeParse(input);
      if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
      if (!await approvedMedia(parsed.data.avatarUrl, "image")) return { error: "Upload and verify a portrait before saving." };
      if (id) await prisma.teamMember.update({ where: { id }, data: parsed.data });
      else await prisma.teamMember.create({ data: parsed.data });
    } else if (kind.data === "videos") {
      const parsed = videoSchema.safeParse(input);
      if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
      const [video, poster] = await Promise.all([approvedMedia(parsed.data.videoUrl, "video"), approvedMedia(parsed.data.posterUrl, "image")]);
      if (!video || !poster) return { error: "Upload and verify both a video and a poster before saving." };
      if (id) await prisma.siteVideo.update({ where: { id }, data: parsed.data });
      else await prisma.siteVideo.create({ data: parsed.data });
    } else {
      const parsed = reelSchema.safeParse(input);
      if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
      if (!await approvedMedia(parsed.data.imageUrl, "image")) return { error: "Upload and verify a reel cover before saving." };
      if (id) await prisma.socialReel.update({ where: { id }, data: parsed.data });
      else await prisma.socialReel.create({ data: parsed.data });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { error: "That placement or Instagram reel is already in use. Edit its existing entry." };
    return { error: "Could not save this entry. Your changes have not been published. Please try again." };
  }
  refreshContent(kind.data);
  redirect(`/cms/admin/content/${kind.data}?saved=1`);
}

export async function deleteContent(formData: FormData) {
  await verifySession();
  const kind = contentKindSchema.parse(formData.get("kind"));
  const id = String(formData.get("id") ?? "");
  if (!id || id.length > 100) return;
  if (kind === "team") await prisma.teamMember.deleteMany({ where: { id } });
  else if (kind === "videos") await prisma.siteVideo.deleteMany({ where: { id } });
  else await prisma.socialReel.deleteMany({ where: { id } });
  // Uploaded objects may be reused by other entries. Removing content does not purge files.
  refreshContent(kind);
  redirect(`/cms/admin/content/${kind}?removed=1`);
}
