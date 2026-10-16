"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

/* Opened from the hero on every route, so it stays eagerly dynamic rather
   than waiting on an intersection observer. */
const StaggeredMenu = dynamic(() => import("./StaggeredMenu"), { ssr: false });

const controlClass =
  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none outline-none focus:outline-none backdrop-blur-sm bg-zinc-900/90 hover:bg-zinc-800 dark:bg-zinc-100/90 dark:hover:bg-white";

/**
 * Floating top-left controls (menu, then home) and the nav overlay.
 * Shared by every route so the chrome is identical page to page.
 * Must be rendered inside a `LazyMotion` provider — the menu animates with `m.*`.
 */
export default function SiteChrome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-6 left-6 z-[95] flex items-center gap-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={controlClass}
          title="Toggle navigation menu"
          aria-label="Toggle navigation menu"
        >
          <div className="flex flex-col items-center justify-center gap-[5px] w-6">
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "opacity-0 w-0" : "w-4 ml-auto opacity-70"}`} />
            <span className={`block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5 ml-auto"}`} />
          </div>
        </button>

        <a href="/" className={controlClass} title="Home" aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-100 dark:text-zinc-900" aria-hidden="true">
            <path d="M4 10.5 12 4l8 6.5" />
            <path d="M6.5 9.8V20h11V9.8" />
          </svg>
        </a>
      </div>

      <StaggeredMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
