"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, useScroll, useTransform, useSpring } from "framer-motion";
import NotchedBorderGlow from "./NotchedBorderGlow";
import TrackScrollMap from "./TrackScrollMap";
import ScrollTelemetry from "./ScrollTelemetry";
import LazyOnVisible from "./LazyOnVisible";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteHero from "./SiteHero";
import ManifestBlock from "./ManifestBlock";
import SiteButton from "./SiteButton";

/* Heavier below-fold widgets load only when LazyOnVisible says they are near
   the viewport. */
const loadTimeline = () => import("./HorizontalTimeline");
const loadExpertCard = () => import("./ExpertCard");
const loadTopography = () => import("./Topography");
const loadCircularGallery = () => import("./CircularGallery");
import story01Dark from "../../public/images/Part_01_darkmode.webp";
import story01Light from "../../public/images/Part_01.webp";
import story02 from "../../public/images/Part_02.webp";
import story03 from "../../public/images/Part_03.webp";
import laserTech from "../../public/images/laser_technology.webp";
import "./CadTopographyPoster.css";

const STORY_COPY =
  "Our finished carbon fiber structures undergo strict quality assurance. Every component is ultrasonically scanned and CNC inspected, ensuring tolerance thresholds of less than 0.05mm and absolute structural compliance.";

function SpecCard({
  badge,
  part,
  voids,
  tolerance,
}: {
  badge: string;
  part: string;
  voids: string;
  tolerance: string;
}) {
  return (
    <NotchedBorderGlow notchPosition="bottom-right" className="w-full max-w-sm shadow-sm pointer-events-auto">
      <div className="font-mono text-[9px] leading-normal text-zinc-700 dark:text-zinc-300">
        <div className="text-zinc-900 dark:text-zinc-100 font-bold mb-1.5 uppercase tracking-wider text-[10px] pb-1 border-b flex justify-between items-center border-zinc-100 dark:border-zinc-800">
          <span>// COMPOSITE_SPEC</span>
          <span className="text-[8px] text-brand-neon font-bold">{badge}</span>
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between gap-4">
            <span className="font-bold uppercase text-zinc-400">PART:</span>
            <span className="text-right">{part}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-bold uppercase text-zinc-400">WEAVE:</span>
            <span className="text-right">2X2 TWILL PREPREG</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-bold uppercase text-zinc-400">VOIDS:</span>
            <span className="text-right">{voids}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-bold uppercase text-zinc-400">TOLERANCE</span>
            <span className="text-right">{tolerance}</span>
          </div>
        </div>
      </div>
    </NotchedBorderGlow>
  );
}

