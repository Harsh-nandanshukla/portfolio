import { ArrowUpRight } from "lucide-react";
import { content, type Project } from "@/data/content";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { PipelineChips } from "@/components/projects/PipelineChips";
import { MetricsRow } from "@/components/projects/MetricsRow";
import { cn } from "@/lib/utils";

/*
 * One bento tile (DESIGN.md §4). Everything comes from the project object:
 * date, title, subtitle, one-liner, tags, and link buttons (a "TODO" or empty link hides its button).
 * Featured tiles also get the Border Beam, the pipeline chips and the headline metrics, when the data has them.
 */

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1";

function hasLink(href: string) {
  return href.trim() !== "" && href !== "TODO";
}

export function ProjectTile({ project }: { project: Project }) {
  const { linkButtons, pipelineAriaLabel, metricsAriaLabel, tagsAriaLabel } = content.projectsSection;
  const featured = project.featured;
  const buttons = linkButtons.filter((b) => hasLink(project.links[b.key]));

  return (
    <CardSpotlight className={cn("gap-6 p-5 md:p-6", featured && "lg:p-8")}>
      {featured && <BorderBeam />}

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{project.date}</p>
        <h3
          className={cn(
            "text-[20px] leading-tight font-semibold tracking-tight text-text md:text-[22px]",
            featured && "lg:text-[28px]",
          )}
        >
          {project.title}
        </h3>
        {project.subtitle && <p className="text-[15px] font-medium text-text/80">{project.subtitle}</p>}
        <p className="text-base leading-[1.6] text-text-muted">{project.oneLiner}</p>
      </div>

      {featured && (
        // Fills the 2 × 2 tile's spare height on desktop so the content is spread out, not top-heavy
        <div className="flex flex-col gap-8 lg:flex-1 lg:justify-center lg:gap-12">
          {project.pipelineStages && project.pipelineStages.length > 0 && (
            <PipelineChips stages={project.pipelineStages} ariaLabel={pipelineAriaLabel} />
          )}
          {project.headlineMetrics && project.headlineMetrics.length > 0 && (
            <MetricsRow metrics={project.headlineMetrics} ariaLabel={metricsAriaLabel} />
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-5">
        <ul aria-label={tagsAriaLabel} className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {buttons.map((b, i) => (
              <a
                key={b.key}
                href={project.links[b.key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={b.ariaLabel.replace("{project}", project.title)}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-medium transition-[opacity,background-color,border-color]",
                  i === 0
                    ? "bg-gradient text-bg hover:opacity-90"
                    : "border border-border bg-surface/40 text-text hover:border-text-muted hover:bg-surface-hover",
                  focusRing,
                )}
              >
                {b.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    </CardSpotlight>
  );
}
