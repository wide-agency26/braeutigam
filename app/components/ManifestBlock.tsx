"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import DecryptedText from "./DecryptedText";
import Reveal from "./Reveal";
import weave from "../../public/images/grundsatz/figma/tl.jpg";
import clkGtr from "../../public/images/grundsatz/figma/tr.jpg";
import precision from "../../public/images/grundsatz/figma/bl.jpg";
import autoclave from "../../public/images/grundsatz/figma/br.jpg";
import "./ManifestSection.css";

const HUD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]!.*:_> ";

function HudLine({
  text,
  className = "",
  sequential = true,
}: {
  text: string;
  className?: string;
  sequential?: boolean;
}) {
  return (
    <DecryptedText
      text={text}
      animateOn="view"
      sequential={sequential}
      speed={28}
      maxIterations={6}
      characters={HUD_CHARS}
      className={className}
      encryptedClassName={`${className} decrypt-char-encrypted`}
    />
  );
}

function CoreValueIcon({
  src,
  width,
  height,
}: {
  src: string;
  width: number;
  height: number;
}) {
  return <img src={src} alt="" width={width} height={height} />;
}

function IconFlag() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path d="M12 8v34" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="10" width="10" height="7" fill="currentColor" />
      <rect x="24" y="10" width="10" height="7" fill="currentColor" opacity="0.35" />
      <rect x="14" y="17" width="10" height="7" fill="currentColor" opacity="0.35" />
      <rect x="24" y="17" width="10" height="7" fill="currentColor" />
      <rect x="14" y="24" width="10" height="7" fill="currentColor" />
      <rect x="24" y="24" width="10" height="7" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <circle cx="25" cy="25" r="14" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="25" cy="25" rx="6" ry="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 25h28M13 18h24M13 32h24" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path
        d="M25 6l3.2 12.4L41 22l-12.8 3.6L25 44l-3.2-18.4L9 22l12.8-3.6L25 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PHOTO_SIZES = {
  tl: "(max-width: 1100px) 100vw, 346px",
  tr: "(max-width: 1100px) 100vw, 500px",
  bl: "(max-width: 1100px) 100vw, 450px",
  br: "(max-width: 1100px) 100vw, 700px",
} as const;

function Photo({
  src,
  alt,
  area,
}: {
  src: StaticImageData;
  alt: string;
  area: keyof typeof PHOTO_SIZES;
}) {
  const image = (
    <Image src={src} alt={alt} fill className="object-cover" sizes={PHOTO_SIZES[area]} />
  );

  return (
    <div className={`manifest-photo manifest-photo--${area}`}>
      {area === "tl" ? <div className="manifest-photo__crop">{image}</div> : image}
    </div>
  );
}

