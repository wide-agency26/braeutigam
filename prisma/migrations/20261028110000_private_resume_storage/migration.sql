ALTER TABLE "Application" ADD COLUMN "resumeMime" TEXT;
ALTER TABLE "Application" ADD COLUMN "resumeSize" INTEGER;
ALTER TABLE "Application" ADD COLUMN "resumeSha256" TEXT;
ALTER TABLE "Application" ADD COLUMN "retainUntil" TIMESTAMP(3);

CREATE TABLE "ApplicationRateLimit" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationRateLimit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApplicationRateLimit_ipHash_createdAt_idx" ON "ApplicationRateLimit"("ipHash", "createdAt");

ALTER TABLE "ApplicationRateLimit" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "ApplicationRateLimit" FROM anon, authenticated;
