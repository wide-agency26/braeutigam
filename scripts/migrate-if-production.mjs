import { execSync } from "node:child_process";

/**
 * Vercel Preview must not run migrations against production.
 * Only `VERCEL_ENV=production` runs `prisma migrate deploy`.
 * Local `next build` skips migrations (use `pnpm db:migrate` manually).
 */
if (process.env.VERCEL_ENV === "production") {
  execSync("pnpm exec prisma migrate deploy", { stdio: "inherit" });
} else if (process.env.VERCEL === "1") {
  console.warn(
    "[build] Skipping prisma migrate deploy on Vercel (VERCEL_ENV=%s). Point Preview DATABASE_URL at a branch DB.",
    process.env.VERCEL_ENV ?? "unknown",
  );
}
