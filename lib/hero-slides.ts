export type HeroSlide = {
  id: string;
  light: string;
  dark: string;
  altDe: string;
  altEn: string;
  enabled: boolean;
};

/** Static slide registry — flip `enabled` when both webp files are in the repo. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "f1",
    light: "/images/hero/f1-light.webp",
    dark: "/images/hero/f1-dark.webp",
    altDe: "Formel-1-Fahrzeug als Silhouette in der Bräutigam-Werkstatt",
    altEn: "Formula car silhouette in the Bräutigam workshop",
    enabled: true,
  },
  {
    id: "superbike",
    light: "/images/hero/superbike-light.webp",
    dark: "/images/hero/superbike-dark.webp",
    altDe: "Superbike-Carbon als Silhouette",
    altEn: "Superbike carbon silhouette",
    enabled: false,
  },
  {
    id: "hypercar",
    light: "/images/hero/hypercar-light.webp",
    dark: "/images/hero/hypercar-dark.webp",
    altDe: "Hypercar-Chassis als Silhouette",
    altEn: "Hypercar chassis silhouette",
    enabled: false,
  },
  {
    id: "offroad",
    light: "/images/hero/offroad-light.webp",
    dark: "/images/hero/offroad-dark.webp",
    altDe: "Offroad-Fahrzeug als Silhouette",
    altEn: "Off-road vehicle silhouette",
    enabled: false,
  },
];

export function activeHeroSlides(): HeroSlide[] {
  return HERO_SLIDES.filter((s) => s.enabled);
}

/** Picks a random enabled slide (server-safe; one slide per request). */
export function pickRandomHeroSlide(): HeroSlide {
  const active = activeHeroSlides();
  if (active.length === 0) {
    return HERO_SLIDES[0];
  }
  const index = Math.floor(Math.random() * active.length);
  return active[index]!;
}
