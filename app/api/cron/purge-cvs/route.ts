import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteResumeObject, objectKeyFromStoredPath } from "@/lib/storage";
import { CV_NOTICE_DAYS, DAY_MS, processCvRetention } from "@/lib/cv-retention";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : "";
  const actual = request.headers.get("authorization") ?? "";
  if (process.env.VERCEL_ENV !== "production" || !expected || Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const candidates = await prisma.application.findMany({
    where: { resumePath: { not: null }, OR: [
      { retainUntil: { lte: new Date(now.getTime() + CV_NOTICE_DAYS * DAY_MS) }, resumeDeletionNoticeAt: null },
      { retainUntil: { lte: now }, resumeDeletionNoticeAt: { lte: new Date(now.getTime() - DAY_MS) } },
    ] },
    select: { id: true, resumePath: true, retainUntil: true, resumeDeletionNoticeAt: true },
    // Failed removals go last so a broken object cannot starve the queue.
    orderBy: [{ resumeDeletionFailedAt: { sort: "asc", nulls: "first" } }, { retainUntil: "asc" }, { id: "asc" }],
    take: 200,
  });
  const result = await processCvRetention(candidates, {
    objectKey: objectKeyFromStoredPath,
    remove: deleteResumeObject,
    notify: async (id, at) => {
      await prisma.application.updateMany({ where: { id, resumeDeletionNoticeAt: null }, data: { resumeDeletionNoticeAt: at } });
    },
    clear: async (id, resumePath, at) => {
      await prisma.application.updateMany({ where: { id, resumePath }, data: {
        resumePath: null, resumeName: null, resumeMime: null, resumeSize: null,
        resumeSha256: null, resumeDeletedAt: at, resumeDeletionFailedAt: null,
      } });
    },
    failed: async (id, at) => {
      await prisma.application.updateMany({ where: { id }, data: { resumeDeletionFailedAt: at } });
    },
  }, now);
  return NextResponse.json({ ok: result.failed === 0, ...result }, {
    status: result.failed ? 503 : 200,
    headers: { "Cache-Control": "private, no-store" },
  });
}
