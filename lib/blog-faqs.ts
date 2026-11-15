/**
 * Visible FAQs for the /blog index.
 *
 * Single source of truth: the same copy is rendered on the page
 * (BlogIndex) and emitted as FAQPage JSON-LD (app/blog/page.tsx),
 * so the structured data always matches visible content.
 */
export type BlogFaqItem = { question: string; answer: string };

export const BLOG_FAQS: BlogFaqItem[] = [
  {
    question: "When is Thanksgiving 2026?",
    answer:
      "Thanksgiving in the United States falls on Thursday, November 26, 2026 — the fourth Thursday of November. That makes Thanksgiving weekend 2026 run from Thursday, November 26 through Sunday, November 29, the perfect window for a family movie marathon."
  },
  {
    question: "What are the best movies to watch on Thanksgiving?",
    answer:
      "The most-loved Thanksgiving movies mix family, food and a little chaos: Planes, Trains and Automobiles, Pieces of April, The Holdovers, Knives Out, Fantastic Mr. Fox and A Charlie Brown Thanksgiving. Our Thanksgiving guides on this blog break each pick down by mood, runtime and who should be in the room."
  },
  {
    question: "What is a good family movie for Thanksgiving Day?",
    answer:
      "For all ages around one screen, start with A Charlie Brown Thanksgiving, Fantastic Mr. Fox, Paddington 2 or Free Birds for younger kids, then move to The Holdovers or Little Women once the table clears. Every family guide here flags age fit, runtime and where the film is streaming."
  },
  {
    question: "What should we watch on Thanksgiving weekend?",
    answer:
      "Program the weekend like a menu: a parade-morning classic, a food film while dinner cooks (Ratatouille, The Hundred-Foot Journey or Julie & Julia), a big-hearted comedy after the feast, and one prestige new release for Friday night. The blog's Thanksgiving weekend watchlist is ordered exactly that way."
  },
  {
    question: "Are there movies actually set on Thanksgiving?",
    answer:
      "Yes — Pieces of April, The House of Yes, What's Cooking?, Home for the Holidays, Dutch and the Thanksgiving episodes woven into films like You've Got Mail all unfold over the holiday itself. They are rarer than Christmas films, which is exactly why we collect them in one place."
  },
  {
    question: "Where can I stream Thanksgiving movies?",
    answer:
      "Availability rotates every November across Netflix, Max, Disney+, Hulu, Peacock, Paramount+ and Prime Video. Each streaming guide on this blog is checked for the current season and links the film to the service carrying it, with a free or rental fallback where one exists."
  }
];
