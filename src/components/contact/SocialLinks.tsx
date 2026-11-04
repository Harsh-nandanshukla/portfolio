import { FileText, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { content } from "@/data/content";
import { cn } from "@/lib/utils";

/*
 * Contact links row (DESIGN.md §7): "Send email" (mailto), GitHub, LinkedIn, Resume.
 * Addresses come from content.identity, labels from content.contactSection.
 * GitHub / LinkedIn use react-icons' Font Awesome 6 set (DECISIONS #56): monochrome, muted → text on hover.
 */

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-accent-1";
const pill =
  "inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-[14px] font-medium text-text-muted hover:border-text-muted/60 hover:text-text";
const iconButton =
  "inline-flex size-10 items-center justify-center rounded-full border border-border text-text-muted hover:border-text-muted/60 hover:text-text";

export function SocialLinks() {
  const { email, github, linkedin, resume } = content.identity;
  const s = content.contactSection;
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <ul aria-label={s.linksAriaLabel} className="flex flex-wrap items-center justify-center gap-3">
      <li>
        <a href={`mailto:${email}`} data-contact-link="email" className={cn(pill, focusRing)}>
          <Mail className="size-4" aria-hidden="true" />
          {s.sendEmail}
        </a>
      </li>
      <li>
        <a href={github} {...external} aria-label={s.githubAriaLabel} data-contact-link="github" className={cn(iconButton, focusRing)}>
          <FaGithub className="size-[18px]" aria-hidden="true" focusable="false" />
        </a>
      </li>
      <li>
        <a href={linkedin} {...external} aria-label={s.linkedinAriaLabel} data-contact-link="linkedin" className={cn(iconButton, focusRing)}>
          <FaLinkedinIn className="size-[18px]" aria-hidden="true" focusable="false" />
        </a>
      </li>
      <li>
        <a href={resume} {...external} data-contact-link="resume" className={cn(pill, focusRing)}>
          <FileText className="size-4" aria-hidden="true" />
          {s.resume}
        </a>
      </li>
    </ul>
  );
}
