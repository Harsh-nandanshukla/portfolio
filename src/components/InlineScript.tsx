/*
 * A <script> that runs during HTML parsing (before first paint) on full page loads.
 * Pattern from the Next.js guide "Preventing flash before hydration": `text/plain` on the client
 * stops React's dev warning about rendering <script> tags; suppressHydrationWarning covers the type mismatch.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
