/* eslint-disable @next/next/no-img-element */
import { TagPill } from "@/components/blog/shared/TagPill";
import type { BlogPost } from "@/lib/blog";

type Props = {
  post: BlogPost;
};

export function BlogHeaderCard({ post }: Props) {
  return (
    <div
      className="w-full rounded-card bg-surface p-6 sm:p-10 transition-all duration-300 border-2"
      style={{
        borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.6)",
        boxShadow: "0 0 24px var(--accent-glow)"
      }}
    >
      {/* Desktop: flex-row with cover on left (220x280px), content on right
          < 900px: Stacked with cover on top centered and content center-aligned (§6.2) */}
      <div className="flex flex-col min-[900px]:flex-row items-center min-[900px]:items-start gap-8 min-[900px]:gap-10">
        {/* Cover Image (220x280px, --radius-sm, bordered 2px solid var(--accent)) */}
        <div className="flex-shrink-0">
          <div
            className="h-[280px] w-[220px] overflow-hidden rounded-sm border-2 bg-surface-2 shadow-2xl"
            style={{ borderColor: "var(--accent)" }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-1 flex-col text-center min-[900px]:text-left">
          {/* Title (H1, --font-display, 48px/700) */}
          <h1 className="font-display text-3xl sm:text-4xl min-[900px]:text-[48px] font-bold leading-[1.15] text-text-primary">
            {post.title}
          </h1>

          {/* Author (by <name>, 20px/--text-secondary) */}
          <p className="mt-4 text-lg sm:text-xl text-text-secondary">
            by <span className="font-semibold text-text-primary">{post.author.name}</span>
            {post.author.role && (
              <span className="text-text-muted text-sm ml-2 hidden sm:inline">
                ({post.author.role})
              </span>
            )}
          </p>

          {/* Genre Tag Pills Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center min-[900px]:justify-start gap-3">
            <TagPill className="!px-5 !py-2.5">
              {post.category}
            </TagPill>
            {post.tags.map((tag) => (
              <TagPill key={tag} className="!px-5 !py-2.5">
                #{tag}
              </TagPill>
            ))}
          </div>

          {/* Meta Line: Published <date> • <n> min read • <n> views (14px/--text-muted) */}
          <div className="mt-6 text-sm text-text-muted">
            Published {new Date(post.datePublished).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • {post.readTime} • {post.views} views
          </div>
        </div>
      </div>
    </div>
  );
}
