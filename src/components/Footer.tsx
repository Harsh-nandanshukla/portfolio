import { ArrowUp } from "lucide-react";
import { content } from "@/data/content";

/*
 * Footer (DESIGN.md §7): thin top border, the © line, and "Back to top" → #home.
 * A plain anchor: globals.css only turns on smooth scrolling under prefers-reduced-motion: no-preference,
 * so the jump is smooth normally and instant under reduced motion, and it works without JavaScript.
 */
export function Footer() {
  const { line, backToTop } = content.contactSection.footer;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-content flex-col items-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left md:px-6">
        <p className="text-[13px] text-text-muted">{line}</p>
        <a
          href={`#${content.sections.hero.id}`}
          data-back-to-top=""
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[12px] uppercase tracking-[0.08em] text-text-muted outline-none hover:text-text focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-accent-1"
        >
          <ArrowUp className="size-3.5" aria-hidden="true" />
          {backToTop}
        </a>
      </div>
    </footer>
  );
}
