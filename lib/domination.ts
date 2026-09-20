export type StatMetric = {
  id: string;
  target: number;
  suffix: string;
  decimals?: number;
  label: string;
  description: string;
  format?: "compact" | "comma";
};

export const dominationIntro = [
  "We didn't just start creating content.",
  "We built audiences, shipped thousands of videos and turned attention into a community that keeps growing."
];

export const dominationSupport =
  "From YouTube to every major social platform, our work has reached hundreds of millions of views and millions of people worldwide.";

export const dominationStats: StatMetric[] = [
  {
    id: "followers",
    target: 1.87,
    suffix: "M+",
    decimals: 2,
    label: "FOLLOWERS ACROSS SOCIALS",
    description:
      "A growing global audience built across platforms, communities and countless pieces of content.",
    format: "compact"
  },
  {
    id: "subscribers",
    target: 679,
    suffix: "K+",
    decimals: 0,
    label: "YOUTUBE SUBSCRIBERS",
    description: "A community that keeps coming back for what we create.",
    format: "compact"
  },
  {
    id: "videos",
    target: 1600,
    suffix: "+",
    decimals: 0,
    label: "VIDEOS PUBLISHED ON YOUTUBE",
    description:
      "Thousands of videos created, edited, published and optimized — with every upload teaching us something new.",
    format: "comma"
  },
  {
    id: "views",
    target: 255,
    suffix: "M+",
    decimals: 0,
    label: "TOTAL YOUTUBE VIEWS",
    description:
      "Hundreds of millions of views generated through years of consistent creative production.",
    format: "compact"
  }
];

export const dominationClosers = ["STILL JUST GETTING STARTED."];
