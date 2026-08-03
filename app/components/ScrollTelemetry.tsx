"use client";

import { useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

const STATES = ["01_WIRE_BLUEPRINT", "02_STRESS_AUTOCLAVE", "03_FINISHED_COMPOSITE"];

function stateFor(progress: number) {
  if (progress < 0.3) return STATES[0];
  if (progress < 0.65) return STATES[1];
  return STATES[2];
}

/**
 * Scrollytelling HUD readout. Subscribes to the scroll spring directly and
 * writes text nodes, so scrolling never re-renders the page tree.
 */
export default function ScrollTelemetry({ progress }: { progress: MotionValue<number> }) {
  const percentRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(progress, "change", (latest) => {
    const pct = Math.min(Math.round(latest * 100), 100);
    if (percentRef.current) percentRef.current.textContent = `${pct}%`;
    if (stateRef.current) stateRef.current.textContent = stateFor(latest);
  });

  return (
    <div className="flex items-center gap-6">
      <span>PROGRESS: <span ref={percentRef}>0%</span></span>
      <span>STATE: <span ref={stateRef}>{STATES[0]}</span></span>
    </div>
  );
}
