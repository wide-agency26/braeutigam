# Figma 1920 rebuild log

Branch: `rebuild/figma-1920`  
File: `U6PdyBS92GPjpwcznGYV7J`  
Light home: `2006:131` · Dark home: `934:241`

## Foundation

- Single scale: `calc(N * min(100vw, 1920px) / 1920)`, cap at design px.
- Typography from `scripts/data/figma-type-styles.json` (Figma variables + documented one-offs).
- QA: `pnpm figma:qa` → `scripts/figma-qa.mjs` + `scripts/data/figma-qa-layout.json`.
- **Deliberate deviation:** `copy-tiny` line-height **12px** (not Figma Typesize `14px`) — approved override; size stays 10px.
- Layout dimensions: **only** `app/figma-scale.css` (Scale/25–1600, Border Sizes width/radius incl. none/XS–XL). `figma-tokens.css` is **colors + semantic aliases only** (no unscaled Scale/Border duplicates).
- **Type:** `heading-primary-bold` letter-spacing **0**; **−4%** only on `manifest-title-univers` (119.05). `decorative-primary` **8px** ls; `decorative-primary--wide` **14px** (Thomas wider tracking).
- **Case:** uppercase on `copy-caption`, `copy-tiny`, headings/buttons; **no** forced uppercase on footer decorative + team-card tokens.
- **Docs:** `pnpm sync:figma-tokens:docs` writes `docs/figma-tokens.md` — not run on `dev`/`build`.
- **Variables catalog:** `scripts/data/figma-variables-source.json` includes full Scale + Border Sizes set (MCP export 2026-11-12).

## Sections

| Section | Figma node | Commit | QA | Notes |
|---------|------------|--------|-----|-------|
| Hero | `2006:132` / `934:242` | `cc837ed` + fix-ups | all PASS ±4px @1920 | `/` + `/en`: `pickRandomHeroSlide` (gwagon/hypercar/motorbike JPEGs; F1 off). Figma grid/HUD unchanged; **MagicRings** kept (see interactive layers). **SINCE 2016:** `38px` @1920 lh/height for QA. Nav in `SiteChrome` only. |
| Main Image | `2006:220` / `937:253` | `dfdb62c` + fix-up | all PASS ±4px @1920 | Headlines **316px** h; client HUD **140+140** cols @ x204; mission **280×168** @ y861; BL slot **450×450**; micro **`2006:162`** (78px) / **`2006:287`** (118px); **`LineWaves`** `data-rebuild-layer`. MCP image fills re-exported. |
| CAD / story | `2006:304`+ | — | — | pending |
| Mission | `989:2` | — | — | pending |
| Journey | timeline frames | — | — | pending |
| Experts | `2006:660` | — | — | pending |
| Social | `2006:790` | — | — | pending |
| Footer | `2006:809` | — | — | pending |

## Kept interactive layers

| Layer | Frame / placement | Commit note |
|-------|-------------------|-------------|
| **MagicRings** | Hero — `data-rebuild-layer="MagicRings"`, z-index 1, `pointer-events: none` | Component file from **`e7ee9f5`** (pre-rebuild); props match `style/light-mode-figma-v2` (`followMouse`, `clickBurst`, speed 0.4, opacity 0.5) |
| **Topography** | Story `#story` sticky viewport — `cad-topo-stage` | Always on; elevation colors from `--text-default-accent*` + `--colors-greeeen` |
| **LineWaves (manifest)** | Main Image `2006:220` / `937:253` — `manifest-section__waves`, z-index 0 | Behind Figma grid only; no pointer events |
| **LineWaves (footer)** | Footer (unchanged) | `SiteFooter` — existing lazy canvas |
