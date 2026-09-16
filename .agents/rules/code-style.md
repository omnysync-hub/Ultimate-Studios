# Code Style — Conventions Found in This Repo

Documented from actual source files. Do not introduce new patterns without reason.

## TypeScript

- **Strict mode** enabled (`tsconfig.json`).
- **No `allowJs`** — TS/TSX only for app code.
- Props: inline `type Props = { … }` at top of file, or exported types in `lib/` (e.g. `YouTubeVideo`, `BlogPost`, `StatMetric`).
- Async route params: `params: Promise<{ slug: string }>` then `const { slug } = await params` (Next 15 style in `app/blog/[slug]/page.tsx`).
- Prefer `satisfies` for typed object literals where used (`lib/youtube.ts`).
- `eslint-disable-next-line` used sparingly (e.g. `JsonLd` `dangerouslySetInnerHTML`).

## Server vs client components

**Default: Server Component** — no `"use client"` on `app/**/page.tsx` files.

**`"use client"` is required when the file uses:**

- `useState`, `useEffect`, `useLayoutEffect`, `useRef` for browser APIs
- GSAP, Swiper, IntersectionObserver, `window` / `document`
- `next/dynamic` parent orchestration (`HomeExperience`)
- `localStorage` (ads, analytics consent)
- `next/navigation` hooks (`error.tsx`)

**Server components in practice:** `SiteNav`, `StatCard`, `JsonLd`, all route `page.tsx` except `app/error.tsx`.

**Client components (grep-verified):** `HeroSection`, `HomeExperience`, `StudioCtaSection`, `DominationSection`, `PortfolioSection`, `StudioFooter`, `DeferredSection`, `YouTubeThumbnail`, `GoogleAnalytics`, `AdUnit`, `AdScriptLoader`, `error.tsx`.

**Rule of thumb:** fetch data and metadata in `app/…/page.tsx` (server); pass serializable props into client sections. Example: homepage fetches YouTube videos in `(marketing)/page.tsx`, passes `videos` to `HomeExperience`.

## Component placement

| Location | Use |
|----------|-----|
| `components/<feature>/` | All reusable UI — hero, portfolio, domination, footer, nav, ads, seo, youtube, common |
| `app/` | Routes, layouts, `sitemap.ts`, `robots.ts` only — **no colocated components** |
| `lib/` | Pure data, helpers, types, `buildMetadata`, blog array, studio contact constants |

Feature folders group related pieces (e.g. `components/domination/StatCard.tsx`, `StatsBento.tsx` share `DominationSection.module.css`).

## File and export naming

- **Components:** PascalCase files (`HeroSection.tsx`), named export matching filename (`export function HeroSection`).
- **Routes:** lowercase folders (`app/blog/[slug]/page.tsx`).
- **Lib:** camelCase files (`blog.ts`, `useInViewOnce.ts`, `gsap.ts`).
- **CSS Modules:** co-located `ComponentName.module.css`, imported as `import styles from "./ComponentName.module.css"`.
- **Route groups:** `(marketing)` — does not affect URL.

## Styling — two systems, intentional split

### CSS Modules + `app/globals.css` (homepage / marketing shell)

Used by: `hero`, `cta`, `domination`, `portfolio`, `footer`, `nav`.

- Class names via `styles.foo` in JSX.
- Global reset/theme in `app/globals.css` (black background, cream text).
- **Homepage does not import Tailwind** — root layout loads only `globals.css`.

### Tailwind (utility pages)

Imported per-route via `import "../tailwind.css"` or `import "../../tailwind.css"` in:

- `app/blog/layout.tsx`
- `app/(marketing)/about/layout.tsx`, `contact/layout.tsx`
- `app/privacy/layout.tsx`, `terms/layout.tsx`
- `app/error.tsx`, `app/not-found.tsx`

Blog/legal pages use Tailwind classes directly (`className="mx-auto w-full max-w-3xl …"`).

**Do not** add Tailwind to the cinematic homepage sections without a deliberate performance/design decision. **Do not** mix arbitrary global CSS into module files unless matching existing patterns.

