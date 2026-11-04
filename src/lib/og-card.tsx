import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { content } from "@/data/content";
import { brandTokens as t } from "@/lib/brand-tokens";

/**
 * The 1200×630 share card used by opengraph-image.tsx and twitter-image.tsx.
 * Rendered once at build time (static). Text comes from content.ts, colors from brand-tokens.ts.
 */
export const ogSize = { width: content.seo.ogImage.width, height: content.seo.ogImage.height };
export const ogAlt = content.seo.title;

// Fonts are read once (module scope). ImageResponse only reads ttf/otf/woff, not next/font's woff2.
const fontDir = join(process.cwd(), "src/app/fonts");
const fonts = Promise.all([
  readFile(join(fontDir, "Orbitron-Bold.ttf")),
  readFile(join(fontDir, "Geist-Regular.ttf")),
  readFile(join(fontDir, "JetBrainsMono-Medium.ttf")),
]);

export async function renderOgCard() {
  const [orbitron, geist, mono] = await fonts;
  const { name, label, tagline } = content.identity;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          backgroundColor: t.bg,
          backgroundImage: `radial-gradient(ellipse 55% 60% at 12% 18%, ${t.accent1}26, transparent 70%), radial-gradient(ellipse 55% 60% at 92% 88%, ${t.accent2}2E, transparent 70%)`,
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.textMuted,
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: "Orbitron",
            fontSize: 80,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: t.text,
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 36,
            width: 160,
            height: 4,
            borderRadius: 2,
            backgroundImage: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})`,
          }}
        />
        <div
          style={{
            marginTop: 36,
            fontSize: 34,
            lineHeight: 1.4,
            maxWidth: 900,
            color: t.textMuted,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Orbitron", data: orbitron, weight: 700, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
