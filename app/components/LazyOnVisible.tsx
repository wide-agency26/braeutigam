"use client";

import {
  Component,
  type ComponentType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

class WidgetBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

interface LazyOnVisibleProps<Props extends object> {
  /** Factory matching next/dynamic's loader shape. */
  loader: () => Promise<{ default: ComponentType<Props> }>;
  /** Props forwarded to the loaded component once it mounts. */
  componentProps?: Partial<Props>;
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
export default function LazyOnVisible<Props extends object>({
  loader,
  componentProps,
  rootMargin = "200px",
  delayMs = 0,
  fallback = null,
  className,
  style,
}: LazyOnVisibleProps<Props>) {
  const ref = useRef<HTMLDivElement>(null);
  const [Comp, setComp] = useState<ComponentType<Props> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let loading = false;
    let io: IntersectionObserver | null = null;
    let delayTimer = 0;
    let retryTimer = 0;
    let attempts = 0;

    const load = () => {
      if (loading || cancelled) return;
      loading = true;
      attempts++;
      loader()
        .then(mod => {
          if (!cancelled) setComp(() => mod.default);
        })
        .catch(() => {
          loading = false;
          if (cancelled) return;
          if (attempts < 2) retryTimer = window.setTimeout(load, 1000);
          else setFailed(true);
        });
    };

    const observe = () => {
      if (cancelled) return;
      if (!("IntersectionObserver" in window)) { load(); return; }
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
      if (retryTimer) clearTimeout(retryTimer);
      io?.disconnect();
    };
  }, [loader, rootMargin, delayMs]);

  return (
    <div ref={ref} className={className} style={style} data-lazy-state={Comp ? "ready" : failed ? "failed" : "waiting"}>
      {Comp ? <WidgetBoundary fallback={fallback}><Comp {...((componentProps ?? {}) as Props)} /></WidgetBoundary> : fallback}
    </div>
  );
}
