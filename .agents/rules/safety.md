# Safety Guardrails

Hard limits for any agent working in this repository.

## Git and branches

- **Never force-push**, rewrite history, or run destructive git commands (`reset --hard`, `push --force`) unless the user explicitly requests it in the current message.
- **Do not commit to `main` directly** — create a feature branch (`feat/…`, `fix/…`, or ask the user for their convention). The repo currently uses `main` with informal commit messages; still branch for agent work.
- **Do not commit unless the user asks** — create/edit files and stop for review when that is the instruction.
- **Never update git config** (user.name, hooks, etc.).
- **Never skip hooks** (`--no-verify`, `--no-gpg-sign`) unless the user explicitly requests it.
- **Do not push to remote** unless the user explicitly asks.

## Secrets and environment

- **Never read, commit, or modify** `.env`, `.env.local`, or any `.env*.local` file (all gitignored).
- **Never print secret values** in chat, logs, or committed files — only reference variable **names** (e.g. `NEXT_PUBLIC_SITE_URL`).
- **Do not add new env vars** without telling the user what to set locally and in production.
- If asked to commit, **reject** staging `.env` or credential files.

## Dependencies and tooling

- **No new npm packages** without explicit user approval — even small utilities.
- **No version upgrades** (Next, React, GSAP, Swiper, etc.) without explicit user approval.
- **No new dev tooling** (Jest, Playwright, Prettier config, Husky) unless requested.

## Configuration and infrastructure

- **Do not change** without explicit approval:
  - `next.config.js` (CSP, security headers, image domains, experimental flags)
  - `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`
  - `.gitignore`, `.cursorrules`
  - Any future `.github/workflows`, `vercel.json`, or deploy config
- **Do not delete** legacy root files (`index.html`, `styles.css`, `script.js`) without user confirmation — they may be reference material.

## Scope control

- **Stop and summarize a plan** before any change touching **more than ~5 files** (or any cross-cutting refactor). Wait for user confirmation if the task is ambiguous.
- **Ask instead of guessing** on:
  - Legal/privacy wording
  - Real contact details, addresses, phone numbers
  - AdSense publisher IDs and ad unit slot IDs
  - Pricing, bookings, or service claims not in `lib/`
  - Brand name: canonical is **"Ultimate Cineverse"** (hero: ULTIMATE / CINEVERSE; footer wordmark: ULTIMATE CINEVERSE)

## Verification before “done”

1. Run **`npm run build`** and confirm zero TypeScript / compile errors.
2. Run **`npm run lint`** when you changed TS/TSX (no dedicated test suite exists).
3. If you touched AdSense imports, grep the repo and confirm **`AdUnit` / `AdScriptLoader` appear only under `app/blog/`**.
4. If you touched animations, smoke-check **`prefers-reduced-motion`** paths were not removed.

## Content safety

- Do not invent testimonials, client logos, statistics, or legal policy text.
- Do not enable ads or analytics for all users by bypassing consent (`adsConsent` / `analyticsConsent` localStorage keys) without user approval — EU/CA compliance is incomplete (no CMP UI yet).
