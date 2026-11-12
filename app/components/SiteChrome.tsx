"use client";

import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import LanguageSwitch from "./LanguageSwitch";
import { getDictionary, localizedHref } from "@/lib/i18n";
import { useSiteLocale } from "@/lib/i18n/use-locale";

/* Opened from the hero on every route, so it stays eagerly dynamic rather
   than waiting on an intersection observer. */
const StaggeredMenu = dynamic(() => import("./StaggeredMenu"), { ssr: false });

const controlClass =
  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border-none backdrop-blur-sm bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-100/90 dark:hover:bg-white dark:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-neon";

/**
 * Floating top-left controls (menu, then home) and the nav overlay.
 * Shared by every route so the chrome is identical page to page.
 * Must be rendered inside a `LazyMotion` provider — the menu animates with `m.*`.
 */
export default function SiteChrome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const locale = useSiteLocale();
  const chrome = getDictionary(locale).chrome;
  const homeHref = localizedHref("/", locale);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {chrome.skipLink}
      </a>
      <div className="fixed top-6 left-6 z-[95] flex items-center gap-3">
        <button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={controlClass}
          title={chrome.menuToggle}
          aria-label={chrome.menuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
        >
          <div className="flex flex-col items-center justify-center gap-[5px] w-6">
            <span className={`site-chrome-lines block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
            <span className={`site-chrome-lines block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "opacity-0 w-0" : "w-4 opacity-70"}`} />
            <span className={`site-chrome-lines block h-[2px] rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 ${isMenuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
          </div>
        </button>

        <Link href={homeHref} className={controlClass} title={chrome.home} aria-label={chrome.home}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10.5 12 4l8 6.5" />
            <path d="M6.5 9.8V20h11V9.8" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className={controlClass}
          title={chrome.theme}
          aria-label={chrome.theme}
        >
          <svg className="hidden dark:block" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg className="block dark:hidden" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <LanguageSwitch />
      </div>

      <StaggeredMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
