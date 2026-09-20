"use client";

import { useEffect, useState } from "react";
import {
  THEME_CHANGED_EVENT,
  applyTheme,
  getActiveTheme,
  toggleTheme,
  type Theme
} from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => {
      const next = getActiveTheme();
      applyTheme(next);
      setThemeState(next);
    };
    sync();
    window.addEventListener(THEME_CHANGED_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGED_EVENT, sync);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setThemeState(toggleTheme())}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" className={styles.svg} fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.05 5.05l1.55 1.55M17.4 17.4l1.55 1.55M18.95 5.05l-1.55 1.55M6.6 17.4l-1.55 1.55"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className={styles.svg} fill="none">
            <path
              d="M20.2 13.4A8.2 8.2 0 0 1 10.6 3.8 7.4 7.4 0 1 0 20.2 13.4Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.label}>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
