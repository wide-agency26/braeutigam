"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

interface RevealProps {
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span" | "section";
  variant?: "up" | "fade";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  amount?: number;
  once?: boolean;
}

/**
 * Lightweight stand-in for Framer `whileInView` fade/slide entrances.
 * Toggles a CSS class via IntersectionObserver — no animation JS per frame.
 */
export default function Reveal({
  as = "div",
  variant = "up",
  className = "",
  style,
  children,
  amount = 0.3,
  once = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-inview");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          if (once) io.disconnect();
        } else if (!once) {
          el.classList.remove("is-inview");
        }
      },
      { threshold: amount }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, once]);

  const base = variant === "fade" ? "reveal-fade" : "reveal-up";
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      style={style}
      className={`${base} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
