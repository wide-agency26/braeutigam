# Figma tokens

Source: [`scripts/data/figma-variables-source.json`](../scripts/data/figma-variables-source.json)  
MCP node dumps: [`scripts/data/figma-variables-mcp/`](../scripts/data/figma-variables-mcp/)  
Full library export: `FIGMA_ACCESS_TOKEN=… node scripts/fetch-figma-variables.mjs --api`

Regenerate CSS: `pnpm sync:figma-tokens`

Color + dimension keys in source: light **53**, dark Figma **53** (target: full file catalog ~199 via Variables API).

## Variable map

| Figma variable | Collection | CSS name | Light | Dark (Figma) | Dark (applied) |
|----------------|------------|----------|-------|--------------|----------------|
| `Border Sizes/Radius/L` | Border Sizes | `--border-sizes-radius-l` | 12 | 12 | 12 |
| `Border Sizes/Radius/M` | Border Sizes | `--border-sizes-radius-m` | 8 | 8 | 8 |
| `Border Sizes/Radius/XL` | Border Sizes | `--border-sizes-radius-xl` | 20 | 20 | 20 |
| `Border Sizes/Width/S` | Border Sizes | `--border-sizes-width-s` | 2 | 2 | 2 |
| `Border Sizes/Width/XS` | Border Sizes | `--border-sizes-width-xs` | 1 | 1 | 1 |
| `Brand Colors/Greys Transparent/500,30` | Brand Colors | `--brand-colors-greys-transparent-500-30` | #1314144d | #1314144d | #1314144d |
| `Color/Accent/500` | Colors | `--color-accent-500` | #00ff00 | #00ff00 | #39FF14 (snapshot) |
| `Color/Accent/600` | Colors | `--color-accent-600` | #00cc00 | #00cc00 | #00cc00 |
| `Colors/GREEEEN` | Colors | `--colors-greeeen` | #00ff00 | #00ff00 | #39FF14 (snapshot) |
| `Neutral/Black` | Neutral | `--neutral-black` | #131414 | #131414 | #131414 |
| `Neutral/Image-overlay/Black 30` | Neutral | `--neutral-image-overlay-black-30` | #1314144d | #1314144d | #1314144d |
| `Neutral/White` | Neutral | `--neutral-white` | #f0f0f0 | #f0f0f0 | #f0f0f0 |
| `Scale/0` | Scale | `--scale-0` | 0 | 0 | 0 |
| `Scale/100` | Scale | `--scale-100` | 4 | 4 | 4 |
| `Scale/1000` | Scale | `--scale-1000` | 40 | 40 | 40 |
| `Scale/1050` | Scale | `--scale-1050` | 52 | 52 | 52 |
| `Scale/1100` | Scale | `--scale-1100` | 64 | 64 | 64 |
| `Scale/1200` | Scale | `--scale-1200` | 72 | 72 | 72 |
| `Scale/1400` | Scale | `--scale-1400` | 132 | 132 | 132 |
| `Scale/200` | Scale | `--scale-200` | 8 | 8 | 8 |
| `Scale/300` | Scale | `--scale-300` | 12 | 12 | 12 |
| `Scale/400` | Scale | `--scale-400` | 16 | 16 | 16 |
| `Scale/50` | Scale | `--scale-50` | 2 | 2 | 2 |
| `Scale/500` | Scale | `--scale-500` | 20 | 20 | 20 |
| `Scale/600` | Scale | `--scale-600` | 24 | 24 | 24 |
| `Scale/700` | Scale | `--scale-700` | 28 | 28 | 28 |
| `Scale/800` | Scale | `--scale-800` | 32 | 32 | 32 |
| `Scale/900` | Scale | `--scale-900` | 36 | 36 | 36 |
| `border/primary/default` | border | `--border-primary-default` | #131414 | #131414 | #131414 |
| `border/primary/default-hover` | border | `--border-primary-default-hover` | #424343 | #424343 | #424343 |
| `border/primary/secondary` | border | `--border-primary-secondary` | #00ff00 | #00ff00 | #39FF14 (snapshot) |
| `border/primary/secondary-hover` | border | `--border-primary-secondary-hover` | #00cc00 | #00cc00 | #00cc00 |
| `border/primary/tertiary` | border | `--border-primary-tertiary` | #ffbf00 | #ffbf00 | #ffbf00 |
| `button/background/default` | button | `--button-background-default` | #1f2020 | #1f2020 | #1f2020 |
| `button/background/default-hover` | button | `--button-background-default-hover` | #424343 | #424343 | #424343 |
| `button/background/secondary` | button | `--button-background-secondary` | #1f2020 | #1f2020 | #1f2020 |
| `button/background/secondary-hover` | button | `--button-background-secondary-hover` | #424343 | #424343 | #424343 |
| `button/text/default` | button | `--button-text-default` | #f0f0f0 | #f0f0f0 | #f0f0f0 |
| `button/text/default-hover` | button | `--button-text-default-hover` | #00cc00 | #00cc00 | #00cc00 |
| `icon/default/caption` | icon | `--icon-default-caption` | #a1a1a1 | #a1a1a1 | #a1a1a1 |
| `icon/default/placeholder` | icon | `--icon-default-placeholder` | #717272 | #717272 | #717272 |
| `surface/pages/page` | surface | `--surface-pages-page` | #131414 | #131414 | #131414 |
| `surface/pages/page-secondary` | surface | `--surface-pages-page-secondary` | #1f2020 | #1f2020 | #1f2020 |
| `text/default/accent` | text | `--text-default-accent` | #00ff00 | #00ff00 | #39FF14 (snapshot) |
| `text/default/accent secondary` | text | `--text-default-accent-secondary` | #ffbf00 | #ffbf00 | #ffbf00 |
| `text/default/accent subtle` | text | `--text-default-accent-subtle` | #006600 | #006600 | #006600 |
| `text/default/accent subtle secondary` | text | `--text-default-accent-subtle-secondary` | #cc9900 | #cc9900 | #cc9900 |
| `text/default/body` | text | `--text-default-body` | #d0d0d0 | #d0d0d0 | #d0d0d0 |
| `text/default/caption` | text | `--text-default-caption` | #a1a1a1 | #a1a1a1 | #a1a1a1 |
| `text/default/heading` | text | `--text-default-heading` | #f0f0f0 | #f0f0f0 | #f0f0f0 |
| `text/default/placeholder` | text | `--text-default-placeholder` | #717272 | #717272 | #717272 |
| `text/on-bright/accent` | text | `--text-on-bright-accent` | #00cc00 | #00cc00 | #00cc00 |
| `text/on-bright/heading` | text | `--text-on-bright-heading` | #131414 | #131414 | #131414 |

