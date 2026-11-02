import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { CopyEmailButton } from "@/components/contact/CopyEmailButton";
import { SocialLinks } from "@/components/contact/SocialLinks";

/*
 * Contact (DESIGN.md §7): the closing line (gradient on content.contactSection.closingHighlight only),
 * the big copy-to-clipboard email button, and the links row. The footer lives in Footer.tsx.
 */

/** Splits the closing line around the highlighted word(s); no highlight found → plain text. */
function splitHighlight(line: string, highlight: string): [string, string, string] {
  const i = highlight ? line.indexOf(highlight) : -1;
  if (i === -1) return [line, "", ""];
  return [line.slice(0, i), highlight, line.slice(i + highlight.length)];
}

export function Contact() {
  const { id } = content.sections.contact;
  const s = content.contactSection;
  const { email } = content.identity;
  const headingId = `${id}-heading`;
  const [before, highlight, after] = splitHighlight(s.closingLine, s.closingHighlight);

  return (
    <section id={id} tabIndex={-1} aria-labelledby={headingId} className="scroll-mt-24 focus:outline-none">
      <Reveal className="flex flex-col items-center gap-16 py-8 text-center md:gap-[72px] md:py-16">
        <h2
          id={headingId}
          className="max-w-3xl text-[36px] leading-[1.1] font-semibold tracking-tight text-balance text-text sm:text-[48px] md:text-[64px]"
        >
          {before}
          {highlight && <span className="bg-gradient bg-clip-text text-transparent">{highlight}</span>}
          {after}
        </h2>

        <div className="flex max-w-full flex-col items-center gap-6">
          <CopyEmailButton
            email={email}
            ariaLabel={s.copyEmailAriaLabel.replace("{email}", email)}
            copiedLabel={s.copied}
          />
          <SocialLinks />
        </div>
      </Reveal>
    </section>
  );
}
