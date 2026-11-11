# Color exceptions (hardcoded allowlist)

The lint script `scripts/check-hardcoded-colors.mjs` skips paths listed here.

## Allowed files (full)

- `app/components/CadTopographyPoster.css` — CAD canvas simulation palette
- `app/components/LineWaves.tsx` — WebGL shader defaults (runtime props use tokens from footer)
- `app/components/ContactPage.css` — contact hero photo gradient and validation colors
- `app/components/CareerPage.css` — display watermarks and film chrome
- `app/components/ExpertCard.css` — card shader gradients and portrait chrome
- `app/components/SiteHero.tsx` — hero rotation / neon ring (hero frame skipped in design pass)
- `app/components/MagicRings.tsx` — hero canvas (skipped with 2006:132)
- `app/components/MagicRingsPoster.css` — hero canvas (skipped with 2006:132)
- `app/components/HomePage.tsx` — CAD topography props (story section)
- `app/components/ManifestSection.css` — manifest photo masks
- `app/components/SpecularButton.css` — WebGL button chrome
- `app/components/SpecularButton.jsx` — WebGL defaults
- `app/components/SpotlightCard.css` — card spotlight mask
- `app/components/StaggeredMenu.tsx` — menu panel (chrome)
- `app/components/Topography.tsx` — topography demo defaults
- `app/components/TrackScrollMap.tsx` — scroll map fill filter
- `app/components/NotchedBorderGlow.css` — dark production glow fallbacks
- `app/components/CircularGallery.css` — WebGL gallery chrome
- `app/components/CircularGallery.jsx` — canvas text probe defaults
- `app/components/ContactPage.tsx` — inline map pin SVG markup
- `app/globals.css` — legacy section rules being migrated incrementally
- `app/cms/admin/**` — admin UI not in Figma scope

## Documented literal colors

| Location | Reason |
|----------|--------|
| Contact form errors `#ff5a5a` | validation state (not in Figma variables) |
| Contact form warning `#cc9900` | validation state |

Regenerate token CSS: `pnpm sync:figma-tokens`
