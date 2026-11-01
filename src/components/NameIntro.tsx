"use client";

import { Fragment, useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
  INTRO_ATTR,
  INTRO_DONE_EVENT,
  INTRO_STORAGE_KEY,
  getIntroMode,
  subscribeIntroDone,
  type IntroMode,
} from "@/lib/intro";

/* ======================================================================================
 * INTRO_CONFIG — every timing and distance for the hero name intro lives here.
 * Times are in seconds unless the name says otherwise.
 * ==================================================================================== */
export const INTRO_CONFIG = {
  /** Per-device timing. Total = (letters − 1) × stagger + flight + sweep. */
  desktop: { flightS: 0.85, staggerS: 0.06, sweepS: 0.6 }, // ≈ 2.41s for 17 letters (limit 2.5s)
  mobile: { flightS: 0.6, staggerS: 0.04, sweepS: 0.45 }, // ≈ 1.69s for 17 letters (limit 1.8s)
  /** Which timing set to use. Matches Tailwind's md breakpoint (768px). */
  mobileQuery: "(max-width: 767px)",
  /** Limits from DESIGN.md; a dev-only console warning fires if the timing above exceeds them. */
  maxTotalS: { desktop: 2.5, mobile: 1.8 },

  /* ---- Cyclone path ---- */
  /** Turns around the screen center during the flight (each letter lands within ±0.5 turn of this). */
  spiralTurns: 1.25,
  /** Start radius, as a multiple of half the screen diagonal (> 1 = starts off-screen). */
  startRadius: 1.15,
  /** Angle of the first letter's start point (−135° = top-left corner); the rest spread around the circle. */
  startAngleDeg: -135,
  /** Ease-out strength (3 = cubic). No overshoot at any value. */
  easePower: 3,
  /** Points sampled along the spiral (more = smoother curve). */
  pathSamples: 24,
  /** Share of the flight spent fading from opacity 0 to 1. */
  fadeInPortion: 0.25,

  /* ---- 3D flight ---- */
  startScale: 0.2,
  /** Starting tilt; settles to 0 (flat) on landing. Y alternates direction per letter. */
  startRotateXDeg: 55,
  startRotateYDeg: 110,
  perspectivePx: 900,

  /* ---- Spark sweep (white → --accent-1), after the last letter lands ---- */
  /** How long each letter's flash lasts, as a share of sweepS. */
  sweepFlashPortion: 0.4,
  /** Letter brightness at the peak of its flash. */
  sweepBrightness: 1.6,

  /* ---- 3D extrusion (always on, also at rest) ---- */
  extrusion: {
    /** Number of stacked depth layers. */
    layers: 9,
    /** Offset per layer, in em (scales with the font size: 72px desktop / 44px mobile). Down-right. */
    offsetXEm: 0.011,
    offsetYEm: 0.013,
    /** Layer shade = % of --text mixed into --bg. First layer → last layer (darker). */
    shadeFromPct: 58,
    shadeToPct: 22,
    /** Soft shadow under the extruded name (color = --shadow-color token). */
    shadow: { offsetXEm: 0.06, offsetYEm: 0.16, blurEm: 0.22 },
  },

  /* ---- What follows the intro: label + tagline, then buttons, then the scroll hint ---- */
  after: {
    fadeS: 0.5,
    risePx: 16,
    labelDelayS: 0,
    taglineDelayS: 0.1,
    actionsDelayS: 0.45,
    scrollHintDelayS: 0.65,
    taglineWordStaggerS: 0.06,
  },

  /* ---- Later loads in the same session (no intro): normal subtle fade-in, like <Reveal> ---- */
  skip: { fadeS: 0.5, risePx: 16, staggerS: 0.08 },

  /** Max wait for the web fonts before measuring letter positions, in ms. */
  fontWaitMs: 400,
} as const;

type Timing = { flightS: number; staggerS: number; sweepS: number };

const TAU = Math.PI * 2;

// ---------- Extrusion (text-shadow layers, built once from the config) ----------

function buildExtrusion(): string {
  const { layers, offsetXEm, offsetYEm, shadeFromPct, shadeToPct, shadow } = INTRO_CONFIG.extrusion;
  const parts: string[] = [];
  for (let i = 1; i <= layers; i++) {
    const t = layers <= 1 ? 0 : (i - 1) / (layers - 1);
    const pct = (shadeFromPct + (shadeToPct - shadeFromPct) * t).toFixed(1);
    parts.push(
      `${(offsetXEm * i).toFixed(4)}em ${(offsetYEm * i).toFixed(4)}em 0 color-mix(in oklab, var(--text) ${pct}%, var(--bg))`,
    );
  }
  parts.push(
    `${(offsetXEm * layers + shadow.offsetXEm).toFixed(4)}em ${(offsetYEm * layers + shadow.offsetYEm).toFixed(4)}em ${shadow.blurEm}em var(--shadow-color)`,
  );
  return parts.join(", ");
}

const EXTRUSION = buildExtrusion();

// ---------- Intro state hook ----------

