"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Pipeline stages as chips, connected left to right (wrapping on small screens).
 * They light up one after another; after the last one, all hold lit briefly, then the loop restarts.
 * Pauses when off-screen or when the tab is hidden. Under prefers-reduced-motion all chips are lit and static.
 * "Lit" is an overlay faded in with opacity, so only opacity animates.
 */

const STEP_MS = 650; // time between chips lighting up
const HOLD_STEPS = 3; // extra steps with every chip lit before restarting

export function PipelineChips({ stages, ariaLabel }: { stages: string[]; ariaLabel: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.3 });
  // Number of chips currently lit (0 … stages.length). Starts fully lit so the server HTML / no-JS view is complete.
  const [lit, setLit] = useState(stages.length);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const running = inView && visible && !reduce;
  // Position in the loop; kept across pauses so the loop resumes where it stopped.
  const step = useRef(stages.length);

  useEffect(() => {
    if (!running) return;
    const total = stages.length + 1 + HOLD_STEPS; // 0 lit, 1 … n lit, then hold
    const id = window.setInterval(() => {
      step.current = (step.current + 1) % total;
      setLit(Math.min(step.current, stages.length));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [running, stages.length]);

  const shown = reduce ? stages.length : lit;

  return (
    <ol ref={ref} aria-label={ariaLabel} className="flex flex-wrap items-center gap-y-2">
      {stages.map((stage, i) => {
        const on = i < shown;
        const current = !reduce && running && i === shown - 1;
        return (
          <li key={stage} className="flex items-center">
            <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-bg/60 px-3 py-1.5 font-mono text-[12px] text-text-muted">
              {/* Lit layer */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 rounded-[inherit] border border-accent-1/50 bg-accent-1/10 transition-opacity duration-300 motion-reduce:transition-none",
                  on ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 rounded-[inherit] shadow-[0_0_18px_-2px] shadow-accent-1/60 transition-opacity duration-300 motion-reduce:transition-none",
                  current ? "opacity-100" : "opacity-0",
                )}
              />
              <span className={cn("relative transition-opacity duration-300", on ? "text-accent-1" : "opacity-60")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative text-text">{stage}</span>
            </span>
            {i < stages.length - 1 && (
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  "mx-1 size-4 shrink-0 text-accent-1 transition-opacity duration-300 motion-reduce:transition-none",
                  i < shown - 1 ? "opacity-90" : "opacity-25",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
