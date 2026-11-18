# Align frontend with Figma, improve loading and refresh Cloudflare staging

This revision brings the public pages closer to the supplied Figma designs, improves mobile layouts and image delivery, and fixes application-form recovery and CV-cleanup error handling. It also includes the Cloudflare staging runtime used by the current preview.

## Changes

- Update Home, Careers, Craft, Team, Contact, navigation and footer details using Figma-exported icons and WebP photography. Preserve the existing hero photo selection, light/dark behaviour and typography tokens.
- Make the timeline readable on mobile while retaining its desktop animation; improve card sizing, accessibility, language-route continuity and the custom 404 page.
- Remove duplicate original hero-image downloads, correct responsive image sizes, and restore responsive image sources in the Cloudflare adapter. Keep static fallbacks for unavailable animation/gallery code.
- Fix the clipped German/English customer and principle headings without changing their font size or line spacing. Correct saved-theme hydration so light/dark reloads use the matching hero wordmark.
- Localize application validation and upload errors in DE/EN, retain form drafts after failed submissions, and focus the relevant error.
- Retain application records when CV deletion fails so cleanup can retry; show accurate retention deadlines, including overdue records.
- Keep CV downloads platform-specific: normal Next.js builds preserve the existing short-lived Supabase redirect; Cloudflare builds use authenticated private R2 responses.
- Add Cloudflare staging support with D1, private R2 storage, authenticated CV downloads, image resizing and guarded deployment tooling.

## Validation

- Next production build, Cloudflare build/typecheck, lint checks and responsive-image regression checks passed during the implementation review.
- Mocked download checks cover authorization, missing files, private signed-redirect headers and the R2 adapter.
- Mocked CV-retention checks cover authorization, environment guards, failed file deletion, invalid paths and successful cleanup.
- Staging checks passed for 16 public DE/EN routes and 52 assets. Verified image format negotiation, mobile navigation, language switching, form-error recovery and the 404 page.
- Verified saved light/dark reloads without hydration errors and visually checked the complete DE/EN customer headings.
- Verified a synthetic application through a local Worker. No real applicant records were created for testing.

Preview: https://braeutigam-staging.rubenis-raimonds1.workers.dev

## Scope and remaining work

This branch includes Cloudflare-specific runtime, dependency and D1/R2 changes as well as frontend changes. Production Vercel/Supabase has not been migrated or modified; agree the production hosting/storage plan before merging the combined branch into the production release. Pre-launch noindex remains enabled.

Still outstanding:
- CMS-managed video uploads/links, Team members and Instagram reel selection.
- Scheduled 30-day CV cleanup on Cloudflare and verification of the advance admin notice. A seven-day CMS warning already exists.
- Final careers videos, Craft photos and eight individual machine-card details, plus DE/EN editorial approval. Craft currently uses provisional category summaries.
- Confirmation of direct contact-form delivery versus the current email-app workflow.

Automatic Instagram feed synchronization and a site-wide text editor are not part of the confirmed CMS scope.
