import type { Skill } from "@/data/content";

/*
 * Every skill grouped by category (DESIGN.md §6): the accessible, SEO-friendly list (real text).
 * Categories and their order come from the data (order of first appearance), so a new category
 * needs no component change.
 */

function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const group = groups.get(skill.category);
    if (group) group.push(skill);
    else groups.set(skill.category, [skill]);
  }
  return [...groups];
}

export function SkillsList({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {groupByCategory(skills).map(([category, items]) => (
        <div key={category} data-skill-category={category} className="flex flex-col gap-3">
          <h3 className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{category}</h3>
          <ul className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <li
                key={skill.name}
                className="rounded-full border border-border px-3 py-1 text-[14px] leading-[1.5] text-text/85"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
