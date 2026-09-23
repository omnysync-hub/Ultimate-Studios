import { NextResponse } from "next/server";
import { getSanityWriteClient, sanityClient } from "@/lib/sanity/client";
import { clientIp, rateLimit } from "@/lib/blog/rateLimit";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`comment:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many comments. Try again shortly." }, { status: 429 });
  }

  let payload: {
    slug?: string;
    name?: string;
    email?: string;
    body?: string;
    website?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const slug = (payload.slug || "").trim();
  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const body = (payload.body || "").trim();

  if (!slug || name.length < 2 || name.length > 80 || body.length < 3 || body.length > 2000) {
    return NextResponse.json({ error: "Please check your name and comment." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const write = getSanityWriteClient();
  if (!write) {
    return NextResponse.json(
      { error: "Comments are temporarily unavailable." },
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

  await write.create({
    _type: "comment",
    post: { _type: "reference", _ref: post._id },
    name,
    ...(email ? { email } : {}),
    body,
    approved: false,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
