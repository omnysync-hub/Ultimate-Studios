# Project Context

What this site is, what the code actually implements today, and what remains stubbed.

## Product (from code and copy)

**Ultimate Studios** presents as a **creative production studio** — films, stages, facilities, equipment, and portfolio work. The homepage is a high-motion marketing experience (hero typography, domination stats section, YouTube portfolio carousel, CTA, footer). Secondary goals:

1. **Studio inquiries** — `/contact` (form not wired), `/about` (minimal copy)
2. **Blog / SEO traffic** — `/blog` with production tips content
3. **Monetization** — Google AdSense scoped to blog routes only (see below)

YouTube portfolio pulls from a **hardcoded channel ID** in `lib/youtube.ts` (`YOUTUBE_CHANNEL_ID`). Footer reel uses a **Google sample video URL** in `lib/studio.ts` (`footerReelSrc`) with a comment to swap for a local file later.

**Ask the user** for anything not verifiable in repo: real studio address, booking process, pricing, team bios, and which brand string is canonical (**"Ultimate Studios"** in nav/root metadata vs **"Ultimate Studio"** in several page titles and JSON-LD).

## Monetization model (as implemented)

| Mechanism | Status |
|-----------|--------|
| Google AdSense | Scaffolded — placeholder `ca-pub-XXXXXXXXXXXX`, slot `1234567890`, `public/ads.txt` placeholder |
| Ad placement | Blog index (every 6th post), post inline + sidebar sticky — max ~3 units per post |
| Ad script scope | `AdScriptLoader` only in `app/blog/layout.tsx` — correct blog-only loading |
| Consent | `localStorage` keys `adsConsent` and `analyticsConsent` — **no UI banner** to set them; ads/GA never load for typical users until consent is implemented |
| GA4 | `GoogleAnalytics` in root layout; loads only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` matches `G-…` and analytics consent is true |
| Vercel Speed Insights | Active in `app/layout.tsx` |

**Business rule (enforced in code + `.cursorrules`):** Never render AdSense on homepage, about, contact, privacy, terms, or error pages.

## Blog and content

- **Sanity CMS** — posts in project `pbq9a26l` / `production`. Standalone Studio: sibling folder `studio-ultimate-studios`. App fetches via `lib/sanity/posts.ts`.
- Site chrome (contact, socials, about, SEO defaults) still in `content/site.json` via `lib/cms/store.ts` (`getSite`).
- Related posts by shared tags (`getRelatedPosts`).
- Blog JSON-LD: `BlogPosting` + `BreadcrumbList` on `[slug]` page.
- **No** blog search despite homepage `WebSite` schema `SearchAction` pointing to `/blog?query=` — search not built.
- **No** RSS feed, categories pages, or pagination yet.
- Optional one-time import: `npm run migrate:sanity` from `content/posts.json`.

## SEO baseline (what exists)

**Implemented:**

- `lib/seo.ts` — `buildMetadata()` with title, description, canonical, Open Graph, Twitter card
- `generateMetadata` on main routes
- `app/sitemap.ts` — static routes + all blog slugs
- `app/robots.ts` — allow `/`, disallow `/api/`, `/studio/`, `/draft/`, `/preview/`
- `components/seo/JsonLd.tsx` — JSON-LD script injection
- Homepage: `Organization` + `WebSite` JSON-LD
- About/contact: `BreadcrumbList`
- Blog posts: `BlogPosting` (partial — no `image` field)
- Security/perf headers in `next.config.js` (CSP allows AdSense/GA domains)

**Gaps agents should know (not auto-fix without task):**

- `NEXT_PUBLIC_SITE_URL` defaults to `https://example.com` — breaks canonicals until set in production
- No `logo.png` in `public/` but referenced in Organization schema
- Privacy/terms are placeholder — insufficient for AdSense/legal compliance
- No footer links to privacy/terms (not in `SiteNav` or `StudioFooter`)
- No cookie/CMP UI
- No Google Search Console verification meta tag in code
- Homepage hero/portfolio not using `generateMetadata` images / OG defaults

