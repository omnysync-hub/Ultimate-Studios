"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  slot: string;
  format?: "auto" | string;
  className?: string;
  minHeight?: number;
};

function hasAdsConsent() {
  if (typeof document === "undefined") return false;
  try {
    return localStorage.getItem("adsConsent") === "true";
  } catch {
    return false;
  }
}

export function AdUnit({ slot, format = "auto", className, minHeight = 250 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [didInit, setDidInit] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasAdsConsent());
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (!allowed) return;
    if (didInit) return;

    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        if (anyVisible) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [allowed, didInit]);

  useEffect(() => {
    if (!allowed) return;
    if (!inView) return;
    if (didInit) return;
    if (!ref.current) return;

    try {
      // AdSense will fill the container for "display ads".
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adsbygoogle = (window as any).adsbygoogle || ((window as any).adsbygoogle = []);
      adsbygoogle.push({});
      setDidInit(true);
    } catch {
      // Keep silent in scaffold.
    }
  }, [allowed, inView, didInit]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: "100%",
        minHeight,
        display: "grid",
        placeItems: "center"
      }}
      aria-label="Advertisement"
    >
      {allowed ? (
        <ins
          style={{ display: "block", width: "100%", height: minHeight }}
          className="adsbygoogle"
          data-ad-client="ca-pub-XXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
        />
      ) : null}
    </div>
  );
}

