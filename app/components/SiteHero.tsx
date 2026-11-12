"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
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

        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent from-[63.194%] to-[var(--neutral-black)]"
          aria-hidden
        />
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
            colorTwo: readCssVarColor(
              isDark ? "--icon-default-placeholder" : "--text-default-placeholder",
              isDark ? "var(--icon-default-placeholder)" : "var(--text-default-placeholder)",
            ),
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

      <div className="absolute z-20 top-28 left-6 hidden md:block copy-caption site-hero__hud">
        <div>LOCATION: GERMANY [48.9298° N, 9.2070° E]</div>
        <div>ESTABLISHED: 2016</div>
        <div>CURRENT TEAM SIZE: 81</div>
      </div>

      <div className="absolute z-20 top-28 right-6 hidden md:block copy-caption site-hero__hud site-hero__hud--right">
        <div>**COMPOSITE COMPONENT DEVELOPMENT INSIGHT**</div>
        <div>PROJECT: AERO_HYPERCAR_v2.2</div>
      </div>

      <div className="relative z-20 w-full max-w-5xl flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="hero-rise site-hero__stack flex flex-col items-center relative">
          {/* Figma Client Logo — nodes 2006:145 / 1256:232 */}
          <span className="sr-only">Bräutigam</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/figma/client-wordmark.svg"
            alt=""
            width={343}
            height={72}
            className="site-hero__wordmark select-none"
            draggable={false}
            aria-hidden
          />

          <Title className="heading-secondary heading-figma-overlay select-none">
            CARBON FIBER WORKS
          </Title>

          <p className="decorative-tertiary site-hero__since select-none pointer-events-auto">
            SINCE 2016
          </p>
        </div>
      </div>

      <div className="site-hero__status-wrap absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-lg px-6">
        <p className="copy-caption site-hero__status select-none text-center">
          PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS
        </p>
        <a
          href={scrollTarget}
          className="copy-body-sm site-hero__scroll pointer-events-auto cursor-pointer select-none text-center"
        >
          SCROLL TO EXPLORE
        </a>
      </div>
    </section>
  );
}
