"use client";

import React, { useRef, useEffect } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface TrackScrollMapProps {
  progress: MotionValue<number>;
}

/** Number of points sampled off the SVG path at mount. */
const SAMPLES = 200;

export default function TrackScrollMap({ progress }: TrackScrollMapProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pointsRef = useRef<Float32Array | null>(null);

  // Default path roughly resembling the provided map reference.
  // The user can swap this out with their exact SVG 'd' string later.
  const trackPath = "M 40 100 C 40 160, 80 180, 110 180 C 140 180, 170 140, 200 130 C 230 120, 260 100, 280 60 L 250 40 C 200 80, 160 80, 130 80 C 90 80, 80 40, 60 40 C 40 40, 40 100, 40 100 Z";

  // Sample the path once instead of calling getPointAtLength on every frame.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const total = path.getTotalLength();
    const points = new Float32Array((SAMPLES + 1) * 2);
    for (let i = 0; i <= SAMPLES; i++) {
      const p = path.getPointAtLength((i / SAMPLES) * total);
      points[i * 2] = p.x;
      points[i * 2 + 1] = p.y;
    }
    pointsRef.current = points;
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    const points = pointsRef.current;
    const dot = dotRef.current;
    if (!points || !dot) return;

    const p = Math.min(Math.max(latest, 0), 1);
    const i = Math.round(p * SAMPLES) * 2;
    dot.setAttribute("cx", String(points[i]));
    dot.setAttribute("cy", String(points[i + 1]));
  });

  return (
    <div className="relative w-48 h-40 transition-all duration-500">
      {/* Container Background & Border with notched top-right corner */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          d="M 0 5 L 0 95 C 0 97.76, 2.24 100, 5 100 L 95 100 C 97.76 100, 100 97.76, 100 95 L 100 20 L 80 0 L 5 0 C 2.24 0, 0 2.24, 0 5 Z" 
          className="fill-white/90 stroke-zinc-300/80 dark:fill-zinc-900/40 dark:stroke-zinc-700/80 transition-colors duration-500"
          strokeWidth="1"
        />
      </svg>
      
      {/* The Track Map Area */}
      <div className="absolute inset-0 flex items-center justify-center p-3 mt-2">
        <svg 
          viewBox="0 0 320 220" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Base Track */}
          <path 
            ref={pathRef}
            d={trackPath}
            fill="none"
            className="stroke-black/80 dark:stroke-white/15 transition-colors duration-500"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* The Moving Dot */}
          <circle
            ref={dotRef}
            cx="40"
            cy="100"
            r="10"
            className="fill-black dark:fill-brand-neon transition-colors duration-500 dark:[filter:drop-shadow(0px_0px_8px_#39FF14)]"
          />
        </svg>
      </div>
    </div>
  );
}