`cn()` exists in `lib/utils.ts` but is **unused** elsewhere — either use `clsx`/`cn` consistently or continue string concatenation for module class names (`${styles.card} ${className}`).

`class-variance-authority` is in `package.json` but **not imported** in source — do not introduce `cva` unless the user wants that pattern adopted project-wide.

## Import order (observed pattern)

1. `"use client"` directive (if needed), blank line
2. React / Next (`import Link from "next/link"`)
3. Internal `@/lib/…`
4. Internal `@/components/…`
5. Third-party (`gsap`, `swiper`, `next/image`)
6. Side-effect CSS (`import "swiper/css"`)
7. Local `import styles from "./….module.css"`

Use `@/` alias for all cross-folder imports, not relative `../../`.

## GSAP pattern

Central loader:

```text
lib/gsap.ts → loadGsap() dynamically imports gsap + ScrollTrigger, registers plugin, returns { gsap, ScrollTrigger }
```

**Initialization checklist (PortfolioSection, DominationSection, StudioFooter):**

1. `const rootRef = useRef<HTMLElement>(null)`
2. `const inView = useInViewOnce(rootRef, optionalRootMargin)` — defer heavy work until near viewport
3. `useEffect` gated on `inView`
4. `void loadGsap().then(({ gsap }) => { … })`
5. **`cancelled` flag** — set `true` in cleanup; bail if cancelled after await
6. **`gsap.context(() => { … }, root)`** — store `ctx`, call **`ctx.revert()`** on cleanup
7. **`prefers-reduced-motion: reduce`** — early exit with `gsap.set(…, { clearProps: "all", opacity: 1, … })` or static fallbacks
8. Target DOM via **`data-*` attributes** (`data-portfolio-pin`, `data-stat-card`, `data-footer-anim`) or scoped `querySelector` inside `root`

ScrollTrigger timelines use `scrub`, `pin`, `invalidateOnRefresh: true` where needed. Portfolio couples ScrollTrigger progress to Swiper via `swiper.setProgress(carouselP, 0)`.

**Do not** import GSAP at module top level in client components — always `loadGsap()`.

## Swiper pattern

- Import from `swiper/react` and feature modules (`swiper/modules`).
- Import CSS in the same client file: `swiper/css`, `swiper/css/effect-coverflow`.
- Config is **inline on `<Swiper>`** — no shared config file.
- `useRef<SwiperType | null>` + `onSwiper` callback to store instance.
- Portfolio: `effect="coverflow"`, `slidesPerView="auto"`, `speed={0}` (scroll-driven), `loop={false}`, `modules={[EffectCoverflow]}`.

## Performance patterns already in use

- `next/dynamic` for `DominationSection`, `PortfolioSection`, `StudioFooter` from `HomeExperience`.
- `DeferredSection` — IntersectionObserver + `requestIdleCallback` before mounting heavy children.
- `StudioFooter` dynamic import with `{ ssr: false }`.
- YouTube feed: `fetch(…, { next: { revalidate: 1800 } })` in `lib/youtube.ts`.

Preserve these when adding homepage weight.

## Images

- `next/image` used in `YouTubeThumbnail` with `fill`, `sizes`, and `onError` fallback URL swap.
- `next.config.js` allows `i.ytimg.com` and `img.youtube.com`.
- Hero uses CSS placeholder divs, not `<Image>` yet.

## Accessibility patterns in use

- `aria-labelledby` on sections with visible headings.
- `aria-hidden="true"` on decorative SVG/video.
- `aria-label` on nav brand link and ad regions.
- Semantic elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`.

Match this level when adding UI.

## Ads code style

- Client-only; consent via `localStorage.getItem("adsConsent") === "true"`.
- `AdScriptLoader` injects script once by id `adsbygoogle-script`.
- `AdUnit` uses IntersectionObserver before `adsbygoogle.push({})`.
- Reserved `minHeight` on containers for CLS.

## Lint / format

- `npm run lint` → `next lint` (ESLint via `eslint-config-next`).
- No Prettier config in repo — match surrounding formatting (2-space indent, double quotes in TSX).
