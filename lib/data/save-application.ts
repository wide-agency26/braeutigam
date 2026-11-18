import "server-only";
import { prisma } from "@/lib/prisma";
import type { Application } from "@prisma/client";

export type NewApplication = Omit<Application, "status" | "createdAt" | "updatedAt">;

export async function saveApplicationWithRateLimit(data: NewApplication, ipHash: string) {
  await prisma.$transaction([
    prisma.application.create({ data }),
    prisma.applicationRateLimit.create({ data: { ipHash } }),
  ]);
}
