"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./engage.module.css";

type ReactionType = "useful" | "love" | "fire";

type Props = {
  slug: string;
  useful: number;
  love: number;
  fire: number;
};

const REACTIONS: {
  type: ReactionType;
  emoji: string;
  label: string;
  hint: string;
}[] = [
  { type: "useful", emoji: "👍", label: "Useful", hint: "Helpful take" },
  { type: "love", emoji: "❤️", label: "Love", hint: "Loved this" },
  { type: "fire", emoji: "🔥", label: "Fire", hint: "Straight fire" }
];

function storageKey(slug: string) {
  return `uc-react:${slug}`;
}

export function ReactionBar({ slug, useful, love, fire }: Props) {
  const [counts, setCounts] = useState({ useful, love, fire });
  const [picked, setPicked] = useState<ReactionType | null>(null);
  const [burst, setBurst] = useState<ReactionType | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw === "useful" || raw === "love" || raw === "fire") setPicked(raw);
    } catch {
      /* ignore */
    }
  }, [slug]);

  const react = useCallback(
    async (type: ReactionType) => {
      if (picked || busy) return;
      setBusy(true);
      setBurst(type);
      window.setTimeout(() => setBurst(null), 600);

      // Optimistic: feel instant even if the write token is missing in prod.
      setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
      setPicked(type);
      try {
        localStorage.setItem(storageKey(slug), type);
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch("/api/blog/react", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, type, website: "" })
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          if (res.status === 503) {
            setNote("Saved on this device — sync will catch up when reactions go live.");
          } else {
            setNote(data?.error || "Could not sync reaction.");
          }
          return;
        }
        const meta = REACTIONS.find((r) => r.type === type);
        setNote(meta ? `${meta.emoji} ${meta.hint}` : "Thanks!");
      } catch {
        setNote("Saved on this device.");
      } finally {
        setBusy(false);
      }
    },
    [busy, picked, slug]
  );

  return (
    <section className={styles.reactSection} aria-label="Reactions">
      <div className={styles.reactHeader}>
        <p className={styles.reactEyebrow}>Your take</p>
        <h2 className={styles.engageHeading}>Was this helpful?</h2>
        <p className={styles.reactSub}>Tap once — make it count.</p>
      </div>
      <div className={styles.reactRow} role="group" aria-label="Choose a reaction">
        {REACTIONS.map(({ type, emoji, label }) => {
          const active = picked === type;
          const popping = burst === type;
          return (
            <button
              key={type}
              type="button"
              className={`${styles.reactBtn} ${active ? styles.reactBtnActive : ""} ${popping ? styles.reactBtnPop : ""}`}
              disabled={Boolean(picked) || busy}
              onClick={() => void react(type)}
              aria-pressed={active}
              aria-label={`${label}, ${counts[type]} reactions`}
            >
              <span className={styles.reactEmoji} aria-hidden="true">
                {emoji}
              </span>
              <span className={styles.reactMeta}>
                <span className={styles.reactLabel}>{label}</span>
                <span className={styles.reactCount}>{counts[type]}</span>
              </span>
            </button>
          );
        })}
      </div>
      {note ? <p className={styles.engageNote}>{note}</p> : null}
      {picked ? null : (
        <p className={styles.reactHint}>Pick the vibe that fits — one reaction per story.</p>
      )}
    </section>
  );
}
