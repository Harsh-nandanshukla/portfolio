/**
 * Design token values for generated images only (OG / Twitter image, apple icon).
 * Generated images are rendered outside the browser, so they can't read the CSS
 * variables in globals.css. These MUST match the tokens in globals.css / DESIGN.md.
 * Components keep using the CSS tokens, never this file.
 */
export const brandTokens = {
  bg: "#0A0A0F",
  surface: "#12121A",
  border: "rgba(255,255,255,0.08)",
  text: "#EDEDED",
  textMuted: "#8A8A99",
  accent1: "#22D3EE",
  accent2: "#8B5CF6",
} as const;
