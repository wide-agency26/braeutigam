# Deployment review — 18 November 2026

Reviewed Cloudflare staging at https://braeutigam-staging.rubenis-raimonds1.workers.dev. This pass checked deployed functionality and regressions; it is not a new full Figma comparison or a production Core Web Vitals measurement.

## Fixed in this review

- `app/actions/applications.ts`, `lib/validations.ts`, `lib/resume-limits.ts`: application validation and file errors now follow the selected DE/EN language. Turnstile network failures are caught by the existing failure handler instead of escaping the action.
- `app/karriere/[slug]/ApplyForm.tsx`: a rejected submission no longer resets the user's draft. The client dispatches the action in a transition, preserves native browser validation, focuses the first invalid field/error and announces pending state. Input length limits now match server limits.
- `app/api/cron/purge-cvs/route.ts`: a failed storage deletion or malformed storage path retains the application record for retry. A partial failure returns 503 instead of reporting success. Authentication and the production-only execution guard remain unchanged; no cleanup was executed against live data.
- `lib/format.ts`: retention badges describe the deadline rather than promise an automated deletion, and overdue items remain visible. The distinction matters while Cloudflare scheduling is not configured.
- German Contact copy and metadata now use “Motorsport-Prototyp”, matching the English page's conservative wording while specific Formula 1 supply claims await approval.

## Verified

- Sixteen public German/English routes returned 200 and retained noindex protection.
- All 52 checked JavaScript, stylesheet and SVG icon assets returned 200.
- Image endpoint returned AVIF, WebP and JPEG according to the tested Accept headers, with Vary: Accept. Existing responsive-image regression checks passed.
- Browser review: mobile navigation, Escape dismissal/focus restoration, Team/Craft/Careers/Contact layout, FAQ expansion, light/dark switching and switching language on the same job detail. No horizontal document overflow or broken loaded images was observed in those mobile views.
- Local Worker form test: English field errors and missing-file errors preserve the name, email and cover-letter draft. German field errors are translated and focus the invalid field. Native constraints were disabled only in a temporary local test build to exercise these server failures without a file upload; the override was removed before deployment.
- Production Next build, TypeScript and scoped ESLint passed. Mocked retention-route tests cover authentication, environment guards, storage failure, invalid paths and successful deletion. No real applications, CVs or database schema were modified in this review.

## Still outstanding in this deployed build

1. **Cloudflare automatic CV cleanup:** the endpoint requires `VERCEL_ENV=production`, and this Worker has no scheduled handler. The 30-day timestamp and seven-day CMS deadline badge exist, but the staging Worker does not automatically delete CVs. There is no separate automatic admin email reminder.
2. **CMS content management:** jobs/applications are connected. Team members still come from `lib/data/experts.ts`; there is no Team management screen. Page-mapped video uploads are not implemented in this branch.
3. **Final media and editorial approval:** five careers videos, final Craft process/machine photos and machine details remain outstanding. Craft currently shows three machine categories, not Figma's eight individual machine cards. DE/EN drafts and company/specification claims still need approval.
4. **Social updates:** the home section links to six real Instagram reels using local posters. The list is curated in code, not automatically synchronized or editable in the CMS.
5. **Contact delivery:** the contact form intentionally prepares an email in the visitor's email app; it does not send from a backend. Its visible notice explains this.

The staging deployment remains a seed-data preview. Production Supabase, private-bucket policies, signed-download implementation, hero styles and typography tokens were not changed.

Review reference: [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md).

## Follow-up: customer headings and saved theme

- Extended the gradient paint area on the two manifest headings so ascenders are not cut off by their 0.85 line height. Equal negative margins retain the existing layout spacing; font sizes and generated typography tokens are unchanged.
- Made the theme provider use a hydration-safe DOM subscription. A saved light theme no longer produces a server/client class mismatch on the hero wordmark; switching themes still works when persistent storage is unavailable.
- Local browser verification covered the complete German and English headings in dark/light views and fresh loads with both saved themes. No hydration errors were logged in the fresh verification tab.
- The current consolidated source branch is `ray-latest-revision`. The ready-to-paste PR description is in `pr-ray-latest-revision.md`; the Cloudflare deployment uses a clean checkout of that branch's commit.
