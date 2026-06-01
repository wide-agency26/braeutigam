"use client";

import React, { useRef, useCallback, useEffect, useState, useId } from "react";
import "./NotchedBorderGlow.css";

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 75, s: 100, l: 50 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]) {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

// SVG Path Generator: Combines rounded corners with diagonal cuts
function getPathD(w: number, h: number, notch: string, r: number, c: number) {
  if (w <= 0 || h <= 0) return "";
  
  // Ensure parameters fit inside the box size
  const maxR = Math.min(r, w / 2, h / 2);
  const maxC = Math.min(c, w / 2, h / 2);
  
  if (notch === "bottom-right") {
    return `M ${maxR} 0 ` +
           `L ${w - maxR} 0 ` +
           `A ${maxR} ${maxR} 0 0 1 ${w} ${maxR} ` +
           `L ${w} ${h - maxC} ` +
           `L ${w - maxC} ${h} ` +
           `L ${maxR} ${h} ` +
           `A ${maxR} ${maxR} 0 0 1 0 ${h - maxR} ` +
           `L 0 ${maxR} ` +
           `A ${maxR} ${maxR} 0 0 1 ${maxR} 0 ` +
           `Z`;
  }
  
  if (notch === "bottom-left") {
    return `M ${maxR} 0 ` +
           `L ${w - maxR} 0 ` +
           `A ${maxR} ${maxR} 0 0 1 ${w} ${maxR} ` +
           `L ${w} ${h - maxR} ` +
           `A ${maxR} ${maxR} 0 0 1 ${w - maxR} ${h} ` +
           `L ${maxC} ${h} ` +
           `L 0 ${h - maxC} ` +
           `L 0 ${maxR} ` +
           `A ${maxR} ${maxR} 0 0 1 ${maxR} 0 ` +
           `Z`;
  }
  
  if (notch === "slanted") {
    // Parallelogram or dual notched corner (top-left & bottom-right cut, bottom-left & top-right rounded)
    return `M ${maxC} 0 ` +
           `L ${w - maxR} 0 ` +
           `A ${maxR} ${maxR} 0 0 1 ${w} ${maxR} ` +
           `L ${w} ${h - maxC} ` +
           `L ${w - maxC} ${h} ` +
           `L ${maxR} ${h} ` +
           `A ${maxR} ${maxR} 0 0 1 0 ${h - maxR} ` +
           `L 0 ${maxC} ` +
           `L ${maxC} 0 ` +
           `Z`;
  }
  
  // Standard rounded rectangle (no notch)
  return `M ${maxR} 0 ` +
         `L ${w - maxR} 0 ` +
         `A ${maxR} ${maxR} 0 0 1 ${w} ${maxR} ` +
         `L ${w} ${h - maxR} ` +
         `A ${maxR} ${maxR} 0 0 1 ${w - maxR} ${h} ` +
         `L ${maxR} ${h} ` +
         `A ${maxR} ${maxR} 0 0 1 0 ${h - maxR} ` +
         `L 0 ${maxR} ` +
         `A ${maxR} ${maxR} 0 0 1 ${maxR} 0 ` +
         `Z`;
}

interface NotchedBorderGlowProps {
  children?: React.ReactNode;
  notchPosition?: "bottom-left" | "bottom-right" | "slanted" | "none";
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number; // Prop to customize rounded corners (default 4 for tight high-tech corners)
  notchSize?: number;    // Prop to customize notch diagonal cuts
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  colors?: string[];
  fillOpacity?: number;
  isDark?: boolean;
  active?: boolean;
  noPadding?: boolean;
}

export default function NotchedBorderGlow({
  children,
  notchPosition = "bottom-left",
  className = "",
  edgeSensitivity = 30,
  glowColor = "75 100 50", // HSL of brand neon green
  backgroundColor,
  borderRadius = 4, // 1/3 of the previous 12px rounding size
  notchSize = 24,
  glowRadius = 40,
  glowIntensity = 1.2,
  coneSpread = 25,
  colors,
  fillOpacity = 0.35,
  isDark = true,
  active = true,
  noPadding = false
}: NotchedBorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const uniqueId = useId().replace(/:/g, "-");

  const clipIdOuter = `clip-outer-${uniqueId}`;
  const clipIdInner = `clip-inner-${uniqueId}`;

  // Update dimensions on mount and resize
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updateDimensions = () => {
      const rect = card.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  // Set default glow gradient colors based on theme and active state
  const defaultColors = isDark 
    ? (active ? ["#39FF14", "#22c55e", "#16a34a"] : ["#4b5563", "#374151", "#1f2937"])
    : (active ? ["#39FF14", "#71717a", "#27272a"] : ["#d4d4d8", "#e4e4e7", "#f4f4f5"]);

  const finalColors = colors || defaultColors;
  const defaultBgColor = backgroundColor || (isDark ? "#0B0B0C" : "#FFFFFF");

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, [getEdgeProximity, getCursorAngle]);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--edge-proximity", "0");
  }, []);

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const gradientVars = buildGradientVars(finalColors);

  // Setup static border values when mouse is away
  const staticBorderColor = isDark 
    ? (active ? "rgba(57, 255, 20, 0.45)" : "rgba(255, 255, 255, 0.12)") 
    : (active ? "rgba(39, 39, 42, 0.5)" : "rgba(212, 212, 216, 0.8)");

  // Generate paths for outer (full w, h) and inner (1px inset on all sides)
  const outerPath = getPathD(dimensions.width, dimensions.height, notchPosition, borderRadius, notchSize);
  const innerPath = getPathD(dimensions.width - 2, dimensions.height - 2, notchPosition, Math.max(0, borderRadius - 1), Math.max(0, notchSize - 1));

  // Determine if mounted to choose SVG vs CSS fallback clip-path
  const isMounted = dimensions.width > 0 && dimensions.height > 0;
  
  const fallbackClipPath = notchPosition === "bottom-left"
    ? "polygon(0 0, 100% 0, 100% 100%, 36px 100%, 20px calc(100% - 16px), 0 calc(100% - 16px))"
    : notchPosition === "bottom-right"
    ? "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 36px) calc(100% - 16px), calc(100% - 20px) 100%, 0 100%)"
    : notchPosition === "slanted"
    ? "polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%)"
    : "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

  const clipPathOuterStyle = isMounted ? `url(#${clipIdOuter})` : fallbackClipPath;
  const clipPathInnerStyle = isMounted ? `url(#${clipIdInner})` : fallbackClipPath;

  return (
    <>
      {/* Invisible SVG block defining unique clipPaths for this instance */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <clipPath id={clipIdOuter} clipPathUnits="userSpaceOnUse">
            <path d={outerPath} />
          </clipPath>
          <clipPath id={clipIdInner} clipPathUnits="userSpaceOnUse">
            <path d={innerPath} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`notched-glow-container ${className}`}
        style={{
          position: "relative",
          overflow: "visible",
          background: "transparent",
          border: "none",
          width: "100%",
          height: "100%",
          "--card-bg": defaultBgColor,
          "--edge-sensitivity": edgeSensitivity.toString(),
          "--glow-padding": `${glowRadius}px`,
          "--cone-spread": coneSpread.toString(),
          "--fill-opacity": fillOpacity.toString(),
          "--static-border-color": staticBorderColor,
          ...glowVars,
          ...gradientVars,
        } as React.CSSProperties}
      >
        {/* 1. Outer Glow Layer (Unclipped, wraps the SVG blurred path glow) */}
        <div 
          className="notched-glow-edge-light"
          style={{
            position: "absolute",
            inset: "-40px",
            pointerEvents: "none",
            zIndex: 1
          }}
        >
          {dimensions.width > 0 && dimensions.height > 0 && (
            <svg
              width="100%"
              height="100%"
              viewBox={`-40 -40 ${dimensions.width + 80} ${dimensions.height + 80}`}
              style={{ overflow: "visible" }}
            >
              <defs>
                <filter id={`blur-${uniqueId}`}>
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>
              <path
                d={outerPath}
                fill="none"
                stroke={`var(--glow-color, ${isDark ? "#39FF14" : "#27272a"})`}
                strokeWidth="4"
                filter={`url(#blur-${uniqueId})`}
              />
            </svg>
          )}
        </div>

        {/* 2. Card Body (Clipped to the notch shape) */}
        <div
          className="notched-glow-card-body"
          style={{
            clipPath: clipPathOuterStyle,
            position: "relative",
            width: "100%",
            height: "100%",
            background: staticBorderColor,
            zIndex: 2,
          }}
        >
          {/* 2.1 Interactive Border Glow Layer */}
          <div 
            className="notched-glow-border-layer"
            style={{ clipPath: clipPathOuterStyle }}
          />

          {/* 2.2 Inner Solid Background Card (leaves a 1px gap) */}
          <div 
            className="notched-glow-bg-layer"
            style={{ 
              clipPath: clipPathInnerStyle,
              backgroundColor: defaultBgColor
            }}
          />

          {/* 2.3 Background Radial Fill Glow */}
          <div 
            className="notched-glow-fill-layer"
            style={{ clipPath: clipPathInnerStyle }}
          />

          {/* 2.4 Content Container */}
          <div className={`notched-glow-content ${noPadding ? "p-0" : "p-6"}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
