import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ProjectTile } from "@/components/projects/ProjectTile";

/*
 * Projects — Bento Grid (DESIGN.md §4).
 * Tiles render from content.projects; featured projects come first and get the large tile
 * (2 × 2 on desktop, full width on tablet). Adding a project = adding one object in content.ts.
 */
export function Projects() {
  const { id, label } = content.sections.projects;
  const { intro } = content.projectsSection;
  // Stable sort: featured first, otherwise keep the data order.
  const projects = [...content.projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const headingId = `${id}-heading`;

  return (
    <section id={id} tabIndex={-1} aria-labelledby={headingId} className="scroll-mt-24 focus:outline-none">
      <Reveal className="mb-10 flex flex-col gap-3 md:mb-12">
        <h2 id={headingId} className="text-[30px] leading-tight font-semibold tracking-tight text-text md:text-[40px]">
          {label}
        </h2>
        <p className="max-w-2xl text-base leading-[1.6] text-text-muted">{intro}</p>
      </Reveal>

      <BentoGrid>
        {projects.map((project) => (
          <BentoGridItem key={project.id} large={project.featured}>
            <ProjectTile project={project} />
          </BentoGridItem>
        ))}
      </BentoGrid>
    </section>
  );
}
