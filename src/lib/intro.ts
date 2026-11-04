/*
 * Shared state for the hero name intro (no React here, so the server layout can import it).
 *
 * <html data-intro="..."> drives everything:
 *   (missing) → no JavaScript: everything is visible and static
 *   "play"    → set before first paint: the intro will run; CSS hides the letters and the rest of the hero
 *   "running" → the intro is animating (letters are controlled by their animations)
 *   "done"    → the intro finished or was skipped: the rest of the hero fades in
 *   "skip"    → already played this session, reduced motion, or a phone-width screen: normal subtle fade-in
 */

export const INTRO_ATTR = "data-intro";
export const INTRO_STORAGE_KEY = "hns-intro-played";
/** Fired on window when the intro finishes (or is skipped). */
export const INTRO_DONE_EVENT = "hns:intro-done";

/** Below this width the intro never plays (DECISIONS #68): phones get the normal fade-in for a fast LCP. Tailwind's md breakpoint. */
export const INTRO_SKIP_QUERY = "(max-width: 767px)";

export type IntroMode = "play" | "running" | "done" | "skip";

/**
 * Runs in <head> before first paint. Decides "play" vs "skip" ("play" only on screens 768px+ wide,
 * without reduced motion, first visit this session), so phones never hide the name.
 * If sessionStorage or matchMedia throws (e.g. blocked storage), it falls back to "skip".
 */
export const introModeScript = `(function(){var m="skip";try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&!window.matchMedia(${JSON.stringify(
  INTRO_SKIP_QUERY,
)}).matches&&!window.sessionStorage.getItem(${JSON.stringify(
  INTRO_STORAGE_KEY,
)}))m="play"}catch(e){}document.documentElement.setAttribute(${JSON.stringify(INTRO_ATTR)},m)})();`;

export function getIntroMode(): IntroMode | null {
  return document.documentElement.getAttribute(INTRO_ATTR) as IntroMode | null;
}

/** True while the intro is waiting to start or still animating. */
export function isIntroPending(): boolean {
  const mode = getIntroMode();
  return mode === "play" || mode === "running";
}

/** Calls `cb` once the intro is over (immediately if there is no intro). Returns an unsubscribe function. */
export function whenIntroDone(cb: () => void): () => void {
  if (!isIntroPending()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, cb);
}

/** For useSyncExternalStore: re-check when the intro finishes. */
export function subscribeIntroDone(onChange: () => void): () => void {
  window.addEventListener(INTRO_DONE_EVENT, onChange);
  return () => window.removeEventListener(INTRO_DONE_EVENT, onChange);
}
