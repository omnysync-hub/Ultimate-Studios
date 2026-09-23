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

const LABELS: Record<ReactionType, string> = {
  useful: "Useful",
  love: "Love",
  fire: "Fire"
};

function storageKey(slug: string) {
  return `uc-react:${slug}`;
}

export function ReactionBar({ slug, useful, love, fire }: Props) {
  const [counts, setCounts] = useState({ useful, love, fire });
  const [picked, setPicked] = useState<ReactionType | null>(null);
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
      try {
        const res = await fetch("/api/blog/react", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, type, website: "" })
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          setNote(data?.error || "Could not save reaction.");
          return;
        }
        setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
        setPicked(type);
        try {
          localStorage.setItem(storageKey(slug), type);
        } catch {
          /* ignore */
        }
        setNote(`You marked this ${LABELS[type]}.`);
      } finally {
        setBusy(false);
      }
    },
    [busy, picked, slug]
  );

  return (
    <section className={styles.reactSection} aria-label="Reactions">
      <h2 className={styles.engageHeading}>Was this helpful?</h2>
      <div className={styles.reactRow}>
        {(["useful", "love", "fire"] as ReactionType[]).map((type) => (
          <button
            key={type}
            type="button"
            className={`${styles.reactBtn} ${picked === type ? styles.reactBtnActive : ""}`}
            disabled={Boolean(picked) || busy}
            onClick={() => void react(type)}
          >
            <span className={styles.reactLabel}>{LABELS[type]}</span>
            <span className={styles.reactCount}>{counts[type]}</span>
          </button>
        ))}
      </div>
      {note ? <p className={styles.engageNote}>{note}</p> : null}
    </section>
  );
}
