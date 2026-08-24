"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, useScroll, useTransform, useSpring } from "framer-motion";
import NotchedBorderGlow from "./NotchedBorderGlow";
import TrackScrollMap from "./TrackScrollMap";
import ScrollTelemetry from "./ScrollTelemetry";
import LazyOnVisible from "./LazyOnVisible";
import SiteChrome from "./SiteChrome";
import SiteHero from "./SiteHero";
import ManifestBlock from "./ManifestBlock";
import { useTheme } from "./ThemeProvider";

/* Heavier below-fold widgets load only when LazyOnVisible says they are near
   the viewport. */
const loadLineWaves = () => import("./LineWaves");
const loadTimeline = () => import("./HorizontalTimeline");
const loadExpertCard = () => import("./ExpertCard");
import story01Dark from "../../public/images/Part_01_darkmode.webp";
import story01Light from "../../public/images/Part_01.webp";
import story02 from "../../public/images/Part_02.webp";
import story03 from "../../public/images/Part_03.webp";
import laserTech from "../../public/images/laser_technology.webp";

const EXPERT_PORTRAIT = "/images/experts/portrait.webp";
const SOCIAL_FAN_IMAGES = [
  { src: "/images/social/1.webp", alt: "Workshop detail" },
  { src: "/images/social/2.webp", alt: "Carbon layup" },
  { src: "/images/social/3.webp", alt: "Autoclave bay" },
  { src: "/images/social/4.webp", alt: "Finished component" },
  { src: "/images/social/5.webp", alt: "Team on the floor" },
  { src: "/images/social/6.webp", alt: "Quality check" },
] as const;
const WIDE_CREDIT_URL = "https://wide-communication.com";

