import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

// Phase 1 placeholder: replaced in Phase 5 (Skills).
export function Skills() {
  const { id, label } = content.sections.skills;

  return (
    <section id={id} tabIndex={-1} aria-label={label} className="scroll-mt-24 focus:outline-none">
      <Reveal className="min-h-[70vh]">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{label}</p>
      </Reveal>
    </section>
  );
}
