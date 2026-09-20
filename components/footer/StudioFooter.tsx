"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { loadGsap } from "@/lib/gsap";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { openCookiePreferences } from "@/lib/consent";
import { CineverseLogoMark } from "./CineverseLogoMark";
import { SocialIcon } from "./SocialIcon";
import styles from "./StudioFooter.module.css";

type Props = {
  contact: {
    phone: string;
    email: string;
    addressLines: string[];
  };
  socials: Array<{ id: string; label: string; href: string }>;
  footerReelSrc?: string;
};

export function StudioFooter({ socials }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const inView = useInViewOnce(rootRef, "20% 0px");

  useLayoutEffect(() => {
    if (!inView) return;

    const root = rootRef.current;
    if (!root) return;

    const paths = Array.from(root.querySelectorAll<SVGPathElement>(".trace-shape"));
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled || !root.isConnected) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        paths.forEach((path) => {
          path.style.strokeDasharray = "none";
          path.style.strokeDashoffset = "0";
          path.style.fillOpacity = "1";
        });
        return;
      }

      const lengths = paths.map((path) => path.getTotalLength());

      paths.forEach((path, i) => {
        gsap.set(path, {
          strokeDasharray: lengths[i],
          strokeDashoffset: lengths[i],
          fillOpacity: 0
        });
      });

      // No pin / no scrub — pinSpacing at page end was fighting scroll-up.
      ctx = gsap.context(() => {
        const logoTl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.3
        });

        logoTl.fromTo(
          paths,
          {
            strokeDashoffset: (i: number) => lengths[i] ?? 0,
            fillOpacity: 0
          },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
            stagger: 0.03
          }
        );

        logoTl.to(
          paths,
          {
            fillOpacity: 1,
            duration: 0.7,
            ease: "power1.out",
            stagger: 0.02
          },
          "-=0.4"
        );

        logoTl.to({}, { duration: 1.5 });

        logoTl.to(paths, {
          fillOpacity: 0,
          duration: 0.6,
          ease: "power1.in",
          stagger: 0.015
        });

        logoTl.to(
          paths,
          {
            strokeDashoffset: (i: number) => -(lengths[i] ?? 0),
            duration: 1.1,
            ease: "power2.inOut",
            stagger: 0.025
          },
          "-=0.2"
        );
      }, root);
    });

    return () => {
      cancelled = true;
      try {
        ctx?.revert();
      } catch {
        /* HMR */
      }
      ctx = null;
    };
  }, [inView]);

  return (
    <footer ref={rootRef} className={styles.root} aria-label="Site footer">
      <div className={styles.shell}>
        <div className={styles.logoBleed}>
          <div className={styles.logoWrapper}>
            <CineverseLogoMark className={styles.logoMark} />
            <span className={styles.srOnly}>Ultimate Cineverse</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legalBlock}>
            <p className={styles.legal}>
              © {new Date().getFullYear()} Ultimate Cineverse. All rights reserved.
            </p>
            <nav className={styles.legalNav} aria-label="Legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/cookies">Cookies</Link>
              <Link href="/terms">Terms</Link>
              <button
                type="button"
                className={styles.legalButton}
                onClick={() => openCookiePreferences()}
              >
                Manage cookies
              </button>
            </nav>
          </div>

          <div className={styles.end}>
            {socials.length > 0 ? (
              <ul className={styles.socials} aria-label="Social links">
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
            ) : null}

            <a
              className={styles.omny}
              href="https://omnysync.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built by OmnySync
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
