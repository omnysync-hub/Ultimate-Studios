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
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M12 2.75v1.8M12 19.45v1.8M2.75 12h1.8M19.45 12h1.8M5.2 5.2l1.3 1.3M17.5 17.5l1.3 1.3M18.8 5.2l-1.3 1.3M6.5 17.5l-1.3 1.3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className={styles.svg} fill="none">
            <path
              d="M20 13.2A7.8 7.8 0 0 1 10.8 4 7 7 0 1 0 20 13.2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
