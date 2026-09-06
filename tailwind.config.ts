import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        /* Base Palette (§2.1) */
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        "surface-2": "var(--bg-surface-2)",
        "border-subtle": "var(--border-subtle)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "brand-red": "var(--brand-red)",
        "brand-red-hover": "var(--brand-red-hover)",

        /* Fixed Category Colors (§2.2) */
        "cat-movies": "var(--cat-movies)",
        "cat-anime": "var(--cat-anime)",
        "cat-series": "var(--cat-series)",
        "cat-cinema": "var(--cat-cinema)",

        /* Dynamic Post-Theming Variables (§3) */
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        "accent-glow": "var(--accent-glow)",
        "accent-bg-from": "var(--accent-bg-from)",
        "accent-bg-to": "var(--accent-bg-to)",
        "accent-text-on": "var(--accent-text-on)"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"]
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
        sm: "var(--radius-sm)"
      },
      boxShadow: {
        "brand-red": "var(--glow-brand-red)",
        cyan: "var(--glow-cyan)",
        magenta: "var(--glow-magenta)"
      },
      spacing: {
        "page-desktop": "var(--page-margin-desktop)",
        "page-mobile": "var(--page-margin-mobile)"
      }
    }
  },
  plugins: []
};

export default config;
