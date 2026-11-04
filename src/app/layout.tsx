import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Orbitron } from "next/font/google";
import { content } from "@/data/content";
import { InlineScript } from "@/components/InlineScript";
import { introModeScript } from "@/lib/intro";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Geist = headings + body text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// JetBrains Mono = metrics, tags, labels, dates
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Orbitron 700 = the hero name only (DECISIONS #34), exposed as the `font-display` token
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: "700",
});

// The OG / Twitter images and icons are added automatically by the file conventions
// (opengraph-image.tsx, twitter-image.tsx, icon.svg, apple-icon.tsx).
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: content.seo.title,
  description: content.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: content.identity.name,
    title: content.seo.title,
    description: content.seo.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title,
    description: content.seo.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${jetbrainsMono.variable} ${orbitron.variable} h-full antialiased`}
      // The inline script below sets data-intro on <html> before React hydrates.
      suppressHydrationWarning
    >
      <head>
        {/* Decides "play" vs "skip" for the hero name intro before first paint (no flash of the name). */}
        <InlineScript html={introModeScript} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
