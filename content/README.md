# Ultimate Cineverse content

## Blogs

Local posts (optional fallback) live in `content/posts.json`. Covers go in `public/blog/`.

The site uses **Sanity** when configured; otherwise it reads from `posts.json` (currently empty).

To import local JSON into Sanity:

```bash
SANITY_API_WRITE_TOKEN=sk...
npm run migrate:sanity
```

(Studio: sibling folder `studio-ultimate-studios`.)
