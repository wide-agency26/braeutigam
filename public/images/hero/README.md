# Hero slide images

Drop paired light/dark files here. File names must match `lib/hero-slides.ts`.

| Slide id   | Files (JPEG from Drive) |
|------------|-------------------------|
| `offroad`  | `gwagon_light.jpeg`, `gwagon_dark.jpeg` |
| `hypercar` | `hypercar_light.jpeg`, `hypercar_dark.jpeg` |
| `superbike`| `motorbike_light.jpeg`, `motorbike_dark.jpeg` |
| `f1`       | `f1-light.webp`, `f1-dark.webp` (legacy; disable when JPEG set is complete) |

Set `enabled: true` on each slide in `lib/hero-slides.ts` after both files exist. Until the six Drive JPEGs are present, only `f1` remains active.
