import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

// Phase 1 placeholder: replaced in Phase 2 (Hero).
// pt-32 keeps the label below the floating navbar.
export function Hero() {
  const { id, label } = content.sections.hero;

  return (
    <section id={id} tabIndex={-1} aria-label={label} className="scroll-mt-24 focus:outline-none">
      <Reveal className="min-h-svh pt-32">
        <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">{label}</p>
      </Reveal>
    </section>
  );
}
