import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/cms/store";

/**
 * Robots: open to search + AI crawlers (GEO). Explicitly allowing the AI
 * search/answer crawlers keeps Ultimate Cineverse eligible to be cited by
 * ChatGPT, Perplexity, Claude, Gemini/AI Overviews and Copilot, which is
 * free referral traffic on top of classic search.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Bytespider"
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const privatePaths = ["/api/", "/studio/", "/draft/", "/preview/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: privatePaths
      }))
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/feed.xml`],
    host: siteUrl
  };
}
