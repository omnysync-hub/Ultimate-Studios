"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_CHANGED_EVENT, hasAdsConsent } from "@/lib/consent";

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

export function AdUnit({ slot, format = "auto", className, minHeight = 250 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [didInit, setDidInit] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAdsConsent());
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!ref.current || !allowed || didInit) return;

    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
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
    if (!allowed || !inView || didInit || !ref.current) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adsbygoogle = (window as any).adsbygoogle || ((window as any).adsbygoogle = []);
      adsbygoogle.push({});
      setDidInit(true);
    } catch {
      // Keep silent if AdSense is not ready.
    }
  }, [allowed, inView, didInit]);

  return (
    <div
      ref={ref}
      className={className}
      role="region"
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
