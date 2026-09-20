export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "uc-theme";
export const THEME_CHANGED_EVENT = "uc:theme-changed";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

export function getActiveTheme(): Theme {
  if (typeof document !== "undefined") {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (isTheme(fromDom)) return fromDom;
  }
  return getStoredTheme() ?? "dark";
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode — still apply for session
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(THEME_CHANGED_EVENT, { detail: theme }));
  }
}

export function toggleTheme(): Theme {
  const next: Theme = getActiveTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
