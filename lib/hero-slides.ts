export type HeroSlide = {
  id: string;
  light: string;
  dark: string;
  altDe: string;
  altEn: string;
  enabled: boolean;
};

/**
 * Static slide registry. Flip `enabled` when both files are in
 * public/images/hero (see README). JPEG pairs from Thomas / Drive.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "offroad",
    light: "/images/hero/gwagon_light.jpeg",
    dark: "/images/hero/gwagon_dark.jpeg",
    altDe: "G-Wagon Carbon als Silhouette",
    altEn: "G-Wagon carbon silhouette",
    enabled: true,
  },
  {
    id: "hypercar",
    light: "/images/hero/hypercar_light.jpeg",
    dark: "/images/hero/hypercar_dark.jpeg",
    altDe: "Hypercar-Chassis als Silhouette",
    altEn: "Hypercar chassis silhouette",
    enabled: true,
  },
  {
    id: "superbike",
    light: "/images/hero/motorbike_light.jpeg",
    dark: "/images/hero/motorbike_dark.jpeg",
    altDe: "Motorbike-Carbon als Silhouette",
    altEn: "Motorbike carbon silhouette",
    enabled: true,
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

export const HERO_HISTORY_COOKIE = "braeutigam-hero-history";
export const HERO_SLIDE_HEADER = "x-braeutigam-hero-slide";

/** Keep the last N-1 photos out of the draw, including across DE/EN routes. */
export function nextHeroSlide(history = "", active = activeHeroSlides(), random = Math.random) {
  const slides = active.length ? active : [HERO_SLIDES[0]!];
  const recent = [...new Set(history.split(".").filter((id) => slides.some((s) => s.id === id)))];
  const excluded = slides.length > 1 ? recent.slice(-(slides.length - 1)) : [];
  const candidates = slides.filter((s) => !excluded.includes(s.id));
  const slide = candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))]!;
  return { slide, history: [...excluded, slide.id].slice(-slides.length).join(".") };
}
