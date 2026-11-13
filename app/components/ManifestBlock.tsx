"use client";

import React, { useMemo } from "react";
import Image, { type StaticImageData } from "next/image";
import dynamic from "next/dynamic";
import { useTheme } from "./ThemeProvider";
import { readCssVarColor } from "@/lib/css-var-color";
import tlCarbon from "../../public/images/manifest/figma/tl-carbon-939-297.png";
import trClk from "../../public/images/manifest/figma/tr-clk-939-301.png";
import blPrecision from "../../public/images/manifest/figma/bl-precision-1330-1356.png";
import brAutoclave from "../../public/images/manifest/figma/br-autoclave-1330-1362.png";
import "./ManifestSection.css";

const LineWaves = dynamic(() => import("./LineWaves"), { ssr: false });

const PHOTO_SIZES = {
  tl: "(max-width: 1100px) 100vw, 346px",
  tr: "(max-width: 1100px) 100vw, 500px",
  bl: "(max-width: 1100px) 100vw, 447px",
  br: "(max-width: 1100px) 100vw, 707px",
} as const;

function FigmaWrap({
  light,
  dark,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  light: string;
  dark: string;
}) {
  return (
    <div
      className={className}
      data-figma-node={light}
      data-figma-node-dark={dark}
      {...rest}
    >
      {children}
    </div>
  );
}

function ManifestPhoto({
  src,
  alt,
  area,
  light,
  dark,
  crop,
}: {
  src: StaticImageData;
  alt: string;
  area: keyof typeof PHOTO_SIZES;
  light: string;
  dark: string;
  crop?: boolean;
}) {
  const image = (
    <Image src={src} alt={alt} fill className="object-cover" sizes={PHOTO_SIZES[area]} />
  );

  return (
    <FigmaWrap light={light} dark={dark} className={`manifest-photo manifest-photo--${area}`}>
      {crop ? <div className="manifest-photo__crop">{image}</div> : image}
    </FigmaWrap>
  );
}

