"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, useScroll, useTransform, useSpring } from "framer-motion";
import LazyOnVisible from "./LazyOnVisible";
import StoryCadSection from "./StoryCadSection";
import MissionSection from "./MissionSection";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteHero from "./SiteHero";
import FigmaArtboardGap from "./FigmaArtboardGap";
import ManifestBlock from "./ManifestBlock";
import { ManifestMicrographicBottom, ManifestMicrographicTop } from "./ManifestMicrographic";
import SiteButton from "./SiteButton";
import SocialGalleryBoundary from "./SocialGalleryBoundary";
import ExpertSlot from "./ExpertSlot";
import { EXPERTS } from "@/lib/data/experts";
import type { HeroSlide } from "@/lib/hero-slides";
import type { Locale } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n";
import { readCssVarColor } from "@/lib/css-var-color";
import { useTheme } from "./ThemeProvider";

/* Heavier below-fold widgets load only when LazyOnVisible says they are near
   the viewport. */
const loadTimeline = () => import("./HorizontalTimeline");
const loadCircularGallery = () => import("./CircularGallery");

const SOCIAL_GALLERY_ITEMS = [
  {
    image: "/images/social/reels/DMFYazaOIoF.jpg",
    alt: "Formel 1 Öltanks reel",
    href: "https://www.instagram.com/braeutigamgmbh/reel/DMFYazaOIoF/",
  },
  {
    image: "/images/social/reels/DbvB42ZlH5d.jpg",
    alt: "Autoklaven reel",
    href: "https://www.instagram.com/braeutigamgmbh/reel/DbvB42ZlH5d/",
  },
  {
    image: "/images/social/reels/Dbp4OcWgFZ0.jpg",
    alt: "F1-Ballastplatte Gummierung reel",
    href: "https://www.instagram.com/braeutigamgmbh/reel/Dbp4OcWgFZ0/",
  },
  {
    image: "/images/social/reels/Dbkum1MjefO.jpg",
    alt: "Carbon Handarbeit reel",
    href: "https://www.instagram.com/braeutigamgmbh/reel/Dbkum1MjefO/",
  },
  {
    image: "/images/social/reels/DbdALvFD9y7.jpg",
    alt: "Werkzeuge aus Carbon reel",
    href: "https://www.instagram.com/braeutigamgmbh/reel/DbdALvFD9y7/",
  },
  {
    image: "/images/social/reels/DbabXLzgm8W.jpg",
    alt: "Formel-1-Ballastplatte reel",
    href: "https://www.instagram.com/braeutigamgmbh/reel/DbabXLzgm8W/",
  },
];

const EXPERT_PREVIEW = 3;

