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
        {isDark ? "☀" : "☾"}
      </span>
      <span className={styles.label}>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
