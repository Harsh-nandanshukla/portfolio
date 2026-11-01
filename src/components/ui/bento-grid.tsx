import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

/*
 * Aceternity Bento Grid (installed via `npx shadcn@latest add @aceternity/bento-grid`), adapted:
 * - Responsive columns: 1 (mobile) → 2 (md, 768px) → 3 (lg, 1024px).
 * - The grid is a <Reveal stagger>, so its tiles fade up one after another.
 * - <BentoGridItem large> spans the full width on tablet and 2 columns × 2 rows on desktop.
 * - Styling of the tile itself lives in the tile component (CardSpotlight), not here.
 */

export function BentoGrid({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <Reveal
      stagger
      className={cn("grid grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}
    >
      {children}
    </Reveal>
  );
}

export function BentoGridItem({
  className,
  large = false,
  children,
}: {
  className?: string;
  /** Featured tile: full width on tablet, 2 × 2 on desktop. */
  large?: boolean;
  children?: ReactNode;
}) {
  return (
    <RevealItem className={cn("flex min-w-0", large && "md:col-span-2 lg:row-span-2", className)}>
      {children}
    </RevealItem>
  );
}
