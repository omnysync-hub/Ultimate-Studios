import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog-data";
import { getSiteUrl } from "@/lib/cms/store";

/**
 * Sitemap rules (technical SEO):
 * - Never stamp static routes with `new Date()` — a lastmod that changes on
 *   every crawl teaches Google to ignore it. Static pages use the newest
 *   real content change (latest post edit) as their honest lastmod.
 * - Blog posts carry their own dateModified, priority and change frequency,
 *   plus their cover image so Google Images / Discover can pick them up.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await getBlogPosts(false);

  const newestPostChange = posts.reduce(
    (max, p) => (p.dateModified > max ? p.dateModified : max),
    "2026-11-15T00:00:00.000Z"
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: newestPostChange, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/blog`, lastModified: newestPostChange, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: newestPostChange, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: newestPostChange, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: newestPostChange, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/cookies`, lastModified: newestPostChange, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: newestPostChange, changeFrequency: "yearly", priority: 0.3 }
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.dateModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    ...(post.coverImage || post.ogImage
      ? { images: [post.coverImage || (post.ogImage as string)] }
      : {})
  }));

  return [...staticRoutes, ...blogRoutes];
}
