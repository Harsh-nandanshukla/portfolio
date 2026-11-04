import type { Skill } from "@/data/content";
import { Marquee } from "@/components/ui/marquee";
import { SkillPill } from "@/components/skills/SkillPill";

/*
 * Two marquee rows of the `marquee: true` skills (DESIGN.md §6), split in half in data order:
 * row 1 scrolls right → left, row 2 left → right. Each row pauses on hover and fades at the edges.
 * The whole block is hidden from screen readers: the grouped list below is the accessible version.
 */
const MIN_PILLS_FOR_TWO_COPIES = 10;

export function SkillsMarquee({ skills }: { skills: Skill[] }) {
  const items = skills.filter((s) => s.marquee);
  if (items.length === 0) return null;

  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)].filter((row) => row.length > 0);

  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <Marquee
          key={i}
          reverse={i % 2 === 1}
          // A seamless loop needs one copy wider than the row (max 1072px). 10+ pills ≈ 1200px+,
          // so 2 copies are enough and halve the page's HTML; shorter rows keep 4 (DECISIONS #66).
          repeat={row.length >= MIN_PILLS_FOR_TWO_COPIES ? 2 : 4}
          pauseOnHover
          fadeEdges
          className="py-1"
        >
          {row.map((skill) => (
            <SkillPill key={skill.name} skill={skill} />
          ))}
        </Marquee>
      ))}
    </div>
  );
}
