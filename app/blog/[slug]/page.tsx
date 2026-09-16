import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getRelatedPosts, getBlogPosts } from "@/lib/blog-data";
import { getSite, getSiteUrl } from "@/lib/cms/store";

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
  return buildMetadata({
    title: `${post.title} — Ultimate Cineverse`,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    openGraphImageUrl: post.ogImage
  });
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
  const site = await getSite();
  const siteUrl = getSiteUrl();

  return (
    <BlogPostView
      post={post}
      related={related}
      siteUrl={siteUrl}
      brandName={site.brandName}
    />
  );
}
