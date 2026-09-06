import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import type { BlogPost } from "@/lib/blog";

type Props = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

export function BlogArticleCard({ post, relatedPosts }: Props) {
  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // In-article ad placement after 2nd paragraph
  const adPlacementIndex = Math.min(2, Math.max(0, paragraphs.length - 1));

  return (
    <article
      className="w-full rounded-card bg-surface p-6 sm:p-12 transition-all duration-300 border-2"
      style={{
        borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.6)"
      }}
    >
      {/* Section Label + 2px Underline Rule */}
      <div className="mb-8">
        <span
          style={{ color: "var(--accent)" }}
          className="font-display text-[13px] font-bold uppercase tracking-widest"
        >
          STORY OVERVIEW
        </span>
        <div
          className="mt-2 h-[2px] w-16"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </div>

      {/* Article Body in --font-serif, 18px / 1.8 line-height, 24px paragraph spacing */}
      <div className="font-serif text-[18px] leading-[1.8] text-text-secondary space-y-6">
        {paragraphs.map((para, idx) => {
          const isQuote = para.startsWith('"') && para.endsWith('"');

          if (isQuote) {
            return (
              <blockquote
                key={idx}
                className="my-8 rounded-r-sm bg-surface-2 p-6 font-serif text-xl italic text-text-primary border-l-4"
                style={{ borderColor: "var(--accent)" }}
              >
                {para}
              </blockquote>
            );
          }

          return (
            <div key={idx}>
              <p className="text-text-primary/90">{para}</p>

              {/* In-Article AdSense slot with reserved height to keep CLS = 0 */}
              {idx === adPlacementIndex && (
                <div className="my-10 w-full overflow-hidden rounded-sm border border-border-subtle bg-surface-2 p-4 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted block mb-2">
                    Sponsored Content
                  </span>
                  <div className="flex justify-center">
                    <AdUnit slot="1234567890" minHeight={250} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 border-t border-border-subtle pt-10" aria-label="Related Articles">
          <h2 className="font-display text-2xl font-bold uppercase text-text-primary">
            Related Articles
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex flex-col rounded-sm border border-border-subtle bg-surface-2 p-4 transition-all hover:-translate-y-1 hover:border-border-subtle/50"
              >
                <div className="relative h-32 w-full overflow-hidden rounded-sm bg-base">
                  <img
                    src={related.coverImage}
                    alt={related.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-body text-sm font-bold text-text-primary group-hover:text-white line-clamp-2">
                  {related.title}
                </h3>
                <span
                  style={{ color: "var(--accent)" }}
                  className="mt-2 text-xs font-semibold"
                >
                  Read Post →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
