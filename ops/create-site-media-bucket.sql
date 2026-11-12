-- Run once in the intended Supabase staging project, then production after PR review.
-- This creates a separate public website-media bucket. It does not modify the
-- resumes bucket, its policies, or any existing bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-media', 'site-media', true, 52428800, ARRAY['image/webp', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO NOTHING;
-- No anonymous/authenticated upload policy is added. Only the authenticated CMS
-- server (service secret) can issue a signed upload ticket for a new random object.
