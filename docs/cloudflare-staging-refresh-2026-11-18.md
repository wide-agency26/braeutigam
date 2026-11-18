# Cloudflare staging refresh — 18 November 2026

Target: https://braeutigam-staging.rubenis-raimonds1.workers.dev

This branch is the Cloudflare preview runtime, based on the current Figma frontend and its image-loading improvements. It is separate from the Vercel/production branch. Do not merge its D1/R2 runtime and package changes into the production branch without an explicit migration decision.

## Image delivery

- Includes the image improvements from frontend commit `f8adea9`: no redundant original hero JPEG preloads, accurately sized Team portraits and mobile Contact hero.
- Uses the existing Cloudflare Images binding for AVIF/WebP negotiation and resizing.
- Pins a two-line `vinext@1.4.4` patch because this version otherwise emits only a 640px source for local `fill` images. The patch restores responsive srcsets and respects each image's `sizes`, without modifying SiteHero, typography, animations, or styles.
- Run `node scripts/verify-cloudflare-images.mjs` after dependency changes; it checks rendered fill images, responsive props, fixed-size images, SVG and explicit unoptimized bypasses. Remove the patch only once the adapter itself supports these cases.

## Staging compatibility

- Reuses the established staging D1 database and private EU R2 bucket; no production Supabase connection or database policies changed.
- Current application submission uses a stable server action and an atomic D1 batch. CV upload failure compensation and 30-day retention timestamps are preserved.
- Migration `0003_application_pipeline.sql` accepts current and legacy pipeline statuses, preserving every existing record and field. Applied only to the staging D1 database. All six jobs and eight demo applications remain; foreign-key checks passed.
- Retained authenticated CV downloads with private/no-store and nosniff headers.
- Old `/en/careers` and `/en/contact` URLs redirect to the current routes.
- The Worker remains noindex/nofollow, with robots.txt disallowing crawling. No production domains or DNS changed.

## Verification

- Frontend production build and scoped lint passed before deployment.
- Cloudflare typecheck and build passed; image regression checks passed.
- A synthetic application submitted successfully through the local Worker UI, with a 625-byte synthetic PDF, `REACHED_OUT` status and exactly 30 days of retention. No live applicant test record was created.
- Deployment route checks: German/English Home, Craft, Careers, Contact and Team return 200; an unknown route returns 404; admin requests redirect to login; legacy English URLs redirect correctly.
- Live image responses verified as AVIF and WebP with long-lived cache headers. These are response checks, not a Lighthouse/Core Web Vitals score.

## Recovery and redeployment

Run the guarded `pnpm cf:deploy` with verified `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_ID`, and `CLOUDFLARE_SECRETS_FILE`. The existing protected secret file stays outside Git; deployment refuses automatic resource provisioning.

Previous Worker version before this task: `fa819eff-5c76-4c16-99d5-795af27b78c5`.
Staging D1 pre-migration bookmark: `0000000e-00000000-00005127-ccbbcb4b1e0c5c37a2bbb138cba3b9dc`.
The compatible migration accepts both old and new statuses, so an immediate Worker rollback does not require a database rollback.
