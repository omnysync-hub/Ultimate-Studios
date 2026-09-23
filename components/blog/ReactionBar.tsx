"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  REACTION_META,
  emptyReactionCounts,
  sumReactions,
  type ReactionCounts,
  type ReactionType
} from "@/lib/blog/reactions";
import styles from "./engage.module.css";

type Props = {
  slug: string;
  counts: Partial<ReactionCounts>;
};

const TONE: Record<ReactionType, string> = {
  useful: styles.tone_useful,
  love: styles.tone_love,
  fire: styles.tone_fire,
  wow: styles.tone_wow,
  laugh: styles.tone_laugh,
  clap: styles.tone_clap
};

function storageKey(slug: string) {
  return `uc-react:${slug}`;
}

function formatCount(n: number) {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
}

export function ReactionBar({ slug, counts: initial }: Props) {
  const [counts, setCounts] = useState<ReactionCounts>(() => ({
    ...emptyReactionCounts(),
    ...initial
  }));
  const [picked, setPicked] = useState<ReactionType | null>(null);
  const [burst, setBurst] = useState<ReactionType | null>(null);
  const [hover, setHover] = useState<ReactionType | null>(null);
  const [floaters, setFloaters] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const total = sumReactions(counts);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw && REACTION_META.some((r) => r.type === raw)) {
        setPicked(raw as ReactionType);
      }
    } catch {
      /* ignore */
    }
  }, [slug]);

  const spawnFloaters = useCallback((emoji: string) => {
    const id = Date.now();
    const batch = Array.from({ length: 8 }, (_, i) => ({
      id: id + i,
      emoji,
      x: 6 + Math.random() * 88
    }));
    setFloaters((prev) => [...prev.slice(-12), ...batch]);
    window.setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id < id || f.id > id + 20));
    }, 1000);
  }, []);

  const react = useCallback(
    async (type: ReactionType) => {
      if (picked || busy) return;
      const meta = REACTION_META.find((r) => r.type === type);
      if (!meta) return;

      setBusy(true);
      setBurst(type);
      spawnFloaters(meta.emoji);
      window.setTimeout(() => setBurst(null), 750);

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
          setNote(res.status === 503 ? `${meta.emoji} Locked in on this device` : "Saved here — sync pending.");
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

      <div className={styles.reactDockWrap}>
        <div className={styles.reactFloatLayer} aria-hidden="true">
          {floaters.map((f) => (
            <span key={f.id} className={styles.reactFloater} style={{ left: `${f.x}%` }}>
              {f.emoji}
            </span>
          ))}
        </div>

        <div
          className={`${styles.reactDock} ${hover ? styles.reactDockHot : ""}`}
          role="group"
          aria-label="Choose a reaction"
        >
          {REACTION_META.map(({ type, emoji, label }) => {
            const active = picked === type;
            const popping = burst === type;
            const lifted = hover === type;
            const dimmed = Boolean(picked) && !active;
            return (
              <button
                key={type}
                type="button"
                className={[
                  styles.reactDockItem,
                  TONE[type],
                  active ? styles.reactDockItemActive : "",
                  popping ? styles.reactDockItemPop : "",
                  lifted ? styles.reactDockItemHover : "",
                  dimmed ? styles.reactDockItemDim : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={Boolean(picked) || busy}
                onClick={() => void react(type)}
                onMouseEnter={() => setHover(type)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(type)}
                onBlur={() => setHover(null)}
                aria-pressed={active}
                aria-label={`${label}, ${counts[type]} reactions`}
              >
                <span className={styles.reactDockEmoji} aria-hidden="true">
                  {emoji}
                </span>
                <span className={styles.reactDockLabel}>{label}</span>
                <span className={styles.reactDockCount}>{formatCount(counts[type])}</span>
                {active ? <span className={styles.reactPickedTag}>You</span> : null}
                <span className={styles.reactDockTip} aria-hidden="true">
                  {label}
                </span>
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
        <p className={styles.reactHint}>Hover · tap · watch it pop</p>
      )}
    </section>
  );
}
