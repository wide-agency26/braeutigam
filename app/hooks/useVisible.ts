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
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let inViewport = false;
    let raf = 0;
    let attempts = 0;

    const sync = () => {
      const visible = inViewport && document.visibilityState === "visible";
      setState(prev =>
        prev.visible === visible && (prev.hasBeenVisible || !visible)
          ? prev
          : { visible, hasBeenVisible: prev.hasBeenVisible || visible }
      );
    };

    // Dynamic imports (ssr: false) can mount before the ref is attached.
    // Retry a few frames instead of bailing forever with hasBeenVisible=false.
    const attach = () => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) {
        if (attempts++ < 30) raf = requestAnimationFrame(attach);
        return;
      }

      io = new IntersectionObserver(
        ([entry]) => {
          inViewport = entry.isIntersecting;
          sync();
        },
        { rootMargin }
      );
      io.observe(el);
      document.addEventListener("visibilitychange", sync);
    };

    attach();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
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

/**
 * False until the page has had time to paint/hydrate AND the main thread is
 * idle — or the user interacts (after a short floor).
 *
 * Hero WebGL is decorative. Compiling it during hydration tanks TBT; waiting
 * a few hundred ms (or first pointer/key) keeps FCP clean while rings still
 * feel immediate.
 */
export function useAfterSettled(minMs = 500, idleTimeout = 1200) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const w = window as IdleWindow;
    let done = false;
    let idleHandle = 0;
    let minTimer = 0;
    let fallbackTimer = 0;
    const started = performance.now();

    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const armIdle = () => {
      if (typeof w.requestIdleCallback === "function") {
        idleHandle = w.requestIdleCallback(finish, { timeout: idleTimeout });
      } else {
        fallbackTimer = window.setTimeout(finish, 0);
      }
    };

    // Never start shader work before minMs — keeps it out of the critical path.
    minTimer = window.setTimeout(armIdle, minMs);

    // Interactive users shouldn't wait — unlock almost immediately.
    const onInteract = () => {
      if (performance.now() - started >= 100) finish();
    };
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });

    return () => {
      done = true;
      if (minTimer) clearTimeout(minTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (idleHandle) w.cancelIdleCallback?.(idleHandle);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
  }, [ready, minMs, idleTimeout]);

  return ready;
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
