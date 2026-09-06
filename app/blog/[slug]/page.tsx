import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogNavbar } from "@/components/blog/home/BlogNavbar";
import { BlogHeaderCard } from "@/components/blog/detail/BlogHeaderCard";
import { BlogArticleCard } from "@/components/blog/detail/BlogArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getRelatedPosts, blogPosts } from "@/lib/blog";
import { getPostThemeStyle } from "@/lib/theme";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: `${post.title} — Ultimate Cineverse`,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    openGraphImageUrl: post.coverImage
  });
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const themeStyle = getPostThemeStyle(post);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `/blog/${post.slug}` }
    ]
  };

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Person",
      name: post.author.name
    },
    publisher: {
      "@type": "Organization",
      name: "Ultimate Cineverse",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/logo.png`
      }
    }
  };

  return (
    <div
      data-post-theme
      style={themeStyle}
      className="min-h-screen bg-base text-text-primary selection:bg-[var(--accent)] selection:text-[var(--accent-text-on)] pb-24"
    >
      <JsonLd data={breadcrumb} />
      <JsonLd data={blogPosting} />

      {/* Global Navbar */}
      <BlogNavbar />

      {/* Main Container: Centered max-width 1200px (§6.1) */}
      <main className="mx-auto w-full max-w-[1200px] px-5 sm:px-10 pt-8">
        {/* Navigation / Quick View Switcher Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to All Blogs
          </Link>
          <Link
            href={`/blog/${post.slug}/quick`}
            style={{ color: "var(--accent)" }}
            className="text-xs font-bold uppercase tracking-wider hover:underline"
          >
            Open in Quick-View ↗
          </Link>
        </div>

        {/* Two Stacked Blocks with 48px gap (§6.1) */}
        <div className="flex flex-col gap-12">
          {/* Block 1: Header Card */}
          <BlogHeaderCard post={post} />

          {/* Block 2: Article Body Card */}
          <BlogArticleCard post={post} relatedPosts={related} />
        </div>
      </main>
    </div>
  );
}