/** Current intro mode; "play" during server render and hydration. */
function useIntroMode(): IntroMode {
  return useSyncExternalStore(
    subscribeIntroDone,
    () => getIntroMode() ?? "skip",
    () => "play",
  );
}

// ---------- Animation builder ----------

/** Wrap an angle into (−π, π]. */
function wrapAngle(a: number): number {
  return a - TAU * Math.ceil((a - Math.PI) / TAU);
}

function buildAnimations(letters: HTMLElement[], timing: Timing): Animation[] {
  const cfg = INTRO_CONFIG;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const startR = (Math.hypot(vw, vh) / 2) * cfg.startRadius;
  const n = letters.length;
  const landS = (n - 1) * timing.staggerS + timing.flightS;
  const flashS = timing.sweepS * cfg.sweepFlashPortion;
  const baseTurn = cfg.spiralTurns * TAU;
  const anims: Animation[] = [];

  letters.forEach((el, i) => {
    // Final letter center, relative to the screen center.
    const rect = el.getBoundingClientRect();
    const fx = rect.left + rect.width / 2 - vw / 2;
    const fy = rect.top + rect.height / 2 - vh / 2;
    const endR = Math.hypot(fx, fy);
    const endAngle = Math.atan2(fy, fx);

    // Start: spread by index around a big circle (edges and corners). Spin ≈ spiralTurns and land exactly on endAngle.
    const startAngle = (cfg.startAngleDeg * Math.PI) / 180 + (i / n) * TAU;
    const spin = baseTurn + wrapAngle(endAngle - (startAngle + baseTurn));
    const rotY = cfg.startRotateYDeg * (i % 2 === 0 ? 1 : -1);

    const frames: Keyframe[] = [];
    for (let k = 0; k <= cfg.pathSamples; k++) {
      const t = k / cfg.pathSamples;
      const opacity = Math.min(1, t / cfg.fadeInPortion);
      if (k === cfg.pathSamples) {
        frames.push({ offset: 1, opacity, transform: `perspective(${cfg.perspectivePx}px) translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg)` });
        break;
      }
      const p = 1 - Math.pow(1 - t, cfg.easePower); // ease-out progress along the path
      const angle = startAngle + spin * p;
      const r = startR + (endR - startR) * p;
      const x = r * Math.cos(angle) - fx;
      const y = r * Math.sin(angle) - fy;
      const scale = cfg.startScale + (1 - cfg.startScale) * p;
      frames.push({
        offset: t,
        opacity,
        transform: `perspective(${cfg.perspectivePx}px) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) scale(${scale.toFixed(3)}) rotateX(${(cfg.startRotateXDeg * (1 - p)).toFixed(2)}deg) rotateY(${(rotY * (1 - p)).toFixed(2)}deg)`,
      });
    }

    // Flight. fill "backwards" holds the start state (hidden) during each letter's delay.
    anims.push(
      el.animate(frames, {
        duration: timing.flightS * 1000,
        delay: i * timing.staggerS * 1000,
        easing: "linear", // easing is already baked into the sampled path
        fill: "backwards",
      }),
    );

    // Spark: after the last letter lands, a flash passes left → right.
    const flash: KeyframeAnimationOptions = {
      duration: flashS * 1000,
      delay: (landS + (n > 1 ? i / (n - 1) : 0) * (timing.sweepS - flashS)) * 1000,
      easing: "ease-out",
    };
    const overlay = el.querySelector<HTMLElement>("[data-intro-sweep]");
    if (overlay) {
      anims.push(overlay.animate([{ opacity: 0 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }], flash));
    }
    anims.push(
      el.animate(
        [
          { filter: "brightness(1)" },
          { filter: `brightness(${cfg.sweepBrightness})`, offset: 0.35 },
          { filter: "brightness(1)" },
        ],
        flash,
      ),
    );
  });

  return anims;
}

// ---------- Component ----------

type Step = "label" | "tagline" | "actions" | "scrollHint";

const SKIP_INDEX: Record<Step, number> = { label: 0, tagline: 2, actions: 3, scrollHint: 4 }; // 1 = the name
const AFTER_DELAY: Record<Step, number> = {
  label: INTRO_CONFIG.after.labelDelayS,
  tagline: INTRO_CONFIG.after.taglineDelayS,
  actions: INTRO_CONFIG.after.actionsDelayS,
  scrollHint: INTRO_CONFIG.after.scrollHintDelayS,
};

/** CSS variables read by the [data-hero-fade] rules in globals.css. */
function fadeVars(skipIndex: number, afterDelayS: number): CSSProperties {
  return {
    "--fade-delay-skip": `${skipIndex * INTRO_CONFIG.skip.staggerS}s`,
    "--fade-delay-after": `${afterDelayS}s`,
    "--fade-duration-skip": `${INTRO_CONFIG.skip.fadeS}s`,
    "--fade-duration-after": `${INTRO_CONFIG.after.fadeS}s`,
    "--fade-rise-skip": `${INTRO_CONFIG.skip.risePx}px`,
    "--fade-rise-after": `${INTRO_CONFIG.after.risePx}px`,
  } as CSSProperties;
}

