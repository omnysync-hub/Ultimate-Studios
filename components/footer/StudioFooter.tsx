"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  footerReelSrc,
  studioContact,
  studioSocials
} from "@/lib/studio";
import { SocialIcon } from "./SocialIcon";
import styles from "./StudioFooter.module.css";

export function StudioFooter() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maskId = `us-footer-mask-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shell = root.querySelector<HTMLElement>("[data-footer-shell]");
    const bits = root.querySelectorAll<HTMLElement>("[data-footer-anim]");
    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    const wordSolid = root.querySelector<HTMLElement>("[data-word-solid]");
    const wordmark = root.querySelector<HTMLElement>("[data-wordmark]");
    const mark = root.querySelector<HTMLElement>(`.${styles.mark}`);

    const fitWordmark = () => {
      if (!wordSolid || !wordmark) return;
      const markW = mark?.offsetWidth ?? 0;
      const gap = 12;
      // italic glyphs hang past the box — leave a little air on the right
      const pad = 28;
      const available = Math.max(120, wordmark.clientWidth - markW - gap - pad);

      wordSolid.style.fontSize = "100px";
      const measured = Math.max(wordSolid.scrollWidth, 1);
      const next = Math.min(176, Math.max(36, (100 * available) / measured));
      wordSolid.style.fontSize = `${next}px`;
    };

    let fitRaf = 0;
    const scheduleFitWordmark = () => {
      cancelAnimationFrame(fitRaf);
      fitRaf = requestAnimationFrame(fitWordmark);
    };

    const ro = new ResizeObserver(() => scheduleFitWordmark());
    if (wordmark) ro.observe(wordmark);
    void document.fonts.ready.then(scheduleFitWordmark);
    scheduleFitWordmark();

    if (reduce) {
      gsap.set(shell, { clearProps: "all" });
      gsap.set(bits, { clearProps: "all", opacity: 1, y: 0 });
      gsap.set(letters, { clearProps: "all", opacity: 1, y: 0, yPercent: 0 });
      return () => ro.disconnect();
    }

    gsap.set(shell, {
      yPercent: 100,
      borderRadius: "2.5rem 2.5rem 0 0"
    });
    gsap.set(bits, { y: 28, opacity: 0 });
    gsap.set(letters, { yPercent: 115, opacity: 0, rotate: 6 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.55,
          invalidateOnRefresh: true,
          onRefresh: scheduleFitWordmark
        }
      });

      tl.to(
        shell,
        {
          yPercent: 0,
          borderRadius: "0px 0px 0px 0px",
          duration: 0.75,
          ease: "none",
          force3D: true
        },
        0
      );

      tl.to(
        bits,
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.04,
          ease: "none"
        },
        0.4
      );

      tl.to(
        letters,
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.4,
          stagger: 0.018,
          ease: "none"
        },
        0.48
      );

      ScrollTrigger.create({
        trigger: root,
        start: "bottom bottom",
        once: true,
        onEnter: () => {
          gsap.to(letters, {
            y: -3,
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: {
              each: 0.045,
              from: "start"
            }
          });
        }
      });
    }, root);

    return () => {
      cancelAnimationFrame(fitRaf);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  const playReel = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => undefined);
  };

  const pauseReel = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
  };

  return (
    <footer ref={rootRef} className={styles.root} aria-label="Site footer">
      <div className={styles.sticky}>
        <div className={styles.shell} data-footer-shell>
          <div className={styles.inner}>
            <div className={styles.topRow}>
              <div className={styles.col} data-footer-anim>
                <p className={styles.colLabel}>Get in touch:</p>
                <a className={styles.line} href={`tel:${studioContact.phone.replace(/\s/g, "")}`}>
                  {studioContact.phone}
                </a>
                <a className={`${styles.line} ${styles.underline}`} href={`mailto:${studioContact.email}`}>
                  {studioContact.email}
                </a>
              </div>

              <div className={styles.col} data-footer-anim>
                <p className={styles.colLabel}>Drop in:</p>
                {studioContact.addressLines.map((line) => (
                  <p key={line} className={styles.line}>
                    {line}
                  </p>
                ))}
              </div>

              <div className={styles.socialCol} data-footer-anim>
                <p className={styles.colLabel}>Follow:</p>
                <ul className={styles.socials}>
                  {studioSocials.map((s) => (
                    <li key={s.id}>
                      <a
                        className={styles.socialLink}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                      >
                        <SocialIcon id={s.id} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.brandRow}>
              <div
                className={styles.wordmark}
                data-wordmark
                role="group"
                aria-labelledby="footer-studio-name"
                tabIndex={0}
                onMouseEnter={playReel}
                onMouseLeave={pauseReel}
                onFocus={playReel}
                onBlur={pauseReel}
              >
                <span className={styles.wordClip}>
                  <span className={styles.wordSolid} data-word-solid aria-hidden="true">
                    {"ULTIMATE STUDIOS".split("").map((ch, i) => (
                      <span
                        key={`${ch}-${i}`}
                        className={ch === " " ? styles.wordSpace : styles.letter}
                        data-letter={ch === " " ? undefined : true}
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </span>
                    ))}
                  </span>
                </span>

                <svg
                  className={styles.wordSvg}
                  viewBox="0 0 1200 180"
                  preserveAspectRatio="xMinYMid meet"
                  aria-hidden="true"
                >
                  <defs>
                    <mask id={maskId} maskUnits="userSpaceOnUse">
                      <rect width="1200" height="180" fill="black" />
                      <text
                        x="8"
                        y="145"
                        fill="white"
                        className={styles.maskText}
                      >
                        ULTIMATE STUDIOS
                      </text>
                    </mask>
                  </defs>
                  <foreignObject
                    x="0"
                    y="0"
                    width="1200"
                    height="180"
                    mask={`url(#${maskId})`}
                  >
                    <div className={styles.foreignVideo}>
                      <video
                        ref={videoRef}
                        className={styles.wordVideo}
                        src={footerReelSrc}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        onError={(event) => {
                          event.currentTarget.removeAttribute("src");
                        }}
                      />
                    </div>
                  </foreignObject>
                </svg>

                <span id="footer-studio-name" className={styles.srOnly}>
                  Ultimate Studios
                </span>
                <span className={styles.mark} data-footer-anim aria-hidden="true">
                  <svg viewBox="0 0 40 40" className={styles.markSvg}>
                    <circle cx="20" cy="20" r="19" fill="#0a0a0a" />
                    <path
                      d="M20 8 L22.2 17.8 L32 20 L22.2 22.2 L20 32 L17.8 22.2 L8 20 L17.8 17.8 Z"
                      fill="#e10600"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className={styles.bottomRow} data-footer-anim>
              <p className={styles.legal}>
                © {new Date().getFullYear()} Ultimate Studios. All rights reserved.
                Content on this site is for presentation only unless otherwise noted.
              </p>
              <p className={styles.credit}>Built for the next cut.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
