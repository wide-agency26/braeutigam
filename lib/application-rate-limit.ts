import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { clientAddress } from "@/lib/request-ip";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

export async function rateLimitForRequest() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Rate limit is not configured.");
  }

  const headerStore = await headers();
  const ip = clientAddress(headerStore);
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
