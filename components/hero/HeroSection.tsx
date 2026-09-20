"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

/** Size both hero words to share one size; video slot flexes into leftover width. */
function useFitHeroType(
  ultimateRef: React.RefObject<HTMLElement | null>,
  cineverseRef: React.RefObject<HTMLElement | null>
) {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const ultimate = ultimateRef.current;
    const cineverse = cineverseRef.current;
    if (!ultimate || !cineverse) return;

    let readyFired = false;

    const fit = () => {
      const row = ultimate.closest(`.${styles.heroRow}`) as HTMLElement | null;
      if (!row) return;

      const gap = parseFloat(getComputedStyle(row).gap) || 0;
      const stacked = getComputedStyle(row).flexDirection === "column";
      // Keep ~30% for video on desktop row; on stacked mobile use full width.
      const minVideo = stacked ? 0 : row.clientWidth * 0.3;
      const maxW = Math.max(40, row.clientWidth - minVideo - gap);
      const maxH = Math.min(
        window.innerHeight * 0.42,
        (row.parentElement?.clientHeight ?? window.innerHeight) * 0.46
      );
      if (maxW < 8 || maxH < 8) return;

      let lo = 18;
      let hi = Math.floor(maxH);
      let best = lo;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        ultimate.style.fontSize = `${mid}px`;
        cineverse.style.fontSize = `${mid}px`;

        const fits =
          ultimate.scrollWidth <= maxW + 1 &&
          cineverse.scrollWidth <= maxW + 1 &&
          ultimate.scrollHeight <= maxH + 4 &&
          cineverse.scrollHeight <= maxH + 4;

        if (fits) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      ultimate.style.fontSize = `${best}px`;
      cineverse.style.fontSize = `${best}px`;

      if (!readyFired) {
        readyFired = true;
        setReady(true);
      }
    };

    // Sync first fit before paint — avoids the tiny left/right FOUC flash.
    fit();

    let fitRaf = 0;
    const scheduleFit = () => {
      cancelAnimationFrame(fitRaf);
      fitRaf = requestAnimationFrame(fit);
    };

    void document.fonts?.ready?.then(scheduleFit);

    const idleId =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(scheduleFit, { timeout: 1800 })
        : window.setTimeout(scheduleFit, 300);

    const ro = new ResizeObserver(scheduleFit);
    ro.observe(document.documentElement);
    window.addEventListener("resize", scheduleFit);
    return () => {
      cancelAnimationFrame(fitRaf);
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
      ro.disconnect();
      window.removeEventListener("resize", scheduleFit);
    };
  }, [ultimateRef, cineverseRef]);

  return ready;
}

export function HeroSection() {
  const ultimateRef = useRef<HTMLParagraphElement>(null);
  const cineverseRef = useRef<HTMLParagraphElement>(null);
  const ready = useFitHeroType(ultimateRef, cineverseRef);

  return (
    <div className={styles.pageWrap}>
      <main className={styles.heroPage}>
        <h1 className={styles.srOnly}>Ultimate Cineverse</h1>

        <section
          className={`${styles.hero}${ready ? ` ${styles.revealed}` : ""}`}
          data-hero-ready={ready ? "true" : "false"}
        >
          <div className={`${styles.heroRow} ${styles.topRow}`}>
            <div className={`${styles.wordClip} ${styles.fromLineUp}`}>
              <p ref={ultimateRef} className={styles.heroWord}>
                ULTIMATE
              </p>
            </div>
            <div className={`${styles.videoSlot} ${styles.videoCinematic}`}>
              <div className={styles.videoPlaceholder} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.dividerWrap} aria-hidden="true">
            <hr className={styles.heroDivider} />
          </div>

          <div className={`${styles.heroRow} ${styles.bottomRow}`}>
            <div className={`${styles.videoSlot} ${styles.videoCinematic}`}>
              <div className={styles.videoPlaceholder} aria-hidden="true" />
            </div>
            <div className={`${styles.wordClip} ${styles.fromLineDown}`}>
              <p ref={cineverseRef} className={styles.heroWord}>
                CINEVERSE
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
