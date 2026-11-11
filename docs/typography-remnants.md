# Typography remnants (outside `typography-tokens.css`)

Public copy should use token classes. What remains is layout-only, non-text, CMS, or specs without a Figma token.

## Fixed rules still on public routes

| Location | What | Reason |
|----------|------|--------|
| `ExpertCard.css` `.expert-card__initial` | `42cqi` display letter | Grid display initial, not body copy |
| `HorizontalTimeline.tsx` `.tl-h-f1-unmapped` | nearest `heading-secondary` | Figma 77.9px — no exact token |
| `HorizontalTimeline.tsx` `.tl-logo__tagline` | `copy-body-lg` (28/38) | Figma ~22.94px tagline |
| `globals.css` `.journey-intro__watermark` | `min(17.2vw, 28vh)` | Stroked background watermark |
| `globals.css` `.experts-figma__hud-val` | inherits **16px** Univers Roman on HUD numbers (`80+`, `9`) | No token on value spans; labels use `copy-tiny` |
| `CareerPage.css` | `rem` / `clamp` throughout (see list below) | Careers marketing + job UI not fully token-mapped |
| `SpecularButton.css` `.specular-button--sm/md/lg` | `0.875–1.125rem` on **`:not(.site-btn)`** glass buttons | Site CTAs use `SiteButton` + token classes; `font: inherit` scoped away from `.site-btn` |
| Legal long-form (`impressum`, `datenschutz`, EN) | prose / layout | Headings use `heading-tertiary`; body not on vw tokens |

### `CareerPage.css` leftover `rem` / `clamp` font sizes

`crew-stats` dt `0.62rem`, dd clamp; `.crew-hero` / `.career-watermark` display clamps; `.crew-story` `0.82rem` / `0.84rem` / `0.62rem`; `.crew-job__title` `0.95rem`; `.crew-path` / quotes / labels `0.78rem`–`0.92rem` and heading clamps; mobile overrides `4.4rem`, `0.58rem`, etc.

## Expert EMAIL/PHONE CTAs

`SiteButton` + `button-body-caption` on expert cards. **Specular** must not set `font:` on `.site-btn` (loads after `/typography-tokens.css`). Audit scrolls the page to hydrate `LazyOnVisible`; confirm on preview after lazy cards load.

## Partially mapped (PR #10)

- Home **#story** scrolly → `heading-secondary` + `heading-secondary-bold`
- Karriere job dept/meta → `copy-tiny`; apply submit → `copy-caption`
- Home / manifest HUD **labels** → `copy-tiny` / `copy-caption` (values still 16px Roman — see above)

## Layout `clamp` (not font-size)

`globals.css`, `ManifestSection.css`, `CareerPage.css`, `ContactPage.css` — gutters, padding, image bands.

## CMS (`app/cms/`)

Admin UI sizing excluded.

## `text-[var(--…)]` on shells

Theme colors only, not typography overrides.
