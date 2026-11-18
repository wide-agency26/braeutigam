import "server-only";
import { headers } from "next/headers";
import { activeHeroSlides, HERO_SLIDE_HEADER, nextHeroSlide } from "./hero-slides";

/** Proxy chooses before rendering: no client-side image swap or hydration flash. */
export async function getRequestHeroSlide() {
  const id = (await headers()).get(HERO_SLIDE_HEADER);
  return activeHeroSlides().find((slide) => slide.id === id) ?? nextHeroSlide().slide;
}
