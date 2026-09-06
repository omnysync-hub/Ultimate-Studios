import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogNavbar } from "@/components/blog/home/BlogNavbar";
import { QuickViewIntro } from "@/components/blog/quick/QuickViewIntro";
import { QuickViewStats } from "@/components/blog/quick/QuickViewStats";
import { QuickViewActivity } from "@/components/blog/quick/QuickViewActivity";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, blogPosts } from "@/lib/blog";
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
    title: `${post.title} (Quick View) — Ultimate Cineverse`,
    description: post.description,
    pathname: `/blog/${post.slug}/quick`
  });
}

export default async function BlogQuickViewPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const themeStyle = getPostThemeStyle(post);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
      { "@type": "ListItem", position: 3, name: `${post.title} (Quick View)`, item: `/blog/${post.slug}/quick` }
    ]
  };

  return (
    <div
      data-post-theme
      style={themeStyle}
      className="min-h-screen bg-base text-text-primary selection:bg-[var(--accent)] selection:text-[var(--accent-text-on)] pb-24"
    >
      <JsonLd data={breadcrumbs} />

      {/* Global Navbar */}
      <BlogNavbar />

      <main className="mx-auto w-full max-w-[1440px] px-5 sm:px-10 lg:px-16 pt-8">
        {/* Back Link / Breadcrumb bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to All Blogs
          </Link>
          <span
            style={{ color: "var(--accent)" }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            Quick View Mode
          </span>
        </div>

        {/* 3-Column Layout: Column A (34%), Column B (42%), Column C (24%) on desktop (§5)
            Responsive: < 1200px 2-column or stacked, < 768px single column */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-[34%_42%_1fr] items-start">
          {/* Column A: Cover + Intro (34%) */}
          <div className="w-full">
            <QuickViewIntro post={post} />
          </div>

          {/* Column B: Stats + Leaderboard (42%) */}
          <div className="w-full">
            <QuickViewStats post={post} />
          </div>

          {/* Column C: Activity Feed (24%) */}
          <div className="w-full md:col-span-2 xl:col-span-1">
            <QuickViewActivity activity={post.activity} />
          </div>
        </div>
      </main>
    </div>
  );
}
