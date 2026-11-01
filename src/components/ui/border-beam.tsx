import { cn } from "@/lib/utils";

/*
 * Magic UI Border Beam (installed via `npx shadcn@latest add "https://magicui.design/r/border-beam.json"`), adapted:
 * - The stock version moves the beam with `offset-distance`. To animate only transform,
 *   this one spins a conic-gradient "comet" (CSS `rotate`, keyframes `border-beam-spin` in globals.css)
 *   behind a mask that shows only the 1px border ring.
 * - Colors come from the design tokens (cyan → violet).
 * - prefers-reduced-motion: the beam is hidden and the normal border stays.
 * Parent needs `position: relative` and a border radius.
 */

interface BorderBeamProps {
  /** Seconds per lap. */
  duration?: number;
  /** Border width in px. */
  borderWidth?: number;
  className?: string;
}

export function BorderBeam({ duration = 8, borderWidth = 1, className }: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("border-beam pointer-events-none absolute inset-0 rounded-[inherit] motion-reduce:hidden", className)}
      style={{ "--beam-width": `${borderWidth}px`, "--beam-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="border-beam-comet" />
    </div>
  );
}
