"use client";

import { useEffect, useId, useState } from "react";
import {
  DEFAULT_CONSENT,
  OPEN_CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentPreferences
} from "@/lib/consent";
import styles from "./CookieConsent.module.css";

type Panel = "banner" | "prefs" | "hidden";

export function CookieConsent() {
  const titleId = useId();
  const [panel, setPanel] = useState<Panel>("hidden");
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setAds(existing.ads);
      setPanel("hidden");
    } else {
      setPanel("banner");
    }

    const onOpen = () => {
      const current = readConsent() ?? DEFAULT_CONSENT;
      setAnalytics(current.analytics);
      setAds(current.ads);
      setPanel("prefs");
    };

    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  function save(next: Pick<ConsentPreferences, "analytics" | "ads">) {
    writeConsent(next);
    setAnalytics(next.analytics);
    setAds(next.ads);
    setPanel("hidden");
  }

  if (panel === "hidden") return null;

  return (
    <div className={styles.root} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={styles.panel}>
        {panel === "banner" ? (
          <>
            <h2 id={titleId} className={styles.title}>
              Cookies &amp; privacy
            </h2>
            <p className={styles.copy}>
              We use necessary cookies to run this site. With your permission we also use analytics
              (Google Analytics 4) and, on blog pages only, advertising cookies (Google AdSense).
              You can change your mind anytime via Manage cookies.
            </p>
            <p className={styles.links}>
              <a href="/privacy">Privacy</a>
              <span aria-hidden="true">·</span>
              <a href="/cookies">Cookies</a>
              <span aria-hidden="true">·</span>
              <a href="/terms">Terms</a>
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.secondary} onClick={() => setPanel("prefs")}>
                Customize
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => save({ analytics: false, ads: false })}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className={styles.primary}
                onClick={() => save({ analytics: true, ads: true })}
              >
                Accept all
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id={titleId} className={styles.title}>
              Cookie preferences
            </h2>
            <p className={styles.copy}>
              Necessary cookies are always on. Choose whether analytics and advertising cookies may
              run. Advertising only appears on <strong>/blog</strong> pages.
            </p>

            <ul className={styles.prefs}>
              <li className={styles.pref}>
                <div>
                  <p className={styles.prefTitle}>Necessary</p>
                  <p className={styles.prefDesc}>Security, consent storage, basic site function.</p>
                </div>
                <span className={styles.always}>Always on</span>
              </li>
              <li className={styles.pref}>
                <div>
                  <p className={styles.prefTitle}>Analytics</p>
                  <p className={styles.prefDesc}>Google Analytics 4 — traffic and performance insights.</p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span className={styles.srOnly}>Enable analytics cookies</span>
                </label>
              </li>
              <li className={styles.pref}>
                <div>
                  <p className={styles.prefTitle}>Advertising</p>
                  <p className={styles.prefDesc}>Google AdSense — personalized or non-personalized ads on blog pages.</p>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} />
                  <span className={styles.srOnly}>Enable advertising cookies</span>
                </label>
              </li>
            </ul>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => save({ analytics: false, ads: false })}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className={styles.primary}
                onClick={() => save({ analytics, ads })}
              >
                Save preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
