import "server-only";

import { prisma } from "@/lib/prisma";
import type { JobStatus } from "@prisma/client";

function databaseReady() {
  return Boolean(process.env.DATABASE_URL);
}

export async function listPublishedJobs() {
  if (!databaseReady()) return [];
  return prisma.job.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      title: true,
      department: true,
      location: true,
      employmentType: true,
    },
  });
}

export async function getPublishedJobBySlug(slug: string) {
  if (!databaseReady()) return null;
  return prisma.job.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function listJobs() {
  return prisma.job.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true } },
    },
  });
}

export async function countJobsByStatus() {
  const groups = await prisma.job.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts: Record<JobStatus, number> = {
    DRAFT: 0,
    PUBLISHED: 0,
    CLOSED: 0,
  };

  for (const group of groups) {
    counts[group.status] = group._count._all;
  }

  return counts;
}
