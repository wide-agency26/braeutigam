import "server-only";
import { NextResponse } from "next/server";
import { createResumeDownloadUrl } from "./storage";

// Preserve production's short-lived Supabase URL and private response headers.
// The Cloudflare build aliases this module to its authenticated R2 response.
export async function resumeDownloadResponse(objectKey: string, filename: string) {
  const url = await createResumeDownloadUrl(objectKey, filename);
  if (!url) return null;
  return NextResponse.redirect(url, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
