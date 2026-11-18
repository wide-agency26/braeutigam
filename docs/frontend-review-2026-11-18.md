# Figma follow-up review — 18 November 2026

Branch: `codex/figma-frontend-completion`, based on current `origin/main` at `feb8efd`.

## Findings corrected

- Team headings and names now use the existing Figma Secondary and Team-Card typography. Cards can grow to contain long names and contact buttons at 320px; all 13 cards were checked for button overflow. Contact links include the person's name for screen readers.
- The first Team portrait loads eagerly; subsequent portraits remain lazy. Careers photographs use more accurate responsive source sizes, including their crop widths.
- Careers benefit frames now follow Figma's 576 × 600 proportions instead of the previous shallow landscape ratio.
- Craft includes the missing phase labels and desktop machine-park metadata from node `1655:20`.
- The wide timeline canvas clipped its year and paragraph content on phones. At 700px and below it now presents the same milestones and photographs in normal document flow. The desktop horizontal animation remains. Reduced-motion users also receive full stories instead of titles alone.
- The English timeline careers CTA now stays on `/en/karriere`.
- The existing disabled Formula 1 claim flag now applies to its headline as well as its paragraph.

## Figma review

Rechecked the current Home, Mission, CREW, Craft and component-library references, together with the visible comment list including resolved threads. The latest visible comment remains #29. No comments were posted or resolved.

The current visible Team card is the compact contact variant. The larger variant referred to in an older comment is hidden in the component library. The implementation follows the current visible variant and uses its existing type tokens.

## Validation

- Production build passed: `DATABASE_URL='' DIRECT_URL='' VERCEL_ENV=preview pnpm exec next build --webpack`.
- TypeScript passed: `pnpm exec tsc --noEmit`.
- Full ESLint passed with zero errors and the one existing image warning in the protected homepage hero.
- `git diff --check` passed.
- Browser review covered 320px and 390px phones, 768px tablet, and 1440px/1920px desktop views. Checked Team card containment, careers photo proportions, Craft labels and light-theme contrast, DE/EN switching, English contact links and 404 recovery links.
- Verified desktop timeline translation changes with scrolling and Skip reaches its final 2026 panel. Verified the phone timeline uses the readable vertical layout without horizontal document overflow.
- Rechecked the preserved-file diff against main: homepage hero, typography tokens, storage, database/schema, APIs, and noindex configuration remain unchanged.

Local validation used empty database connection variables. There were no migrations, database writes, application submissions, or live deployments. Live recruitment flows and production Core Web Vitals were not measured in this visual review.

## Still required before calling the site final

1. Five careers video files or approved video URLs. The matching photographs are displayed without fake playback controls.
2. Final Craft process/machine photographs and per-machine details. Figma itself still contains grey photo slots and `folgt` fields. Its equipment layout has eight individual machine cards; the current site still uses three category summaries until that content is available. This section is provisional, not a complete visual match.
3. Editorial approval of the drafted DE/EN careers, Craft and FAQ copy, and confirmation of existing company/specification claims before launch.

See `frontend-review-2026-11-17.md` for the preceding implementation and WebP asset-size measurements. Those measurements describe file sizes, not guaranteed load times.
