import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Next.js file convention: becomes /sitemap.xml. Single-page site, so one URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl.href, changeFrequency: "monthly", priority: 1 }];
}
