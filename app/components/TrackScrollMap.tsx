"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, MotionValue, useMotionValueEvent } from "framer-motion";

interface TrackScrollMapProps {
  progress: MotionValue<number>;
  isDark: boolean;
}

export default function TrackScrollMap({ progress, isDark }: TrackScrollMapProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [pathLength, setPathLength] = useState(0);

  // Default path roughly resembling the provided map reference.
  // The user can swap this out with their exact SVG 'd' string later.
  const trackPath = "M 40 100 C 40 160, 80 180, 110 180 C 140 180, 170 140, 200 130 C 230 120, 260 100, 280 60 L 250 40 C 200 80, 160 80, 130 80 C 90 80, 80 40, 60 40 C 40 40, 40 100, 40 100 Z";
  
  // Measure the path total length on mount
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
      // Initialize dot at 0%
      const startPoint = pathRef.current.getPointAtLength(0);
      setDotPos({ x: startPoint.x, y: startPoint.y });
    }
  }, []);

  // Update dot position as scroll progress changes
  useMotionValueEvent(progress, "change", (latest) => {
    if (pathRef.current && pathLength > 0) {
      // Clamp progress between 0 and 1
      const p = Math.min(Math.max(latest, 0), 1);
      const lengthAtProgress = p * pathLength;
      const point = pathRef.current.getPointAtLength(lengthAtProgress);
      setDotPos({ x: point.x, y: point.y });
    }
  });

  return (
    <div className={`relative w-48 h-40 transition-all duration-500`}>
      {/* Container Background & Border with notched top-right corner */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          d="M 0 5 L 0 95 C 0 97.76, 2.24 100, 5 100 L 95 100 C 97.76 100, 100 97.76, 100 95 L 100 20 L 80 0 L 5 0 C 2.24 0, 0 2.24, 0 5 Z" 
          fill={isDark ? "rgba(24, 24, 27, 0.4)" : "rgba(255, 255, 255, 0.9)"}
          stroke={isDark ? "rgba(63, 63, 70, 0.8)" : "rgba(212, 212, 216, 0.8)"}
          strokeWidth="1"
          className="transition-colors duration-500 backdrop-blur-md"
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
            stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.8)"}
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />
          
          {/* The Moving Dot */}
          {pathLength > 0 && (
            <motion.circle 
              cx={dotPos.x} 
              cy={dotPos.y} 
              r="10" 
              fill={isDark ? "#39FF14" : "#000000"} 
              className="transition-colors duration-500"
              style={{
                filter: isDark ? "drop-shadow(0px 0px 8px #39FF14)" : "none"
              }}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
