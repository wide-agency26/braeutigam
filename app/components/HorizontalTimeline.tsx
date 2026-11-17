"use client";

/** TODO(client): confirm F1 supply timeline copy before enabling. */
const SHOW_F1_CLAIM = false;

import React, { useRef, useCallback, useEffect, useLayoutEffect, useState, CSSProperties } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useMotionValueEvent, useSpring, useReducedMotion } from "framer-motion";
import SiteButton from "./SiteButton";
import "./HorizontalTimeline.css";

const BOARD_W = 12352;
const BOARD_H = 1080;
const HOLD = 0.08;
const LAST_PANEL_W = 3096;
const TICK_YEARS = ["2016", "2017", "2019", "2020", "2021", "2022", "2024", "2026"];
const REDUCED_JOURNEY = [
  ["2016", "Founded"],
  ["2017", "Entry into Formula 1"],
  ["2019", "More space"],
  ["2020", "Monocoque construction"],
  ["2021", "Development and manufacturing"],
  ["2022", "Growth and recognition"],
  ["2024", "Powered by Brabus"],
  ["2026", "80+ experts"],
] as const;

function box(left: number, top: number, width: number, height: number, extra?: CSSProperties): CSSProperties {
  return { position: "absolute", left, top, width, height, ...extra };
}

function Photo({
  src,
  alt,
  left,
  top,
  width,
  height,
  contain,
  plain,
  dim,
  crop,
  className = "",
  zIndex,
}: {
  src: string;
  alt: string;
  left: number;
  top: number;
  width: number;
  height: number;
  contain?: boolean;
  plain?: boolean;
  dim?: boolean;
  crop?: CSSProperties;
  className?: string;
  zIndex?: number;
}) {
  return (
    <div
      className={`tl-photo ${contain ? "tl-photo--contain" : ""} ${plain ? "tl-photo--plain" : ""} ${dim ? "tl-photo--dim" : ""} ${className}`}
      style={box(left, top, width, height, zIndex != null ? { zIndex } : undefined)}
    >
      {crop ? (
        <span className="tl-photo__crop" style={crop}>
          <Image src={src} alt={alt} fill sizes={`${Math.round(width)}px`} style={{ zIndex: 0 }} />
        </span>
      ) : (
        <Image src={src} alt={alt} fill sizes={`${Math.round(width)}px`} style={{ zIndex: 0 }} />
      )}
    </div>
  );
}

function PillIcon({ kind }: { kind: "speed" | "inhouse" | "complexity" }) {
  // Figma vector export; no raster optimization needed.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/figma/core-${kind}.svg`} alt="" width={50} height={50} />;
}

