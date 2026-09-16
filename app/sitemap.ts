import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog-data";
import { getSiteUrl } from "@/lib/cms/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await getBlogPosts(false);

  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/about`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/contact`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/privacy`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/cookies`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/terms`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString() }
  ];

  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.dateModified
  }));

  return [...staticRoutes, ...blogRoutes];
}