export default function ManifestBlock() {
  const { isDark } = useTheme();
  const waveColors = useMemo(
    () => ({
      color1: readCssVarColor("--text-default-accent"),
      color2: readCssVarColor("--text-default-accent-subtle"),
      color3: readCssVarColor("--text-default-accent"),
      brightness: isDark ? 0.55 : 0.85,
    }),
    [isDark],
  );

  return (
    <section
      id="craft-technology"
      className="manifest-section cv-auto relative"
      lang="de"
      data-figma-node="2006:220"
      data-figma-node-dark="937:253"
    >
      <div
        className="manifest-section__waves"
        data-rebuild-layer="LineWaves"
        aria-hidden
      >
        <div className="absolute inset-0">
          <LineWaves
          speed={0.1}
          innerLineCount={35}
          outerLineCount={20}
          warpIntensity={1.0}
          rotation={59}
          edgeFadeWidth={0.05}
          colorCycleSpeed={0}
          brightness={waveColors.brightness}
          color1={waveColors.color1}
          color2={waveColors.color2}
          color3={waveColors.color3}
          enableMouseInteraction={false}
          mouseInfluence={0}
          initWhenMounted
        />
        </div>
      </div>
      <div className="manifest-frame">
        <div className="manifest-stage">
          <FigmaWrap light="2006:221" dark="1330:881" className="manifest-stack">
            <FigmaWrap light="2006:222" dark="1330:737" className="manifest-hud copy-tiny">
              <p className="manifest-hud__title" data-figma-node="2006:223" data-figma-node-dark="1330:738">
                *** CLIENT OVERVIEW ***
              </p>
              <div className="manifest-hud__pairs">
                <div className="manifest-hud__row" data-figma-node="2006:224" data-figma-node-dark="1330:740">
                  <span className="manifest-hud__label" data-figma-node="2006:225" data-figma-node-dark="1330:741">
                    CLIENT COUNT:
                  </span>
                  <span className="manifest-hud__accent" data-figma-node="2006:226" data-figma-node-dark="1330:742">
                    265
                  </span>
                </div>
                <div className="manifest-hud__row" data-figma-node="2006:227" data-figma-node-dark="1330:744">
                  <span className="manifest-hud__label" data-figma-node="2006:228" data-figma-node-dark="1330:745">
                    CLIENT NAMEs:
                  </span>
                  <span className="manifest-hud__denied" data-figma-node="2006:229" data-figma-node-dark="1330:746">
                    ACCESS DENIED
                  </span>
                </div>
              </div>
              <p className="manifest-hud__label" data-figma-node="2006:231" data-figma-node-dark="1330:748">
                ... Waiting for user input
              </p>
            </FigmaWrap>
            <FigmaWrap light="2006:232" dark="1330:818" className="manifest-tl-slot manifest-tl-slot--carbon">
              <ManifestPhoto
                src={tlCarbon}
                alt="Carbon fiber weave through a circular aperture"
                area="tl"
                light="2006:233"
                dark="939:297"
                crop
              />
            </FigmaWrap>
          </FigmaWrap>

          <FigmaWrap light="2006:234" dark="939:278" className="manifest-lead">
            <FigmaWrap light="2006:235" dark="937:265" className="manifest-headline-block">
              <p className="manifest-title-univers">UNSERE KUNDEN:</p>
              <p className="manifest-title-bootzy">höchste </p>
              <p className="manifest-title-bootzy">anforderungen.</p>
            </FigmaWrap>
          </FigmaWrap>

          <ManifestPhoto
            src={trClk}
            alt="Mercedes-Benz CLK GTR body shell in the workshop"
            area="tr"
            light="2006:236"
            dark="939:301"
          />

          <FigmaWrap light="2006:237" dark="939:279" className="manifest-principle">
            <FigmaWrap light="2006:238" dark="939:280" className="manifest-headline-block">
              <p className="manifest-title-univers">Unser Grundsatz:</p>
              <p className="manifest-title-bootzy">KOMPLEX, SCHNELL, </p>
              <p className="manifest-title-bootzy">INOUSE</p>
            </FigmaWrap>
          </FigmaWrap>

          <FigmaWrap light="2006:239" dark="945:53" className="manifest-mission">
            <FigmaWrap light="2006:240" dark="1330:747" className="manifest-hud manifest-hud--mission copy-tiny">
              <p className="manifest-hud__title" data-figma-node="2006:241" data-figma-node-dark="1330:750">
                *** MISSION STATEMENT ***
              </p>
              <div
                className="manifest-hud__details"
                data-figma-node="2006:242"
                data-figma-node-dark="1330:749"
              >
                <p className="manifest-hud__label">High-performance premium carbon-fiber composites.</p>
                <p className="manifest-hud__label">
                  Turning extreme engineering challenges into carbon realitY.
                </p>
                <p className="manifest-hud__label">
                  Combining advanced materials knowledge with high-precision manufacturing, we
                  transform complex requirements into uncompromising quality.
                </p>
              </div>
            </FigmaWrap>
          </FigmaWrap>

          <div
            className="manifest-row2-spacer"
            data-figma-node="2006:246"
            data-figma-node-dark="1330:820"
            aria-hidden
          />

          <FigmaWrap light="2006:247" dark="1330:1354" className="manifest-bottom">
            <FigmaWrap light="2006:248" dark="1330:1355" className="manifest-photo-slot manifest-photo-slot--bl">
              <ManifestPhoto
                src={blPrecision}
                alt="Precision tool on a carbon fiber component"
                area="bl"
                light="2006:249"
                dark="1330:1356"
              />
            </FigmaWrap>
            <FigmaWrap light="2006:285" dark="1330:1361" className="manifest-photo-slot manifest-photo-slot--br">
              <ManifestPhoto
                src={brAutoclave}
                alt="Open autoclave with technicians"
                area="br"
                light="2006:286"
                dark="1330:1362"
              />
            </FigmaWrap>
          </FigmaWrap>
        </div>
      </div>
    </section>
  );
}
