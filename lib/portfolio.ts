export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  year: string;
  accent: string;
  tone: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "north-signal",
    title: "NORTH SIGNAL",
    category: "Brand Film",
    year: "2025",
    accent: "#e10600",
    tone: "#1a0505"
  },
  {
    id: "after-hours",
    title: "AFTER HOURS",
    category: "Music Visual",
    year: "2025",
    accent: "#7c6cff",
    tone: "#0c0a18"
  },
  {
    id: "cold-open",
    title: "COLD OPEN",
    category: "Series Opener",
    year: "2024",
    accent: "#4ecdc4",
    tone: "#061212"
  },
  {
    id: "glass-market",
    title: "GLASS MARKET",
    category: "Commercial",
    year: "2024",
    accent: "#e8b84a",
    tone: "#121008"
  },
  {
    id: "redline",
    title: "REDLINE",
    category: "Short Form",
    year: "2024",
    accent: "#ff5a36",
    tone: "#140806"
  },
  {
    id: "orbit-city",
    title: "ORBIT CITY",
    category: "World Build",
    year: "2023",
    accent: "#6ec8ff",
    tone: "#071018"
  },
  {
    id: "static-bloom",
    title: "STATIC BLOOM",
    category: "Campaign",
    year: "2023",
    accent: "#f2f0e8",
    tone: "#101010"
  },
  {
    id: "night-cut",
    title: "NIGHT CUT",
    category: "Edit Reel",
    year: "2023",
    accent: "#c45cff",
    tone: "#120816"
  },
  {
    id: "heavy-light",
    title: "HEAVY LIGHT",
    category: "Documentary",
    year: "2022",
    accent: "#9ad67c",
    tone: "#0a1208"
  }
];
