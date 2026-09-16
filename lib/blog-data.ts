import localPostsJson from "@/content/posts.json";
import type { BlogPost } from "@/lib/blog";
import { isSanityConfigured } from "@/lib/sanity/client";
import { fetchSanityPostBySlug, fetchSanityPosts } from "@/lib/sanity/posts";

type LocalPost = BlogPost & { coverImage?: string };

function mapLocalPosts(includeDrafts = false): BlogPost[] {
  const posts = localPostsJson as LocalPost[];
  return posts
    .filter((p) => includeDrafts || !p.draft)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      datePublished: p.datePublished,
      dateModified: p.dateModified || p.datePublished,
      author: p.author || "Ultimate Cineverse Team",
      tags: p.tags || [],
      content: p.content,
      draft: Boolean(p.draft),
      ogImage: p.ogImage || p.coverImage
    }));
}

export async function getBlogPosts(includeDrafts = false): Promise<BlogPost[]> {
  const local = mapLocalPosts(includeDrafts);

  if (!isSanityConfigured()) return local;

  const remote = await fetchSanityPosts(includeDrafts);
  if (!remote?.length) return local;

  // Merge: local samples fill the reel; Sanity posts override matching slugs.
  const bySlug = new Map(local.map((p) => [p.slug, p]));
  for (const post of remote) bySlug.set(post.slug, post);
  return [...bySlug.values()];
}

export async function getPostBySlug(slug: string, includeDrafts = false) {
  if (isSanityConfigured()) {
    const remote = await fetchSanityPostBySlug(slug, includeDrafts);
    if (remote) return remote;
  }
  return mapLocalPosts(includeDrafts).find((p) => p.slug === slug) ?? null;
}

export async function getPostsNewestFirst(includeDrafts = false) {
  const posts = await getBlogPosts(includeDrafts);
  return [...posts].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export async function getRelatedPosts(slug: string, limit = 3) {
  const posts = await getBlogPosts(false);
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.slice(0, limit);

  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const score = p.tags.reduce((acc, t) => acc + (current.tags.includes(t) ? 1 : 0), 0);
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score || b.post.datePublished.localeCompare(a.post.datePublished));

  return scored.map((s) => s.post).slice(0, limit);
}
