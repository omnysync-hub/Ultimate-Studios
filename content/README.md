# Ultimate Cineverse content

## Blogs

Sample posts live in `content/posts.json` with covers in `public/blog/`.

The site uses **Sanity** when it has published posts; otherwise it falls back to these local samples so `/blog` never looks empty.

To push samples into Sanity later:

```bash
SANITY_API_WRITE_TOKEN=sk...
npm run migrate:sanity
```

(Studio: sibling folder `studio-ultimate-studios`.)
