import { content } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { ChatPanel } from "@/components/ask-ai/ChatPanel";

/*
 * Ask my AI (DESIGN.md §3): a wide glass card directly under the hero, with a soft cyan → violet glow
 * behind it. The heading is server-rendered; the chat itself (ChatPanel) is a small client component
 * that calls HarshGPT (src/lib/harshgpt.ts).
 */
export function AskAI() {
  const { id } = content.sections.askAi;
  const { heading } = content.askAiSection;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="scroll-mt-24 focus:outline-none"
    >
      <Reveal className="relative">
        {/* Glow (static, token colours only) */}
        <div aria-hidden="true" className="ask-ai-glow pointer-events-none absolute inset-x-0 -inset-y-10 -z-10" />
        <div className="relative rounded-[20px] border border-border bg-surface/60 p-5 backdrop-blur-md md:p-8">
          <h2
            id={headingId}
            className="mb-6 text-[30px] leading-tight font-semibold tracking-tight text-text md:mb-8 md:text-[40px]"
          >
            {heading}
          </h2>
          <ChatPanel />
        </div>
      </Reveal>
    </section>
  );
}
