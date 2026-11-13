# Figma 1920 rebuild log

Branch: `rebuild/figma-1920`  
File: `U6PdyBS92GPjpwcznGYV7J`  
Light home: `2006:131` · Dark home: `934:241`

## Standing rules (A–F)

- **A** — Icons/vectors/images: Figma MCP export only; golden files under `public/figma-qa/golden/`.
- **B** — Colors/spacing/type from tokens; copy from `scripts/data/figma-qa-content.json`.
- **C** — No duplicate layers vs `data-rebuild-layer` (MagicRings, Topography, …).
- **D** — `pnpm figma:qa --mode all` (geometry, content, colors, icons, overlay).
- **E** — `pnpm figma:visual-pair` before user report.
- **F** — Section done at 0 FAIL both themes, overlay ≤5%, visual sign-off.

Preview QA: `pnpm figma:qa:preview <vercel-preview-url> -- --mode all --section hero`

## QA harness

- `scripts/figma-qa.mjs` orchestrator (`--mode all|geometry|content|colors|icons|overlay`)
- Data: `figma-qa-layout.json`, `figma-qa-content.json`, `figma-qa-colors.json`, `figma-qa-assets.json`
- `pnpm sync:figma-qa-golden` — refresh sha256 manifests

## Sections

| Section | Figma node | Status | Notes |
|---------|------------|--------|-------|
| Hero | `2006:132` / `934:242` | geometry PASS | Title `2006:158` 76px box + lockup offset |
| Main Image | `2006:220` / `937:253` | geometry PASS | No manifest LineWaves |
| Manifest micro | `2006:162`, `2006:287` | geometry PASS | MCP icons; stat row `2006:289` absolute |
| CAD / story | `2006:304`+ | geometry PASS | Viewport anchor; absolute HUD/part/copy |
| Mission | `2006:469` / `989:2` | geometry PASS | Fixed 1219px; `MissionSection.tsx` |
| Journey | `2006:519`+ | pending MCP | `HorizontalTimeline.tsx` |
| Experts | `2006:660` | pending MCP | Grid + `ExpertSlot` |
| Social | `2006:790` | pending MCP | `CircularGallery` layout |
| Footer | `2006:809` | pending MCP | Footer LineWaves tokenized |

## Kept interactive layers

| Layer | Placement |
|-------|-----------|
| **MagicRings** | Hero `data-rebuild-layer` |
| **Topography** | Story `data-rebuild-layer` |
| **LineWaves** | Footer only |
