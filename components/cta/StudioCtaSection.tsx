"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInViewOnce } from "@/lib/useInViewOnce";
import styles from "./StudioCtaSection.module.css";

const FULL_COPY =
  "We are a creative studio built at the intersection of technology, cinema and imagination, crafting intelligent visual experiences that turn ambitious ideas into films, worlds.";

const HOVER_COLORS = [
  "#ff6b6b",
  "#f7b267",
  "#ffe66d",
  "#7dcea0",
  "#4ecdc4",
  "#45b7d1",
  "#a29bfe",
  "#fd79a8",
  "#fab1a0",
  "#74b9ff"
];

const letters = FULL_COPY.split("");

function LetterUnit({
  char,
  index,
  shown
}: {
  char: string;
  index: number;
  shown: boolean;
}) {
  const [lit, setLit] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const onEnter = useCallback(() => {
    if (char === " ") return;
    clearTimer();
    setLit(true);
    timerRef.current = window.setTimeout(() => setLit(false), 900);
  }, [char]);

  if (char === " ") {
    return <span className={styles.space}>{"\u00A0"}</span>;
  }

  return (
    <span
      className={`${styles.letter} ${shown ? styles.letterIn : ""} ${lit ? styles.letterLit : ""}`}
      style={{
        ["--hover-color" as string]: HOVER_COLORS[index % HOVER_COLORS.length],
        transitionDelay: shown ? `${Math.min(index * 6, 280)}ms` : "0ms"
      }}
      onMouseEnter={onEnter}
    >
      {char}
    </span>
  );
}

export function StudioCtaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInViewOnce(sectionRef, "50% 0px");
  const [revealedCount, setRevealedCount] = useState(0);
  const doneRef = useRef(false);
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setRevealedCount(letters.length);
      doneRef.current = true;
      return;
    }

    const node = sectionRef.current;
    if (!node) return;

    let raf = 0;

    const complete = () => {
      doneRef.current = true;
      setRevealedCount(letters.length);
    };

    const update = () => {
      if (doneRef.current) return;

      const rect = node.getBoundingClientRect();
      const viewH = window.innerHeight || 1;

      // Scrolled past / leaving the section → finish the whole paragraph
      if (rect.top < viewH * 0.2 || rect.bottom < viewH * 0.65) {
        complete();
        return;
      }

      // Reveal finishes while the copy is still on screen
      const start = viewH * 0.9;
      const end = viewH * 0.35;
      const raw = (start - rect.top) / Math.max(1, start - end);
      const progress = Math.min(1, Math.max(0, raw));
      const next = Math.ceil(progress * letters.length);

      if (progress >= 0.98) {
        complete();
        return;
      }

      setRevealedCount((prev) => Math.max(prev, next));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [inView, reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="studio-cta-heading"
    >
      <h2 id="studio-cta-heading" className={styles.srOnly}>
        About Ultimate Studios
      </h2>
      <p className={styles.copy}>
        {letters.map((char, index) => (
          <LetterUnit
            key={`${char}-${index}`}
            char={char}
            index={index}
            shown={index < revealedCount}
          />
        ))}
      </p>
    </section>
  );
}
