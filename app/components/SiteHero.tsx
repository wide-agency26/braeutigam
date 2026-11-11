"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import NotchedBorderGlow from "./NotchedBorderGlow";
import LazyOnVisible from "./LazyOnVisible";
import { useTheme } from "./ThemeProvider";
import "./MagicRingsPoster.css";
import {
  activeHeroSlides,
  type HeroSlide,
} from "@/lib/hero-slides";
import { readCssVarColor } from "@/lib/css-var-color";

const loadMagicRings = () => import("./MagicRings");

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function serverReducedMotion() {
  return false;
}

interface SiteHeroProps {
  /** Anchor the "scroll to explore" affordance jumps to on this route. */
  scrollTarget?: string;
  /** Only the landing route should fetch the silhouette at high priority. */
  priority?: boolean;
  /** Off when the route already has its own <h1> below the fold. */
  isPageHeading?: boolean;
  /** Light/dark pair for this hero (from server random on Start). */
  slide?: HeroSlide;
  /** Alt text language for the silhouette. */
  locale?: "de" | "en";
}

/**
 * Full-screen cinematic hero: car silhouette, ambient WebGL rings, HUD
 * telemetry and the centre typography block. Shared across routes.
 */
export default function SiteHero({
  scrollTarget = "#story",
  priority = true,
  isPageHeading = true,
  slide,
  locale = "de",
}: SiteHeroProps) {
  const { isDark } = useTheme();
  const Title = isPageHeading ? "h1" : "p";
  const resolved =
    slide ?? activeHeroSlides()[0] ?? {
      id: "f1",
      light: "/images/hero/f1-light.webp",
      dark: "/images/hero/f1-dark.webp",
      altDe: "Formel-1-Fahrzeug als Silhouette",
      altEn: "Formula car silhouette",
      enabled: true,
    };
  const alt = locale === "en" ? resolved.altEn : resolved.altDe;
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    serverReducedMotion,
  );
  const crossfadeClass = reduceMotion
    ? ""
    : "transition-opacity duration-1000";

  return (
    <section
      id="silhouette"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 text-zinc-900 dark:text-zinc-100"
    >
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
        <div
          className={`absolute inset-0 opacity-0 dark:opacity-100 ${crossfadeClass}`}
        >
          <Image
            src={resolved.dark}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={priority}
          />
        </div>

        <div
          className={`absolute inset-0 opacity-100 dark:opacity-0 ${crossfadeClass}`}
        >
          <Image
            src={resolved.light}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={priority}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(249,249,251,0.12)_0%,rgba(249,249,251,0.45)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(11,11,12,0.12)_0%,rgba(11,11,12,0.42)_100%)]" />
        <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none bg-gradient-to-t from-brand-light via-brand-light/50 to-transparent dark:from-brand-dark dark:via-brand-dark/45 dark:to-transparent" />
      </div>

      <div className="magic-rings-stage absolute inset-0 z-10 opacity-30 pointer-events-none">
        <div className="magic-rings-poster" aria-hidden="true" />
        <LazyOnVisible
          loader={loadMagicRings}
          delayMs={400}
          rootMargin="0px"
          className="absolute inset-0"
          componentProps={{
            color: readCssVarColor("--colors-greeeen", "#00ff00"),
            colorTwo: isDark ? "#555555" : "#cbd5e1",
            ringCount: 6,
            speed: 0.4,
            attenuation: 14,
            lineThickness: 1.6,
            baseRadius: 0.28,
            radiusStep: 0.11,
            scaleRate: 0.05,
            opacity: 0.5,
            blur: 0,
            noiseAmount: 0.06,
            rotation: 20,
            ringGap: 1.35,
            fadeIn: 0.8,
            fadeOut: 0.4,
            followMouse: true,
            mouseInfluence: 0.25,
            hoverScale: 1.15,
            parallax: 0.03,
            clickBurst: true,
          }}
        />
      </div>

      <div className="absolute z-20 top-28 left-6 hidden md:block copy-tiny text-zinc-800 dark:text-zinc-200">
        <div>LOCATION: GERMANY [48.9298° N, 9.2070° E]</div>
        <div>ESTABLISHED: 2016</div>
        <div>CURRENT TEAM SIZE: 81</div>
      </div>

      <div className="absolute z-20 top-28 right-6 hidden md:block copy-tiny text-right text-zinc-800 dark:text-zinc-200">
        <div>**COMPOSITE COMPONENT DEVELOPMENT INSIGHT**</div>
        <div>PROJECT: AERO_HYPERCAR_v2.2</div>
      </div>

      <div className="relative z-20 w-full max-w-5xl flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="hero-rise site-hero__stack flex flex-col items-center relative">
          <p className="heading-primary-bold select-none text-zinc-950 dark:text-zinc-100">
            BRÄUTIGAM
          </p>

          <Title className="heading-secondary select-none text-zinc-800 dark:text-zinc-100">
            CARBON FIBER WORKS
          </Title>

          <div className="hero-since pointer-events-auto">
            <NotchedBorderGlow
              notchPosition="slanted"
              active={true}
              noPadding={true}
              className="select-none"
            >
              <div className="px-8 py-2.5">
                <span className="decorative-tertiary text-brand-neon">
                  SINCE 2016
                </span>
              </div>
            </NotchedBorderGlow>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8 copy-tiny text-zinc-700 dark:text-zinc-300">
        <div className="select-none">PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS</div>
        <a
          href={scrollTarget}
          className="pointer-events-auto cursor-pointer select-none hover:text-zinc-950 dark:hover:text-white"
        >
          SCROLL TO EXPLORE
        </a>
      </div>
    </section>
  );
}
