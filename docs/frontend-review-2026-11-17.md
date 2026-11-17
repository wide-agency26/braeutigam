# Frontend review — 17 November 2026

Branch: `codex/figma-frontend-completion`

Base: `main` at `feb8efdf3ca4315cd39dc06426aece37da2cbde6` (PR #14).

## Delivered

- Replaced redrawn core-value/stat icons and the footer/menu wordmark with SVG exports from Figma.
- Matched the homepage mission composition, customer/precision/join-team photographs, compact stats spacing, separated outline lettering, heading overlay, and Secondary/Secondary bold styles.
- Kept one green CAD topography field, the white line drawing and the existing three-stage scroll animation. Added the gold COMPOSITE_SPEC treatment and sentence-case description.
- Removed the extra timeline claim and upper-right year/percentage display, increased bottom-bar contrast, corrected Skip's document-relative destination, and gave gallery image frames an explicit positioning context before their CSS chunk arrives.
- Kept one experts CTA. Expert cards render immediately while their photos remain lazy-loaded.
- Matched careers to the CREW frame, replaced unrelated placeholder copy, and completed English careers/contact copy and conservative FAQ drafts. Existing jobs and application handling remain in place.
- Built `/craft` and `/en/craft` from the Craft frame. The navigation now links to them. Used existing workshop photos in unfinished Figma media slots; summarized the machine inventory where detailed content is absent.
- Added a bilingual, responsive 404 page with Home and Contact recovery links.
- Enlarged DE/EN, left-aligned the hamburger strokes, moved inner-page hero metadata below the controls, corrected narrow-screen menu/layout overflow and light-theme contrast.
- Standardized the public contact address to `info@braeutigam-gmbh.eu`. The contact form still prepares an email; its copy now makes this behavior explicit. Removed an unsupported ISO 27001/local-storage claim.
- Kept Instagram reel links and the curved gallery. Added static poster fallbacks for unavailable WebGL/chunks and real keyboard-accessible reel anchors. Failed lazy imports retry once instead of leaving the page blank.

## Figma evidence

File: https://www.figma.com/design/U6PdyBS92GPjpwcznGYV7J

| Reference | Node |
| --- | --- |
| Final Home | `934:241` |
| Mission | `989:2` |
| Stat icons | `1330:1166`, `1330:1158`, `1330:1150` |
| Core-value icon groups | `1351:225`, `1353:267`, `1353:344` |
| Precision photo | `1334:1880` |
| Join-team photo | `1360:444` |
| Customer photo | `939:301` |
| Wordmark | `1256:232` |
| CREW | `1623:125` |
| Craft | `1655:20` |

Reviewed the visible comments, including resolved threads and replies. Kept the requested moving rings, topography, specular buttons, social gallery and footer waves. The latest email and current frames take precedence over older WIP comments. No Figma comments were posted or resolved.

## Performance and verification

- 34 existing raster sources: **59,521,026 bytes → 4,166,112 bytes** in their WebP counterparts (about **93% smaller on disk**). This is an asset-size comparison, not a measured network/Core Web Vitals result. Three additional exported Figma photos bring the changed WebP set to 37 files / 4,397,204 bytes.
- Used responsive Next Image sizing for photographs; retained small vector icons as SVG. Heavy animation modules load near the viewport and keep static fallbacks.
- Production build: `DATABASE_URL='' DIRECT_URL='' VERCEL_ENV=preview pnpm exec next build --webpack`.
- TypeScript and full ESLint checks pass. ESLint retains one existing `no-img-element` warning in the protected homepage hero.
- Browser checks cover DE/EN route switching, Craft navigation, phone/tablet/desktop layouts, menu Escape/focus behavior, 404 recovery links/noindex, empty contact-form validation/focus, FAQ expansion, gallery posters and footer links.
- Static asset references were checked for missing local files. `git diff --check` passes.
- Design detector: the text gradient warning corresponds to the explicitly requested 20% Figma overlay; its grid-background advisory concerns existing background CSS.

## Preserved boundaries

The homepage hero, typography tokens, database/schema, storage implementation, policies, application actions and pre-launch indexing controls are unchanged. No database migrations, CMS writes, application submissions or live deployments were performed. Local testing used an empty database connection, so published jobs and the live application submission flow were not exercised.

## Content still needed

1. The five careers video files or final video URLs. The role photographs remain visible, without nonfunctional play controls.
2. Final Craft process/machine photography and missing per-machine details. The current equipment section uses the counts/brands shown in Figma; the provisional imagery should be reviewed before launch.
3. Editorial approval of the new DE/EN career, Craft and FAQ copy. No unconfirmed ISO certification, patent or new tolerance promises were added to that copy. Existing homepage specification/timeline claims still require the company's normal pre-launch fact check.

Allow roughly half a day to integrate supplied videos/photographs and repeat responsive QA, depending on video delivery format. A production Core Web Vitals measurement and live application-flow test should happen against the approved preview environment.
