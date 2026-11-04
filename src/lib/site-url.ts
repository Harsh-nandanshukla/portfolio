/**
 * The site's public address, used for metadataBase (absolute OG image URLs), robots.txt
 * and sitemap.xml. Set NEXT_PUBLIC_SITE_URL in Vercel after deploy (e.g. https://your-site.vercel.app).
 */
const fallback = "http://localhost:3000";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || fallback);
