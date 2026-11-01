"use client";

import { useEffect, useLayoutEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * Magic UI Number Ticker (installed via `npx shadcn@latest add "https://magicui.design/r/number-ticker.json"`), adapted:
 * - Timed ease-out tween (default 1.2s, DESIGN.md) instead of a spring, ending on exactly `value`.
 * - Counts up once, the first time it scrolls into view.
 * - The server HTML already holds the final value (no JS = correct number). On the client it is
 *   reset to `startValue` before paint and then counts up; under prefers-reduced-motion it just stays final.
 * - Screen readers get the final value only (the counting text is aria-hidden).
 * - Only the text changes; no layout properties animate (tabular-nums keeps the width steady).
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  /** Seconds. */
  duration?: number;
  /** Seconds to wait after coming into view. */
  delay?: number;
}

function format(n: number, decimals: number) {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function NumberTicker({
  value,
  startValue = 0,
  decimalPlaces = 0,
  duration = 1.2,
  delay = 0,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion() ?? false;
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const done = useRef(false);

  // Before first paint on the client: show the start value (unless reduced motion or already counted).
  useIsoLayoutEffect(() => {
    if (ref.current && !reduce && !done.current) ref.current.textContent = format(startValue, decimalPlaces);
  }, [reduce, startValue, decimalPlaces]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isInView || done.current) return;
    if (reduce) {
      el.textContent = format(value, decimalPlaces);
      done.current = true;
      return;
    }
    const controls = animate(startValue, value, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => {
        el.textContent = format(latest, decimalPlaces);
      },
      onComplete: () => {
        el.textContent = format(value, decimalPlaces);
        done.current = true;
      },
    });
    return () => {
      controls.stop();
      if (!done.current) el.textContent = format(value, decimalPlaces);
    };
  }, [isInView, reduce, value, startValue, decimalPlaces, duration, delay]);

  return (
    <span className={cn("inline-block tabular-nums", className)} {...props}>
      <span ref={ref} aria-hidden="true">
        {format(value, decimalPlaces)}
      </span>
      <span className="sr-only">{format(value, decimalPlaces)}</span>
    </span>
  );
}
