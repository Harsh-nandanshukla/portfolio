import type { ReactNode } from "react";

/*
 * Quieter timeline card for education / certifications: smaller padding and type,
 * translucent surface, no big metric. Content is passed in; all strings come from content.ts.
 */
interface CompactEntryProps {
  /** Small mono label, e.g. "Education". */
  label: string;
  title: string;
  lines: string[];
  dates?: string;
  children?: ReactNode;
}

export function CompactEntry({ label, title, lines, dates, children }: CompactEntryProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/50 p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-accent-1">{label}</p>
        {dates && <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-text-muted">{dates}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] leading-snug font-medium text-text">{title}</h3>
        {lines.map((line) => (
          <p key={line} className="text-[14px] leading-[1.5] text-text-muted">
            {line}
          </p>
        ))}
      </div>
      {children}
    </article>
  );
}
