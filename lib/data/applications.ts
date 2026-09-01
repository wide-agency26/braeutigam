import "server-only";

import { prisma } from "@/lib/prisma";
import type { ApplicationStatus } from "@prisma/client";

export async function listApplications(filters?: {
  jobId?: string;
  status?: ApplicationStatus;
}) {
  return prisma.application.findMany({
    where: {
      jobId: filters?.jobId,
      status: filters?.status,
    },
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, title: true, slug: true, department: true } },
    },
  });
}

export async function getApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      job: true,
    },
  });
}

export async function countApplicationsByStatus() {
  const groups = await prisma.application.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts: Record<ApplicationStatus, number> = {
    NEW: 0,
    REVIEWING: 0,
    SHORTLISTED: 0,
    REJECTED: 0,
    HIRED: 0,
  };

  for (const group of groups) {
    counts[group.status] = group._count._all;
  }

  return counts;
}

export async function recentApplications(take = 8) {
  return prisma.application.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { title: true, slug: true } },
    },
  });
}
