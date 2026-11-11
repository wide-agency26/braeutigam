# Figma match log — Home `2006:131` (file `U6PdyBS92GPjpwcznGYV7J`)

Branch: `style/light-mode-figma-v2` · Tokens: `app/figma-tokens.css`

## Skipped (by plan)

| Node | Section | Notes |
|------|---------|--------|
| `2006:132` | Hero | No code changes; existing `SiteHero` + MagicRings retained |

## Section status

| Node | Name | Match |
|------|------|-------|
| `2006:162`–`287` | Micrographic / HUD / stats | Light tokens via `ManifestSection.css` + `figma-theme-light.css` |
| `2006:304`–`414` | CAD | Dark CAD canvas excepted; light zinc shims via tokens |
| `2006:469` | Mission | Scoped `mission-figma__perf` ~127px; no global `decorative-primary` |
| `2006:515`–`533` | Timeline | `HorizontalTimeline.css` token variables |
| `2006:660` | Experts | `ExpertCard.css` light/dark token blocks |
| `2006:790` | Social | Page bg `--surface-pages-page`; title heading ink; links `--social-link` |
| `2006:809` | Footer | Nav heading ink (light); bottom bar on-bright; LineWaves reads CSS vars |
| `1389:53` | Career hero | Vignette + solid CREW; gradient fade to `--neutral-black` |

## Inner routes

| Route | Notes |
|-------|--------|
| `/kontakt` | Light shell via `ContactPage.css` `:root:not(.dark)` + exceptions for hero photo |
| `/karriere` | Hero + tokens; icons in `public/icons/figma/` |
| `/team` | Expert cards + footer/social shared |

## Known deltas

- Dark neon stays PR #10 `#39FF14` (`docs/figma-tokens.md` § Pending dark decisions).
- Hero and MagicRings intentionally not re-aligned in this pass.
