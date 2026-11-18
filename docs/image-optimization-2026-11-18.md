# Image loading follow-up — 18 November 2026

- Removed the inline homepage script that preloaded both original hero JPEGs. The unchanged hero component already preloads its responsive Next/Image variants, so the original files were redundant. Each selected pair totals 3,472,881–3,542,715 bytes (about 3.5 MB). This is the size of the avoided original requests on an uncached visit, not a Core Web Vitals measurement.
- Corrected Team portrait `sizes` to match the card's actual maximum image width (363px), including narrow phone padding. The previous 90vw hint requested oversized images on tablets.
- Contact hero requests 100vw on phones, matching its mobile CSS, while retaining the 120vw desktop crop.
- Retained AVIF/WebP negotiation, lazy loading, source photographs, hero layout, typography and animations. Small social posters already total only 129 KB and were not recompressed.

Production build and scoped lint passed. Browser inspection confirmed both optimized hero images loaded and no original hero-image preload remained.
