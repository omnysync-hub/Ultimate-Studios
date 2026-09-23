"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  tone: string;
}[] = [
  { type: "useful", emoji: "👍", label: "Useful", hint: "Solid insights", tone: styles.toneUseful },
  { type: "love", emoji: "❤️", label: "Love", hint: "You loved this", tone: styles.toneLove },
  { type: "fire", emoji: "🔥", label: "Fire", hint: "This hits different", tone: styles.toneFire }
];

function storageKey(slug: string) {
  return `uc-react:${slug}`;
}

function formatCount(n: number) {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
}

export function ReactionBar({ slug, useful, love, fire }: Props) {
  const [counts, setCounts] = useState({ useful, love, fire });
  const [picked, setPicked] = useState<ReactionType | null>(null);
  const [burst, setBurst] = useState<ReactionType | null>(null);
  const [floaters, setFloaters] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const total = counts.useful + counts.love + counts.fire;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw === "useful" || raw === "love" || raw === "fire") setPicked(raw);
    } catch {
      /* ignore */
    }
  }, [slug]);

  const spawnFloaters = useCallback((emoji: string) => {
    const id = Date.now();
    const batch = Array.from({ length: 6 }, (_, i) => ({
      id: id + i,
      emoji,
      x: 12 + Math.random() * 76
    }));
    setFloaters((prev) => [...prev, ...batch]);
    window.setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id < id || f.id > id + 10));
    }, 900);
  }, []);

  const react = useCallback(
    async (type: ReactionType) => {
      if (picked || busy) return;
      const meta = REACTIONS.find((r) => r.type === type);
      if (!meta) return;

      setBusy(true);
      setBurst(type);
      spawnFloaters(meta.emoji);
      window.setTimeout(() => setBurst(null), 700);

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
          if (res.status === 503) {
            setNote(`${meta.emoji} Locked in on this device`);
          } else {
            setNote("Could not sync — your pick is saved here.");
          }
          return;
        }
        setNote(`${meta.emoji} ${meta.hint}`);
      } catch {
        setNote(`${meta.emoji} Locked in on this device`);
      } finally {
        setBusy(false);
      }
    },
    [busy, picked, slug, spawnFloaters]
  );

  const socialLine = useMemo(() => {
    if (total <= 0) return "Be the first to react";
    if (picked) return `You + ${Math.max(0, total - 1)} others vibed with this`;
    return `${formatCount(total)} reactions from the community`;
  }, [picked, total]);

  return (
    <section className={styles.reactSection} aria-label="Reactions">
      <div className={styles.reactHeader}>
        <p className={styles.reactEyebrow}>Community</p>
        <h2 className={styles.engageHeading}>Drop a reaction</h2>
        <p className={styles.reactSub}>{socialLine}</p>
      </div>

      <div className={styles.reactStage}>
        <div className={styles.reactFloatLayer} aria-hidden="true">
          {floaters.map((f) => (
            <span key={f.id} className={styles.reactFloater} style={{ left: `${f.x}%` }}>
              {f.emoji}
            </span>
          ))}
        </div>

        <div className={styles.reactRow} role="group" aria-label="Choose a reaction">
          {REACTIONS.map(({ type, emoji, label, tone }) => {
            const active = picked === type;
            const popping = burst === type;
            const dimmed = Boolean(picked) && !active;
            return (
              <button
                key={type}
                type="button"
                className={[
                  styles.reactBtn,
                  tone,
                  active ? styles.reactBtnActive : "",
                  popping ? styles.reactBtnPop : "",
                  dimmed ? styles.reactBtnDim : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={Boolean(picked) || busy}
                onClick={() => void react(type)}
                aria-pressed={active}
                aria-label={`${label}, ${counts[type]} reactions`}
              >
                <span className={styles.reactRing} aria-hidden="true" />
                <span className={styles.reactEmojiWrap}>
                  <span className={styles.reactEmoji}>{emoji}</span>
                </span>
                <span className={styles.reactMeta}>
                  <span className={styles.reactLabel}>{label}</span>
                  <span className={styles.reactCountBadge}>{formatCount(counts[type])}</span>
                </span>
                {active ? <span className={styles.reactPickedTag}>You</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      {note ? (
        <p className={styles.reactToast} role="status">
          {note}
        </p>
      ) : (
        <p className={styles.reactHint}>One tap. One vibe. Instant.</p>
      )}
    </section>
  );
}
