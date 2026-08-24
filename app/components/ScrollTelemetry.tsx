"use client";

import { useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

function statusFor(progress: number) {
  if (progress < 0.3) return "LOADING";
  if (progress < 0.65) return "NOMINAL";
  return "APPROVED";
}

function pctClass(progress: number) {
  if (progress >= 0.65) return "cad-hud__ok";
  if (progress >= 0.3) return "cad-hud__warn";
  return "";
}

/**
 * Scrollytelling HUD readout. Subscribes to the scroll spring directly and
 * writes text nodes, so scrolling never re-renders the page tree.
 */
export default function ScrollTelemetry({ progress }: { progress: MotionValue<number> }) {
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(progress, "change", (latest) => {
    const pct = Math.min(Math.round(latest * 100), 100);
    if (percentRef.current) {
      percentRef.current.textContent = `${pct}%`;
      percentRef.current.className = pctClass(latest);
    }
    if (statusRef.current) {
      statusRef.current.textContent = statusFor(latest);
      statusRef.current.className = latest < 0.3 ? "" : "cad-hud__ok";
    }
  });

  return (
    <div className="cad-hud__meta">
      <p>** PROJECT: AERO_HYPERCAR_V2.2 **</p>
      <p>
        PROGRESS: <span ref={percentRef}>0%</span>
      </p>
      <p>
        STATUS: <span ref={statusRef}>LOADING</span>
      </p>
      <p>COMPONENT: VEHICLE_RP_CHASSIS</p>
    </div>
  );
}
