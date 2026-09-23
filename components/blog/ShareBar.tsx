"use client";

import { useCallback, useState } from "react";
import styles from "./engage.module.css";

type Props = {
  url: string;
  title: string;
};

export function ShareBar({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const nativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [title, url]);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className={styles.shareBar} aria-label="Share this article">
      <span className={styles.shareLabel}>Share</span>
      <div className={styles.shareActions}>
        <button type="button" className={styles.shareBtn} onClick={() => void nativeShare()}>
          Share
        </button>
        <a
          className={styles.shareBtn}
          href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          X
        </a>
        <a
          className={styles.shareBtn}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          className={styles.shareBtn}
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <button type="button" className={styles.shareBtn} onClick={() => void copy()}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
