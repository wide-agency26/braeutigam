-- Optional English public copy for jobs (not applied to production until client sign-off).
ALTER TABLE "Job" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "Job" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "Job" ADD COLUMN "requirementsEn" TEXT;
