"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./StudioCtaSection.module.css";

const FULL_COPY =
  "We cover entertainment like a newsroom with a cinema eye — headlines, culture drops, and the stories shaping film, music, and digital media right now.";

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

const words = FULL_COPY.split(" ");

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
  const [revealedCount, setRevealedCount] = useState(0);
  const doneRef = useRef(false);
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setRevealedCount(FULL_COPY.length);
      doneRef.current = true;
      return;
    }

    const node = sectionRef.current;
    if (!node) return;

    let raf = 0;

    const complete = () => {
      doneRef.current = true;
      setRevealedCount(FULL_COPY.length);
    };

    const update = () => {
      if (doneRef.current) return;

      const rect = node.getBoundingClientRect();
      const viewH = window.innerHeight || 1;

      if (rect.top < viewH * 0.2 || rect.bottom < viewH * 0.65) {
        complete();
        return;
      }

      const start = viewH * 0.9;
      const end = viewH * 0.35;
      const raw = (start - rect.top) / Math.max(1, start - end);
      const progress = Math.min(1, Math.max(0, raw));
      const next = Math.ceil(progress * FULL_COPY.length);

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
  }, [reduceMotion]);

  let charIndex = 0;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="studio-cta-heading"
    >
      <h2 id="studio-cta-heading" className={styles.srOnly}>
        About the newsroom
      </h2>
      <p className={styles.copy}>
        {words.map((word, wordIdx) => {
          const wordStart = charIndex;
          const wordEls = word.split("").map((char) => {
            const index = charIndex++;
            return (
              <LetterUnit
                key={`${wordIdx}-${index}`}
                char={char}
                index={index}
                shown={index < revealedCount}
              />
            );
          });
          if (wordIdx < words.length - 1) {
            const spaceIndex = charIndex++;
            wordEls.push(
              <LetterUnit
                key={`space-${spaceIndex}`}
                char=" "
                index={spaceIndex}
                shown={spaceIndex < revealedCount}
              />
            );
          }
          return (
            <span key={`word-${wordIdx}-${wordStart}`} className={styles.word}>
              {wordEls}
            </span>
          );
        })}
      </p>
    </section>
  );
}
