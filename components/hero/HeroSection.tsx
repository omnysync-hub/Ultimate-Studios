"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

const HERO_VIDEOS = {
  top: "/hero/top.mp4",
  bottom: "/hero/bottom.mp4"
} as const;

/** Muted looping hero clip — mounts source only when visible + motion allowed. */
function HeroLoopVideo({
  src,
  active
}: {
  src: string;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!active) return;
    const frame = frameRef.current;
    if (!frame) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "80px", threshold: 0.05 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;
    el.muted = true;
    const play = () => {
      void el.play().catch(() => {
        /* autoplay can still be blocked; muted+playsInline covers most cases */
      });
    };
    if (el.readyState >= 2) {
      play();
      return;
    }
    el.addEventListener("loadeddata", play, { once: true });
    return () => el.removeEventListener("loadeddata", play);
  }, [shouldLoad]);

  return (
    <div ref={frameRef} className={styles.videoFrame} aria-hidden="true">
      <div className={styles.videoPlaceholder} />
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted
        loop
        playsInline
        autoPlay={shouldLoad}
        preload={shouldLoad ? "metadata" : "none"}
        src={shouldLoad ? src : undefined}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
      />
    </div>
  );
}

/** Size hero words to fill available width; on mobile each word fills the row. */
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

    const fitOne = (el: HTMLElement, maxW: number, maxH: number) => {
      let lo = 18;
      let hi = Math.floor(maxH);
      let best = lo;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;
        const fits = el.scrollWidth <= maxW + 1 && el.scrollHeight <= maxH + 4;
        if (fits) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      el.style.fontSize = `${best}px`;
    };

    const fit = () => {
      const row = ultimate.closest(`.${styles.heroRow}`) as HTMLElement | null;
      if (!row) return;

      const gap = parseFloat(getComputedStyle(row).gap) || 0;
      const stacked = getComputedStyle(row).flexDirection === "column";
      const rowW = row.clientWidth;
      if (rowW < 8) return;

      if (stacked) {
        const maxW = Math.max(40, rowW);
        const maxH = Math.min(window.innerHeight * 0.22, 180);
        fitOne(ultimate, maxW, maxH);
        fitOne(cineverse, maxW, maxH);
      } else {
        const minVideo = rowW * 0.3;
        const maxW = Math.max(40, rowW - minVideo - gap);
        const maxH = Math.min(
          window.innerHeight * 0.42,
          (row.parentElement?.clientHeight ?? window.innerHeight) * 0.46
        );
        if (maxH < 8) return;
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
      }

      if (!readyFired) {
        readyFired = true;
        setReady(true);
      }
    };

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
              <HeroLoopVideo src={HERO_VIDEOS.top} active={ready} />
            </div>
          </div>

          <div className={styles.dividerWrap} aria-hidden="true">
            <hr className={styles.heroDivider} />
          </div>

          <div className={`${styles.heroRow} ${styles.bottomRow}`}>
            <div className={`${styles.videoSlot} ${styles.videoCinematic}`}>
              <HeroLoopVideo src={HERO_VIDEOS.bottom} active={ready} />
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
