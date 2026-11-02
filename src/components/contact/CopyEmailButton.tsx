"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Big email button (DESIGN.md §7). Click → copies the address and shows a small "Copied" toast for 2s.
 * The toast is announced through a polite live region (the visible toast itself is aria-hidden so it
 * isn't read twice). If the Clipboard API is missing or fails, it opens the mailto: link instead.
 * The toast fades + rises (opacity / translate only); under reduced motion it appears at once (CSS only,
 * so server and client HTML always match).
 */

const TOAST_MS = 2000;

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-1";

interface CopyEmailButtonProps {
  email: string;
  ariaLabel: string;
  copiedLabel: string;
}

export function CopyEmailButton({ email, ariaLabel, copiedLabel }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    const mailto = `mailto:${email}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = mailto;
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), TOAST_MS);
  }

  return (
    <div className="relative inline-flex max-w-full flex-col items-center">
      {/* Visible toast */}
      <span
        aria-hidden="true"
        data-copy-toast=""
        data-show={copied ? "" : undefined}
        className={cn(
          "pointer-events-none absolute -top-11 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] whitespace-nowrap text-text transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none",
          copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <Check className="size-3.5 text-accent-1" aria-hidden="true" />
        {copiedLabel}
      </span>

      <button
        type="button"
        onClick={copy}
        aria-label={ariaLabel}
        data-copy-email=""
        className={cn(
          "group/email inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-surface/60 px-5 py-3 text-[17px] font-semibold tracking-tight text-text hover:border-text-muted/60 hover:bg-surface-hover sm:px-7 sm:py-4 sm:text-[24px] md:text-[30px]",
          focusRing,
        )}
      >
        <span className="min-w-0 break-all">{email}</span>
        {copied ? (
          <Check aria-hidden="true" className="size-5 shrink-0 text-accent-1 sm:size-6" />
        ) : (
          <Copy aria-hidden="true" className="size-5 shrink-0 text-text-muted group-hover/email:text-text sm:size-6" />
        )}
      </button>

      {/* Screen-reader announcement */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
