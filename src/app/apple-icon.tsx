import { ImageResponse } from "next/og";
import { brandTokens as t } from "@/lib/brand-tokens";

// Next.js file convention: the iPhone/iPad home-screen icon (same "H" monogram as icon.svg).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: t.bg,
        }}
      >
        <svg width="120" height="120" viewBox="12 12 40 40">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={t.accent1} />
              <stop offset="1" stopColor={t.accent2} />
            </linearGradient>
          </defs>
          <path fill="url(#g)" d="M16 14h9v14h14V14h9v36h-9V36H25v14h-9z" />
        </svg>
      </div>
    ),
    size,
  );
}
