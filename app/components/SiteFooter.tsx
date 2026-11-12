"use client";

import { useMemo } from "react";
import LazyOnVisible from "./LazyOnVisible";
import { useTheme } from "./ThemeProvider";
import { readCssVarColor } from "@/lib/css-var-color";

const loadLineWaves = () => import("./LineWaves");

const WIDE_CREDIT_URL = "https://wide-communication.com";

import { SITE_NAV } from "@/lib/site-nav";
import { localizedHref } from "@/lib/i18n";
import { useSiteLocale } from "@/lib/i18n/use-locale";

import { SOCIAL_LINKS } from "@/lib/site-links";

/**
 * Shared Figma footer (frame notches) with the LineWaves canvas.
 * Used on the homepage and inner routes so chrome stays identical.
 */
export default function SiteFooter() {
  const { isDark } = useTheme();
  const locale = useSiteLocale();

  const waveColors = useMemo(() => {
    const neon = readCssVarColor("--colors-greeeen", "#00ff00");
    const secondary = readCssVarColor("--surface-pages-page-secondary", "#1f2020");
    const page = readCssVarColor("--surface-pages-page", "#f0f0f0");
    const ink = readCssVarColor("--neutral-black", "#131414");
    if (isDark) {
      return { color1: neon, color2: secondary, color3: ink, brightness: 0.3 };
    }
    /* Figma 2006:809 / 2006:810 — neon waves, page secondary, 20% black overlay */
    return { color1: neon, color2: page, color3: ink, brightness: 0.3 };
  }, [isDark]);

  return (
    <footer className="footer-figma-section cv-auto">
      <div
        className={
          isDark
            ? "absolute top-0 left-0 w-full h-40 z-10 pointer-events-none bg-gradient-to-b from-brand-dark to-transparent"
            : "absolute inset-0 z-[5] pointer-events-none bg-[color-mix(in_srgb,var(--neutral-black)_20%,transparent)]"
        }
        aria-hidden
      />

      <div className="absolute inset-0 z-0">
        <LazyOnVisible
          loader={loadLineWaves}
          rootMargin="100px"
          className="absolute inset-0"
          componentProps={{
            speed: 0.1,
            innerLineCount: 35,
            outerLineCount: 20,
            warpIntensity: 1.0,
            rotation: 59,
            edgeFadeWidth: 0.05,
            colorCycleSpeed: 1.0,
            brightness: waveColors.brightness,
            color1: waveColors.color1,
            color2: waveColors.color2,
            color3: waveColors.color3,
            enableMouseInteraction: true,
            mouseInfluence: 3.0,
          }}
        />
      </div>

      <div className="footer-figma relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="footer-figma__frame"
          src="/images/ui/footer-frame.svg"
          alt=""
          aria-hidden
          draggable={false}
        />

        <div className="footer-figma__inner">
          <div className="footer-figma__main">
            <nav className="footer-figma__nav" aria-label="Footer">
              {SITE_NAV.map((item) => {
                const label =
                  locale === "en" ? item.labelEn : item.titleDe.toUpperCase();
                return item.soon ? (
                  <span key={item.labelEn} className="opacity-50" aria-disabled="true">
                    {label}
                    <span className="sr-only"> coming soon</span>
                  </span>
                ) : (
                  <a
                    key={item.labelEn}
                    className="heading-tertiary"
                    href={item.href ? localizedHref(item.href, locale) : undefined}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            <div className="footer-figma__brand">
              <span className="footer-figma__logo footer-headline-primary">BRÄUTIGAM</span>
              <div className="footer-figma__since">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ui/since-badge.svg"
                  alt=""
                  aria-hidden
                  draggable={false}
                />
                <span className="footer-decorative-primary">SINCE 2016</span>
              </div>
            </div>

            <nav className="footer-figma__nav" aria-label="Social">
              {SOCIAL_LINKS.filter((item) => item.href).map((item) => (
                <a
                  key={item.label}
                  className="heading-tertiary"
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-figma__bottom">
            <div className="footer-figma__imprint footer-decorative-secondary">
              <a href={localizedHref("/impressum", locale)}>
                {locale === "en" ? "IMPRINT" : "IMPRESSUM"}
              </a>
              <a href={localizedHref("/datenschutz", locale)}>
                {locale === "en" ? "PRIVACY" : "DATENSCHUTZ"}
              </a>
            </div>
            <div className="footer-figma__legal copy-caption">
              <span>Legal Notice</span>
              <span>Privacy Policy</span>
              <span>Change Privacy Settings</span>
              <span>History of Privacy Settings</span>
              <span>Revoke Consent</span>
            </div>
            <a
              href={WIDE_CREDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-figma__credit footer-decorative-secondary"
            >
              BUILT WITH &lt;3 BY WIDE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
