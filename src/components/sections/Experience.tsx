import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { TracingBeam, TracingBeamItem } from "@/components/ui/tracing-beam";
import { TimelineEntry } from "@/components/experience/TimelineEntry";
import { CompactEntry } from "@/components/experience/CompactEntry";
import { EntryLinkButton } from "@/components/experience/EntryLinkButton";

/*
 * Experience & Research — Tracing Beam timeline (DESIGN.md §5).
 * Entries render from content.experience in data order (newest first), then the quieter
 * education card (content.education) and one card per content.certifications item.
 * Adding an entry = adding one object in content.ts. CGPA is shown only if education.showCgpa is true.
 * Each entry fades up on its own as it scrolls into view (DECISIONS #48).
 */
export function Experience() {
  const { id, label } = content.sections.experience;
  const { education: eduStrings, certification: certStrings } = content.experienceSection;
  const edu = content.education;
  const headingId = `${id}-heading`;

  const degreeLine = eduStrings.degreeLine
    .replace("{degree}", edu.degree)
    .replace("{major}", edu.major)
    .replace("{minor}", edu.minor);
  const eduLines = edu.showCgpa === true ? [degreeLine, eduStrings.cgpaLine.replace("{cgpa}", edu.cgpa)] : [degreeLine];

  return (
    <section id={id} tabIndex={-1} aria-labelledby={headingId} className="scroll-mt-24 focus:outline-none">
      <Reveal className="mb-10 md:mb-12">
        <h2 id={headingId} className="text-[30px] leading-tight font-semibold tracking-tight text-text md:text-[40px]">
          {label}
        </h2>
      </Reveal>

      <TracingBeam className="flex max-w-3xl flex-col gap-6 md:gap-8">
        {content.experience.map((entry) => (
          <TracingBeamItem key={entry.id}>
            <Reveal>
              <TimelineEntry entry={entry} />
            </Reveal>
          </TracingBeamItem>
        ))}

        <TracingBeamItem small>
          <Reveal>
            <CompactEntry label={eduStrings.label} title={edu.institution} lines={eduLines} dates={edu.dates} />
          </Reveal>
        </TracingBeamItem>

        {content.certifications.map((cert) => (
          <TracingBeamItem key={cert.name} small>
            <Reveal>
              <CompactEntry label={certStrings.label} title={cert.name} lines={[cert.issuer]}>
                {cert.link && (
                  <EntryLinkButton
                    small
                    href={cert.link.href}
                    label={certStrings.verify.label}
                    ariaLabel={certStrings.verify.ariaLabel.replace("{name}", cert.name)}
                  />
                )}
              </CompactEntry>
            </Reveal>
          </TracingBeamItem>
        ))}
      </TracingBeam>
    </section>
  );
}
