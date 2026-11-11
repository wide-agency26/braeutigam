# Typography remnants (outside `typography-tokens.css`)

Public copy should use token classes. What remains is layout-only, non-text, CMS, or specs without a Figma token.

## Fixed rules still on public routes

| Location | What | Reason |
|----------|------|--------|
| `ExpertCard.css` `.expert-card__initial` | `42cqi` display letter | Grid display initial, not body copy |
| `HorizontalTimeline.tsx` `.tl-h-f1-unmapped` | nearest `heading-secondary` | Figma 77.9px — no exact token |
| `HorizontalTimeline.tsx` `.tl-logo__tagline` | `copy-body-lg` (28/38) | Figma ~22.94px tagline |
| `globals.css` `.journey-intro__watermark` | `min(17.2vw, 28vh)` | Stroked watermark, not vw token scale |
| `CareerPage.css` | `clamp` hero/watermarks, `crew-job__title` `0.95rem` | Careers marketing display + job title row |
| `CareerPage.css` `crew-stats` | `0.62rem` dt, clamp dd | Stats strip — partial token pass (job meta → `copy-tiny`) |
| `SpecularButton.css` `.specular-button--sm/md/lg` | `0.875–1.125rem` | Non–`site-btn` glass buttons only; **`site-btn` unsets** so `button-body-*` wins |
| Legal long-form (`impressum`, `datenschutz`, EN) | prose spacing via layout | Headings use `heading-tertiary`; body relies on Tailwind prose defaults |

## Audit limitation

Expert cards load via `LazyOnVisible`; headless audit may not hydrate them in dev. **EMAIL/PHONE** (`button-body-caption`) — check on Vercel preview or after scrolling `/team` in the browser.

## Mapped in PR #10 follow-up (no longer remnants)

- Expert **EMAIL/PHONE** CTAs → `button-body-caption` via `SiteButton` (`.site-btn` resets Specular `font-size`/`font-weight`)
- Home **#story** scrolly headline → `heading-secondary` + `heading-secondary-bold`
- Karriere job list meta → `copy-tiny`; apply submit → `copy-caption`
- Home HUD / manifest bars → `copy-tiny` / `copy-caption`

## Layout `clamp` (not font-size)

`globals.css`, `ManifestSection.css`, `CareerPage.css`, `ContactPage.css` — gutters, padding, image bands.

## CMS (`app/cms/`)

Admin UI sizing excluded.

## `text-[var(--…)]` on shells

Theme colors only, not typography overrides.
