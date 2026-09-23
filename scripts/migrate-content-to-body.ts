/**
 * Convert legacy Sanity `content` (plain text) → Portable Text `body` blocks.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/migrate-content-to-body.ts
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pbq9a26l";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false
});

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function textToBody(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({
      _type: "block" as const,
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span" as const, _key: key(), text, marks: [] }]
    }));
}

async function main() {
  const posts = await client.fetch<{ _id: string; content?: string; body?: unknown[] }[]>(
    `*[_type == "post" && defined(content) && (!defined(body) || count(body) == 0)]{ _id, content, body }`
  );

  console.log(`Found ${posts.length} posts to migrate`);

  for (const post of posts) {
    if (!post.content?.trim()) continue;
    const body = textToBody(post.content);
    await client.patch(post._id).set({ body }).commit();
    console.log("migrated", post._id, `(${body.length} blocks)`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
