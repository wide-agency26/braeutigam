-- Backfill 30-day retention (aligns with Datenschutz copy). Not for production deploy until client sign-off.
UPDATE "Application"
SET "retainUntil" = "createdAt" + interval '30 days'
WHERE "retainUntil" IS NULL;
