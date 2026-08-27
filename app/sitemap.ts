import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/about`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/contact`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/privacy`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/terms`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString() }
  ];

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.dateModified
  }));

  return [...staticRoutes, ...blogRoutes];
}

