import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { content } from "@/data/content";
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

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
