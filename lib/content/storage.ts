import "server-only";
import { createClient } from "@supabase/supabase-js";
import { IMAGE_LIMIT, MEDIA_BUCKET, MEDIA_LIMIT, matchesMediaSignature } from "./config";

function mediaClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Website media storage is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function publicMediaUrl(key: string) {
  return mediaClient().storage.from(MEDIA_BUCKET).getPublicUrl(key).data.publicUrl;
}

export async function signMediaUpload(key: string) {
  const { data, error } = await mediaClient().storage.from(MEDIA_BUCKET).createSignedUploadUrl(key, { upsert: false });
  if (error || !data) throw new Error("Website media upload is unavailable.");
  return data.signedUrl;
}

export async function verifyMediaObject(asset: { objectKey: string; mime: string; bytes: number }) {
  const { data, error } = await mediaClient().storage.from(MEDIA_BUCKET).info(asset.objectKey);
  const limit = asset.mime === "image/webp" ? IMAGE_LIMIT : MEDIA_LIMIT;
  if (error || data?.size !== asset.bytes || data?.contentType !== asset.mime || !data.size || data.size > limit) {
    throw new Error("Uploaded file size or type does not match. Please upload it again.");
  }
  const response = await fetch(publicMediaUrl(asset.objectKey), {
    headers: { Range: "bytes=0-63" }, cache: "no-store", signal: AbortSignal.timeout(15000), redirect: "error",
  });
  if (!response.ok || !response.body) throw new Error("The uploaded file could not be verified.");
  const reader = response.body.getReader();
  const header = new Uint8Array(64);
  let count = 0;
  try {
    while (count < header.length) {
      const chunk = await reader.read();
      if (chunk.done) break;
      const part = chunk.value.subarray(0, header.length - count);
      header.set(part, count); count += part.length;
    }
  } finally { await reader.cancel(); }
  if (!matchesMediaSignature(header.subarray(0, count), asset.mime)) throw new Error("File contents do not match the chosen media type.");
}
