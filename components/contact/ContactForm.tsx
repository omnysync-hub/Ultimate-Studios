"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "ok" | "error";

type Props = {
  email: string;
};

export function ContactForm({ email }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const fromEmail = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: fromEmail,
          message,
          company: String(data.get("company") || "")
        })
      });

      const payload = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.status === 503) {
        const subject = encodeURIComponent(`Inquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${fromEmail}`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        setStatus("ok");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setError(payload.error || "Something went wrong. Please email us instead.");
        return;
      }

      form.reset();
      setStatus("ok");
    } catch {
      setStatus("error");
      setError(`Network error. Email us at ${email}.`);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
      <label className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        Company
        <input tabIndex={-1} autoComplete="off" name="company" />
      </label>

      <label className="block">
        <span className="text-sm text-uc-muted">Name</span>
        <input className="uc-input mt-1" name="name" autoComplete="name" required minLength={2} maxLength={120} />
      </label>
      <label className="block">
        <span className="text-sm text-uc-muted">Email</span>
        <input
          className="uc-input mt-1"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={200}
        />
      </label>
      <label className="block">
        <span className="text-sm text-uc-muted">Message</span>
        <textarea
          className="uc-input mt-1 min-h-[140px] resize-y"
          name="message"
          required
          minLength={10}
          maxLength={5000}
        />
      </label>

      <button type="submit" disabled={status === "sending"} className="uc-btn disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "ok" ? (
        <p className="text-sm text-uc-red" role="status">
          Thanks — if your email app opened, send from there. Otherwise we received your message and
          will reply soon.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-uc-red" role="alert">
          {error}{" "}
          <a className="uc-link" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      ) : null}
    </form>
  );
}
