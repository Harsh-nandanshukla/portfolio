import { ogAlt, ogSize, renderOgCard } from "@/lib/og-card";

// Next.js file convention: becomes /twitter-image and the twitter:image tags (same card as the OG image).
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard();
}
