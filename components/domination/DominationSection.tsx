"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClosingStatements } from "./ClosingStatements";
import { DominationIntro } from "./DominationIntro";
import { StatsBento } from "./StatsBento";
import styles from "./DominationSection.module.css";

export function DominationSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const redFill = root.querySelector<HTMLElement>('[data-row-fill="red"]');
      const whiteFill = root.querySelector<HTMLElement>('[data-row-fill="white"]');
      const redText = root.querySelector<HTMLElement>('[data-row-text="red"]');
      const whiteText = root.querySelector<HTMLElement>('[data-row-text="white"]');
      const cards = root.querySelectorAll<HTMLElement>("[data-stat-card]");
      const closers = root.querySelectorAll<HTMLElement>("[data-closer] > span");
      const bridge = root.querySelector<HTMLElement>("[data-bridge]");

      if (reduce) {
        gsap.set([redFill, whiteFill, redText, whiteText, cards, closers, bridge], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          yPercent: 0,
          scaleX: 1,
          clipPath: "none"
        });
        root.querySelectorAll<HTMLElement>("[data-stat-value]").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const decimals = Number(el.dataset.decimals ?? 0);
          const format = el.dataset.format ?? "compact";
          if (format === "comma") {
            el.textContent = `${Math.round(target).toLocaleString("en-US")}${suffix}`;
          } else {
            el.textContent = `${decimals > 0 ? target.toFixed(decimals) : Math.round(target)}${suffix}`;
          }
        });
        return;
      }

      gsap.set(redFill, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(whiteFill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(redText, { yPercent: 110, opacity: 0 });
      gsap.set(whiteText, { yPercent: 110, opacity: 0 });
      gsap.set(cards, {
        y: 48,
        opacity: 0,
        scale: 0.94,
        rotateX: 8,
        transformPerspective: 900,
        clipPath: "inset(18% 10% 18% 10%)"
      });
      gsap.set(closers, { yPercent: 110, opacity: 0 });
      gsap.set(bridge, { scaleX: 0, opacity: 0.4 });

      const labels = root.querySelectorAll<HTMLElement>(`.${styles.cardLabel}`);
      const descs = root.querySelectorAll<HTMLElement>(`.${styles.cardDesc}`);
      gsap.set(labels, { y: 14, opacity: 0 });
      gsap.set(descs, { y: 10, opacity: 0 });

      const viewsPaths = root.querySelectorAll<SVGPathElement>("[data-views-path]");
      viewsPaths.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });

      // Decor bits start quiet
      gsap.set(root.querySelectorAll(`.${styles.platformChip}`), { y: 10, opacity: 0 });
      gsap.set(root.querySelectorAll(`.${styles.subBars} > span`), { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(root.querySelectorAll(`.${styles.viewBars} > span`), { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(root.querySelectorAll(`.${styles.timelineMark}`), { scaleY: 0, opacity: 0 });
      gsap.set(root.querySelectorAll(`.${styles.pulseDots} > span`), { scale: 0, opacity: 0 });
      gsap.set(root.querySelectorAll(`.${styles.metaChip}`), { opacity: 0, y: 8 });
      gsap.set(root.querySelectorAll(`.${styles.orbitRing}`), { scale: 0.7, opacity: 0 });
      gsap.set(root.querySelectorAll(`.${styles.svgBell}`), { y: -8, opacity: 0 });

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector("[data-dom-intro]"),
          start: "top 72%",
          once: true
        }
      });

      introTl
        .to(redFill, {
          scaleX: 1,
          duration: 0.85,
          ease: "power3.inOut"
        })
        .to(
          redText,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out"
          },
          "-=0.2"
        )
        .to(
          whiteFill,
          {
            scaleX: 1,
            duration: 0.85,
            ease: "power3.inOut"
          },
          "-=0.05"
        )
        .to(
          whiteText,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out"
          },
          "-=0.2"
        );

      const formatValue = (value: number, el: HTMLElement) => {
        const format = el.dataset.format ?? "compact";
        const decimals = Number(el.dataset.decimals ?? 0);
        const suffix = el.dataset.suffix ?? "";
        if (format === "comma") {
          return `${Math.round(value).toLocaleString("en-US")}${suffix}`;
        }
        const body = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
        return `${body}${suffix}`;
      };

      const countCard = (card: HTMLElement) => {
        const el = card.querySelector<HTMLElement>("[data-stat-value]");
        if (!el) return;
        const target = Number(el.dataset.target ?? 0);
        const isHero = card.dataset.stat === "views";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: isHero ? 2.2 : 1.7,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = formatValue(obj.v, el);
          }
        });
      };

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector("[data-bento]"),
          start: "top 86%",
          once: true
        }
      });

      cards.forEach((card, i) => {
        const t = i * 0.28;
        const label = card.querySelector<HTMLElement>(`.${styles.cardLabel}`);
        const desc = card.querySelector<HTMLElement>(`.${styles.cardDesc}`);
        const value = card.querySelector<HTMLElement>(`.${styles.cardValue}`);
        const decor = card.querySelector<HTMLElement>(`.${styles.decorLayer}`);

        cardTl.to(
          card,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.85,
            ease: "power3.out",
            onStart: () => countCard(card)
          },
          t
        );

        if (value) {
          cardTl.fromTo(
            value,
            { y: 20, opacity: 0.2 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
            t + 0.05
          );
        }
        if (label) {
          cardTl.to(label, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }, t + 0.18);
        }
        if (desc) {
          cardTl.to(desc, { y: 0, opacity: 0.72, duration: 0.6, ease: "power2.out" }, t + 0.26);
        }
        if (decor) {
          cardTl.fromTo(
            decor,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            t + 0.12
          );
        }

        // Per-card accent animations
        if (card.dataset.stat === "followers") {
          cardTl.to(
            card.querySelectorAll(`.${styles.platformChip}`),
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" },
            t + 0.25
          );
          cardTl.to(
            card.querySelector(`.${styles.orbitRing}`),
            { scale: 1, opacity: 0.45, duration: 0.8, ease: "power2.out" },
            t + 0.2
          );
        }

        if (card.dataset.stat === "subscribers") {
          cardTl.to(
            card.querySelectorAll(`.${styles.subBars} > span`),
            { scaleY: 1, duration: 0.65, stagger: 0.04, ease: "power2.out" },
            t + 0.22
          );
          cardTl.to(
            card.querySelector(`.${styles.svgBell}`),
            { y: 0, opacity: 0.7, duration: 0.55, ease: "back.out(1.6)" },
            t + 0.3
          );
        }

        if (card.dataset.stat === "videos") {
          cardTl.to(
            card.querySelectorAll(`.${styles.timelineMark}`),
            { scaleY: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "power2.out" },
            t + 0.22
          );
          cardTl.to(
            card.querySelector(`.${styles.metaChip}`),
            { opacity: 0.55, y: 0, duration: 0.5, ease: "power2.out" },
            t + 0.3
          );
        }

        if (card.dataset.stat === "views") {
          cardTl.to(
            viewsPaths,
            { strokeDashoffset: 0, duration: 1.5, ease: "power1.out" },
            t + 0.15
          );
          cardTl.to(
            card.querySelectorAll(`.${styles.viewBars} > span`),
            { scaleY: 1, duration: 0.7, stagger: 0.035, ease: "power2.out" },
            t + 0.2
          );
          cardTl.to(
            card.querySelectorAll(`.${styles.pulseDots} > span`),
            { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
            t + 0.35
          );
          cardTl.to(
            card.querySelector(`.${styles.metaChip}`),
            { opacity: 0.55, y: 0, duration: 0.5, ease: "power2.out" },
            t + 0.28
          );
          if (value) {
            cardTl.fromTo(value, { scale: 0.92 }, { scale: 1, duration: 1, ease: "power2.out" }, t + 0.1);
          }
        }
      });

      closers.forEach((el) => {
        gsap.to(el, {
          yPercent: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top 88%",
            end: "top 55%",
            scrub: 0.55
          }
        });
      });

      if (bridge) {
        gsap.to(bridge, {
          scaleX: 1,
          opacity: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: bridge,
            start: "top 95%",
            end: "top 70%",
            scrub: 0.4
          }
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={styles.section}
      aria-labelledby="dominating-heading"
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.grain} />
      </div>

      <DominationIntro />
      <StatsBento />
      <ClosingStatements />

      <div className={styles.bridge} data-bridge aria-hidden="true" />
    </section>
  );
}
