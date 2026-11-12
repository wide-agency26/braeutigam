export const VIDEO_PLACEMENTS = {
  "home-feature": "Home — featured video",
  "careers-1": "Join Us — first large film",
  "careers-2": "Join Us — second large film",
  "careers-3": "Join Us — first small film",
  "careers-4": "Join Us — second small film",
  "careers-5": "Join Us — third small film",
  "team-feature": "Team — featured video",
  "craft-feature": "Craft — featured video",
  "contact-feature": "Contact — featured video",
} as const;
export type VideoPlacement = keyof typeof VIDEO_PLACEMENTS;
export const MEDIA_BUCKET = "site-media";
export const MEDIA_LIMIT = 50 * 1024 * 1024;
export const IMAGE_LIMIT = 5 * 1024 * 1024;
export const MEDIA_TYPES = { "image/webp": "webp", "video/mp4": "mp4", "video/webm": "webm" } as const;
export type MediaMime = keyof typeof MEDIA_TYPES;

export function matchesMediaSignature(bytes: Uint8Array, mime: string) {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (mime === "image/webp") return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (mime === "video/mp4") return ascii(4, 8) === "ftyp" && /^(isom|iso[2-9]|mp4[12]|avc1|M4V |MSNV)/.test(ascii(8, 12));
  if (mime === "video/webm") return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  return false;
}

export function instagramPermalink(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(url.hostname) || url.port || url.username || url.password) return null;
    const match = url.pathname.match(/^\/(?:[A-Za-z0-9_.]+\/)?reel\/([A-Za-z0-9_-]+)\/?$/);
    return match ? `https://www.instagram.com/reel/${match[1]}/` : null;
  } catch { return null; }
}
