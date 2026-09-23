"use client";

import { useEffect, useState } from "react";
import styles from "./engage.module.css";

const STREAK_KEY = "uc-read-streak";
const DONE_PREFIX = "uc-read-done:";

type Streak = { week: string; count: number; slugs: string[] };

function weekId() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

export function ChapterComplete({ slug }: { slug: string }) {
  const [show, setShow] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      const pct = el.scrollTop / scrollable;
      if (pct < 0.9) return;
      fired = true;

      try {
        if (localStorage.getItem(DONE_PREFIX + slug)) {
          const raw = localStorage.getItem(STREAK_KEY);
          const parsed = raw ? (JSON.parse(raw) as Streak) : null;
          setStreakCount(parsed?.week === weekId() ? parsed.count : 0);
          return;
        }

        const w = weekId();
        const raw = localStorage.getItem(STREAK_KEY);
        let streak: Streak = raw ? (JSON.parse(raw) as Streak) : { week: w, count: 0, slugs: [] };
        if (streak.week !== w) streak = { week: w, count: 0, slugs: [] };
        if (!streak.slugs.includes(slug)) {
          streak.slugs.push(slug);
          streak.count += 1;
        }
        localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
        localStorage.setItem(DONE_PREFIX + slug, "1");
        setStreakCount(streak.count);
        setShow(true);
        window.setTimeout(() => setShow(false), 5000);
      } catch {
        setShow(true);
        window.setTimeout(() => setShow(false), 4000);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!show) return null;

  return (
    <div className={styles.chapterToast} role="status">
      <p className={styles.chapterTitle}>Chapter complete</p>
      <p className={styles.chapterSub}>
        {streakCount > 1 ? `${streakCount} articles this week — keep going.` : "Nice read. Explore another story below."}
      </p>
    </div>
  );
}
