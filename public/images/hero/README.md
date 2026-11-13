# Hero slide images

Paired light/dark files must match `lib/hero-slides.ts`. No runtime filesystem checks.

| Slide id   | Files (shipped) |
|------------|-----------------|
| `offroad`  | `gwagon_light.jpeg`, `gwagon_dark.jpeg` |
| `hypercar` | `hypercar_light.jpeg`, `hypercar_dark.jpeg` |
| `superbike`| `motorbike_light.jpeg`, `motorbike_dark.jpeg` |
| `f1`       | `f1-light.webp`, `f1-dark.webp` (**disabled** in registry) |

Home `/` and `/en` pick a random **enabled** slide per request (`force-dynamic`). Set `enabled: true` only when both files exist.