export default function ManifestBlock() {
  return (
    <div className="manifest-shell">
      <div className="mg-bar" aria-label="System status">
        <div className="mg-bar__cluster">
          <HudLine text="BRAEUTIGAM_WEBFILE" className="" />
          <HudLine text="ACCESS GRANTED" className="mg-neon" />
          <HudLine text=">>_UPDATE LOADED" className="mg-neon" />
          <p className="mg-credit">
            <HudLine text="©2026 MADE BY WIDE" className="mg-dim" sequential={false} />
          </p>
        </div>
        <div className="mg-bar__cluster mg-bar__cluster--center">
          <HudLine text="PRODUCTION MANIFEST ... LOADING" className="mg-amber" />
          <HudLine text="FOUND! [CORE VALUES]" className="mg-neon" />
        </div>
        <div className="mg-bar__cluster mg-bar__cluster--end">
          <div className="mg-core">
            <span className="mg-core__label">CORE VALUE DEFINITION:</span>
            <div className="mg-core__row">
              <div className="mg-icon">
                <CoreValueIcon src="/images/core-values/speed.svg" width={40} height={40} />
                <span>SPEED</span>
              </div>
              <div className="mg-icon">
                <CoreValueIcon src="/images/core-values/complexity.svg" width={42} height={41} />
                <span>COMPLEXITY</span>
              </div>
              <div className="mg-icon">
                <CoreValueIcon src="/images/core-values/inhouse.svg" width={46.67} height={40} />
                <span>INHOUSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="craft-technology" className="cv-auto relative">
        <div className="manifest-frame">
        <div className="manifest-stage">
          <div className="manifest-stack">
          <div className="manifest-overview">
            <p className="manifest-overview__title">
              <HudLine text="*** CLIENT OVERVIEW ***" className="mg-dim" />
            </p>
            <p className="manifest-overview__row">
              <HudLine text="CLIENT COUNT:" className="mg-dim" />
              <HudLine text="265" className="mg-neon" sequential={false} />
            </p>
            <p className="manifest-overview__row">
              <HudLine text="CLIENT NAMES:" className="mg-dim" />
              <HudLine text="ACCESS DENIED" className="mg-amber" />
            </p>
            <p className="manifest-overview__wait">
              <HudLine text="... WAITING FOR USER INPUT" className="mg-dim" />
            </p>
          </div>
          <Photo src={weave} alt="Carbon fiber weave through a circular aperture" area="tl" />
          </div>

          <div className="manifest-lead">
            <Reveal as="h2" className="manifest-figma__line">
              <DecryptedText
                text="unsere kunden:"
                animateOn="hover"
                speed={120}
                maxIterations={7}
                sequential={false}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:"
                className="decrypt-char-revealed"
                encryptedClassName="decrypt-char-encrypted"
              />
            </Reveal>
            <p className="manifest-figma__neon">
              <DecryptedText
                text="höchste"
                animateOn="hover"
                speed={120}
                maxIterations={7}
                sequential={false}
                characters="ABCDEFGHIJKLMNÖÄÜabcdefghijklmnöäü"
                className="decrypt-char-revealed"
                encryptedClassName="decrypt-char-encrypted"
              />
            </p>
            <p className="manifest-figma__neon">
              <DecryptedText
                text="anforderungen."
                animateOn="hover"
                speed={120}
                maxIterations={7}
                sequential={false}
                characters="ABCDEFGHIJKLMNÖÄÜabcdefghijklmnöäü."
                className="decrypt-char-revealed"
                encryptedClassName="decrypt-char-encrypted"
              />
            </p>
          </div>

          <Photo src={clkGtr} alt="Mercedes-Benz CLK GTR body shell in the workshop" area="tr" />

          <div className="manifest-principle">
            <Reveal as="p" className="manifest-figma__line">
              <DecryptedText
                text="Unser Grundsatz:"
                animateOn="hover"
                speed={120}
                maxIterations={7}
                sequential={false}
                characters="ABCDEFGHIJKLMNÖÄÜabcdefghijklmn:"
                className="decrypt-char-revealed"
                encryptedClassName="decrypt-char-encrypted"
              />
            </Reveal>
            <p className="manifest-figma__neon">
              <DecryptedText
                text="KOMPLEX, SCHNELL,"
                animateOn="hover"
                speed={120}
                maxIterations={7}
                sequential={false}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ, "
                className="decrypt-char-revealed"
                encryptedClassName="decrypt-char-encrypted"
              />
            </p>
            <p className="manifest-figma__neon">
              <DecryptedText
                text="INHOUSE"
                animateOn="hover"
                speed={120}
                maxIterations={7}
                sequential={false}
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                className="decrypt-char-revealed"
                encryptedClassName="decrypt-char-encrypted"
              />
            </p>
          </div>

          <div className="manifest-mission">
            <p className="manifest-mission__title">
              <HudLine text="*** MISSION STATEMENT ***" className="mg-dim" />
            </p>
            <p>
              <HudLine
                text="HIGH-PERFORMANCE PREMIUM CARBON-FIBER COMPOSITES."
                className="mg-muted"
              />
            </p>
            <p>
              <HudLine
                text="TURNING EXTREME ENGINEERING CHALLENGES INTO CARBON REALITY."
                className="mg-muted"
              />
            </p>
            <p>
              <HudLine
                text="COMBINING ADVANCED MATERIALS KNOWLEDGE WITH HIGH-PRECISION MANUFACTURING, WE TRANSFORM COMPLEX REQUIREMENTS INTO UNCOMPROMISING QUALITY."
                className="mg-muted"
                sequential={false}
              />
            </p>
          </div>

          <div className="manifest-bottom">
            <Photo src={precision} alt="Precision tool on a carbon fiber component" area="bl" />
            <Photo src={autoclave} alt="Open autoclave with technicians" area="br" />
          </div>
        </div>
        </div>
      </section>

      <div className="mg-bar mg-bar--values" aria-label="Company facts">
        <div className="mg-stat">
          <IconFlag />
          <span>
            SUPPLYING MAJORITY
            <br />
            OF F1 TEAMS
          </span>
        </div>
        <div className="mg-stat">
          <IconGlobe />
          <span>
            ACTIVE
            <br />
            WORLDWIDE
          </span>
        </div>
        <div className="mg-stat">
          <IconSpark />
          <span>
            SOPHISTICATED
            <br />
            MACHINERY
          </span>
        </div>
      </div>
    </div>
  );
}
