/*
 * Particle engine for the hero name intro.
 * Loaded on demand by NameIntro.tsx only when the intro actually plays (never in skip sessions).
 * No React: it adds one fixed full-screen <canvas> to <body>, draws the particles, and removes it again.
 *
 * How it works:
 * 1. Each letter span is drawn with its real computed font into a small offscreen canvas, and the filled
 *    pixels become landing points (so particles form the true letter shapes at their real positions).
 * 2. Particles start beyond the 4 screen corners (round-robin) and spiral inward to their landing points.
 *    Positions are a pure function of time, so slow frames never stretch the intro.
 * 3. When a letter's particles have all arrived, they fade out while NameIntro fades in the solid DOM letter.
 */

export type ShapeName = "dot" | "square" | "triangle" | "diamond" | "sparkle" | "star" | "crescent";

export interface ParticleIntroOptions {
  letters: HTMLElement[];
  /** Total particle count (shared between letters by how much ink each letter has). */
  count: number;
  /** Relative weights per shape. */
  shapes: Readonly<Record<ShapeName, number>>;
  /** Resolved CSS colors with relative weights. The FIRST color is used for the white flashes. */
  colors: ReadonlyArray<{ color: string; weight: number }>;
  /** [min, max] particle size in CSS px. */
  sizePx: readonly [number, number];
  /** Thin shapes are drawn larger so they read at the same visual weight. */
  sparkleScale: number;
  starScale: number;
  /** Soft glow around stars and sparkles: blur radius as a share of the shape size. */
  glow: number;
  /** Twinkle: alpha dips by up to `depth` (0–1) at `hz` cycles/s, each particle's speed varied by ±hzSpread. */
  twinkle: { depth: number; hz: number; hzSpread: number };
  /** A share of particles flash bright white once mid-flight. */
  flash: { share: number; durationS: number; sizeBoost: number };
  /** Share of each particle's flight spent fading in. */
  fadeInPortion: number;
  flightS: number;
  letterStaggerS: number;
  /** Random extra launch delay per particle (0 to this), so a letter forms as a stream, not a block. */
  jitterS: number;
  /** The materialize window: the DOM letter fades in over it, and the letter's particles fade out by its end. */
  materializeS: number;
  /** Share of the materialize window the particles stay at full strength before fading (overlaps the DOM letter). */
  absorbHoldPortion: number;
  spiralTurns: number;
  startRadius: number;
  cornerJitterDeg: number;
  radiusJitter: number;
  angleLagPower: number;
  easePower: number;
  maxDpr: number;
  zIndex: number;
  /** If the first frames average slower than this (ms), only every other particle is drawn. */
  slowFrameMs: number;
}

export interface ParticleIntro {
  /** Seconds after start when each letter's particles have all arrived (= when it should materialize). */
  arrivalsS: number[];
  /** Start drawing. `t0` = performance.now() at the shared start moment (same as the letter animations). */
  start(t0: number): void;
  /** Stop and remove the canvas. Safe to call more than once. */
  destroy(): void;
}

const TAU = Math.PI * 2;
/** Sprite canvas size. Shapes fill the middle half; the outer ring leaves room for the glow. */
const SPRITE_PX = 32;
const SHAPE_PX = SPRITE_PX / 2;
const ADAPT_FRAMES = 10;

/** Screen corners in round-robin order: top-left, top-right, bottom-right, bottom-left. */
const CORNERS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

const SHAPE_ORDER: ShapeName[] = ["dot", "square", "triangle", "diamond", "sparkle", "star", "crescent"];
const GLOWING: ReadonlySet<ShapeName> = new Set(["sparkle", "star"]);

/** Wrap an angle into (−π, π]. */
function wrapAngle(a: number): number {
  return a - TAU * Math.ceil((a - Math.PI) / TAU);
}

function weightedPicker(weights: number[]): () => number {
  const total = weights.reduce((a, b) => a + b, 0);
  return () => {
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r < 0) return i;
    }
    return weights.length - 1;
  };
}

