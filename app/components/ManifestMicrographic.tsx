"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import "./ManifestMicrographic.css";

function CoreValuePill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="manifest-micro__pill">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={40} height={40} className="manifest-micro__pill-icon" />
      <span className="manifest-micro__pill-label">{label}</span>
    </div>
  );
}

function FlagStatIcon() {
  return (
    <svg className="manifest-micro__stat-svg" viewBox="0 0 50 50" fill="none" aria-hidden>
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

export function ManifestMicrographicTop() {
  return (
    <div className="manifest-micro">
      <div
        className="manifest-micro__strip manifest-micro__strip--top copy-tiny"
        data-figma-node="2006:162"
        data-figma-node-dark="971:52"
      >
        <div className="manifest-micro__col manifest-micro__col--start" data-figma-node="2006:167" data-figma-node-dark="1330:569">
          <div className="manifest-micro__stack-tight" data-figma-node="2006:168" data-figma-node-dark="1330:687">
            <p className="manifest-micro__body" data-figma-node="2006:169" data-figma-node-dark="1330:686">
              BRAEUTIGAM_WEBFILE
            </p>
            <p className="manifest-micro__accent-subtle" data-figma-node="2006:170" data-figma-node-dark="1330:688">
              ACCESS GRANTED
            </p>
          </div>
          <div className="manifest-micro__stack-loose" data-figma-node="2006:171" data-figma-node-dark="1330:588">
            <p className="manifest-micro__accent" data-figma-node="2006:172" data-figma-node-dark="974:153">
              {`>>_UPDATE LOADED`}
            </p>
            <div className="manifest-micro__credit-row" data-figma-node="2006:173" data-figma-node-dark="1330:689">
              <span className="manifest-micro__caption" data-figma-node="2006:174" data-figma-node-dark="1330:587">
                ©2026
              </span>
              <span className="manifest-micro__placeholder" data-figma-node="2006:175" data-figma-node-dark="974:154">
                MADE BY WIDE
              </span>
            </div>
          </div>
        </div>

        <div className="manifest-micro__col manifest-micro__col--center" data-figma-node="2006:163" data-figma-node-dark="1330:558">
          <div className="manifest-micro__stack-12" data-figma-node="2006:164" data-figma-node-dark="1330:682">
            <p className="manifest-micro__amber" data-figma-node="2006:165" data-figma-node-dark="1330:683">
              PRODUCTION MANIFEST... loading
            </p>
            <p className="manifest-micro__accent-subtle" data-figma-node="2006:166" data-figma-node-dark="1330:690">
              FOUND: [CORE VALUES]
            </p>
          </div>
        </div>

        <div className="manifest-micro__col manifest-micro__col--end" data-figma-node="2006:176" data-figma-node-dark="1330:724">
          <p className="manifest-micro__placeholder manifest-micro__core-label" data-figma-node="2006:177" data-figma-node-dark="1330:723">
            CORE VALUE definition:
          </p>
          <div className="manifest-micro__pills" data-figma-node="2006:178" data-figma-node-dark="1330:685">
            <CoreValuePill icon="/icons/figma/mg-speed.svg" label="speed" />
            <CoreValuePill icon="/icons/figma/mg-complexity.svg" label="complexity" />
            <CoreValuePill icon="/icons/figma/mg-inhouse.svg" label="inhouse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ManifestMicrographicBottom() {
  const { isDark } = useTheme();
  const globeIcon = isDark ? "/icons/figma/mg-globe-dark.svg" : "/icons/figma/mg-globe.svg";
  const sparkIcon = "/icons/figma/mg-spark.svg";

  return (
    <div className="manifest-micro">
      <div
        className="manifest-micro__strip manifest-micro__strip--bottom copy-tiny"
        data-figma-node="2006:287"
        data-figma-node-dark="1330:1118"
      >
        <div className="manifest-micro__col manifest-micro__col--stats" data-figma-node="2006:288" data-figma-node-dark="1330:1133">
          <div className="manifest-micro__stats" data-figma-node="2006:289" data-figma-node-dark="1330:1134">
            <div className="manifest-micro__stat" data-figma-node="2006:290" data-figma-node-dark="1330:1149">
              <FlagStatIcon />
              <p className="manifest-micro__stat-copy" data-figma-node="2006:297" data-figma-node-dark="1330:1156">
                suppling mayority
                <br />
                of f1 teams
              </p>
            </div>
            <div className="manifest-micro__stat" data-figma-node="2006:298" data-figma-node-dark="1330:1157">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={globeIcon} alt="" width={50} height={50} className="manifest-micro__stat-img" />
              <p className="manifest-micro__stat-copy" data-figma-node="2006:300" data-figma-node-dark="1330:1159">
                active
                <br />
                Worldwide
              </p>
            </div>
            <div className="manifest-micro__stat" data-figma-node="2006:301" data-figma-node-dark="1330:1163">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sparkIcon} alt="" width={50} height={50} className="manifest-micro__stat-img" />
              <p className="manifest-micro__stat-copy" data-figma-node="2006:303" data-figma-node-dark="1330:1165">
                SOPHISTICATED
                <br />
                MACHINERY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
