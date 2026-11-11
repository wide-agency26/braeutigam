# Icon audit — Figma file `U6PdyBS92GPjpwcznGYV7J`

## Exported to `public/icons/figma/`

| Asset | Used for | Replaces |
|-------|----------|----------|
| `chevron-right.svg` | Career job rows | `lucide-react` `ChevronRight` |
| `play-fill.svg` | Career film play affordance | `lucide-react` `Play` |

Mission chips / footer / chrome continue to use existing `public/images/**` SVGs from prior export (`chip-*.svg`, `footer-frame.svg`, `since-badge.svg`).

## Remaining lucide usage

None on public routes after career swap (`package.json` may still list `lucide-react` for future removal).

## Color

Icons use `currentColor`; parent sets `color: var(--icon-default-caption)` or token from `app/figma-tokens.css`.