// ---------- 1. Landing points from the real letter shapes ----------

/** Filled pixels of one letter, in viewport coordinates: [x0, y0, x1, y1, ...]. */
function sampleLetter(el: HTMLElement): number[] | null {
  const char = el.firstChild?.textContent ?? "";
  if (!char.trim()) return [];
  const rect = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const fontSize = parseFloat(cs.fontSize);
  const pad = Math.ceil(fontSize * 0.3);
  const w = Math.ceil(rect.width) + pad * 2;
  const h = Math.ceil(rect.height) + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "black"; // only the alpha channel is read
  const m = ctx.measureText(char);
  const lineH = parseFloat(cs.lineHeight) || rect.height;
  // Baseline inside an inline-block line box: half-leading above the font's ascent.
  const baseline = (lineH - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  // The h1's slight resting tilt makes the box a little shorter on screen; follow it.
  const sy = rect.height / lineH;
  ctx.translate(pad, pad);
  ctx.scale(1, sy);
  ctx.fillText(char, 0, baseline);

  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 127) pts.push(rect.left - pad + x + 0.5, rect.top - pad + y + 0.5);
    }
  }
  return pts;
}

// ---------- 2. Sprites (one small image per shape × color, drawn once) ----------

/** Path for one shape inside a SHAPE_PX box centered at (c, c). */
function shapePath(ctx: CanvasRenderingContext2D, shape: ShapeName, c: number) {
  const s = SHAPE_PX;
  const h = s / 2;
  ctx.beginPath();
  switch (shape) {
    case "dot":
      ctx.arc(c, c, s * 0.42, 0, TAU);
      break;
    case "square":
      ctx.rect(c - s * 0.36, c - s * 0.36, s * 0.72, s * 0.72);
      break;
    case "triangle":
      ctx.moveTo(c, c - h * 0.84);
      ctx.lineTo(c + h * 0.88, c + h * 0.76);
      ctx.lineTo(c - h * 0.88, c + h * 0.76);
      ctx.closePath();
      break;
    case "diamond":
      ctx.moveTo(c, c - h * 0.92);
      ctx.lineTo(c + h * 0.72, c);
      ctx.lineTo(c, c + h * 0.92);
      ctx.lineTo(c - h * 0.72, c);
      ctx.closePath();
      break;
    case "sparkle": {
      // 4-point star: long thin arms with a pinched waist.
      const arm = h * 0.96;
      const waist = h * 0.18;
      ctx.moveTo(c, c - arm);
      ctx.lineTo(c + waist, c - waist);
      ctx.lineTo(c + arm, c);
      ctx.lineTo(c + waist, c + waist);
      ctx.lineTo(c, c + arm);
      ctx.lineTo(c - waist, c + waist);
      ctx.lineTo(c - arm, c);
      ctx.lineTo(c - waist, c - waist);
      ctx.closePath();
      break;
    }
    case "star": {
      // 5-point star, point up.
      const outer = h * 0.95;
      const inner = outer * 0.42;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        if (i === 0) ctx.moveTo(c + r * Math.cos(a), c + r * Math.sin(a));
        else ctx.lineTo(c + r * Math.cos(a), c + r * Math.sin(a));
      }
      ctx.closePath();
      break;
    }
    case "crescent":
      ctx.arc(c, c, h * 0.86, 0, TAU);
      break;
  }
}

function makeSprite(shape: ShapeName, color: string, glow: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE_PX;
  canvas.height = SPRITE_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const c = SPRITE_PX / 2;
  ctx.fillStyle = color;

  if (shape === "crescent") {
    // Full disc, then cut a slightly offset disc out of it.
    shapePath(ctx, "crescent", c);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(c + SHAPE_PX * 0.2, c - SHAPE_PX * 0.12, SHAPE_PX * 0.38, 0, TAU);
    ctx.fill();
    return canvas;
  }

  if (GLOWING.has(shape) && glow > 0) {
    ctx.shadowColor = color;
    ctx.shadowBlur = SHAPE_PX * glow;
  }
  shapePath(ctx, shape, c);
  ctx.fill();
  if (GLOWING.has(shape) && glow > 0) {
    // Second pass without blur keeps the core crisp and bright.
    ctx.shadowBlur = 0;
    ctx.fill();
  }
  return canvas;
}

