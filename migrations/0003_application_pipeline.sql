-- Cloudflare staging only: accept the current pipeline and preserve legacy values.
-- Run as one atomic migration. No application fields or records are removed.
PRAGMA defer_foreign_keys = ON;

CREATE TABLE "Application_next" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "coverLetter" TEXT NOT NULL DEFAULT '',
    "wasRecommended" BOOLEAN NOT NULL DEFAULT false,
    "recommenderName" TEXT NOT NULL DEFAULT '',
    "resumePath" TEXT,
    "resumeName" TEXT,
    "resumeMime" TEXT,
    "resumeSize" INTEGER,
    "resumeSha256" TEXT,
    "retainUntil" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'REACHED_OUT' CHECK ("status" IN ('NEW','REVIEWING','SHORTLISTED','REJECTED','HIRED','REACHED_OUT','FIRST_INTERVIEW','INTERNAL_DECISION','ACCEPTED','DECLINED')),
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Application_next" ("id", "jobId", "firstName", "lastName", "email", "phone", "coverLetter", "wasRecommended", "recommenderName", "resumePath", "resumeName", "resumeMime", "resumeSize", "resumeSha256", "retainUntil", "status", "createdAt", "updatedAt")
SELECT "id", "jobId", "firstName", "lastName", "email", "phone", "coverLetter", "wasRecommended", "recommenderName", "resumePath", "resumeName", "resumeMime", "resumeSize", "resumeSha256", "retainUntil", "status", "createdAt", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "Application_next" RENAME TO "Application";
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");
CREATE INDEX "Application_status_idx" ON "Application"("status");
