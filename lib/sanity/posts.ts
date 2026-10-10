import type { PortableTextBlock } from "@portabletext/types";
import type { BlogComment, BlogPost } from "@/lib/blog";
import { portableTextToPlain } from "@/lib/blog";
import { isSanityConfigured, sanityClient } from "./client";
import { urlForImage } from "./image";

type SanityImage = {
  alt?: string;
  asset?: { _ref?: string };
};

type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  description: string;
  excerpt?: string;
  author?: string;
  authorRole?: string;
  authorName?: string;
  authorRefRole?: string;
  tags?: string[];
  datePublished: string;
  dateModified?: string;
  content?: string;
  body?: PortableTextBlock[];
  draft?: boolean;
  noIndex?: boolean;
  focusKeyword?: string;
  keyTakeaway?: string;
  keyPoints?: string[];
  faqs?: { question: string; answer: string }[];
  howToSteps?: { title: string; text: string }[];
  sources?: { title: string; url: string }[];
  primaryEntity?: string;
  geoFocus?: string;
  updatedNote?: string;
  experienceNote?: string;
  mainImage?: SanityImage;
  ogImage?: SanityImage;
  reactionUseful?: number;
  reactionLove?: number;
  reactionFire?: number;
  reactionWow?: number;
  reactionLaugh?: number;
  reactionClap?: number;
};

const postFields = `
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  description,
  excerpt,
  author,
  authorRole,
  "authorName": authorRef->name,
  "authorRefRole": authorRef->role,
  tags,
  datePublished,
  dateModified,
  content,
  body,
  draft,
  noIndex,
  focusKeyword,
  keyTakeaway,
  keyPoints,
  faqs,
  howToSteps,
  sources,
  primaryEntity,
  geoFocus,
  updatedNote,
  experienceNote,
  mainImage,
  ogImage,
  reactionUseful,
  reactionLove,
  reactionFire,
  reactionWow,
  reactionLaugh,
  reactionClap
`;

function naturalImageUrl(img?: SanityImage, maxW = 1200) {
  if (!img?.asset?._ref) return undefined;
  try {
    const target = img.asset || img;
    return urlForImage(target)?.auto("format").width(maxW).fit("max").url() || undefined;
  } catch {
    return undefined;
  }
}

function ogImageUrl(img?: SanityImage) {
  if (!img?.asset?._ref) return undefined;
  try {
    return urlForImage(img)?.width(1200).height(630).fit("crop").url() || undefined;
  } catch {
    return undefined;
  }
}

function mapPost(doc: SanityPost): BlogPost {
  const plain = doc.body?.length ? portableTextToPlain(doc.body) : doc.content || "";
  const naturalCover = naturalImageUrl(doc.mainImage) || naturalImageUrl(doc.ogImage);
  const socialOg = ogImageUrl(doc.ogImage) || ogImageUrl(doc.mainImage);
  const displayImage = naturalCover || socialOg;

  return {
    _id: doc._id,
    slug: doc.slug,
    title: doc.title,
    seoTitle: doc.seoTitle,
    description: doc.description || doc.excerpt || "",
    datePublished: doc.datePublished,
    dateModified: doc.dateModified || doc.datePublished,
    author: doc.authorName || doc.author || "Ultimate Cineverse Team",
    authorRole: doc.authorRole || doc.authorRefRole,
    tags: doc.tags || [],
    content: plain,
    body: doc.body,
    draft: Boolean(doc.draft),
    noIndex: Boolean(doc.noIndex),
    coverImage: naturalCover,
    ogImage: displayImage,
    coverAlt: doc.mainImage?.alt,
    focusKeyword: doc.focusKeyword,
    keyTakeaway: doc.keyTakeaway,
    keyPoints: doc.keyPoints,
    faqs: doc.faqs,
    howToSteps: doc.howToSteps,
    sources: doc.sources,
    primaryEntity: doc.primaryEntity,
    geoFocus: doc.geoFocus,
    updatedNote: doc.updatedNote,
    experienceNote: doc.experienceNote,
    reactionUseful: doc.reactionUseful || 0,
    reactionLove: doc.reactionLove || 0,
    reactionFire: doc.reactionFire || 0,
    reactionWow: doc.reactionWow || 0,
    reactionLaugh: doc.reactionLaugh || 0,
    reactionClap: doc.reactionClap || 0
  };
}

export async function fetchSanityPosts(includeDrafts = false): Promise<BlogPost[] | null> {
  if (!isSanityConfigured()) return null;

  const filter = includeDrafts
    ? `_type == "post" && defined(slug.current)`
    : `_type == "post" && defined(slug.current) && draft != true`;

  try {
    const docs = await sanityClient.fetch<SanityPost[]>(
      `*[${filter}] | order(datePublished desc) { ${postFields} }`,
      {},
      { next: { revalidate: 60, tags: ["sanity-posts"] } }
    );
    return docs.map(mapPost);
  } catch (err) {
    console.error("[sanity] fetchSanityPosts failed", err);
    return null;
  }
}

export async function fetchSanityPostBySlug(
  slug: string,
  includeDrafts = false
): Promise<BlogPost | null> {
  if (!isSanityConfigured()) return null;

  const filter = includeDrafts
    ? `_type == "post" && slug.current == $slug`
    : `_type == "post" && slug.current == $slug && draft != true`;

  try {
    const doc = await sanityClient.fetch<SanityPost | null>(
      `*[${filter}][0]{ ${postFields} }`,
      { slug },
      { next: { revalidate: 60, tags: ["sanity-posts", `post:${slug}`] } }
    );
    return doc?.slug ? mapPost(doc) : null;
  } catch (err) {
    console.error("[sanity] fetchSanityPostBySlug failed", err);
    return null;
  }
}

export async function fetchApprovedComments(postId: string): Promise<BlogComment[]> {
  if (!isSanityConfigured() || !postId) return [];
  try {
    return await sanityClient.fetch<BlogComment[]>(
      `*[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt asc) {
        _id, name, body, createdAt
      }`,
      { postId },
      { next: { revalidate: 30, tags: ["blog-comments", `comments:${postId}`] } }
    );
  } catch (err) {
    console.error("[sanity] fetchApprovedComments failed", err);
    return [];
  }
}
