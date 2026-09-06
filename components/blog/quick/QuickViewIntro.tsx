/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

type Props = {
  post: BlogPost;
};

export function QuickViewIntro({ post }: Props) {
  // Take first ~80 words of content as excerpt
  const words = post.content.split(/\s+/);
  const excerpt =
    words.length > 80 ? words.slice(0, 80).join(" ") + "..." : post.content;

  return (
    <div
      className="flex flex-col rounded-card bg-surface p-6 sm:p-8 border transition-all duration-300"
      style={{
        borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.3)",
        borderWidth: "1px"
      }}
    >
      {/* Cover Image (190x280px, rounded-sm, drop shadow) */}
      <div className="flex justify-center sm:justify-start">
        <div className="relative h-[280px] w-[190px] overflow-hidden rounded-sm bg-surface-2 border border-border-subtle shadow-2xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Title & Author */}
      <h2 className="mt-6 font-display text-2xl sm:text-[28px] font-extrabold leading-tight text-text-primary">
        {post.title}
      </h2>

      <div className="mt-2 text-base text-text-secondary">
        Author: <span className="font-semibold text-text-primary">{post.author.name}</span>
      </div>

      {/* Excerpt (~80 words) */}
      <p className="mt-4 font-body text-base leading-[1.6] text-text-secondary">
        {excerpt}
      </p>

      {/* "Continue Reading →" Link in var(--accent) */}
      <div className="mt-6">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 font-bold text-base transition-colors hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Continue Reading →
        </Link>
      </div>
    </div>
  );
}
