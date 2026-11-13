# Rebuild morning report (fidelity pass)

**Branch:** `rebuild/figma-1920`  
**Latest hash:** _(push pending)_ — geometry QA pass local @127.0.0.1: hero, manifest, manifest-micro-bottom, story, mission (light)

## QA report format

`{hash} | {section} | light: FAIL n, overlay x% | dark: FAIL n, overlay x% | qa-output/...`

Run on preview (GET only):

```bash
pnpm figma:qa:preview https://braeutigam-git-rebuild-figma-1920-wide-agency26s-projects.vercel.app -- --mode geometry --section hero --theme light
```

## Completed this pass

- Extended `figma:qa` (geometry, content, colors, icons, overlay)
- Hero title clipping fix (`2006:158`)
- Manifest MCP icons + stat spacing (`2006:289`)
- Story: Topography-only background, MCP line parts, `CompositeSpecCard`, sentence-case copy
- Mission: `MissionSection` from `2006:469` / `989:2`

## Next (same rules)

Journey, Experts, Social, Footer — full MCP layout + golden overlays per section.
