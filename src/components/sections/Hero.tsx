import { ChevronDown } from "lucide-react";
import { content } from "@/data/content";
import { HeroBackground } from "@/components/HeroBackground";
import { NameIntro } from "@/components/NameIntro";
import { cn } from "@/lib/utils";

/*
 * Hero (DESIGN.md §2): full viewport height, content centered.
 * Mono label → name (h1, "cyclone assemble" intro) → tagline (Text Generate Effect) → two CTAs → scroll indicator.
 * The section is full-bleed so the background spans the whole screen; the content stays
 * inside the 1120px max width. `overflow-clip` stops letters flying in from off-screen
 * from ever causing a horizontal scrollbar. Sequencing and timing live in NameIntro.tsx.
 */

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1";

const ctaBase =
  "inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium transition-[opacity,background-color,border-color]";

export function Hero() {
  const { identity, sections, hero } = content;

  return (
    <section
      id={sections.hero.id}
      tabIndex={-1}
      aria-label={sections.hero.label}
      className="relative isolate flex min-h-svh w-full scroll-mt-24 flex-col overflow-clip focus:outline-none"
    >
      <HeroBackground />

      <div className="mx-auto flex w-full max-w-content flex-1 flex-col items-center justify-center px-4 pt-28 pb-28 text-center md:px-6">
        <NameIntro
          name={identity.name}
          tagline={identity.tagline}
          label={
            <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">
              {identity.label}
            </p>
          }
          actions={
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <a
                href={`#${sections.projects.id}`}
                className={cn(ctaBase, "w-full bg-gradient text-bg hover:opacity-90 sm:w-auto", focusRing)}
              >
                {hero.primaryCta}
              </a>
              <a
                href={identity.resume}
                download
                className={cn(
                  ctaBase,
                  "w-full border border-border bg-surface/40 text-text hover:border-text-muted hover:bg-surface-hover sm:w-auto",
                  focusRing,
                )}
              >
                {hero.secondaryCta}
              </a>
            </div>
          }
          scrollHint={
            <a
              href={`#${sections.askAi.id}`}
              aria-label={hero.scrollHint}
              className={cn(
                "pointer-events-auto flex size-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-text-muted hover:text-text",
                focusRing,
              )}
            >
              <ChevronDown className="size-5" aria-hidden="true" />
            </a>
          }
        />
      </div>
    </section>
  );
}
