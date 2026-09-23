"use client";

import { useState, type FormEvent } from "react";
import type { BlogComment } from "@/lib/blog";
import styles from "./engage.module.css";

type Props = {
  slug: string;
  initialComments: BlogComment[];
};

export function CommentSection({ slug, initialComments }: Props) {
  const [comments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, body, website })
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setStatus("err");
        setError(data?.error || "Could not submit comment.");
        return;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setBody("");
    } catch {
      setStatus("err");
      setError("Could not submit comment.");
    }
  }

  return (
    <section className={styles.comments} aria-labelledby="comments-heading">
      <h2 id="comments-heading" className={styles.engageHeading}>
        Comments
      </h2>

      {comments.length ? (
        <ul className={styles.commentList}>
          {comments.map((c) => (
            <li key={c._id} className={styles.commentItem}>
              <p className={styles.commentMeta}>
                <strong>{c.name}</strong>
                {c.createdAt ? (
                  <time dateTime={c.createdAt}>
                    {new Date(c.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </time>
                ) : null}
              </p>
              <p className={styles.commentBody}>{c.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.engageNote}>Be the first to leave a comment.</p>
      )}

      <form className={styles.commentForm} onSubmit={(e) => void onSubmit(e)}>
        <p className={styles.engageNote}>Comments are reviewed before they appear.</p>
        <label className={styles.field}>
          <span>Name</span>
          <input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className={styles.field}>
          <span>Email (optional, never shown)</span>
          <input
            type="email"
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        {/* honeypot */}
        <label className={styles.hp} aria-hidden="true">
          <span>Website</span>
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Comment</span>
          <textarea
            required
            rows={4}
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Post comment"}
        </button>
        {status === "ok" ? (
          <p className={styles.engageSuccess}>Thanks — your comment is awaiting approval.</p>
        ) : null}
        {status === "err" && error ? <p className={styles.engageError}>{error}</p> : null}
      </form>
    </section>
  );
}
