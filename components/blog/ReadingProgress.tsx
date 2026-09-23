"use client";

import { useEffect, useState } from "react";
import styles from "./engage.module.css";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setProgress(scrollable <= 0 ? 0 : Math.min(100, (el.scrollTop / scrollable) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.progressTrack} aria-hidden="true">
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  );
}
