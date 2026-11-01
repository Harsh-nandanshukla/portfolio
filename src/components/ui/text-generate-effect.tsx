"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * Aceternity UI "Text Generate Effect" (installed via `npx shadcn@latest add @aceternity/text-generate-effect`).
 * Words fade in from blur, one after another.
 * Project changes: design-token colors instead of black/white, renders a <p>,
 * `start` / `delayS` props so the hero intro can sequence it, instant under reduced motion,
 * and the text stays readable without JavaScript (see [data-text-generate] in globals.css).
 */

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerS = 0.08,
  delayS = 0,
  start = true,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  /** Fade duration of each word, in seconds. */
  duration?: number;
  /** Delay between words, in seconds. */
  staggerS?: number;
  /** Delay before the first word, in seconds. */
  delayS?: number;
  /** Set to false to hold the words hidden until the parent is ready. */
  start?: boolean;
}) => {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion() ?? false;
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!start || !scope.current) return;
    const controls = animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      reduce
        ? { duration: 0 }
        : { duration, delay: stagger(staggerS, { startDelay: delayS }), ease: "easeOut" },
    );
    return () => controls.stop();
  }, [start, reduce, filter, duration, staggerS, delayS, animate, scope]);

  return (
    <p ref={scope} data-text-generate="" className={cn("text-text-muted", className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </p>
  );
};
