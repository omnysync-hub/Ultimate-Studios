import type { BlogPost } from "@/lib/blog";
import { isSanityConfigured, sanityClient } from "./client";
import { urlForImage } from "./image";

type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author?: string;
  tags?: string[];
  datePublished: string;
  dateModified?: string;
  content: string;
  draft?: boolean;
  mainImage?: {
    alt?: string;
    asset?: { _ref?: string };
  };
};

const postFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  author,
  tags,
  datePublished,
  dateModified,
  content,
  draft,
  mainImage
`;

function mapPost(doc: SanityPost): BlogPost {
  let og: string | undefined;
  if (doc.mainImage?.asset?._ref) {
    try {
      og = urlForImage(doc.mainImage)?.width(1200).height(630).url();
    } catch {
      og = undefined;
    }
  }

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    datePublished: doc.datePublished,
    dateModified: doc.dateModified || doc.datePublished,
    author: doc.author || "Ultimate Cineverse Team",
    tags: doc.tags || [],
    content: doc.content,
    draft: Boolean(doc.draft),
    ogImage: og
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
