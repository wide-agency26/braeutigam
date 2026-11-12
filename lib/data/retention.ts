import "server-only";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { CV_NOTICE_DAYS, DAY_MS } from "@/lib/cv-retention";

export async function upcomingCvDeletions(take = 100) {
  await verifySession();
  const where = {
    resumePath: { not: null },
    retainUntil: { lte: new Date(Date.now() + CV_NOTICE_DAYS * DAY_MS) },
  };
  const [count, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where, take, orderBy: { retainUntil: "asc" },
      select: { id: true, firstName: true, lastName: true, retainUntil: true, resumeDeletionFailedAt: true, job: { select: { title: true } } },
    }),
  ]);
  return { count, applications };
}
