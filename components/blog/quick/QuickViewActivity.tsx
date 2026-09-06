"use client";

import { Avatar } from "@/components/blog/shared/Avatar";
import type { ActivityComment } from "@/lib/blog";

type Props = {
  activity: ActivityComment[];
};

export function QuickViewActivity({ activity }: Props) {
  return (
    <div className="flex flex-col py-2" aria-label="Activity Feed">
      {/* Header: Activity (H3, --text-primary) */}
      <h3 className="font-display text-xl font-bold text-text-primary">
        Activity
      </h3>

      {/* Vertical list of comment items, 20px gap between items, no dividers */}
      <div className="mt-6 flex flex-col gap-5">
        {activity.map((item) => (
          <article key={item.id} className="flex items-start gap-3">
            {/* Circular Avatar (40px) */}
            <Avatar src={item.avatar} alt={item.name} size="md" />

            <div className="flex-1">
              {/* Name (14px/700) + Relative Time (12px/--text-muted) */}
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-bold text-text-primary">
                  {item.name}
                </span>
                <span className="text-xs text-text-muted">
                  {item.time}
                </span>
              </div>

              {/* Comment Text (14px/--text-secondary, 2-3 line clamp) */}
              <p className="mt-1 font-body text-sm leading-relaxed text-text-secondary line-clamp-3">
                {item.comment}
              </p>

              {/* Reply Link in var(--accent) */}
              <div className="mt-1.5">
                <button
                  type="button"
                  style={{ color: "var(--accent)" }}
                  className="text-xs font-semibold hover:underline"
                  onClick={() => alert(`Replying to ${item.name}`)}
                >
                  Reply
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
