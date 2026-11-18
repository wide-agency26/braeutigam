import "server-only";
import { env } from "cloudflare:workers";
export { resumeObjectKey, storedResumePath, objectKeyFromStoredPath } from "../resume-path";

export async function uploadResumeObject(objectKey: string, bytes: Uint8Array, contentType: string) {
  const object = await env.RESUMES.put(objectKey, bytes, {
    onlyIf: { etagDoesNotMatch: "*" },
    httpMetadata: { contentType, cacheControl: "private, no-store" },
  });
  if (!object) throw new Error("A file already exists at this key.");
}

export async function deleteResumeObject(objectKey: string) {
  await env.RESUMES.delete(objectKey);
}

// Called only after the admin session and application record have been checked.
// The R2 bucket has no public domain or public-development URL.
export async function downloadResumeObject(objectKey: string, filename: string) {
  const object = await env.RESUMES.get(objectKey);
  if (!object) return null;
  const encodedName = encodeURIComponent(filename).replace(/['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return new Response(object.body, { headers: {
    "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
    "Content-Disposition": `attachment; filename="resume"; filename*=UTF-8''${encodedName}`,
    "Content-Length": String(object.size),
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  } });
}