export default function HomePage() {
  const { isDark } = useTheme();

  // Parallax layers refs
  const backgroundRef = useRef<HTMLDivElement>(null);
  const midgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const footerObstacleRef = useRef<HTMLDivElement>(null);

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

  // Text transitions in Section 2 (completely non-overlapping with dead-zone gaps)
  const opacityText1 = useTransform(smoothScrollProgress, [0, 0.20, 0.25], [1, 1, 0]);
  const yText1 = useTransform(smoothScrollProgress, [0, 0.20, 0.25], [0, 0, -20]);

  const opacityText2 = useTransform(smoothScrollProgress, [0.35, 0.40, 0.55, 0.60], [0, 1, 1, 0]);
  const yText2 = useTransform(smoothScrollProgress, [0.35, 0.40, 0.55, 0.60], [20, 0, 0, -20]);

  const opacityText3 = useTransform(smoothScrollProgress, [0.70, 0.75, 0.95], [0, 1, 1]);
  const yText3 = useTransform(smoothScrollProgress, [0.70, 0.75, 0.95], [20, 0, 0]);

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

      {/* 1. HERO / LANDING SECTION — shared with /karriere */}
      <SiteHero scrollTarget="#story" />


      <ManifestBlock />

      {/* 2. SECTION: SEAMLESS EVOLUTION SCROLLYTELLING (CAD -> Autoclave -> Finished Product) */}
      <section id="story" ref={scrollyRef} className="cv-auto relative h-[300vh]">
        
        {/* Sticky 100vh Viewport background elements */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          
          {/* Top seamless blending gradient overlay */}
          <div className={`absolute top-0 left-0 w-full h-64 pointer-events-none z-30 transition-colors duration-1000 bg-gradient-to-b from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent dark:bg-gradient-to-b dark:from-[#0B0B0C] dark:via-[#0B0B0C]/60 dark:to-transparent`} />

          {/* User-provided aerodynamic/flow SVG curves in background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden ">
            <svg className={`w-full h-full opacity-[0.07] transition-colors duration-500 text-zinc-650 dark:text-zinc-450 dark:text-zinc-400`} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <path d="M-100 150 C 200 120, 400 300, 600 250 S 900 100, 1100 180 S 1300 450, 1600 400" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M-100 230 C 220 190, 420 380, 630 330 S 920 180, 1130 260 S 1320 530, 1600 480" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M-100 310 C 240 260, 440 460, 660 410 S 940 260, 1160 340 S 1340 610, 1600 560" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M-100 390 C 260 330, 460 540, 690 490 S 960 340, 1190 420 S 1360 690, 1600 640" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M-100 470 C 280 400, 480 620, 720 570 S 980 420, 1220 500 S 1380 770, 1600 720" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M-100 550 C 300 470, 500 700, 750 650 S 1000 500, 1250 580 S 1400 850, 1600 800" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M-100 630 C 320 540, 520 780, 780 730 S 1020 580, 1280 660 S 1420 930, 1600 880" stroke="currentColor" strokeWidth="1.2"></path>
              <path d="M 800 -100 C 950 50, 1200 100, 1350 50 S 1500 -50, 1600 -100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"></path>
              <path d="M 850 -100 C 990 80, 1230 130, 1380 80 S 1520 -30, 1600 -80" stroke="currentColor" strokeWidth="1"></path>
              <path d="M 900 -100 C 1030 110, 1260 160, 1410 110 S 1540 -10, 1600 -60" stroke="currentColor" strokeWidth="1"></path>
              <path d="M 950 -100 C 1070 140, 1290 190, 1440 140 S 1560 10, 1600 -40" stroke="currentColor" strokeWidth="1"></path>
              <path d="M-100 600 C 100 650, 200 800, 150 950 S-50 1100, -100 1100" stroke="currentColor" strokeWidth="1"></path>
              <path d="M-100 680 C 120 730, 220 880, 170 1030 S-30 1180, -100 1180" stroke="currentColor" strokeWidth="1"></path>
              <path d="M-100 760 C 140 810, 240 960, 190 1110 S-10 1260, -100 1260" stroke="currentColor" strokeWidth="1"></path>
            </svg>
          </div>

          {/* Technical grid overlay */}
          <div className={`absolute inset-0 pointer-events-none transition-all duration-500 technical-grid-theme`} />

          {/* Top HUD Telemetry — Figma CAD corners */}
          <div className="absolute top-20 left-0 w-full font-mono text-[9px] py-2 px-6 flex justify-between items-start z-30 transition-colors duration-500 text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-neon rounded-full inline-block animate-pulse"></span>
              <span>RENDER ENGINE: OPENGL_3D_COMPOSE</span>
            </div>
            <ScrollTelemetry progress={smoothScrollProgress} />
          </div>

          {/* Main Layout Area spanning max-w-7xl */}
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 h-full relative flex flex-col justify-between py-24 pointer-events-none">
            
            {/* TOP-LEFT AREA: HEADINGS (Animated sticky in place) */}
            <div className="relative w-full max-w-xl h-44 mt-8 pointer-events-none">
              
              {/* Step 1 Heading */}
              <m.div 
                style={{ opacity: opacityText1, y: yText1 }} 
                className="absolute top-0 left-0 w-full flex flex-col items-start"
              >
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className={`px-4 py-1.5 transition-colors duration-500 text-zinc-800 dark:text-brand-neon`}>
                      HIGH PERFORMANCE
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className={`font-sans text-5xl sm:text-7xl font-light tracking-tight leading-[0.95] uppercase text-zinc-950 dark:text-white`}>
                  From the<br />
                  <strong className="font-semibold block font-sans">initial idea</strong>
                </h2>
              </m.div>

              {/* Step 2 Heading */}
              <m.div 
                style={{ opacity: opacityText2, y: yText2 }} 
                className="absolute top-0 left-0 w-full flex flex-col items-start"
              >
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className={`px-4 py-1.5 transition-colors duration-500 text-zinc-800 dark:text-brand-neon`}>
                      THERMAL CURING
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className={`text-5xl sm:text-7xl tracking-tight leading-[0.95] uppercase transition-colors duration-500 text-zinc-950 dark:text-white`}>
                  <span className="font-sans font-light block">High quality.</span>
                  <span className="font-sans font-bold block">High performance.</span>
                </h2>
              </m.div>

              {/* Step 3 Heading */}
              <m.div 
                style={{ opacity: opacityText3, y: yText3 }} 
                className="absolute top-0 left-0 w-full flex flex-col items-start"
              >
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className={`px-4 py-1.5 transition-colors duration-500 text-zinc-800 dark:text-brand-neon`}>
                      QA RELEASE
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className={`font-sans text-5xl sm:text-7xl font-light tracking-tight leading-[0.95] uppercase text-zinc-950 dark:text-white`}>
                  To the<br />
                  <strong className="font-semibold block font-sans">finished component.</strong>
                </h2>
              </m.div>

            </div>

            {/* FULL SCREEN BORDERLESS TRANSFERRING IMAGES (In centered position) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[55vh] lg:h-[65vh] flex items-center justify-center pointer-events-none z-0">
              <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                
                {/* CAD Blueprint Drawing - Fades in/out, cross-fades dark/light images */}
                <m.div 
                  style={{ opacity: opacityBlueprint, scale: scaleBlueprint }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
                >
                  {/* Dark Mode Blueprint */}
                  <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 opacity-0 dark:opacity-100`}>
                    <Image 
                      src={story01Dark}
                      alt="CAD Drawing Dark"
                      fill
                      className="object-contain mix-blend-screen"
                      sizes="(max-width: 1024px) 85vw, 1024px"
                    />
                  </div>
                  {/* Light Mode Blueprint */}
                  <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 opacity-100 dark:opacity-0`}>
                    <Image 
                      src={story01Light}
                      alt="CAD Drawing Light"
                      fill
                      className="object-contain mix-blend-multiply"
                      sizes="(max-width: 1024px) 85vw, 1024px"
                    />
                  </div>
                </m.div>

                {/* Autoclave Photo - Fades in/out */}
                <m.div 
                  style={{ opacity: opacityAutoclave, scale: scaleAutoclave }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
                >
                  <Image 
                    src={story02}
                    alt="Composite Autoclave Curing Casing"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 85vw, 1024px"
                  />
                </m.div>

                {/* Finished Glossy Carbon Wing - Fades in/out */}
                <m.div 
                  style={{ opacity: opacityFinished, scale: scaleFinished }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
                >
                  <Image 
                    src={story03}
                    alt="Finished Carbon Wing Aerodynamic Part"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 85vw, 1024px"
                  />
                </m.div>


              </div>
            </div>

            {/* BOTTOM-LEFT DESIGN ANCHOR MAP */}
            <div className="absolute bottom-12 left-6 md:left-12 z-20 pointer-events-auto">
              <TrackScrollMap progress={smoothScrollProgress} />
            </div>

            {/* BOTTOM-RIGHT AREA: DESCRIPTION PARAGRAPHS (Animated sticky in place) */}
            <div className="absolute bottom-16 right-6 md:right-12 w-full max-w-md h-56 pointer-events-none flex flex-col justify-end">
              
              {/* Step 1 Description */}
              <m.div 
                style={{ opacity: opacityText1, y: yText1 }} 
                className="absolute bottom-0 right-0 w-full flex flex-col items-end pointer-events-auto"
              >
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right">
                  Every racing component begins as a highly optimized CAD design. We run extensive Finite Element Analysis (FEA) to align carbon fiber weave orientations exactly with the load paths, maximizing rigidity while removing every unnecessary gram of material.
                </p>
              </m.div>

              {/* Step 2 Description */}
              <m.div 
                style={{ opacity: opacityText2, y: yText2 }} 
                className="absolute bottom-0 right-0 w-full flex flex-col items-end pointer-events-auto"
              >
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right">
                  Components are vacuum-bagged and cured inside high-pressure autoclaves. Using a meticulous ramp-up cycle up to 135°C under 6.0 Bar positive pressure, we guarantee zero voids, maximum laminate compaction, and complete resin impregnation.
                </p>
              </m.div>

              {/* Step 3 Description + Spec Card */}
              <m.div 
                style={{ opacity: opacityText3, y: yText3 }} 
                className="absolute bottom-0 right-0 w-full flex flex-col items-end pointer-events-auto"
              >
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right mb-4">
                  Our finished carbon fiber structures undergo strict quality assurance. Every component is ultrasonically scanned and CNC inspected, ensuring tolerance thresholds of less than 0.05 mm and absolute structural compliance.
                </p>
                
                <NotchedBorderGlow notchPosition="bottom-right" className="w-full max-w-sm shadow-sm pointer-events-auto">
                  <div className={`font-mono text-[9px] leading-normal text-zinc-700 dark:text-zinc-300`}>
                    <div className={`text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 uppercase tracking-wider text-[10px] pb-1 border-b flex justify-between items-center border-zinc-100 dark:border-zinc-800`}>
                      <span>// COMPOSITE_SPEC</span>
                      <span className="text-[8px] text-brand-neon font-bold">[QC CERTIFIED]</span>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">PART:</span>
                        <span>VEHICLE_BR_CHASSIS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">WEAVE:</span>
                        <span>2X2 TWILL PREPREG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">VOIDS:</span>
                        <span>&lt; 0.05 %</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">TOLERANCE</span>
                        <span>&lt; 0.05 MM</span>
                      </div>
                    </div>
                  </div>
                </NotchedBorderGlow>
              </m.div>

            </div>

          </div>

          {/* Bottom scrollytelling coordinate HUD indicators */}
          <div className={`absolute bottom-4 left-8 md:left-16 hidden lg:flex items-center gap-8 font-mono text-[9px] transition-colors duration-500 text-zinc-400 dark:text-zinc-500`}>
            <span>AXIS_X: +1.28</span>
            <span>AXIS_Y: -0.49</span>
            <span>AXIS_Z: +0.00</span>
          </div>

        </div>
      </section>

      {/* 2.5. SECTION: MISSION — Final Home (Figma 989:2 proportions) */}
      <section id="mission" className="mission-figma cv-auto relative overflow-hidden transition-colors duration-500">
        <div className="mission-figma__stage">
          <div className="mission-figma__watermark" aria-hidden>
            <p>
              OUR
              <br />
              CRAFT
            </p>
          </div>

          <aside className="mission-figma__sidebar" aria-label="Craft principles">
            <div className="mission-figma__chip">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="2" fill="currentColor" />
                {Array.from({ length: 8 }, (_, i) => {
                  const a = (i * Math.PI) / 4;
                  return (
                    <line
                      key={i}
                      x1={16 + Math.cos(a) * 5}
                      y1={16 + Math.sin(a) * 5}
                      x2={16 + Math.cos(a) * 13}
                      y2={16 + Math.sin(a) * 13}
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  );
                })}
              </svg>
              <span>END 2 END EXPERTS</span>
            </div>
            <div className="mission-figma__chip">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.4" />
                <path d="M16 6v20M6 16h20" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="16" cy="16" r="2.2" fill="currentColor" />
              </svg>
              <span>PRECISION CRAFT</span>
            </div>
            <div className="mission-figma__chip">
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <span>FLAWLESS EXECUTION</span>
            </div>
          </aside>

          <div className="mission-figma__headline">
            <h2 className="mission-figma__quality">FLAWLESS QUALITY &amp;</h2>
            <p className="mission-figma__perf">HIGH PERFORMANCE.</p>
          </div>

          <div className="mission-figma__split">
            <div className="mission-figma__image">
              <Image
                src={laserTech}
                alt="Precision finishing on a carbon fiber component"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            </div>
            <div className="mission-figma__aside">
              <p className="mission-figma__copy">
                Every racing component begins as a highly optimized CAD design. We run extensive Finite Element Analysis (FEA) to align carbon fiber weave orientations exactly with the load paths, maximizing rigidity while removing every unnecessary gram of material.
              </p>
              <a href="#story" className="mission-figma__btn">
                MANUFACTURING
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: HORIZONTAL SCROLL TIMELINE (2016-2026) */}
      <div id="timeline" className="cv-auto">
        <LazyOnVisible
          loader={loadTimeline}
          rootMargin="100px"
          style={{ minHeight: "calc(100svh + 1100vh)" }}
        />
      </div>

      {/* 4. SECTION: MEET THE EXPERTS — HUD trading cards */}
      <section id="datasheet" className="experts-figma cv-auto relative py-24 md:py-32 px-6 lg:px-16 overflow-hidden">
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 technical-grid-theme`} />

        <div className="relative z-10">
          <div className="experts-figma__header">
            <h2 className="experts-figma__title">
              <span className="experts-figma__meet">MEET</span>
              <span className="experts-figma__experts">THE EXPERTS</span>
            </h2>
            <div className="experts-figma__hud">
              <p className="experts-figma__hud-kicker">** END 2 END EXPERTS **</p>
              <p>
                <span>HEADCOUNT:</span>
                <span className="experts-figma__hud-val">88+</span>
              </p>
              <p>
                <span>DIVISIONS:</span>
                <span className="experts-figma__hud-val">9</span>
              </p>
            </div>
          </div>

          {/* Figma: 1243px row centred in the page — 3 × 403px cards, 17px gutters */}
          <div className="mx-auto grid w-full max-w-[1243px] grid-cols-1 justify-items-center gap-10 lg:grid-cols-3 lg:gap-[17px]">
            <LazyOnVisible
              loader={loadExpertCard}
              rootMargin="100px"
              style={{ width: "100%", aspectRatio: "403 / 522" }}
              componentProps={{
                name: "Ralf Schuster",
                title: "PRODUCTION & PROJECT MANAGER",
                email: "ralf@braeutigam-gmbh.eu",
                phone: "07141/2996-701",
                avatarUrl: EXPERT_PORTRAIT,
                memberId: "#701-RS",
              }}
            />
            <LazyOnVisible
              loader={loadExpertCard}
              rootMargin="100px"
              style={{ width: "100%", aspectRatio: "403 / 522" }}
              componentProps={{
                name: "Heiko Euteneuer",
                title: "PRODUCTION & PROJECT MANAGER",
                email: "heiko@braeutigam-gmbh.eu",
                phone: "07141/2996-702",
                avatarUrl: EXPERT_PORTRAIT,
                memberId: "#702-HE",
              }}
            />
            <LazyOnVisible
              loader={loadExpertCard}
              rootMargin="100px"
              style={{ width: "100%", aspectRatio: "403 / 522" }}
              componentProps={{
                name: "Hans Braun",
                title: "PRODUCTION & PROJECT MANAGER",
                email: "hans@braeutigam-gmbh.eu",
                phone: "07141/2996-708",
                avatarUrl: EXPERT_PORTRAIT,
                memberId: "#934-241",
              }}
            />
          </div>

          <div className="experts-figma__cta-wrap">
            <a href="mailto:info@braeutigam-gmbh.eu" className="experts-figma__cta">
              ALL EXPERTS
            </a>
          </div>
        </div>
      </section>

      {/* 5. SECTION: SOCIAL FAN — Follow the daily Bräutigam Experience */}
      <section id="social" className="cv-auto relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center gap-10">
          <div className="social-fan" aria-hidden="true">
            {SOCIAL_FAN_IMAGES.map((img) => (
              <div key={img.src} className="social-fan__card">
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 28vw, 220px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight text-zinc-950 dark:text-zinc-100 leading-[0.9]">
              Follow the daily
              <span className="block font-bold mt-1">Bräutigam Experience</span>
            </h2>
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-8 font-mono text-[13px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors">Linkedin</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors">Facebook</a>
            </nav>
          </div>
        </div>
      </section>

      {/* FOOTER — Figma 1154:1356 (Oswald + frame notches) + LineWaves */}
      <footer className="footer-figma-section cv-auto">
        <div className="absolute top-0 left-0 w-full h-40 z-10 pointer-events-none bg-gradient-to-b from-brand-light to-transparent dark:from-[#0B0B0C] dark:to-transparent" />

        <div className="absolute inset-0 z-0">
          <LazyOnVisible
            loader={loadLineWaves}
            rootMargin="100px"
            className="absolute inset-0"
            componentProps={{
              speed: 0.1,
              innerLineCount: 35,
              outerLineCount: 20,
              warpIntensity: 1.0,
              rotation: 59,
              edgeFadeWidth: 0.05,
              colorCycleSpeed: 1.0,
              brightness: isDark ? 0.3 : 1.0,
              color1: isDark ? "#39ff14" : "#000000",
              color2: isDark ? "#222222" : "#000000",
              color3: isDark ? "#111111" : "#000000",
              enableMouseInteraction: true,
              mouseInfluence: 3.0,
            }}
          />
        </div>

        <div ref={footerObstacleRef} className="footer-figma relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="footer-figma__frame"
            src="/images/ui/footer-frame.svg"
            alt=""
            aria-hidden
            draggable={false}
          />

          <div className="footer-figma__inner">
            <div className="footer-figma__main">
              <nav className="footer-figma__nav" aria-label="Footer">
                {[
                  { label: "HOME", href: "#silhouette" },
                  { label: "LEISTUNGEN", href: "#story" },
                  { label: "BAUTEILE", href: "#mission" },
                  { label: "KARRIERE", href: "/karriere" },
                  { label: "TEAM", href: "#datasheet" },
                ].map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="footer-figma__brand">
                <span className="footer-figma__logo">BRÄUTIGAM</span>
                <div className="footer-figma__since">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ui/since-badge.svg"
                    alt=""
                    aria-hidden
                    draggable={false}
                  />
                  <span>SINCE 2016</span>
                </div>
              </div>

              <nav className="footer-figma__nav" aria-label="Social">
                {[
                  { label: "INSTAGRAM", href: "https://instagram.com" },
                  { label: "LINKEDIN", href: "https://linkedin.com" },
                  { label: "FACEBOOK", href: "https://facebook.com" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Sits in the frame’s bottom notches — not outside */}
            <div className="footer-figma__bottom">
              <div className="footer-figma__imprint">
                <a href="#">IMPRESSUM</a>
                <a href="#">DATENSCHUTZ</a>
              </div>
              <div className="footer-figma__legal">
                <a href="#">Legal Notice</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Change Privacy Settings</a>
                <a href="#">History of Privacy Settings</a>
                <a href="#">Revoke Consent</a>
              </div>
              <a
                href={WIDE_CREDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-figma__credit"
              >
                BUILT WITH &lt;3 BY WIDE
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </LazyMotion>
  );
}
