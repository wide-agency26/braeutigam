"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MagicRings from "./components/MagicRings";
import TopoBackground from "./components/TopoBackground";
import NotchedBorderGlow from "./components/NotchedBorderGlow";
import StaggeredMenu from "./components/StaggeredMenu";
import HandwrittenMission from "./components/HandwrittenMission";
import HorizontalTimeline from "./components/HorizontalTimeline";
import ProfileCard from "./components/ProfileCard";

import DecryptedText from "./components/DecryptedText";
import carDark from "../public/images/car_silhouette_02_DarkMode.png";
import carLight from "../public/images/car_silhouette_02_LightMode.png";
import story01Dark from "../public/images/Part_01_darkmode.png";
import story01Light from "../public/images/Part_01.png";
import story02 from "../public/images/Part_02.png";
import story03 from "../public/images/Part_03.png";
import craftHandwork from "../public/images/craft_handwork.png";
import laserTech from "../public/images/laser_technology.png";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
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

  const [activeStep, setActiveStep] = useState(0); // 0 = CAD, 1 = Autoclave, 2 = Finished
  const [scrollProgressText, setScrollProgressText] = useState("0%");

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

  // Progress Bar tracking height and opacity
  const heightProgressLine = useTransform(smoothScrollProgress, [0, 0.95], ["0%", "100%"]);

  useMotionValueEvent(smoothScrollProgress, "change", (latest) => {
    setScrollProgressText(`${Math.min(Math.round(latest * 100), 100)}%`);
    if (latest < 0.30) {
      setActiveStep(0);
    } else if (latest < 0.65) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }
  });



  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark";

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${isDark ? "dark bg-brand-dark text-zinc-100" : "bg-brand-light text-zinc-900"}`}>
      {/* Noise Grain Filter Overlay */}
      <div className="noise-overlay pointer-events-none" />

      {/* Floating Top-Right Controls: Theme Toggle + Menu Button */}
      <div className="fixed top-6 right-6 z-[95] flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm ${
            isDark 
              ? "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200" 
              : "bg-white/80 hover:bg-zinc-100/90 text-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
          }`}
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
          className={`h-12 px-5 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm ${
            isDark
              ? "bg-zinc-100/90 hover:bg-white"
              : "bg-zinc-900/90 hover:bg-zinc-800"
          }`}
          title="Toggle navigation menu"
        >
          <div className="flex flex-col items-center justify-center gap-[5px] w-6">
            <span className={`block h-[2px] rounded-full transition-all duration-300 ${
              isDark ? "bg-zinc-900" : "bg-zinc-100"
            } ${isMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 ${
              isDark ? "bg-zinc-900" : "bg-zinc-100"
            } ${isMenuOpen ? "opacity-0 w-0" : "w-4 ml-auto opacity-70"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 ${
              isDark ? "bg-zinc-900" : "bg-zinc-100"
            } ${isMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5 ml-auto"}`} />
          </div>
        </button>
      </div>

      {/* 1. HERO / LANDING SECTION (Full Screen cinematic supercar image, layered interactive rings, and center typography) */}
      <section id="silhouette" className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-24 transition-colors duration-500 ${
        isDark ? "bg-[#0B0B0C] text-zinc-100" : "bg-brand-light text-zinc-900"
      }`}>
        
        {/* Full Screen Background Car Images with Cross-Fade Transition */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none z-0">
          {/* Dark Mode Silhouette */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? "opacity-100" : "opacity-0"}`}>
            <Image 
              src={carDark}
              alt="Carbon Fiber Supercar Silhouette Dark"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Light Mode Silhouette */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${!isDark ? "opacity-100" : "opacity-0"}`}>
            <Image 
              src={carLight}
              alt="Carbon Fiber Supercar Silhouette Light"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Subtle gradient overlays to ensure text remains highly readable */}
          <div className={`absolute inset-0 transition-colors duration-1000 ${
            isDark 
              ? "bg-radial-gradient from-zinc-950/20 via-[#0B0B0C]/40 to-[#0B0B0C]/85" 
              : "bg-radial-gradient from-white/20 via-[#F9F9FB]/30 to-[#F9F9FB]/65"
          }`} />

          {/* Bottom linear gradient to fade out Section 1 into Section 2 */}
          <div className={`absolute bottom-0 left-0 w-full h-80 pointer-events-none z-10 transition-colors duration-1000 ${
            isDark 
              ? "bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/60 to-transparent" 
              : "bg-gradient-to-t from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent"
          }`} />
        </div>
        
        {/* Ambient WebGL Magic Rings overlaying the background image */}
        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none flex items-center justify-center">
          <MagicRings 
            color="#39FF14"
            colorTwo={isDark ? "#555555" : "#cbd5e1"}
            ringCount={6}
            speed={0.4}
            attenuation={14}
            lineThickness={1.6}
            baseRadius={0.28}
            radiusStep={0.11}
            scaleRate={0.05}
            opacity={0.5}
            blur={0}
            noiseAmount={0.06}
            rotation={20}
            ringGap={1.35}
            fadeIn={0.8}
            fadeOut={0.4}
            followMouse={true}
            mouseInfluence={0.25}
            hoverScale={1.15}
            parallax={0.03}
            clickBurst={true}
          />
        </div>

        {/* LED Pillars (Vertical columns of light flanking the sides, responsive to theme) */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-15">
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 ${isDark ? "bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] opacity-70" : "bg-zinc-950 opacity-20"}`} />
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 ${isDark ? "bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] opacity-70" : "bg-zinc-950 opacity-20"}`} />
        </div>

        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-15">
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 ${isDark ? "bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] opacity-70" : "bg-zinc-950 opacity-20"}`} />
          <div className={`w-[4px] h-[120px] rounded-[2px] transition-all duration-500 ${isDark ? "bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff] opacity-70" : "bg-zinc-950 opacity-20"}`} />
        </div>

        {/* Corner Telemetry Readouts */}
        <div className={`absolute top-28 left-6 hidden md:block font-mono text-[9px] leading-relaxed transition-colors duration-500 ${isDark ? "text-zinc-500" : "text-zinc-650"}`}>
          <div>LOC: GERMANY // 49.0069° N, 8.4037° E</div>
          <div>ESTABLISHED // 2016</div>
        </div>

        <div className={`absolute top-28 right-6 hidden md:block font-mono text-[9px] text-right leading-relaxed transition-colors duration-500 ${isDark ? "text-zinc-500" : "text-zinc-650"}`}>
          <div>COMPOSITE COMPONENT DEVELOPMENT</div>
          <div>PROJECT: AERO_HYPERCAR_v2.0</div>
        </div>

        {/* Center Content Area */}
        <div className="relative z-20 w-full max-w-4xl flex flex-col items-center text-center px-6 pointer-events-none">
          
          {/* Overlaid Typography block */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center relative"
          >
            {/* Brand Logo */}
            <div className="mb-10">
              <Image
                src="/images/logo_dark.png"
                alt="Bräutigam Logo"
                width={1024}
                height={217}
                className={`w-[28vw] sm:w-[19vw] md:w-[16vw] lg:w-[13vw] h-auto transition-all duration-500 ${
                  isDark ? "invert" : ""
                }`}
                priority
              />
            </div>

            <h1 className={`font-sans font-bold text-[11vw] sm:text-[8vw] tracking-tighter uppercase leading-[0.8] drop-shadow-md select-none transition-colors duration-500 ${
              isDark ? "text-zinc-100" : "text-zinc-950"
            }`}>
              CARBON FIBER
            </h1>
            
            <motion.span 
              initial={{ opacity: 0, scale: 0.8, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: -12 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="font-script text-brand-neon text-[9vw] sm:text-[6.5vw] absolute z-20 left-[55%] top-[55%] select-none drop-shadow-[0_4px_12px_rgba(57,255,20,0.5)] pointer-events-none"
            >
              Works
            </motion.span>
          </motion.div>

          {/* HUD telemetry stamp */}
          <div className={`mt-16 font-mono text-[9px] tracking-[0.2em] select-none transition-colors duration-500 ${
            isDark ? "text-zinc-500" : "text-zinc-600"
          }`}>
            PROJECT STATUS: NOMINAL // VEHICLE_CF_CHASSIS
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 z-20 pointer-events-auto ${
          isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-950"
        }`}>
          <a href="#story" className="flex flex-col items-center gap-2 cursor-pointer select-none">
            <span>[ SCROLL TO EVOLUTION ]</span>
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-brand-neon" />
            </motion.div>
          </a>
        </div>
      </section>

      {/* 1.5. SECTION: CRAFT + TECHNOLOGY — Full-width statement with parallax images */}
      <section 
        ref={craftSectionRef}
        id="craft-technology" 
        className={`relative min-h-screen flex items-center justify-center overflow-hidden py-32 md:py-40 transition-colors duration-500 ${
          isDark ? "bg-[#0B0B0C]" : "bg-brand-light"
        }`}
      >


        {/* Background flowing curves — Light Mode (kept as-is) */}
        <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}>
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
        <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}>
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
        <div className={`absolute inset-0 pointer-events-none z-[2] transition-opacity duration-700 ${
          isDark ? "opacity-100" : "opacity-0"
        }`} style={{
          background: 'linear-gradient(to bottom, #0B0B0C 0%, transparent 25%, transparent 75%, #0B0B0C 100%)'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="relative">

            {/* Parallax Image — Top Left (Craft/Handwork) */}
            <motion.div 
              className="absolute -top-8 -left-4 md:left-0 w-[45%] max-w-[380px] aspect-[4/3] z-0 rounded-sm overflow-hidden"
              style={{ y: craftImgY, x: craftImgX }}
            >
              <Image 
                src={craftHandwork}
                alt="Carbon fiber handcraft layup"
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 ${isDark ? "bg-black/30" : "bg-black/10"}`} />
            </motion.div>

            {/* Parallax Image — Bottom Right (Technology/Laser) */}
            <motion.div 
              className="absolute -bottom-8 -right-4 md:right-0 w-[45%] max-w-[380px] aspect-[4/3] z-0 rounded-sm overflow-hidden"
              style={{ y: techImgY, x: techImgX }}
            >
              <Image 
                src={laserTech}
                alt="Laser cutting technology"
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 ${isDark ? "bg-black/30" : "bg-black/10"}`} />
            </motion.div>

            {/* Main Text Block — centered, overlaid on images */}
            <div className="relative text-center py-16 md:py-24 flex flex-col items-center">
              {/* First statement: bold condensed (font-sans) + DecryptedText */}
              <motion.h2 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight leading-[1.05] transition-colors duration-500 text-center max-w-4xl mix-blend-overlay ${
                  isDark ? "text-zinc-100" : "text-zinc-950"
                }`}
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
              </motion.h2>

              {/* Spacer */}
              <div className="h-12 md:h-16" />

              {/* Second statement: display font (DxBurst) + DecryptedText */}
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                className={`font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light uppercase tracking-tight leading-[1.05] transition-colors duration-500 text-center max-w-3xl ${
                  isDark ? "text-zinc-100" : "text-zinc-950"
                }`}
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
              </motion.p>

              {/* Spacer */}
              <div className="h-8 md:h-12" />

              {/* Keywords: bold condensed, accent color + DecryptedText */}
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tight leading-[1.05] text-brand-neon text-center mix-blend-overlay"
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
              </motion.p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION: SEAMLESS EVOLUTION SCROLLYTELLING (CAD -> Autoclave -> Finished Product) */}
      <section id="story" ref={scrollyRef} className="relative h-[300vh] transition-colors duration-500">
        
        {/* Sticky 100vh Viewport background elements */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          
          {/* Top seamless blending gradient overlay */}
          <div className={`absolute top-0 left-0 w-full h-64 pointer-events-none z-30 transition-colors duration-1000 ${
            isDark 
              ? "bg-gradient-to-b from-[#0B0B0C] via-[#0B0B0C]/60 to-transparent" 
              : "bg-gradient-to-b from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent"
          }`} />

          {/* User-provided aerodynamic/flow SVG curves in background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden ">
            <svg className={`w-full h-full opacity-[0.07] transition-colors duration-500 ${isDark ? "text-zinc-450 dark:text-zinc-400" : "text-zinc-650"}`} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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
          <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
            isDark ? "technical-grid technical-grid-fine" : "technical-grid-light technical-grid-fine-light"
          }`} />

          {/* Top HUD Telemetry bar */}
          <div className={`absolute top-20 left-0 w-full border-b font-mono text-[9px] py-2 px-6 flex justify-between items-center z-30 transition-colors duration-500 ${
            isDark ? "border-zinc-800 bg-brand-dark/40 text-zinc-400" : "border-zinc-200/60 bg-brand-light/40 text-zinc-500"
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-neon rounded-full inline-block animate-pulse"></span>
              <span>RENDER ENGINE: OPENGL_3D_COMPOSE</span>
            </div>
            <div className="flex items-center gap-6">
              <span>PROGRESS: {scrollProgressText}</span>
              <span>STATE: {
                activeStep === 0 ? "01_WIRE_BLUEPRINT" : activeStep === 1 ? "02_STRESS_AUTOCLAVE" : "03_FINISHED_COMPOSITE"
              }</span>
            </div>
          </div>

          {/* Vertical Scroll Progress Bar Indicator aligned left */}
          <div className={`absolute left-8 md:left-16 top-[25%] h-[50%] w-[2px] hidden lg:block transition-colors duration-500 z-30 ${
            isDark ? "bg-zinc-800" : "bg-zinc-200"
          }`}>
            <motion.div 
              style={{ height: heightProgressLine }}
              className="w-full bg-brand-neon shadow-[0_0_8px_#39FF14]"
            />
            
            {/* Anchor indicators */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 border transition-colors duration-500 ${
              activeStep === 0 ? "bg-brand-neon border-brand-neon animate-pulse" : isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"
            }`} />
            <div className={`absolute top-[50%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 border transition-colors duration-500 ${
              activeStep === 1 ? "bg-brand-neon border-brand-neon animate-pulse" : isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"
            }`} />
            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 border transition-colors duration-500 ${
              activeStep === 2 ? "bg-brand-neon border-brand-neon animate-pulse" : isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-white"
            }`} />
          </div>

          {/* Main Layout Area spanning max-w-7xl */}
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 h-full relative flex flex-col justify-between py-24 pointer-events-none">
            
            {/* TOP-LEFT AREA: HEADINGS (Animated sticky in place) */}
            <div className="relative w-full max-w-xl h-44 mt-8 pointer-events-none">
              
              {/* Step 1 Heading */}
              <motion.div 
                style={{ opacity: opacityText1, y: yText1 }} 
                className="absolute top-0 left-0 w-full flex flex-col items-start"
              >
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    isDark={isDark}
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className={`px-4 py-1.5 transition-colors duration-500 ${
                      isDark ? "text-brand-neon" : "text-zinc-800"
                    }`}>
                      HIGH PERFORMANCE
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className={`font-sans text-5xl sm:text-7xl font-light tracking-tight leading-[0.95] uppercase ${isDark ? "text-white" : "text-zinc-950"}`}>
                  From the<br />
                  <strong className="font-semibold block font-sans">initial idea</strong>
                </h2>
              </motion.div>

              {/* Step 2 Heading */}
              <motion.div 
                style={{ opacity: opacityText2, y: yText2 }} 
                className="absolute top-0 left-0 w-full flex flex-col items-start"
              >
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    isDark={isDark}
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className={`px-4 py-1.5 transition-colors duration-500 ${
                      isDark ? "text-brand-neon" : "text-zinc-800"
                    }`}>
                      THERMAL CURING
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className={`text-5xl sm:text-7xl tracking-tight leading-[0.95] uppercase transition-colors duration-500 ${isDark ? "text-white" : "text-zinc-950"}`}>
                  <span className="font-sans font-light block">High quality.</span>
                  <span className="font-sans font-bold block">High performance.</span>
                </h2>
              </motion.div>

              {/* Step 3 Heading */}
              <motion.div 
                style={{ opacity: opacityText3, y: yText3 }} 
                className="absolute top-0 left-0 w-full flex flex-col items-start"
              >
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    isDark={isDark}
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className={`px-4 py-1.5 transition-colors duration-500 ${
                      isDark ? "text-brand-neon" : "text-zinc-800"
                    }`}>
                      QA RELEASE
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className={`font-sans text-5xl sm:text-7xl font-light tracking-tight leading-[0.95] uppercase ${isDark ? "text-white" : "text-zinc-950"}`}>
                  To the<br />
                  <strong className="font-semibold block font-sans">finished component.</strong>
                </h2>
              </motion.div>

            </div>

            {/* FULL SCREEN BORDERLESS TRANSFERRING IMAGES (In centered position) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-5xl h-[55vh] lg:h-[65vh] flex items-center justify-center pointer-events-none z-0">
              <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                
                {/* CAD Blueprint Drawing - Fades in/out, cross-fades dark/light images */}
                <motion.div 
                  style={{ opacity: opacityBlueprint, scale: scaleBlueprint }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
                >
                  {/* Dark Mode Blueprint */}
                  <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isDark ? "opacity-100" : "opacity-0"}`}>
                    <Image 
                      src={story01Dark}
                      alt="CAD Drawing Dark"
                      fill
                      className="object-contain mix-blend-screen"
                      priority
                    />
                  </div>
                  {/* Light Mode Blueprint */}
                  <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ${!isDark ? "opacity-100" : "opacity-0"}`}>
                    <Image 
                      src={story01Light}
                      alt="CAD Drawing Light"
                      fill
                      className="object-contain mix-blend-multiply"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Autoclave Photo - Fades in/out */}
                <motion.div 
                  style={{ opacity: opacityAutoclave, scale: scaleAutoclave }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
                >
                  <Image 
                    src={story02}
                    alt="Composite Autoclave Curing Casing"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Finished Glossy Carbon Wing - Fades in/out */}
                <motion.div 
                  style={{ opacity: opacityFinished, scale: scaleFinished }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
                >
                  <Image 
                    src={story03}
                    alt="Finished Carbon Wing Aerodynamic Part"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Scanning HUD green horizontal line */}
                <div className="absolute left-0 top-[20%] w-full h-[1.5px] bg-brand-neon/30 shadow-[0_0_10px_#39FF14] animate-[bounce_8s_infinite_linear] z-20 pointer-events-none" />
              </div>
            </div>

            {/* BOTTOM-LEFT DESIGN ANCHOR BADGE */}
            <div className="absolute bottom-16 left-6 md:left-12 z-20 pointer-events-auto">
              <div className={`w-14 h-14 border rounded-sm flex items-center justify-center transition-all duration-500 ${
                isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200/80 bg-white/50"
              }`}>
                <svg className={`w-8 h-8 transition-colors duration-500 ${isDark ? "text-zinc-400" : "text-zinc-650"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 11V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7" />
                  <path d="M14 11V7.5a1.5 1.5 0 0 0-3 0V11" />
                  <path d="M14 11V9a1.5 1.5 0 0 1 3 0v2" />
                  <path d="M17 11V10a1.5 1.5 0 0 1 3 0v3.5a7.5 7.5 0 0 1-15 0V11" />
                </svg>
              </div>
            </div>

            {/* BOTTOM-RIGHT AREA: DESCRIPTION PARAGRAPHS (Animated sticky in place) */}
            <div className="absolute bottom-16 right-6 md:right-12 w-full max-w-md h-56 pointer-events-none flex flex-col justify-end">
              
              {/* Step 1 Description */}
              <motion.div 
                style={{ opacity: opacityText1, y: yText1 }} 
                className="absolute bottom-0 right-0 w-full flex flex-col items-end pointer-events-auto"
              >
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right">
                  Every racing component begins as a highly optimized CAD design. We run extensive Finite Element Analysis (FEA) to align carbon fiber weave orientations exactly with the load paths, maximizing rigidity while removing every unnecessary gram of material.
                </p>
              </motion.div>

              {/* Step 2 Description */}
              <motion.div 
                style={{ opacity: opacityText2, y: yText2 }} 
                className="absolute bottom-0 right-0 w-full flex flex-col items-end pointer-events-auto"
              >
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right">
                  Components are vacuum-bagged and cured inside high-pressure autoclaves. Using a meticulous ramp-up cycle up to 135°C under 6.0 Bar positive pressure, we guarantee zero voids, maximum laminate compaction, and complete resin impregnation.
                </p>
              </motion.div>

              {/* Step 3 Description + Spec Card */}
              <motion.div 
                style={{ opacity: opacityText3, y: yText3 }} 
                className="absolute bottom-0 right-0 w-full flex flex-col items-end pointer-events-auto"
              >
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right mb-4">
                  Our finished carbon fiber structures undergo strict quality assurance. Every component is ultrasonically scanned and CNC inspected, ensuring tolerance thresholds of less than 0.05 mm and absolute structural compliance.
                </p>
                
                <NotchedBorderGlow notchPosition="bottom-right" isDark={isDark} className="w-full max-w-sm shadow-sm pointer-events-auto">
                  <div className={`font-mono text-[9px] leading-normal ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    <div className={`text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 uppercase tracking-wider text-[10px] pb-1 border-b flex justify-between items-center ${
                      isDark ? "border-zinc-800" : "border-zinc-100"
                    }`}>
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
              </motion.div>

            </div>

          </div>

          {/* Bottom scrollytelling coordinate HUD indicators */}
          <div className={`absolute bottom-4 left-8 md:left-16 hidden lg:flex items-center gap-8 font-mono text-[9px] transition-colors duration-500 ${
            isDark ? "text-zinc-500" : "text-zinc-400"
          }`}>
            <span>AXIS_X: +1.28</span>
            <span>AXIS_Y: -0.49</span>
            <span>AXIS_Z: +0.00</span>
          </div>

        </div>
      </section>

      {/* 2.5. SECTION: MISSION (Interactive green handwriting animation under titles) */}
      <section id="mission" className={`relative min-h-screen py-32 flex flex-col justify-center border-b transition-colors duration-500 overflow-hidden ${
        isDark ? "border-zinc-800 bg-[#0B0B0C]" : "border-zinc-200/60 bg-brand-light"
      }`}>
        <TopoBackground opacityClass={isDark ? "opacity-[0.035]" : "opacity-[0.065]"} />
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          isDark ? "technical-grid technical-grid-fine" : "technical-grid-light technical-grid-fine-light"
        }`} />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="relative text-left max-w-5xl mx-auto w-full">
            <div className="relative inline-block w-full">
              {/* SVG background handwriting animation */}
              <div className="absolute inset-0 z-0 flex items-center justify-center -translate-y-6 md:-translate-y-12 scale-[1.43] md:scale-[1.69] pointer-events-none select-none">
                <HandwrittenMission />
              </div>
              
              {/* Foreground Titles - Univers for "High quality" and "High performance" */}
              <h2 
                className={`relative z-10 font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-none uppercase select-none whitespace-nowrap transition-colors duration-500 ${
                isDark ? "text-zinc-100" : "text-zinc-950"
              }`}>
                High quality.
              </h2>
              <h2 
                className={`relative z-10 font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none uppercase select-none whitespace-nowrap transition-colors duration-500 mt-2 ${
                isDark ? "text-zinc-100" : "text-zinc-950"
              }`}>
                High performance.
              </h2>
            </div>

            {/* Description text in the bottom right */}
            <div className="mt-16 flex justify-end w-full">
              <div className="max-w-md border-l border-brand-neon/30 pl-6">
                <span className={`text-[9px] font-mono tracking-widest block uppercase mb-2 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}>[ MISSION_MANIFESTO ]</span>
                <p className={`text-xs sm:text-sm leading-relaxed font-sans transition-colors duration-500 ${
                  isDark ? "text-zinc-400" : "text-zinc-650"
                }`}>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                  sed diam nonumy eirmod tempor invidunt ut labore et
                  dolore magna aliquyam erat, sed diam voluptua. At vero
                  eos et accusam et justo duo dolores et ea rebum.
                  Stet clita kasd gubergren, no sea
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical HUD details */}
        <div className={`absolute bottom-4 left-8 md:left-16 hidden lg:flex items-center gap-8 font-mono text-[9px] transition-colors duration-500 ${
          isDark ? "text-zinc-500" : "text-zinc-400"
        }`}>
          <span>MISSION: COMPOSITE_EXCELLENCE</span>
          <span>BRUSH_ID: #39FF14_ACTIVE</span>
        </div>
      </section>

      {/* 3. SECTION: HORIZONTAL SCROLL TIMELINE (2016-2026) */}
      <HorizontalTimeline isDark={isDark} />

      {/* 4. SECTION: TECHNICAL DATASHEET GRID (BorderGlow Cards) */}
      <section id="datasheet" className="relative py-24 px-6 overflow-hidden">
        <TopoBackground opacityClass={isDark ? "opacity-[0.035]" : "opacity-[0.065]"} />
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          isDark ? "technical-grid technical-grid-fine" : "technical-grid-light technical-grid-fine-light"
        }`} />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="mb-16 w-full font-mono border-l-2 border-brand-neon pl-4">
            <span className={`text-xs tracking-widest font-semibold block uppercase transition-colors duration-500 ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}>[ EXPERTISE & CRAFTSMANSHIP ]</span>
            <h2 className={`font-sans text-4xl sm:text-5xl font-light uppercase tracking-tight ${
              isDark ? "text-white" : "text-zinc-950"
            }`}>
              MEET THE <span className="font-bold">EXPERTS</span>
            </h2>
          </div>

          {/* 3 Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <ProfileCard
              name="Ralf Schuster"
              title="Management / Project Management"
              handle="ralf@braeutigam-gmbh.eu"
              status="07141/2996-701"
              avatarUrl=""
              isDark={isDark}
            />
            <ProfileCard
              name="Heiko Euteneuer"
              title="Head of Design & Quality Management"
              handle="heiko@braeutigam-gmbh.eu"
              status="07141/2996-702"
              avatarUrl=""
              isDark={isDark}
            />
            <ProfileCard
              name="Hans Braun"
              title="Project Management / Production Planning"
              handle="hans@braeutigam-gmbh.eu"
              status="07141/2996-708"
              avatarUrl=""
              isDark={isDark}
            />
          </div>

          {/* Button to Team Page */}
          <div className="mt-20 text-center">
            <button className={`px-10 py-5 border font-sans font-bold uppercase tracking-wider transition-all duration-300 ${
              isDark
                ? "border-brand-neon text-brand-neon hover:bg-brand-neon hover:text-black"
                : "border-black text-black hover:bg-black hover:text-white"
            }`}>
              Check Team BRÄUTIGAM
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER — Dark card design per reference */}
      <footer className={`relative pt-16 pb-10 px-4 sm:px-6 transition-colors duration-500 ${
        isDark ? "bg-[#0B0B0C]" : "bg-brand-light"
      }`}>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Main dark card with notched corners */}
          <NotchedBorderGlow
            notchPosition="slanted"
            isDark={true}
            active={true}
            noPadding={true}
            borderRadius={16}
            notchSize={40}
            className="w-full"
          >
            <div className="w-full py-14 px-8 sm:px-12 lg:px-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center">

                {/* Left Column — Site Navigation Links */}
                <nav className="flex flex-col gap-2 text-left">
                  {[
                    { label: "HOME", href: "#silhouette" },
                    { label: "LEISTUNGEN", href: "#story" },
                    { label: "BAUTEILE", href: "#datasheet" },
                    { label: "KARRIERE", href: "#" },
                    { label: "TEAM", href: "#" }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-zinc-300 hover:text-brand-neon transition-colors duration-200 leading-tight"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Center Column — Branding Block */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-zinc-100 leading-none">
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
                      className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-zinc-300 hover:text-brand-neon transition-colors duration-200 leading-tight"
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
            <div className={`flex items-center gap-4 font-sans text-sm sm:text-base font-bold uppercase tracking-wider ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}>
              <a href="#" className="hover:text-brand-neon transition-colors duration-200">IMPRESSUM</a>
              <span className="text-brand-neon text-lg">•</span>
              <a href="#" className="hover:text-brand-neon transition-colors duration-200">DATENSCHUTZ</a>
            </div>
            <span className={`font-mono text-[10px] tracking-widest uppercase ${
              isDark ? "text-zinc-500" : "text-zinc-500"
            }`}>
              BUILD WITH &lt;3 BY WIDE
            </span>
          </div>

        </div>
      </footer>

      {/* Sliding Navigation Menu Overlay */}
      <StaggeredMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        isDark={isDark} 
        toggleTheme={toggleTheme}
      />
    </div>
  );
}
