import { z } from "zod";
import type { Locale } from "@/lib/i18n";

export const VIDEO_SLOTS = [
  { id: "career-design", label: "Careers · Design engineering", de: "Konstruktion", en: "Design engineering" },
  { id: "career-prepreg", label: "Careers · Prepreg layup", de: "Pre-preg Laminierer", en: "Prepreg layup" },
  { id: "career-cutting", label: "Careers · Cutting", de: "Zuschnitt", en: "Cutting" },
  { id: "career-planning", label: "Careers · Production planning", de: "Produktionsplanung & Projektmanagement", en: "Production planning & project management" },
  { id: "career-assembly", label: "Careers · Assembly", de: "Montage", en: "Assembly" },
] as const;
export type VideoSlot = (typeof VIDEO_SLOTS)[number]["id"];
const idPattern = /^[A-Za-z0-9_-]{11}$/;

/** Store only an ID; never render arbitrary CMS iframe markup or fetch a URL. */
export function youtubeId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    let id: string | null = null;
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    else if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(url.hostname)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else id = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)\/?$/)?.[1] ?? null;
    }
    return id && idPattern.test(id) ? id : null;
  } catch { return null; }
}

const optionalUrl = z.string().trim().max(500).refine(value => !value || youtubeId(value) !== null, "Enter a valid HTTPS YouTube video link.");
export const videoSchema = z.object({
  slot: z.enum(VIDEO_SLOTS.map(slot => slot.id)),
  mode: z.enum(["SHARED", "LOCALIZED"]),
  urlDe: optionalUrl,
  urlEn: z.string().trim().max(500),
  titleDe: z.string().trim().max(160),
  titleEn: z.string().trim().max(160),
  published: z.boolean(),
}).superRefine((value, context) => {
  if (value.mode === "LOCALIZED" && value.urlEn && !youtubeId(value.urlEn)) context.addIssue({ code: "custom", path: ["urlEn"], message: "Enter a valid HTTPS YouTube video link." });
  if (!value.published) return;
  if (!value.urlDe) context.addIssue({ code: "custom", path: ["urlDe"], message: "Add a video before publishing." });
  if (value.mode === "LOCALIZED" && !value.urlEn) context.addIssue({ code: "custom", path: ["urlEn"], message: "Add the English video, or choose one video for both languages." });
});

export type VideoRecord = {
  slot: string; mode: string; youtubeIdDe: string; youtubeIdEn: string;
  titleDe: string; titleEn: string; published: boolean;
};
export type PublishedVideo = { id: string; title: string };
export type PublishedVideos = Partial<Record<VideoSlot, PublishedVideo>>;

export function resolveVideo(video: VideoRecord, locale: Locale): PublishedVideo | null {
  const slot = VIDEO_SLOTS.find(slot => slot.id === video.slot);
  if (!slot || !video.published || !["SHARED", "LOCALIZED"].includes(video.mode)) return null;
  const id = locale === "en" && video.mode === "LOCALIZED" ? video.youtubeIdEn : video.youtubeIdDe;
  if (!idPattern.test(id)) return null;
  return { id, title: (locale === "en" ? video.titleEn : video.titleDe) || slot[locale] };
}
