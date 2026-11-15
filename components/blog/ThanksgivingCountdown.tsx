"use client";

import { useEffect, useState } from "react";
import styles from "./blog.module.css";

/** Thanksgiving Day in the US: the fourth Thursday of November. */
export function thanksgivingDate(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const firstThursdayOffset = (4 - nov1.getDay() + 7) % 7; // 4 = Thursday
  return new Date(year, 10, 1 + firstThursdayOffset + 21, 0, 0, 0, 0);
}

type Parts = { days: number; hours: number; minutes: number; seconds: number; isToday: boolean; label: string };

function compute(now: Date): Parts {
  let year = now.getFullYear();
  let target = thanksgivingDate(year);
  const endOfDay = new Date(target);
  endOfDay.setHours(23, 59, 59, 999);
  if (now > endOfDay) {
    year += 1;
    target = thanksgivingDate(year);
  }
  const isToday = now >= target && now <= endOfDay;
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    isToday,
    label: target.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live countdown to Thanksgiving Day. Renders a stable server-friendly
 * placeholder first, then ticks every second on the client.
 */
export function ThanksgivingCountdown() {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(compute(new Date()));
    const id = window.setInterval(() => setParts(compute(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <div className={styles.countdown} role="timer" aria-label="Countdown to Thanksgiving Day">
        <span className={styles.countdownLabel}>Thanksgiving Day is coming</span>
      </div>
    );
  }

  if (parts.isToday) {
    return (
      <div className={styles.countdown} role="timer" aria-label="Today is Thanksgiving Day">
        <span className={styles.countdownLabel}>Today — {parts.label}</span>
        <span className={styles.countdownToday}>Happy Thanksgiving. The table is set.</span>
      </div>
    );
  }

  return (
    <div className={styles.countdown} role="timer" aria-label={`Countdown to Thanksgiving Day, ${parts.label}`}>
      <span className={styles.countdownLabel}>Until Thanksgiving · {parts.label}</span>
      <span className={styles.countdownUnits}>
        <span><strong>{parts.days}</strong> days</span>
        <span><strong>{pad(parts.hours)}</strong> hrs</span>
        <span><strong>{pad(parts.minutes)}</strong> min</span>
        <span><strong>{pad(parts.seconds)}</strong> sec</span>
      </span>
    </div>
  );
}
