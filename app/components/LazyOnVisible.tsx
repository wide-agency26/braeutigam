"use client";

import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface LazyOnVisibleProps {
  /** Factory matching next/dynamic's loader shape. */
  loader: () => Promise<{ default: ComponentType<any> }>;
  /** Props forwarded to the loaded component once it mounts. */
  componentProps?: Record<string, unknown>;
  /** How far before the placeholder enters the viewport to start loading. */
  rootMargin?: string;
  /**
   * Wait this many ms before even attaching the IntersectionObserver.
   * Useful for hero WebGL: don't download/parse the chunk during TBT.
   */
  delayMs?: number;
  /** Optional placeholder to reserve layout space while idle/loading. */
  fallback?: ReactNode;
  /** Extra class names on the sentinel wrapper. */
  className?: string;
  /** Inline styles on the sentinel (e.g. minHeight to avoid CLS). */
  style?: React.CSSProperties;
}

/**
 * Code-splits a client component AND delays the network request until the
 * sentinel is near the viewport. Plain `next/dynamic` still downloads the
 * chunk during hydration; this waits for an IntersectionObserver hit.
 */
export default function LazyOnVisible({
  loader,
  componentProps,
  rootMargin = "200px",
  delayMs = 0,
  fallback = null,
  className,
  style,
}: LazyOnVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Comp, setComp] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let loading = false;
    let io: IntersectionObserver | null = null;
    let delayTimer = 0;

    const load = () => {
      if (loading || cancelled) return;
      loading = true;
      loader()
        .then(mod => {
          if (!cancelled) setComp(() => mod.default);
        })
        .catch(() => {
          loading = false;
        });
    };

    const observe = () => {
      if (cancelled) return;
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io?.disconnect();
            load();
          }
        },
        { rootMargin }
      );
      io.observe(el);
    };

    if (delayMs > 0) {
      delayTimer = window.setTimeout(observe, delayMs);
    } else {
      observe();
    }

    return () => {
      cancelled = true;
      if (delayTimer) clearTimeout(delayTimer);
      io?.disconnect();
    };
  }, [loader, rootMargin, delayMs]);

  return (
    <div ref={ref} className={className} style={style}>
      {Comp ? <Comp {...componentProps} /> : fallback}
    </div>
  );
}
