# Figma match log — file `U6PdyBS92GPjpwcznGYV7J`

Branch: `style/light-mode-figma-v2` · Tokens: `app/figma-tokens.css`  
**Dark policy (Ali):** matches Figma dark home **`934:241`** + library dark nodes exactly (`pnpm sync:figma-tokens`). Page `#131414`, body `#d0d0d0`, caption `#a1a1a1`, green `#00ff00` (not PR #10 `#39FF14`).

## Skipped (by plan)

| Node | Section | Notes |
|------|---------|--------|
| `2006:132` / dark hero image | Hero | **Hero photo unchanged**; rings/gradients use `--colors-greeeen` + `brand-dark` only |
| — | Typography | **Skipped: typography** — PR #10 token classes unchanged |

## Skipped: no dark frame

No dedicated dark Figma frame in file for these routes (styling uses home dark tokens + shared chrome):

| Route / area | Notes |
|--------------|--------|
| `/impressum`, `/datenschutz`, `/en/imprint`, `/en/privacy` | Legal text pages |
| `/kontakt`, `/en/kontakt` | Contact layout; hero photo/validation in `docs/color-exceptions.md` |
| `/karriere`, job detail | Career content; hero `1389:53` light-only reference for CREW |
| `/team` | Expert grid uses home dark expert tokens |
| Admin (`/cms`) | Out of Figma scope |

## Dark home `934:241` — section map

| Order | Figma (light ref) | Name | Match |
|------|-------------------|------|-------|
| — | `2006:132` | Hero | Rings → `#00ff00`; page scrim → `#131414` |
| 1–3 | `2006:162`–`287` | Micrographic / HUD | `ManifestSection.css` + `figma-theme-dark.css` |
| 4–7 | `2006:304`–`414` | CAD | Token text; CAD canvas excepted |
| 8 | `2006:469` | Mission | Heading `#f0f0f0`, perf `#00ff00` |
| 9–10 | `2006:515`–`533` | Timeline | `HorizontalTimeline.css` vars |
| 11 | `2006:660` | Experts | `ExpertCard.css` |
| 12 | `2006:790` | Social | Page `#131414`, links `#a1a1a1` |
| 13 | `2006:809` | Footer | Nav `#f0f0f0`, bottom on-bright `#131414`, LineWaves `#00ff00` |

## Light home `2006:131`

Unchanged from prior pass; see git history / PR #12.

## Known deltas

- Hero **image asset** not swapped (intentional).
- CAD / WebGL / specular controls may keep procedural gradients in `docs/color-exceptions.md`.