const EXPERTS = [
  {
    name: "Manuel Wezel",
    title: "Managing Director",
    email: "manuel@braeutigam-gmbh.eu",
    phone: "07141/2996-706",
    avatarUrl: "/images/experts/manuel-wezel.webp",
    memberId: "#706-MW",
  },
  {
    name: "Ralf Schuster",
    title: "Management / Project Management",
    email: "ralf@braeutigam-gmbh.eu",
    phone: "07141/2996-701",
    avatarUrl: "/images/experts/ralf-schuster.webp",
    memberId: "#701-RS",
  },
  {
    name: "Heiko Euteneuer",
    title: "Head of Design & Quality Management",
    email: "heiko@braeutigam-gmbh.eu",
    phone: "07141/2996-702",
    avatarUrl: "/images/experts/heiko-euteneuer.webp",
    memberId: "#702-HE",
  },
  {
    name: "Igor Stach",
    title: "Head of CNC Department",
    email: "igor@braeutigam-gmbh.eu",
    phone: "07141/2996-712",
    avatarUrl: "/images/experts/igor-stach.webp",
    memberId: "#712-IS",
  },
  {
    name: "Hans Braun",
    title: "Project Management / Production Planning",
    email: "hans@braeutigam-gmbh.eu",
    phone: "07141/2996-708",
    avatarUrl: "/images/experts/hans-braun.webp",
    memberId: "#708-HB",
  },
  {
    name: "Christian Grunert",
    title: "Head of Prepreg Department",
    email: "christian@braeutigam-gmbh.eu",
    phone: "07141/2996-711",
    avatarUrl: "/images/experts/christian-grunert.webp",
    memberId: "#711-CG",
  },
  {
    name: "Boris Sidji",
    title: "Work Preparation Assembly",
    email: "boris@braeutigam-gmbh.eu",
    phone: "07141/2996-715",
    avatarUrl: "/images/experts/boris-sidji.webp",
    memberId: "#715-BS",
  },
  {
    name: "Tim Schäfer",
    title: "Head of Assembly Department",
    email: "tim@braeutigam-gmbh.eu",
    phone: "07141/2996-700",
    avatarUrl: "/images/experts/tim-schaefer.webp",
    memberId: "#700-TS",
  },
  {
    name: "Christian Zinth",
    title: "Quality Management",
    email: "christian.zinth@braeutigam-gmbh.eu",
    phone: "07141/2996-709",
    avatarUrl: "/images/experts/christian-zinth.webp",
    memberId: "#709-CZ",
  },
  {
    name: "Jonas Boxhorn",
    title: "Quality Management",
    email: "jonas@braeutigam-gmbh.eu",
    phone: "07141/2996-709",
    avatarUrl: "/images/experts/jonas-boxhorn.webp",
    memberId: "#709-JB",
  },
  {
    name: "Samuel Schmidt",
    title: "Quality Management",
    email: "samuel@braeutigam-gmbh.eu",
    phone: "07141/2996-709",
    avatarUrl: "/images/experts/samuel-schmidt.webp",
    memberId: "#709-SS",
  },
  {
    name: "Stephan Steiner",
    title: "Technical Purchasing",
    email: "stephan@braeutigam-gmbh.eu",
    phone: "07141/2996-701",
    avatarUrl: "/images/experts/stephan-steiner.webp",
    memberId: "#701-SS",
  },
  {
    name: "Francesco Di Costanzo",
    title: "Administration",
    email: "francesco@braeutigam-gmbh.eu",
    phone: "07141/2996-700",
    avatarUrl: "/images/experts/francesco-di-costanzo.webp",
    memberId: "#700-FD",
  },
  {
    name: "Kurt Lander",
    title: "Head of Warehouse & Logistics",
    email: "kurt@braeutigam-gmbh.eu",
    phone: "07141/2996-714",
    avatarUrl: "/images/experts/kurt-lander.webp",
    memberId: "#714-KL",
  },
] as const;
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

function ExpertSlot({
  expert,
  delay,
}: {
  expert: (typeof EXPERTS)[number];
  delay?: string;
}) {
  return (
    <LazyOnVisible
      loader={loadExpertCard}
      rootMargin="100px"
      className="experts-figma__card"
      style={{ width: "100%", aspectRatio: "403 / 522", transitionDelay: delay }}
      componentProps={{ ...expert }}
    />
  );
}

