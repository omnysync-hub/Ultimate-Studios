import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

export async function generateMetadata() {
  return buildMetadata({
    title: "Blog — Ultimate Studio",
    description:
      "Production tips, studio workflows, and equipment guidance from Ultimate Studio.",
    pathname: "/blog"
  });
}

export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-slate-200 leading-relaxed">
        Studio workflow notes, quick checklists, and practical production guidance.
      </p>

      <ul className="mt-6 space-y-4">
        {blogPosts.map((post, idx) => {
          const shouldInsertAd = (idx + 1) % 6 === 0;
          return (
            <li key={post.slug} className="space-y-2">
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded border border-slate-800 bg-slate-950 p-4 hover:border-slate-600"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-slate-300 mt-1">{post.description}</p>
                <p className="text-slate-500 mt-2 text-sm">
                  {new Date(post.datePublished).toLocaleDateString()} · {post.author}
                </p>
              </Link>

              {shouldInsertAd ? (
                <div className="mt-4">
                  <AdUnit slot="1234567890" minHeight={250} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

