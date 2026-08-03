"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Data: year segments with images, descriptions & layout             */
/* ------------------------------------------------------------------ */

interface TimelineImage {
  src: string;
  alt: string;
  /** CSS width */
  w: string;
  /** CSS height */
  h: string;
  /** Position from top of segment (CSS value) */
  top?: string;
  /** Position from bottom */
  bottom?: string;
  /** Offset from left edge of segment (CSS value) */
  left?: string;
}

interface YearSegment {
  year: string;
  /** Size of the year text: "giant" fills ~80% height, "large" ~50%, "medium" ~35% */
  yearSize: "giant" | "large" | "medium";
  /** Vertical position of year text from top (CSS) */
  yearTop?: string;
  /** Vertical position of year text from bottom (CSS) */
  yearBottom?: string;
  /** Horizontal offset of year text (CSS) */
  yearLeft?: string;
  /** Segment width (CSS) */
  segmentWidth: string;
  images: TimelineImage[];
  /** Descriptive text blocks that appear near images */
  descriptions?: {
    text: string;
    boldPrefix?: string;
    top?: string;
    bottom?: string;
    left?: string;
    maxWidth?: string;
  }[];
}

const TIMELINE_DATA: YearSegment[] = [
  {
    year: "2016",
    yearSize: "large",
    yearTop: "5%",
    yearLeft: "0",
    segmentWidth: "clamp(700px, 55vw, 1000px)",
    images: [
      { src: "/images/History/1.webp", alt: "First carbon fiber parts", w: "clamp(180px, 18vw, 320px)", h: "clamp(130px, 13vw, 220px)", top: "8%", left: "20%" },
      { src: "/images/History/2.webp", alt: "Founders in workshop", w: "clamp(140px, 12vw, 220px)", h: "clamp(100px, 9vw, 160px)", bottom: "15%", left: "5%" },
    ],
    descriptions: [
      { boldPrefix: "Ten years of", text: "\nconsistent quality", top: "12%", left: "2%", maxWidth: "320px" },
      { boldPrefix: "Founded in 2016", text: "\nwith only three employees", bottom: "10%", left: "40%", maxWidth: "320px" },
    ],
  },
  {
    year: "2017",
    yearSize: "medium",
    yearTop: "10%",
    yearLeft: "25%",
    segmentWidth: "clamp(650px, 50vw, 950px)",
    images: [
      { src: "/images/History/3.webp", alt: "Composite material work", w: "clamp(200px, 18vw, 340px)", h: "clamp(140px, 12vw, 220px)", top: "10%", left: "30%" },
    ],
    descriptions: [
      { boldPrefix: "Entry into Formula1", text: "\nin the first year", top: "15%", left: "0%", maxWidth: "280px" },
    ],
  },
  {
    year: "2018",
    yearSize: "medium",
    yearTop: "55%",
    yearLeft: "0%",
    segmentWidth: "clamp(720px, 58vw, 1050px)",
    images: [
      { src: "/images/History/4.webp", alt: "Formula 1 garage", w: "clamp(220px, 22vw, 400px)", h: "clamp(280px, 28vw, 480px)", top: "5%", left: "0%" },
      { src: "/images/History/5.webp", alt: "F1 car front", w: "clamp(180px, 16vw, 300px)", h: "clamp(120px, 10vw, 200px)", bottom: "8%", left: "10%" },
    ],
  },
  {
    year: "2019",
    yearSize: "medium",
    yearBottom: "35%",
    yearLeft: "0%",
    segmentWidth: "clamp(650px, 50vw, 950px)",
    images: [
      { src: "/images/History/6.webp", alt: "Technical drafting", w: "clamp(200px, 18vw, 320px)", h: "clamp(140px, 12vw, 240px)", top: "8%", left: "25%" },
    ],
  },
  {
    year: "2020",
    yearSize: "large",
    yearBottom: "20%",
    yearLeft: "0%",
    segmentWidth: "clamp(780px, 62vw, 1100px)",
    images: [
      { src: "/images/History/7.webp", alt: "Carbon layup process", w: "clamp(160px, 14vw, 260px)", h: "clamp(160px, 14vw, 260px)", top: "5%", left: "40%" },
      { src: "/images/History/8.webp", alt: "Worker with carbon fiber", w: "clamp(180px, 16vw, 280px)", h: "clamp(200px, 18vw, 320px)", top: "30%", left: "65%" },
    ],
    descriptions: [
      { boldPrefix: "First Small Series:", text: "\nMonocoque-construction\nfor supercars", bottom: "15%", left: "0%", maxWidth: "360px" },
    ],
  },
  {
    year: "2021",
    yearSize: "giant",
    yearTop: "2%",
    yearLeft: "-5%",
    segmentWidth: "clamp(950px, 78vw, 1450px)",
    images: [
      { src: "/images/History/9.webp", alt: "Hypercar component", w: "clamp(180px, 16vw, 280px)", h: "clamp(200px, 18vw, 320px)", top: "30%", left: "55%" },
    ],
    descriptions: [
      { boldPrefix: "Development & manufacturing", text: "\ntoque tube for a hypercar.", top: "25%", left: "48%", maxWidth: "450px" },
      { boldPrefix: "GrowthChampion", text: "\n2021 Award", bottom: "12%", left: "5%", maxWidth: "380px" },
    ],
  },
  {
    year: "2022",
    yearSize: "large",
    yearTop: "5%",
    yearLeft: "15%",
    segmentWidth: "clamp(900px, 72vw, 1350px)",
    images: [
      { src: "/images/History/10.webp", alt: "Workshop with team", w: "clamp(180px, 16vw, 280px)", h: "clamp(130px, 12vw, 220px)", top: "8%", left: "20%" },
      { src: "/images/History/11.webp", alt: "Growth Champion badge", w: "clamp(100px, 8vw, 140px)", h: "clamp(100px, 8vw, 140px)", bottom: "15%", left: "0%" },
      { src: "/images/History/12.webp", alt: "McLaren F1 car on track", w: "clamp(280px, 26vw, 480px)", h: "clamp(180px, 16vw, 300px)", bottom: "12%", left: "25%" },
    ],
    descriptions: [
      { boldPrefix: "Development & manufacturing", text: "\nStructural components for Formula1", top: "32%", left: "20%", maxWidth: "450px" },
    ],
  },
  {
    year: "2023",
    yearSize: "large",
    yearTop: "22%",
    yearLeft: "30%",
    segmentWidth: "clamp(900px, 72vw, 1350px)",
    images: [
      { src: "/images/History/13.webp", alt: "Two engineers working", w: "clamp(240px, 22vw, 400px)", h: "clamp(180px, 16vw, 300px)", top: "5%", left: "35%" },
      { src: "/images/History/14.webp", alt: "Growth Champion 2022 badge", w: "clamp(100px, 8vw, 140px)", h: "clamp(100px, 8vw, 140px)", bottom: "18%", left: "20%" },
      { src: "/images/History/15.webp", alt: "Race car on track", w: "clamp(200px, 18vw, 320px)", h: "clamp(130px, 12vw, 220px)", top: "8%", left: "75%" },
    ],
    descriptions: [
      { boldPrefix: "Team growth", text: " to 60 Employees\n+Expansion of Machine Park", top: "8%", left: "60%", maxWidth: "360px" },
      { boldPrefix: "Growth Champion", text: "\n2022 Award", bottom: "12%", left: "15%", maxWidth: "360px" },
    ],
  },
  {
    year: "2024",
    yearSize: "giant",
    yearTop: "15%",
    yearLeft: "5%",
    segmentWidth: "clamp(1050px, 82vw, 1500px)",
    images: [
      { src: "/images/History/16.webp", alt: "Growth Champion 2022 Award trophies", w: "clamp(120px, 10vw, 180px)", h: "clamp(100px, 8vw, 140px)", bottom: "10%", left: "0%" },
      { src: "/images/History/17.webp", alt: "Team working on large composite panels", w: "clamp(360px, 32vw, 580px)", h: "clamp(260px, 24vw, 440px)", top: "6%", left: "20%" },
      { src: "/images/History/18.webp", alt: "FT 1000 Europe's Fastest Growing Companies", w: "clamp(180px, 14vw, 260px)", h: "clamp(80px, 7vw, 120px)", bottom: "28%", left: "28%" },
    ],
    descriptions: [
      { boldPrefix: "Growth Champion", text: "\n2022 Award", bottom: "6%", left: "0%", maxWidth: "320px" },
      { boldPrefix: "Acquisition of the business", text: "\nby BRABUS Gmbh", top: "12%", left: "68%", maxWidth: "400px" },
    ],
  },
  {
    year: "2025",
    yearSize: "large",
    yearTop: "5%",
    yearLeft: "20%",
    segmentWidth: "clamp(850px, 68vw, 1250px)",
    images: [
      { src: "/images/History/19.webp", alt: "Engineer at workstation with BRABUS jacket", w: "clamp(160px, 14vw, 260px)", h: "clamp(180px, 16vw, 300px)", top: "10%", left: "60%" },
      { src: "/images/History/20.webp", alt: "F1 car racing on track", w: "clamp(260px, 24vw, 440px)", h: "clamp(160px, 14vw, 260px)", bottom: "8%", left: "15%" },
    ],
    descriptions: [
      { boldPrefix: "Supplier for the majority", text: "\nof Formula 1 teams", top: "22%", left: "25%", maxWidth: "380px" },
    ],
  },
  {
    year: "2026",
    yearSize: "large",
    yearTop: "8%",
    yearLeft: "20%",
    segmentWidth: "clamp(780px, 62vw, 1100px)",
    images: [
      { src: "/images/History/21.webp", alt: "Team portrait — Bräutigam family", w: "clamp(180px, 16vw, 280px)", h: "clamp(200px, 18vw, 320px)", top: "8%", left: "55%" },
    ],
    descriptions: [
      { text: "70 employees with ", boldPrefix: "continued growth", bottom: "25%", left: "30%", maxWidth: "380px" },
      { boldPrefix: "Join our team", text: "", bottom: "18%", left: "42%", maxWidth: "200px" },
    ],
  },
];

