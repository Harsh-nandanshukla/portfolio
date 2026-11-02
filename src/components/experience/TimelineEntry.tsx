import { content, type ExperienceEntry } from "@/data/content";
import { EntryLinkButton } from "@/components/experience/EntryLinkButton";

/*
 * One job / research entry on the timeline (DESIGN.md §5): dates (mono), role, organization,
 * research title + mentor when present, the points, and the highlight metric in big gradient mono.
 * Every field is optional-aware, so an entry without a title, mentor, metric or link just skips it.
 */
export function TimelineEntry({ entry }: { entry: ExperienceEntry }) {
  const { mentorLabel, highlightAriaLabel, researchCode } = content.experienceSection;

  return (
    <article className="flex flex-col gap-5 rounded-[20px] border border-border bg-surface p-5 md:p-6">
      <header className="flex flex-col gap-1.5">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{entry.dates}</p>
        <h3 className="text-[20px] leading-tight font-semibold tracking-tight text-text md:text-[22px]">
          {entry.role}
        </h3>
        <p className="text-[15px] font-medium text-text/80">{entry.organization}</p>
      </header>

      {(entry.title || entry.mentor) && (
        <div className="flex flex-col gap-1">
          {entry.title && <p className="text-[15px] leading-[1.5] text-text italic">{entry.title}</p>}
          {entry.mentor && (
            <p className="text-[14px] leading-[1.5] text-text-muted">
              <span className="font-mono text-[12px] uppercase tracking-[0.08em]">{mentorLabel}</span>{" "}
              {entry.mentor}
            </p>
          )}
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {entry.points.map((point) => (
          <li key={point} className="flex gap-3 text-base leading-[1.6] text-text-muted">
            <span aria-hidden="true" className="mt-[0.7em] size-1 shrink-0 rounded-full bg-text-muted/60" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {entry.highlightMetric && (
        <p aria-label={`${highlightAriaLabel}: ${entry.highlightMetric}`}>
          <span className="inline-block bg-gradient bg-clip-text font-mono text-[18px] leading-snug font-semibold tracking-tight break-words text-transparent sm:text-[22px] md:text-[26px]">
            {entry.highlightMetric}
          </span>
        </p>
      )}

      {entry.link && (
        <EntryLinkButton
          href={entry.link.href}
          label={researchCode.label}
          ariaLabel={researchCode.ariaLabel.replace("{title}", entry.title ?? entry.organization)}
        />
      )}
    </article>
  );
}
