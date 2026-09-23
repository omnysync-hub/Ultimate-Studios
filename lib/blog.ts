import type { PortableTextBlock } from "@portabletext/types";

export type BlogFaq = { question: string; answer: string };
export type BlogSource = { title: string; url: string };
export type BlogHowToStep = { title: string; text: string };

export type BlogComment = {
  _id: string;
  name: string;
  body: string;
  createdAt: string;
};

export type BlogPost = {
  _id?: string;
  slug: string;
  title: string;
  /** Public meta / card description */
  description: string;
  seoTitle?: string;
  datePublished: string;
  dateModified: string;
  author: string;
  authorRole?: string;
  tags: string[];
  /** Plain-text body (legacy or derived from Portable Text for word count). */
  content: string;
  /** Rich body from Sanity Portable Text. */
  body?: PortableTextBlock[];
  draft?: boolean;
  ogImage?: string;
  coverAlt?: string;
  keyTakeaway?: string;
  keyPoints?: string[];
  faqs?: BlogFaq[];
  howToSteps?: BlogHowToStep[];
  sources?: BlogSource[];
  primaryEntity?: string;
  geoFocus?: string;
  updatedNote?: string;
  experienceNote?: string;
  focusKeyword?: string;
  noIndex?: boolean;
  reactionUseful?: number;
  reactionLove?: number;
  reactionFire?: number;
  reactionWow?: number;
  reactionLaugh?: number;
  reactionClap?: number;
};

/** @deprecated Prefer async getters from `@/lib/blog-data`. */
export const blogPosts: BlogPost[] = [];

export function portableTextToPlain(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks?.length) return "";
  const parts: string[] = [];
  for (const block of blocks) {
    if (block._type !== "block" || !("children" in block)) continue;
    const children = block.children as { text?: string }[] | undefined;
    const text = (children || []).map((c) => c.text || "").join("");
    if (text.trim()) parts.push(text.trim());
  }
  return parts.join("\n\n");
}

export function getPostPlainText(post: Pick<BlogPost, "content" | "body">) {
  if (post.body?.length) return portableTextToPlain(post.body);
  return post.content || "";
}

export function getReadingMinutes(contentOrPost: string | Pick<BlogPost, "content" | "body">) {
  const text = typeof contentOrPost === "string" ? contentOrPost : getPostPlainText(contentOrPost);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
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
