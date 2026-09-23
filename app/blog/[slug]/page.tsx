import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getRelatedPosts, getBlogPosts } from "@/lib/blog-data";
import { getSite, getSiteUrl } from "@/lib/cms/store";
import { fetchApprovedComments } from "@/lib/sanity/posts";

export async function generateStaticParams() {
  const posts = await getBlogPosts(false);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const meta = buildMetadata({
    title: `${post.seoTitle || post.title} — Ultimate Cineverse`,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    openGraphImageUrl: post.ogImage
  });
  if (post.noIndex) {
    return { ...meta, robots: { index: false, follow: false } };
  }
  return meta;
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, 3);
  const comments = post._id ? await fetchApprovedComments(post._id) : [];
  const site = await getSite();
  const siteUrl = getSiteUrl();

  return (
    <BlogPostView
      post={post}
      related={related}
      comments={comments}
      siteUrl={siteUrl}
      brandName={site.brandName}
    />
  );
}
