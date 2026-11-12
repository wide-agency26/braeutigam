export type HeroSlide = {
  id: string;
  light: string;
  dark: string;
  altDe: string;
  altEn: string;
  enabled: boolean;
};

/**
 * Static slide registry. Flip `enabled` to true when both files are in
 * public/images/hero (see README). JPEG pairs await Drive drop from Ali.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "offroad",
    light: "/images/hero/gwagon_light.jpeg",
    dark: "/images/hero/gwagon_dark.jpeg",
    altDe: "G-Wagon Carbon als Silhouette",
    altEn: "G-Wagon carbon silhouette",
    enabled: false,
  },
  {
    id: "hypercar",
    light: "/images/hero/hypercar_light.jpeg",
    dark: "/images/hero/hypercar_dark.jpeg",
    altDe: "Hypercar-Chassis als Silhouette",
    altEn: "Hypercar chassis silhouette",
    enabled: false,
  },
  {
    id: "superbike",
    light: "/images/hero/motorbike_light.jpeg",
    dark: "/images/hero/motorbike_dark.jpeg",
    altDe: "Motorbike-Carbon als Silhouette",
    altEn: "Motorbike carbon silhouette",
    enabled: false,
  },
  {
    id: "f1",
    light: "/images/hero/f1-light.webp",
    dark: "/images/hero/f1-dark.webp",
    altDe: "Formel-1-Fahrzeug als Silhouette in der Bräutigam-Werkstatt",
    altEn: "Formula car silhouette in the Bräutigam workshop",
    enabled: true,
  },
];

export function activeHeroSlides(): HeroSlide[] {
  return HERO_SLIDES.filter((s) => s.enabled);
}

/** Picks a random enabled slide (server-safe; one slide per request). */
export function pickRandomHeroSlide(): HeroSlide {
  const active = activeHeroSlides();
  if (active.length === 0) {
    return HERO_SLIDES[0]!;
  }
  const index = Math.floor(Math.random() * active.length);
  return active[index]!;
}
