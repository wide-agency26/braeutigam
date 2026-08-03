"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TopoBackground from "./TopoBackground";
import NotchedBorderGlow from "./NotchedBorderGlow";
import HandwrittenMission from "./HandwrittenMission";
import TrackScrollMap from "./TrackScrollMap";
import SpotlightCard from "./SpotlightCard";
import ScrollTelemetry from "./ScrollTelemetry";
import DecryptedText from "./DecryptedText";
import LazyOnVisible from "./LazyOnVisible";
import Reveal from "./Reveal";
import { useTheme } from "./ThemeProvider";
import "./MagicRingsPoster.css";

/* Menu stays eagerly dynamic (opened from the hero). Heavier below-fold
   widgets load only when LazyOnVisible says they are near the viewport. */
const StaggeredMenu = dynamic(() => import("./StaggeredMenu"), { ssr: false });
const loadMagicRings = () => import("./MagicRings");
const loadLineWaves = () => import("./LineWaves");
const loadTimeline = () => import("./HorizontalTimeline");
const loadProfileCard = () => import("./ProfileCard");
import carDark from "../../public/images/car_silhouette_02_DarkMode.webp";
import carLight from "../../public/images/car_silhouette_02_LightMode.webp";
import story01Dark from "../../public/images/Part_01_darkmode.webp";
import story01Light from "../../public/images/Part_01.webp";
import story02 from "../../public/images/Part_02.webp";
import story03 from "../../public/images/Part_03.webp";
import craftHandwork from "../../public/images/craft_handwork.webp";
import laserTech from "../../public/images/laser_technology.webp";

