"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/blog/shared/ProgressBar";
import { SegmentedTabControl } from "@/components/blog/shared/SegmentedTabControl";
import { Avatar } from "@/components/blog/shared/Avatar";
import type { BlogPost, LeaderboardUser } from "@/lib/blog";

type Props = {
  post: BlogPost;
};

type LeaderboardTab = "friends" | "bookclub" | "global";

const LEADERBOARD_OPTIONS = [
  { id: "friends" as LeaderboardTab, label: "Friends" },
  { id: "bookclub" as LeaderboardTab, label: "Bookclub" },
  { id: "global" as LeaderboardTab, label: "Global" }
];

export function QuickViewStats({ post }: Props) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("friends");
  const stats = post.stats;
  const currentLeaderboardList: LeaderboardUser[] = post.leaderboard[activeTab] || [];
  const currentUser = currentLeaderboardList.find((u) => u.isCurrentUser) || currentLeaderboardList[0];

  return (
    <div
      className="flex flex-col rounded-card p-6 border-2 transition-all duration-300"
      style={{
        background: `linear-gradient(180deg, var(--accent-bg-from), var(--bg-base))`,
        borderColor: "var(--accent)"
      }}
    >
      {/* 2x2 Stat Grid (§5.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Progress Tile */}
        <div
          className="relative rounded-sm bg-surface p-4 border"
          style={{ borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.4)" }}
        >
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              {/* Book Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Progress
            </span>
            {/* Share/Upload icon */}
            <svg className="w-3.5 h-3.5 hover:text-text-primary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>

          <div className="mt-2 text-2xl font-black font-display text-text-primary">
            {stats.pages_read}
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Out of {stats.total_pages} pages
          </p>

          <div className="mt-3">
            <ProgressBar current={stats.pages_read} total={stats.total_pages} />
          </div>

          {/* Reader Avatar Stack */}
          <div className="mt-3 flex items-center -space-x-2 overflow-hidden">
            <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Reader" size="sm" />
            <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Reader" size="sm" />
            <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Reader" size="sm" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-[9px] font-bold text-text-secondary border border-border-subtle">
              +18
            </span>
          </div>
        </div>

        {/* 2. Time Tile */}
        <div
          className="relative rounded-sm bg-surface p-4 border"
          style={{ borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.4)" }}
        >
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              {/* Clock Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Time
            </span>
            <svg className="w-3.5 h-3.5 hover:text-text-primary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>

          <div className="mt-2 text-2xl font-black font-display text-text-primary">
            {stats.avg_time}
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Global avg. read time for your progress
          </p>
        </div>

        {/* 3. Level Tile */}
        <div
          className="relative rounded-sm bg-surface p-4 border"
          style={{ borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.4)" }}
        >
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              {/* Star / Badge Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Level
            </span>
            <svg className="w-3.5 h-3.5 hover:text-text-primary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>

          <div className="mt-2 text-2xl font-black font-display text-text-primary">
            Level {stats.level}
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">
            {stats.reacts_to_level} reader reacts to level up
          </p>
        </div>

        {/* 4. Streak Tile */}
        <div
          className="relative rounded-sm bg-surface p-4 border"
          style={{ borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.4)" }}
        >
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              {/* Lightning Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Streak
            </span>
            <svg className="w-3.5 h-3.5 hover:text-text-primary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>

          <div className="mt-2 text-2xl font-black font-display text-text-primary">
            {stats.streak_days} Days
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Day streak, come back tomorrow to keep it up
          </p>
        </div>
      </div>

      {/* 5th Tile: Badges (Full width below 2x2 grid) */}
      <div
        className="mt-4 rounded-sm bg-surface p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{ borderColor: "rgba(var(--accent-rgb, 245, 166, 35), 0.4)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Badges
          </span>
          <span className="text-xs text-text-muted font-medium">({stats.badges.length} unlocked)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.badges.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-pill bg-surface-2 px-3 py-1 text-[11px] font-bold text-text-primary border border-border-subtle"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Leaderboard Card (§5.2) */}
      <div className="mt-6 rounded-sm bg-surface p-5 border border-border-subtle">
        {/* Header with Segmented Tab Control + Share icon */}
        <div className="flex items-center justify-between gap-4">
          <SegmentedTabControl
            options={LEADERBOARD_OPTIONS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <button
            type="button"
            className="text-text-muted hover:text-text-primary p-1.5"
            aria-label="Share Leaderboard"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        {/* Current User Rank Line */}
        {currentUser && (
          <div className="mt-4 flex items-center justify-between border-b border-border-subtle pb-3 font-display text-sm font-bold text-text-primary">
            <span style={{ color: "var(--accent)" }}>Rank #{currentUser.rank}</span>
            <span className="text-text-secondary">{currentUser.percentile}</span>
          </div>
        )}

        {/* Ranked List */}
        <ul className="mt-3 space-y-3">
          {currentLeaderboardList.map((user) => (
            <li
              key={user.rank}
              className={`flex items-center justify-between rounded-sm p-2 transition-colors ${
                user.isCurrentUser ? "bg-surface-2 border border-border-subtle" : "hover:bg-surface-2/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-display text-xs font-bold text-text-muted">
                  #{user.rank}
                </span>
                <Avatar src={user.avatar} alt={user.name} size="sm" />
                <span className="text-sm font-semibold text-text-primary">
                  {user.name}
                  {user.isCurrentUser && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold">
                      (You)
                    </span>
                  )}
                </span>
              </div>

              <div className="text-right">
                <span className="font-display text-xs font-bold text-text-primary">
                  {user.points.toLocaleString()} pts
                </span>
                <span className="block text-[10px] text-text-muted">
                  {user.percentile}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
