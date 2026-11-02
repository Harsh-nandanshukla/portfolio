"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * Tracing Beam (Aceternity, installed via shadcn, then rewritten — DECISIONS #47).
 * The official version animates SVG gradient attributes (y1/y2), uses hardcoded colors and measures
 * its height only once. This keeps the look but:
 *   - fills a vertical cyan → violet line with `scaleY` (transform only) as the section scrolls past
 *     the middle of the screen, so it needs no measuring and survives resizes;
 *   - <TracingBeamItem> puts a dot on the line next to each entry, lit (opacity + scale) while the
 *     entry's top is above the middle of the screen, i.e. when the fill has reached it (and unlit
 *     again when scrolling back up, so dots and fill always agree);
 *   - under prefers-reduced-motion the line is fully filled and every dot is lit, with no animation.
 *
 * Geometry: the content gets a left gutter (32px, 48px from md). The line's center sits 12px from the
 * left edge, and each dot is a 24px box at the gutter's start, so both line up at every width.
 */

const GUTTER = "pl-8 md:pl-12";
const DOT_OFFSET = "-left-8 md:-left-12";
/** Roughly where the dot sits below the entry's top. */
const DOT_TOP_PX = 28;
const FILL_GRADIENT = "linear-gradient(180deg, var(--accent-1), var(--accent-2))";

export function TracingBeam({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 500, damping: 90, restDelta: 0.001 });

  return (
    <div ref={ref} className={cn("relative", GUTTER, className)}>
      {/* Track */}
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-0.5 rounded-full bg-border" />
      {/* Gradient fill */}
      <motion.div
        aria-hidden="true"
        data-beam-fill=""
        className="absolute top-2 bottom-2 left-[11px] w-0.5 origin-top rounded-full motion-reduce:transform-none!"
        style={{ backgroundImage: FILL_GRADIENT, scaleY }}
      />
      {children}
    </div>
  );
}

interface TracingBeamItemProps {
  children: ReactNode;
  className?: string;
  /** Smaller, quieter dot (education / certification). */
  small?: boolean;
}

/** One entry on the beam, with its dot. */
export function TracingBeamItem({ children, className, small = false }: TracingBeamItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [reached, setReached] = useState(false);
  const { scrollY } = useScroll();

  // Same threshold as the fill: the entry's top (plus the dot's offset) has passed the screen's middle.
  const check = () => {
    const el = ref.current;
    if (el) setReached(el.getBoundingClientRect().top + DOT_TOP_PX <= window.innerHeight / 2);
  };
  useMotionValueEvent(scrollY, "change", check);
  useEffect(check, []);

  // Reduced motion is handled in CSS (motion-reduce:), not here, so the server HTML and the
  // first client render always match (no hydration warning).
  const lit = reached;

  return (
    <div ref={ref} data-beam-item="" data-lit={lit ? "" : undefined} className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className={cn("absolute flex size-6 items-center justify-center", DOT_OFFSET, small ? "top-4" : "top-5 md:top-6")}
      >
        {/* Resting dot */}
        <span className={cn("absolute rounded-full border border-border bg-bg", small ? "size-2.5" : "size-3.5")} />
        {/* Lit dot */}
        <motion.span
          className={cn(
            "absolute rounded-full bg-gradient shadow-[0_0_12px_var(--accent-1)]",
            small ? "size-2.5" : "size-3.5",
            "motion-reduce:transform-none! motion-reduce:opacity-100!",
          )}
          initial={false}
          animate={lit ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
        />
      </div>
      {children}
    </div>
  );
}
