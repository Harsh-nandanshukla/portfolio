"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowUp, FileText } from "lucide-react";
import { content } from "@/data/content";
import { askHarshGpt, MAX_QUESTION_LENGTH, type HarshGptSource } from "@/lib/harshgpt";
import { cn } from "@/lib/utils";

/*
 * Ask my AI chat (DESIGN.md §3): conversation log, suggestion chips, input + send button.
 * One question at a time. While waiting: a typing indicator (3 dots, opacity pulse).
 * The API returns the whole answer at once, so the answer "streams in" as a quick word-by-word
 * fade (opacity only, ≤ ~1s total, CSS so reduced motion shows it at once; DECISIONS #59).
 * Failures: 429 → the hourly-limit message, anything else → the general fallback; both link the resume.
 * The answer and its sources are shown exactly as the API returns them.
 */

type Turn =
  | { id: number; question: string; status: "pending" }
  | { id: number; question: string; status: "done"; answer: string; sources: HarshGptSource[] }
  | { id: number; question: string; status: "rate-limit" | "error" };

/** Show the character counter once the question gets close to the API limit. */
const COUNTER_FROM = 100;
/** Word fade: per-word delay is at most this, and the whole answer finishes starting within REVEAL_TOTAL_MS. */
const WORD_DELAY_MS = 30;
const REVEAL_TOTAL_MS = 900;

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1";

function AnswerText({ text }: { text: string }) {
  const tokens = text.split(/(\s+)/);
  const words = tokens.filter((t) => t && !/^\s+$/.test(t)).length;
  const step = Math.min(WORD_DELAY_MS, REVEAL_TOTAL_MS / Math.max(words, 1));
  let i = 0;
  return (
    <p className="text-[15px] leading-[1.65] whitespace-pre-line break-words text-text md:text-base">
      {tokens.map((t, k) => {
        if (!t || /^\s+$/.test(t)) return t;
        const style = { animationDelay: `${Math.round(i++ * step)}ms` } as CSSProperties;
        return (
          <span key={k} className="answer-word" style={style}>
            {t}
          </span>
        );
      })}
    </p>
  );
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex h-6 items-center gap-1.5" data-typing="">
      {[0, 1, 2].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className="typing-dot size-1.5 rounded-full bg-accent-1"
          style={{ animationDelay: `${n * 160}ms` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ChatPanel() {
  const s = content.askAiSection;
  const { resume } = content.identity;
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const pending = turns.at(-1)?.status === "pending";

  // Abort an in-flight request if the section unmounts.
  useEffect(() => () => controller.current?.abort(), []);

  // Keep the newest message in view (scrolls the log box only, never the page).
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns]);

  async function ask(raw: string) {
    const question = raw.trim().slice(0, MAX_QUESTION_LENGTH);
    if (!question || pending) return;

    const id = nextId.current++;
    setTurns((t) => [...t, { id, question, status: "pending" }]);
    setInput("");

    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    const result = await askHarshGpt(question, ac.signal);
    if (ac.signal.aborted) return;

    setTurns((t) =>
      t.map((turn): Turn => {
        if (turn.id !== id) return turn;
        if (result.ok) return { id, question, status: "done", answer: result.answer, sources: result.sources };
        return { id, question, status: result.reason };
      }),
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void ask(input);
  }

  return (
    <div className="flex flex-col gap-5">
      {turns.length > 0 && (
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label={s.conversationAriaLabel}
          data-chat-log=""
          className="flex max-h-[min(440px,60vh)] flex-col gap-5 overflow-y-auto overscroll-contain pr-1"
        >
          {turns.map((turn) => (
            <div key={turn.id} className="flex flex-col gap-3" data-turn={turn.status}>
              {/* Question */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">{s.youLabel}</span>
                <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-surface-hover px-4 py-2.5 text-[15px] leading-[1.5] break-words text-text">
                  {turn.question}
                </p>
              </div>

              {/* Answer */}
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-1">{s.aiLabel}</span>
                <div className="w-full rounded-2xl rounded-tl-md md:max-w-[92%] border border-border bg-bg/40 px-4 py-3">
                  {turn.status === "pending" && <TypingIndicator label={s.thinking} />}

                  {turn.status === "done" && (
                    <div className="flex flex-col gap-3" data-answer="">
                      <AnswerText text={turn.answer} />
                      {turn.sources.length > 0 && (
                        <div className="flex flex-col gap-1.5" data-sources="">
                          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
                            {s.sourcesLabel}
                          </span>
                          <ul className="flex flex-wrap gap-1.5">
                            {turn.sources.map((src, k) => (
                              <li
                                key={k}
                                className="max-w-full rounded-full border border-border px-2.5 py-1 font-mono text-[12px] break-all text-text-muted"
                              >
                                {s.sourceLine.replace("{source}", src.source).replace("{page}", String(src.page))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {(turn.status === "rate-limit" || turn.status === "error") && (
                    <div className="flex flex-col items-start gap-3" data-fallback={turn.status}>
                      <p className="text-[15px] leading-[1.6] text-text-muted">
                        {turn.status === "rate-limit" ? s.rateLimitMessage : s.errorMessage}
                      </p>
                      <a
                        href={resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-fallback-resume=""
                        className={cn(
                          "inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-[14px] font-medium text-text hover:border-text-muted/60 hover:bg-surface-hover",
                          focusRing,
                        )}
                      >
                        <FileText className="size-4" aria-hidden="true" />
                        {s.resumeLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestion chips */}
      <ul aria-label={s.chipsAriaLabel} className="flex flex-wrap gap-2">
        {s.chips.map((chip) => (
          <li key={chip} className="max-w-full">
            <button
              type="button"
              onClick={() => void ask(chip)}
              disabled={pending}
              data-chip=""
              className={cn(
                "max-w-full rounded-full border border-border bg-bg/40 px-3.5 py-2 text-left text-[14px] leading-snug text-text-muted hover:border-accent-1/50 hover:text-text disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:text-text-muted",
                focusRing,
              )}
            >
              {chip}
            </button>
          </li>
        ))}
      </ul>

      {/* Input */}
      <form onSubmit={onSubmit} className="flex items-center gap-2" data-chat-form="">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_QUESTION_LENGTH}
            placeholder={s.placeholder}
            aria-label={s.inputAriaLabel}
            autoComplete="off"
            enterKeyHint="send"
            className={cn(
              "h-12 w-full rounded-full border border-border bg-bg/60 pl-5 text-base text-text placeholder:text-text-muted/80 hover:border-text-muted/40",
              input.length >= COUNTER_FROM ? "pr-16" : "pr-5",
              "outline-none focus-visible:border-accent-1/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1",
            )}
          />
          {input.length >= COUNTER_FROM && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[11px] text-text-muted"
            >
              {input.length}/{MAX_QUESTION_LENGTH}
            </span>
          )}
        </div>
        <button
          type="submit"
          aria-label={s.sendAriaLabel}
          disabled={pending || !input.trim()}
          data-chat-send=""
          className={cn(
            "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
            focusRing,
          )}
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
