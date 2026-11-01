"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/*
 * Hero neural-network canvas (DESIGN.md §2).
 * Slow-drifting nodes, lines between close nodes (fading with distance),
 * nodes near the cursor brighten and connect to it.
 * Colors are read at runtime from the --accent-1 / --accent-2 design tokens.
 * Pauses when the hero is off-screen and when the tab is hidden.
 * Only mounted on desktop without reduced motion (see HeroBackground.tsx).
 */

const CONFIG = {
  /** Node count at ≥1024px wide; scaled down for narrower canvases. */
  nodes: 60,
  minNodes: 36,
  /** Width the node count is based on. */
  referenceWidth: 1280,
  /** Max distance (px) for a line between two nodes. */
  linkDistance: 140,
  /** Radius (px) around the cursor where nodes brighten and connect. */
  cursorRadius: 180,
  /** Drift speed range, px per second. */
  minSpeed: 6,
  maxSpeed: 16,
  nodeRadius: 1.6,
  /** Opacities (0–1). Kept low so the hero text stays readable. */
  nodeAlpha: 0.45,
  nodeAlphaNearCursor: 0.95,
  linkAlpha: 0.18,
  cursorLinkAlpha: 0.35,
  maxDpr: 2,
} as const;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0 = accent-1 (cyan), 1 = accent-2 (violet) */
  tone: 0 | 1;
}

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function makeNodes(width: number, height: number): Node[] {
  const count = Math.round(
    Math.max(CONFIG.minNodes, Math.min(CONFIG.nodes, (CONFIG.nodes * width) / CONFIG.referenceWidth)),
  );
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      tone: i % 3 === 0 ? 1 : 0,
    };
  });
}

export default function NeuralBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const colors = [readToken("--accent-1"), readToken("--accent-2")];
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let cursor: { x: number; y: number } | null = null;

    let inView = true;
    let tabVisible = document.visibilityState === "visible";
    let frame = 0;
    let last = 0;

    // ---- Size: match the parent, crisp on high-DPI screens (DPR capped) ----
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const prevW = width;
      const prevH = height;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0 || prevW === 0 || prevH === 0) {
        nodes = makeNodes(width, height);
      } else {
        // Keep the network's shape when the window changes size.
        for (const n of nodes) {
          n.x = (n.x / prevW) * width;
          n.y = (n.y / prevH) * height;
        }
      }
      if (!running()) draw();
    };

    // ---- Drawing ----
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const linkSq = CONFIG.linkDistance ** 2;
      const cursorSq = CONFIG.cursorRadius ** 2;

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq > linkSq) continue;
          ctx.globalAlpha = (1 - Math.sqrt(dSq) / CONFIG.linkDistance) * CONFIG.linkAlpha;
          ctx.strokeStyle = colors[a.tone];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        let alpha: number = CONFIG.nodeAlpha;
        if (cursor) {
          const dx = n.x - cursor.x;
          const dy = n.y - cursor.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < cursorSq) {
            const t = 1 - Math.sqrt(dSq) / CONFIG.cursorRadius;
            alpha = CONFIG.nodeAlpha + (CONFIG.nodeAlphaNearCursor - CONFIG.nodeAlpha) * t;
            ctx.globalAlpha = t * CONFIG.cursorLinkAlpha;
            ctx.strokeStyle = colors[n.tone];
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(cursor.x, cursor.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colors[n.tone];
        ctx.beginPath();
        ctx.arc(n.x, n.y, CONFIG.nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // ---- Animation loop (time-based so speed is the same at 60Hz and 144Hz) ----
    const step = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const margin = CONFIG.linkDistance / 2;
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        // Wrap around just outside the edges so nodes don't pop in or out.
        if (n.x < -margin) n.x = width + margin;
        else if (n.x > width + margin) n.x = -margin;
        if (n.y < -margin) n.y = height + margin;
        else if (n.y > height + margin) n.y = -margin;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const running = () => frame !== 0;
    const start = () => {
      if (running() || !inView || !tabVisible) return;
      last = 0;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const update = () => (inView && tabVisible ? start() : stop());

    // ---- Observers / listeners ----
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    intersectionObserver.observe(canvas);

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // The canvas sits behind the hero content (pointer-events: none), so track the pointer on window.
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursor = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : null;
    };
    const onPointerLeave = () => {
      cursor = null;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    resize();
    update();
    // Fade the canvas in (CSS transition on opacity, see className below).
    canvas.dataset.ready = "";

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out",
        "opacity-0 data-ready:opacity-100",
        className,
      )}
    />
  );
}
