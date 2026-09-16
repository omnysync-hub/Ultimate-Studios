"use client";

import { useEffect, useState } from "react";
import {
  THEME_CHANGED_EVENT,
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type Theme
} from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => setThemeState(getStoredTheme() ?? "dark");
    sync();
    applyTheme(getStoredTheme() ?? "dark");
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
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? "☀" : "☾"}
      </span>
      <span className={styles.label}>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