/** Upper bound of a `clamp(min, pref, max)` width, used as the `sizes` hint. */
function maxWidthOf(cssWidth: string) {
  const match = cssWidth.match(/clamp\([^,]+,[^,]+,\s*([^)]+)\)/);
  return (match ? match[1] : cssWidth).trim();
}

/* Year font size map — enlarged for impact */
const YEAR_FONT_SIZE: Record<string, string> = {
  giant: "clamp(380px, 55vw, 850px)",
  large: "clamp(220px, 30vw, 500px)",
  medium: "clamp(140px, 20vw, 320px)",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface HorizontalTimelineProps {
  isDark: boolean;
}

export default function HorizontalTimeline({ isDark }: HorizontalTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Readouts driven by scroll are written straight to the DOM — putting them in
  // React state would reconcile this whole 21-image tree on every frame.
  const yearRefs = useRef<(HTMLElement | null)[]>([]);
  const pctRefs = useRef<(HTMLElement | null)[]>([]);
  const segRef = useRef<HTMLSpanElement>(null);
  const tickRefs = useRef<(HTMLElement | null)[]>([]);
  const activeTickRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Translate the horizontal strip — increased range for the wider content
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-86%"]);

  const paintReadouts = useCallback((latest: number) => {
    const pct = Math.min(Math.round(latest * 100), 100);
    const index = Math.min(
      Math.floor(latest * TIMELINE_DATA.length),
      TIMELINE_DATA.length - 1
    );
    const year = TIMELINE_DATA[index].year;

    for (const el of yearRefs.current) if (el) el.textContent = year;
    for (const el of pctRefs.current) if (el) el.textContent = `${pct}%`;
    if (segRef.current) {
      segRef.current.textContent = `// SEG_${String(index + 1).padStart(2, "0")}`;
    }

    if (activeTickRef.current !== index) {
      tickRefs.current[activeTickRef.current]?.classList.remove("text-brand-neon", "font-bold");
      tickRefs.current[index]?.classList.add("text-brand-neon", "font-bold");
      activeTickRef.current = index;
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", paintReadouts);

  useEffect(() => {
    paintReadouts(scrollYProgress.get());
  }, [paintReadouts, scrollYProgress]);

  // Progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Header opacity — fades out early
  const headerOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // Skip to end handler
  const handleSkip = useCallback(() => {
    if (sectionRef.current) {
      const sectionBottom = sectionRef.current.offsetTop + sectionRef.current.offsetHeight;
      window.scrollTo({
        top: sectionBottom - window.innerHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative"
      style={{ height: "1100vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Top HUD Bar — positioned aligned with top menu ── */}
        <div
          className={`absolute left-0 w-full z-30 pt-0 pb-4 px-6 md:px-12 flex justify-between items-end border-b transition-colors duration-500 ${
            isDark
              ? "border-zinc-800/60 bg-[#0B0B0C]/80"
              : "border-zinc-200/60 bg-brand-light/80"
          }`}
          style={{ top: "24px", backdropFilter: "blur(8px)" }}
        >
          <div className="font-mono border-l-2 border-brand-neon pl-3">
            <span
              className={`text-[10px] tracking-widest font-semibold block uppercase transition-colors duration-500 ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              [ Corporate Evolution ]
            </span>
            <h2
              className={`font-sans text-2xl sm:text-3xl font-light uppercase tracking-tight leading-tight transition-colors duration-500 ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              Our Journey & History
            </h2>
            {/* Year + scroll data */}
            <div className={`mt-1.5 flex items-center gap-5 font-mono text-[10px] tracking-wider transition-colors duration-500 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              <span>
                ACTIVE_YEAR:{" "}
                <span ref={el => { yearRefs.current[0] = el; }} className="text-brand-neon font-bold text-xs">2016</span>
              </span>
              <span>SCROLL: <span ref={el => { pctRefs.current[0] = el; }} className="text-brand-neon font-bold">0%</span></span>
            </div>
          </div>
          <div className={`font-mono text-[9px] tracking-wider transition-colors duration-500 flex items-center gap-4 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            <span className="hidden md:inline">SCROLL TO EXPLORE →</span>
          </div>
        </div>

        {/* ── Section Header — compact, below HUD bar ── */}
        <m.div
          className={`absolute left-6 md:left-12 z-20 pointer-events-none font-mono text-[9px] tracking-wider transition-colors duration-500 ${
            isDark ? "text-zinc-500" : "text-zinc-400"
          }`}
          style={{ top: "120px", opacity: headerOpacity }}
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-neon rounded-full inline-block animate-pulse" />
            <span className="uppercase">
              Historical Archive // Division_Bräutigam_Composites
            </span>
          </div>
        </m.div>

        {/* ── Always-visible compact year/scroll (appears after header fades) ── */}
        <m.div
          className="absolute right-6 md:right-12 z-30 pointer-events-none font-mono"
          style={{
            top: "120px",
            opacity: useTransform(scrollYProgress, [0.03, 0.06], [0, 1]),
          }}
        >
          <div className={`flex items-center gap-4 text-xs tracking-wider transition-colors duration-500 ${
            isDark ? "text-zinc-500" : "text-zinc-400"
          }`}>
            <span ref={el => { yearRefs.current[1] = el; }} className="text-brand-neon font-bold text-lg">2016</span>
            <span ref={el => { pctRefs.current[1] = el; }} className="hidden sm:inline">0%</span>
          </div>
        </m.div>

        {/* ── Horizontal Content Strip — constrained between top zone and bottom zone ── */}
        <m.div
          className="absolute left-0 flex items-start"
          style={{ x, top: "150px", bottom: "100px", height: "auto" }}
        >
          <div className="flex h-full" style={{ paddingLeft: "clamp(300px, 30vw, 500px)" }}>
            {TIMELINE_DATA.map((segment, segIdx) => (
              <div
                key={segment.year}
                className="relative flex-shrink-0 h-full"
                style={{ width: segment.segmentWidth }}
              >
                {/* ── Large year number — SOLID green ── */}
                <div
                  className="absolute select-none pointer-events-none z-[1]"
                  style={{
                    ...(segment.yearTop ? { top: segment.yearTop } : {}),
                    ...(segment.yearBottom ? { bottom: segment.yearBottom } : {}),
                    left: segment.yearLeft || "0%",
                  }}
                >
                  <span
                    className="font-sans leading-[0.85] block"
                    style={{
                      fontSize: YEAR_FONT_SIZE[segment.yearSize],
                      fontWeight: 100,
                      color: "#39FF14",
                      opacity: isDark ? 0.85 : 0.65,
                    }}
                  >
                    {segment.year}
                  </span>
                </div>

                {/* ── Images — absolutely positioned ── */}
                {segment.images.map((img, imgIdx) => (
                  <m.div
                    key={imgIdx}
                    className="absolute overflow-hidden rounded-sm z-[5]"
                    style={{
                      width: img.w,
                      height: img.h,
                      ...(img.top ? { top: img.top } : {}),
                      ...(img.bottom ? { bottom: img.bottom } : {}),
                      left: img.left || "0%",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: imgIdx * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes={maxWidthOf(img.w)}
                      loading="lazy"
                    />
                    {/* Subtle overlay for dark mode */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isDark ? "bg-black/15" : "bg-transparent"
                      }`}
                    />
                  </m.div>
                ))}

                {/* ── Description text blocks — prominently visible ── */}
                {segment.descriptions?.map((desc, dIdx) => (
                  <m.div
                    key={dIdx}
                    className="absolute z-[8]"
                    style={{
                      ...(desc.top ? { top: desc.top } : {}),
                      ...(desc.bottom ? { bottom: desc.bottom } : {}),
                      left: desc.left || "0%",
                      maxWidth: desc.maxWidth || "260px",
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <p
                      className={`font-sans text-base md:text-xl lg:text-2xl leading-snug whitespace-pre-line transition-colors duration-500 ${
                        isDark ? "text-zinc-200" : "text-zinc-900"
                      }`}
                    >
                      {desc.boldPrefix && (
                        <span className="font-bold">{desc.boldPrefix}</span>
                      )}
                      {desc.text}
                    </p>
                  </m.div>
                ))}
              </div>
            ))}

            {/* End spacer */}
            <div className="flex-shrink-0 w-[30vw] md:w-[20vw]" />
          </div>
        </m.div>

        {/* ── Bottom Zone Container — segment info at top, controls at bottom ── */}
        <div
          className={`absolute bottom-0 left-0 w-full z-30 border-t transition-colors duration-500 ${
            isDark ? "border-zinc-800/40 bg-[#0B0B0C]/80" : "border-zinc-200/60 bg-brand-light/80"
          }`}
          style={{ height: "90px", backdropFilter: "blur(8px)" }}
        >
          {/* Segment info row — top of bottom zone */}
          <div
            className={`absolute top-0 left-0 w-full px-6 md:px-12 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors duration-500 ${
              isDark ? "text-zinc-600" : "text-zinc-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span ref={el => { yearRefs.current[2] = el; }} className="text-brand-neon font-bold">2016</span>
              <span ref={segRef}>{"// SEG_01"}</span>
              <span className={`ml-4 hidden sm:inline transition-colors duration-500 ${
                isDark ? "text-zinc-700" : "text-zinc-300"
              }`}>2016 ————— 2026</span>
            </div>
          </div>

          {/* Progress bar — between info and controls */}
          <div
            className={`absolute left-0 w-full h-[2px] transition-colors duration-500 ${
              isDark ? "bg-zinc-800/40" : "bg-zinc-200"
            }`}
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

          {/* Controls row — bottom of bottom zone */}
          <div className="absolute bottom-3 left-0 w-full px-6 md:px-12 flex justify-between items-center">
            {/* Left: scroll arrow */}
            <div
              className={`font-mono text-[9px] tracking-wider flex items-center gap-3 transition-colors duration-500 ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-pulse"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="hidden sm:inline">SCROLL TO EXPLORE</span>
            </div>

            {/* Center: year range */}
            <div
              className={`font-mono text-[9px] tracking-wider transition-colors duration-500 hidden md:block ${
                isDark ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              HISTORICAL ARCHIVE // 2016–2026
            </div>

            {/* Right: skip button */}
            <button
              onClick={handleSkip}
              className={`font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-sm border transition-all duration-300 cursor-pointer flex items-center gap-2 group ${
                isDark
                  ? "border-zinc-700 text-zinc-400 hover:border-brand-neon hover:text-brand-neon bg-zinc-900/60"
                  : "border-zinc-300 text-zinc-500 hover:border-brand-neon hover:text-brand-neon bg-white/60"
              }`}
              style={{ backdropFilter: "blur(4px)" }}
            >
              Skip
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Left vertical year ticks — centered between top and bottom zones ── */}
        <div
          className={`absolute left-3 md:left-6 flex flex-col gap-1 z-20 font-mono text-[7px] tracking-wider transition-colors duration-500 ${
            isDark ? "text-zinc-700" : "text-zinc-300"
          }`}
          style={{ top: "50%", transform: "translateY(-50%)", marginTop: "30px" }}
        >
          {TIMELINE_DATA.map((seg, i) => (
            <div
              key={seg.year}
              ref={el => { tickRefs.current[i] = el; }}
              className={`transition-colors duration-300 ${i === 0 ? "text-brand-neon font-bold" : ""}`}
            >
              {seg.year}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
