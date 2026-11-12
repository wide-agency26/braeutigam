"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import LazyOnVisible from "./LazyOnVisible";
import { useTheme } from "./ThemeProvider";
import "./SiteHero.css";
import "./MagicRingsPoster.css";
import { activeHeroSlides, type HeroSlide } from "@/lib/hero-slides";
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
  scrollTarget?: string;
  priority?: boolean;
  isPageHeading?: boolean;
  slide?: HeroSlide;
  locale?: "de" | "en";
}

export default function SiteHero({
  scrollTarget = "#story",
  priority = true,
  isPageHeading = true,
  slide,
  locale = "de",
}: SiteHeroProps) {
  const { isDark } = useTheme();
  const Title = isPageHeading ? "h1" : "p";
  useSyncExternalStore(subscribeReducedMotion, getReducedMotion, serverReducedMotion);

  const resolved =
    slide ??
    activeHeroSlides()[0] ?? {
      id: "fallback",
      light: "/images/hero/gwagon_light.jpeg",
      dark: "/images/hero/gwagon_dark.jpeg",
      altDe: "Fahrzeug als Silhouette in der Werkstatt",
      altEn: "Vehicle silhouette in the workshop",
      enabled: true,
    };

  const photoSrc = isDark ? resolved.dark : resolved.light;
  const photoAlt = locale === "en" ? resolved.altEn : resolved.altDe;

  const ringColors = useMemo(
    () => ({
      color: readCssVarColor("--colors-greeeen"),
      colorTwo: readCssVarColor(
        isDark ? "--icon-default-placeholder" : "--text-default-placeholder",
      ),
    }),
    [isDark],
  );

  const heroNode = isDark ? "934:242" : "2006:132";

  return (
    <section
      id="silhouette"
      className="hero-figma"
      data-figma-node={heroNode}
      data-figma-node-light="2006:132"
      data-figma-node-dark="934:242"
      aria-label="Hero"
    >
      <div
        className="hero-figma__bg"
        data-figma-node="2006:132-bg"
        data-figma-node-dark="934:242-bg"
        aria-hidden
      >
        <div
          className="hero-figma__photo"
          data-figma-node="2006:132-photo"
          data-figma-node-dark="934:242-photo"
        >
          <div className="hero-figma__photo-layer">
            <Image
              key={photoSrc}
              src={photoSrc}
              alt={photoAlt}
              fill
              className="hero-figma__photo-img"
              sizes="(max-width: 1920px) 120vw, 2304px"
              priority={priority}
            />
          </div>
        </div>
        <div className="hero-figma__scrim" />
      </div>

      <div
        className="hero-figma__rings magic-rings-stage hero-figma__rings--on"
        data-rebuild-layer="MagicRings"
        aria-hidden
      >
        <div className="magic-rings-poster" />
        <LazyOnVisible
          loader={loadMagicRings}
          delayMs={400}
          rootMargin="0px"
          className="absolute inset-0"
          componentProps={{
            color: ringColors.color,
            colorTwo: ringColors.colorTwo,
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

      <div className="hero-figma__grid">
        <div
          className="hero-figma__location"
          data-figma-node="2006:133"
          data-figma-node-dark="940:24"
        >
          <div className="copy-caption hero-figma__caption-block">
            <p>LOCATION: GERMANY [48.9298° N, 9.2070° E]</p>
            <p>ESTABLISHED: 2016</p>
            <p>CURRENT TEAM SIZE: 81</p>
          </div>
        </div>

        <div
          className="hero-figma__dev"
          data-figma-node="2006:135"
          data-figma-node-dark="940:26"
        >
          <div className="copy-caption hero-figma__caption-block">
            <p>**COMPOSITE COMPONENT DEVELOPMENT INSIGHT**</p>
            <p>PROJECT: AERO_HYPERCAR_v2.2</p>
          </div>
        </div>

        <div className="hero-figma__main" data-figma-node="2006:143" data-figma-node-dark="937:247">
          <div
            className="hero-figma__lockup"
            data-figma-node="2006:144"
            data-figma-node-dark="1373:11"
          >
            <div
              className="hero-figma__logo"
              data-figma-node="2006:145"
              data-figma-node-dark="1256:232"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/figma/client-wordmark.svg"
                alt=""
                width={343}
                height={72}
                draggable={false}
              />
              <span className="sr-only">Bräutigam</span>
            </div>
            <Title
              className="hero-figma__title heading-secondary heading-figma-overlay"
              data-figma-node="2006:158"
              data-figma-node-dark="937:249"
            >
              CARBON FIBER WORKS
            </Title>
          </div>
          <p
            className="hero-figma__since decorative-tertiary"
            data-figma-node="2006:161"
            data-figma-node-dark="937:252"
          >
            SINCE 2016
          </p>
        </div>

        <div
          className="hero-figma__status"
          data-figma-node="2006:137"
          data-figma-node-dark="938:267"
        >
          <p
            className="hero-figma__status-caption copy-caption"
            data-figma-node="2006:138"
            data-figma-node-dark="940:40"
          >
            PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS
          </p>
          <a
            href={scrollTarget}
            className="hero-figma__scroll copy-body-sm"
            data-figma-node="2006:139"
            data-figma-node-dark="938:269"
          >
            SCROLL TO EXPLORE
          </a>
        </div>
      </div>
    </section>
  );
}

