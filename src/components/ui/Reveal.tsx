"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";

/*
 * Scroll reveal (DESIGN.md Motion): fade + 16px rise, 0.5s ease-out, plays once when in view.
 * <Reveal stagger> fades its <RevealItem> children in one after another (0.08s apart).
 * Under prefers-reduced-motion everything shows instantly with no movement: globals.css forces
 * [data-reveal] visible (also before JS loads, and without JS). The starting styles below never depend
 * on the reduced-motion setting, so server HTML and the first client render match (no hydration
 * warning); only the timing does (DECISIONS #51).
 */

const RISE_PX = 16;
const DURATION_S = 0.5;
const STAGGER_S = 0.08;

function itemVariants(reduce: boolean): Variants {
  const transition: Transition = reduce ? { duration: 0 } : { duration: DURATION_S, ease: "easeOut" };
  return {
    hidden: { opacity: 0, y: RISE_PX },
    visible: { opacity: 1, y: 0, transition },
  };
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animate <RevealItem> children one after another instead of the wrapper as a whole. */
  stagger?: boolean;
}

export function Reveal({ children, className, stagger = false }: RevealProps) {
  const reduce = useReducedMotion() ?? false;

  const variants: Variants = stagger
    ? { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : STAGGER_S } } }
    : itemVariants(reduce);

  return (
    <motion.div
      data-reveal={stagger ? undefined : ""}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

/** A child of <Reveal stagger>. Picks up the parent's timing automatically. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div data-reveal="" className={className} variants={itemVariants(reduce)}>
      {children}
    </motion.div>
  );
}
