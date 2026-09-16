import { NextResponse } from "next/server";
import { getSite } from "@/lib/cms/store";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot filled => pretend success
  if (body.company && String(body.company).trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isEmail(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Please enter a longer message." }, { status: 400 });
  }

  const site = await getSite();
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "Ultimate Cineverse <onboarding@resend.dev>";

  if (!resendKey) {
    return NextResponse.json(
      {
        error:
          "Contact delivery is not configured yet. Email us directly and ask the site owner to set RESEND_API_KEY."
      },
      { status: 503 }
    );
  }

  const subject = `Site inquiry from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject,
      text
    })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact] Resend failed", res.status, detail);
    return NextResponse.json(
      { error: "Could not send your message. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