export default function HomePage({
  heroSlide,
  locale = "de",
}: {
  heroSlide?: HeroSlide;
  locale?: Locale;
}) {
  const { isDark } = useTheme();
  const [showAllExperts, setShowAllExperts] = useState(false);

  const topographyColors = useMemo(() => {
    void isDark;
    return {
      lowColor: readCssVarColor("--text-default-accent-subtle"),
      midColor: readCssVarColor("--text-default-accent"),
      highColor: readCssVarColor("--colors-greeeen"),
    };
  }, [isDark]);

  // Section 2 Scrollytelling targets
  const scrollyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollyRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress using spring physics for buttery smooth scrolling
  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.6,
  });

  // Image transitions in Section 2 (CAD -> Autoclave -> Finished Wing)
  const opacityBlueprint = useTransform(smoothScrollProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const scaleBlueprint = useTransform(smoothScrollProgress, [0, 0.35], [1, 0.95]);

  const opacityAutoclave = useTransform(smoothScrollProgress, [0.25, 0.35, 0.60, 0.70], [0, 1, 1, 0]);
  const scaleAutoclave = useTransform(smoothScrollProgress, [0.25, 0.35, 0.60, 0.70], [1.05, 1, 1, 0.95]);

  const opacityFinished = useTransform(smoothScrollProgress, [0.60, 0.70, 0.95], [0, 1, 1]);
  const scaleFinished = useTransform(smoothScrollProgress, [0.60, 0.70, 0.95], [1.05, 1, 1]);

  // Spec card swaps when the finished component lands (Figma frames 1–2 vs frame 3).
  const opacitySpecEarly = useTransform(smoothScrollProgress, [0.6, 0.7], [1, 0]);
  const opacitySpecLate = useTransform(smoothScrollProgress, [0.6, 0.7], [0, 1]);

  return (
    // `domAnimation` covers animation, exit, inView and the pointer gestures
    // this page uses. `domMax` would only add pan/drag/layout, none of which
    // appear here, so the heavier bundle would be dead weight.
    // Not using `strict`: a single unsupported motion feature would throw and
    // tear down the whole tree (rings, timeline scroll, footer waves).
    <LazyMotion features={domAnimation}>
    <div className={`relative min-h-screen transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)]`}>
      {/* Noise Grain Filter Overlay */}
      <div className="noise-overlay pointer-events-none" />

      <SiteChrome />

      <main id="main-content" lang={locale}>
      {/* 1. HERO / LANDING SECTION — shared with /karriere */}
      <SiteHero scrollTarget="#story" slide={heroSlide} locale={locale} />

      <FigmaArtboardGap />

      <ManifestMicrographicTop />

      <FigmaArtboardGap />

      <ManifestBlock />

      <FigmaArtboardGap />

      <ManifestMicrographicBottom />

      <FigmaArtboardGap />

      <StoryCadSection
        scrollyRef={scrollyRef}
        smoothScrollProgress={smoothScrollProgress}
        opacityBlueprint={opacityBlueprint}
        scaleBlueprint={scaleBlueprint}
        opacityAutoclave={opacityAutoclave}
        scaleAutoclave={scaleAutoclave}
        opacityFinished={opacityFinished}
        scaleFinished={scaleFinished}
        opacitySpecEarly={opacitySpecEarly}
        opacitySpecLate={opacitySpecLate}
        topographyColors={topographyColors}
      />

      <FigmaArtboardGap />

      <MissionSection />

      {/* 3. SECTION: HORIZONTAL SCROLL TIMELINE (2016-2026) */}
      <div id="timeline" className="cv-auto" data-figma-node="2006:519" data-figma-node-dark="945:54">
        <LazyOnVisible
          loader={loadTimeline}
          rootMargin="100px"
          style={{ minHeight: "calc(100svh + 1100vh)" }}
        />
      </div>

      {/* 4. SECTION: MEET THE EXPERTS — HUD trading cards */}
      <section
        id="datasheet"
        className="experts-figma cv-auto relative py-24 md:py-32 overflow-hidden"
        data-figma-node="2006:660"
        data-figma-node-dark="945:55"
      >
        <div className="site-container relative z-10">
          <div className="experts-figma__header">
            <h2 className="experts-figma__title">
              <span className="experts-figma__meet">MEET</span>
              <span className="experts-figma__experts">THE EXPERTS</span>
            </h2>
            <div className="experts-figma__hud">
              <p className="experts-figma__hud-kicker">** END 2 END EXPERTS **</p>
              <p>
                <span>HEADCOUNT:</span>
                <span className="experts-figma__hud-val">80+</span>
              </p>
              <p>
                <span>DIVISIONS:</span>
                <span className="experts-figma__hud-val">9</span>
              </p>
            </div>
          </div>

          <div className="experts-figma__grid">
            {EXPERTS.slice(0, EXPERT_PREVIEW).map((expert) => (
              <ExpertSlot key={expert.email} expert={expert} />
            ))}
          </div>

          <div
            className={`experts-figma__more${showAllExperts ? " is-open" : ""}`}
            id="experts-rest"
            aria-hidden={!showAllExperts}
            inert={!showAllExperts}
          >
            <div className="experts-figma__more-inner">
              <div className="experts-figma__grid">
                {EXPERTS.slice(EXPERT_PREVIEW).map((expert, index) => (
                  <ExpertSlot
                    key={expert.email}
                    expert={expert}
                    delay={showAllExperts ? `${Math.floor(index / 3) * 80 + (index % 3) * 45}ms` : "0ms"}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`experts-figma__cta-wrap${showAllExperts ? " is-hidden" : ""}`}>
            <SiteButton
              type="button"
              aria-expanded={showAllExperts}
              aria-controls="experts-rest"
              disabled={showAllExperts}
              onClick={() => setShowAllExperts(true)}
            >
              {locale === "en" ? "MORE ON PAGE" : "MEHR HIER"}
            </SiteButton>
            <Link
              href={localizedHref("/team", locale)}
              className="mt-4 block font-mono text-[10px] uppercase tracking-[0.2em] text-brand-neon underline-offset-4 hover:underline"
            >
              {locale === "en" ? "ALL EXPERTS" : "ALLE EXPERTEN"}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SECTION: SOCIAL — Circular gallery, Figma 1154:1338 */}
      <section
        id="social"
        className="social-section cv-auto relative overflow-hidden"
        data-figma-node="2006:790"
        data-figma-node-dark="945:56"
      >
        <SocialGalleryBoundary items={SOCIAL_GALLERY_ITEMS}>
          <LazyOnVisible
            loader={loadCircularGallery}
            className="social-gallery"
            rootMargin="240px"
            componentProps={{
              items: SOCIAL_GALLERY_ITEMS,
              bend: 3,
              textColor: "#ffffff",
              borderRadius: 0.05,
              scrollEase: 0.05,
              itemAspect: 326 / 474,
              showTitles: false,
              font: "700 30px sans-serif",
              openOnClick: false,
              onItemClick: (item: { href?: string }) => {
                if (!item.href) return;
                window.open(item.href, "_blank", "noopener,noreferrer");
              },
            }}
          />
        </SocialGalleryBoundary>
        <div className="social-section__copy site-container">
          <h2 className="social-section__title">
            <span>Follow the daily</span>
            <span>Bräutigam Experience</span>
          </h2>
          <nav className="social-section__links" aria-label="Social">
            <a href="https://www.instagram.com/braeutigamgmbh" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Linkedin</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          </nav>
        </div>
      </section>
      </main>

      {/* FOOTER — Figma 1154:1356 (Oswald + frame notches) + LineWaves */}
      <SiteFooter />
    </div>
    </LazyMotion>
  );
}
