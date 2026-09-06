import Link from "next/link";
import { Avatar } from "@/components/blog/shared/Avatar";
import { hexToRgba } from "@/lib/theme";
import type { BlogPost } from "@/lib/blog";

type Props = {
  posts: BlogPost[];
};

export function BlogTrending({ posts }: Props) {
  return (
    <section
      id="trending"
      className="relative mt-20 w-full overflow-hidden rounded-card py-10 px-6 sm:px-10"
      aria-label="Trending Blogs"
    >
      {/* Background with subtle diagonal speed lines texture & dark overlay */}
      <div
        className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/40 via-blue-950/30 to-base"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -45deg,
              rgba(214, 48, 63, 0.05),
              rgba(214, 48, 63, 0.05) 2px,
              transparent 2px,
              transparent 20px
            ),
            radial-gradient(ellipse at top right, rgba(59, 155, 245, 0.15), transparent 70%),
            radial-gradient(ellipse at bottom left, rgba(214, 48, 63, 0.15), transparent 70%)
          `
        }}
      />
      <div className="absolute inset-0 bg-base/85 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[28px] font-extrabold uppercase tracking-[0.5px] text-white">
            TRENDING BLOGS
          </h2>
          <span className="text-xs uppercase font-bold tracking-widest text-text-muted hidden sm:inline-block">
            ← Scroll to explore →
          </span>
        </div>

        {/* Horizontal Scroll Row */}
        <div className="mt-8 flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => {
            const accent = post.theme_accent || "#F5A623";
            const glow = hexToRgba(accent, 0.45);

            return (
              <article
                key={post.slug}
                className="group flex-shrink-0 w-[220px] snap-start transition-transform duration-200 hover:-translate-y-1.5"
              >
                <Link href={`/blog/${post.slug}/quick`} className="block">
                  {/* Cover Thumbnail (220x260px) with dynamic accent border + glow */}
                  <div
                    style={{
                      borderColor: accent,
                      boxShadow: `0 0 18px ${glow}`
                    }}
                    className="relative h-[260px] w-[220px] overflow-hidden rounded-sm border-2 bg-surface-2 transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(245,166,35,0.7)]"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-60" />

                    {/* Category pill indicator on top */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded-pill bg-base/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-primary border border-border-subtle">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Title (15px / 700 / 2-line clamp) */}
                  <h3 className="mt-3 font-body text-[15px] font-bold leading-snug text-text-primary group-hover:text-white transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Author Row (24px avatar + 13px author name) */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
                    <span className="text-[13px] font-medium text-text-secondary line-clamp-1">
                      {post.author.name}
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
