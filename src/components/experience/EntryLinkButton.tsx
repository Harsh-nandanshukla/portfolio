import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Outline link button for timeline entries (same look as the project tiles' secondary buttons). Opens in a new tab. */

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1";

interface EntryLinkButtonProps {
  href: string;
  label: string;
  ariaLabel: string;
  /** Smaller button for the compact cards. */
  small?: boolean;
}

export function EntryLinkButton({ href, label, ariaLabel, small = false }: EntryLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface/40 font-medium text-text transition-[background-color,border-color] hover:border-text-muted hover:bg-surface-hover",
        small ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-[14px]",
        focusRing,
      )}
    >
      {label}
      <ArrowUpRight className={small ? "size-3.5" : "size-4"} aria-hidden="true" />
    </a>
  );
}
