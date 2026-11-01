"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * Card Spotlight (Aceternity look, rebuilt with motion — DECISIONS #39).
 * The official component adds a three.js "canvas reveal" layer; this keeps only the spotlight:
 * a soft cyan glow that follows the cursor, plus a brighter border, both shown on hover.
 * Only transform (glow position) and opacity (fade in/out) animate. No scale.
 * Under prefers-reduced-motion the glow stays put in the middle of the card (no cursor follow).
 */

const GLOW_SIZE = 520; // px, diameter of the spotlight circle

export function CardSpotlight({ className, children }: { className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function move(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (reduce) {
      x.set(r.width / 2 - GLOW_SIZE / 2);
      y.set(r.height / 2 - GLOW_SIZE / 2);
    } else {
      x.set(e.clientX - r.left - GLOW_SIZE / 2);
      y.set(e.clientY - r.top - GLOW_SIZE / 2);
    }
  }

  return (
    <div
      ref={ref}
      onPointerEnter={move}
      onPointerMove={move}
      className={cn(
        "group/spotlight relative isolate flex w-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface",
        className,
      )}
    >
      {/* Cursor glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 -z-10 rounded-full opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 motion-reduce:transition-none"
        style={{
          x,
          y,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          backgroundImage:
            "radial-gradient(circle at center, color-mix(in oklab, var(--accent-1) 14%, transparent), color-mix(in oklab, var(--accent-2) 6%, transparent) 40%, transparent 70%)",
        }}
      />
      {/* Brighter border on hover (an overlay fading in, so only opacity animates) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-accent-1/35 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 motion-reduce:transition-none"
      />
      {children}
    </div>
  );
}
