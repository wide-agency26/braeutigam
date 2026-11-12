# Figma 1920 rebuild log

Branch: `rebuild/figma-1920`  
File: `U6PdyBS92GPjpwcznGYV7J`  
Light home: `2006:131` · Dark home: `934:241`

## Foundation

- Single scale: `calc(N * min(100vw, 1920px) / 1920)`, cap at design px.
- Typography from `scripts/data/figma-type-styles.json` (Figma variables + documented one-offs).
- QA: `pnpm figma:qa` → `scripts/figma-qa.mjs` + `scripts/data/figma-qa-layout.json`.

## Sections

| Section | Figma node | Commit | QA | Notes |
|---------|------------|--------|-----|-------|
| Hero | `2006:132` / `934:242` | _(this commit)_ | see below | Figma grid; MagicRings off unless `NEXT_PUBLIC_HERO_MAGIC_RINGS=true`. Nav chrome stays in `SiteChrome` (Figma `2006:140` not duplicated). |
| Main Image | `937:253` | — | — | pending |
| CAD / story | `2006:304`+ | — | — | pending |
| Mission | `989:2` | — | — | pending |
| Journey | timeline frames | — | — | pending |
| Experts | `2006:660` | — | — | pending |
| Social | `2006:790` | — | — | pending |
| Footer | `2006:809` | — | — | pending |

## Interactive fallbacks

_(Document WebGL/timeline/gallery flags here when static Figma layout ships first.)_
