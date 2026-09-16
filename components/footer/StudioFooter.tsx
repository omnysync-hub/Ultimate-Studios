"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { loadGsap } from "@/lib/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { openCookiePreferences } from "@/lib/consent";
import { SocialIcon } from "./SocialIcon";
import styles from "./StudioFooter.module.css";

/**
 * Wordmark stretch: grows from the legal strip up to just under contact/socials.
 * Footer is pin-scrubbed so the page dead-ends here (no scroll past).
 */
const VB = { w: 2400, h: 400 };
const WORDMARK = "ULTIMATE CINEVERSE";

type Props = {
  contact: {
    phone: string;
    email: string;
    addressLines: string[];
  };
  socials: Array<{ id: string; label: string; href: string }>;
  footerReelSrc?: string;
};

export function StudioFooter({ contact, socials }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const inView = useInViewOnce(rootRef, "50% 0px");

  useEffect(() => {
    if (!inView) return;

    const root = rootRef.current;
    if (!root) return;

    const shell = root.querySelector<HTMLElement>("[data-footer-shell]");
    const bits = root.querySelectorAll<HTMLElement>("[data-footer-anim]");
    const stretchInstance = root.querySelector<HTMLElement>("[data-logo-stretch-instance]");

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !root || !stretchInstance) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(shell, { clearProps: "all" });
        gsap.set(bits, { clearProps: "all", opacity: 1, y: 0 });
        gsap.set(stretchInstance, { height: "100%" });
        return;
      }

      gsap.set(shell, {
        yPercent: 100,
        borderRadius: "2.5rem 2.5rem 0 0"
      });
      gsap.set(bits, { y: 18, opacity: 0 });
      gsap.set(stretchInstance, {
        height: "0%",
        transformOrigin: "bottom center"
      });

      ctx = gsap.context(() => {
        // 1) Rise into view as the footer enters (not pinned yet)
        const enter = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "top top",
            scrub: 0.05,
            invalidateOnRefresh: true
          }
        });

        enter.to(
          shell,
          {
            yPercent: 0,
            borderRadius: "0px",
            ease: "none",
            force3D: true
          },
          0
        );

        enter.to(
          bits,
          {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            ease: "none"
          },
          0.35
        );

        // 2) Pin — stretch wordmark from bottom up until it meets the contact/socials row
        const hold = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=120%",
            pin: true,
            pinSpacing: true,
            scrub: 0.05,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        hold.fromTo(
          stretchInstance,
          {
            height: "0%",
            transformOrigin: "bottom center"
          },
          {
            height: "100%",
            duration: 0.85,
            ease: "none"
          },
          0
        );

        hold.to({}, { duration: 0.15 }, 0.85);
      }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [inView]);

  const mark = (stretch: boolean) => (
    <svg
      className={styles.logoSvg}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      width="100%"
      height="100%"
      preserveAspectRatio={stretch ? "none" : "xMinYMid meet"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text x="0" y={VB.h * 0.9} className={styles.logoText}>
        {WORDMARK}
      </text>
    </svg>
  );

  return (
    <footer ref={rootRef} className={styles.root} aria-label="Site footer">
      <div className={styles.viewport}>
        <div className={styles.shell} data-footer-shell>
          <div className={styles.top} data-footer-top>
            <div className={styles.col} data-footer-anim>
              <p className={styles.colLabel}>Get in touch:</p>
              {contact.phone ? (
                <a className={styles.line} href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  {contact.phone}
                </a>
              ) : null}
              <a className={`${styles.line} ${styles.underline}`} href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>

            {contact.addressLines.length > 0 ? (
              <div className={styles.col} data-footer-anim>
                <p className={styles.colLabel}>Drop in:</p>
                {contact.addressLines.map((line) => (
                  <p key={line} className={styles.line}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className={styles.col} data-footer-anim>
                <p className={styles.colLabel}>Start a project:</p>
                <a className={`${styles.line} ${styles.underline}`} href="/contact">
                  Contact form
                </a>
              </div>
            )}

            <div className={styles.socialCol} data-footer-anim>
              <p className={styles.colLabel}>Follow:</p>
              <ul className={styles.socials}>
                {socials.map((s) => (
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

          <div className={styles.logoBleed}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoFill} aria-hidden="true">
                <div className={styles.logoInstance}>{mark(false)}</div>
              </div>
              <div className={styles.logoStretch} aria-hidden="true">
                <div className={styles.logoInstance} data-logo-stretch-instance>
                  {mark(true)}
                </div>
              </div>
              <span className={styles.srOnly}>Ultimate Cineverse</span>
            </div>
          </div>

          <div className={styles.bottom} data-footer-anim>
            <div className={styles.legalBlock}>
              <p className={styles.legal}>
                © {new Date().getFullYear()} Ultimate Cineverse. All rights reserved.
              </p>
              <nav className={styles.legalNav} aria-label="Legal">
                <Link href="/privacy">Privacy</Link>
                <Link href="/cookies">Cookies</Link>
                <Link href="/terms">Terms</Link>
                <button type="button" className={styles.legalButton} onClick={() => openCookiePreferences()}>
                  Manage cookies
                </button>
              </nav>
            </div>
            <p className={styles.credit}>Built for the next cut.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
