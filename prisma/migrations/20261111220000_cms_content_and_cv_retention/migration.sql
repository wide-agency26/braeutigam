-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "resumeDeletedAt" TIMESTAMP(3),
ADD COLUMN     "resumeDeletionFailedAt" TIMESTAMP(3),
ADD COLUMN     "resumeDeletionNoticeAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "memberId" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteVideo" (
    "id" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "transcript" TEXT NOT NULL DEFAULT '',
    "transcriptEn" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialReel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "permalink" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialReel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_objectKey_key" ON "MediaAsset"("objectKey");

-- CreateIndex
CREATE INDEX "TeamMember_published_sortOrder_idx" ON "TeamMember"("published", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SiteVideo_placement_key" ON "SiteVideo"("placement");

-- CreateIndex
CREATE UNIQUE INDEX "SocialReel_permalink_key" ON "SocialReel"("permalink");

-- CreateIndex
CREATE INDEX "SocialReel_published_sortOrder_idx" ON "SocialReel"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Application_retainUntil_idx" ON "Application"("retainUntil");


-- Match the existing server-only CMS access model for new tables.
ALTER TABLE "MediaAsset" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "MediaAsset" FROM anon, authenticated;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "TeamMember" FROM anon, authenticated;
ALTER TABLE "SiteVideo" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "SiteVideo" FROM anon, authenticated;
ALTER TABLE "SocialReel" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "SocialReel" FROM anon, authenticated;

-- Import only the public roster and reel links already present in main.
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-1', 'Manuel Wezel', 'Managing Director', 'Managing Director', 'manuel@braeutigam-gmbh.eu', '07141/2996-706', '#706-MW', '/images/experts/manuel-wezel.webp', true, true, 0, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-2', 'Ralf Schuster', 'Management / Project Management', 'Management / Project Management', 'ralf@braeutigam-gmbh.eu', '07141/2996-701', '#701-RS', '/images/experts/ralf-schuster.webp', true, true, 10, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-3', 'Heiko Euteneuer', 'Head of Design & Quality Management', 'Head of Design & Quality Management', 'heiko@braeutigam-gmbh.eu', '07141/2996-702', '#702-HE', '/images/experts/heiko-euteneuer.webp', true, true, 20, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-4', 'Igor Stach', 'Head of CNC Department', 'Head of CNC Department', 'igor@braeutigam-gmbh.eu', '07141/2996-712', '#712-IS', '/images/experts/igor-stach.webp', true, true, 30, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-5', 'Hans Braun', 'Project Management / Production Planning', 'Project Management / Production Planning', 'hans@braeutigam-gmbh.eu', '07141/2996-708', '#708-HB', '/images/experts/hans-braun.webp', true, true, 40, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-6', 'Christian Grunert', 'Head of Prepreg Department', 'Head of Prepreg Department', 'christian@braeutigam-gmbh.eu', '07141/2996-711', '#711-CG', '/images/experts/christian-grunert.webp', true, true, 50, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-7', 'Boris Sidji', 'Work Preparation Assembly', 'Work Preparation Assembly', 'boris@braeutigam-gmbh.eu', '07141/2996-715', '#715-BS', '/images/experts/boris-sidji.webp', true, true, 60, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-8', 'Christian Zinth', 'Quality Management', 'Quality Management', 'christian.zinth@braeutigam-gmbh.eu', '07141/2996-709', '#709-CZ', '/images/experts/christian-zinth.webp', true, true, 70, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-9', 'Jonas Boxhorn', 'Quality Management', 'Quality Management', 'jonas@braeutigam-gmbh.eu', '07141/2996-709', '#709-JB', '/images/experts/jonas-boxhorn.webp', true, true, 80, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-10', 'Samuel Schmidt', 'Quality Management', 'Quality Management', 'samuel@braeutigam-gmbh.eu', '07141/2996-709', '#709-SS', '/images/experts/samuel-schmidt.webp', true, true, 90, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-11', 'Stephan Steiner', 'Technical Purchasing', 'Technical Purchasing', 'stephan@braeutigam-gmbh.eu', '07141/2996-701', '#701-SS', '/images/experts/stephan-steiner.webp', true, true, 100, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-12', 'Francesco Di Costanzo', 'Administration', 'Administration', 'francesco@braeutigam-gmbh.eu', '07141/2996-700', '#700-FD', '/images/experts/francesco-di-costanzo.webp', false, true, 110, CURRENT_TIMESTAMP);
INSERT INTO "TeamMember" ("id", "name", "title", "titleEn", "email", "phone", "memberId", "avatarUrl", "showContact", "published", "sortOrder", "updatedAt") VALUES ('initial-team-13', 'Kurt Lander', 'Head of Warehouse & Logistics', 'Head of Warehouse & Logistics', 'kurt@braeutigam-gmbh.eu', '07141/2996-714', '#714-KL', '/images/experts/kurt-lander.webp', true, true, 120, CURRENT_TIMESTAMP);
INSERT INTO "SocialReel" ("id", "title", "titleEn", "permalink", "imageUrl", "published", "sortOrder", "updatedAt") VALUES ('initial-reel-1', 'Formel 1 Öltanks reel', '', 'https://www.instagram.com/reel/DMFYazaOIoF/', '/images/social/reels/DMFYazaOIoF.jpg', true, 0, CURRENT_TIMESTAMP);
INSERT INTO "SocialReel" ("id", "title", "titleEn", "permalink", "imageUrl", "published", "sortOrder", "updatedAt") VALUES ('initial-reel-2', 'Autoklaven reel', '', 'https://www.instagram.com/reel/DbvB42ZlH5d/', '/images/social/reels/DbvB42ZlH5d.jpg', true, 10, CURRENT_TIMESTAMP);
INSERT INTO "SocialReel" ("id", "title", "titleEn", "permalink", "imageUrl", "published", "sortOrder", "updatedAt") VALUES ('initial-reel-3', 'F1-Ballastplatte Gummierung reel', '', 'https://www.instagram.com/reel/Dbp4OcWgFZ0/', '/images/social/reels/Dbp4OcWgFZ0.jpg', true, 20, CURRENT_TIMESTAMP);
INSERT INTO "SocialReel" ("id", "title", "titleEn", "permalink", "imageUrl", "published", "sortOrder", "updatedAt") VALUES ('initial-reel-4', 'Carbon Handarbeit reel', '', 'https://www.instagram.com/reel/Dbkum1MjefO/', '/images/social/reels/Dbkum1MjefO.jpg', true, 30, CURRENT_TIMESTAMP);
INSERT INTO "SocialReel" ("id", "title", "titleEn", "permalink", "imageUrl", "published", "sortOrder", "updatedAt") VALUES ('initial-reel-5', 'Werkzeuge aus Carbon reel', '', 'https://www.instagram.com/reel/DbdALvFD9y7/', '/images/social/reels/DbdALvFD9y7.jpg', true, 40, CURRENT_TIMESTAMP);
INSERT INTO "SocialReel" ("id", "title", "titleEn", "permalink", "imageUrl", "published", "sortOrder", "updatedAt") VALUES ('initial-reel-6', 'Formel-1-Ballastplatte reel', '', 'https://www.instagram.com/reel/DbabXLzgm8W/', '/images/social/reels/DbabXLzgm8W.jpg', true, 50, CURRENT_TIMESTAMP);
