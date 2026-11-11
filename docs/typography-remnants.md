# Typography remnants (outside `typography-tokens.css`)

Public surfaces should use token utility classes. Remaining rules are layout-only, non-text, CMS, or deliberate unmapped specs.

## Intentional unmapped (no Figma token)

| Location | Rule | Reason |
|----------|------|--------|
| `ExpertCard.css` `.expert-card__initial` | `42cqi` display initial | Card grid display scale, not copy |
| `HorizontalTimeline.tsx` `.tl-h-f1-unmapped` | `heading-secondary` (+ bold on strong) | Figma 77.9px headline — nearest token is 76px `heading-secondary` |
| `HorizontalTimeline.tsx` `.tl-logo__tagline` | `copy-body-lg` (28/38) | Figma wordmark tagline ~22.94px — no token |
| `globals.css` `.journey-intro__watermark` | `min(17.2vw, 28vh)` | Stroked background watermark, viewport-relative display |
| `CareerPage.css` | `clamp` display type, `rem` meta | Careers marketing layout (outline watermarks, job UI) — token pass deferred |
| `SpecularButton.css` `.specular-button--sm/md/lg` | `0.875–1.125rem` | Generic glass buttons (non–site-btn); site CTAs use `button-body-*` on `.site-btn` |

## Layout / non-typography `clamp` (gutters, padding, gaps)

`globals.css` (`--site-gutter`, mission/experts spacing), `ManifestSection.css`, `CareerPage.css`, `ContactPage.css` — spacing only, not `font-size`.

## CMS (`app/cms/`)

Admin UI uses separate sizing; excluded from public token audit.

## Tailwind `text-[var(--…)]`

Theme foreground/background on page shells — not font-size overrides.
