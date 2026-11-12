# CMS completion and rollout

This branch starts from main after PR #8 (`b5aa212`). It does not change
`general-changes` or require a separate merge of PR #7.

## Included behavior

- Jobs can be created as drafts, published, edited, and closed. Renaming keeps the
  original public slug. Removing a job with applicants closes it and preserves
  applications and CV references; an empty job can be deleted.
- CVs expire 30 days after submission. Overview and CV retention show an admin
  notice starting seven days beforehand. The existing daily cron removes only
  expired CV files and their file metadata, preserving the application and its
  recruitment status. Failed storage deletion retains the reference and retries.
  An overdue CV first discovered at rollout receives at least 24 hours of notice.
- Team members, page videos, and home-page Instagram reels have CMS create/edit,
  draft/publish, ordering (team/reels), and remove controls. Existing 13 team
  members and six reels are migrated from the checked-in public content.
- Videos have named page placements, a poster, DE/EN titles/descriptions, and
  transcripts. The five Join Us placements replace the existing film placeholders;
  other pages receive a featured video. Videos load on demand with native controls.
- Photos resize to a maximum 2,000px edge and convert to WebP in the editor.
  Videos accept MP4/WebM up to 50 MiB. Direct signed uploads avoid routing video
  payloads through a Next.js server action. The server checks size, MIME, and file
  signatures before allowing publication.
- New content uses a separate public `site-media` bucket. Only website media
  belongs there. Résumés continue to use the existing private bucket and signed
  download route. Hidden team contact details are omitted from public responses.

## Security preserved

The following are unchanged from main:

- `lib/storage.ts` and the authenticated CV download route, including 60-second
  signed links.
- The 28 October private résumé storage and row-level-security migrations.
- Existing database policies, application upload validation, and recruitment
  statuses from PR #8.

The additive migration enables RLS and denies direct anon/authenticated access
only on the four new CMS tables. Authenticated server actions use the existing
CMS session checks. No live database, bucket, or deployment was modified while
preparing this PR.

## Deployment steps

1. Point Preview at an isolated Supabase branch/project. Set `DATABASE_URL`,
   `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `SESSION_SECRET` for that
   environment. Keep both Supabase credentials server-only.
2. Apply `pnpm exec prisma migrate deploy` to that staging database. The new
   migration is `20261111220000_cms_content_and_cv_retention`; it is additive and
   carries over the existing public roster/reels.
3. Run `ops/create-site-media-bucket.sql` in the same Supabase project. It creates
   only `site-media`, allows WebP/MP4/WebM, and does not alter `resumes` or any
   existing storage policy. Confirm the new bucket settings if it already exists.
4. Verify a real photo and video upload, draft/publish/remove, and public playback
   against staging. Local verification used a Supabase Storage test double, so
   real-provider CORS, credentials, and bucket settings still need this check.
5. After review, repeat the bucket setup in production and deploy the merged PR.
   The existing production build applies Prisma migrations; Preview builds do not.
   Keep `SITE_INDEXABLE` unset until the public-site owner approves launch.
6. Keep `CRON_SECRET` configured. The existing Vercel schedule calls
   `/api/cron/purge-cvs` daily at 03:00 UTC. The route accepts only production plus
   the bearer secret. Monitor non-200 responses and the CMS failure notice.
   It processes up to 200 due notices/deletions per run; larger backlogs need
   additional authenticated runs. Expired CVs are removed on the next successful
   daily run, subject to the initial notice grace period.

## Verification completed locally

- `pnpm test:cms`: nine tests covering exact retention timing, advance notice,
  failed deletion/retry, wrong-bucket rejection, media signatures, CMS validation,
  and Instagram URL validation.
- TypeScript and the production Next.js build passed. The build used no database
  connection to avoid a disposable PGlite multi-worker limitation; the resulting
  production server was then exercised against the migrated test database.
- All nine SQL migrations applied to a disposable PostgreSQL-compatible PGlite
  instance, including the existing RLS statements and new public-content seed.
- Production server-action integration checks: login/auth rejection, photo and
  MP4 upload/verification, team draft/publish/remove, English role selection,
  hidden-contact exclusion, page-video publication, reel publication/removal,
  cron authentication/notice/deletion/failure/retry, preservation of application
  rows, and the unchanged 60-second signed CV download.
- Browser check: job draft returns 404, publication makes both language routes
  available, and renaming keeps the original slug.
- Scoped ESLint has no errors; existing raw-image warnings remain in Home and
  Contact. No new dependencies were added.

## Mobile review and remaining launch work

Home, Team, Join Us, Contact, and the CMS editor were inspected at 390px. The
navigation and language controls fit; there was no document-level horizontal
overflow. The expanded menu also fits at 320px. A small-screen Join Us outline
heading clipped at 320px; its size now scales down below 360px. Existing animation
and lazy-loading components are retained. CMS tables scroll within their wrapper.

This is a responsive browser review, not physical iOS/Android or Figma pixel-match
sign-off. Real-device video playback and touch interaction still merit a final pass.

Existing main contains German body copy on English Home, Join Us, and Contact
routes. Craft remains a coming-soon page/menu entry. These belong to the public
site/go-live work described in PR #8 and need the public-site owner's final review.
This PR localizes the new CMS fields and English job-list titles without rewriting
that copy or changing the agreed navigation.

Two implementation choices should be confirmed before rollout:

- Advance CV notices are persistent **inside the CMS**, not email notifications.
- Instagram is a **curated list of reel links and covers**, preserving the animated
  home gallery. It does not poll an Instagram account or embed a tracking player.

Allow roughly **1–2 working days** after access and final assets are available for
real-provider staging checks, content loading, real-device QA, and rollout. This
excludes the public-site owner's remaining copy/Craft work. If email notices are
required, budget another **2–4 hours** once sender and recipients are confirmed.
Automatic Instagram syncing is separate work: provisionally **1–2 days** after
confirming account/API eligibility, excluding external approval delays.

Removed CMS entries do not purge shared public media objects. A future media
library/unused-file cleanup can be added if needed; CV deletion remains automatic
and independent of public media.