function makeSprites(colors: string[], glow: number): HTMLCanvasElement[][] {
  return SHAPE_ORDER.map((shape) => colors.map((color) => makeSprite(shape, color, glow)));
}

// ---------- 3. Engine ----------

export function createParticleIntro(o: ParticleIntroOptions): ParticleIntro | null {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = vw / 2;
  const cy = vh / 2;

  // Landing points per letter.
  const samples: number[][] = [];
  for (const el of o.letters) {
    const pts = sampleLetter(el);
    if (pts === null) return null;
    samples.push(pts);
  }
  const ink = samples.map((p) => p.length / 2);
  const totalInk = ink.reduce((a, b) => a + b, 0);
  if (totalInk === 0) return null;

  const n = o.letters.length;
  const arrivalsS = o.letters.map((_, i) => i * o.letterStaggerS + o.jitterS + o.flightS);
  const endS = Math.max(...arrivalsS) + o.materializeS;
  const holdS = o.materializeS * o.absorbHoldPortion;

  // Share particles by ink, at least one per inked letter.
  const perLetter = ink.map((k) => (k > 0 ? Math.max(1, Math.round((o.count * k) / totalInk)) : 0));
  const total = perLetter.reduce((a, b) => a + b, 0);

  // Particle data in flat typed arrays (fast to loop over every frame).
  const tx = new Float32Array(total);
  const ty = new Float32Array(total);
  const startAngle = new Float32Array(total);
  const startR = new Float32Array(total);
  const endR = new Float32Array(total);
  const spin = new Float32Array(total);
  const delay = new Float32Array(total);
  const size = new Float32Array(total);
  const phase = new Float32Array(total);
  const twinkleHz = new Float32Array(total);
  const flashAt = new Float32Array(total); // < 0 = never flashes
  const letterOf = new Uint16Array(total);
  const shapeOf = new Uint8Array(total);
  const colorOf = new Uint8Array(total);

  const pickShape = weightedPicker(SHAPE_ORDER.map((s) => o.shapes[s]));
  const pickColor = weightedPicker(o.colors.map((c) => c.weight));
  const halfDiag = Math.hypot(vw, vh) / 2;
  const baseTurn = o.spiralTurns * TAU;
  const jitter = (o.cornerJitterDeg * Math.PI) / 180;
  const sparkleIndex = SHAPE_ORDER.indexOf("sparkle");
  const starIndex = SHAPE_ORDER.indexOf("star");

  let k = 0;
  for (let i = 0; i < n; i++) {
    const pts = samples[i];
    for (let j = 0; j < perLetter[i]; j++, k++) {
      const p = Math.floor(Math.random() * (pts.length / 2)) * 2;
      tx[k] = pts[p];
      ty[k] = pts[p + 1];
      const fx = tx[k] - cx;
      const fy = ty[k] - cy;
      const [cornerX, cornerY] = CORNERS[k % CORNERS.length];
      startAngle[k] = Math.atan2(cornerY * vh, cornerX * vw) + (Math.random() * 2 - 1) * jitter;
      startR[k] = halfDiag * o.startRadius * (1 + Math.random() * o.radiusJitter);
      endR[k] = Math.hypot(fx, fy);
      // Spin ≈ spiralTurns, ending exactly on the landing point's angle.
      spin[k] = baseTurn + wrapAngle(Math.atan2(fy, fx) - (startAngle[k] + baseTurn));
      delay[k] = i * o.letterStaggerS + Math.random() * o.jitterS;
      shapeOf[k] = pickShape();
      colorOf[k] = pickColor();
      const scale = shapeOf[k] === sparkleIndex ? o.sparkleScale : shapeOf[k] === starIndex ? o.starScale : 1;
      size[k] = (o.sizePx[0] + Math.random() * (o.sizePx[1] - o.sizePx[0])) * scale;
      phase[k] = Math.random() * TAU;
      twinkleHz[k] = o.twinkle.hz * (1 + (Math.random() * 2 - 1) * o.twinkle.hzSpread);
      flashAt[k] =
        Math.random() < o.flash.share ? delay[k] + o.flightS * (0.15 + Math.random() * 0.7) : -1;
      letterOf[k] = i;
    }
  }

  const sprites = makeSprites(
    o.colors.map((c) => c.color),
    o.glow,
  );
  const WHITE = 0; // first color = white, used for flashes
  const flashHalf = o.flash.durationS / 2;

  // Canvas: fixed, full screen, above the hero, below the navbar, ignores the pointer.
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: `${vw}px`,
    height: `${vh}px`,
    pointerEvents: "none",
    zIndex: String(o.zIndex),
  });
  const dpr = Math.min(window.devicePixelRatio || 1, o.maxDpr);
  canvas.width = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let frame = 0;
  let t0 = 0;
  let destroyed = false;
  let stride = 1;
  let lastNow = 0;
  let slowSum = 0;
  let framesSeen = 0;

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame);
    canvas.remove();
  };

  const draw = (now: number) => {
    if (destroyed) return;
    const t = (now - t0) / 1000;
    if (t >= endS) {
      destroy();
      return;
    }

    // Safety valve for slow devices: measure the first frames, then halve the work if needed.
    if (framesSeen < ADAPT_FRAMES) {
      if (lastNow) slowSum += now - lastNow;
      lastNow = now;
      framesSeen++;
      if (framesSeen === ADAPT_FRAMES && slowSum / (ADAPT_FRAMES - 1) > o.slowFrameMs) stride = 2;
    }

    ctx.clearRect(0, 0, vw, vh);
    for (let p = 0; p < total; p += stride) {
      const local = (t - delay[p]) / o.flightS;
      if (local <= 0) continue;

      // Fade out while the DOM letter materializes; hold first so there's no dim gap in the handover.
      const fade = (t - arrivalsS[letterOf[p]] - holdS) / (o.materializeS - holdS);
      if (fade >= 1) continue;

      let x: number;
      let y: number;
      if (local >= 1) {
        x = tx[p];
        y = ty[p];
      } else {
        const e = 1 - Math.pow(1 - local, o.easePower); // ease-out progress, no overshoot
        const a = startAngle[p] + spin[p] * Math.pow(e, o.angleLagPower); // swirl lags: enters from its corner
        const r = startR[p] + (endR[p] - startR[p]) * e;
        x = cx + r * Math.cos(a);
        y = cy + r * Math.sin(a);
      }

      // Sprites are twice the shape size (room for the glow).
      const d = size[p] * 2;
      if (x < -d || y < -d || x > vw + d || y > vh + d) continue;

      let alpha = Math.min(1, local / o.fadeInPortion);
      if (fade > 0) alpha *= 1 - fade;
      alpha *= 1 - o.twinkle.depth * (0.5 + 0.5 * Math.sin(phase[p] + TAU * twinkleHz[p] * t));
      if (alpha > 0.01) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[shapeOf[p]][colorOf[p]], x - d / 2, y - d / 2, d, d);
      }

      // Glitter: a brief bright white flash, once, mid-flight.
      if (flashAt[p] >= 0) {
        const f = 1 - Math.abs(t - flashAt[p]) / flashHalf;
        if (f > 0) {
          const fd = d * (1 + (o.flash.sizeBoost - 1) * f);
          ctx.globalAlpha = f;
          ctx.drawImage(sprites[sparkleIndex][WHITE], x - fd / 2, y - fd / 2, fd, fd);
        }
      }
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  };

  return {
    arrivalsS,
    start(startTime: number) {
      if (destroyed) return;
      t0 = startTime;
      document.body.appendChild(canvas);
      frame = requestAnimationFrame(draw);
    },
    destroy,
  };
}
