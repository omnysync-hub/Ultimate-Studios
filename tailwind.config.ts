import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Arial", "Helvetica", "sans-serif"]
      },
      colors: {
        uc: {
          bg: "var(--uc-bg)",
          elevated: "var(--uc-bg-elevated)",
          fg: "var(--uc-fg)",
          muted: "var(--uc-fg-muted)",
          faint: "var(--uc-fg-faint)",
          red: "var(--uc-red)",
          border: "var(--uc-border)"
        }
      }
    }
  },
  plugins: []
};

export default config;
