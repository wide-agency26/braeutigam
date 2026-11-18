import "server-only";
import { env } from "cloudflare:workers";
import { randomUUID } from "node:crypto";
import type { NewApplication } from "../data/save-application";

// Prisma's D1 adapter does not support transactions. D1 batch provides the
// atomic commit needed to keep an application and its rate-limit record together.
export async function saveApplicationWithRateLimit(data: NewApplication, ipHash: string) {
  const now = new Date().toISOString().replace("Z", "+00:00");
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO Application
      (id, jobId, firstName, lastName, email, phone, coverLetter, wasRecommended,
       recommenderName, resumePath, resumeName, resumeMime, resumeSize, resumeSha256,
       retainUntil, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REACHED_OUT', ?, ?)`)
      .bind(data.id, data.jobId, data.firstName, data.lastName, data.email,
        data.phone, data.coverLetter, Number(data.wasRecommended), data.recommenderName,
        data.resumePath, data.resumeName, data.resumeMime, data.resumeSize,
        data.resumeSha256, data.retainUntil?.toISOString().replace("Z", "+00:00") ?? null, now, now),
    env.DB.prepare(`INSERT INTO ApplicationRateLimit (id, ipHash, createdAt) VALUES (?, ?, ?)`)
      .bind(randomUUID(), ipHash, now),
  ]);
}
