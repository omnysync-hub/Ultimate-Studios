import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdUnit } from "@/components/ads/AdUnit";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: `${post.title} — Ultimate Studio`,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    openGraphImageUrl: undefined
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

  const paragraphs = post.content.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const related = getRelatedPosts(post.slug, 3);

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
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Organization",
      name: post.author
    }
  };

  // Reserve a single inline ad container so CLS stays flat.
  const inlineAdAfter = Math.min(2, Math.max(0, paragraphs.length - 1));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <JsonLd data={breadcrumb} />
      <JsonLd data={blogPosting} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <article className="max-w-none">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="mt-2 text-slate-300">
            {new Date(post.datePublished).toLocaleDateString()} · {post.author}
          </p>

          <div className="mt-6">
            {paragraphs.map((p, idx) => {
              const shouldInsertInlineAd = idx === inlineAdAfter;
              return (
                <div key={idx}>
                  <p>{p}</p>
                  {shouldInsertInlineAd ? (
                    <div className="my-8">
                      <AdUnit slot="1234567890" minHeight={300} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Related posts</h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link className="text-amber-300 hover:text-amber-200" href={`/blog/${r.slug}`}>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="sticky top-6 hidden lg:block">
          <div className="rounded border border-slate-800 bg-slate-950 p-3">
            <div className="text-sm font-semibold text-slate-200">Sponsored</div>
            <AdUnit slot="1234567890" minHeight={250} className="mt-3" />
          </div>
        </aside>
      </div>
    </div>
  );
}