function Board() {
  return (
    <div className="tl-board">
      {/* 2016 / 2017 — Figma Year Container 2880×1080 (screenshot 1024×384) */}
      <section className="tl-panel tl-panel--2016">
        <Photo src="/images/timeline/figma/2016-hero.webp" alt="Carbon component branded Bräutigam Carbon Fiber Works" left={774} top={66} width={692} height={692} dim crop={{ width: "100%", height: "177.47%", left: "0%", top: "0%" }} />
        <Photo src="/images/timeline/figma/2016-thumb-1.webp" alt="Carbon fiber weave with a recessed inset" left={1654} top={66} width={345} height={345} dim />
        <Photo src="/images/timeline/figma/2016-thumb-2.webp" alt="Hand sanding a carbon fiber surface" left={1654} top={443} width={345} height={345} dim crop={{ width: "177.78%", height: "100%", left: "-63.35%", top: "0%" }} />
        <Photo src="/images/timeline/figma/2016-thumb-3.webp" alt="Gloved hands finishing a composite part" left={1654} top={820} width={345} height={345} dim />
        <div className="tl-copy" style={box(66, 307, 550, 586.5, { gap: 32, zIndex: 12 })}>
          <p className="tl-y-xl">2016</p>
          <h3 className="tl-h-founded">FOUNDED</h3>
          <div className="tl-gap">
            <p className="tl-meta">PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS</p>
            <p className="tl-body">
              BRÄUTIGAM started with three specialists and one clear vision: engineering high-performance carbon components for clients with uncompromising ambitions.
            </p>
          </div>
        </div>
        <div className="tl-pill" style={box(773.5, 917.75, 250, 88)}>
          <PillIcon kind="speed" />
          SPEED
        </div>
        <div className="tl-copy" style={box(2188.5, 186.5, 691.5, 466, { justifyContent: "space-between", gap: 20 })}>
          <h3 className="tl-h-f1">
            ENTRY INTO
            <strong>FORMULA 1</strong>
          </h3>
          <div className="tl-gap" style={{ maxWidth: 500 }}>
            <p className="tl-meta">
              {SHOW_F1_CLAIM ? "SUPPLYING THE F1" : "MOTORSPORT PROGRAMS"}
            </p>
            <p className="tl-body">
              {SHOW_F1_CLAIM
                ? "We entered the Formula 1 within one year of founding. Delivering highly complex carbon-fiber parts for multiple teams."
                : "Within the first years we moved from prototype work into demanding motorsport and performance programs — complex carbon parts, tight timelines."}
            </p>
          </div>
          <p className="tl-y-sm" style={{ textAlign: "left" }}>2017</p>
        </div>
        <div className="tl-ruler-wrap" style={box(2188.5, 940, 691.5, 74)}>
          <p className="tl-ruler-label">
            **COMPOSITE COMPONENT DEVELOPMENT INSIGHT**
            <br />
            PROJECT: AERO_HYPERCAR_v2.2
          </p>
          <div className="tl-ruler" aria-hidden />
        </div>
      </section>

      {/* 2019 — Figma 2500×1080; hall and autoclave sit apart, no overlap */}
      <section className="tl-panel tl-panel--2019">
        <p className="tl-grow" style={box(566, 66, 1408, 464)} aria-hidden>
          WE ARE
          <br />
          GROWING.
        </p>
        <Photo src="/images/timeline/figma/2019-hall.webp" alt="Production hall with autoclaves" left={566} top={307} width={800} height={533} />
        <Photo src="/images/timeline/figma/2019-autoclave.webp" alt="Open autoclave chamber" left={1570.5} top={427.5} width={900} height={700} />
        <p className="tl-meta" style={box(566, 1004, 800, 10)}>
          THREE AUTOCLAVES
        </p>
        <p className="tl-meta" style={box(566, 950, 174, 64, { zIndex: 12 })}>
          AUTOCLAVE INFORMATION:
          <br />
          AMOUNT: 3
          <br />
          MAX TEMP:
          <br />
          MAX PRESSURE:
        </p>
        <div className="tl-copy" style={box(0, 186.5, 550, 586.5, { gap: 32, zIndex: 12 })}>
          <p className="tl-y-xl">2019</p>
          <div className="tl-head-stack">
            <h3 className="tl-h-light">WE NEED</h3>
            <h3 className="tl-h-bold">MORE SPACE.</h3>
          </div>
          <div className="tl-gap">
            <p className="tl-meta">PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS</p>
            <p className="tl-body">
              Expanding space, advancing tech. We scaled our footprint and upgraded our facility with three high-capacity autoclaves to match the highest industry standards.
            </p>
          </div>
        </div>
        <div className="tl-pill" style={box(1541, 74.25, 250, 88)}>
          <PillIcon kind="inhouse" />
          INHOUSE
        </div>
      </section>

      {/* Gallery — Figma 600×1080 column */}
      <section className="tl-panel tl-panel--gallery" aria-hidden>
        <div className="tl-gallery-col">
          {[
            "/images/timeline/figma/gallery-1.webp",
            "/images/timeline/figma/gallery-2.webp",
            "/images/timeline/figma/gallery-3.webp",
            "/images/timeline/figma/gallery-4.webp",
            "/images/timeline/figma/gallery-5.webp",
          ].map((src) => (
            <div key={src} className="tl-photo tl-photo--dim" style={{ position: "relative", width: 337.58, height: 225, flexShrink: 0 }}>
              <Image src={src} alt="" fill sizes="338px" />
            </div>
          ))}
        </div>
      </section>

      {/* 2020–23 — Figma Year Container 3276×1080 (screenshot 1024×337) */}
      <section className="tl-panel tl-panel--2020">
        <p className="tl-meta" style={box(132, 66, 174, 64, { zIndex: 12 })}>
          AUTOCLAVE INFORMATION:
          <br />
          AMOUNT: 3
          <br />
          MAX TEMP:
          <br />
          MAX PRESSURE:
        </p>
        <div className="tl-copy" style={box(132, 217.43, 774, 661.14, { gap: 32 })}>
          <p className="tl-y-xl">2020</p>
          <div className="tl-head-stack">
            <h3 className="tl-h-light">MONOCOCQUE</h3>
            <h3 className="tl-h-bold">CONSTRUCTION</h3>
          </div>
          <div className="tl-gap">
            <p className="tl-meta">STRUCTURAL CARBON RESTORATION AT ITS HIGHEST LEVEL.</p>
            <p className="tl-body">
              Complete structural monocoque repair and carbon restoration on a crashed Porsche Carrera GT. Just one saved legend and merely a fraction of what leaves our facility.
            </p>
          </div>
        </div>
        <div className="tl-pill" style={box(173.25, 910.29, 250, 88)}>
          <PillIcon kind="complexity" />
          COMPLEXITY
        </div>
        <div className="tl-copy" style={box(922, 66, 774, 406.29, { gap: 36, padding: "28px 0" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: 10 }}>
            <div className="tl-head-stack">
              <h3 className="tl-h-light">DEVELOPMENT &amp;</h3>
              <h3 className="tl-h-bold">MANUFACTURING</h3>
            </div>
            <p className="tl-y-sm">2021</p>
          </div>
          <div className="tl-gap">
            <p className="tl-meta">BUILT TO HANDLE RAW POWER.</p>
            <p className="tl-body">
              We engineered and manufactured a high-modulus carbon torque tube for an ultra-exclusive hypercar built for maximum torsional rigidity and absolute weight reduction under extreme loads.
            </p>
          </div>
        </div>
        <Photo src="/images/timeline/figma/2021-shop.webp" alt="Technicians working a carbon component" left={922} top={488} width={774} height={800} />
        <Photo src="/images/timeline/figma/2016-thumb-1.webp" alt="Carbon weave detail" left={1927} top={66} width={345} height={345} dim />
        <Photo src="/images/timeline/figma/2016-thumb-2.webp" alt="Precision finishing" left={1927} top={443} width={345} height={345} dim crop={{ width: "177.78%", height: "100%", left: "-63.35%", top: "0%" }} />
        <Photo src="/images/timeline/figma/2016-thumb-3.webp" alt="Hand finishing a composite part" left={1927} top={820} width={345} height={345} dim />
        <div className="tl-copy" style={box(2502, 217.43, 774, 254.86, { padding: "28px 0", gap: 36 })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: 32 }}>
            <h3 className="tl-h-award">
              GROWTH CHAMPION
              <br />
              AWARD
            </h3>
            <div>
              <p className="tl-y-sm">2022</p>
              <p className="tl-y-sm">2023</p>
            </div>
          </div>
        </div>
        <Photo src="/images/timeline/figma/2022-award.webp" alt="Wachstums-Champion 2022" left={2574} top={643.71} width={250} height={254.86} contain plain />
        <Photo src="/images/timeline/figma/2023-award.webp" alt="Wachstums-Champion 2023" left={2954} top={643.71} width={250} height={254.86} contain plain />
      </section>

      {/* 2024–26 — Figma Year Container 3096×1080 */}
      <section className="tl-panel tl-panel--2024">
        <p className="tl-y-sm" style={box(1197, 66, 135, 84, { zIndex: 12, textAlign: "right" })}>
          2024
        </p>
        <Photo src="/images/timeline/figma/2024-brabus.webp" alt="Work on a Brabus grille" left={741} top={174} width={591} height={394} dim />
        <div className="tl-copy" style={box(132, 669, 774, 346, { gap: 32 })}>
          <div className="tl-head-stack" style={{ padding: "8px 0" }}>
            <h3 className="tl-h-light">POWERED BY</h3>
            <h3 className="tl-h-bold">BRABUS</h3>
          </div>
          <div className="tl-gap">
            <p className="tl-meta">TWO POWERHOUSES, ONE VISION.</p>
            <p className="tl-body">
              A strategic milestone in high-performance engineering: Bräutigam GmbH officially becomes part of the BRABUS Group—combining advanced composite expertise with the global pinnacle of luxury automotive performance.
            </p>
          </div>
        </div>
        <div className="tl-copy" style={box(1514, 187, 962, 466, { gap: 36, padding: "8px 0" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: 20 }}>
            <div className="tl-head-stack" style={{ gap: 20, flex: "1 1 auto", minWidth: 0 }}>
              <h3 className="tl-h-light">80+ EXPERTS</h3>
              <h3 className="tl-h-bold" style={{ whiteSpace: "nowrap" }}>
                1 UNSTOPPABLE VISION
              </h3>
            </div>
            <div>
              <p className="tl-y-sm">2025</p>
              <p className="tl-y-sm">2026</p>
            </div>
          </div>
          <div className="tl-gap">
            <p className="tl-meta">BUILT TO HANDLE RAW POWER.</p>
            <p className="tl-body">
              From three visionaries to 80+ high-performance composite specialists. As our capabilities expand, our drive remains the same: pushing the limits of what’s engineered in carbon.
            </p>
          </div>
        </div>
        <div className="tl-copy" style={box(2003, 722, 481, 239, { gap: 12 })}>
          <div className="tl-head-stack" style={{ gap: 20 }}>
            <h3 className="tl-h-light">JOIN OUR</h3>
            <h3 className="tl-h-bold">TEAM</h3>
          </div>
          <SiteButton href="/karriere">SEE OPEN POSITIONS</SiteButton>
        </div>
        <Photo src="/images/timeline/figma/join-team.webp" alt="The Bräutigam team outside the workshop" left={2484} top={666} width={481} height={350} />
      </section>
    </div>
  );
}

export default function HorizontalTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<(HTMLElement | null)[]>([]);
  const pctRefs = useRef<(HTMLElement | null)[]>([]);
  const segRef = useRef<HTMLSpanElement>(null);
  const [travel, setTravel] = useState(0);
  const [scale, setScale] = useState(1);
  const [padLeft, setPadLeft] = useState(32);
  const [offsetY, setOffsetY] = useState(0);
  const [hostW, setHostW] = useState(BOARD_W);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: pageProgress } = useScroll();

  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const height = host.clientHeight || BOARD_H;
    const nextScale = height / BOARD_H;
    const nextPad = Math.max(48, Math.min(window.innerWidth * 0.04, 80));
    setScale(nextScale);
    setPadLeft(nextPad);
    setOffsetY(0);
    const padRight = nextPad;
    const visualW = nextPad + BOARD_W * nextScale + padRight;
    setHostW(visualW);
    const visibleDesign = Math.max(0, (window.innerWidth - nextPad * 2) / nextScale);
    const lastStart = (BOARD_W - Math.min(LAST_PANEL_W, visibleDesign)) * nextScale;
    setTravel(-Math.max(0, lastStart));
  }, []);

  useLayoutEffect(() => {
    measure();
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const reduceMotion = useReducedMotion();
  const x = useTransform(scrollYProgress, [0, HOLD, 1], [0, 0, travel]);
  const smoothPageProgress = useSpring(pageProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.0004,
    skipInitialAnimation: true,
  });

  const paintYears = useCallback((latest: number) => {
    const scrub = latest <= HOLD ? 0 : (latest - HOLD) / (1 - HOLD);
    const index = Math.min(Math.floor(scrub * TICK_YEARS.length), TICK_YEARS.length - 1);
    const year = TICK_YEARS[index];

    for (const el of yearRefs.current) if (el) el.textContent = year;
    if (segRef.current) {
      segRef.current.textContent = `// SEG_${String(index + 1).padStart(2, "0")}`;
    }
  }, []);

  const paintPct = useCallback((latest: number) => {
    const pct = Math.min(Math.max(Math.round(latest * 100), 0), 100);
    for (const el of pctRefs.current) if (el) el.textContent = `${pct}%`;
  }, []);

  useMotionValueEvent(scrollYProgress, "change", paintYears);

  useMotionValueEvent(pageProgress, "change", (latest) => {
    if (reduceMotion) paintPct(latest);
  });

  useMotionValueEvent(smoothPageProgress, "change", (latest) => {
    if (!reduceMotion) paintPct(latest);
  });

  useEffect(() => {
    paintYears(scrollYProgress.get());
    paintPct((reduceMotion ? pageProgress : smoothPageProgress).get());
  }, [paintYears, paintPct, reduceMotion, scrollYProgress, pageProgress, smoothPageProgress]);

  const progressWidth = useTransform(scrollYProgress, [HOLD, 1], ["0%", "100%"]);

  const handleSkip = useCallback(() => {
    if (sectionRef.current) {
      const sectionBottom = window.scrollY + sectionRef.current.getBoundingClientRect().bottom;
      window.scrollTo({
        top: sectionBottom - window.innerHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <section className="journey-intro" aria-labelledby="journey-heading">
        <div className="journey-intro__copy">
          <p className="journey-intro__kicker">{`/*= CORPORATE EVOLUTION =*/`}</p>
          <dl className="journey-intro__hud">
            <div className="journey-intro__row">
              <dt>YEARS ACTIVE:</dt>
              <dd className="journey-intro__value">10</dd>
            </div>
            <div className="journey-intro__row">
              <dt>TEAM SIZE:</dt>
              <dd className="journey-intro__value">80+</dd>
            </div>
            <div className="journey-intro__row">
              <dt>SCROLL STATE:</dt>
              <dd
                ref={(el) => {
                  pctRefs.current[0] = el;
                }}
                className="journey-intro__value"
              >
                0%
              </dd>
            </div>
          </dl>
          <h2 id="journey-heading" className="journey-intro__title">
            <span>OUR JOURNEY</span>
            <span>&amp; HISTORY</span>
          </h2>
        </div>
        <div className="journey-intro__watermark" aria-hidden>
          <p>CARBON</p>
          <p>FIBER</p>
          <p>WORKS</p>
        </div>
      </section>

      {reduceMotion ? (
        <section className="site-container py-16" aria-label="Unternehmensgeschichte">
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {REDUCED_JOURNEY.map(([year, title]) => (
              <li key={year} className="border-t border-zinc-300 py-5 dark:border-zinc-700">
                <p className="font-mono text-sm font-bold text-brand-neon">{year}</p>
                <h3 className="mt-2 font-sans text-xl uppercase text-zinc-950 dark:text-zinc-100">{title}</h3>
              </li>
            ))}
          </ol>
        </section>
      ) : (
      <section ref={sectionRef} className="relative" style={{ height: "1100vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <m.div
            className="tl-strip absolute left-0"
            style={{ x, top: "56px", bottom: "90px" }}
          >
            <div
              ref={hostRef}
              className="tl-scale-host"
              style={{ width: hostW }}
            >
              <div
                style={{
                  position: "absolute",
                  left: padLeft,
                  top: offsetY,
                  width: BOARD_W,
                  height: BOARD_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <Board />
              </div>
            </div>
          </m.div>

          <div
            className="absolute bottom-0 left-0 w-full z-20 border-t transition-colors duration-500 border-zinc-200/60 bg-brand-light dark:border-zinc-800/40 dark:bg-[var(--background)]"
            style={{ height: "90px" }}
          >
            <div className="absolute top-0 left-0 w-full px-6 md:px-12 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors duration-500 text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <span
                  ref={(el) => {
                    yearRefs.current[1] = el;
                  }}
                  className="text-brand-neon font-bold"
                >
                  2016
                </span>
                <span ref={segRef}>{"// SEG_01"}</span>
                <span className="ml-4 hidden sm:inline transition-colors duration-500 text-zinc-600 dark:text-zinc-400">
                  2016 ————— 2026
                </span>
              </div>
            </div>

            <div
              className="absolute left-0 w-full h-[2px] transition-colors duration-500 bg-zinc-200 dark:bg-zinc-800/40"
              style={{ top: "32px" }}
            >
              <m.div
                className="h-full bg-brand-neon"
                style={{
                  width: progressWidth,
                  boxShadow: "0 0 8px #39FF14, 0 0 16px rgba(57,255,20,0.3)",
                }}
              />
            </div>

            <div className="absolute bottom-3 left-0 w-full px-6 md:px-12 flex justify-between items-center">
              <div className="font-mono text-[9px] tracking-wider flex items-center gap-3 transition-colors duration-500 text-zinc-400 dark:text-zinc-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-pulse">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="hidden sm:inline">SCROLL TO EXPLORE</span>
              </div>
              <div className="font-mono text-[9px] tracking-wider transition-colors duration-500 hidden md:block text-zinc-600 dark:text-zinc-300">
                HISTORICAL ARCHIVE // 2016–2026
              </div>
              <button
                onClick={handleSkip}
                className="font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm border transition-all duration-300 cursor-pointer flex items-center gap-2 group border-zinc-300 text-zinc-500 hover:border-brand-neon hover:text-brand-neon bg-white dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-brand-neon dark:hover:text-brand-neon dark:bg-zinc-900"
              >
                Skip
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
