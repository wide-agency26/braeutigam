"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
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
    <section id="silhouette" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-24 transition-colors duration-500 text-zinc-900 dark:text-zinc-100">

      {/* Full Screen Background Car Images with Cross-Fade Transition */}
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

        {/* Subtle gradient overlays to ensure text remains highly readable */}
        <div className="absolute inset-0 transition-colors duration-1000 bg-radial-gradient from-white/20 via-[#F9F9FB]/30 to-[#F9F9FB]/65 dark:bg-radial-gradient dark:from-zinc-950/20 dark:via-[#0B0B0C]/40 dark:to-[#0B0B0C]/85" />

        {/* Bottom linear gradient fades the hero into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-80 pointer-events-none z-10 transition-colors duration-1000 bg-gradient-to-t from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent dark:bg-gradient-to-t dark:from-[#0B0B0C] dark:via-[#0B0B0C]/60 dark:to-transparent" />
      </div>

      {/* Ambient WebGL Magic Rings overlaying the background image */}
      <div className="magic-rings-stage absolute inset-0 z-10 opacity-30 pointer-events-none">
        <div className="magic-rings-poster" aria-hidden="true" />
        <LazyOnVisible
          loader={loadMagicRings}
          // Start fetching soon after paint; shader still waits on useAfterSettled.
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

      {/* LED Pillars flanking the sides */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-15">
        <div className="w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70" />
        <div className="w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70" />
      </div>

      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-15">
        <div className="w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70" />
        <div className="w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70" />
      </div>

      {/* Corner Telemetry Readouts */}
      <div className="absolute top-28 left-6 hidden md:block font-mono text-[9px] leading-relaxed transition-colors duration-500 text-zinc-650 dark:text-zinc-500">
        <div>LOCATION: GERMANY [48.9298° N, 9.2070° E]</div>
        <div>ESTABLISHED: 2016</div>
        <div>CURRENT TEAM SIZE: 81</div>
      </div>

      <div className="absolute top-28 right-6 hidden md:block font-mono text-[9px] text-right leading-relaxed transition-colors duration-500 text-zinc-650 dark:text-zinc-500">
        <div>COMPOSITE COMPONENT DEVELOPMENT INSIGHT</div>
        <div>PROJECT: AERO_HYPERCAR_v2.2</div>
      </div>

      {/* Center Content Area */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="hero-rise flex flex-col items-center relative gap-2">
          <p className="font-sans font-bold text-[11vw] sm:text-[7vw] tracking-tighter uppercase leading-[0.9] select-none transition-colors duration-500 text-zinc-950 dark:text-zinc-100">
            BRÄUTIGAM
          </p>

          <Title className="font-sans font-light text-[8vw] sm:text-[5.5vw] tracking-tighter uppercase leading-[0.85] select-none transition-colors duration-500 text-zinc-800 dark:text-zinc-200">
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

        <div className="mt-14 font-mono text-[9px] tracking-[0.2em] select-none transition-colors duration-500 text-zinc-600 dark:text-zinc-500">
          PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 z-20 pointer-events-auto text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
        <a href={scrollTarget} className="flex flex-col items-center gap-2 cursor-pointer select-none">
          <span>[ SCROLL TO EXPLORE ]</span>
          <div className="hero-chevron">
            <ChevronDown className="h-4 w-4 text-brand-neon" />
          </div>
        </a>
      </div>
    </section>
  );
}
