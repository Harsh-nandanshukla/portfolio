import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Next.js file convention: becomes /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
