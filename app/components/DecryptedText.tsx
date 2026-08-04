"use client";

import { useEffect, useRef, useMemo, useCallback } from 'react';

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: 0
};

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
}

/**
 * Scrambles text into place. The scramble is written with `textContent` on a
 * single node — one span per character would re-run line breaking on every
 * tick, which is ruinous at display sizes.
 */
export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once'
}: DecryptedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const outputRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDecryptedRef = useRef(animateOn !== 'click');
  const hasAnimatedRef = useRef(false);

  const availableChars = useMemo(
    () =>
      useOriginalCharsOnly
        ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
        : characters.split(''),
    [useOriginalCharsOnly, text, characters]
  );

  const shuffleText = useCallback(
    (revealed: Set<number>) =>
      text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (revealed.has(i)) return char;
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(''),
    [availableChars, text]
  );

  const computeOrder = useCallback(
    (len: number) => {
      const order: number[] = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        const idx = offset % 2 === 0 ? middle + offset / 2 : middle - Math.ceil(offset / 2);
        if (idx >= 0 && idx < len) order.push(idx);
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const paint = useCallback((value: string, encrypted: boolean) => {
    const node = outputRef.current;
    if (!node) return;
    node.textContent = value;
    node.className = encrypted ? encryptedClassName : className;
  }, [className, encryptedClassName]);

  const settle = useCallback(() => {
    stop();
    isDecryptedRef.current = true;
    paint(text, false);
  }, [paint, stop, text]);

  const run = useCallback(() => {
    stop();

    const order = computeOrder(text.length);
    const revealed = new Set<number>();
    let iteration = 0;
    let pointer = 0;

    isDecryptedRef.current = false;
    paint(shuffleText(revealed), true);

    intervalRef.current = setInterval(() => {
      if (sequential) {
        if (pointer >= order.length) {
          settle();
          return;
        }
        revealed.add(order[pointer++]);
        paint(shuffleText(revealed), revealed.size < text.length);
        if (revealed.size >= text.length) settle();
        return;
      }

      iteration++;
      if (iteration >= maxIterations) {
        settle();
        return;
      }
      paint(shuffleText(revealed), true);
    }, speed);
  }, [computeOrder, maxIterations, paint, sequential, settle, shuffleText, speed, stop, text.length]);

  /* Reset whenever the source text or trigger changes */
  useEffect(() => {
    stop();
    if (animateOn === 'click') {
      isDecryptedRef.current = false;
      paint(shuffleText(new Set()), true);
    } else {
      settle();
    }
    return stop;
  }, [animateOn, text, paint, settle, shuffleText, stop]);

  /* View observer */
  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            run();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animateOn, run]);

  const handleClick = () => {
    if (animateOn !== 'click') return;
    if (clickMode === 'once' && isDecryptedRef.current) return;
    run();
  };

  const interaction =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: () => {
            if (!intervalRef.current) run();
          },
          onMouseLeave: settle
        }
      : animateOn === 'click'
        ? { onClick: handleClick }
        : {};

  return (
    <span
      className={parentClassName}
      ref={containerRef}
      style={{ display: 'inline', whiteSpace: 'pre-wrap' }}
      {...interaction}
    >
      <span style={srOnly}>{text}</span>
      <span ref={outputRef} aria-hidden="true" className={className}>
        {text}
      </span>
    </span>
  );
}