**When adding or editing any page**, at minimum:

1. Export `generateMetadata` using `buildMetadata({ title, description, pathname })`
2. One `<h1>` per page, logical heading hierarchy
3. Add route to `app/sitemap.ts` if new top-level URL
4. Add `JsonLd` if sibling pages use structured data for the same page type

## Route map

| URL | Server page | Notes |
|-----|-------------|-------|
| `/` | `(marketing)/page.tsx` | `HomeExperience` + YouTube fetch |
| `/about` | `(marketing)/about/page.tsx` | Short placeholder-ish copy |
| `/contact` | `(marketing)/contact/page.tsx` | Non-functional form (`type="button"`) |
| `/blog` | `blog/page.tsx` | Sanity posts + ads |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Article + ads + related |
| `/privacy` | `privacy/page.tsx` | Placeholder legal text |
| `/terms` | `terms/page.tsx` | Placeholder legal text |

Global chrome: `SiteNav` in root layout (Work anchor `/#work`, About, Blog, Contact).

## Stub / placeholder inventory

Treat as **known incomplete** — do not assume done:

| Area | Location | State |
|------|----------|-------|
| Privacy Policy | `app/privacy/page.tsx` | Literal placeholder paragraph |
| Terms of Service | `app/terms/page.tsx` | Literal placeholder paragraph |
| Contact form | `app/(marketing)/contact/page.tsx` | No submit handler / API |
| Error page copy | `app/error.tsx` | "placeholder error page" text |
| Studio contact | `lib/studio.ts` | Fake phone `+1 (000) 000-0000`, generic social URLs |
| AdSense IDs | `AdUnit.tsx`, `AdScriptLoader.tsx`, `ads.txt` | `XXXXXXXXXXXX` placeholders |
| Hero videos | `HeroSection.tsx` | `videoPlaceholder` divs, no real media |
| Cookie/consent UI | — | Missing entirely |
| `public/` assets | — | Only `ads.txt`; no favicon/logo |
| Legacy static site | `index.html`, `styles.css`, `script.js` | Orphan prototype |

## Data files (`lib/`)

| File | Role |
|------|------|
| `blog.ts` | All blog posts and helpers |
| `studio.ts` | Contact + social + footer video URL |
| `youtube.ts` | Channel RSS fetch + types |
| `domination.ts` | Stat metrics for domination section |
| `portfolio.ts` | Portfolio-related constants (if any) |
| `seo.ts` | Metadata builder |
| `gsap.ts` | Dynamic GSAP loader |
| `useInViewOnce.ts` | Intersection hook for deferred animation |
| `utils.ts` | `cn()` helper (unused elsewhere) |

## Navigation and internal linking

- Blog linked from `SiteNav` only — homepage sections do not prominently link to latest posts.
- Blog posts link to 3 related posts; no links to about/contact in article template.
- Footer has copyright line only — no privacy/terms links.

## Deployment assumptions

- Next.js on Vercel is documented in `.cursorrules` but **not configured** in-repo (`vercel.json` absent).
- `npm run build` is the production compile check.
- Port **3000** for dev and start scripts.

## Items for the repo owner to fill in

These cannot be inferred from code — ask before substituting real values:

1. Production domain for `NEXT_PUBLIC_SITE_URL`
2. Real AdSense publisher ID and per-placement ad unit slot IDs
3. GA4 measurement ID
4. Legal review for privacy, terms, and cookie policy
5. CMP vendor or custom consent banner design
6. Real contact email, phone, address, and social profile URLs
7. Canonical brand spelling (Studios vs Studio)
8. Blog authoring workflow (stay in `lib/blog.ts` vs MDX vs CMS)
9. Whether legacy root HTML/CSS/JS should be removed or archived
