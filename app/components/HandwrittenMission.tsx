"use client";

import React, { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

/**
 * HandwrittenMission — Animates the word "mission" in the Mr Dafoe cursive
 * font using SVG stroke-dashoffset to progressively "draw" the letterforms
 * like a pen writing across the page.
 *
 * Phase 1: Stroke draws in over ~2.5s (pen writing)
 * Phase 2: Fill fades in while stroke remains (ink settling)
 */

export default function HandwrittenMission() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [totalLength, setTotalLength] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Measure the total path length of the text's stroke outline
    // We need to wait for the font to load before measuring
    const measure = () => {
      if (textRef.current) {
        try {
          const len = textRef.current.getComputedTextLength();
          // For stroke-dasharray on text, we use a generous estimate
          // since getComputedTextLength returns the advance width,
          // but the actual stroke path is much longer (follows glyph outlines)
          setTotalLength(len * 5);
          setIsReady(true);
        } catch {
          setTotalLength(3000);
          setIsReady(true);
        }
      }
    };

    // Try to wait for fonts, then measure
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        // Small delay to ensure rendering
        requestAnimationFrame(() => {
          measure();
        });
      });
    } else {
      // Fallback
      setTimeout(measure, 500);
    }
  }, []);

  const shouldAnimate = isInView && isReady;

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center relative">
      <svg
        viewBox="0 0 858 250"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="mission"
        role="img"
      >
        {/* Glow layer underneath — only visible after stroke is drawn */}
        <text
          x="429"
          y="180"
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-mr-dafoe), cursive",
            fontSize: "187px",
            fill: "none",
            stroke: "#39FF14",
            strokeWidth: 6,
            opacity: shouldAnimate ? 0.15 : 0,
            transition: shouldAnimate
              ? "opacity 1.2s ease-in 3.5s"
              : "opacity 0.3s ease-out",
            filter: "blur(10px)",
          }}
        >
          mission
        </text>

        {/* Main stroke-draw text — this is the "pen writing" effect */}
        <text
          ref={textRef}
          x="429"
          y="180"
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-mr-dafoe), cursive",
            fontSize: "187px",
            fill: "none",
            stroke: "#39FF14",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: totalLength || 3000,
            strokeDashoffset: shouldAnimate ? 0 : (totalLength || 3000),
            transition: shouldAnimate
              ? "stroke-dashoffset 4s cubic-bezier(0.25, 0.1, 0.25, 1.0)"
              : "none",
            opacity: 0.9,
          }}
        >
          mission
        </text>

        {/* Fill fade-in after stroke completes — the "ink" settling */}
        <text
          x="429"
          y="180"
          textAnchor="middle"
          style={{
            fontFamily: "var(--font-mr-dafoe), cursive",
            fontSize: "187px",
            fill: "#39FF14",
            stroke: "none",
            opacity: shouldAnimate ? 0.8 : 0,
            transition: shouldAnimate
              ? "opacity 1.2s ease-in 3.5s"
              : "opacity 0.3s ease-out",
          }}
        >
          mission
        </text>
      </svg>
    </div>
  );
}
