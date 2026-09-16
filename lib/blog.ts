export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  tags: string[];
  content: string;
  draft?: boolean;
  ogImage?: string;
};

/** @deprecated Prefer async getters from `@/lib/blog-data`. */
export const blogPosts: BlogPost[] = [];

export function getReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatPostDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function splitPostParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