export default function HomePage() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Section 2 Scrollytelling targets
  // New "Craft + Technology" section parallax
  const craftSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: craftScrollProgress } = useScroll({
    target: craftSectionRef,
    offset: ["start end", "end start"],
  });
  const craftImgY = useTransform(craftScrollProgress, [0, 1], [80, -80]);
  const techImgY = useTransform(craftScrollProgress, [0, 1], [-80, 80]);
  const craftImgX = useTransform(craftScrollProgress, [0, 0.5, 1], [60, 0, -30]);
  const techImgX = useTransform(craftScrollProgress, [0, 0.5, 1], [-60, 0, 30]);

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

      {/* Floating Top-Right Controls: Theme Toggle + Menu Button */}
      <div className="fixed top-6 right-6 z-[95] flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm bg-white/80 hover:bg-zinc-100/90 text-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 dark:text-zinc-200 dark:shadow-none"
          title="Toggle theme mode"
        >
          {isDark ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-12 px-5 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm bg-zinc-900/90 hover:bg-zinc-800 dark:bg-zinc-100/90 dark:hover:bg-white`}
          title="Toggle navigation menu"
        >
          <div className="flex flex-col items-center justify-center gap-[5px] w-6">
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "opacity-0 w-0" : "w-4 ml-auto opacity-70"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5 ml-auto"}`} />
          </div>
        </button>
      </div>

      {/* 1. HERO / LANDING SECTION (Full Screen cinematic supercar image, layered interactive rings, and center typography) */}
      <section id="silhouette" className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-24 transition-colors duration-500 text-zinc-900 dark:text-zinc-100`}>
        
        {/* Full Screen Background Car Images with Cross-Fade Transition */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
          {/* Dark Mode Silhouette */}
          <div className={`absolute inset-0 transition-opacity duration-1000 opacity-0 dark:opacity-100`}>
            <Image 
              src={carDark}
              alt="Carbon Fiber Supercar Silhouette Dark"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Light Mode Silhouette */}
          <div className={`absolute inset-0 transition-opacity duration-1000 opacity-100 dark:opacity-0`}>
            <Image 
              src={carLight}
              alt="Carbon Fiber Supercar Silhouette Light"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Subtle gradient overlays to ensure text remains highly readable */}
          <div className={`absolute inset-0 transition-colors duration-1000 bg-radial-gradient from-white/20 via-[#F9F9FB]/30 to-[#F9F9FB]/65 dark:bg-radial-gradient dark:from-zinc-950/20 dark:via-[#0B0B0C]/40 dark:to-[#0B0B0C]/85`} />

          {/* Bottom linear gradient to fade out Section 1 into Section 2 */}
          <div className={`absolute bottom-0 left-0 w-full h-80 pointer-events-none z-10 transition-colors duration-1000 bg-gradient-to-t from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent dark:bg-gradient-to-t dark:from-[#0B0B0C] dark:via-[#0B0B0C]/60 dark:to-transparent`} />
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

        {/* LED Pillars (Vertical columns of light flanking the sides, responsive to theme) */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-15">
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70`} />
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70`} />
        </div>

        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-15">
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70`} />
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 bg-zinc-950 opacity-20 dark:bg-white dark:shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] dark:opacity-70`} />
        </div>

        {/* Corner Telemetry Readouts */}
        <div className={`absolute top-28 left-6 hidden md:block font-mono text-[9px] leading-relaxed transition-colors duration-500 text-zinc-650 dark:text-zinc-500`}>
          <div>LOC: GERMANY // 49.0069° N, 8.4037° E</div>
          <div>ESTABLISHED // 2016</div>
        </div>

        <div className={`absolute top-28 right-6 hidden md:block font-mono text-[9px] text-right leading-relaxed transition-colors duration-500 text-zinc-650 dark:text-zinc-500`}>
          <div>COMPOSITE COMPONENT DEVELOPMENT</div>
          <div>PROJECT: AERO_HYPERCAR_v2.0</div>
        </div>

        {/* Center Content Area */}
        <div className="relative z-20 w-full max-w-4xl flex flex-col items-center text-center px-6 pointer-events-none">
          
          {/* Overlaid Typography block */}
          <div className="hero-rise flex flex-col items-center relative">
            {/* Brand Logo */}
            <div className="mb-10">
              <Image
                src="/images/logo_dark.webp"
                alt="Bräutigam Logo"
                width={1024}
                height={217}
                sizes="(min-width: 1024px) 13vw, (min-width: 768px) 16vw, (min-width: 640px) 19vw, 28vw"
                className={`w-[28vw] sm:w-[19vw] md:w-[16vw] lg:w-[13vw] h-auto transition-all duration-500 dark:invert`}
                priority
              />
            </div>

            <h1 className={`font-sans font-bold text-[11vw] sm:text-[8vw] tracking-tighter uppercase leading-[0.8] drop-shadow-md select-none transition-colors duration-500 text-zinc-950 dark:text-zinc-100`}>
              CARBON FIBER
            </h1>
            
            <span
              className="hero-works font-script text-brand-neon text-[9vw] sm:text-[6.5vw] absolute z-20 left-[55%] top-[55%] select-none drop-shadow-[0_4px_12px_rgba(57,255,20,0.5)] pointer-events-none"
            >
              Works
            </span>
          </div>

          {/* HUD telemetry stamp */}
          <div className={`mt-16 font-mono text-[9px] tracking-[0.2em] select-none transition-colors duration-500 text-zinc-600 dark:text-zinc-500`}>
            PROJECT STATUS: NOMINAL // VEHICLE_CF_CHASSIS
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 z-20 pointer-events-auto text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white`}>
          <a href="#story" className="flex flex-col items-center gap-2 cursor-pointer select-none">
            <span>[ SCROLL TO EVOLUTION ]</span>
            <div className="hero-chevron">
              <ChevronDown className="h-4 w-4 text-brand-neon" />
            </div>
          </a>
        </div>
      </section>

      {/* 1.5. SECTION: CRAFT + TECHNOLOGY — Full-width statement with parallax images */}
      <section 
        ref={craftSectionRef}
        id="craft-technology" 
        className="cv-auto relative min-h-screen flex items-center justify-center overflow-hidden py-32 md:py-40"
      >


        {/* Background flowing curves — Light Mode (kept as-is) */}
        <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 opacity-100 dark:opacity-0`}>
          <svg 
            className="w-full h-full opacity-[0.08]" 
            viewBox="0 0 1440 900" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            preserveAspectRatio="xMidYMid slice"
          >
            <path d="M-100 200 C 300 100, 500 400, 800 300 S 1100 100, 1500 250" stroke="#27272a" strokeWidth="1" />
            <path d="M-100 350 C 200 250, 600 550, 900 400 S 1200 200, 1600 350" stroke="#27272a" strokeWidth="1" />
            <path d="M-100 500 C 400 400, 700 700, 1000 500 S 1300 300, 1600 500" stroke="#27272a" strokeWidth="1" />
            <path d="M-100 650 C 250 550, 550 800, 850 650 S 1150 450, 1600 650" stroke="#27272a" strokeWidth="1" />
          </svg>
        </div>

        {/* Dark Mode subtle green curves on top of carbon texture */}
        <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 opacity-0 dark:opacity-100`}>
          <svg 
            className="w-full h-full opacity-[0.06]" 
            viewBox="0 0 1440 900" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            preserveAspectRatio="xMidYMid slice"
          >
            <path d="M-100 200 C 300 100, 500 400, 800 300 S 1100 100, 1500 250" stroke="#39FF14" strokeWidth="1" />
            <path d="M-100 350 C 200 250, 600 550, 900 400 S 1200 200, 1600 350" stroke="#39FF14" strokeWidth="1" />
            <path d="M-100 500 C 400 400, 700 700, 1000 500 S 1300 300, 1600 500" stroke="#39FF14" strokeWidth="1" />
            <path d="M-100 650 C 250 550, 550 800, 850 650 S 1150 450, 1600 650" stroke="#39FF14" strokeWidth="1" />
          </svg>
        </div>



        {/* Dark Mode gradient overlay — black > transparent > black for smooth section blending */}
        <div className={`absolute inset-0 pointer-events-none z-[2] transition-opacity duration-700 opacity-0 dark:opacity-100`} style={{
          background: 'linear-gradient(to bottom, #0B0B0C 0%, transparent 25%, transparent 75%, #0B0B0C 100%)'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="relative">

            {/* Parallax Image — Top Left (Craft/Handwork) */}
            <m.div 
              className="absolute -top-8 -left-4 md:left-0 w-[45%] max-w-[380px] aspect-[4/3] z-0 rounded-sm overflow-hidden"
              style={{ y: craftImgY, x: craftImgX }}
            >
              <Image 
                src={craftHandwork}
                alt="Carbon fiber handcraft layup"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 380px"
              />
              <div className={`absolute inset-0 bg-black/10 dark:bg-black/30`} />
            </m.div>

            {/* Parallax Image — Bottom Right (Technology/Laser) */}
            <m.div 
              className="absolute -bottom-8 -right-4 md:right-0 w-[45%] max-w-[380px] aspect-[4/3] z-0 rounded-sm overflow-hidden"
              style={{ y: techImgY, x: techImgX }}
            >
              <Image 
                src={laserTech}
                alt="Laser cutting technology"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 380px"
              />
              <div className={`absolute inset-0 bg-black/10 dark:bg-black/30`} />
            </m.div>

            {/* Main Text Block — centered, overlaid on images */}
            <div className="relative text-center py-16 md:py-24 flex flex-col items-center">
              {/* First statement: bold condensed (font-sans) + DecryptedText */}
              <Reveal
                as="h2"
                className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight leading-[1.05] transition-colors duration-500 text-center max-w-4xl text-zinc-950 dark:text-zinc-100"
              >
                <DecryptedText
                  text="Wir beliefern Kunden mit den "
                  animateOn="inViewHover"
                  speed={120}
                  maxIterations={7}
                  sequential={false}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                  className="decrypt-char-revealed"
                  encryptedClassName="decrypt-char-encrypted"
                />
                <span className="text-brand-neon">
                  <DecryptedText
                    text="höchsten"
                    animateOn="inViewHover"
                    speed={120}
                    maxIterations={7}
                    sequential={false}
                    revealDirection="center"
                    characters="ABCDEFGHIJKLMNÖÄÜ"
                    className="decrypt-char-revealed"
                    encryptedClassName="decrypt-char-encrypted"
                  />
                </span>
                <DecryptedText
                  text=" Anforderungen."
                  animateOn="inViewHover"
                  speed={120}
                  maxIterations={7}
                  sequential={false}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                  className="decrypt-char-revealed"
                  encryptedClassName="decrypt-char-encrypted"
                />
              </Reveal>

              {/* Spacer */}
              <div className="h-12 md:h-16" />

              {/* Second statement: display font (DxBurst) + DecryptedText */}
              <Reveal
                as="p"
                className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light uppercase tracking-tight leading-[1.05] transition-colors duration-500 text-center max-w-3xl text-zinc-950 dark:text-zinc-100"
              >
                <DecryptedText
                  text="Drei Wörter die uns beschreiben:"
                  animateOn="inViewHover"
                  speed={120}
                  maxIterations={7}
                  sequential={false}
                  characters="ABCDEFGHIJKLMNÖÄÜabcdefghijklmn"
                  className="decrypt-char-revealed"
                  encryptedClassName="decrypt-char-encrypted"
                />
              </Reveal>

              {/* Spacer */}
              <div className="h-8 md:h-12" />

              {/* Keywords: bold condensed, accent color + DecryptedText */}
              <Reveal
                as="p"
                className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tight leading-[1.05] text-brand-neon text-center"
              >
                <DecryptedText
                  text="Komplex, Schnell, Inhouse"
                  animateOn="inViewHover"
                  speed={120}
                  maxIterations={7}
                  sequential={false}
                  revealDirection="start"
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                  className="decrypt-char-revealed"
                  encryptedClassName="decrypt-char-encrypted"
                />
              </Reveal>
            </div>

          </div>
        </div>
      </section>

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

          {/* Top HUD Telemetry bar */}
          <div className={`absolute top-20 left-0 w-full border-b font-mono text-[9px] py-2 px-6 flex justify-between items-center z-30 transition-colors duration-500 border-zinc-200/60 bg-brand-light/40 text-zinc-500 dark:border-zinc-800 dark:bg-brand-dark/40 dark:text-zinc-400`}>
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
                      <span className="text-[8px] text-brand-neon font-bold">[ CERTIFIED ]</span>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">PART:</span>
                        <span>CFRP REAR WING</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">WEAVE:</span>
                        <span>2X2 TWILL PREPREG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">VOIDS:</span>
                        <span>&lt; 0.05% [SCAN NOMINAL]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold uppercase text-zinc-400">TOLER:</span>
                        <span>&lt; 0.05 mm [CNC PASS]</span>
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

      {/* 2.5. SECTION: MISSION (Interactive green handwriting animation under titles) */}
      <section id="mission" className="cv-auto relative min-h-screen py-32 flex flex-col justify-center border-b transition-colors duration-500 overflow-hidden border-zinc-200/60 dark:border-zinc-800">
        <TopoBackground opacityClass="opacity-[0.065] dark:opacity-[0.035]" />
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 technical-grid-theme`} />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="relative text-left max-w-5xl mx-auto w-full">
            <div className="relative inline-block w-full">
              {/* SVG background handwriting animation */}
              <div className="absolute inset-0 z-0 flex items-center justify-center -translate-y-6 md:-translate-y-12 scale-[1.43] md:scale-[1.69] pointer-events-none select-none">
                <HandwrittenMission />
              </div>
              
              {/* Foreground Titles - Univers for "High quality" and "High performance" */}
              <h2 
                className={`relative z-10 font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-none uppercase select-none whitespace-nowrap transition-colors duration-500 text-zinc-950 dark:text-zinc-100`}>
                High quality.
              </h2>
              <h2 
                className={`relative z-10 font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none uppercase select-none whitespace-nowrap transition-colors duration-500 mt-2 text-zinc-950 dark:text-zinc-100`}>
                High performance.
              </h2>
            </div>

            {/* Description text in the bottom right */}
            <div className="mt-16 flex justify-end w-full">
              <div className="max-w-md border-l border-brand-neon/30 pl-6">
                <span className={`text-[9px] font-mono tracking-widest block uppercase mb-2 text-zinc-400 dark:text-zinc-500`}>[ MISSION_MANIFESTO ]</span>
                <p className={`text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-500 text-zinc-600 dark:text-zinc-400`}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                  sed diam nonumy eirmod tempor invidunt ut labore et
                  dolore magna aliquyam erat, sed diam voluptua. At vero
                  eos et accusam et justo duo dolores et ea rebum.
                  Stet clita kasd gubergren, no sea
                </p>
                <div className="mt-8">
                  <SpotlightCard className={`custom-spotlight-card border transition-colors inline-block border-brand-neon bg-white hover:bg-brand-neon/10 dark:border-brand-neon dark:bg-transparent dark:hover:bg-brand-neon/10`} spotlightColor="rgba(57, 255, 20, 0.2)">
                    <a href="#about" className={`block px-8 py-3 font-sans font-bold text-sm uppercase tracking-wider focus:outline-none cursor-pointer text-zinc-900 dark:text-brand-neon`}>
                      About us
                    </a>
                  </SpotlightCard>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical HUD details */}
        <div className={`absolute bottom-4 left-8 md:left-16 hidden lg:flex items-center gap-8 font-mono text-[9px] transition-colors duration-500 text-zinc-400 dark:text-zinc-500`}>
          <span>MISSION: COMPOSITE_EXCELLENCE</span>
          <span>BRUSH_ID: #39FF14_ACTIVE</span>
        </div>
      </section>

      {/* 3. SECTION: HORIZONTAL SCROLL TIMELINE (2016-2026) */}
      <div id="timeline" className="cv-auto">
        <LazyOnVisible
          loader={loadTimeline}
          rootMargin="100px"
          style={{ minHeight: "1100vh" }}
        />
      </div>

      {/* 4. SECTION: TECHNICAL DATASHEET GRID (BorderGlow Cards) */}
      <section id="datasheet" className="cv-auto relative py-24 px-6 overflow-hidden">
        <TopoBackground opacityClass="opacity-[0.065] dark:opacity-[0.035]" />
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 technical-grid-theme`} />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="mb-16 w-full font-mono border-l-2 border-brand-neon pl-4">
            <span className={`text-xs tracking-widest font-semibold block uppercase transition-colors duration-500 text-zinc-500 dark:text-zinc-400`}>[ EXPERTISE & CRAFTSMANSHIP ]</span>
            <h2 className={`font-sans text-4xl sm:text-5xl font-light uppercase tracking-tight text-zinc-950 dark:text-white`}>
              MEET THE <span className="font-bold">EXPERTS</span>
            </h2>
          </div>

          {/* 3 Profile Cards — each chunk loads when the grid nears the viewport */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <LazyOnVisible
              loader={loadProfileCard}
              rootMargin="100px"
              style={{ minHeight: 420 }}
              componentProps={{
                name: "Ralf Schuster",
                title: "Management / Project Management",
                handle: "ralf@braeutigam-gmbh.eu",
                status: "07141/2996-701",
                avatarUrl: "",
              }}
            />
            <LazyOnVisible
              loader={loadProfileCard}
              rootMargin="100px"
              style={{ minHeight: 420 }}
              componentProps={{
                name: "Heiko Euteneuer",
                title: "Head of Design & Quality Management",
                handle: "heiko@braeutigam-gmbh.eu",
                status: "07141/2996-702",
                avatarUrl: "",
              }}
            />
            <LazyOnVisible
              loader={loadProfileCard}
              rootMargin="100px"
              style={{ minHeight: 420 }}
              componentProps={{
                name: "Hans Braun",
                title: "Project Management / Production Planning",
                handle: "hans@braeutigam-gmbh.eu",
                status: "07141/2996-708",
                avatarUrl: "",
              }}
            />
          </div>

          {/* Button to Team Page */}
          <div className="mt-20 text-center">
            <SpotlightCard 
              as="button"
              className={`px-10 py-5 border font-sans font-bold uppercase tracking-wider transition-all duration-300 border-black text-black hover:border-gray-500 hover:text-gray-700 dark:border-brand-neon dark:text-brand-neon dark:hover:border-white dark:hover:text-white`}
            >
              Check Team BRÄUTIGAM
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* FOOTER — Dark card design per reference */}
      <footer className="cv-auto relative pt-16 pb-10 px-4 sm:px-6 overflow-hidden min-h-screen flex flex-col justify-center">
        
        {/* Top Fade Gradient for seamless blending with section above */}
        <div className={`absolute top-0 left-0 w-full h-48 z-10 pointer-events-none bg-gradient-to-b from-brand-light to-transparent dark:from-[#0B0B0C] dark:to-transparent`} />

        {/* LineWaves Background (Behind the card) */}
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

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Main dark card with notched corners */}
          <NotchedBorderGlow
            notchPosition="slanted"
            active={true}
            noPadding={true}
            borderRadius={16}
            notchSize={40}
            className="nbg-frosted w-full relative overflow-hidden backdrop-blur-md"
          >
            <div ref={footerObstacleRef} className="relative w-full py-14 px-8 sm:px-12 lg:px-16 flex flex-col justify-center">

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center h-full">

                {/* Left Column — Site Navigation Links */}
                <nav className="flex flex-col gap-2 text-left">
                  {[
                    { label: "HOME", href: "#silhouette" },
                    { label: "LEISTUNGEN", href: "#story" },
                    { label: "BAUTEILE", href: "#datasheet" },
                    { label: "KARRIERE", href: "#karriere" },
                    { label: "TEAM", href: "#team" }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`font-sans text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight transition-colors duration-200 leading-tight text-zinc-700 hover:text-brand-dark dark:text-zinc-300 dark:hover:text-brand-neon`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Center Column — Branding Block */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className={`font-sans text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-none text-zinc-900 dark:text-zinc-100`}>
                    BRÄUTIGAM
                  </span>
                  <span className="font-script text-brand-neon text-3xl sm:text-4xl lg:text-5xl -mt-2 select-none">
                    Since 2016
                  </span>
                </div>

                {/* Right Column — Social Media Links */}
                <nav className="flex flex-col gap-2 text-right">
                  {[
                    { label: "INSTAGRAM", href: "https://instagram.com" },
                    { label: "LINKEDIN", href: "https://linkedin.com" },
                    { label: "FACEBOOK", href: "https://facebook.com" }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-sans text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight transition-colors duration-200 leading-tight text-zinc-700 hover:text-brand-dark dark:text-zinc-300 dark:hover:text-brand-neon`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

              </div>
            </div>
          </NotchedBorderGlow>

          {/* Legal strip below the card */}
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <div className={`flex items-center gap-4 font-sans text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300`}>
              <a href="#" className="hover:text-brand-neon transition-colors duration-200">IMPRESSUM</a>
              <span className="text-brand-neon text-lg">•</span>
              <a href="#" className="hover:text-brand-neon transition-colors duration-200">DATENSCHUTZ</a>
            </div>
            <span className={`font-mono text-[10px] tracking-widest uppercase text-zinc-500 dark:text-zinc-500`}>
              BUILD WITH &lt;3 BY WIDE
            </span>
          </div>

        </div>
      </footer>

      {/* Sliding Navigation Menu Overlay */}
      <StaggeredMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </div>
    </LazyMotion>
  );
}
