"use client";

import React from "react";
import Image from "next/image";
import NotchedBorderGlow from "./NotchedBorderGlow";
import LazyOnVisible from "./LazyOnVisible";
import { useTheme } from "./ThemeProvider";
import "./MagicRingsPoster.css";
import carDark from "../../public/images/car_silhouette_02_DarkMode.webp";
import carLight from "../../public/images/car_silhouette_02_LightMode.webp";

const loadMagicRings = () => import("./MagicRings");

interface SiteHeroProps {
  /** Anchor the "scroll to explore" affordance jumps to on this route. */
  scrollTarget?: string;
  /** Only the landing route should fetch the silhouette at high priority. */
  priority?: boolean;
  /** Off when the route already has its own <h1> below the fold. */
  isPageHeading?: boolean;
}

/**
 * Full-screen cinematic hero: car silhouette, ambient WebGL rings, HUD
 * telemetry and the centre typography block. Shared across routes.
 */
export default function SiteHero({
  scrollTarget = "#story",
  priority = true,
  isPageHeading = true,
}: SiteHeroProps) {
  const { isDark } = useTheme();
  const Title = isPageHeading ? "h1" : "p";

  return (
    <section
      id="silhouette"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 text-zinc-900 dark:text-zinc-100"
    >
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-0 dark:opacity-100">
          <Image
            src={carDark}
            alt="Carbon Fiber Supercar Silhouette Dark"
            fill
            className="object-cover"
            sizes="100vw"
            priority={priority}
          />
        </div>

        <div className="absolute inset-0 transition-opacity duration-1000 opacity-100 dark:opacity-0">
          <Image
            src={carLight}
            alt="Carbon Fiber Supercar Silhouette Light"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(249,249,251,0.12)_0%,rgba(249,249,251,0.45)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(11,11,12,0.12)_0%,rgba(11,11,12,0.42)_100%)]" />
        <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none bg-gradient-to-t from-[#F9F9FB] via-[#F9F9FB]/50 to-transparent dark:from-[#0B0B0C] dark:via-[#0B0B0C]/45 dark:to-transparent" />
      </div>

      <div className="magic-rings-stage absolute inset-0 z-10 opacity-30 pointer-events-none">
        <div className="magic-rings-poster" aria-hidden="true" />
        <LazyOnVisible
          loader={loadMagicRings}
          delayMs={400}
          rootMargin="0px"
          className="absolute inset-0"
          componentProps={{
            color: "#39FF14",
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

      <div className="absolute z-20 top-28 left-6 hidden md:block font-mono text-[9px] font-light leading-[1.35] tracking-[0.04em] uppercase text-zinc-800 dark:text-zinc-200">
        <div>LOCATION: GERMANY [48.9298° N, 9.2878° E]</div>
        <div>ESTABLISHED: 2016</div>
        <div>CURRENT TEAM SIZE: 81</div>
      </div>

      <div className="absolute z-20 top-28 right-6 hidden md:block font-mono text-[9px] font-light text-right leading-[1.35] tracking-[0.04em] uppercase text-zinc-800 dark:text-zinc-200">
        <div>**COMPOSITE COMPONENT DEVELOPMENT INSIGHT**</div>
        <div>PROJECT: AERO_HYPERCAR_V2.2</div>
      </div>

      <div className="relative z-20 w-full max-w-5xl flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="hero-rise flex flex-col items-center relative gap-1">
          <p className="font-sans font-bold text-[11vw] sm:text-[7vw] tracking-tighter uppercase leading-[0.9] select-none text-zinc-950 dark:text-zinc-100">
            BRÄUTIGAM
          </p>

          <Title className="font-sans font-light text-[8vw] sm:text-[5.5vw] tracking-tighter uppercase leading-[0.85] select-none text-zinc-800 dark:text-zinc-100">
            CARBON FIBER WORKS
          </Title>

          <div className="hero-since mt-4 pointer-events-auto">
            <NotchedBorderGlow
              notchPosition="slanted"
              active={true}
              noPadding={true}
              className="select-none"
            >
              <div className="px-8 py-2.5">
                <span className="font-accent text-brand-neon text-2xl sm:text-3xl md:text-4xl tracking-wide uppercase">
                  SINCE 2016
                </span>
              </div>
            </NotchedBorderGlow>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8 font-mono text-[9px] tracking-[0.2em] uppercase text-zinc-700 dark:text-zinc-300">
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
