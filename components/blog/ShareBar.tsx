"use client";

import { useCallback, useState, type ReactElement } from "react";
import styles from "./engage.module.css";

type Props = {
  url: string;
  title: string;
};

type ShareKind = "native" | "x" | "linkedin" | "whatsapp" | "copy";

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="18" cy="5" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="18" cy="19" r="2.6" fill="currentColor" stroke="none" />
      <path d="M8.5 13.1 15.5 17M15.5 7 8.5 10.9" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.3 3H20.2L13.7 10.4 21.4 21H15.6L10.9 14.7 5.5 21H2.6L9.6 13 2.2 3H8.1L12.3 8.7 17.3 3Zm-1 16.2h1.6L7.8 4.7H6.1L16.3 19.2Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M4.98 3.5A2.1 2.1 0 1 1 4.96 7.7 2.1 2.1 0 0 1 4.98 3.5ZM3.5 9.1h3V20.5h-3V9.1Zm5.4 0h2.88v1.56h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.8h-3v-6.03c0-1.44-.03-3.29-2-3.29-2 0-2.31 1.56-2.31 3.18v6.14h-3V9.1Z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2.4A9.55 9.55 0 0 0 2.5 11.9c0 1.7.45 3.3 1.3 4.7L2.4 21.6l5.1-1.34a9.5 9.5 0 0 0 4.54 1.15 9.55 9.55 0 0 0 0-19.01Zm0 17.45a7.9 7.9 0 0 1-4.02-.1l-.28-.12-2.98.78.8-2.9-.18-.3a7.9 7.9 0 1 1 6.66 2.64Zm4.35-5.9c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.5 6.5 0 0 1-1.9-1.18 7.2 7.2 0 0 1-1.33-1.64c-.14-.24 0-.37.1-.49l.35-.4c.12-.14.16-.24.24-.4s.04-.3 0-.42c-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2a3.5 3.5 0 0 0 .74 1.9 8.1 8.1 0 0 0 3.14 2.92c1.7.9 2.06.8 2.44.74.38-.06 1.22-.5 1.4-.98.16-.48.16-.9.12-.98-.06-.08-.22-.14-.46-.26Z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round">
      <path d="M10 13a5 5 0 0 0 7.07.07l1.9-1.9a5 5 0 0 0-7.07-7.07L10.7 5.3" />
      <path d="M14 11a5 5 0 0 0-7.07-.07l-1.9 1.9a5 5 0 0 0 7.07 7.07L13.3 18.7" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 13.2 9.4 17.5 19 7.5" />
    </svg>
  );
}

type ShareItem = {
  kind: ShareKind;
  label: string;
  tone: string;
  href?: (url: string, title: string) => string;
  Icon: () => ReactElement;
};

function shareItems(): ShareItem[] {
  return [
    { kind: "native", label: "Share", tone: styles.toneShare, Icon: IconShare },
    {
      kind: "x",
      label: "Post on X",
      tone: styles.toneX,
      href: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
      Icon: IconX
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      tone: styles.toneLinkedIn,
      href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
      Icon: IconLinkedIn
    },
    {
      kind: "whatsapp",
      label: "WhatsApp",
      tone: styles.toneWhatsApp,
      href: (u, t) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${t} ${u}`)}`,
      Icon: IconWhatsApp
    },
    { kind: "copy", label: "Copy link", tone: styles.toneCopy, Icon: IconLink }
  ];
}

export function ShareBar({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [pressed, setPressed] = useState<ShareKind | null>(null);
  const items = shareItems();

  const flash = useCallback((kind: ShareKind) => {
    setPressed(kind);
    window.setTimeout(() => setPressed(null), 320);
  }, []);

  const nativeShare = useCallback(async () => {
    flash("native");
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
    window.setTimeout(() => setCopied(false), 2200);
  }, [flash, title, url]);

  const copy = useCallback(async () => {
    flash("copy");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }, [flash, url]);

  return (
    <div className={styles.shareBar} aria-label="Share this article">
      <div className={styles.shareIntro}>
        <span className={styles.shareLabel}>Pass it on</span>
        <span className={styles.shareHint}>Share with your crew</span>
      </div>
      <div className={styles.shareDock} role="group">
        {items.map(({ kind, label, tone, href, Icon }) => {
          const isCopy = kind === "copy";
          const isNative = kind === "native";
          const className = [
            styles.shareOrb,
            tone,
            pressed === kind ? styles.shareOrbPressed : "",
            isCopy && copied ? styles.shareOrbDone : ""
          ]
            .filter(Boolean)
            .join(" ");

          const inner = (
            <>
              <span className={styles.shareOrbGlow} aria-hidden="true" />
              <span className={styles.shareOrbIcon}>
                {isCopy && copied ? <IconCheck /> : <Icon />}
              </span>
              <span className={styles.shareTooltip}>{isCopy && copied ? "Copied!" : label}</span>
            </>
          );

          if (isNative) {
            return (
              <button key={kind} type="button" className={className} onClick={() => void nativeShare()} aria-label={label}>
                {inner}
              </button>
            );
          }
          if (isCopy) {
            return (
              <button key={kind} type="button" className={className} onClick={() => void copy()} aria-label={label}>
                {inner}
              </button>
            );
          }
          return (
            <a
              key={kind}
              className={className}
              href={href?.(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={() => flash(kind)}
            >
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}
