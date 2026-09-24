"use client";

import LazyOnVisible from "./LazyOnVisible";
import { useTheme } from "./ThemeProvider";

const loadLineWaves = () => import("./LineWaves");

const WIDE_CREDIT_URL = "https://wide-communication.com";

const PAGE_NAV = [
  { label: "HOME", href: "/#silhouette" },
  { label: "LEISTUNGEN", href: "/#story" },
  { label: "BAUTEILE", href: "/#mission" },
  { label: "KARRIERE", href: "/karriere" },
  { label: "TEAM", href: "/#datasheet" },
  { label: "KONTAKT", href: "/kontakt" },
] as const;

const SOCIAL_NAV = [
  { label: "INSTAGRAM", href: "https://instagram.com" },
  { label: "LINKEDIN", href: "https://linkedin.com" },
  { label: "FACEBOOK", href: "https://facebook.com" },
] as const;

/**
 * Shared Figma footer (Oswald + frame notches) with the LineWaves canvas.
 * Used on the homepage and inner routes so chrome stays identical.
 */
export default function SiteFooter() {
  const { isDark } = useTheme();

  return (
    <footer className="footer-figma-section cv-auto">
      <div className="absolute top-0 left-0 w-full h-40 z-10 pointer-events-none bg-gradient-to-b from-brand-light to-transparent dark:from-[#0B0B0C] dark:to-transparent" />

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
            brightness: isDark ? 0.3 : 1.0,
            color1: isDark ? "#39ff14" : "#000000",
            color2: isDark ? "#222222" : "#000000",
            color3: isDark ? "#111111" : "#000000",
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
              {PAGE_NAV.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="footer-figma__brand">
              <span className="footer-figma__logo">BRÄUTIGAM</span>
              <div className="footer-figma__since">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ui/since-badge.svg"
                  alt=""
                  aria-hidden
                  draggable={false}
                />
                <span>SINCE 2016</span>
              </div>
            </div>

            <nav className="footer-figma__nav" aria-label="Social">
              {SOCIAL_NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-figma__bottom">
            <div className="footer-figma__imprint">
              <a href="#">IMPRESSUM</a>
              <a href="#">DATENSCHUTZ</a>
            </div>
            <div className="footer-figma__legal">
              <a href="#">Legal Notice</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Change Privacy Settings</a>
              <a href="#">History of Privacy Settings</a>
              <a href="#">Revoke Consent</a>
            </div>
            <a
              href={WIDE_CREDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-figma__credit"
            >
              BUILT WITH &lt;3 BY WIDE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
