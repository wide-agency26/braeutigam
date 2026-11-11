-- Step 2 of 2: map legacy statuses to the new pipeline (run only after add_values migration).
UPDATE "Application" SET status = 'REACHED_OUT' WHERE status = 'NEW';
UPDATE "Application" SET status = 'FIRST_INTERVIEW' WHERE status = 'REVIEWING';
UPDATE "Application" SET status = 'INTERNAL_DECISION' WHERE status = 'SHORTLISTED';
UPDATE "Application" SET status = 'ACCEPTED' WHERE status = 'HIRED';
UPDATE "Application" SET status = 'DECLINED' WHERE status = 'REJECTED';
