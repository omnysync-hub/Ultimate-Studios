# Ultimate Cineverse Website — Agent Guide

Production marketing site for **Ultimate Cineverse** (creative studio / production). Built with **Next.js 15 App Router**, **React 19**, and **TypeScript strict**. Primary business direction in code: **Google AdSense on `/blog` only**, organic blog traffic, studio lead-gen via homepage portfolio and contact.

## Stack (verified from `package.json`)

| Layer | Choice |
|-------|--------|
| Framework | Next.js `^15.0.0` (App Router) |
| UI | React `^19.0.0` |
| Language | TypeScript `^5.5.4`, `strict: true` |
| Styling | **CSS Modules** on homepage/marketing sections; **Tailwind** on blog, about, contact, privacy, terms, error, not-found |
| Animation | GSAP `^3.15.0` (dynamic import via `lib/gsap.ts`) |
| Carousel | Swiper `^14.1.0` (`swiper/react`) |
| Utilities | `clsx` (via `lib/utils.ts` `cn()` — defined but rarely used), `class-variance-authority` installed but **not used in source** |
| XML | `fast-xml-parser` for YouTube RSS |
| Analytics | `@vercel/speed-insights` in root layout; GA4 client component (consent-gated) |
| Fonts | `next/font/google` — Anton + Barlow Condensed in `app/layout.tsx` |

## Scripts

```text
npm run dev    # next dev -p 3000
npm run build  # next build
npm run start  # next start -p 3000
npm run lint   # next lint
```

No test script exists. Run `npm run build` to verify TypeScript and production compile.

## Repository layout

```text
app/
  layout.tsx              # Root: globals.css, fonts, SiteNav, GA, SpeedInsights
  (marketing)/            # Homepage, /about, /contact — no Tailwind in root layout
  blog/                   # Blog index + [slug]; AdSense script + AdUnit slots
  privacy/, terms/        # Legal routes (placeholder copy)
  sitemap.ts, robots.ts
components/               # All UI components (feature folders: hero, portfolio, domination, …)
lib/                      # Data, SEO, GSAP loader, YouTube fetch, blog posts
public/                   # ads.txt only today
```

Path alias: `@/*` → repo root (`tsconfig.json`).

Legacy static prototype at repo root (`index.html`, `styles.css`, `script.js`) — **not** part of the Next app; do not wire into routing.

## Non-negotiable ground rules

1. **Match existing patterns** — read neighboring files before editing. See `.agents/rules/code-style.md`.
2. **Ads only on `/blog`** — `AdUnit` / `AdScriptLoader` live in `components/ads/` and may only be imported from `app/blog/**`. Never add ads to homepage, about, contact, or legal pages.
3. **No new dependencies or version bumps** without explicit user approval.
4. **No CI/deploy/config changes** (`next.config.js`, headers, CSP) without explicit user approval.
5. **SEO on every route you touch** — use `buildMetadata()` from `lib/seo.ts`; add `generateMetadata` on new pages; use `JsonLd` where structured data already exists on similar pages.
6. **No invented business facts** — contact info, legal copy, pricing, and claims must come from the user or existing `lib/` data. Placeholders are intentional in several places; do not replace with fabricated details.
7. **Work on a branch, not `main`** — repo currently commits to `main`; agents should create a feature branch unless the user says otherwise.
8. **Minimal diff** — smallest change that solves the task; no drive-by refactors.
9. **Run `npm run build`** before marking work complete.

## Where rules live

| File | Purpose |
|------|---------|
| `.agents/rules/safety.md` | Git, secrets, deps, multi-file changes, build verification |
| `.agents/rules/code-style.md` | TypeScript, RSC vs client, styling split, GSAP/Swiper patterns |
| `.agents/rules/project-context.md` | Product intent, monetization, stubs, SEO baseline |
| `.cursorrules` | Extended SEO/AdSense spec (aspirational in places — code wins on conflicts) |

When `.cursorrules` and actual code disagree (e.g. MDX blog, `cva` usage), **follow the code** and note the gap.

## Environment variables (names only)

See `.env.example`:

- `NEXT_PUBLIC_SITE_URL` — canonical URLs, sitemap, JSON-LD (defaults to `https://example.com`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 `G-…` ID; invalid/empty skips GA load
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` — blog CMS
- `SANITY_API_WRITE_TOKEN` — optional; migration script only

AdSense publisher ID is **hardcoded** as placeholder `ca-pub-XXXXXXXXXXXX` in ad components and `public/ads.txt`, not env-driven.

Blog editing: sibling folder `../studio-ultimate-studios` (standalone Sanity Studio). Site settings: `content/site.json`.
Legal: `/privacy`, `/cookies`, `/terms`. Cookie banner + Consent Mode v2 gate GA/AdSense.
Contact form: `POST /api/contact` (Resend) with mailto fallback if unset.

## CI / deploy

No `.github/workflows` or `vercel.json` in repo. Deployment assumed Vercel-compatible per `.cursorrules`; not configured in-tree.
