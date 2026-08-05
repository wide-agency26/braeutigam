"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "./ThemeProvider";

/* Opened from the hero on every route, so it stays eagerly dynamic rather
   than waiting on an intersection observer. */
const StaggeredMenu = dynamic(() => import("./StaggeredMenu"), { ssr: false });

/**
 * Floating top-right controls (theme toggle + hamburger) and the nav overlay.
 * Shared by every route so the chrome is identical page to page.
 * Must be rendered inside a `LazyMotion` provider — the menu animates with `m.*`.
 */
export default function SiteChrome() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-6 right-6 z-[95] flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm bg-white/80 hover:bg-zinc-100/90 text-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 dark:text-zinc-200 dark:shadow-none"
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

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-12 px-5 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm bg-zinc-900/90 hover:bg-zinc-800 dark:bg-zinc-100/90 dark:hover:bg-white"
          title="Toggle navigation menu"
        >
          <div className="flex flex-col items-center justify-center gap-[5px] w-6">
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "opacity-0 w-0" : "w-4 ml-auto opacity-70"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5 ml-auto"}`} />
          </div>
        </button>
      </div>

      <StaggeredMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
