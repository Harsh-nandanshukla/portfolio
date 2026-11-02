import type { Skill } from "@/data/content";
import { renderSkillIcon } from "@/lib/skill-icons";
import { cn } from "@/lib/utils";

/*
 * Small glass pill: logo + name. If the skill has no icon, or its key isn't in skill-icons.ts,
 * it renders as a text-only pill (same size and style), so there is never an empty icon slot.
 * Monochrome: --text-muted at rest, --text on hover (instant colour change; nothing animates).
 */
export function SkillPill({ skill, className }: { skill: Skill; className?: string }) {
  const icon = renderSkillIcon(skill.icon, {
    "aria-hidden": true,
    focusable: "false",
    className: "size-[18px] shrink-0",
  });

  return (
    <span
      data-skill-pill={icon ? "icon" : "text"}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface/60 px-4 text-[14px] font-medium whitespace-nowrap text-text-muted hover:border-text-muted/50 hover:text-text",
        className,
      )}
    >
      {icon}
      {skill.name}
    </span>
  );
}
