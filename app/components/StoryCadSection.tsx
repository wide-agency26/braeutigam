"use client";

import Image from "next/image";
import type { MotionValue } from "framer-motion";
import { m } from "framer-motion";
import { useRef, type RefObject } from "react";
import { useMotionValueEvent } from "framer-motion";
import LazyOnVisible from "./LazyOnVisible";
import CompositeSpecCard from "./CompositeSpecCard";
import "./StoryCadSection.css";
import "./CadTopographyPoster.css";

const loadTopography = () => import("./Topography");

const STORY_COPY =
  "Our finished carbon fiber structures undergo strict quality assurance. Every component is ultrasonically scanned and CNC inspected, ensuring tolerance thresholds of less than 0.05mm and absolute structural compliance.";

function ScrollCadProgress({ progress }: { progress: MotionValue<number> }) {
  const percentRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(progress, "change", (latest) => {
    const pct = Math.min(Math.round(latest * 100), 100);
    if (percentRef.current) percentRef.current.textContent = `${pct}%`;
  });

  return (
    <span ref={percentRef} data-figma-node="2006:320">
      0%
    </span>
  );
}

function StoryCadStatus({ progress }: { progress: MotionValue<number> }) {
  const statusRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(progress, "change", (latest) => {
    if (statusRef.current) {
      statusRef.current.textContent =
        latest < 0.3 ? "Loading" : latest < 0.65 ? "Nominal" : "Approved";
    }
  });

  return (
    <span ref={statusRef} data-figma-node="2006:323">
      Loading
    </span>
  );
}

export type StoryCadSectionProps = {
  scrollyRef: RefObject<HTMLDivElement | null>;
  smoothScrollProgress: MotionValue<number>;
  opacityBlueprint: MotionValue<number>;
  scaleBlueprint: MotionValue<number>;
  opacityAutoclave: MotionValue<number>;
  scaleAutoclave: MotionValue<number>;
  opacityFinished: MotionValue<number>;
  scaleFinished: MotionValue<number>;
  opacitySpecEarly: MotionValue<number>;
  opacitySpecLate: MotionValue<number>;
  topographyColors: {
    lowColor: string;
    midColor: string;
    highColor: string;
  };
};

export default function StoryCadSection({
  scrollyRef,
  smoothScrollProgress,
  opacityBlueprint,
  scaleBlueprint,
  opacityAutoclave,
  scaleAutoclave,
  opacityFinished,
  scaleFinished,
  opacitySpecEarly,
  opacitySpecLate,
  topographyColors,
}: StoryCadSectionProps) {
  return (
    <section
      id="story"
      ref={scrollyRef}
      className="story-cad-track cv-auto relative"
      data-figma-node="2006:304"
      data-figma-node-dark="1334:1500"
    >
      <div className="story-cad-viewport">
        <div
          className="cad-topo-stage absolute inset-0"
          data-rebuild-layer="Topography"
          aria-hidden
        >
          <div className="cad-topo-poster" />
          <LazyOnVisible
            loader={loadTopography}
            rootMargin="200px"
            className="absolute inset-0"
            componentProps={{
              lowColor: topographyColors.lowColor,
              midColor: topographyColors.midColor,
              highColor: topographyColors.highColor,
              speed: 0.35,
              morphAmount: 3,
              morphSpeed: 0.02,
              bands: 3,
              thickness: 0.01,
              scale: 2,
              pixelSize: 1,
              glow: 0.5,
              colorMode: "elevation",
              contrast: 3,
              brightness: 0.35,
              fillBands: true,
              opacity: 1,
              grain: true,
              grainIntensity: 0.05,
              mouseInteraction: true,
              mouseRadius: 0.3,
              mouseStrength: 0.4,
            }}
          />
        </div>

        <div className="story-cad-grid copy-tiny">
          <div
            className="story-cad__progress"
            data-figma-node="2006:313"
            data-figma-node-dark="1334:1509"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/story/figma/cad-status-dot.svg"
              alt=""
              className="story-cad__status-dot"
              data-figma-node="2006:314"
            />
            <p className="story-cad__body m-0" data-figma-node="2006:315">
              RENDER ENGINE: OPENGL_3D_COMPOSE
            </p>
          </div>

          <div
            className="story-cad__telemetry story-cad__body"
            data-figma-node="2006:316"
            data-figma-node-dark="1334:1512"
          >
            <p className="story-cad__body--accent m-0 w-full" data-figma-node="2006:317">
              *** project: AERO_HYPERCAR_v2.2 ***
            </p>
            <div className="story-cad__telemetry-row w-full" data-figma-node="2006:318">
              <span data-figma-node="2006:319">progress:</span>
              <ScrollCadProgress progress={smoothScrollProgress} />
            </div>
            <div className="story-cad__telemetry-row w-full" data-figma-node="2006:321">
              <span data-figma-node="2006:322">status:</span>
              <StoryCadStatus progress={smoothScrollProgress} />
            </div>
            <div className="story-cad__telemetry-row w-full" data-figma-node="2006:324">
              <span data-figma-node="2006:325">component:</span>
              <span data-figma-node="2006:326">VEHICLE_BR_CHASSIS</span>
            </div>
          </div>

          <div
            className="story-cad__part-stage"
            data-figma-node="2006:327"
            data-figma-node-dark="1334:1521"
          >
            <div className="story-cad__part-stack" data-figma-node="2006:328">
              <m.div
                style={{ opacity: opacityBlueprint, scale: scaleBlueprint }}
                className="story-cad__part-layer"
              >
                <Image
                  src="/images/story/figma/cad-part-01.png"
                  alt=""
                  fill
                  className="story-cad__part-img"
                  sizes="1258px"
                />
              </m.div>
              <m.div
                style={{ opacity: opacityAutoclave, scale: scaleAutoclave }}
                className="story-cad__part-layer"
              >
                <Image
                  src="/images/story/figma/cad-part-02.png"
                  alt=""
                  fill
                  className="story-cad__part-img"
                  sizes="1258px"
                />
              </m.div>
              <m.div
                style={{ opacity: opacityFinished, scale: scaleFinished }}
                className="story-cad__part-layer"
              >
                <Image
                  src="/images/story/figma/cad-part-03.png"
                  alt=""
                  fill
                  className="story-cad__part-img"
                  sizes="1258px"
                />
              </m.div>
            </div>
          </div>

          <div
            className="story-cad__coords"
            data-figma-node="2006:329"
            data-figma-node-dark="1334:1523"
          >
            <p className="story-cad__coords-text copy-caption" data-figma-node="2006:333">{`AXIS_X: +1.28   AXIS_Y: -0.49   AXIS_Z: +0.00`}</p>
          </div>

          <p
            className="story-cad__description story-cad__description--sentence"
            data-figma-node="2006:358"
            data-figma-node-dark="1334:1528"
          >
            {STORY_COPY}
          </p>

          <div className="story-cad__specs">
            <div className="relative grid w-full">
              <m.div style={{ opacity: opacitySpecEarly }} className="col-start-1 row-start-1">
                <CompositeSpecCard badge="[CERTIFIED]" badgeNodeId="2006:338" />
              </m.div>
              <m.div style={{ opacity: opacitySpecLate }} className="col-start-1 row-start-1">
                <CompositeSpecCard badge="[QC CERTIFIED]" badgeNodeId="2006:338" />
              </m.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
