import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const RESUME_BUCKET = "resumes";

let cached: SupabaseClient | undefined;

function storageClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Storage is not configured.");
  }
  cached ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function resumeObjectKey(applicationId: string, fileId: string, ext: string) {
  return `${applicationId}/${fileId}.${ext}`;
}

export function storedResumePath(objectKey: string) {
  return `${RESUME_BUCKET}/${objectKey}`;
}

export function objectKeyFromStoredPath(storedPath: string) {
  const prefix = `${RESUME_BUCKET}/`;
  if (
    !storedPath.startsWith(prefix) ||
    storedPath.includes("..") ||
    storedPath.includes("\\") ||
    storedPath.includes("//")
  ) {
    return null;
  }
  const key = storedPath.slice(prefix.length);
  if (!key || key.startsWith("/")) return null;
  return key;
}

export async function uploadResumeObject(
  objectKey: string,
  bytes: Uint8Array,
  contentType: string,
) {
  const { error } = await storageClient()
    .storage.from(RESUME_BUCKET)
    .upload(objectKey, bytes, {
      contentType,
      upsert: false,
    });
  if (error) throw error;
}

export async function deleteResumeObject(objectKey: string) {
  const { error } = await storageClient().storage.from(RESUME_BUCKET).remove([objectKey]);
  if (error) throw error;
}

export async function createResumeDownloadUrl(objectKey: string, filename: string) {
  const { data, error } = await storageClient()
    .storage.from(RESUME_BUCKET)
    .createSignedUrl(objectKey, 60, { download: filename });
  if (error || !data.signedUrl) return null;
  return data.signedUrl;
}
