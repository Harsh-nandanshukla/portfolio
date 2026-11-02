import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { SkillsMarquee } from "@/components/skills/SkillsMarquee";
import { SkillsList } from "@/components/skills/SkillsList";

/*
 * Skills (DESIGN.md §6): two logo marquee rows, then every skill grouped by category.
 * Everything renders from content.skills — adding a skill = adding one object.
 */
export function Skills() {
  const { id, label } = content.sections.skills;
  const headingId = `${id}-heading`;

  return (
    <section id={id} tabIndex={-1} aria-labelledby={headingId} className="scroll-mt-24 focus:outline-none">
      <Reveal className="mb-10 md:mb-12">
        <h2 id={headingId} className="text-[30px] leading-tight font-semibold tracking-tight text-text md:text-[40px]">
          {label}
        </h2>
      </Reveal>

      <Reveal className="mb-12 md:mb-16">
        <SkillsMarquee skills={content.skills} />
      </Reveal>

      <Reveal>
        <SkillsList skills={content.skills} />
      </Reveal>
    </section>
  );
}
