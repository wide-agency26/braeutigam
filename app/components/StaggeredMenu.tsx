"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import TopoBackground from "./TopoBackground";
import { SITE_NAV } from "@/lib/site-nav";
import "./StaggeredMenu.css";

interface StaggeredMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SteppedTransitionLayer = ({ className }: { className: string }) => {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <path
        className={className}
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
      />
    </svg>
  );
};

export default function StaggeredMenu({ isOpen, onClose }: StaggeredMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const menuItems = SITE_NAV.map((item) => ({
    label: item.labelEn,
    link: item.href ?? "#",
    soon: item.soon,
  }));

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    const [path, hash] = link.split("#");
    const target = hash && path === `${window.location.pathname.replace(/\/$/, "")}/`
      ? document.getElementById(hash)
      : null;

    // Cross-route links fall through to a normal navigation.
    if (!target) {
      onClose();
      return;
    }

    e.preventDefault();
    onClose();
    // Wait for the menu close transition to start before scrolling.
    setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 500);
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

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const backgroundRegions = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const backgroundState = backgroundRegions.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));
    for (const { element } of backgroundState) {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    }

    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("aria-hidden"));

    const focusTimer = window.setTimeout(() => focusables()[0]?.focus(), 180);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      for (const { element, inert, ariaHidden } of backgroundState) {
        element.inert = inert;
        if (ariaHidden == null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          ref={panelRef}
          id="site-menu"
          key="staggered-menu"
          className="fixed inset-0 z-[90] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Hauptnavigation"
          initial="closed"
          animate="open"
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
            <SteppedTransitionLayer className="fill-brand-neon" />
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
            <SteppedTransitionLayer className="fill-zinc-200 dark:fill-zinc-700" />
          </m.div>

          {/* Layer 3: Main Full Screen Content Panel */}
          <m.div
            className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6 py-16 bg-white dark:bg-[#0B0B0C] overflow-y-auto"
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
            <div className="absolute inset-0 pointer-events-none technical-grid-theme opacity-30 dark:opacity-20" />
            
            {/* Subtle Topo curves */}
            <TopoBackground opacityClass="opacity-[0.04] dark:opacity-[0.02]" />

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 font-mono text-xs">
              
              {/* Left Column: Branding, Telemetry, and Links */}
              <m.div 
                className="lg:col-span-5 flex flex-col justify-between min-h-[300px] border-l-2 border-brand-neon pl-8 py-4"
                variants={metaVariants}
              >
                <div>
                  <span className="font-bold text-lg px-3 py-1 uppercase tracking-tight text-zinc-100 bg-zinc-900 dark:text-zinc-950 dark:bg-zinc-100">
                    BRÄUTIGAM
                  </span>
                  <div className="text-[10px] tracking-wider mt-4 leading-relaxed text-zinc-400 dark:text-zinc-500">
                    <div>DIVISION // COMPOSITE ENGINEERING</div>
                    <div>PROJECT // AERO_HYPERCAR_v2.2</div>
                    <div>STATUS // SYSTEM_ACTIVE</div>
                  </div>
                </div>

                <div className="text-[10px] tracking-widest leading-loose text-zinc-600 dark:text-zinc-400">
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
              <ul className="lg:col-span-7 flex flex-col justify-center gap-3 sm:gap-4">
                {menuItems.map((item, idx) => (
                  <m.li
                    key={item.label}
                    custom={idx}
                    variants={itemVariants}
                    className="overflow-hidden border-b border-zinc-200/10 dark:border-zinc-800/60 pb-3"
                  >
                    {item.soon ? (
                      <span
                        aria-disabled="true"
                        className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight flex items-start gap-4 sm:gap-5 text-zinc-400 dark:text-zinc-500 cursor-default"
                      >
                        <span className="text-zinc-400 dark:text-zinc-500 font-mono text-base font-semibold">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{item.label}</span>
                        <span className="normal-case font-mono text-[10px] sm:text-xs font-semibold tracking-[0.16em] text-zinc-400 dark:text-zinc-600">
                          coming soon
                        </span>
                      </span>
                    ) : (
                      <a
                        href={item.link}
                        onClick={(e) => handleLinkClick(e, item.link)}
                        className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.95] flex items-start gap-4 sm:gap-5 transition-all duration-300 hover:translate-x-3 sm:hover:translate-x-6 text-zinc-950 hover:text-brand-neon dark:text-zinc-100 focus-visible:rounded-sm"
                      >
                        <span className="text-brand-neon font-mono text-base font-semibold">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{item.label}</span>
                      </a>
                    )}
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
