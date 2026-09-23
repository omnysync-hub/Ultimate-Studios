"use client";

import { useCallback, useState } from "react";
import styles from "./engage.module.css";

type Props = {
  url: string;
  title: string;
};

function IconShare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.4 13.2 15.6 17.3M15.6 6.7 8.4 10.8" strokeLinecap="round" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.3 3H20.2L13.7 10.4 21.4 21H15.6L10.9 14.7 5.5 21H2.6L9.6 13 2.2 3H8.1L12.3 8.7 17.3 3Zm-1 16.2h1.6L7.8 4.7H6.1L16.3 19.2Z" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M6.2 9.2H3.5V20.5H6.2V9.2ZM4.85 3.5A1.6 1.6 0 1 0 4.86 6.7 1.6 1.6 0 0 0 4.85 3.5ZM20.5 20.5H17.8V14.7C17.8 13.1 17.8 11.1 15.6 11.1S13.2 13 13.2 14.6V20.5H10.5V9.2H13.1V10.7H13.1C13.5 10 14.5 9 16.4 9 20.3 9 20.5 11.5 20.5 14.2V20.5Z" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2.5A9.45 9.45 0 0 0 2.6 11.9a9.3 9.3 0 0 0 1.3 4.8L2.5 21.5l5-1.3a9.5 9.5 0 0 0 4.5 1.1 9.45 9.45 0 0 0 0-18.9Zm0 17.3a7.8 7.8 0 0 1-4-.1l-.3-.1-3 .8.8-2.9-.2-.3a7.8 7.8 0 1 1 6.7 2.6Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.4 6.4 0 0 1-1.9-1.2 7.1 7.1 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4.1-.3c0-.1 0-.3 0-.4s-.5-1.2-.7-1.6-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.9 8 8 0 0 0 3.1 2.9 10.4 10.4 0 0 0 2 .8 2.4 2.4 0 0 0 1.7-.5 2.8 2.8 0 0 0 .8-1.7c0-.1 0-.2-.1-.3Z" />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" strokeLinecap="round" />
    </svg>
  );
}

export function ShareBar({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const nativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelled */
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
        <button type="button" className={styles.shareChip} onClick={() => void nativeShare()} title="Share">
          <IconShare className={styles.shareIcon} />
          <span>Share</span>
        </button>
        <a
          className={styles.shareChip}
          href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X"
        >
          <IconX className={styles.shareIcon} />
          <span className={styles.shareChipText}>X</span>
        </a>
        <a
          className={styles.shareChip}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
        >
          <IconLinkedIn className={styles.shareIcon} />
          <span className={styles.shareChipText}>LinkedIn</span>
        </a>
        <a
          className={styles.shareChip}
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
        >
          <IconWhatsApp className={styles.shareIcon} />
          <span className={styles.shareChipText}>WhatsApp</span>
        </a>
        <button
          type="button"
          className={`${styles.shareChip} ${copied ? styles.shareChipDone : ""}`}
          onClick={() => void copy()}
          title="Copy link"
        >
          <IconLink className={styles.shareIcon} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
