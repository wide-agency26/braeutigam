import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

export async function rateLimitForRequest() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Rate limit is not configured.");
  }

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headerStore.get("x-real-ip")?.trim() || "unknown";
  const ipHash = createHash("sha256").update(`${secret}:${ip}`).digest("hex");
  const since = new Date(Date.now() - WINDOW_MS);

  await prisma.applicationRateLimit.deleteMany({
    where: { createdAt: { lt: since } },
  });
  const count = await prisma.applicationRateLimit.count({
    where: { ipHash, createdAt: { gte: since } },
  });

  return { limited: count >= LIMIT, ipHash };
}
