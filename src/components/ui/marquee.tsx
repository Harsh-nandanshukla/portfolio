"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Marquee (Magic UI, installed via shadcn, then adapted — DECISIONS #52).
 * The content is repeated `repeat` times and each copy slides left with the `marquee` keyframe
 * (translateX only). Copies after the first are aria-hidden duplicates for the loop.
 * Added on top of the original:
 *   - pauses while off-screen (IntersectionObserver sets data-offscreen; CSS pauses the animation);
 *   - pause on hover, reverse direction, and edge fade (mask) as options;
 *   - reduced motion is handled in globals.css only (no scrolling, duplicates hidden, the first copy
 *     wraps into a static row), so server and client render the same HTML.
 */

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Scroll left → right instead of right → left. */
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Fade the left/right edges into the background. */
  fadeEdges?: boolean;
  /** How many copies of the content to render (enough to cover wide screens). */
  repeat?: number;
}

export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  fadeEdges = false,
  repeat = 4,
  className,
  ...props
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete el.dataset.offscreen;
      else el.dataset.offscreen = "";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-marquee=""
      data-fade-edges={fadeEdges ? "" : undefined}
      className={cn("group/marquee flex gap-(--gap) overflow-hidden [--duration:50s] [--gap:0.75rem]", className)}
      {...props}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          data-marquee-track=""
          data-marquee-copy={i > 0 ? "" : undefined}
          aria-hidden={i > 0 ? true : undefined}
          className={cn(
            "flex shrink-0 animate-marquee items-center gap-(--gap)",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