function Slot({ step, className, children }: { step: Step; className?: string; children: ReactNode }) {
  return (
    <div data-hero-fade="" className={className} style={fadeVars(SKIP_INDEX[step], AFTER_DELAY[step])}>
      {children}
    </div>
  );
}

interface NameIntroProps {
  name: string;
  label: ReactNode;
  tagline: string;
  actions: ReactNode;
  scrollHint: ReactNode;
}

/*
 * Hero name intro ("cyclone assemble", DESIGN.md §2) plus the sequence that follows it:
 * intro → label + tagline → buttons → scroll hint (the neural background waits for INTRO_DONE_EVENT).
 * Letters are laid out in their final positions and only transformed, so nothing shifts.
 * Skippable with any click, key, wheel, touch or scroll. Plays once per browser session.
 */
export function NameIntro({ name, label, tagline, actions, scrollHint }: NameIntroProps) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const mode = useIntroMode();
  const introOver = mode === "done" || mode === "skip";

  useEffect(() => {
    const root = document.documentElement;
    const h1 = h1Ref.current;
    if (getIntroMode() !== "play" || !h1) return;

    const isMobile = window.matchMedia(INTRO_CONFIG.mobileQuery).matches;
    const timing: Timing = isMobile ? INTRO_CONFIG.mobile : INTRO_CONFIG.desktop;
    let anims: Animation[] = [];
    let cancelled = false;
    let completed = false;

    const skipEvents = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    const removeListeners = () => skipEvents.forEach((e) => window.removeEventListener(e, skip));

    const complete = () => {
      if (completed || cancelled) return;
      completed = true;
      removeListeners();
      root.setAttribute(INTRO_ATTR, "done");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };

    // Skip: jump every animation to its end (letters snap into place), which then completes the intro.
    function skip() {
      if (anims.length) anims.forEach((a) => a.finish());
      else complete();
    }
    skipEvents.forEach((e) => window.addEventListener(e, skip, { passive: true }));

    const start = async () => {
      // Measure with the real font so the flight ends exactly on each letter.
      await Promise.race([
        document.fonts?.ready,
        new Promise((resolve) => setTimeout(resolve, INTRO_CONFIG.fontWaitMs)),
      ]);
      if (cancelled || completed) return;

      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // Storage blocked: the intro may play again next time. Nothing else to do.
      }

      // If the hero isn't on screen (e.g. the page opened scrolled down), skip the show.
      const box = h1.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) {
        complete();
        return;
      }

      const letters = Array.from(h1.querySelectorAll<HTMLElement>("[data-intro-letter]"));
      if (process.env.NODE_ENV !== "production") {
        const total = (letters.length - 1) * timing.staggerS + timing.flightS + timing.sweepS;
        const limit = isMobile ? INTRO_CONFIG.maxTotalS.mobile : INTRO_CONFIG.maxTotalS.desktop;
        if (total > limit) console.warn(`[NameIntro] intro takes ${total.toFixed(2)}s, over the ${limit}s limit`);
      }

      // Create the animations first (their start frames hide the letters), then hand control over from CSS.
      anims = buildAnimations(letters, timing);
      root.setAttribute(INTRO_ATTR, "running");
      Promise.all(anims.map((a) => a.finished)).then(complete, () => {
        // Cancelled on unmount: nothing to do.
      });
    };
    void start();

    return () => {
      cancelled = true;
      removeListeners();
      anims.forEach((a) => a.cancel());
      // Unmounted mid-intro (e.g. React dev double-mount): restore "play" so the next mount can run it.
      if (!completed && getIntroMode() === "running") root.setAttribute(INTRO_ATTR, "play");
    };
  }, []);

  const words = name.split(" ");

  return (
    <>
      <Slot step="label">{label}</Slot>

      <h1
        ref={h1Ref}
        aria-label={name}
        data-hero-name=""
        className="mt-5 text-[44px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-text md:text-[72px]"
        style={{ textShadow: EXTRUSION, ...fadeVars(1, 0) }}
      >
        {words.map((word, w) => (
          <Fragment key={w}>
            {w > 0 && " "}
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, c) => (
                <span key={c} data-intro-letter="" className="relative inline-block">
                  {char}
                  <span
                    data-intro-sweep=""
                    className="text-sweep pointer-events-none absolute inset-0 opacity-0 [text-shadow:none]"
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </h1>

      <Slot step="tagline">
        <TextGenerateEffect
          words={tagline}
          start={introOver}
          delayS={mode === "skip" ? SKIP_INDEX.tagline * INTRO_CONFIG.skip.staggerS : AFTER_DELAY.tagline}
          staggerS={INTRO_CONFIG.after.taglineWordStaggerS}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-balance md:text-xl"
        />
      </Slot>

      <Slot step="actions" className="mt-10 w-full sm:w-auto">
        {actions}
      </Slot>

      <Slot
        step="scrollHint"
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center md:bottom-8"
      >
        {scrollHint}
      </Slot>
    </>
  );
}
