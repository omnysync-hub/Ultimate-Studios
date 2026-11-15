# Thanksgiving Rebrand + SEO Round — November 15, 2026

Branch: `feat/thanksgiving-blog-seo` · Site: https://ultimatecineverse.com · Scope: `/blog` theme + sitewide technical SEO foundations
Method: technical / schema / sitemap / GEO checklists from [claude-seo](https://github.com/AgricIDaniel/claude-seo), verified against the production build output (not just source).

## Theme: Halloween → Thanksgiving

- Warm espresso / pumpkin / cranberry / gold palette (blog-scoped CSS variables, same pattern as before).
- Hero is now pure CSS artwork — the 103 KB Halloween photo is no longer the LCP element, so the blog hero paints from HTML/CSS immediately.
- Interactive, all lightweight and `prefers-reduced-motion` safe:
  - **Live countdown** to Thanksgiving Day (computed as the 4th Thursday of November — Nov 26, 2026 this year, rolls over automatically).
  - **Thanksgiving Watch Picker** — six mood cards that run a real search over the library and scroll to results.
  - **Gratitude Wall** — visitors pin a one-line note of thanks; stored only in their browser (localStorage), no server, no tracking.
  - **Falling leaves** (5 leaves, CSS-only), leaf-sprig card accents, wheat footer mark. Bats, cobwebs and pumpkins removed.
- Copy: "Gather. Watch. Give thanks." — hero, picker, reading room, FAQ and footer all re-voiced for the season. Zero `Halloween` references remain in code or rendered blog pages.

## SEO fixes (verified in build output)

### Critical
1. **Fabricated review ratings removed.** Every review post emitted `Review` schema with a hardcoded `ratingValue: 8.5` — there is no rating field in the CMS, so most posts claimed a score they never gave. That is a structured-data spam risk (manual action / rich-result ban). Reviews now emit a clean `Movie` entity with no rating. *To restore rich-result eligibility properly: add a numeric `rating` field to the Sanity `post` schema, fill it per post, and re-enable Review schema reading that field.*
2. **Sitemap lastmod honesty.** Static routes were stamped `new Date()` on every generation — a lastmod that always changes teaches Google to ignore it. Static pages now use the newest real post `dateModified`; posts keep their own dates, and the sitemap now includes post cover images (48 URLs, image extension verified).

### On-page / metadata
3. Blog index retitled for the November search surge + evergreen base: "Thanksgiving Movies, Family Films & What to Watch — Blog", 157-char description, 11 target keywords.
4. New 1200×630 Thanksgiving OG image, generated dynamically by `app/blog/opengraph-image.tsx` (next/og) so it always matches the theme and needs no binary asset in the repo.
5. `buildMetadata()` now supports/emits: meta keywords, authors, creator/publisher, category, article `publishedTime/modifiedTime/authors/section/tags`, RSS alternate, and rich-crawl robots directives (`max-image-preview: large`, `max-snippet: -1`) for Google Discover. Article pages pass the post's real author, primary tag and focus keyword.
6. Root layout: keyword-rich default title/description, full OG + Twitter defaults, sitewide rich-crawl robots.

### Structured data
7. Blog index now ships one `@graph`: `Blog` (with the 20 newest `BlogPosting`s), `CollectionPage` + `ItemList`, `BreadcrumbList`, `FAQPage`, and a Thanksgiving Day 2026 `Event`.
8. **Visible FAQ section** with six Thanksgiving questions (when is Thanksgiving 2026, best Thanksgiving movies, family picks, weekend watchlist, movies set on Thanksgiving, where to stream) — the FAQ schema is generated from the *same array* the page renders, so schema and content can never drift.
9. Post schema enriched: publisher logo, `inLanguage`, `articleSection`, keywords/focus keyword, `mainEntityOfPage` as a WebPage `@id`.

### GEO / AI search
10. `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot/Web, PerplexityBot/User, Google-Extended, Applebot-Extended, CCBot and others — the site stays citable by AI answers.
11. New `public/llms.txt` describing the site, blog, feed and citation preferences.

### Feeds & discovery
12. RSS: per-post `<category>` from tags, correct enclosure MIME type (was hardcoded JPEG), copyright + TTL.
13. Internal linking: FAQ section links to Thanksgiving search, topic filters and About; post pages link Home → Blog → Article with matching breadcrumb schema.

### Verification support
14. GSC/Bing verification meta tags are now supported via env vars (no hardcoded values): set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and/or `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Cloudflare (values documented in `.env.example`).

## Verified
- `npm run build:next` — compiles, type-checks, 56 pages generated (41 live Sanity posts).
- Live smoke test of the built server: `/blog` returns the new title/description/canonical/OG, exactly one `<h1>`, all five JSON-LD graph types parse; a review post shows no `ratingValue`/`AggregateRating` anywhere; `/feed.xml` carries categories (41 items); `/llms.txt` 200; robots shows the AI-crawler groups; sitemap has 48 URLs with image entries.
- Ads scope unchanged: `AdUnit`/`AdScriptLoader` still render only on blog routes.
- Pre-existing build warning (not from this change): PortableText `dataTable` blocks in some Sanity posts render without a component — worth a follow-up so those tables appear in articles.

## Could not run from the agent VM (needs the owner's machine)
- **OpenSEO MCP** (`https://app.openseo.so/mcp`) and **GSC MCP** (`mcp-search-console`) are configured in `.agents/mcp_config.json` / `.cursor/mcp.json` for the owner's Windows machine — the GSC OAuth secrets live at `C:/Users/mmurt/.gsc/client_secrets.json` there. They cannot be executed from this environment, so no GSC performance data was pulled and nothing here invents any.

## After deploy — 10-minute GSC checklist
1. Cloudflare: confirm the deploy of this branch, then set the two verification env vars above and redeploy once.
2. Google Search Console → Sitemaps: submit `sitemap.xml` (and `feed.xml` as an RSS sitemap).
3. URL Inspection → `https://ultimatecineverse.com/blog` → Request Indexing. Repeat for the 3–5 highest-traffic posts.
4. Bing Webmaster Tools: verify via the meta tag, submit the same sitemap, and enable IndexNow if offered.
5. After 7 days: GSC → Performance → filter page `/blog` — watch impressions for "thanksgiving movies", "what to watch on thanksgiving", "family movies thanksgiving". The seasonal window peaks Nov 20–29.
6. Rich Results Test on one review post + the blog index to confirm the new schema validates.

## Content follow-ups that would multiply the traffic
- Publish 2–3 dedicated posts before Nov 20 targeting the FAQ questions (best Thanksgiving movies ranked; Thanksgiving weekend watchlist; movies set on Thanksgiving) and link them from the blog index FAQ answers.
- Add the Sanity `rating` field (see fix #1) to unlock review rich results honestly.
- Add a PortableText `dataTable` renderer so existing table content renders (and becomes indexable text).
