import type { CSSProperties } from "react";

export type PostThemeSwatches = {
  theme_accent?: string;
  theme_accent_light?: string;
  theme_bg_from?: string;
};

export const FALLBACK_THEME = {
  accent: "#F5A623",
  accentLight: "#FFD98A",
  accentGlow: "rgba(245, 166, 35, 0.45)",
  bgFrom: "#2A1B08",
  bgTo: "#0D0509",
  textOn: "#0D0509"
};

/**
 * Calculates WCAG relative luminance of a hex color.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B (after sRGB gamma correction)
 */
export function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6 && cleanHex.length !== 3) {
    return 0;
  }

  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  } else {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  }

  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Converts a hex string to RGBA with a given opacity.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 6) return `rgba(245, 166, 35, ${alpha})`;
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns inline CSS custom properties for [data-post-theme] element.
 * Follows design.md §3 specifications.
 */
export function getPostThemeStyle(post?: PostThemeSwatches | null): CSSProperties {
  if (!post || !post.theme_accent) {
    return {
      "--accent": FALLBACK_THEME.accent,
      "--accent-light": FALLBACK_THEME.accentLight,
      "--accent-glow": FALLBACK_THEME.accentGlow,
      "--accent-bg-from": FALLBACK_THEME.bgFrom,
      "--accent-bg-to": FALLBACK_THEME.bgTo,
      "--accent-text-on": FALLBACK_THEME.textOn
    } as CSSProperties;
  }

  const accent = post.theme_accent;
  const accentLight = post.theme_accent_light || accent;
  const bgFrom = post.theme_bg_from || "#2A1B08";
  const bgTo = "#0D0509";
  const accentGlow = hexToRgba(accent, 0.45);

  const luminance = getRelativeLuminance(accent);
  const textOn = luminance > 0.5 ? "#0D0509" : "#F5F0EA";

  return {
    "--accent": accent,
    "--accent-light": accentLight,
    "--accent-glow": accentGlow,
    "--accent-bg-from": bgFrom,
    "--accent-bg-to": bgTo,
    "--accent-text-on": textOn
  } as CSSProperties;
}
