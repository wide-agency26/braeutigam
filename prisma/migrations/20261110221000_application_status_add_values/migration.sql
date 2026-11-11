-- Step 1 of 2: add new pipeline enum values only (no data updates in this migration).
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'REACHED_OUT';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'FIRST_INTERVIEW';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'INTERNAL_DECISION';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'ACCEPTED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'DECLINED';
