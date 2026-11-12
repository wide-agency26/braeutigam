"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import weave from "../../public/images/grundsatz/figma/tl.jpg";
import clkGtr from "../../public/images/grundsatz/figma/tr.jpg";
import clientStill from "../../public/images/manifest/client-939-301.png";
import precision from "../../public/images/grundsatz/figma/bl.jpg";
import autoclave from "../../public/images/grundsatz/figma/br.jpg";
import "./ManifestSection.css";

/** TODO(client): confirm F1 supply claim before enabling. */
const SHOW_F1_CLAIM = false;
/** TODO(client): confirm CLK GTR imagery rights. */
const SHOW_CLK_GTR = false;

function HudLine({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <span className={className}>{text}</span>;
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

function FigmaStatIcon({ src, width = 50, height = 50 }: { src: string; width?: number; height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={width} height={height} aria-hidden className="block" />
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
      <div className="mg-bar copy-tiny" aria-label="System status">
        <div className="mg-bar__cluster">
          <HudLine text="BRAEUTIGAM_WEBFILE" className="" />
          <HudLine text="ACCESS GRANTED" className="mg-neon" />
          <HudLine text=">>_UPDATE LOADED" className="mg-neon" />
          <p className="mg-credit copy-tiny">
            <HudLine text="©2026 MADE BY WIDE" className="mg-dim" />
          </p>
        </div>
        <div className="mg-bar__cluster mg-bar__cluster--center">
          <HudLine text="PRODUCTION MANIFEST ... LOADING" className="mg-amber" />
          <HudLine text="FOUND! [CORE VALUES]" className="mg-neon" />
        </div>
        <div className="mg-bar__cluster mg-bar__cluster--end">
          <div className="mg-core">
            <span className="mg-core__label copy-tiny">CORE VALUE DEFINITION:</span>
            <div className="mg-core__row">
              <div className="mg-icon">
                <CoreValueIcon src="/icons/figma/pill-speed.svg" width={50} height={50} />
                <span className="copy-tiny">SPEED</span>
              </div>
              <div className="mg-icon">
                <CoreValueIcon src="/icons/figma/pill-complexity.svg" width={50} height={50} />
                <span className="copy-tiny">COMPLEXITY</span>
              </div>
              <div className="mg-icon">
                <CoreValueIcon src="/icons/figma/pill-inhouse.svg" width={50} height={50} />
                <span className="copy-tiny">INHOUSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="craft-technology" className="cv-auto relative" lang="de">
        <div className="manifest-frame">
        <div className="manifest-stage">
          <div className="manifest-stack">
          <div className="manifest-overview copy-tiny">
            <p className="manifest-overview__title">
              <HudLine text="*** CLIENT OVERVIEW ***" className="mg-dim" />
            </p>
            <p className="manifest-overview__row">
              <HudLine text="CLIENT COUNT:" className="mg-dim" />
              <HudLine text="265" className="mg-neon" />
            </p>
            <p className="manifest-overview__row">
              <HudLine text="CLIENT NAMES:" className="mg-dim" />
            </p>
            <p className="manifest-overview__wait">
              <HudLine text="... WAITING FOR USER INPUT" className="mg-dim" />
            </p>
          </div>
          <Photo src={weave} alt="Carbon fiber weave through a circular aperture" area="tl" />
          </div>

          <div className="manifest-lead">
            <h2 className="manifest-figma__line heading-primary-bold">unsere kunden:</h2>
            <p className="manifest-figma__neon decorative-primary">höchste</p>
            <p className="manifest-figma__neon decorative-primary">anforderungen.</p>
          </div>

          {SHOW_CLK_GTR ? (
            <Photo
              src={clkGtr}
              alt="Mercedes-Benz CLK GTR body shell in the workshop"
              area="tr"
            />
          ) : (
            <Photo
              src={clientStill}
              alt="Mercedes-Benz CLK GTR chassis in the workshop"
              area="tr"
            />
          )}

          <div className="manifest-principle">
            <p className="manifest-figma__line heading-primary-bold">Unser Grundsatz:</p>
            <p className="manifest-figma__neon decorative-primary">KOMPLEX, SCHNELL,</p>
            <p className="manifest-figma__neon decorative-primary">INHOUSE</p>
          </div>

          <div className="manifest-mission copy-tiny">
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

      <div className="mg-bar mg-bar--values copy-tiny" aria-label="Company facts">
        <div className="mg-stat">
          <FigmaStatIcon src="/icons/figma/stat-motorsport.svg" />
          <span className="copy-caption">
            {SHOW_F1_CLAIM ? (
              <>
                SUPPLYING MAJORITY
                <br />
                OF F1 TEAMS
              </>
            ) : (
              <>
                MOTORSPORT
                <br />
                & SERIES PARTNERS
              </>
            )}
          </span>
        </div>
        <div className="mg-stat">
          <FigmaStatIcon src="/icons/figma/stat-worldwide.svg" />
          <span className="copy-caption">
            ACTIVE
            <br />
            WORLDWIDE
          </span>
        </div>
        <div className="mg-stat">
          <FigmaStatIcon src="/icons/figma/stat-machinery.png" height={48} />
          <span className="copy-caption">
            SOPHISTICATED
            <br />
            MACHINERY
          </span>
        </div>
      </div>
    </div>
  );
}