## Pending dark decisions

Figma dark home **934:241** is documented below; **production dark unchanged** until explicitly approved.

| Figma variable | CSS name | Figma (934:241) | Applied (now) | Used in |
|----------------|----------|-----------------|---------------|---------|
| `surface/pages/page` | `--surface-pages-page` | #131414 | #0B0B0C | html/body background, page chrome |
| `text/default/body` | `--text-default-body` | #d0d0d0 | #f4f4f5 | body copy (via --foreground) |
| `text/default/caption` | `--text-default-caption` | #a1a1a1 | — (inherits foreground) | captions, social links |
| `text/default/heading` | `--text-default-heading` | #f0f0f0 | #f4f4f5 | headings |
| `text/on-bright/heading` | `--text-on-bright-heading` | #131414 | #f0f0f0 | footer bottom bar, on-bright surfaces |
| `text/default/accent secondary` | `--text-default-accent-secondary` | #ffbf00 | #ff8800 | amber accents |
| `text/default/accent subtle` | `--text-default-accent-subtle` | #006600 | #00cc00 | subtle green text |
| `text/default/accent subtle secondary` | `--text-default-accent-subtle-secondary` | #cc9900 | #cc6d00 | orange subtle |
| `Colors/GREEEEN` | `--colors-greeeen` | #00ff00 | #39FF14 | neon, rings, LineWaves, timeline, NotchedBorderGlow |
| `text/default/accent` | `--text-default-accent` | #00ff00 | #39FF14 | accent text |
| `border/primary/tertiary` | `--border-primary-tertiary` | #ffbf00 | #ff8800 | tertiary borders |
| `icon/default/caption` | `--icon-default-caption` | #a1a1a1 | #1f2020 | icon caption |

## Missing Figma variables

See [`figma-missing-variables.md`](figma-missing-variables.md).

## Non-exportable (Figma)

- `border/gradients/green to grey`
- `Button/Border Gradient Primary`
- `Text/gradient/Grey Overlay`
