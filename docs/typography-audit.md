# Typography audit

Base: http://127.0.0.1:3000
Generated: 2026-11-11T17:53:29.799Z

Scale: at viewport W, expected px = spec × (W / 1440). No cap above 1440.

Note: expert card EMAIL/PHONE (`button-body-caption`) are lazy-hydrated; verify those on a warmed preview. Home probes `button-body-lg` on `#mission`.

| Route | VP | Theme | Token | font-size | expected | lh | expected lh | match |
|-------|-----|-------|-------|-----------|----------|-----|-------------|-------|
| / | 390 | dark | heading-primary-bold | 40px | 27.08px | 40px | 27.08px | no |
| / | 390 | dark | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| / | 390 | dark | decorative-tertiary | 16.8px | 11.38px | 19.2px | 13.00px | no |
| / | 390 | dark | copy-tiny | 10px | 2.71px | 10px | 2.71px | no |
| / | 390 | dark | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| / | 390 | dark | button-body-lg | 14px | 6.50px | 14px | 6.50px | no |
| / | 390 | dark | copy-body | 14px | 5.42px | 14px | 6.50px | no |
| / | 390 | dark | footer-headline-primary | 28.8px | 19.50px | 27.2px | 18.42px | no |
| / | 390 | light | heading-primary-bold | 40px | 27.08px | 40px | 27.08px | no |
| / | 390 | light | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| / | 390 | light | decorative-tertiary | 16.8px | 11.38px | 19.2px | 13.00px | no |
| / | 390 | light | copy-tiny | 10px | 2.71px | 10px | 2.71px | no |
| / | 390 | light | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| / | 390 | light | button-body-lg | 14px | 6.50px | 14px | 6.50px | no |
| / | 390 | light | copy-body | 14px | 5.42px | 14px | 6.50px | no |
| / | 390 | light | footer-headline-primary | 28.8px | 19.50px | 27.2px | 18.42px | no |
| / | 1440 | dark | heading-primary-bold | 100px | 100.00px | 100px | 100.00px | yes |
| / | 1440 | dark | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| / | 1440 | dark | decorative-tertiary | 42px | 42.00px | 48px | 48.00px | yes |
| / | 1440 | dark | copy-tiny | 10px | 10.00px | 10px | 10.00px | yes |
| / | 1440 | dark | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| / | 1440 | dark | button-body-lg | 24px | 24.00px | 24px | 24.00px | yes |
| / | 1440 | dark | copy-body | 20px | 20.00px | 24px | 24.00px | yes |
| / | 1440 | dark | footer-headline-primary | 72px | 72.00px | 68px | 68.00px | yes |
| / | 1440 | light | heading-primary-bold | 100px | 100.00px | 100px | 100.00px | yes |
| / | 1440 | light | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| / | 1440 | light | decorative-tertiary | 42px | 42.00px | 48px | 48.00px | yes |
| / | 1440 | light | copy-tiny | 10px | 10.00px | 10px | 10.00px | yes |
| / | 1440 | light | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| / | 1440 | light | button-body-lg | 24px | 24.00px | 24px | 24.00px | yes |
| / | 1440 | light | copy-body | 20px | 20.00px | 24px | 24.00px | yes |
| / | 1440 | light | footer-headline-primary | 72px | 72.00px | 68px | 68.00px | yes |
| / | 1920 | dark | heading-primary-bold | 133.333px | 133.33px | 133.333px | 133.33px | yes |
| / | 1920 | dark | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| / | 1920 | dark | decorative-tertiary | 56px | 56.00px | 64px | 64.00px | yes |
| / | 1920 | dark | copy-tiny | 13.3333px | 13.33px | 13.3333px | 13.33px | yes |
| / | 1920 | dark | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| / | 1920 | dark | button-body-lg | 32px | 32.00px | 32px | 32.00px | yes |
| / | 1920 | dark | copy-body | 26.6667px | 26.67px | 32px | 32.00px | yes |
| / | 1920 | dark | footer-headline-primary | 96px | 96.00px | 90.6667px | 90.67px | yes |
| / | 1920 | light | heading-primary-bold | 133.333px | 133.33px | 133.333px | 133.33px | yes |
| / | 1920 | light | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| / | 1920 | light | decorative-tertiary | 56px | 56.00px | 64px | 64.00px | yes |
| / | 1920 | light | copy-tiny | 13.3333px | 13.33px | 13.3333px | 13.33px | yes |
| / | 1920 | light | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| / | 1920 | light | button-body-lg | 32px | 32.00px | 32px | 32.00px | yes |
| / | 1920 | light | copy-body | 26.6667px | 26.67px | 32px | 32.00px | yes |
| / | 1920 | light | footer-headline-primary | 96px | 96.00px | 90.6667px | 90.67px | yes |
| /en | 390 | dark | heading-primary-bold | 40px | 27.08px | 40px | 27.08px | no |
| /en | 390 | dark | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| /en | 390 | dark | button-body-lg | 14px | 6.50px | 14px | 6.50px | no |
| /en | 390 | light | heading-primary-bold | 40px | 27.08px | 40px | 27.08px | no |
| /en | 390 | light | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| /en | 390 | light | button-body-lg | 14px | 6.50px | 14px | 6.50px | no |
| /en | 1440 | dark | heading-primary-bold | 100px | 100.00px | 100px | 100.00px | yes |
| /en | 1440 | dark | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| /en | 1440 | dark | button-body-lg | 24px | 24.00px | 24px | 24.00px | yes |
| /en | 1440 | light | heading-primary-bold | 100px | 100.00px | 100px | 100.00px | yes |
| /en | 1440 | light | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| /en | 1440 | light | button-body-lg | 24px | 24.00px | 24px | 24.00px | yes |
| /en | 1920 | dark | heading-primary-bold | 133.333px | 133.33px | 133.333px | 133.33px | yes |
| /en | 1920 | dark | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| /en | 1920 | dark | button-body-lg | 32px | 32.00px | 32px | 32.00px | yes |
| /en | 1920 | light | heading-primary-bold | 133.333px | 133.33px | 133.333px | 133.33px | yes |
| /en | 1920 | light | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| /en | 1920 | light | button-body-lg | 32px | 32.00px | 32px | 32.00px | yes |
| /kontakt | 390 | dark | heading-primary-bold | 40px | 27.08px | 40px | 27.08px | no |
| /kontakt | 390 | light | heading-primary-bold | 40px | 27.08px | 40px | 27.08px | no |
| /kontakt | 1440 | dark | heading-primary-bold | 100px | 100.00px | 100px | 100.00px | yes |
| /kontakt | 1440 | light | heading-primary-bold | 100px | 100.00px | 100px | 100.00px | yes |
| /kontakt | 1920 | dark | heading-primary-bold | 133.333px | 133.33px | 133.333px | 133.33px | yes |
| /kontakt | 1920 | light | heading-primary-bold | 133.333px | 133.33px | 133.333px | 133.33px | yes |
| /karriere | 390 | dark | heading-secondary-bold | 30.4px | 20.58px | 30.4px | 20.58px | no |
| /karriere | 390 | dark | copy-tiny | 10px | 2.71px | 10px | 2.71px | no |
| /karriere | 390 | light | heading-secondary-bold | 30.4px | 20.58px | 30.4px | 20.58px | no |
| /karriere | 390 | light | copy-tiny | 10px | 2.71px | 10px | 2.71px | no |
| /karriere | 1440 | dark | heading-secondary-bold | 76px | 76.00px | 76px | 76.00px | yes |
| /karriere | 1440 | dark | copy-tiny | 10px | 10.00px | 10px | 10.00px | yes |
| /karriere | 1440 | light | heading-secondary-bold | 76px | 76.00px | 76px | 76.00px | yes |
| /karriere | 1440 | light | copy-tiny | 10px | 10.00px | 10px | 10.00px | yes |
| /karriere | 1920 | dark | heading-secondary-bold | 101.333px | 101.33px | 101.333px | 101.33px | yes |
| /karriere | 1920 | dark | copy-tiny | 13.3333px | 13.33px | 13.3333px | 13.33px | yes |
| /karriere | 1920 | light | heading-secondary-bold | 101.333px | 101.33px | 101.333px | 101.33px | yes |
| /karriere | 1920 | light | copy-tiny | 13.3333px | 13.33px | 13.3333px | 13.33px | yes |
| /en/karriere | 390 | dark | copy-tiny | 10px | 2.71px | 10px | 2.71px | no |
| /en/karriere | 390 | light | copy-tiny | 10px | 2.71px | 10px | 2.71px | no |
| /en/karriere | 1440 | dark | copy-tiny | 10px | 10.00px | 10px | 10.00px | yes |
| /en/karriere | 1440 | light | copy-tiny | 10px | 10.00px | 10px | 10.00px | yes |
| /en/karriere | 1920 | dark | copy-tiny | 13.3333px | 13.33px | 13.3333px | 13.33px | yes |
| /en/karriere | 1920 | light | copy-tiny | 13.3333px | 13.33px | 13.3333px | 13.33px | yes |
| /en/team | 390 | dark | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| /en/team | 390 | light | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| /en/team | 1440 | dark | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| /en/team | 1440 | light | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| /en/team | 1920 | dark | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| /en/team | 1920 | light | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| /team | 390 | dark | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| /team | 390 | light | heading-secondary | 30.4px | 20.58px | 20.8px | 14.08px | no |
| /team | 1440 | dark | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| /team | 1440 | light | heading-secondary | 76px | 76.00px | 52px | 52.00px | yes |
| /team | 1920 | dark | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| /team | 1920 | light | heading-secondary | 101.333px | 101.33px | 69.3333px | 69.33px | yes |
| /impressum | 390 | dark | heading-tertiary | 22.8px | 15.44px | 22.8px | 15.44px | no |
| /impressum | 390 | light | heading-tertiary | 22.8px | 15.44px | 22.8px | 15.44px | no |
| /impressum | 1440 | dark | heading-tertiary | 57px | 57.00px | 57px | 57.00px | yes |
| /impressum | 1440 | light | heading-tertiary | 57px | 57.00px | 57px | 57.00px | yes |
| /impressum | 1920 | dark | heading-tertiary | 76px | 76.00px | 76px | 76.00px | yes |
| /impressum | 1920 | light | heading-tertiary | 76px | 76.00px | 76px | 76.00px | yes |

## Unmapped / remnants

See `docs/typography-remnants.md` for fixed-px rules outside tokens (careers watermarks, expert initial `42cqi`, journey watermark vw, F1 headline 77.9px, WebGL labels, etc.).
HUD chrome now uses `copy-tiny`; mission mobile no longer overrides token sizes.
