"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

/*
 * Hero background (DESIGN.md §2).
 * - Desktop (≥768px) without reduced motion: the neural canvas, loaded lazily on the client only,
 *   so its code never delays the first paint.
 * - Mobile or reduced motion: no canvas, a static gradient glow from the design tokens.
 * The glow is hidden by CSS on desktop-with-motion from the very first paint, so it never flashes.
 */

const NeuralBackground = dynamic(() => import("@/components/NeuralBackground"), { ssr: false });

/** Same condition as the Tailwind classes `md:motion-safe:` below. */
const CANVAS_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(CANVAS_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function HeroBackground() {
  const showCanvas = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(CANVAS_QUERY).matches,
    () => false, // server render: no canvas
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
    >
      <div className="hero-glow absolute inset-0 md:motion-safe:hidden" />
      {showCanvas && <NeuralBackground />}
    </div>
  );
}
