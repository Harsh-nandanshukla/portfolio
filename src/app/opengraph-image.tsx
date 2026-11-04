import { ogAlt, ogSize, renderOgCard } from "@/lib/og-card";

// Next.js file convention: becomes /opengraph-image and the og:image tags (generated at build time).
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard();
}
