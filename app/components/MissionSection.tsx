"use client";

import Image from "next/image";
import SiteButton from "./SiteButton";
import "./MissionSection.css";

const MISSION_COPY =
  "Every racing component begins as a highly optimized CAD design. We run extensive Finite Element Analysis (FEA) to align carbon fiber weave orientations exactly with the load paths, maximizing rigidity while removing every unnecessary gram of material.";

export default function MissionSection() {
  return (
    <section
      id="mission"
      className="mission-section cv-auto"
      data-figma-node="2006:469"
      data-figma-node-dark="989:2"
    >
      <div className="mission-section__grid">
        <div className="mission-section__watermark" data-figma-node="2006:470" data-figma-node-dark="1275:534" aria-hidden>
          <p data-figma-node="2006:471" data-figma-node-dark="989:4">
            OUR
            <br />
            CRAFT
          </p>
        </div>

        <aside className="mission-section__sidebar" data-figma-node="2006:472" data-figma-node-dark="1334:1722" aria-label="Craft principles">
          <div className="mission-section__pill" data-figma-node="2006:473" data-figma-node-dark="1334:1737">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mission/figma/icon-experts.svg"
              alt=""
              width={50}
              height={47}
              data-figma-node="2006:474"
            />
            <p className="copy-tiny" data-figma-node="2006:500" data-figma-node-dark="1334:1744">
              end 2 end
              <br />
              experts
            </p>
          </div>
          <div className="mission-section__pill" data-figma-node="2006:501" data-figma-node-dark="1334:1745">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mission/figma/icon-craft.svg"
              alt=""
              width={50}
              height={50}
              data-figma-node="2006:502"
              data-figma-node-dark="1334:1789"
            />
            <p className="copy-tiny" data-figma-node="2006:503" data-figma-node-dark="1334:1747">
              precision
              <br />
              craft
            </p>
          </div>
          <div className="mission-section__pill" data-figma-node="2006:504" data-figma-node-dark="1334:1751">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mission/figma/icon-execution.svg"
              alt=""
              width={50}
              height={50}
              data-figma-node="2006:505"
              data-figma-node-dark="1334:1792"
            />
            <p className="copy-tiny" data-figma-node="2006:506" data-figma-node-dark="1334:1753">
              Flawless
              <br />
              Execution
            </p>
          </div>
        </aside>

        <div className="mission-section__headlines" data-figma-node="2006:512" data-figma-node-dark="989:5">
          <p className="mission-section__quality" data-figma-node="2006:513" data-figma-node-dark="989:6">
            Flawless QUALITY &amp;
          </p>
          <p className="mission-section__perf" data-figma-node="2006:514" data-figma-node-dark="989:7">
            HIGH performance.
          </p>
        </div>

        <div className="mission-section__image" data-figma-node="2006:507" data-figma-node-dark="1334:1879">
          <Image
            src="/images/mission/figma/mission-image.png"
            alt=""
            fill
            className="object-cover"
            sizes="500px"
            data-figma-node="2006:508"
          />
        </div>

        <div className="mission-section__info" data-figma-node="2006:509" data-figma-node-dark="989:11">
          <p className="mission-section__copy copy-body" data-figma-node="2006:510" data-figma-node-dark="989:13">
            {MISSION_COPY}
          </p>
          <div data-figma-node="2006:511" data-figma-node-dark="1273:503">
            <SiteButton href="#story">MANUFACTURING</SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
