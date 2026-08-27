"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./UltimateStudiosPreloader.module.css";

const SESSION_KEY = "us-architectural-preloader-v2";
const SLAB_COUNT = 7;

/** Barely-differentiated near-black matte planes */
const SLAB_TONES = [
  "#050505",
  "#070707",
  "#090909",
  "#0b0b0b",
  "#0d0d0d",
  "#0a0a0a",
  "#060606"
];

type Props = {
  onComplete?: () => void;
  /** Fires once slabs are mounted and covering the viewport (safe to drop boot cover). */
  onReady?: () => void;
};

export function UltimateStudiosPreloader({ onComplete, onReady }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    if (seen) {
      setActive(false);
      onReady?.();
      onComplete?.();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    // Slabs are painted — boot cover can go; slabs alone hide the hero.
    onReady?.();

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setActive(false);
      onComplete?.();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reduce) {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = prevOverflow;
          finish();
        }
      });
      tl.to(root, { opacity: 0, duration: 0.4, ease: "power2.out" });
      return () => {
        tl.kill();
        document.body.style.overflow = prevOverflow;
      };
    }

    const mark = root.querySelector<HTMLElement>("[data-mark]");
    const ultimateLetters = root.querySelectorAll<HTMLElement>(
      '[data-word="ultimate"] [data-letter]'
    );
    const studiosLetters = root.querySelectorAll<HTMLElement>(
      '[data-word="studios"] [data-letter]'
    );
    const sweep = root.querySelector<HTMLElement>("[data-sweep]");
    const haze = root.querySelectorAll<HTMLElement>("[data-haze]");
    const grain = root.querySelector<HTMLElement>("[data-grain]");
    const slabs = root.querySelectorAll<HTMLElement>("[data-slab]");

    gsap.set(ultimateLetters, { opacity: 0, y: 10, filter: "blur(6px)" });
    gsap.set(studiosLetters, { opacity: 0, y: 10, filter: "blur(6px)" });
    gsap.set(sweep, { xPercent: -130, opacity: 0 });
    gsap.set(haze, { opacity: 0 });
    gsap.set(grain, { opacity: 0 });
    gsap.set(slabs, { xPercent: 0, yPercent: 0, rotate: 0 });

    const customEase = "power3.inOut";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = prevOverflow;
        finish();
      }
    });

    // 0.00 black → 0.20 atmosphere
    tl.to(haze, { opacity: 1, duration: 0.85, stagger: 0.06, ease: "sine.out" }, 0.2);
    tl.to(grain, { opacity: 0.28, duration: 1.0, ease: "sine.out" }, 0.25);

    // Slow volumetric drift (restrained)
    gsap.to(haze, {
      xPercent: 2.5,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 0.50 ULTIMATE / 0.90 STUDIOS
    tl.to(
      ultimateLetters,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        stagger: 0.04,
        ease: "power4.out"
      },
      0.5
    );
    tl.to(
      studiosLetters,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        stagger: 0.04,
        ease: "power4.out"
      },
      0.9
    );

    // Soft light pass across wordmark
    tl.to(sweep, { opacity: 0.55, duration: 0.12, ease: "sine.out" }, 1.15);
    tl.to(sweep, { xPercent: 130, duration: 0.7, ease: "power2.inOut" }, 1.16);
    tl.to(sweep, { opacity: 0, duration: 0.2, ease: "sine.in" }, 1.7);

    // 1.20 logo clarity
    tl.to(mark, { opacity: 1, duration: 0.25, ease: "sine.out" }, 1.2);

    // 1.35 → staircase slab sequence (one after another)
    // Alternating lateral exit + slight vertical step = architectural staircase read
    slabs.forEach((slab, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      const start = 1.35 + i * 0.15;
      // Anticipation (micro settle)
      tl.to(
        slab,
        {
          yPercent: dir * -0.6,
          duration: 0.08,
          ease: "power1.in"
        },
        start
      );
      // Decisive heavy exit
      tl.to(
        slab,
        {
          xPercent: dir * 108,
          yPercent: (i - (SLAB_COUNT - 1) / 2) * 6,
          rotate: dir * 0.35,
          duration: 0.52,
          ease: customEase,
          force3D: true
        },
        start + 0.08
      );
    });

    // Logo dissolves as structure opens
    tl.to(
      mark,
      {
        opacity: 0,
        filter: "blur(4px)",
        y: -8,
        duration: 0.55,
        ease: "power2.inOut"
      },
      1.45
    );
    tl.to([grain, ...haze], { opacity: 0, duration: 0.45, ease: "power2.in" }, 2.15);

    // Safety finish ~2.6s
    tl.set({}, {}, 2.6);

    return () => {
      tl.kill();
      gsap.killTweensOf([root, mark, ultimateLetters, studiosLetters, sweep, haze, grain, slabs]);
      document.body.style.overflow = prevOverflow;
    };
  }, [onComplete, onReady]);

  if (!active) return null;

  const ultimate = "ULTIMATE".split("");
  const studios = "STUDIOS".split("");

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="presentation"
      aria-hidden="true"
      data-ultimate-studios-preloader
    >
      {/* Atmosphere behind slabs (barely visible between tonal seams) */}
      <div className={`${styles.haze} ${styles.hazeA}`} data-haze />
      <div className={`${styles.haze} ${styles.hazeB}`} data-haze />
      <div className={styles.grain} data-grain />

      {/* Architectural slabs — stacked bands covering the viewport */}
      <div className={styles.slabStack}>
        {Array.from({ length: SLAB_COUNT }).map((_, i) => (
          <div
            key={i}
            className={styles.slab}
            data-slab
            style={
              {
                "--tone": SLAB_TONES[i],
                "--i": i,
                top: `${(i / SLAB_COUNT) * 100}%`,
                height: `calc(${100 / SLAB_COUNT}% + 2px)`
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Centered film-title wordmark */}
      <div className={styles.mark} data-mark>
        <div className={styles.wordRow} data-word="ultimate">
          {ultimate.map((ch, i) => (
            <span key={`u-${i}`} className={styles.letter} data-letter>
              {ch}
            </span>
          ))}
        </div>
        <div className={styles.wordRow} data-word="studios">
          {studios.map((ch, i) => (
            <span key={`s-${i}`} className={styles.letter} data-letter>
              {ch}
            </span>
          ))}
        </div>
        <div className={styles.sweep} data-sweep />
      </div>
    </div>
  );
}
