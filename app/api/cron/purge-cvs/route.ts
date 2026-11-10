import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteResumeObject, objectKeyFromStoredPath } from "@/lib/storage";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") {
    return unauthorized();
  }

  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return unauthorized();
  }

  const now = new Date();
  const expired = await prisma.application.findMany({
    where: {
      retainUntil: { lte: now },
      resumePath: { not: null },
    },
    select: { id: true, resumePath: true },
    take: 200,
  });

  let files = 0;
  let rows = 0;

  for (const row of expired) {
  if (row.resumePath) {
      const key = objectKeyFromStoredPath(row.resumePath);
      if (key) {
        try {
          await deleteResumeObject(key);
          files += 1;
        } catch {
          /* idempotent */
        }
      }
    }
    await prisma.application.delete({ where: { id: row.id } });
    rows += 1;
  }

  console.info(`[purge-cvs] cleared ${rows} applications, ${files} storage objects`);
  return NextResponse.json({ ok: true, rows, files });
}
