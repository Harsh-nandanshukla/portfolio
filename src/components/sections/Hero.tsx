import { ChevronDown } from "lucide-react";
import { content } from "@/data/content";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HeroBackground } from "@/components/HeroBackground";
import { cn } from "@/lib/utils";

/*
 * Hero (DESIGN.md §2): full viewport height, content centered.
 * Mono label → name (h1) → tagline (Text Generate Effect) → two CTAs → scroll indicator.
 * The section is full-bleed so the background spans the whole screen; the content stays
 * inside the 1120px max width. The name is static for now (the intro comes in Part B).
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
      className="relative isolate flex min-h-svh w-full scroll-mt-24 flex-col focus:outline-none"
    >
      <HeroBackground />

      <div className="mx-auto flex w-full max-w-content flex-1 flex-col items-center justify-center px-4 pt-28 pb-28 text-center md:px-6">
        <Reveal stagger className="flex flex-col items-center">
          <RevealItem>
            <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-text-muted">
              {identity.label}
            </p>
          </RevealItem>

          <RevealItem>
            <h1 className="mt-5 text-[44px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-text md:text-[72px]">
              {identity.name}
            </h1>
          </RevealItem>

          <RevealItem>
            <TextGenerateEffect
              words={identity.tagline}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-balance md:text-xl"
            />
          </RevealItem>

          <RevealItem className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
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
          </RevealItem>
        </Reveal>
      </div>

      <a
        href={`#${sections.askAi.id}`}
        aria-label={hero.scrollHint}
        className={cn(
          "absolute bottom-6 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-text-muted hover:text-text md:bottom-8",
          focusRing,
        )}
      >
        <ChevronDown className="size-5" aria-hidden="true" />
      </a>
    </section>
  );
}
