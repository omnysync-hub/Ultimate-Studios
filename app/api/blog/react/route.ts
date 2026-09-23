import { NextResponse } from "next/server";
import { REACTION_META, isReactionType } from "@/lib/blog/reactions";
import { getSanityWriteClient, sanityClient } from "@/lib/sanity/client";
import { clientIp, rateLimit } from "@/lib/blog/rateLimit";

const FIELD = Object.fromEntries(REACTION_META.map((r) => [r.type, r.field]));

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`react:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many reactions. Try again shortly." }, { status: 429 });
  }

  let body: { slug?: string; type?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const slug = (body.slug || "").trim();
  const type = (body.type || "").trim();
  if (!slug || !isReactionType(type)) {
    return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
  }

  const write = getSanityWriteClient();
  if (!write) {
    return NextResponse.json(
      { error: "Reactions are temporarily unavailable." },
      { status: 503 }
    );
  }

  const post = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type == "post" && slug.current == $slug && draft != true][0]{ _id }`,
    { slug }
  );
  if (!post?._id) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const field = FIELD[type];
  await write.patch(post._id).setIfMissing({ [field]: 0 }).inc({ [field]: 1 }).commit();

  return NextResponse.json({ ok: true });
}
