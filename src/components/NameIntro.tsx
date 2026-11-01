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
import type { ParticleIntro } from "@/lib/particle-intro";

/* ======================================================================================
 * INTRO_CONFIG — every timing, distance and look value for the hero name intro lives here.
 * Times are in seconds unless the name says otherwise.
 * ==================================================================================== */
export const INTRO_CONFIG = {
  /**
   * Per-device values. Total = (letters − 1) × letterStagger + jitter + flight + materialize + sweep.
   * particles = how many granules form the name; sizePx = [min, max] granule size in px.
   */
  desktop: {
    particles: 2000,
    sizePx: [2.5, 7],
    letterStaggerS: 0.045,
    jitterS: 0.1,
    flightS: 1.5,
    materializeS: 0.25,
    sweepS: 0.9,
  }, // ≈ 3.47s
  mobile: {
    particles: 600,
    sizePx: [2, 5],
    letterStaggerS: 0.03,
    jitterS: 0.08,
    flightS: 1.1,
    materializeS: 0.2,
    sweepS: 0.7,
  }, // ≈ 2.56s
  /** Which set to use. Matches Tailwind's md breakpoint (768px). */
  mobileQuery: "(max-width: 767px)",
  /** Caps (DECISIONS #33); a dev-only console warning fires if the timing above exceeds them. */
  maxTotalS: { desktop: 3.8, mobile: 2.8 },

  /* ---- Particles ("granules") ---- */
  particles: {
    /** Relative weights of each shape (stars + sparkles 40%, crescents 15%, the rest 45%). */
    shapes: { star: 0.22, sparkle: 0.18, crescent: 0.15, dot: 0.15, square: 0.1, triangle: 0.1, diamond: 0.1 },
    /** Relative weights of each color: white = --sweep-light, accent1 = --accent-1, accent2 = --accent-2. */
    colors: { white: 0.5, accent1: 0.3, accent2: 0.2 },
    /** Thin shapes are drawn this many times larger so they carry the same visual weight. */
    sparkleScale: 1.6,
    starScale: 1.25,
    /** Soft glow around stars and sparkles (blur as a share of the shape size; 0 = none). */
    glow: 0.35,
    /** Twinkle: brightness dips by up to `depth` (0–1), `hz` times per second, each particle ±hzSpread faster/slower. */
    twinkle: { depth: 0.6, hz: 6, hzSpread: 0.4 },
    /** Glitter: this share of particles flashes bright white once mid-flight (duration in s, peak size multiplier). */
    flash: { share: 0.12, durationS: 0.16, sizeBoost: 1.8 },
    /** Share of each particle's flight spent fading in. */
    fadeInPortion: 0.2,
    /** Canvas resolution cap. */
    maxDpr: 2,
    /** Canvas stacking: above the hero (auto), below the navbar (z-50). */
    zIndex: 40,
    /** If the first frames average slower than this (ms), only every other particle is drawn. */
    slowFrameMs: 24,
  },

  /* ---- Cyclone path: from the 4 corners, spiralling inward ---- */
  /** Turns around the screen center during the flight (each particle lands within ±0.5 turn of this). */
  spiralTurns: 0.6,
  /** Start distance, as a multiple of half the screen diagonal (> 1 = beyond the corner, off-screen). */
  startRadius: 1.12,
  /** Random angle jitter per particle around its corner. */
  cornerJitterDeg: 8,
  /** Extra start distance, 0 to this share of the start radius (outward only, so particles start off-screen). */
  radiusJitter: 0.1,
  /** > 1 delays the swirl so particles visibly enter from their corner before spiralling (1 = no lag). */
  angleLagPower: 1.5,
  /** Ease-out strength (3 = cubic). No overshoot at any value. */
  easePower: 3,

  /* ---- Materialize: the solid DOM letter appears as its particles settle ---- */
  materialize: {
    /** The letter grows from this scale to 1. */
    fromScale: 0.9,
    /** Landing shimmer: brightness peak, reached at `shimmerAt` (share of materializeS), then back to 1. */
    shimmerBrightness: 1.8,
    shimmerAt: 0.45,
    /** Particles stay at full strength for this share of materializeS, then fade into the letter. */
    absorbHoldPortion: 0.35,
  },

  /* ---- Resting look ---- */
  perspectivePx: 900,
  /** Slight resting tilt of the whole name (top leans back). 0 = none. */
  restTiltXDeg: 8,

  /* ---- Spark sweep, after the last letter forms ---- */
  /** Width of the bright band, in letters (how many letters glow at once). */
  sweepBandLetters: 6,
  /** Each letter's flash: fades up until the first offset, holds full white until the second, then fades out. */
  sweepHold: [0.25, 0.55],
  /** Letter brightness at the peak of its flash (also lifts the extrusion). */
  sweepBrightness: 1.3,
  /** Cyan bloom around each letter as the band passes: text-shadow blur radii in em, color --accent-1. */
  sweepGlowEm: [0.06, 0.2, 0.5],

  /* ---- 3D extrusion (always on, also at rest) ---- */
  extrusion: {
    /** Number of stacked depth layers. */
    layers: 11,
    /** Offset per layer, in em (scales with the font size: 72px desktop / 44px mobile). Down-right. */
    offsetXEm: 0.0065,
    offsetYEm: 0.008,
    /** Layer shade = % of --text mixed into --bg, front layer → back layer. Stays mid-grey, well above --bg. */
    shadeFromPct: 55,
    shadeToPct: 25,
    /** Soft shadow under the extruded name (color = --shadow-color token). */
    shadow: { offsetXEm: 0.06, offsetYEm: 0.16, blurEm: 0.22 },
  },

  /* ---- Lit letter face: vertical gradient, lighter top → slightly darker bottom ---- */
  face: {
    /** Top color = --text mixed with this % of --sweep-light (white). */
    topLightPct: 60,
    /** Bottom color = --text mixed with this % of --bg. */
    bottomDarkPct: 15,
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

  /** Max wait (ms) for the web font + particle engine. If they're not ready, the hero just fades in normally. */
  fontWaitMs: 800,
} as const;

type Timing = (typeof INTRO_CONFIG)["desktop"] | (typeof INTRO_CONFIG)["mobile"];

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

/** Lit front face, painted on an overlay (text-shadow would otherwise cover a background-clip:text face). */
const FACE_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, var(--text), var(--sweep-light) ${INTRO_CONFIG.face.topLightPct}%), color-mix(in oklab, var(--text), var(--bg) ${INTRO_CONFIG.face.bottomDarkPct}%))`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "none",
};

/** Spark overlay: full white with a cyan bloom. Only its opacity is animated. */
const SWEEP_STYLE: CSSProperties = {
  color: "var(--sweep-light)",
  textShadow: INTRO_CONFIG.sweepGlowEm.map((r) => `0 0 ${r}em var(--accent-1)`).join(", "),
};

const restTiltXDeg: number = INTRO_CONFIG.restTiltXDeg; // plain number so "0 = none" can be checked
const REST_TILT =
  restTiltXDeg === 0 ? undefined : `perspective(${INTRO_CONFIG.perspectivePx}px) rotateX(${restTiltXDeg}deg)`;

// ---------- Intro state hook ----------

/** Current intro mode; "play" during server render and hydration. */
function useIntroMode(): IntroMode {
  return useSyncExternalStore(
    subscribeIntroDone,
    () => getIntroMode() ?? "skip",
    () => "play",
  );
}

// ---------- Letter animations (materialize + spark) ----------

/**
 * Each DOM letter fades/scales in with a brightness shimmer when its particles have arrived,
 * then the spark sweeps across. fill "backwards" keeps letters hidden until their moment.
 */
function buildLetterAnimations(letters: HTMLElement[], arrivalsS: number[], timing: Timing): Animation[] {
  const cfg = INTRO_CONFIG;
  const n = letters.length;
  const formedS = Math.max(...arrivalsS) + timing.materializeS; // last letter fully formed
  const sweepStep = timing.sweepS / (n - 1 + cfg.sweepBandLetters);
  const flashS = sweepStep * cfg.sweepBandLetters;
  const [holdFrom, holdTo] = cfg.sweepHold;
  const { fromScale, shimmerBrightness, shimmerAt } = cfg.materialize;
  const anims: Animation[] = [];

  letters.forEach((el, i) => {
    anims.push(
      el.animate(
        [
          { opacity: 0, transform: `scale(${fromScale})`, filter: "brightness(1)", easing: "ease-out" },
          { opacity: 1, filter: `brightness(${shimmerBrightness})`, offset: shimmerAt, easing: "ease-in-out" },
          { opacity: 1, transform: "scale(1)", filter: "brightness(1)" },
        ],
        { duration: timing.materializeS * 1000, delay: arrivalsS[i] * 1000, fill: "backwards" },
      ),
    );

    const flash: KeyframeAnimationOptions = {
      duration: flashS * 1000,
      delay: (formedS + i * sweepStep) * 1000,
      easing: "linear",
    };
    const overlay = el.querySelector<HTMLElement>("[data-intro-sweep]");
    if (overlay) {
      anims.push(
        overlay.animate(
          [
            { opacity: 0, easing: "ease-out" },
            { opacity: 1, offset: holdFrom },
            { opacity: 1, offset: holdTo, easing: "ease-in" },
            { opacity: 0 },
          ],
          flash,
        ),
      );
    }
    const bright = `brightness(${cfg.sweepBrightness})`;
    anims.push(
      el.animate(
        [
          { filter: "brightness(1)", easing: "ease-out" },
          { filter: bright, offset: holdFrom },
          { filter: bright, offset: holdTo, easing: "ease-in" },
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

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const timeout = (ms: number) => new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));

interface NameIntroProps {
  name: string;
  label: ReactNode;
  tagline: string;
  actions: ReactNode;
  scrollHint: ReactNode;
}

/*
 * Hero name intro (particle version, DESIGN.md §2) plus the sequence that follows it:
 * particles swirl in from the 4 corners and assemble each letter → the solid 3D letter materializes →
 * spark sweep → label + tagline → buttons → scroll hint (the neural background waits for INTRO_DONE_EVENT).
 * Letters are laid out in their final positions and only faded/scaled, so nothing shifts.
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
    let engine: ParticleIntro | null = null;
    let cancelled = false;
    let completed = false;

    // Any of these skips the intro.
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    // A width change also skips (landing points would be stale). Height-only changes are ignored:
    // mobile address bars resize the viewport, but the hero (svh units) doesn't move.
    const startWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== startWidth) skip();
    };
    const removeListeners = () => {
      skipEvents.forEach((e) => window.removeEventListener(e, skip));
      window.removeEventListener("resize", onResize);
    };

    const finishWith = (next: "done" | "skip") => {
      if (completed || cancelled) return;
      completed = true;
      removeListeners();
      engine?.destroy();
      root.setAttribute(INTRO_ATTR, next);
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };
    /** Intro finished or skipped: letters are in place, the rest of the hero follows. */
    const complete = () => finishWith("done");
    /** Couldn't run the intro (font/engine too slow): plain fade-in, like a later visit. */
    const fallback = () => finishWith("skip");

    // Skip: particles vanish and every letter animation jumps to its end, which then completes the intro.
    function skip() {
      engine?.destroy();
      if (anims.length) anims.forEach((a) => a.finish());
      else complete();
    }
    skipEvents.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    window.addEventListener("resize", onResize, { passive: true });

    const start = async () => {
      const letters = Array.from(h1.querySelectorAll<HTMLElement>("[data-intro-letter]"));
      if (letters.length === 0) return fallback();
      const cs = getComputedStyle(letters[0]);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

      // Load the engine and the real font in parallel, with one time limit for both.
      const loaded = await Promise.race([
        Promise.all([
          import("@/lib/particle-intro"),
          document.fonts.load(font),
          document.fonts.ready,
        ]).then(([mod]) => mod, () => null),
        timeout(INTRO_CONFIG.fontWaitMs),
      ]);
      if (cancelled || completed) return;
      if (!loaded || !document.fonts.check(font)) return fallback();

      // If the hero isn't on screen (e.g. the page opened scrolled down), skip the show.
      const box = h1.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return complete();

      const p = INTRO_CONFIG.particles;
      engine = loaded.createParticleIntro({
        letters,
        count: timing.particles,
        shapes: p.shapes,
        colors: [
          { color: readToken("--sweep-light"), weight: p.colors.white },
          { color: readToken("--accent-1"), weight: p.colors.accent1 },
          { color: readToken("--accent-2"), weight: p.colors.accent2 },
        ],
        sizePx: timing.sizePx,
        sparkleScale: p.sparkleScale,
        starScale: p.starScale,
        glow: p.glow,
        twinkle: p.twinkle,
        flash: p.flash,
        fadeInPortion: p.fadeInPortion,
        flightS: timing.flightS,
        letterStaggerS: timing.letterStaggerS,
        jitterS: timing.jitterS,
        materializeS: timing.materializeS,
        absorbHoldPortion: INTRO_CONFIG.materialize.absorbHoldPortion,
        spiralTurns: INTRO_CONFIG.spiralTurns,
        startRadius: INTRO_CONFIG.startRadius,
        cornerJitterDeg: INTRO_CONFIG.cornerJitterDeg,
        radiusJitter: INTRO_CONFIG.radiusJitter,
        angleLagPower: INTRO_CONFIG.angleLagPower,
        easePower: INTRO_CONFIG.easePower,
        maxDpr: p.maxDpr,
        zIndex: p.zIndex,
        slowFrameMs: p.slowFrameMs,
      });
      if (!engine) return fallback();

      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // Storage blocked: the intro may play again next time. Nothing else to do.
      }

      if (process.env.NODE_ENV !== "production") {
        const total = Math.max(...engine.arrivalsS) + timing.materializeS + timing.sweepS;
        const limit = isMobile ? INTRO_CONFIG.maxTotalS.mobile : INTRO_CONFIG.maxTotalS.desktop;
        if (total > limit) console.warn(`[NameIntro] intro takes ${total.toFixed(2)}s, over the ${limit}s limit`);
      }

      // Same start moment for the letter animations and the particle canvas.
      anims = buildLetterAnimations(letters, engine.arrivalsS, timing);
      root.setAttribute(INTRO_ATTR, "running");
      engine.start(performance.now());
      Promise.all(anims.map((a) => a.finished)).then(complete, () => {
        // Cancelled on unmount: nothing to do.
      });
    };
    void start();

    return () => {
      cancelled = true;
      removeListeners();
      anims.forEach((a) => a.cancel());
      engine?.destroy();
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
        // Fluid size: 36px at 320px wide → 72px from ~600px up; "Harsh Nandan" keeps ≥16px side space (DECISIONS #37).
        className="mt-5 font-display text-[length:clamp(36px,calc(12.8vw_-_5px),72px)] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-text"
        style={{ textShadow: EXTRUSION, transform: REST_TILT, ...fadeVars(1, 0) }}
      >
        {words.map((word, w) => (
          <Fragment key={w}>
            {w > 0 && " "}
            <span aria-hidden="true" className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, c) => (
                <span key={c} data-intro-letter="" className="relative inline-block">
                  {char}
                  <span className="pointer-events-none absolute inset-0" style={FACE_STYLE}>
                    {char}
                  </span>
                  <span
                    data-intro-sweep=""
                    className="pointer-events-none absolute inset-0 opacity-0"
                    style={SWEEP_STYLE}
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
