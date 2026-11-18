"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import weave from "../../public/images/grundsatz/figma/tl.webp";
import clkGtr from "../../public/images/grundsatz/figma/customer.webp";
import precision from "../../public/images/grundsatz/figma/bl.webp";
import autoclave from "../../public/images/grundsatz/figma/br.webp";
import "./ManifestSection.css";
import type { Locale } from "@/lib/i18n";

/** TODO(client): confirm F1 supply claim before enabling. */
const SHOW_F1_CLAIM = false;

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
  // These are small vector exports; raster optimization is unnecessary.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={width} height={height} />;
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

export default function ManifestBlock({ locale = "de" }: { locale?: Locale }) {
  const en = locale === "en";
  return (
    <div className="manifest-shell">
      <div className="mg-bar" aria-label="System status">
        <div className="mg-bar__cluster">
          <HudLine text="BRAEUTIGAM_WEBFILE" className="" />
          <HudLine text="ACCESS GRANTED" className="mg-neon" />
          <HudLine text=">>_UPDATE LOADED" className="mg-neon" />
          <p className="mg-credit">
            <HudLine text="©2026 MADE BY WIDE" className="mg-dim" />
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
                <CoreValueIcon src="/icons/figma/core-speed.svg" width={40} height={40} />
                <span>SPEED</span>
              </div>
              <div className="mg-icon">
                <CoreValueIcon src="/icons/figma/core-complexity.svg" width={42} height={41} />
                <span>COMPLEXITY</span>
              </div>
              <div className="mg-icon">
                <CoreValueIcon src="/icons/figma/core-inhouse.svg" width={46.67} height={40} />
                <span>INHOUSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="craft-technology" className="cv-auto relative" lang={locale}>
        <div className="manifest-frame">
        <div className="manifest-stage">
          <div className="manifest-stack">
          <div className="manifest-overview">
            <p className="manifest-overview__title">
              <HudLine text="*** CLIENT OVERVIEW ***" className="mg-dim" />
            </p>
            <p className="manifest-overview__row">
              <HudLine text="CLIENT COUNT:" className="mg-dim" />
              <HudLine text="265" className="mg-neon" />
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
            <h2 className="manifest-figma__line">{en ? "our clients:" : "unsere kunden:"}</h2>
            <p className="manifest-figma__neon">{en ? "highest" : "höchste"}</p>
            <p className="manifest-figma__neon">{en ? "standards." : "anforderungen."}</p>
          </div>

          <Photo src={clkGtr} alt="Mercedes-Benz CLK GTR in the Bräutigam workshop" area="tr" />

          <div className="manifest-principle">
            <p className="manifest-figma__line">{en ? "Our principle:" : "Unser Grundsatz:"}</p>
            <p className="manifest-figma__neon">{en ? "COMPLEX, FAST," : "KOMPLEX, SCHNELL,"}</p>
            <p className="manifest-figma__neon">INHOUSE</p>
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
          <CoreValueIcon src="/icons/figma/stat-motorsport.svg" width={50} height={48} />
          <span>
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
          <CoreValueIcon src="/icons/figma/stat-worldwide.svg" width={50} height={50} />
          <span>
            ACTIVE
            <br />
            WORLDWIDE
          </span>
        </div>
        <div className="mg-stat">
          <CoreValueIcon src="/icons/figma/stat-machinery.svg" width={50} height={50} />
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
