# Color exceptions (per-line allowlist)

Only these lines may use raw hex/rgb. All other `app/**` colors must use Figma CSS variables (`app/figma-tokens.css`).

`app/cms/**` is out of scope for this lint.

Format: `` `app/path/file.ext:line` — reason ``

## CAD canvas

- `app/components/CadTopographyPoster.css:16` — CAD WebGL background
- `app/components/CadTopographyPoster.css:22` — CAD grid stroke
- `app/components/CadTopographyPoster.css:29` — CAD grid stroke
- `app/components/CadTopographyPoster.css:32` — CAD vignette gradient

## Contact — photo gradients & validation (no Figma tokens)

- `app/components/ContactPage.css:25` — hero photo fade gradient
- `app/components/ContactPage.css:231` — form validation error border
- `app/components/ContactPage.css:237` — form validation error text
- `app/components/ContactPage.css:258` — form validation warning text
- `app/components/ContactPage.css:406` — map/photo overlay gradient
- `app/components/ContactPage.css:498` — photo section overlay
- `app/components/ContactPage.css:536` — pin card drop shadow

## WebGL / canvas defaults (runtime reads tokens where wired)

- `app/components/CircularGallery.jsx:231` — canvas default text color
- `app/components/CircularGallery.jsx:394` — canvas measure probe
- `app/components/LineWaves.tsx:162` — shader default color1
- `app/components/LineWaves.tsx:163` — shader default color2
- `app/components/LineWaves.tsx:164` — shader default color3
- `app/components/MagicRings.tsx:9` — WebGL default ring color
- `app/components/MagicRings.tsx:105` — WebGL gradient stop
- `app/components/MagicRings.tsx:106` — WebGL gradient stop
- `app/components/MagicRings.tsx:311` — WebGL uniform default
- `app/components/MagicRings.tsx:313` — WebGL uniform default
- `app/components/MagicRingsPoster.css:8` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:9` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:10` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:11` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:12` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:13` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:20` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:21` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:22` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:23` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:24` — hero poster gradient fallback
- `app/components/MagicRingsPoster.css:25` — hero poster gradient fallback
- `app/components/SiteHero.tsx:108` — hero scrim gradient (image legibility)
- `app/components/SiteHero.tsx:121` — MagicRings colorTwo default
- `app/components/SpecularButton.css:3` — WebGL button default tint
- `app/components/SpecularButton.css:6` — WebGL button default text
- `app/components/SpecularButton.css:19` — WebGL button shadow
- `app/components/SpecularButton.css:95` — WebGL button shadow (sm)
- `app/components/SpecularButton.jsx:228` — WebGL default props
- `app/components/SpecularButton.jsx:231` — WebGL default props
- `app/components/SpecularButton.jsx:232` — WebGL default props
- `app/components/SpecularButton.jsx:233` — WebGL default props
- `app/components/SpecularButton.jsx:366` — canvas text probe
- `app/components/SpecularButton.jsx:420` — canvas gradient
- `app/components/Topography.tsx:190` — topography shader default low
- `app/components/Topography.tsx:191` — topography shader default mid
- `app/components/Topography.tsx:192` — topography shader default high
- `app/components/Topography.tsx:431` — topography uniform fallback
- `app/components/Topography.tsx:433` — topography uniform fallback
- `app/components/ExpertCard.css:301` — portrait foil gradient (decorative)
- `app/components/ExpertCard.css:302` — portrait foil gradient
- `app/components/ExpertCard.css:303` — portrait foil gradient
- `app/components/ExpertCard.css:304` — portrait foil gradient
- `app/components/ExpertCard.css:305` — portrait foil gradient
- `app/components/ExpertCard.css:306` — portrait foil gradient
- `app/components/ExpertCard.css:310` — portrait foil gradient
- `app/components/ExpertCard.css:311` — portrait foil gradient
- `app/components/ExpertCard.css:312` — portrait foil gradient
- `app/components/ExpertCard.css:328` — portrait foil gradient
- `app/components/ExpertCard.css:329` — portrait foil gradient
- `app/components/ExpertCard.css:330` — portrait foil gradient
- `app/components/ExpertCard.css:343` — portrait foil gradient
- `app/components/ExpertCard.css:344` — portrait foil gradient
- `app/components/ExpertCard.css:345` — portrait foil gradient
- `app/components/ExpertCard.css:346` — portrait foil gradient
- `app/components/ExpertCard.css:347` — portrait foil gradient
- `app/components/ExpertCard.css:348` — portrait foil gradient
- `app/components/ExpertCard.css:352` — portrait foil gradient
- `app/components/ExpertCard.css:353` — portrait foil gradient
- `app/components/ExpertCard.css:354` — portrait foil gradient
- `app/components/ExpertCard.css:362` — portrait foil gradient
- `app/components/ExpertCard.css:363` — portrait foil gradient
- `app/components/ExpertCard.css:364` — portrait foil gradient
- `app/components/ManifestSection.css:239` — manifest photo mask
- `app/components/ManifestSection.css:248` — manifest photo mask
- `app/components/ManifestSection.css:249` — manifest photo mask
- `app/components/ManifestSection.css:253` — manifest photo mask
- `app/components/NotchedBorderGlow.css:10` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:11` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:12` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:13` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:15` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:16` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:17` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:18` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:19` — notch glow light defaults
- `app/components/NotchedBorderGlow.css:38` — notch glow dark gradient stops
- `app/components/NotchedBorderGlow.css:39` — notch glow dark gradient stops
- `app/components/NotchedBorderGlow.css:40` — notch glow dark gradient stops
- `app/components/NotchedBorderGlow.css:44` — notch glow frosted
- `app/components/NotchedBorderGlow.css:96` — static border default
- `app/components/NotchedBorderGlow.css:99` — sweep mask default
- `app/components/NotchedBorderGlow.css:100` — card body elevation shadow
- `app/components/NotchedBorderGlow.css:101` — card body elevation shadow
- `app/components/NotchedBorderGlow.css:102` — card body elevation shadow
