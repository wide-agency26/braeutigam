import { z } from "zod";
import { instagramPermalink, VIDEO_PLACEMENTS } from "./config";

export const contentKindSchema = z.enum(["team", "videos", "reels"]);
export type ContentKind = z.infer<typeof contentKindSchema>;
const title = z.string().trim().min(1, "Enter a title.").max(160);
const optionalTitle = z.string().trim().max(160).default("");
const fileUrl = z.string().trim().min(1, "Upload a file before saving.").max(800);
const ordered = { sortOrder: z.coerce.number().int().min(0).max(9999), published: z.boolean() };
export const teamSchema = z.object({
  name: title, title, titleEn: optionalTitle,
  email: z.union([z.string().trim().email().max(200), z.literal("")]),
  phone: z.string().trim().max(50), memberId: z.string().trim().min(1).max(40),
  avatarUrl: fileUrl, showContact: z.boolean(), ...ordered,
});
export const videoSchema = z.object({
  placement: z.enum(Object.keys(VIDEO_PLACEMENTS) as [keyof typeof VIDEO_PLACEMENTS, ...Array<keyof typeof VIDEO_PLACEMENTS>]),
  title, titleEn: optionalTitle, description: z.string().trim().max(1500), descriptionEn: z.string().trim().max(1500),
  videoUrl: fileUrl, posterUrl: fileUrl, transcript: z.string().trim().max(12000), transcriptEn: z.string().trim().max(12000),
  published: z.boolean(),
});
export const reelSchema = z.object({
  title, titleEn: optionalTitle,
  permalink: z.string().trim().transform((value, context) => {
    const normalized = instagramPermalink(value);
    if (!normalized) { context.addIssue({ code: "custom", message: "Enter an https://www.instagram.com/reel/… link." }); return z.NEVER; }
    return normalized;
  }),
  imageUrl: fileUrl, ...ordered,
});
