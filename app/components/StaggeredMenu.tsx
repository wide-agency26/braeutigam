"use client";

import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import TopoBackground from "./TopoBackground";
import NotchedBorderGlow from "./NotchedBorderGlow";
import "./StaggeredMenu.css";

interface StaggeredMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const SteppedTransitionLayer = ({ color }: { color: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <path
        d="M 0,0 
           L 45,0 
           Q 50,0 50,5 
           L 50,12 
           Q 50,15 55,15 
           L 65,15 
           Q 70,15 70,18 
           L 70,32 
           Q 75,35 80,35 
           L 88,35 
           Q 92,35 92,40 
           L 92,60 
           Q 92,65 88,65 
           L 80,65 
           Q 75,65 70,68 
           L 70,82 
           Q 70,85 65,85 
           L 55,85 
           Q 50,85 50,88 
           L 50,95 
           Q 50,100 45,100 
           L 0,100 
           Z"
        fill={color}
      />
    </svg>
  );
};

export default function StaggeredMenu({ isOpen, onClose, isDark, toggleTheme }: StaggeredMenuProps) {
  const menuItems = [
    { label: "HOME", link: "#silhouette" },
    { label: "LEISTUNGEN", link: "#story" },
    { label: "BAUTEILE", link: "#datasheet" },
    { label: "KARRIERE", link: "#karriere" },
    { label: "TEAM", link: "#team" }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    onClose();
    
    // Smooth scroll to the anchor element
    const element = document.querySelector(link);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 500); // Wait for menu close transition to start
    }
  };

  const itemVariants = {
    closed: { y: 40, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.35 + i * 0.08,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };

  const metaVariants = {
    closed: { opacity: 0, x: -20 },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.45,
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 z-[90] overflow-hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Layer 1: Neon Green Stepped SVG Overlay */}
          <m.div
            className="absolute inset-0 z-10 pointer-events-none"
            variants={{
              closed: { x: "-100%" },
              open: { 
                x: "0%", 
                transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } 
              }
            }}
            exit={{ 
              x: "100%", 
              transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] as const } 
            }}
          >
            <SteppedTransitionLayer color="#39FF14" />
          </m.div>

          {/* Layer 2: Zinc/Gray Stepped SVG Overlay */}
          <m.div
            className="absolute inset-0 z-20 pointer-events-none"
            variants={{
              closed: { x: "-100%" },
              open: { 
                x: "0%", 
                transition: { duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const } 
              }
            }}
            exit={{ 
              x: "100%", 
              transition: { duration: 0.5, delay: 0.05, ease: [0.7, 0, 0.84, 0] as const } 
            }}
          >
            <SteppedTransitionLayer color={isDark ? "#27272a" : "#e4e4e7"} />
          </m.div>

          {/* Layer 3: Main Full Screen Content Panel */}
          <m.div
            className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6"
            style={{ backgroundColor: isDark ? "#0B0B0C" : "#FFFFFF" }}
            variants={{
              closed: { x: "-100%" },
              open: { 
                x: "0%", 
                transition: { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const } 
              }
            }}
            exit={{ 
              x: "100%", 
              transition: { duration: 0.5, delay: 0.1, ease: [0.7, 0, 0.84, 0] as const } 
            }}
          >
            {/* Fine Technical Grid background on panel */}
            <div className={`absolute inset-0 pointer-events-none ${
              isDark ? "technical-grid technical-grid-fine opacity-20" : "technical-grid-light technical-grid-fine-light opacity-30"
            }`} />
            
            {/* Subtle Topo curves */}
            <TopoBackground opacityClass={isDark ? "opacity-[0.02]" : "opacity-[0.04]"} />

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 font-mono text-xs">
              
              {/* Left Column: Branding, Telemetry, and Links */}
              <m.div 
                className="lg:col-span-5 flex flex-col justify-between min-h-[300px] border-l-2 border-brand-neon pl-8 py-4"
                variants={metaVariants}
              >
                <div>
                  <span className={`font-bold text-lg px-3 py-1 uppercase tracking-tight ${
                    isDark ? "text-zinc-950 bg-zinc-100" : "text-zinc-100 bg-zinc-900"
                  }`}>
                    BRÄUTIGAM
                  </span>
                  <div className={`text-[10px] tracking-wider mt-4 leading-relaxed ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}>
                    <div>DIVISION // COMPOSITE ENGINEERING</div>
                    <div>PROJECT // AERO_HYPERCAR_v2.0</div>
                    <div>STATUS // SYSTEM_ACTIVE</div>
                  </div>
                </div>

                <div className={`text-[10px] tracking-widest leading-loose ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  <div>Daimlerstraße 13</div>
                  <div>D-71691 Freiberg am Neckar</div>
                  <div className="mt-4">
                    E:{" "}
                    <a 
                      href="mailto:info@braeutigam-gmbh.eu" 
                      className="text-brand-neon hover:underline decoration-brand-neon/40 underline-offset-4"
                    >
                      info@braeutigam-gmbh.eu
                    </a>
                  </div>
                  <div>
                    P: +49 (0)7141/2996700
                  </div>
                </div>
              </m.div>

              {/* Right Column: Dynamic Menu Items */}
              <ul className="lg:col-span-7 flex flex-col justify-center gap-6">
                {menuItems.map((item, idx) => (
                  <m.li
                    key={item.label}
                    custom={idx}
                    variants={itemVariants}
                    className="overflow-hidden border-b border-zinc-200/10 dark:border-zinc-800/60 pb-4"
                  >
                    <a
                      href={item.link}
                      onClick={(e) => handleLinkClick(e, item.link)}
                      className={`font-heading-bold text-4xl sm:text-6xl font-normal uppercase tracking-tight flex items-center gap-6 transition-all duration-300 hover:translate-x-6 ${
                        isDark 
                          ? "text-zinc-100 hover:text-brand-neon" 
                          : "text-zinc-950 hover:text-brand-neon"
                      }`}
                    >
                      <span className="text-brand-neon font-mono text-base font-semibold">
                        0{idx + 1}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </m.li>
                ))}
              </ul>

            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