export default function HomePage() {
  const [showAllExperts, setShowAllExperts] = useState(false);
  // Parallax layers refs
  const backgroundRef = useRef<HTMLDivElement>(null);
  const midgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

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

      {/* 1. HERO / LANDING SECTION — shared with /karriere */}
      <SiteHero scrollTarget="#story" />


      <ManifestBlock />

      {/* 2. SECTION: SEAMLESS EVOLUTION SCROLLYTELLING (CAD -> Autoclave -> Finished Product) */}
      <section id="story" ref={scrollyRef} className="cv-auto relative h-[300vh]">
        
        {/* Sticky 100vh Viewport background elements */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
          
          {/* Top and bottom blends into the page color, same falloff */}
          <div className="absolute top-0 left-0 w-full h-64 pointer-events-none z-30 transition-colors duration-1000 bg-gradient-to-b from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent dark:bg-gradient-to-b dark:from-[#0B0B0C] dark:via-[#0B0B0C]/60 dark:to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-64 pointer-events-none z-30 transition-colors duration-1000 bg-gradient-to-t from-[#F9F9FB] via-[#F9F9FB]/60 to-transparent dark:bg-gradient-to-t dark:from-[#0B0B0C] dark:via-[#0B0B0C]/60 dark:to-transparent" />

          {/* CAD Topography — Figma field behind all three story steps */}
          <div className="cad-topo-stage absolute inset-0" aria-hidden>
            <div className="cad-topo-poster" />
            <LazyOnVisible
              loader={loadTopography}
              rootMargin="200px"
              className="absolute inset-0"
              componentProps={{
                lowColor: "#003300",
                midColor: "#008000",
                highColor: "#33FF33",
                speed: 0.35,
                morphAmount: 3,
                morphSpeed: 0.02,
                bands: 3,
                thickness: 0.01,
                scale: 2,
                pixelSize: 1,
                glow: 0.5,
                colorMode: "elevation",
                contrast: 3,
                brightness: 0.35,
                fillBands: true,
                opacity: 1,
                grain: true,
                grainIntensity: 0.05,
                mouseInteraction: true,
                mouseRadius: 0.3,
                mouseStrength: 0.4,
              }}
            />
          </div>

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
            
            {/* TOP-LEFT AREA: headline stays put across all three CAD frames */}
            <div className="relative w-full max-w-xl mt-8 pointer-events-none">
              <div className="flex flex-col items-start">
                <div className="flex mb-4">
                  <NotchedBorderGlow
                    notchPosition="slanted"
                    active={true}
                    noPadding={true}
                    className="font-mono text-[9px] font-bold tracking-widest uppercase select-none pointer-events-auto"
                  >
                    <div className="px-4 py-1.5 transition-colors duration-500 text-zinc-800 dark:text-brand-neon">
                      HIGH PERFORMANCE
                    </div>
                  </NotchedBorderGlow>
                </div>
                <h2 className="font-sans text-5xl sm:text-7xl font-light tracking-tight leading-[0.95] uppercase text-zinc-950 dark:text-white">
                  To the finished
                  <strong className="font-semibold block font-sans">component.</strong>
                </h2>
              </div>
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
            <div className="absolute bottom-12 left-6 md:left-12 z-40 pointer-events-auto">
              <TrackScrollMap progress={smoothScrollProgress} />
            </div>

            {/* BOTTOM-RIGHT AREA: DESCRIPTION PARAGRAPHS (Animated sticky in place) */}
            <div className="absolute bottom-16 right-6 md:right-12 z-40 w-full max-w-md pointer-events-none flex flex-col items-end">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans max-w-sm text-right mb-4 pointer-events-auto">
                {STORY_COPY}
              </p>
              <div className="grid w-full max-w-sm">
                <m.div style={{ opacity: opacitySpecEarly }} className="col-start-1 row-start-1">
                  <SpecCard
                    badge="[CERTIFIED]"
                    part="CFRP REAR WING"
                    voids="< 0.05% [SCAN NOMINAL]"
                    tolerance="< 0.05 mm [QC PASS]"
                  />
                </m.div>
                <m.div style={{ opacity: opacitySpecLate }} className="col-start-1 row-start-1">
                  <SpecCard
                    badge="[QC CERTIFIED]"
                    part="VEHICLE_BR_CHASSIS"
                    voids="< 0.05 %"
                    tolerance="< 0.05 mm"
                  />
                </m.div>
              </div>
            </div>

          </div>

          {/* Bottom scrollytelling coordinate HUD indicators */}
          <div className="absolute bottom-4 left-8 md:left-16 z-40 hidden lg:flex items-center gap-8 font-mono text-[9px] transition-colors duration-500 text-zinc-400 dark:text-zinc-500">
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
              <img src="/images/mission/chip-experts.svg" alt="" width={50} height={47} />
              <span className="mission-figma__chip-label">
                <span>End 2 end</span>
                <span>Experts</span>
              </span>
            </div>
            <div className="mission-figma__chip">
              <img src="/images/mission/chip-craft.svg" alt="" width={50} height={50} />
              <span className="mission-figma__chip-label">
                <span>Precision</span>
                <span>Craft</span>
              </span>
            </div>
            <div className="mission-figma__chip">
              <img src="/images/mission/chip-execution.svg" alt="" width={50} height={50} />
              <span className="mission-figma__chip-label">
                <span>Flawless</span>
                <span>Execution</span>
              </span>
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
              <SiteButton href="#story">MANUFACTURING</SiteButton>
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
              ALL EXPERTS
            </SiteButton>
          </div>
        </div>
      </section>

      {/* 5. SECTION: SOCIAL — Circular gallery, Figma 1154:1338 */}
      <section id="social" className="social-section cv-auto relative overflow-hidden">
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
        <div className="social-section__copy">
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

      {/* FOOTER — Figma 1154:1356 (Oswald + frame notches) + LineWaves */}
      <SiteFooter />
    </div>
    </LazyMotion>
  );
}
