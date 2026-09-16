/**
 * One-time migration: push content/posts.json into Sanity.
 *
 * Usage:
 *   1. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env.local
 *   2. npx tsx scripts/migrate-posts-to-sanity.ts
 *
 * Create a write token at https://sanity.io/manage → API → Tokens (Editor).
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import path from "path";

type LocalPost = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  tags: string[];
  content: string;
  draft?: boolean;
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false
});

async function main() {
  const file = path.join(process.cwd(), "content", "posts.json");
  const posts = JSON.parse(readFileSync(file, "utf8")) as LocalPost[];

  for (const post of posts) {
    const id = `post-${post.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      description: post.description,
      author: post.author,
      tags: post.tags,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      content: post.content,
      draft: Boolean(post.draft)
    });
    console.log("upserted", post.slug);
  }

  console.log(`Done — ${posts.length} posts.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
