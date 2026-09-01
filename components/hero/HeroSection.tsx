"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./HeroSection.module.css";

function useFitHeroType(
  ultimateRef: React.RefObject<HTMLElement | null>,
  studiosRef: React.RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    const ultimate = ultimateRef.current;
    const studios = studiosRef.current;
    if (!ultimate || !studios) return;

    const fit = () => {
      const row = ultimate.parentElement?.parentElement;
      if (!row) return;

      const maxW = row.clientWidth * 0.58;
      const maxH = Math.min(window.innerHeight * 0.4, row.parentElement?.clientHeight ?? 9999);
      if (maxW < 8 || maxH < 8) return;

      let lo = 24;
      let hi = Math.floor(maxH);
      let best = lo;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        ultimate.style.fontSize = `${mid}px`;
        const fits = ultimate.scrollWidth <= maxW + 1 && ultimate.scrollHeight <= maxH + 2;
        if (fits) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      ultimate.style.fontSize = `${best}px`;
      studios.style.fontSize = `${best}px`;
    };

    let fitRaf = 0;
    const scheduleFit = () => {
      cancelAnimationFrame(fitRaf);
      fitRaf = requestAnimationFrame(fit);
    };

    scheduleFit();
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
  }, [ultimateRef, studiosRef]);
}

export function HeroSection() {
  const ultimateRef = useRef<HTMLParagraphElement>(null);
  const studiosRef = useRef<HTMLParagraphElement>(null);

  useFitHeroType(ultimateRef, studiosRef);

  return (
    <div className={styles.pageWrap}>
      <main className={styles.heroPage}>
        <h1 className={styles.srOnly}>Ultimate Studios</h1>

        <section className={`${styles.hero} ${styles.revealed}`}>
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
              <p ref={studiosRef} className={styles.heroWord}>
                STUDIOS
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
