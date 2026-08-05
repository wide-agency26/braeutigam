"use client";

import { useEffect, useRef, type RefObject } from "react";

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

/* Exponential smoothing time constant — the pointer target is chased rather
   than snapped to, which is what gives the holographic layers their weight. */
const FOLLOW_TAU = 0.12;
/* How long the transform keeps its CSS transition after the pointer enters,
   so the card eases toward the cursor instead of jumping to it. */
const ENTER_TRANSITION_MS = 180;

const NEUTRAL_VARS: Record<string, string> = {
  "--pointer-x": "50%",
  "--pointer-y": "50%",
  "--background-x": "50%",
  "--background-y": "50%",
  "--pointer-from-center": "0",
  "--pointer-from-top": "0.5",
  "--pointer-from-left": "0.5",
  "--rotate-x": "0deg",
  "--rotate-y": "0deg",
};

/**
 * Pointer-reactive 3D tilt exposing the holographic custom properties used by
 * reactbits' ProfileCard (`--pointer-*`, `--background-*`, `--rotate-*`), plus
 * an `is-tilting` class while the pointer is over the element.
 *
 * Values are written straight to inline style inside a rAF loop, so tilting
 * never triggers a React render. Opts out for coarse pointers and
 * reduced-motion users.
 *
 * @param intensity Peak rotation in degrees at the element's edge.
 * @returns Ref to attach to the element that owns the perspective.
 */
export function useCardTilt<T extends HTMLElement>(intensity = 10): RefObject<T | null> {
  const elRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const allowed =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!allowed) return;

    let rafId: number | null = null;
    let enterTimer: number | null = null;
    let active = false;
    let running = false;
    let lastTs = 0;
    let currentX = el.clientWidth / 2;
    let currentY = el.clientHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    const write = (vars: Record<string, string>) => {
      for (const [key, value] of Object.entries(vars)) el.style.setProperty(key, value);
    };

    const writeFromXY = (x: number, y: number) => {
      const width = el.clientWidth || 1;
      const height = el.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      write({
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(centerY, centerX) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 50) * intensity)}deg`,
        "--rotate-y": `${round((centerY / 50) * intensity)}deg`,
      });
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const k = 1 - Math.exp(-dt / FOLLOW_TAU);
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;
      writeFromXY(currentX, currentY);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(step);
        return;
      }

      currentX = targetX;
      currentY = targetY;
      writeFromXY(currentX, currentY);
      running = false;
      lastTs = 0;
      rafId = null;
    };

    const setTarget = (x: number, y: number) => {
      targetX = x;
      targetY = y;
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    const stopLoop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      running = false;
      lastTs = 0;
    };

    const offsetIn = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    /* Also driven from pointermove, not just pointerenter: these cards mount
       lazily on scroll, so the pointer can already be resting inside one and
       no enter event will ever arrive. */
    const activate = () => {
      if (active) return;
      active = true;
      el.classList.add("is-tilting", "is-tilt-entering");
      if (enterTimer) window.clearTimeout(enterTimer);
      enterTimer = window.setTimeout(() => {
        el.classList.remove("is-tilt-entering");
        enterTimer = null;
      }, ENTER_TRANSITION_MS);
    };

    const onEnter = (event: PointerEvent) => {
      activate();
      const { x, y } = offsetIn(event);
      setTarget(x, y);
    };

    const onMove = (event: PointerEvent) => {
      activate();
      const { x, y } = offsetIn(event);
      setTarget(x, y);
    };

    /* The return animation is handed to the CSS transition — cheaper than
       easing the vars back, and the sheen fades over the same window. */
    const onLeave = () => {
      active = false;
      if (enterTimer) window.clearTimeout(enterTimer);
      enterTimer = null;
      el.classList.remove("is-tilting", "is-tilt-entering");
      stopLoop();
      currentX = el.clientWidth / 2;
      currentY = el.clientHeight / 2;
      targetX = currentX;
      targetY = currentY;
      write(NEUTRAL_VARS);
    };

    writeFromXY(currentX, currentY);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (enterTimer) window.clearTimeout(enterTimer);
      stopLoop();
    };
  }, [intensity]);

  return elRef;
}
