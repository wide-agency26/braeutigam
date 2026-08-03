"use client";

import { RefObject, useEffect, useState, useSyncExternalStore } from "react";

export interface Visibility {
  /** Near the viewport right now, with the tab foregrounded. Gates frame loops. */
  visible: boolean;
  /**
   * Latches true the first time `visible` does. Gates one-time expensive setup
   * (WebGL context creation, shader compilation) so it happens at most once —
   * tearing a context down and rebuilding it on every scroll-by would cost far
   * more than keeping an idle one alive.
   */
  hasBeenVisible: boolean;
}

/**
 * Tracks whether an element is near the viewport AND the tab is visible.
 * Animation loops should bail out on `visible === false` so off-screen canvases
 * stop consuming GPU/CPU budget.
 */
export function useVisibility(
  ref: RefObject<Element | null>,
  rootMargin = "200px"
): Visibility {
  const [state, setState] = useState<Visibility>({
    visible: false,
    hasBeenVisible: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let inViewport = false;

    const sync = () => {
      const visible = inViewport && document.visibilityState === "visible";
      setState(prev =>
        prev.visible === visible && (prev.hasBeenVisible || !visible)
          ? prev
          : { visible, hasBeenVisible: prev.hasBeenVisible || visible }
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        sync();
      },
      { rootMargin }
    );
    io.observe(el);

    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, rootMargin]);

  return state;
}

/** Convenience wrapper for callers that only need the live visibility flag. */
export function useVisible(ref: RefObject<Element | null>, rootMargin = "200px") {
  return useVisibility(ref, rootMargin).visible;
}

type IdleWindow = typeof window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * False until the browser has painted and the main thread has gone idle.
 *
 * Compiling a shader is synchronous and blocks paint, so a canvas that mounts
 * eagerly pushes out FCP even when it is purely decorative. Gating setup on
 * this lets the hero render first and the canvas attach a beat later.
 */
export function useAfterPaint() {
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const w = window as IdleWindow;
    let idleHandle = 0;
    let outerFrame = 0;
    let innerFrame = 0;

    if (typeof w.requestIdleCallback === "function") {
      // Cap the wait so a permanently busy main thread still gets the canvas.
      idleHandle = w.requestIdleCallback(() => setPainted(true), { timeout: 600 });
    } else {
      // Two frames guarantees at least one paint has been committed.
      outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setPainted(true));
      });
    }

    return () => {
      if (idleHandle) w.cancelIdleCallback?.(idleHandle);
      if (outerFrame) cancelAnimationFrame(outerFrame);
      if (innerFrame) cancelAnimationFrame(innerFrame);
    };
  }, []);

  return painted;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}
