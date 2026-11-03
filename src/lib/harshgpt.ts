/*
 * HarshGPT client for the "Ask my AI" section (DESIGN.md §3).
 * API: POST {NEXT_PUBLIC_HARSHGPT_URL} with { question } (1–120 chars) → { answer, sources: [{ source, page }] }.
 * The API answers in one JSON response (no streaming). Every failure becomes a typed result instead of
 * a thrown error, so the UI only has to pick a message.
 */

/** Max question length accepted by the API (QueryRequest.question maxLength). */
export const MAX_QUESTION_LENGTH = 120;

/** Give up after this long and show the fallback. */
export const REQUEST_TIMEOUT_MS = 20_000;

export interface HarshGptSource {
  source: string;
  page: number;
}

export type HarshGptResult =
  | { ok: true; answer: string; sources: HarshGptSource[] }
  /** "rate-limit" = HTTP 429 (shared hourly limit). "error" = anything else: missing URL, network/CORS, timeout, bad response. */
  | { ok: false; reason: "rate-limit" | "error" };

// Read at build/dev-server start: changing .env.local needs a dev-server restart.
const ENDPOINT = process.env.NEXT_PUBLIC_HARSHGPT_URL?.trim() ?? "";

function isSource(value: unknown): value is HarshGptSource {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.source === "string" && typeof v.page === "number";
}

export async function askHarshGpt(question: string, signal?: AbortSignal): Promise<HarshGptResult> {
  const q = question.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Ask my AI: NEXT_PUBLIC_HARSHGPT_URL is not set (.env.local), showing the fallback.");
    }
    return { ok: false, reason: "error" };
  }
  if (!q) return { ok: false, reason: "error" };

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    if (res.status === 429) return { ok: false, reason: "rate-limit" };
    if (!res.ok) return { ok: false, reason: "error" };

    const data: unknown = await res.json();
    const d = (data ?? {}) as Record<string, unknown>;
    const answer = typeof d.answer === "string" ? d.answer.trim() : "";
    if (!answer) return { ok: false, reason: "error" };
    const sources = Array.isArray(d.sources) ? d.sources.filter(isSource) : [];
    return { ok: true, answer, sources };
  } catch {
    // Network error, CORS block, timeout, abort, or invalid JSON.
    return { ok: false, reason: "error" };
  }
}
