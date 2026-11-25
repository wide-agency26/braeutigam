# 25 November feedback implementation

Work is on `codex/craft-video-feedback-25nov`, branched from `ray-feedback-23nov`. The user authorized staging deployment and a new pushed branch on 25 November. Production and resume storage/security remain unchanged.

## Design and assets

- Craft follows Figma frame `2195:165`: Beams hero, 12-step process, production photography, TÜV certificate, machine park, inspection instruments, component range and enquiry CTA.
- Supplied process laser animation uses native scrolling. Content stays readable without animation; reduced motion disables the laser. Animation loops pause when their section is off-screen or the document is hidden.
- Machine drawings use the supplied light/dark variants. All new Craft raster images are WebP (about 2.8 MB for both theme sets combined); below-fold images are lazy-loaded. The hero poster is about 32 KB.
- Mobile changes cover core-value and mission spacing, CAD centering/map separation, the Craft button spacing, the 2016 portrait crop, the menu logo/address gap, footer top padding and button accent clearance.
- Favicon and touch icon reuse the current site's original B mark. `THIRD_PARTY_NOTICES.md` records asset/code provenance.

### Implemented visual details

- The existing light canvas is `#F9F9FB`; the Craft dark canvas is `#131414`. Craft phase accents use `#087a08` in light mode and `#00ff00` in dark mode. These are existing code values, not a replacement site palette.
- Craft phase headings keep the shared two-line section structure, with a scoped regular Univers Condensed first line and Bootzy second line, both weight 400. The shared section size is `clamp(36px, 3.958vw, 76px)`, changing to `clamp(30px, 7.8vw, 48px)` at 700px. Body copy uses Univers; technical metadata uses JetBrains Mono. Other pages keep the shared bold Univers Condensed first line.
- Craft content caps at 1920px with 24–64px side gutters. Photography uses two columns and equipment three columns; equipment becomes two columns from 701–1100px, and both use one column at 700px and below. Photograph corners are 12px. The process retains its native-scroll, single-column track and readable static content; reduced motion hides its decorative laser.

## YouTube CMS

`/cms/admin/videos` manages the five existing careers film positions: design, prepreg, cutting, production planning and assembly. Each has shared or separate DE/EN video links, optional translated titles, and a publish checkbox. Only validated HTTPS YouTube video IDs are stored/rendered. Public pages use the original photograph for empty/draft positions. The YouTube iframe is created only after the visitor selects Load video; an external YouTube link is available if embedding is blocked.

Video frames use automatic height. The consent control stays in normal flow, with a 240px minimum height, a preferred 16:9 ratio and wrapping titles, so long translated titles can increase its height. The iframe also has a 240px minimum height.

Before enabling the editor on a deployed environment, apply its additive migration:

- Cloudflare D1: `migrations/0004_site_videos.sql`.
- Existing PostgreSQL/Supabase deployment: `prisma/migrations/20261125090000_site_videos/migration.sql` through the project's normal Prisma deployment process.

The PostgreSQL migration enables RLS on the new table and revokes public-role access. Existing tables, policies and storage code remain unchanged. The migration was tested in the local D1 emulator and then applied to `braeutigam-cms-staging` after deployment authorization. The PostgreSQL migration has not been applied or integration-tested in this round.

Still needed: the final YouTube links for each position, indicating shared or separate DE/EN content. Videos must permit embedding; confirm playback using the actual supplied videos before publishing them.

## Local checks

- Next.js production build, Cloudflare production build, TypeScript, scoped ESLint and `git diff --check`.
- `node --import tsx scripts/verify-videos.ts`: allowed URL formats, rejected hosts/markup, publish requirements, drafts and locale selection.
- `pnpm cf:test:images`: responsive image behavior.
- Local CMS sign-in protection; save/publish/reload; same ID in both locales in shared mode; separate English ID in localized mode; unpublish restores the photo; no iframe before consent.
- Browser review of DE/EN Craft, light/dark equipment, mobile process/hero, CAD, menu, careers button and footer. Local screenshots are ignored under `.impeccable/review/`.

Run `pnpm cf:preview` after `pnpm cf:build` to inspect the built app at `http://127.0.0.1:3008`. This round's test video remains an unpublished local draft only.

## Staging deployment — 25 November

- URL: https://braeutigam-staging.rubenis-raimonds1.workers.dev
- Worker version: `49405764-7362-4e81-810d-edb9891998c8`.
- Previous version for code rollback: `2c322489-d4bc-4b20-a055-ce2643883f4b`. The additive video table can remain if the Worker code is rolled back.
- Rebuilt with the verified existing account and staging D1 binding, then deployed the prebuilt output without provisioning resources. The existing session secret was preserved.
- Remote D1 applied only `0004_site_videos.sql`. No test video content was published remotely.
- Live checks cover DE/EN home, Craft and careers responses, the language switch, new image/PDF/favicon assets, CMS unauthenticated redirects, and staging noindex headers/metadata/robots. The English Craft page rendered without browser console errors.
- Existing launch item discovered during smoke checks: `/sitemap.xml` returns 404, and this branch has no sitemap route. This deployment keeps staging non-indexable; the sitemap still needs implementation before production launch.
