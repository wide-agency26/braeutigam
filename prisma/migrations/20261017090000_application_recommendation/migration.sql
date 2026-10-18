ALTER TABLE "Application"
ADD COLUMN "wasRecommended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "recommenderName" TEXT NOT NULL DEFAULT '';
